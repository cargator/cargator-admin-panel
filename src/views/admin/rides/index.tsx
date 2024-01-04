import { useEffect, useRef, useState } from "react";
import ColumnsTable from "./components/ColumnsTable";
import { useNavigate } from "react-router-dom";
import {
  getAllRidesApi,
  getCurrentRidesApi,
  getRidesByFilterApi,
  searchRidesApi,
} from "../../../services/customAPI";
import ReactPaginate from "react-paginate";
import "./rides.css";
import Loader from "components/loader/loader";
import { statusOptions } from "utils/constants";
import Navbar from "components/navbar";

const Rides = () => {
  const currentPage = useRef<number>();
  const [allRideData, setAllRideData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [rideStatus, setRideStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const firstRender = useRef(true);
  const [pageItemStartNumber, setPageItemStartNumber] = useState<any>(0);
  const [pageItemEndNumber, setPageItemEndNumber] = useState<any>(0);

  const setPageItemRange = (currPageNumber: number, maxItemRange: number) => {
    let startNumber = currPageNumber * limit - limit + 1;
    if (startNumber < 0) {
      startNumber = 0;
    }
    setPageItemStartNumber(
      startNumber.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })
    );

    const endNumber = currPageNumber * limit;
    setPageItemEndNumber(
      Math.min(endNumber, maxItemRange).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })
    );
  };

  function convertUtcToIst(utcTimeStr: string) {
    const utcDate = new Date(utcTimeStr);
    const istOffsetMinutes = 330; // IST offset in minutes (UTC+5:30)

    const istTime = new Date(utcDate.getTime() + istOffsetMinutes * 60 * 1000);
    return istTime.toISOString(); // Return in ISO format
  }

  async function convertToUsableRideArray(rideArray: any) {
    console.log("ridearray",rideArray)
    const res = rideArray.map((ride:any) => {
      let dateTime = convertUtcToIst(ride.createdAt);
      return {
        bookingDate: dateTime.substring(0, 10),
        bookingTime: dateTime.substring(11, 16),
        riderMobileNum: ride?.riderDetails[0]?.mobileNumber
          ? ride?.riderDetails[0]?.mobileNumber
          : "N/A",
        DriverMobileNum: ride?.driverDetails[0]?.mobileNumber
          ? ride?.driverDetails[0]?.mobileNumber
          : "N/A",
        fare: ride.fare,
        status: ride.status,
        origin: ride.pickUpAddress,
        destination: ride.dropAddress,
        view: ride._id,
      };
    });

    return res;
  }

  const getAllRides = async () => {
    try {
      setLoading(true);
      const response:any = await getAllRidesApi({
        page: currentPage.current,
        limit: limit,
      });
      setPageCount(Math.ceil(response?.data[0].count[0]?.totalcount / limit));
      setAllRideData(await convertToUsableRideArray(response?.data[0].data));
      setPageItemRange(currentPage.current, response?.data[0].count[0]?.totalcount);
    } catch (error) {
      console.log(`get-all-rides >> error :>> `, error);
    } finally {
      setLoading(false);
    }
  };

  const handleRideStatusSelect = async (status: string) => {
    try {
      setLoading(true);
      let response:any;

      if (status === "all") {
        response = await getAllRidesApi({
          page: currentPage.current,
          limit: limit,
        });
      } else if (status === "current-rides") {
        response = await getCurrentRidesApi({
          page: currentPage.current,
          limit: limit,
        });
      } else {
        const filter = status ;
        response = await getRidesByFilterApi({
          page: currentPage.current,
          limit: limit,
          filter: filter
        });
      }
      setPageCount(Math.ceil(response?.data[0].count[0]?.totalcount / limit));
      setAllRideData(await convertToUsableRideArray(response?.data[0].data));
      setPageItemRange(currentPage.current, response?.data[0].count[0]?.totalcount);     
    } catch (error) {
      console.log(`handleRideStatusSelect error :>> `, error);
    } finally {
      setLoading(false);
    }
  };

  const searchRides = async () => {
    try {
      setLoading(true);
      const response: any = await searchRidesApi({
        page: currentPage.current,
        limit: limit,
        query: searchText.trim(),
      });
      return response;
    } catch (error: any) {
      console.log(error.response.data.success);
      setAllRideData([]);
      setPageCount(1);
      setLoading(false);
    } finally {
      setLoading(false)
    }
  };

  const searchRideFunction = async () => {
    const response: any = await searchRides();
    if (!response) {
      return;
    }
    setPageCount(Math.ceil(response?.data[0].count[0]?.totalcount / limit));
    setAllRideData(await convertToUsableRideArray(response?.data[0].data));
    setPageItemRange(currentPage.current, response?.data[0].count[0]?.totalcount);
    setLoading(false);
  };

  const handleSearchSubmit = async (e: any) => {
    e.preventDefault();
    // if (searchText.trim() == "") {
      //   setNoData(true);
      //   return;
      // }
      // currentPage.current = 1;
      searchRideFunction();
      setLoading(false);
  };

  async function handlePageClick(event: any) {
    currentPage.current = event.selected + 1;
    if (searchText !== "") {
      searchRideFunction();
    } else {
      await handleRideStatusSelect(rideStatus);
    }
  }

  useEffect(() => {
    currentPage.current = 1;
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      handleRideStatusSelect(rideStatus);
    }
  }, [rideStatus]);

  useEffect(() => {
    if (searchText.trim() == "") {
      setLoading(true);
      // setSearchData([]);
      setPageCount(Math.ceil(allRideData.length / limit));
      if (allRideData.length === 0) {
        setPageItemRange(0, allRideData.length);
      } else {
        currentPage.current = 1;
        setPageItemRange(currentPage.current, allRideData.length);
      }
      setLoading(false);
    }
  }, [searchText]);

  useEffect(() => {
    currentPage.current = 1;
    getAllRides();
  }, []);

  return (
    <div>
      <Navbar
        flag={true}
        brandText="rides"
        handleSearch={(e: React.SyntheticEvent<EventTarget>) =>
          handleSearchSubmit(e)
        }
        setSearchText={setSearchText}
      />
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* {!noData ? (
        <Card extra={" m-4 w-full p-4 h-full"}>
          <div className="m-4 text-center">
            <h2 style={{ fontSize: "30px" }}>No Results !</h2>
          </div>
        </Card>
      ) : ( */}
          <>
            <div className="mt-4">
              {/* {paginatedRides.length > 0 && ( */}
              <ColumnsTable
                tableData={allRideData}
                statusOptions={statusOptions}
                setRideStatus={setRideStatus}
                rideStatus={rideStatus}
              />
              {/* )} */}

              <div
                className="mx-2 "
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: "#5E6278",
                }}
              >
                <h5>
                  {pageItemStartNumber} - {pageItemEndNumber}
                </h5>
                <div style={{ marginTop: "1rem" }}>
                  <ReactPaginate
                    breakLabel=" .  .  . "
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={pageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                    marginPagesDisplayed={2}
                    containerClassName="pagination"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="previous-page-btn"
                    previousLinkClassName="page-link"
                    nextClassName="next-page-btn"
                    nextLinkClassName="page-link"
                    activeClassName="active"
                    forcePage={currentPage.current - 1}
                  />
                </div>
              </div>
            </div>
          </>
          {/* )} */}
        </>
      )}
    </div>
  );
};

export default Rides;
