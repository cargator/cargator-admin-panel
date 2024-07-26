import { useEffect, useRef, useState } from "react";
import Navbar from "components/navbar";
import { findOrders } from "services/customAPI";
import Loader from "components/loader/loader";
import { orderStatusOptions } from "utils/constants";
import { useLocation } from "react-router-dom";
import ColumnsOrderTable from "./components/ColumnsTable";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [limit, setLimit] = useState(10);
  const [orderStatus, setOrderStatus] = useState<string>(displayValue);
  const firstRender = useRef(true);
  const [pageItemStartNumber, setPageItemStartNumber] = useState<any>(0);
  const [pageItemEndNumber, setPageItemEndNumber] = useState<any>(0);
  console.log("orderStatus =====> ", orderStatus);

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
      console.log(order);
      
      let dateTime = convertUtcToIst(order.createdAt);
      return {
        orderId:order.order_details.vendor_order_id,
        orderDate: dateTime.substring(0, 10),
        orderTime: dateTime.substring(11, 16),
        customerMobileNum: order?.drop_details?.contact_number
          ? order?.drop_details?.contact_number
          : null,
        DriverMobileNum: order?.driver_details?.contact
          ? order?.driver_details?.contact
          : null,
        amount: order.order_details.order_total,
        status: order.status,
        pickUpLocation: order.pickup_details.address,
        dropLocation: order.drop_details.address,
        view: order.order_details.vendor_order_id,
      };
    });
    return response;
  }

  const searchOrders = async () => {
    try {
      setLoading(true);
      const response: any = await findOrders({
        page: currentPage,
        limit: limit,
        query: searchText.trim(),
      });
      console.log("response ===>", response);
      return response;
    } catch (error: any) {
      console.log(error.response.data.success);
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  async function getAllOrders(
    page: number,
    limit: number,
    filter: any = undefined
  ) {
    try {
      setLoading(true);
      console.log("limits shows", {
        page: page,
        limit: limit,
        filter
      });

      const response: any = await findOrders({
        page: page,
        limit: limit,
        filter,
      });
      console.log("RESPONSE", response.data[0].data);
      setAllOrders(await convertToOrders(response?.data[0].data));
      setPageCount(Math.ceil(response?.data[0].count[0]?.totalcount / limit));
      setPageItemRange(page, response?.data[0].count[0]?.totalcount);
      return response;
    } catch (error: any) {
      console.log(error.response.data.success);
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  }

  const handleOrderStatusSelect = async (status: string) => {
    console.log("status =======> ", status);
    try {
      // setLoading(true);
      let response: any;

      if (status === "all") {
        response = await getAllOrders(currentPage, limit, status);
      } else if (status === "current-order") {
        console.log("hey am here~~~");
        
        response = await getAllOrders(currentPage, limit, status);
      } else if (status === "completed") {
        response = await getAllOrders(currentPage, limit, status);
      } else {
        const filter = status;
        response = await getAllOrders(currentPage, limit, filter);
      }
      setAllOrders(await convertToOrders(response?.data[0].orders));
      setPageItemRange(currentPage, response?.data[0].count[0]?.totalcount);
    } catch (error) {
      console.log(`handleRideStatusSelect error :>> `, error);
    } finally {
      // setLoading(false);
    }
  };

  const searchOrderFn = async () => {
    setLoading(true);
    try {
      const response: any = await searchOrders();
      if (!response) {
        return;
      }

      setPageCount(Math.ceil(response?.data[0].count[0]?.totalcount / limit));
      setAllOrders(await convertToOrders(response?.data[0].orders));
      setPageItemRange(currentPage, response?.data[0].count[0]?.totalcount);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (e: any) => {
    e.preventDefault();
    await searchOrderFn();
  };

  const handlePageClick = async (event: any) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
    await getAllOrders(selectedPage, limit);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getAllOrders(currentPage, 10);
      setLoading(false);
    };
    fetchData();
  }, [currentPage]);

  useEffect(() => {

    
    const handleStatusChange = async () => {
      console.log("useeffect call after change", orderStatus, firstRender.current);
      // setLoading(true);
      if (!firstRender.current) {
        await handleOrderStatusSelect(orderStatus);
      } else {
        firstRender.current = false;
      }
      // setLoading(false);
    };

    handleStatusChange();
  }, [orderStatus]);

  useEffect(() => {
    if (searchText.trim() === "") {
      setPageCount(Math.ceil(allOrders.length / limit));
      if (allOrders.length === 0) {
        setPageItemRange(0, allOrders.length);
      } else {
        setCurrentPage(1);
        setPageItemRange(currentPage, allOrders.length);
      }
    }
  }, [searchText]);

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
          <div className="mt-4">
            <ColumnsOrderTable
              tableData={allOrders}
              statusOptions={orderStatusOptions}
              setOrderStatus={setOrderStatus}
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
                  forcePage={currentPage - 1}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Orders;
