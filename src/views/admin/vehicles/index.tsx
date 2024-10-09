import React from "react";
import { useEffect, useRef, useState } from "react";
import ColumnsTableVehicles from "./components/ColumnsTableVehicles";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import {
  deleteVehicleApi,
  getPaginatedVehicleDataApi,
  searchVehiclesApi,
} from "../../../services/customAPI";
import ReactPaginate from "react-paginate";
import "./vehicles.css";
import Loader from "components/loader/loader";
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
import Navbar from "components/navbar";
import { getS3SignUrlApi } from "../../../services/customAPI";
import { vehicleNumberFormat } from "helper/commonFunction";
const Vehicles: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentPage = useRef<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalState, setModalState] = useState(true);
  const [pageCount, setPageCount] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [vehicleData, setVehicleData] = useState([]);
  const [pageItemStartNumber, setPageItemStartNumber] = useState<number>(0);
  const [pageItemEndNumber, setPageItemEndNumber] = useState<number>(0);
  const [noData, setNoData] = useState(true);
  const firstRender = useRef(true);
  const { t } = useTranslation();

  const successToast = (message: string) => {
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

  async function getS3SignUrl(key: string, contentType: string, type: string) {
    const headers = { "Content-Type": "application/json" };
    const response: any = await getS3SignUrlApi(
      {
        key,
        contentType,
        type,
      },
      { headers }
    );
    return response?.url;
  }

  async function convertToUsableDriverArray(vehicleArray: Array<any>) {
    const res = Promise.all(
      vehicleArray.map(async (vehicle) => {
        let path;
        if (vehicle?.profileImageKey) {
          path = await getS3SignUrl(
            vehicle.profileImageKey,
            "image/png",
            "get"
          );
        } else {
          path = "";
        }

        return { 
          vehicleName: {
            name: vehicle.vehicleName,
            path: path,
          },
          vehicleNumber:`${vehicleNumberFormat(vehicle?.vehicleNumber)}`,
          // vehicleNumber:`${vehicle?.vehicleNumber?.substring(0, 2) || ''} ${vehicle?.vehicleNumber?.substring(2, 4) || ''} ${vehicle?.vehicleNumber?.substring(4, 6) || ''} ${vehicle?.vehicleNumber?.substring(6, 10) || ''}`,
          vehicleType: vehicle.vehicleType,
          vehicleStatus: vehicle.vehicleStatus,
          action: {
            id: vehicle._id,
            documentsKey: vehicle?.documentsKey,
            profileImageKey: vehicle?.profileImageKey,
          },
        };
      })
    );
    

    return res;
  }

  const getPaginatedVehicleData = async () => {
    try {
      setIsLoading(true);
      const response: any = await getPaginatedVehicleDataApi({
        page: currentPage.current,
        limit: limit,
      });

      if (!response.data) {
        errorToast("Vehicle data not found");
      }

      // const data = response.result;
      setPageCount(Math.ceil(response.totalVehicles / limit));
      setVehicleData(await convertToUsableDriverArray(response?.data));
      setPageItemRange(currentPage.current, response.totalVehicles);
    } catch (error: any) {
      errorToast(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const searchVehicles = async () => {
    try {
      setIsLoading(true);
      const response: any = await searchVehiclesApi({
        page: currentPage.current,
        limit: limit,
        query: searchText.trim(),
      });

      if (!response) {
        errorToast("Vehicles not found");
      }
      return response;
    } catch (error: any) {
      console.log(error.response.data.success);
      setVehicleData([]);
      setPageCount(1);
      setNoData(error.response.data.success);
    } finally {
      setIsLoading(false);
    }
  };

  const searchVehicleFunction = async () => {
    try {
    const response: any = await searchVehicles();
    if (!response) {
      return;
    }
    setPageCount(Math.ceil(response?.data[0].count[0]?.totalcount / limit));
    setVehicleData(await convertToUsableDriverArray(response?.data[0].data));
    // setValues(data.map(extractSpecificValues))
    setPageItemRange(currentPage.current, response?.data[0].count[0]?.totalcount);
  } catch (error) {
    console.log("search vehicle error:", error)    
  } finally {
    setIsLoading(false);
  }
  };

  const deleteHandle = async (data: any) => {
    setIsLoading(true);
    onClose();
    console.log("data", data);
    try {
      // setVisibleModal(false);
      const response: any = await deleteVehicleApi(data);
      if (response?.message) {
        successToast("Vehicle deleted successfully");
        if (vehicleData.length % limit === 1) {
          currentPage.current = currentPage.current - 1;
        }
        getPaginatedVehicleData();
      } else {
        errorToast("Something went wrong");
      }
      setIsLoading(false);
    } catch (error: any) {
      errorToast(error.response.data.message);
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
    searchVehicleFunction();
  };

  function handlePageClick(e: any) {
    currentPage.current = e.selected + 1;
    if (searchText !== "") {
      searchVehicleFunction();
    } else {
      getPaginatedVehicleData();
    }
  }

  const handleClickForDeleteModal = (data: any) => {
    setIsLoading(true);
    // setVisibleModal(true);
    setModalState(true);
    setSelectedItem(data);
    console.log("Data", data);
    onOpen();
    setIsLoading(false);
  };

  useEffect(() => {
    if (firstRender.current) { 
      firstRender.current = false;
    } else {
      if (searchText.trim() == "") {
        setNoData(true);
        currentPage.current = 1;
        getPaginatedVehicleData();
      }
    }
  }, [searchText]);

  useEffect(() => {
    currentPage.current = 1;
    getPaginatedVehicleData();
  }, []);

  return (
    <div> 
      <Navbar
        flag={true}
        brandText="Vehicles"
        handleSearch={(e: React.SyntheticEvent<EventTarget>) =>
          handleSearchSubmit(e)
        }
        setSearchText={setSearchText}
        placeholder=" Nickname , Number , Type , Status"
      />
      {/* {!noData ? (
        <Card extra={" m-4 w-full p-4 h-full"}>
          <div className="m-4 text-center">
            <h2 style={{ fontSize: "30px" }}>No Results !</h2>
          </div>
        </Card>
      ) : ( */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <>
            <div className="m-4">
              <ColumnsTableVehicles
                tableData={vehicleData}
                handleClickForDeleteModal={handleClickForDeleteModal}
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
                    <img src={deleteIcon} />
                  </div>
                  <ModalBody className="text-center">
                    {t("Are you sure you want to Delete?")} <br />
                    {'"' + selectedItem.vehicleNumber + '"'}
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
                      onClick={() => deleteHandle(selectedItem.action)}
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
      )}
    </div>
  );
};

export default Vehicles;
