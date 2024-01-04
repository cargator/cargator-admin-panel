import React, { useEffect, useState } from "react";
import Card from "components/card";
import ButtonEdit from "../../../../assets/imgesDriver/ButtonEdit.svg";
import DeleteIcon from "../../../../assets/imgesDriver/deleteIcon.svg";
import block from "../../../../assets/svg/block.svg";
import unblock from "../../../../assets/svg/unblock.svg";
import "../riders.css";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

type RowObj = {
  _id: string;
  name: string;
  mobileNumber: string;
  totalRidesCompleted: string;
  status: string;
  action: string;
};

type customFieldType = {
  status: string;
  id: String;
};

type statusOption = {
  label: string;
  value: string;
};

const columnHelper = createColumnHelper<RowObj>();

function ColumnsTableRiders(props: {
  tableData: any;
  handleClickForDeleteModal: (data: any) => void;
  handleToggleForStatusModal: (data: any) => void;
}) {
  const { tableData, handleClickForDeleteModal, handleToggleForStatusModal } =
    props;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const navigate = useNavigate();

  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: () => (
        <p className="text-start text-sm font-bold text-gray-600 dark:text-white">
          Rider Name
        </p>
      ),
      cell: (info: any) => (
        <p
          className="text-start text-sm font-bold text-navy-700"
          style={{ display: "flex", alignItems: "center" }}
        >
          {/* {info.getValue()} */}
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
              {info.getValue() ? info.getValue().slice(0, 1).toUpperCase() : ""}
            </span>
          </div>
          <span className="dark:text-white">{info.getValue()}</span>
        </p>
      ),
    }),
    columnHelper.accessor("mobileNumber", {
      id: "n=mobileNumber",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Mobile Number
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("totalRidesCompleted", {
      id: "totalRidesCompleted",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Total Rides Completed
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: () => (
        <p className="text-start text-sm font-bold text-gray-600 dark:text-white">
          Actions
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          {info.getValue() === "active" ? (
            <div className="cursor-pointer">
              <img
                style={{ marginRight: "8px", marginLeft: "5px" }}
                src={unblock}
                onClick={() => {
                  handleToggleForStatusModal(info.row.original);
                }}
              />
            </div>
          ) : (
            <div className="cursor-pointer">
              <img
                style={{ marginRight: "8px", marginLeft: "5px" }}
                src={block}
                onClick={() => {
                  handleToggleForStatusModal(info.row.original);
                }}
              />
            </div>
          )}
          <div className="cursor-pointer">
            <img
              src={DeleteIcon}
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
    setData([...tableData]);
    console.log("Table length", tableData.length);
  }, [tableData]);

  console.log("Table length", tableData.length);

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Riders
        </div>
      </header>
      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
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
                      className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4"
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "",
                          desc: "",
                        }[header.column.getIsSorted() as string] ?? null}
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
                    No Results!
                  </h2>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, 10)
                .map((row) => {
                  // console.log("object row :>> ", row);
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td
                            key={cell.id}
                            className="min-w-[20%] border-white/0 py-3 pr-4"
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

export default ColumnsTableRiders;
