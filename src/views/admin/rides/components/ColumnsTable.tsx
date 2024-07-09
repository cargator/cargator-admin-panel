import React, { useEffect, useState, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import Select, { components, DropdownIndicatorProps } from "react-select";
import eyeview from "../../../../assets/svg/eyeView.svg";
import completedRide from "../../../../assets/svg/completedRide.svg";
import cancelRide from "../../../../assets/svg/cancelRide.svg";
import ongoingRide from "../../../../assets/svg/ongoingRide.svg";
import filterIcon from "../../../../assets/svg/filterIcon.svg";
import arrow_down from "../../../../assets/svg/arrow_down.svg";
import "../rides.css";
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

type RowObj = {
  orderDate: string;
  orderTime: string;
  customerMobileNum: string;
  DriverMobileNum: string;
  amount: number;
  status: string;
  pickUpLocation: string;
  dropLocation: string;
  view: string;
};

type statusOption = {
  label: string;
  value: string;
};

function ColumnsTable(props: {
  tableData: any;
  statusOptions: statusOption[];
  setRideStatus: (val: string) => void;
  orderStatus: string;
}) {
  const { tableData, statusOptions, setRideStatus, orderStatus } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columns = [
    columnHelper.accessor("orderDate", {
      id: "orderDate",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Order Date")}
        </p>
      ),
      cell: (info: any) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("orderTime", {
      id: "orderTime",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Order Time")}
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("customerMobileNum", {
      id: "customerMobileNum",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Cust. Mobile No.")}
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("DriverMobileNum", {
      id: "DriverMobileNum",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Driver Mobile No.")}
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue() == null ? "N/A" : ` + ${info.getValue()}`}
        </p>
      ),
    }),
    columnHelper.accessor("amount", {
      id: "amount",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Amount")}
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
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Status")}
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          {info.getValue() === "DELIVERED" ? (
            <img src={completedRide} height={25} width={25} alt="Completed" />
          ) : info.getValue() === "CANCELLED" ? (
            <img src={cancelRide} height={25} width={25} alt="Cancelled" />
          ) : (
            <img src={ongoingRide} height={25} width={25} alt="Ongoing" />
          )}
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {" "}
            {info.getValue().charAt(0).toUpperCase() +
              info.getValue()?.slice(1)}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("pickUpLocation", {
      id: "pickUpLocation",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Pick-Up Location")}
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()?.slice(0, 15)}...
        </p>
      ),
    }),
    columnHelper.accessor("dropLocation", {
      id: "dropLocation",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Drop Location")}
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()?.slice(0, 15)}...
        </p>
      ),
    }),
    columnHelper.accessor("view", {
      id: "view",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("View")}
        </p>
      ),
      cell: (info) => (
        // <p className="text-sm font-bold text-navy-700 dark:text-white">
        //   <img src={eyeview} height={30} width={30} />
        // </p>

        <div className="flex items-center">
          <img
            src={eyeview}
            height={30}
            width={30}
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(`/admin/rides/ridedetails/${info.getValue()}`)
            }
          />
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

  const filter = ({ children, ...props }: { children: ReactNode }) => (
    <div
      className="flex items-center justify-between"
      style={{ cursor: "pointer" }}
      {...props}
    >
      <img src={filterIcon} className="ml-3" height={20} width={20} />
      {children}
    </div>
  );

  const arrowdown = () => (
    <div
      className="flex items-center justify-between"
      style={{ cursor: "pointer" }}
    >
      <img src={arrow_down} className="mr-3" height={15} width={15} />
    </div>
  );

  useEffect(() => {
    setData([...tableData]);
  }, [tableData]);

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <header>
        <div className="w-90 flex justify-between">
          <div className="justify-between text-3xl font-bold text-navy-700 dark:text-white ">
            Orders
          </div>

          <div className="flex justify-between">
            <button
              className={`rounded-md bg-[rgba(43,122,11,1)] px-6 py-2 text-lg text-white `}
              onClick={() => {
                navigate("/admin/order/add");
              }}
            >
              Add Order
            </button>
            <div style={{ width: "200px", paddingLeft: "10%" }}>
              <Select
                isSearchable={false}
                // className="w-400"
                className="custom-select"
                // options={statusOptions}
                options={statusOptions.map((option) => ({
                  // Map over statusOptions to translate labels
                  ...option,
                  label: t(`${option.label}`), // Translate label
                  // value: t(`${option.label}`), // Translate value
                }))}
                onChange={(e: any) => {
                  setRideStatus(e.value);
                }}
                value={statusOptions.filter(function (option: any) {
                  return option.value === orderStatus;
                })}
                // value={statusOptions.find(option => option.value === rideStatus)} // Use find instead of filter
                name="rideStatus"
                // defaultValue={{ label: defaultLabel, value: rideStatus }} // Set the translated default value
                styles={{
                  // Fixes the overlapping problem of the component
                  menu: (provided: any) => ({ ...provided, zIndex: 9999 }),
                  option: (provided: any, state: any) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? "#f2f3f7" : "white", // Change the background color here
                    cursor: "pointer",
                    color: "black", // Change the text color herevscode-file://vscode-app/c:/Users/codeb/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html
                    "&:hover": {
                      backgroundColor: "#f2f3f7", // Change the background color on hover
                    },
                  }),
                }}
                components={{
                  DropdownIndicator: arrowdown,
                  IndicatorSeparator: () => null,
                  ValueContainer: filter,
                }}
              />
            </div>
          </div>
        </div>
        {/* <CardMenu /> */}
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
                      className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-start"
                    >
                      <div className="flex items-center justify-between text-xs text-gray-200">
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
                            className="min-w-[11.1%] border-white/0 py-3 pr-4 text-start"
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