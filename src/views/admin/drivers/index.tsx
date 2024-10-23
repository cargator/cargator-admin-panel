import { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useLocation, useNavigate } from "react-router-dom";
import {
  //   options,
  deleteDriverHandleApi,
  getPaginatedDriverDataApi,
  searchDriversApi,
  updateDriverStatusApi,
} from "../../../services/customAPI";
import ColumnsTable from "./components/ColumnsTable";
// import "./rides.css";
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
import Loader from "components/loader/loader";
import { vehicleNumberFormat } from "helper/commonFunction";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import blockIcon from "../../../assets/svg/blockIcon.svg";
import deleteIcon from "../../../assets/svg/deleteIcon.svg";
import Navbar from "../../../components/navbar";
import { getSocketInstance } from "../../../config/socket";
import { getS3SignUrlApi } from "../../../services/customAPI";
import "./driverlist.css";
import { phoneNumberFormat } from "helper/commonFunction";

const Drivers = () => {
  const socketInstance = useRef<any>(undefined);
  const location = useLocation();
  const status = new URLSearchParams(location.search).get("status") || "all";
  const token = useSelector((store: any) => store.auth.token);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentPage = useRef<number>();
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalState, setModalState] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [sortedBy,setSortedBy]=useState("");
  const [isAscending,setIsAscending]=useState(false);
  const [driverData, setDriverData] = useState([]);
  const driverDataRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [pageItemStartNumber, setPageItemStartNumber] = useState<any>(0);
  const [pageItemEndNumber, setPageItemEndNumber] = useState<any>(0);
  const [noData, setNoData] = useState(true);
  const firstRender = useRef(true);
  const parser = new DOMParser();
  const [lastdriverwarning,setLastDriverWarning]=useState(false);


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

  const deleteHandle = async (info: any) => {
    setLoading(true);
    onClose();
    console.log("deletehandler", info);
    try {
      const response: any = await deleteDriverHandleApi(info);
      console.log("delete response", response);
      if (response && response.message) {
        successToast("Driver Deleted Successfully");
         if (driverData.length % limit === 1) {
          currentPage.current = currentPage.current - 1;
        }
        getPaginatedDriverData();
      } else {
        errorToast("Something went wrong");
      }
      setLoading(false);
    } catch (error: any) {
      const doc = parser.parseFromString(error.response?.data, "text/html");
      const errorElement = doc.querySelector("pre");
      const errorText = errorElement
        ? errorElement.textContent
        : "Unknown Error";
      errorToast(errorText);
      console.log("error :>> ", error.response.data.message);
      setLoading(false);
    }
  };

  const searchDrivers = async () => {
    try {
      // setLoading(true);
      const response: any = await searchDriversApi({
        page: currentPage.current,
        limit: limit,
        query: searchText.trim(),
        sortby:sortedBy,
        order:isAscending?1:-1 ,
        status:status  // 1-> ascending , -1 descending
      });

      return response;
    } catch (error: any) {
      setDriverData([]);
      driverDataRef.current = [];
      setPageCount(1);
      console.log(error.response.data.message);
      setNoData(error.response.data.success);
    } finally {
      setLoading(false);
    }
  };

  const searchDriverFunction = async () => {
    try {
      // setLoading(true);
      const response: any = await searchDrivers();
      if (!response) {
        return;
      }
      setPageCount(Math.ceil(response?.data[0].count[0]?.totalcount / limit));
      const pathArr = await convertToUsableDriverArray(response?.data[0].data);
      const arr: any = convertToDriverArray(response?.data[0].data, pathArr);
      setDriverData(arr);
      driverDataRef.current = arr;
      setPageItemRange(
        currentPage.current,
        response?.data[0].count[0]?.totalcount
      );
    } catch (error) {
      console.log("search driver error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (e: any) => {
    console.log("object  searchText :>> ", searchText);
    e.preventDefault();
    if (searchText.trim() === "") {
      setNoData(true);
      return;
    }
    currentPage.current = 1;
    searchDriverFunction();
  };

  function handlePageClick(e: any) {
    console.log(e);
    currentPage.current = e.selected + 1;
    searchDriverFunction();
  }

  const getPaginatedDriverData = async () => {
    try {
      setLoading(true);
      const response: any = await getPaginatedDriverDataApi({
        page: currentPage.current,
        limit: limit,
        status: status,
      });
      setPageCount(Math.ceil(response.totalDrivers / limit));
      const pathArr = await convertToUsableDriverArray(response?.data);
      const arr: any = convertToDriverArray(response?.data, pathArr);
      setDriverData(arr);
      driverDataRef.current = arr;
      setPageItemRange(currentPage.current, response.totalDrivers);
    } catch (error: any) {
      errorToast(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
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

  function convertToDriverArray(
    driverArray: Array<any>,
    pathArray: Array<any>
  ) {
    const res = driverArray.map((driver, i) => {
      const path = pathArray[i].path;
      return {
        fullName: {
          name: driver.firstName + " " + driver.lastName,
          path: path,
        },
        mobileNumber:`${phoneNumberFormat(driver.mobileNumber)}`,
        restaurantName: driver.restaurantName,
        vehicleNumber: `${vehicleNumberFormat(driver?.vehicleNumber)}`,
        vehicleType: driver.vehicleType,
        status: driver.rideStatus,
        action: {
          driverStatus: driver.status,
          id: driver._id,
          documentsKey: driver?.documentsKey,
          profileImageKey: driver?.profileImageKey,
        },
      };
    });

    return res;
  }

  async function convertToUsableDriverArray(driverArray: Array<any>) {
    const res = Promise.all(
      driverArray.map(async (driver) => {
        let path;
        if (driver?.profileImageKey) {
          path = await getS3SignUrl(
            driver?.profileImageKey,
            "image/png",
            "get"
          );
          console.log("objectpath :>> ", path);
        } else {
          path = "";
        }
        return {
          path,
        };
      })
    );

    return res;
  }

  const updateDriverStatus = async (id: string,getCount:boolean) => {
    setLoading(true);
    try {
      onClose();
      const result: any = await updateDriverStatusApi(id,getCount);

      if(result?.last_driver){
         return result;
      }

      if (result?.message) {
        successToast("Driver status updated Successfully");
        getPaginatedDriverData();
        navigate("/admin/drivers");
      } else {
        errorToast("Something went wrong");
      }
      setLoading(false);
      setLastDriverWarning(false);
    } catch (error: any) {
      console.log("error :>> ", error.response.data.message);
      errorToast(error.response.data.message);
      setLoading(false);
      setLastDriverWarning(false);
    }
  };

  const handleClickForDeleteModal = (data: any) => {
    console.log("data delete :>> ", data);
    setLoading(true);
    setModalState(true);
    setSelectedItem(data);
    // setVisibleModal(true);
    onOpen();
    setLoading(false);
  };

  const handleToggleForStatusMOdal = (data: any) => {
    console.log("data toggle :>> ", data);
    setLoading(true);
    setModalState(false);
    setSelectedItem(data);
    //   setVisibleModal(true);
    onOpen();
    setLoading(false);
  };

  const parseSocketMessage = (message: any) => {
    try {
      return JSON.parse(message);
    } catch (error) {
      console.log(`parseSocketMessage error :>> `, error);
    }
  };

  const getSocketConnection = async () => {
    try {
      socketInstance.current = await getSocketInstance(token);
      socketInstance.current.on("driver-status-update", (message: any) => {
        const data = parseSocketMessage(message);
        driverDataRef.current = driverDataRef.current.map((element: any) => {
          if (
            element.action.id.toString() ===
            data.riderStatusDetails.riderId.toString()
          ) {
            element["status"] = data.riderStatusDetails["riderStaus"];
          }
          return element;
        });
        setDriverData(driverDataRef.current);
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    currentPage.current = 1;
    getPaginatedDriverData();
    getSocketConnection();
    return () => {
      if (socketInstance.current && socketInstance.current.connected) {
        socketInstance.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
       searchDriverFunction();
    }
  }, [ status]);

  useEffect(()=>{

     if(searchText.trim()==="") searchDriverFunction();

  },
  [searchText])


useEffect(()=>{
  searchDriverFunction();
},[isAscending,sortedBy]);

  return (
    <div> 
      <Navbar
        flag={true}
        brandText="Drivers"
        handleSearch={(e: React.SyntheticEvent<EventTarget>) =>
          handleSearchSubmit(e)
        }
        setSearchText={setSearchText}
        placeholder={'Name , Mobile Number,RestaurentName Vehicle Number'}
      />
      {/* {!noData ? (
        <Card extra={" m-4 w-full p-4 h-full"}>
          <div className="m-4 text-center">
            <h2 style={{ fontSize: "30px" }}>No Results !</h2>
          </div>
        </Card>
      ) : ( */}
      {loading ? (
        <Loader />
      ) : (
        <>
          <>
            <div className="mt-4">
              <ColumnsTable
                status={status}
                tableData={driverData}
                sortedBy={sortedBy}
                setSortedBy={setSortedBy}
                isAscending={isAscending}
                setIsAscending={setIsAscending}
                handleClickForDeleteModal={handleClickForDeleteModal}
                handleToggleForStatusMOdal={handleToggleForStatusMOdal}
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
          <>
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
                      {modalState ? (
                        <img alt="" src={deleteIcon} />
                      ) : (
                        <img alt="" src={blockIcon} />
                      )}
                    </div>
                    {modalState ? (
                      <ModalBody className="text-center">
                        Are you sure you want to Delete? <br />
                        {'"' + selectedItem.fullName.name + '"'}
                      </ModalBody>
                    ) : (
                      <ModalBody className="text-center">
                         {lastdriverwarning && (
                                <div className="text-red-500">Only one Driver is Active</div>
                              )}
                        {selectedItem.action.driverStatus === "active"
                          ? (lastdriverwarning?"Do you Really want to Block":"Do you want to Block ")
                          : "Do you want to resume"}
                        <br />
                        {selectedItem.fullName.name+"'s operations at " }<br/>{ selectedItem.restaurantName+"?"}
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
                          onClick={()=>{setLastDriverWarning(false);onClose();}}
                        >
                          Cancel
                        </Button>
                      )}
                      {modalState ? (
                        <Button
                          className="delete-modal-button mx-2"
                          onClick={() => deleteHandle(selectedItem.action)}
                        >
                          Delete
                        </Button>
                      ) : (
                        <Button
                          className="block-modal-button mx-2"
                          onClick={async() =>{

                            if(!lastdriverwarning){

                              const res= await updateDriverStatus(selectedItem.action.id,true);
                                    if(res && res?.last_driver){
                                          setLastDriverWarning(true);
                                          setLoading(false);
                                          onOpen();
                                        }
                            }
                            
                            else {
                              updateDriverStatus(selectedItem.action.id,false);
                            }                     
                               
                  

                          }
                          }
                        >
                          {selectedItem.action.driverStatus === "active"
                            ? "Unassign"
                            : "Assign"}
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
    </div>
  );
};

export default Drivers;
