import {
  ChakraProvider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import Loader from "components/loader/loader";
import Navbar from "components/navbar";
import { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import ColumnsTableActivity from "./components";
import { getActivities } from "services/customAPI";
// @ts-ignore
import { allExpanded, defaultStyles, JsonView } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import { toast } from "react-toastify";

const Activity = () => {
  const currentPage = useRef<number>(1);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);

  const handlePageClick = async (e: { selected: number }) => {
    currentPage.current = e.selected + 1;
    fetchActivities();
  };

  const errorToast = (message: any) => {
    toast.error(`${message}`, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: { borderRadius: "15px" },
    });
  };

  const fetchActivities = async () => {
    try {
      const res = await getActivities({ page: currentPage.current, limit });
      setPageCount(res.data.count[0].totalCount / limit);
      setActivityData(res.data.activity);
    } catch (error: any) {
      errorToast(
        error.response.data.message || error.message || "something went wrong"
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div>
      <Navbar flag={false} brandText="Activity" />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="mt-4">
            <ColumnsTableActivity tableData={activityData} />

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
                {(currentPage.current - 1) * limit + 1} -{" "}
                {(currentPage.current - 1) * limit + activityData.length}
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
      )}
    </div>
  );
};
export default Activity;
