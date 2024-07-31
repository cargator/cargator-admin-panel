import React, { useEffect,useState,useRef} from "react";
import { deleteAdmin, getAllAdminsData, updatetoSuperAdmin } from "services/customAPI";
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
  } from "@chakra-ui/modal";
  import { Button, ChakraProvider, useDisclosure } from "@chakra-ui/react";
import Loader from "components/loader/loader";
import ColumnsTableAdmins from "./components/ColumnTableAdmins";
import ReactPaginate from "react-paginate";
import deleteIcon from "../../../assets/svg/deleteIcon.svg";
import blockIcon from "../../../assets/svg/blockIcon.svg";
import Navbar from "components/navbar";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from 'react-i18next'

export default function Admin() {
    const currentPage = useRef<number>(1);
    const [modalState, setModalState] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [adminData, setAdminData] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    
    const [limit, setLimit] = useState(5)
    const [pageCount, setPageCount] = useState(1);
    const [pageItemStartNumber, setPageItemStartNumber] = useState<any>(0);
  const [pageItemEndNumber, setPageItemEndNumber] = useState<any>(0);
  const { t } = useTranslation();
  const email =  useSelector((store: any) => store.auth.email);
  const superAdmin=useSelector((store: any) => store.auth.super_Admin);
  
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
        console.log(superAdmin);
        
        try {
          setLoading(true);
          const response: any = await getAllAdminsData({
            page: currentPage.current,
            limit: limit,
            email:email
          });
      
          // Validate response.totalDrivers and ensure it's a number
          const totalAdmins = Number(response. totalAdmin);
          if (isNaN( totalAdmins)) {
            console.error("Invalid totalDrivers value:", response.totalAdmins);
            return;
          }
      
          // Calculate page count
          const calculatedPageCount = Math.ceil( totalAdmins / limit);
          setPageCount(calculatedPageCount);
      
          // Update data and page item range
          const arr = response.data;
          setAdminData(arr);
          setPageItemRange(currentPage.current,  totalAdmins);
        } catch (error: any) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      
      
    
      const handlePageClick = async (e: { selected: number }) => {
        currentPage.current = e.selected + 1;
        getAllAdmin()
      };

      const handleClickForDeleteModal = (data: any) => {
        setLoading(true);
        // setVisibleModal(true);
        setModalState(true);
        setSelectedItem(data);
        console.log("Data", data);
        onOpen();
        setLoading(false);
      };

      const deleteHandle = async (data: any) => {
        setLoading(true);
        onClose();
        console.log("data", data);
       
        
        try {
          // setVisibleModal(false);
          const response: any = await deleteAdmin(data);
          // const response:any={message:"ok"}
          if (response?.message) {
            successToast("Admin deleted successfully");
            if (adminData.length % limit === 1) {
              currentPage.current = currentPage.current - 1;
            }
            getAllAdmin();
          } else {
            errorToast("Something went wrong");
          }
          setLoading(false);
        } catch (error: any) {
          errorToast(error.response.data.message);
          setLoading(false);
        }
      };


      const handleSearchSubmit = async (e: any) => {
        console.log("object  searchText :>> ", searchText);
        // e.preventDefault();
        // if (searchText.trim() === "") {
        //   setNoData(true);
        //   return;
        // }
        // currentPage.current = 1;
        // searchDriverFunction();
      };

      const updateAdmin=async (data:any)=>{
        console.log(data);
        // try {
        //   setLoading(true);
        //   const response: any = await updateAdmin(data);
        //   if(response){
        //     successToast("Admin update to super Admin successfully");
        //   }
        // } catch (error: any) {
        //   errorToast(error.response.data.message);
        // } finally {
        //   setLoading(false);
        // }
      }

      const makeSuperAdmin=async (data:any)=>{
        console.log(data);
        try {
          setLoading(true);
          const response: any = await updatetoSuperAdmin(data);
          if(response){
            successToast("Admin update to super Admin successfully");
          }
        } catch (error: any) {
          errorToast(error.response.data.message);
        } finally {
          setLoading(false);
        }
      }
    

      useEffect(()=>{
        getAllAdmin();
      },[])
  return (
    <div>
      <Navbar
        flag={true}
        brandText="Drivers"
        handleSearch={(e: React.SyntheticEvent<EventTarget>) =>
          handleSearchSubmit(e)
        }
        setSearchText={setSearchText}
      />
       {loading ? (
        <Loader />
      ) : (
        <>
          <>
            <div className="mt-4">
              <ColumnsTableAdmins
                tableData={adminData}
                handleClickForDeleteModal={handleClickForDeleteModal}
                makeSuperAdmin={makeSuperAdmin}
                updateAdmin={updateAdmin}
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
                    onPageChange={handlePageClick }
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
          {superAdmin &&  isOpen && (
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
                    {t ("Are you sure you want to Delete?")} <br />
                    {'"' + selectedItem.name + '"'}
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
                      onClick={() => deleteHandle(selectedItem)}
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
  )
}
