import { useEffect, useState, useRef } from "react";
import {
  Button,
  ChakraProvider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import Loader from "components/loader/loader";
import ReactPaginate from "react-paginate";
import ColumnsTableAdmins from "./components";
import Navbar from "components/navbar";
import {
  deleteUserAPI,
  getAllAdminsData,
  updateAdminUserStatus,
} from "services/customAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import deleteIcon from "../../../../assets/svg/deleteIcon.svg";
import blockIcon from "../../../../assets/svg/blockIcon.svg";

export default function Admins() {
  const navigate = useNavigate();

  const currentPage = useRef<number>(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [pageItemStartNumber, setPageItemStartNumber] = useState<any>(0);
  const [pageItemEndNumber, setPageItemEndNumber] = useState<any>(0);
  const [sortedBy,setSortedBy]=useState("");
  const [isAscending,setIsAscending]=useState(false);

  const parser = new DOMParser();



  const successToast = (message: any) => {
    toast.success(`${message}`, {
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

  const handleUpdate = (data: any) => {
    const id = data._id;
    // console.log("selectedItem?.action", id);
    navigate(`/admin/settings/user-form/${id}`);
  };

  const handleClickForDeleteModal = (data: any) => {
    setLoading(true);
    setModalState(true);
    setSelectedItem(data);
    onOpen();
    setLoading(false);
  };

  const handleToggleForStatusMOdal = (data: any) => {
    setLoading(true);
    setModalState(false);
    setSelectedItem(data);
    onOpen();
    setLoading(false);
  };

  const deleteHandle = async (info: any) => {
    setLoading(true);
    onClose();
    try {
      const result: any = await deleteUserAPI(info);
      getAllAdmin();
      if (result.message) {
        successToast("User deleted successfully");
        setLoading(false);
      } else {
        setLoading(false);
        errorToast("Something went wrong");
      }
    } catch (error: any) {
      setLoading(false);
      const doc = parser.parseFromString(error.response?.data, "text/html");
      const errorElement = doc.querySelector("pre");
      const errorText = errorElement
        ? errorElement.textContent
        : "Unknown Error";
      errorToast(errorText);
      console.log("error :>> ", error.response.data.message);
    }
  };

  const handleUserStatus = async (id: string) => {
    setLoading(true);
    try {
      onClose();
      const result: any = await updateAdminUserStatus(id);
      console.log("result :>> ", result?.message);
      if (result?.message) {
        successToast("User status updated Successfully");
        getAllAdmin();
        navigate("/admin/settings/users");
      } else {
        errorToast("Something went wrong");
      }
      setLoading(false);
    } catch (error: any) {
      console.log("error :>> ", error.response.data.message);
      errorToast(error.response.data.message);
      setLoading(false);
    }
  };

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
    try {
      setLoading(true);
      const response = await getAllAdminsData({
        page: currentPage.current,
        limit: limit,
        sortby:sortedBy,
        order:isAscending?1:-1

      });
      console.log("response==> ", response);

      // Validate response.totalDrivers and ensure it's a number
      const count = Number(response.data.count[0].totalCount);
      if (isNaN(count)) {
        console.error("Invalid totalDrivers value:", response.data.admins);
        return;
      }
      // Calculate page count
      const calculatedPageCount = Math.ceil(count / limit);
      setPageCount(calculatedPageCount);
      // Update data and page item range
      const arr = response.data.admins;
      setAdminData(arr);
      setPageItemRange(currentPage.current, count);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = async (e: { selected: number }) => {
    currentPage.current = e.selected + 1;
    getAllAdmin();
  };

  useEffect(() => {
    getAllAdmin();
  }, [sortedBy,isAscending]);
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
              handleClickForDeleteModal={handleClickForDeleteModal}
              handleToggleForStatusMOdal={handleToggleForStatusMOdal}
              handleUpdate={handleUpdate}
              sortedBy={sortedBy}
              setSortedBy={setSortedBy}
              isAscending={isAscending}
              setIsAscending={setIsAscending}
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
          <>
            {isOpen && (
              <ChakraProvider>
                <Modal
                  isCentered={true}
                  isOpen={isOpen}
                  onClose={onClose}
                  size="xs"
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader></ModalHeader>
                    {/* <ModalCloseButton /> */}
                    <div className="mb-2 flex justify-center">
                      {modalState ? (
                        <img alt="" src={deleteIcon} />
                      ) : (
                        <img alt="" src={blockIcon} />
                      )}
                    </div>
                    {modalState ? (
                      <ModalBody className="text-center">
                        Are you sure you want to Delete? <br />
                        {'"' + selectedItem.name + '"'}
                      </ModalBody>
                    ) : (
                      <ModalBody className="text-center">
                        {selectedItem.status === "active"
                          ? "Are you sure you want to Pause ?"
                          : "Are you sure you want to Continue ?"}
                        <br />
                        {'"' + selectedItem.name + '"'}
                      </ModalBody>
                    )}

                    <div className="mt-3 flex justify-center">
                      {modalState ? (
                        <Button
                          // style={{backgroundColor: 'red'}}
                          className="cancel-delete-modal-button mx-2"
                          onClick={onClose}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          className="cancel-block-modal-button mx-2"
                          onClick={onClose}
                        >
                          Cancel
                        </Button>
                      )}
                      {modalState ? (
                        <Button
                          className="delete-modal-button mx-2"
                          onClick={() => deleteHandle(selectedItem._id)}
                        >
                          Delete
                        </Button>
                      ) : (
                        <Button
                          className="block-modal-button mx-2"
                          onClick={() => handleUserStatus(selectedItem._id)}
                        >
                          {selectedItem.status === "active"
                            ? "Pause"
                            : "Continue"}
                        </Button>
                      )}
                    </div>
                    <ModalFooter></ModalFooter>
                  </ModalContent>
                </Modal>
              </ChakraProvider>
            )}
          </>
        </>
      )}
    </>
  );
}
