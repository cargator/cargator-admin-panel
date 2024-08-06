import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'
import Card from "components/card";
import deleteIcon from "../../../../../assets/svg/deleteIcon.svg";
import ButtonEdit from "../../../../../assets/svg/ButtonEdit.svg";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Navbar from "components/navbar";
import { deleteCoutryCode, getCountryCodes } from "services/customAPI";
import Loader from "components/loader/loader";
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

type RowObj = {
  countryCode: string;
  countryName: string;
  action: string;
};

function CountryCode() {
  // translaion function
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalState, setModalState] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const parser = new DOMParser();

  const columns = [
    columnHelper.accessor("countryCode", {
      id: "countryCode",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Country Code")}
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("countryName", {
      id: "countryName",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Country Name")}
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("action", {
      id: "action",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Action")}
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          {/* <div className="cursor-pointer">
            <img
              src={ButtonEdit}
              style={{ marginRight: "8px" }}
              onClick={() => handleUpdate(info.row.original)}
            />
          </div> */}
          <div className="cursor-pointer">
            <img
              src={deleteIcon}
              onClick={() => handleClickForDeleteModal(info.row.original)}
            />
          </div>
        </div>
      ),
    }),
  ];

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

  const handleClickForDeleteModal = (data: any) => {
    setLoading(true);
    setModalState(true);
    setSelectedItem(data);
    //   setVisibleModal(true);
    onOpen();
    setLoading(false);
  };

  const deleteHandle = async (info: any) => {
    setLoading(true);
    onClose();
    try {
      const result: any = await deleteCoutryCode(info);
      getData();
      if (result.message) {
        successToast("Country Code deleted successfully");
        setLoading(false);
      } else {
        setLoading(false);
        errorToast("Something went wrong");
      }
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


  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const getData = async () => {
    try {
      setLoading(true);
      const res = await getCountryCodes();
      console.log("----------------",res?.data)
      setData(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorToast("Something went wrong");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Navbar flag={false} brandText="Settings" />
      {loading ? (
        <Loader />
      ) : (
        <>
          <Card extra="w-full mt-4 pb-10 p-4 h-full">
            <header className="relative flex items-center justify-between">
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                {t("Country Code")}
              </div>
              <div>
                <button
                  className="my-sm-0 add-driver-button my-2 ms-1 bg-brand-500 dark:bg-brand-400"
                  type="submit"
                  onClick={() => navigate("/admin/settings/countrycode-form")}
                >
                  {t("Add Country Code")}
                </button>
              </div>
            </header>

            <div className="mt-4 overflow-x-scroll xl:overflow-x-hidden">
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      className="!border-px !border-gray-400"
                    >
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          colSpan={header.colSpan}
                          onClick={header.column.getToggleSortingHandler()}
                          className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-start"
                        >
                          <div className="flex gap-4 text-left text-xs text-gray-200">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() === "asc" ? (
                              <FaCaretUp
                                className="mr-[-6] font-bold text-gray-600"
                                size={20}
                              />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <FaCaretDown
                                size={20}
                                className="font-bold text-gray-600"
                              />
                            ) : (
                              <div className="mr-[-6] flex">
                                <FaCaretDown
                                  size={20}
                                  className="font-bold text-gray-600"
                                />
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                {data.length === 0 ? (
                  <tbody>
                    <tr>
                      <td
                        colSpan={columns.length}
                        style={{ textAlign: "center" }}
                      >
                        <h2 className="m-4" style={{ fontSize: "30px" }}>
                          {t("No Results!")}
                        </h2>
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {table
                      .getRowModel()
                      .rows?.slice(0, 10)
                      .map((row) => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="min-w-[135px] border-white/0 py-3 pr-4 text-start"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                )}
              </table>
            </div>
          </Card>
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
                    {'"' + selectedItem.countryCode + '"'}
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
                      onClick={() => deleteHandle(selectedItem?._id)}
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
    </>
  );
}

export default CountryCode;
const columnHelper = createColumnHelper<RowObj>();

