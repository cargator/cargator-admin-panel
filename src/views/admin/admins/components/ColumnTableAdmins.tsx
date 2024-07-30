import React, { useEffect, useState } from "react";
import Card from "components/card";
import deleteIcon from "../../../../assets/svg/deleteIcon.svg";
import ButtonEdit from "../../../../assets/svg/ButtonEdit.svg";
import block from "../../../../assets/svg/block.svg";
import unblock from "../../../../assets/svg/unblock.svg";
import admin from "../../../../assets/svg/admin-icon.svg";


// import "./ColumnsTable.css";
import { useTranslation } from "react-i18next";

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
import { useSelector } from "react-redux";

type RowObj = {
  name: string;
  mobile_Number: string;
  email: string;
  action:  customFieldType2;
};
type customFieldType2 = {
  id: string;
  status:string;
  // documentsKey?: string[];
  // profileImageKey?: string;
};

function ColumnsTableAdmins(props: {
  tableData: any;
  handleClickForDeleteModal: (data: any) => void;
  makeSuperAdmin : (data: any) => void;
  updateAdmin : (data: any) => void;
}) {
  const { tableData, handleClickForDeleteModal,makeSuperAdmin ,updateAdmin} = props;
  console.log("31425674938274838", tableData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const superAdmin = useSelector((store: any) => store.auth.super_Admin);
  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Admin Name")}
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
              {/* <img
                  src={info.getValue()?.path}
                  style={{
                    objectFit: "fill",
                    height: "100%",
                    width: "auto",
                    borderRadius: "4px",
                  }}
                  alt="img"
                /> */}
            </div>
          )}

          <span className="dark:text-white">{info.getValue()}</span>
        </p>
      ),
    }),
    columnHelper.accessor("mobile_Number", {
      id: "mobile_Number",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("mobile_Number")}
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("email", {
      id: "email",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("email")}
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
          {t(superAdmin?"Actions":"Status")}
        </p>
      ),
      cell: (info) => ( (superAdmin &&
        // <p className="text-sm font-bold text-navy-700 dark:text-white">
        //   <img src={eyeview} height={30} width={30} />
        // </p>
        <div className="flex items-center">
          <img
              src={ButtonEdit}
              className="button-edit me-2"
              onClick={() => updateAdmin(info.row.original.action.id)}
              height={30}
              width={30}
            />
          <img
            src={deleteIcon}
            className="button-delete"
            onClick={() => handleClickForDeleteModal(info.row.original)}
            height={30}
            width={30}
          />
          <img
            src={admin}
            className="button-delete"
            onClick={() => makeSuperAdmin(info.row.original)}
            height={30}
            width={30}
            style={{marginLeft:'1rem'}}
          />
        </div>)
      ),
    })
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
  
  const logs=(a:any)=>{
    console.log(a);
    return true
    
  }

  useEffect(() => {
    setData([...tableData]);
  }, [tableData]);

  useEffect(() => {}, []);

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          {t("Admins")}
        </div>
        {/* <div>
            <button
              className="my-sm-0 add-driver-button my-2 ms-1 bg-brand-500 dark:bg-brand-400"
              type="submit"
              onClick={() => navigate("/admin/drivers/driverform")}
            >
              {t("Add Rider")}
            </button>
          </div> */}
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
