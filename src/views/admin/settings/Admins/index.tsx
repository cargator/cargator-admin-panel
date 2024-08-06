import { useEffect, useState, useRef } from "react";
import { useDisclosure } from "@chakra-ui/react";
import Loader from "components/loader/loader";
import ReactPaginate from "react-paginate";
import ColumnsTableAdmins from "./components";
import Navbar from "components/navbar";

export default function Admins() {
  const currentPage = useRef<number>(1);
  const [modalState, setModalState] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [limit, setLimit] = useState(5);
  const [pageCount, setPageCount] = useState(1);
  const [pageItemStartNumber, setPageItemStartNumber] = useState<any>(0);
  const [pageItemEndNumber, setPageItemEndNumber] = useState<any>(0);

  const setPageItemRange = (page: number, maxItemRange: number) => {
    let startNumber = page * limit - limit + 1;
    if (startNumber < 0) {
      startNumber = 0;
    }
    setPageItemStartNumber(
      startNumber.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })
    );

    const endNumber = page * limit;
    setPageItemEndNumber(
      Math.min(endNumber, maxItemRange).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })
    );
  };

  const getAllAdmin = async () => {
    // try {
    //   setLoading(true);
    //   const response: any = await getAllAdminsData({
    //     page: currentPage.current,
    //     limit: limit,
    //   });
    //   // Validate response.totalDrivers and ensure it's a number
    //   const totalAdmins = Number(response.totalAdmin);
    //   if (isNaN(totalAdmins)) {
    //     console.error("Invalid totalDrivers value:", response.totalAdmins);
    //     return;
    //   }
    //   // Calculate page count
    //   const calculatedPageCount = Math.ceil(totalAdmins / limit);
    //   setPageCount(calculatedPageCount);
    //   // Update data and page item range
    //   const arr = response.data;
    //   setAdminData(arr);
    //   setPageItemRange(currentPage.current, totalAdmins);
    // } catch (error: any) {
    //   console.error(error);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handlePageClick = async (e: { selected: number }) => {
    currentPage.current = e.selected + 1;
    getAllAdmin();
  };

  useEffect(() => {
    getAllAdmin();
  }, []);
  return (
    <>
      <Navbar flag={false} brandText="Settings" />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="mt-4">
            <ColumnsTableAdmins
              tableData={adminData}
              handleClickForDeleteModal={function (data: any): void {
                throw new Error("Function not implemented.");
              }}
              makeSuperAdmin={function (data: any): void {
                throw new Error("Function not implemented.");
              }}
              updateAdmin={function (data: any): void {
                throw new Error("Function not implemented.");
              }}
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
      )}
    </>
  );
}
