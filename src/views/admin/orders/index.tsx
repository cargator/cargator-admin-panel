import { useEffect, useRef, useState } from "react";
import Navbar from "components/navbar";
import { findOrders } from "services/customAPI";
import Loader from "components/loader/loader";
import { orderStatusOptions } from "utils/constants";
import { useLocation } from "react-router-dom";
import ColumnsTable from "../rides/components/ColumnsTable";
import ReactPaginate from "react-paginate";

function Orders() {
  const location = useLocation();
  const data = new URLSearchParams(location.search).get("data");
  const displayValue =
    data === "completed"
      ? "completed"
      : data === "ongoing-rides"
      ? "current-rides"
      : "all";

  const [loading, setLoading] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const currentPage = useRef<number>();
  const [pageCount, setPageCount] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [limit, setLimit] = useState(10);
  const [orderStatus, setOrderStatus] = useState<string>(displayValue);
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

  function convertToOrders(orders: any) {
    const response = orders.map((order: any) => {
      let dateTime = convertUtcToIst(order.createdAt);
      return {
        bookingDate: dateTime.substring(0, 10),
        bookingTime: dateTime.substring(11, 16),
        riderMobileNum: order?.riderDetails[0]?.mobileNumber
          ? order?.riderDetails[0]?.mobileNumber
          : "N/A",
        DriverMobileNum: order?.driverDetails[0]?.mobileNumber
          ? order?.driverDetails[0]?.mobileNumber
          : "N/A",
        fare: order.fare,
        platform: order.platform,
        status: order.status,
        origin: order.pickUpAddress,
        destination: order.dropAddress,
        view: order._id,
      };
    });
    return response;
  }

  const searchOrders = async () => {
    try {
      setLoading(true);
      const response: any = await findOrders({
        page: currentPage.current,
        limit: limit,
        query: searchText.trim(),
      });
      console.log("response ===>", response);

      return response;
    } catch (error: any) {
      console.log(error.response.data.success);
      setAllOrders([]);
      setPageCount(1);
      setLoading(false);
    }
    setLoading(false);
  };

  async function getAllOrders(
    page: number,
    limit: number,
    filter: any = undefined
  ) {
    try {
      setLoading(true);
      const response: any = await findOrders({
        page: page,
        limit: limit,
        query: searchText.trim(),
      });
      console.log("RESPONSE", response);

      return response;
    } catch (error: any) {
      console.log(error.response.data.success);
      setAllOrders([]);
      setPageCount(1);
    }
    setLoading(false);
  }

  const handleOrderStatusSelect = async (status: string) => {
    console.log("status", status);
    try {
      // setLoading(true);
      let response: any;

      if (status === "all") {
        response = await getAllOrders(currentPage.current, limit);
      } else if (status === "current-rides") {
        response = await getAllOrders(currentPage.current, limit);
      } else {
        const filter = status;
        response = await getAllOrders(currentPage.current, limit, filter);
      }
      setPageCount(Math.ceil(response?.data[0].count[0]?.totalcount / limit));
      // setAllOrders(await convertToOrders(response?.data[0].orders));
      setAllOrders([]);
      setPageItemRange(
        currentPage.current,
        response?.data[0].count[0]?.totalcount
      );
    } catch (error) {
      console.log(`handleRideStatusSelect error :>> `, error);
    }
    setLoading(false);
  };

  const searchOrderFn = async () => {
    console.log("log in search fn");

    const response: any = await searchOrders();
    if (!response) {
      return;
    }
    setPageCount(Math.ceil(response?.data[0].count[0]?.totalcount / limit));
    // setAllOrders(await convertToOrders(response?.data[0].data));
    setAllOrders([]);
    setPageItemRange(
      currentPage.current,
      response?.data[0].count[0]?.totalcount
    );
    setLoading(false);
  };

  const handleSearchSubmit = async (e: any) => {
    e.preventDefault();
    searchOrderFn();
    setLoading(false);
  };

  async function handlePageClick(event: any) {
    currentPage.current = event.selected + 1;
    if (searchText !== "") {
      searchOrderFn();
    } else {
      await handleOrderStatusSelect(orderStatus);
    }
  }

  useEffect(() => {
    currentPage.current = 1;
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      handleOrderStatusSelect(orderStatus);
    }
  }, [orderStatus]);

  useEffect(() => {
    if (searchText.trim() == "") {
      // setLoading(true);
      setPageCount(Math.ceil(allOrders.length / limit));
      if (allOrders.length === 0) {
        setPageItemRange(0, allOrders.length);
      } else {
        currentPage.current = 1;
        setPageItemRange(currentPage.current, allOrders.length);
      }
      // setLoading(false);
    }
  }, [searchText]);

  useEffect(() => {
    currentPage.current = 1;
    if (orderStatus === "completed") {
      handleOrderStatusSelect(orderStatus);
    } else if (orderStatus === "current-rides") {
      handleOrderStatusSelect(orderStatus);
    } else {
      getAllOrders(1, 10);
    }
  }, []);

  return (
    <div>
      {/* <Navbar
        flag={true}
        brandText="rides"
        handleSearch={(e: React.SyntheticEvent<EventTarget>) =>
          handleSearchSubmit(e)
        }
        setSearchText={setSearchText}
      /> */}
      {/* {loading ? (
        <Loader />
      ) : ( */}
        <>
          <div className="mt-4">
            <ColumnsTable
              tableData={allOrders}
              statusOptions={orderStatusOptions}
              setRideStatus={setOrderStatus}
              orderStatus={orderStatus}
            />

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
    </div>
  );
}

export default Orders;
