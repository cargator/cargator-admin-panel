import React, { useEffect, useState } from "react";
import Card from "components/card";
import deleteIcon from "../../../../../assets/svg/deleteIcon.svg";
import ButtonEdit from "../../../../../assets/svg/ButtonEdit.svg";
import block from "../../../../../assets/svg/block.svg";
import unblock from "../../../../../assets/svg/unblock.svg";
import admin from "../../../../../assets/svg/admin-icon.svg";
import eyeview from "../../../../../assets/svg/eyeView.svg";

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
import { ActivityAction } from "helper/activity.enum";

type RowObj = {
  _id: string;
  createdAt: string;
  action: customFieldType2;
};
type customFieldType2 = {
  id: string;
  status: string;
};

function ColumnsTableActivity(props: { tableData: any }) {
  const {
    tableData,
    // handleClickForDeleteModal,
    // handleToggleForStatusMOdal,
    // handleUpdate,
  } = props;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const columns = [
    columnHelper.accessor("_id", {
      id: "_id",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Activity")}
        </p>
      ),
      cell: (info: any) => (
        <div
          className="text-navy-700"
          style={{ display: "flex", alignItems: "center" }}
        >
          <span className="flex">
            <p className="mr-1 font-bold">
              {data[info.row.index].admin.name + " "}{" "}
            </p>
            <p>
              {` has ${ActivityAction[data[info.row.index].action]} ${
                data[info.row.index].subject
              }`}
            </p>
          </span>
        </div>
      ),
    }),

    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Date")}
        </p>
      ),
      cell: (info) => (
        <p className="text-navy-700 dark:text-white">
          {new Date(info.getValue()).toDateString()}{" "}
          {new Date(info.getValue()).toLocaleTimeString()}
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
          <div className="cursor-pointer">
            <img
              style={{ marginRight: "8px", marginLeft: "5px" }}
              src={eyeview}
              onClick={() => {
                navigate(`${data[info.row.index]._id}`);
              }}
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
    setData([...tableData]);
  }, [tableData]);

  useEffect(() => {}, []);

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <header className="flex items-center justify-between px-2">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Activities
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

export default ColumnsTableActivity;
const columnHelper = createColumnHelper<RowObj>();
