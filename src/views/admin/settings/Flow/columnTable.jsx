import React, { useEffect, useState } from "react";
import Card from "components/card";
import deleteIcon from "../../../../assets/svg/deleteIcon.svg";
import ButtonEdit from "../../../../assets/svg/ButtonEdit.svg";
import block from "../../../../assets/svg/block.svg";
import unblock from "../../../../assets/svg/unblock.svg";
import "./ColumnsTable.css";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Navigate, useNavigate } from "react-router-dom";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Navbar from "components/navbar";
import { toast } from "react-toastify";
import Loader from "components/loader/loader";
import {
  createAppFlowAPI,
  getFlow,
  updateAppFlowAPI,
} from "services/customAPI";

function ColumnsTable(props) {
  const { tableData, handleUpdate } = props;
  // console.log("tableData from index.js", tableData)
  const [sorting, setSorting] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedFlowOption, setSelectedFlowOption] = useState("default");
  const [isLoading, setIsLoading] = useState(false);
  const [AppFlowId, setAppFLowId] = useState();
  const [isDisabled, setIsDisabled] = useState(true)

  const handleOptionChange = (event) => {
    setSelectedFlowOption(event.target.value);
    console.log("[][][][][][]]", event.target.value);
    // createApplicationFlow(event.target.value);
  };

  const successToast = (message) => {
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

  const errorToast = (message) => {
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

  // APi to get Apllication flow for Driver
  const getApplicationFlow = async () => {
    setIsLoading(true);
    try {
      const res = await getFlow();
      setAppFLowId(res.data?._id);
      setSelectedFlowOption(res.data?.applicationFLow);
      console.log("respones:>>>>", res.data?._id);
      setIsLoading(false);
    } catch (error) {
      errorToast(error?.response?.data?.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  // APi to create Apllication flow for Driver
  const createApplicationFlow = async () => {
    setIsLoading(true);
    try {
      if (AppFlowId) {
        const data = { selectedFlowOption };
        console.log("qwaszdxfcgvhbjnkm", data, AppFlowId);
        const res = await updateAppFlowAPI(AppFlowId, data);
        console.log("respone:>>>>", res);
        setIsLoading(false);
      } else {
        const data = { selectedFlowOption };
        const res = await createAppFlowAPI(data);
        console.log("respone :>>>>", res);
        setIsLoading(false);
      }
    } catch (error) {
      errorToast(error.response?.data?.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  const columns = [
    columnHelper.accessor("breakingPointName", {
      id: "breakingPointName",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Flow Name
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white ">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("sqeuenceNo", {
      id: " sqeuenceNo",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Sequence No.
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
          Action
        </p>
      ),
      cell: (info) => {
        console.log("info", info.row.original.action.id);
        return (
          <div className="flex items-center">
            <div className="cursor-pointer">
              <img
                src={ButtonEdit}
                style={{ marginRight: "8px" }}
                onClick={() => handleUpdate(info.row.original.action.id)}
              />
            </div>
            {/* <div className="cursor-pointer">
              <img
                src={deleteIcon}
                onClick={() => handleClickForDeleteModal(info.row.original)}
              />
            </div> */}
          </div>
        );
      },
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
    getApplicationFlow();
    setData([...tableData]);
  }, [tableData]);

  // useEffect(() => { }, []);

  return (
    <>
      <Navbar flag={false} brandText="Settings" />
      {loading ? (
        <Loader />
      ) : (
        <>
          <Card extra="w-full mt-4 pb-10 p-4 h-full">
            {isLoading ? (
              <Loader />
            ) : (
              <div className="mb-5">
                <label
                  htmlFor="flow"
                  className="input-custom-label dark:text-white"
                >
                  Choose Application Flow
                </label>
                <div className="w-full justify-between  gap-5">
                  <label htmlFor="default" className="mr-8 ">
                    <input
                      type="radio"
                      id="default"
                      name="option"
                      value="default"
                      checked={selectedFlowOption === "default"}
                      onChange={handleOptionChange}
                      disabled={isDisabled}
                    />
                    <label className="ml-2">Default</label>
                  </label>
                  <label htmlFor="custom" className="mr-8">
                    <input
                      type="radio"
                      id="custom"
                      name="option"
                      value="custom"
                      checked={selectedFlowOption === "custom"}
                      onChange={handleOptionChange}
                      disabled={isDisabled}
                    />
                    <label className="ml-2">Custom</label>
                  </label>
                  <label htmlFor="custom" className="mr-8">
                    <input
                      type="radio"
                      id="petPuja"
                      name="option"
                      value="petPuja"
                      checked={selectedFlowOption === "petPuja"}
                      onChange={handleOptionChange}
                    />
                    <label className="ml-2">PetPuja</label>
                  </label>
                  <button
                    onClick={() => createApplicationFlow()}
                    className="save-button my-2 ms-1 bg-brand-500 dark:bg-brand-400 sm:my-0"
                  >
                    Save Flow
                  </button>
                </div>
              </div>
            )}
            <header className="relative flex items-center justify-between">
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Add Flows
              </div>
              {/* <div>
                <button
                  className="my-sm-0 add-driver-button my-2 ms-1 bg-brand-500 dark:bg-brand-400"
                  type="submit"
                  onClick={() => navigate("/admin/settings/flow-form")}
                >
                  Add Flows
                </button>
              </div> */}
            </header>

            <div className="mt-4 overflow-x-scroll xl:overflow-x-hidden">
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      className="!border-px !border-gray-400"
                    >
                      {headerGroup.headers.map((header) => {
                        return (
                          <th
                            key={header.id}
                            colSpan={header.colSpan}
                            onClick={(header.id!=='action' && header.id!=='actions') ? header.column.getToggleSortingHandler() : undefined}
                            className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-start"
                          >
                            <div className="flex gap-4 text-left text-xs text-gray-200">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {(header.id!=='action' && header.id!=='actions') &&
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
                      <td
                        colSpan={columns.length}
                        style={{ textAlign: "center" }}
                      >
                        <h2 className="m-4" style={{ fontSize: "30px" }}>
                          No Results!
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
        </>
      )}
    </>
  );
}

export default ColumnsTable;
const columnHelper = createColumnHelper();
