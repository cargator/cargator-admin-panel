import React, { useEffect, useState } from "react";
import Card from "components/card";
import deleteIcon from "../../../../../assets/svg/deleteIcon.svg";
import ButtonEdit from "../../../../../assets/svg/ButtonEdit.svg";
import block from "../../../../../assets/svg/block.svg";
import unblock from "../../../../../assets/svg/unblock.svg";
import admin from "../../../../../assets/svg/admin-icon.svg";

import { useTranslation } from "react-i18next";

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
import { useSelector } from "react-redux";
import Loader from "components/loader/loader";
import { createMapFLow, getCurrentMap, updateCurrentMap } from "services/customAPI";
import { toast } from "react-toastify";

type RowObj = {
  name: string;
  mobile_Number: string;
  email: string;
  status: string;
  action: customFieldType2;
};
type customFieldType2 = {
  id: string;
  status: string;
};

function ColumnsTableAdmins(props: {
  tableData: any;
  handleClickForDeleteModal: (data: any) => void;
  handleToggleForStatusMOdal: (data: any) => void;
  handleUpdate: (data: any) => void;
}) {
  const {
    tableData,
    handleClickForDeleteModal,
    handleToggleForStatusMOdal,
    handleUpdate,
  } = props;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedFlowOption, setSelectedFlowOption] = useState("default");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMapID, setCurrentMapID] = useState();
  const [isDisabled, setIsDisabled] = useState(true)
  const { t } = useTranslation();
  const navigate = useNavigate();
  const superAdmin = useSelector((store: any) => store.auth.super_Admin);



  const successToast = (message: any) => {
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

  const errorToast = (message: any) => {
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

  const handleOptionChange = (event: any) => {
    setSelectedFlowOption(event.target.value);
    console.log("[][][][][][]]", event.target.value);
    // createApplicationFlow(event.target.value);
  };


    // APi to create Apllication flow for Driver
    const handleSelectedMap = async () => {
      setIsLoading(true);
      try {
        if (currentMapID) {
          const data = { selectedFlowOption };
          console.log("qwaszdxfcgvhbjnkm", data, currentMapID);
          const res = await updateCurrentMap(currentMapID, data);
          console.log("respone:>>>>", res);
          setIsLoading(false);
        } else {
          const data = { selectedFlowOption };
          const res = await createMapFLow(data);
          console.log("respone :>>>>", res);
          setIsLoading(false);
        }
      } catch (error: any) {
        errorToast(error.response?.data?.message || "Something went wrong");
        setIsLoading(false);
      }
    };

    const getCurrentMapFLow = async () => {
      setIsLoading(true);
      try {
        const res = await getCurrentMap();
        setCurrentMapID(res.data?._id);
        setSelectedFlowOption(res.data?.applicationFLow);
        console.log("respones:>>>>", res.data?._id);
        setIsLoading(false);
      } catch (error: any) {
        errorToast(error?.response?.data?.message || "Something went wrong");
        setIsLoading(false);
      }
    };

  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("User Name")}
        </p>
      ),
      cell: (info: any) => (
        <div
          className="text-sm font-bold text-navy-700"
          style={{ display: "flex", alignItems: "center" }}
        >
          {info.getValue()?.path === "" ? (
            <div
              style={{
                width: "40px",
                height: "40px",
                padding: "1px",
                borderRadius: "4px",
                display: "inline-block",
                marginRight: "6px",
                backgroundColor: "#F4F7FE",
              }}
            >
              <span
                style={{
                  position: "relative",
                  left: "14px",
                  top: "8.5px",
                  fontSize: "18px",
                }}
              >
                {info.getValue()?.name?.slice(0, 1).toUpperCase()}
              </span>
            </div>
          ) : (
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "4px",
                display: "inline-block",
                // marginRight: "6px",
                alignItems: "center",
              }}
            ></div>
          )}

          <span className="dark:text-white">{info.getValue()}</span>
        </div>
      ),
    }),

    columnHelper.accessor("mobile_Number", {
      id: "mobile_Number",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Mobile Number")}
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),

    // columnHelper.accessor("email", {
    //   id: "email",
    //   header: () => (
    //     <p className="text-sm font-bold text-gray-600 dark:text-white">
    //       {t("email")}
    //     </p>
    //   ),
    //   cell: (info) => (
    //     <p className="text-sm font-bold text-navy-700 dark:text-white">
    //       {info.getValue()}
    //     </p>
    //   ),
    // }),

    columnHelper.accessor("action", {
      id: "action",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Action")}
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          {info.row.original.status === "active" ? (
            <div className="cursor-pointer">
              <img
                style={{ marginRight: "8px", marginLeft: "5px" }}
                src={unblock}
                onClick={() => {
                  handleToggleForStatusMOdal(info.row.original);
                }}
              />
            </div>
          ) : (
            <div className="cursor-pointer">
              <img
                style={{ marginRight: "8px", marginLeft: "5px" }}
                src={block}
                onClick={() => {
                  handleToggleForStatusMOdal(info.row.original);
                }}
              />
            </div>
          )}
          <div className="cursor-pointer">
            <img
              src={ButtonEdit}
              style={{ marginRight: "8px" }}
              onClick={() =>
                // navigate(`/admin/settings/users-form/${info.getValue()?.id}`)
                handleUpdate(info.row.original)
              }
            />
          </div>
          <div className="cursor-pointer">
            <img
              src={deleteIcon}
              onClick={() => handleClickForDeleteModal(info.row.original)}
            />
          </div>
        </div>
      ),
    }),
  ]; // eslint-disable-next-line
  const [data, setData] = React.useState([...tableData]);
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

  useEffect(() => {
    getCurrentMapFLow()
    setData([...tableData]);
  }, [tableData]);

  useEffect(() => {}, []);

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      {isLoading ? (
              <Loader />
            ) : (
              <div className="mb-5">
                <label
                  htmlFor="flow"
                  className="input-custom-label dark:text-white"
                >
                  Choose Map 
                </label>
                <div className="w-full justify-between  gap-5">
                  <label htmlFor="default" className="mr-8 ">
                    <input
                      type="radio"
                      id="google"
                      name="option"
                      value="google"
                      checked={selectedFlowOption === "google"}
                      onChange={handleOptionChange}
                      // disabled={isDisabled}
                    />
                    <label className="ml-2">Google</label>
                  </label>
                  <label htmlFor="custom" className="mr-8">
                    <input
                      type="radio"
                      id="olaMap"
                      name="option"
                      value="olaMap"
                      checked={selectedFlowOption === "olaMap"}
                      onChange={handleOptionChange}
                      // disabled={isDisabled}
                    />
                    <label className="ml-2">OlaMap</label>
                  </label>
                  <button
                    onClick={() => handleSelectedMap()}
                    className="save-button my-2 ms-1 bg-brand-500 dark:bg-brand-400 sm:my-0"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          {t("Users")}
        </div>
        <div>
          <button
            className="save-button my-2 ms-1 bg-brand-500 dark:bg-brand-400 sm:my-0"
            onClick={() => navigate("/admin/settings/users-form")}
          >
            Create User
          </button>
        </div>
      </header>

      <div className="mt-4 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
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
                        {
                          <>
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
                          </>
                        }
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          {tableData.length == 0 ? (
            <tbody>
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
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
                .map((row) => {
                  // console.log("object row :>> ", row);
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td
                            key={cell.id}
                            className="min-w-[135px] border-white/0 py-3 pr-4 text-start"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          )}
        </table>
      </div>
    </Card>
  );
}

export default ColumnsTableAdmins;
const columnHelper = createColumnHelper<RowObj>();
