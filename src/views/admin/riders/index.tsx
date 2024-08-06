import React, { useCallback, useEffect, useRef, useState } from "react";
import "./riders.css";
import ReactPaginate from "react-paginate";
import * as _ from "lodash";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Button, ChakraProvider } from "@chakra-ui/react";
import deleteIcon from "../../../assets/svg/deleteIcon.svg";
import blockIcon from "../../../assets/svg/blockIcon.svg";
import {
  getAllRidersApi,
  handleRiderDeleteApi,
  searchRidersApi,
  searchRidersByNameApi,
  updateRiderStatusApi,
} from "../../../services/customAPI";
import ColumnsTableRiders from "./components/ColumnsTableRiders";
import Loader from "components/loader/loader";
import Navbar from "../../../components/navbar";
import Card from "components/card";
import { useSelector } from "react-redux";
import { getSocketInstance } from "../drivers/socket";

interface Rider {
  _id: string;
  name: string;
  mobileNumber: string;
  totalRidesCompleted: string;
  status: string;
}

const Riders: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentPage = useRef<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalState, setModalState] = useState(true);
  const [values, setValues] = useState([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ridersData, setRidersData] = useState<Rider[]>([]);
  const [paginatedRiders, setPaginatedRiders] = useState([]);
  const [pageItemStartNumber, setPageItemStartNumber] = useState<number>(1);
  const [pageItemEndNumber, setPageItemEndNumber] = useState<number>(limit);
  const [noData, setNoData] = useState(true);
  const firstRender = useRef(true);
  // const [driverData, setDriverData] = useState([])

  const extractSpecificValues = (item: any) => {
    return {
      name: item.name,
      mobileNumber: item.mobileNumber,
      totalRidesCompleted: item.totalRidesCompleted,
      status: item.status,
    };
  };
  // console.log("Status", status);

  const successToast = (message: string) => {
    // console.log("Inside successToast", message); // Add this line for debugging
    toast.success(`${message}`, {
      position: toast.POSITION.TOP_RIGHT,
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

  const errorToast = (message: string) => {
    toast.error(`${message}`, {
      position: toast.POSITION.TOP_RIGHT,
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

  const setPageItemRange = (
    currPageNumber: number,
    maxItemRange: number
  ): void => {
    let startNumber = currPageNumber * limit - limit + 1;
    if (startNumber < 0) {
      startNumber = 0;
    }
    setPageItemStartNumber(startNumber);

    const endNumber = currPageNumber * limit;
    setPageItemEndNumber(Math.min(endNumber, maxItemRange));
  };

  // async function searchTextDebounced(text) {
  //   try {
  //     setIsLoading(true)
  //     if (text.trim() == '') {
  //       errorToast('Invalid rider name! Please provide a valid rider name.')
  //       // getAllRiders()
  //       setSearchText('')
  //       return
  //     } else {
  //       const response = await customAxios.post(`/search-riders-by-name`, {
  //         query: text,
  //       })

  //       setRidersData(response.data)
  //       setPageCount(Math.ceil(response.data.length / limit))
  //       setPaginatedRidersData(response.data)
  //       setPageItemRange(1, response.data.length)
  //     }
  //   } catch (error) {
  //     errorToast(error?.response?.data?.message)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const searchTextDebouncer = useCallback(_.debounce(searchTextDebounced, 2000), [])

  const searchRiders = async () => {
    try {
      setIsLoading(true);
      const response: any = await searchRidersApi({
        page: currentPage.current,
        limit: limit,
        query: searchText.trim(),
      });
      setNoData(true);
      return response;
    } catch (error: any) {
      // console.log(error.response.data.success);
      setPaginatedRiders([]);
      setPageCount(1);
      setNoData(error.response.data.success);
      setIsLoading(false);
    }
  };

  const searchRiderFunction = async () => {
    try {
      const response: any = await searchRiders();
      if (!response) {
        return;
      }
      // setRidersData(response.data);
      setPageCount(Math.ceil(response?.data[0].count[0]?.totalcount / limit));
      setPaginatedRiders(response?.data[0].data);
      setPageItemRange(
        currentPage.current,
        response?.data[0].count[0]?.totalcount
      );
    } catch (error) {
      console.log("search rider error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = async (e: any) => {
    e.preventDefault();
    if (searchText.trim() == "") {
      setNoData(true);
      return;
    }
    currentPage.current = 1;
    searchRiderFunction();
  };

  const updateRiderStatus = async (id: any, status: any) => {
    // console.log("UpdateRiderStatus", id, status);
    try {
      setIsLoading(true);
      onClose();
      const response: any = await updateRiderStatusApi({
        id,
        status,
      });
      if (response.success) {
        successToast("Rider status updated !");
        // const updatedRider = response.data;
        // const updatedRidersData = paginatedRiders.map((rider) => {
        //   if (rider._id == id) {
        //     rider = updatedRider;
        //   }
        //   return rider;
        // });
        // setRidersData(updatedRidersData);
        // currentPage.current = 1;
        // setPaginatedRiders(updatedRidersData);
        getAllRiders();
      } else {
        errorToast("Something went wrong! Please try again.");
      }
    } catch (error: any) {
      // console.log("error updateriderstatus", error);
      errorToast(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    onClose();
    try {
      setIsLoading(true);
      const response: any = await handleRiderDeleteApi(id);
      if (response.success) {
        successToast("Rider deleted successfully !");
        // const updatedRidersData = paginatedRiders.filter((rider) => rider._id != id);
        // setRidersData(updatedRidersData);

        // setPageCount(Math.ceil(updatedRidersData.length / limit));
        // currentPage.current = 1;
        // setPaginatedRidersData(updatedRidersData);
        // setPaginatedRiders(updatedRidersData)
        // if (updatedRidersData.length % limit === 0) {
        //   currentPage.current = currentPage.current - 1;
        //   setPaginatedRiders(updatedRidersData);
        // }

        // setPageItemRange(currentPage.current, updatedRidersData.length);
        getAllRiders();
      } else {
        errorToast("Something went wrong! Please try again.");
      }
    } catch (error: any) {
      // console.log("error handledelete", error);
      errorToast(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickForDeleteModal = (data: any) => {
    setIsLoading(true);
    setModalState(true);
    console.log("Data", data);
    setSelectedItem(data);
    console.log("Selected Item", selectedItem);
    onOpen();
    setIsLoading(false);
  };

  const handleToggleForStatusModal = (data: any) => {
    setIsLoading(true);
    setModalState(false);
    setSelectedItem(data);
    console.log("Selected Item", selectedItem);
    onOpen();
    setIsLoading(false);
  };

  // function setPaginatedRidersData(ridersArray: any) {
  //   setIsLoading(true);
  //   const currentPage_ZeroBasedIndexing = currentPage.current - 1;
  //   const startIdx = currentPage_ZeroBasedIndexing * limit;
  //   const endIdx = currentPage_ZeroBasedIndexing * limit + limit;
  //   setPaginatedRiders(ridersArray.slice(startIdx, endIdx));
  //   setIsLoading(false);
  // }

  // Pagination
  function handlePageClick(event: any) {
    currentPage.current = event.selected + 1;
    if (searchText !== "") {
      searchRiderFunction();
    } else {
      getAllRiders();
    }
  }

  const getAllRiders = async () => {
    try {
      setIsLoading(true);
      const response: any = await getAllRidersApi({
        page: currentPage.current,
        limit: limit,
      });
      setPageCount(Math.ceil(response.totalRiders / limit));
      setPaginatedRiders(response.data);
      setPageItemRange(currentPage.current, response.totalRiders);
    } catch (error: any) {
      errorToast(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      if (searchText.trim() == "") {
        setNoData(true);
        currentPage.current = 1;
        getAllRiders();
      }
    }
  }, [searchText]);
  useEffect(() => {
    currentPage.current = 1;
    getAllRiders();
  }, []);

  return (
    <div>
      <Navbar
        flag={true}
        brandText="Riders"
        handleSearch={(e: React.SyntheticEvent<EventTarget>) =>
          handleSearchSubmit(e)
        }
        setSearchText={setSearchText}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {
            // !noData ? (
            //   <Card extra={" m-4 w-full p-4 h-full"}>
            //     <div className="m-4 text-center">
            //       <h2 style={{ fontSize: "30px" }}>No Results !</h2>
            //     </div>
            //   </Card>
            // ) : (
            <>
              <div className="m-4">
                <ColumnsTableRiders
                  tableData={paginatedRiders}
                  handleClickForDeleteModal={handleClickForDeleteModal}
                  handleToggleForStatusModal={handleToggleForStatusModal}
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
            // )
          }
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
                      <img src={deleteIcon} />
                    ) : (
                      <img src={blockIcon} />
                    )}
                  </div>
                  {modalState ? (
                    <ModalBody className="text-center">
                      Are you sure you want to Delete? <br />
                      {'"' + selectedItem.name + '"'}
                    </ModalBody>
                  ) : (
                    <ModalBody className="text-center">
                      {selectedItem.status == "active"
                        ? "Are you sure you want to Block ?"
                        : "Are you sure you want to Unblock ?"}
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
                        onClick={() => handleDelete(selectedItem._id)}
                      >
                        Delete
                      </Button>
                    ) : (
                      <Button
                        className="block-modal-button mx-2"
                        onClick={() =>
                          updateRiderStatus(
                            selectedItem._id,
                            selectedItem.status
                          )
                        }
                      >
                        {selectedItem.status == "active" ? "Block" : "Unblock"}
                      </Button>
                    )}
                  </div>
                  <ModalFooter></ModalFooter>
                </ModalContent>
              </Modal>
            </ChakraProvider>
          )}
        </>
      )}
    </div>
  );
};

export default Riders;
