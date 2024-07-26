import React, { useEffect, useState } from "react";
import Card from "components/card";
import deleteIcon from "../../../../assets/svg/deleteIcon.svg";
import ButtonEdit from "../../../../assets/svg/ButtonEdit.svg";
import block from "../../../../assets/svg/block.svg";
import unblock from "../../../../assets/svg/unblock.svg";
import "./ColumnsTable.css";
import { useTranslation } from 'react-i18next'

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

type RowObj = {
  fullName: customFieldType1;
  mobileNumber: string;
  vehicleNumber: string;
  vehicleType: string;
  status: string;
  action: customFieldType2;
};

type customFieldType1 = {
  name: string;
  path: string;
};

type customFieldType2 = {
  driverStatus: string;
  id: String;
  documentsKey?: String[];
  profileImageKey?: String;
};

type statusOption = {
  label: string;
  value: string;
};

function ColumnsTable(props: {
  tableData: any;
  handleClickForDeleteModal: (data: any) => void;
  handleToggleForStatusMOdal: (data: any) => void;
}) {
  const { tableData, handleClickForDeleteModal, handleToggleForStatusMOdal } =
    props;
    console.log("31425674938274838", tableData)
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { t } = useTranslation(); 
  const navigate = useNavigate();
  const columns = [
    columnHelper.accessor("fullName", {
      id: "fullName",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Full Name")}
        </p>
      ),
      cell: (info: any) => (
        <p
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
                marginRight: "6px",
                alignItems: "center",
              }}
            >
              <img
                src={info.getValue()?.path}
                style={{
                  objectFit: "fill",
                  height: "100%",
                  width: "auto",
                  borderRadius: "4px",
                }}
                alt="img"
              />
            </div>
          )}

          <span className="dark:text-white">{info.getValue()?.name}</span>
        </p>
      ),
    }),
    columnHelper.accessor("mobileNumber", {
      id: "mobileNumber",
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
    columnHelper.accessor("vehicleNumber", {
      id: "vehicleNumber",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Vehicle Number")}
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue() === "   " ? "NA" : info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("vehicleType", {
      id: "vehicleType",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Vehicle Type")}
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue() === "" ? "NA" : info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Status")}
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          <p
            className={
              info.getValue() === "online"
                ? "onlineClass text-sm font-bold text-navy-700 "
                : info.getValue() === "offline"
                ? "offlineClass text-sm font-bold text-navy-700 "
                : "onrideClass text-sm font-bold text-navy-700 "
            }
          >
            {" "}
            {info.getValue()?.charAt(0).toUpperCase() +
              info.getValue()?.slice(1)}
            {/* {info.getValue()} */}
          </p>
        </div>
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
          {/* {info.getValue()?.driverStatus === "active" ? (
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
          )} */}

          <div className="cursor-pointer">
            <img
              src={ButtonEdit}
              style={{ marginRight: "8px" }}
              onClick={() =>
                navigate(`/admin/drivers/driverform/${info.getValue()?.id}`)
              }
            />
          </div>
          {/* <div className="cursor-pointer">
            <img
              src={deleteIcon}
              onClick={() => handleClickForDeleteModal(info.row.original)}
            />
          </div> */}
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
    setData([...tableData]);
  }, [tableData]);

  useEffect(() => {}, []);

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          {t("Riders")}
        </div>
        <div>
          <button
            className="my-sm-0 add-driver-button my-2 ms-1 bg-brand-500 dark:bg-brand-400"
            type="submit"
            onClick={() => navigate("/admin/drivers/driverform")}
          >
            {t("Add Rider")}
          </button>
        </div>
        {/* <CardMenu /> */}
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
                      <div className="flex gap-4 text-xs text-gray-200 text-left">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {
                          <>
                            {header.column.getIsSorted() === "asc" ? (
                              <FaCaretUp className="mr-[-6] text-gray-600 font-bold" size={20} />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <FaCaretDown size={20} className="text-gray-600 font-bold"/>
                            ) : (
                              <div className="flex mr-[-6]">
                               <FaCaretDown size={20} className="text-gray-600 font-bold" />
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

export default ColumnsTable;
const columnHelper = createColumnHelper<RowObj>();
