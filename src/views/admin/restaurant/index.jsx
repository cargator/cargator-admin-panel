import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getRestaurantList, deleteSpot, deleteRestaurant,getSearchRestaurantList } from "../../../services/customAPI";
import ReactPaginate from "react-paginate";
// import './map.css'
import Loader from "components/loader/loader";
import Navbar from "components/navbar";
import ColumnsTable from "./components/ColumnTable";
import { toast } from "react-toastify";
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

const Restaurant = () => {
  const currentPage = useRef();
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allRetstaurentData, setAllRetstaurantData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [modalState, setModalState] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const firstRender = useRef(true);
  const [pageItemStartNumber, setPageItemStartNumber] = useState(0);
  const [pageItemEndNumber, setPageItemEndNumber] = useState(0);

  const parser = new DOMParser();

  const successToast = (message) => {
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

  const errorToast = (message) => {
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

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchText.trim() == "") {
      // setNoData(true);
      return;
    }
    currentPage.current = 1;
    searchRideFunction();
    setLoading(false);
  };

const searchRides = async () => {
  try {
    setLoading(true);
    const response = await getSearchRestaurantList({
      page: currentPage.current,
      limit: limit,
      query:searchText.trim()
    });

    // console.log("res", response.data)
    setPageCount(Math.ceil(response?.data[0].count[0]?.totalcount / limit));
    setAllRetstaurantData(await convertToUsableRestaurantArray(response?.data[0].data));
    setPageItemRange(
      currentPage.current,
      response?.data[0].count[0]?.totalcount
    );
    setLoading(false);
  } catch (error) {
    setLoading(false);
    console.log(`get-all-rides >> error :>> `, error);
  }
};


  const searchRideFunction = async () => {
    const response = await searchRides();
    if (!response) {
      return;
    }
    setPageCount(Math.ceil(response?.data[0].count[0]?.totalcount / limit));
    setAllRetstaurantData(await convertToUsableRestaurantArray(response?.data[0].data));
    setPageItemRange(
      currentPage.current,
      response?.data[0].count[0]?.totalcount
    );
    setLoading(false);
  };

  const setPageItemRange = (currPageNumber, maxItemRange) => {
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

  async function convertToUsableRestaurantArray(restaurantArray) {
    const res = Promise.all(
      restaurantArray.map(async (restaurant) => {
        return {
          restaurantName: restaurant?.restaurantName,
          action: {
            id: restaurant._id,
            },
            bounds: restaurant?.bounds,
            };
            })
            );
            return res;
  }

  const handleClickForDeleteModal = (data) => {
    
    setLoading(true);
    setModalState(true);
    setSelectedItem(data);
    onOpen();
    setLoading(false);    
  };

  const deleteHandle = async (info) => {
    setLoading(true);

    onClose();
    try {
     
      const result = await deleteRestaurant(info.id);
       getData();
      if(result.riderExists){
        setLoading(false);
        errorToast(result.message);
      }
      else if (result.message) {
        successToast("Restaurant deleted successfully");
        setLoading(false);
      } else {
        setLoading(false);
        errorToast("Something went wrong");
      }
    } catch (error) {
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

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getRestaurantList({
        page: currentPage.current,
        limit: limit,
      });

      // console.log("res", response.data)
      setPageCount(Math.ceil(response?.data[0].count[0]?.totalcount / limit));
      setAllRetstaurantData(await convertToUsableRestaurantArray(response?.data[0].data));
      setPageItemRange(
        currentPage.current,
        response?.data[0].count[0]?.totalcount
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(`get-all-rides >> error :>> `, error);
    }
  };

  useEffect(() => {

    if(searchText==""){
      currentPage.current = 1;
      getData();
    }
   
  }, [searchText]);

  async function handlePageClick(event) {
    currentPage.current = event.selected + 1;
    // if (searchText !== "") {
    getData();
    // } else {
    // await handleRideStatusSelect(rideStatus);
    // }
  }

  useEffect(() => {
    currentPage.current = 1;
    if (firstRender.current) {
      firstRender.current = false;
    }
  }, []);

  useEffect(() => {
    if (searchText.trim() == "") {
      // setLoading(true);
      // setSearchData([]);
      setPageCount(Math.ceil(getRestaurantList.length / limit));
      if (getRestaurantList.length === 0) {
        setPageItemRange(0, getRestaurantList.length);
      } else {
        currentPage.current = 1;
        setPageItemRange(currentPage.current, getRestaurantList.length);
      }
      // setLoading(false);
    }
  }, [searchText]);

  useEffect(() => {
    console.log("loading--------", loading);
  }, [loading]);

  return (
    <div>
      <Navbar
        flag={true}
        brandText="rides"
        handleSearch={(e) => handleSearchSubmit(e)}
        setSearchText={setSearchText}
        placeholder="restaurant Name ....."
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
                tableData={allRetstaurentData}
                handleClickForDeleteModal={handleClickForDeleteModal}
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
                    {/* <div className="mb-2 flex justify-center">
                      <img src={deleteIcon} />
                    </div> */}
                    <ModalBody className="text-center">
                      {t("Are you sure you want to Delete?")} <br />
                      {t(`${'"' + selectedItem.restaurantName + '"'}`)}
                    </ModalBody>
                    <div className="mt-3 flex justify-center">
                      <Button
                        // style={{backgroundColor: 'red'}}
                        className="cancel-delete-modal-button mx-2"
                        onClick={onClose}
                      >
                        {t("Cancel")}
                      </Button>
                      <Button
                        className="delete-modal-button mx-2"
                        onClick={() => {
                          deleteHandle(selectedItem?.action);
                        }}
                      >
                        {t("Delete")}
                      </Button>
                    </div>
                    <ModalFooter></ModalFooter>
                  </ModalContent>
                </Modal>
              </ChakraProvider>
            )}
          </>
          {/* )} */}
        </>
      )}
    </div>
  );
};

export default Restaurant;
