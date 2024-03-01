import React, { useEffect, useState, ReactNode } from "react";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import Select, { components, DropdownIndicatorProps } from "react-select";
import eyeview from "../../../../assets/svg/eyeView.svg";
import completedRide from "../../../../assets/svg/completedRide.svg";
import cancelRide from "../../../../assets/svg/cancelRide.svg";
import ongoingRide from "../../../../assets/svg/ongoingRide.svg";
import filterIcon from "../../../../assets/svg/filterIcon.svg";
import arrow_down from "../../../../assets/svg/arrow_down.svg";
import whatsApp_logo from "../../../../assets/images/Logo-WhatsApp.png"
import android_logo from "../../../../assets/images/android_logo.png"
import ios_logo from "../../../../assets/images/ios_logo.png"
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
  logo: string;
  bookingDate: string;
  bookingTime: string;
  riderMobileNum: string;
  DriverMobileNum: string;
  fare: number;
  status: string;
  platform: string;
  origin: string;
  destination: string;
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
  rideStatus: string;
}) {
  const { tableData, statusOptions, setRideStatus, rideStatus } = props;
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columns = [
    columnHelper.accessor("platform", {
      id: "logo",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Source
        </p>
      ),
      cell: (info: any) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()==="whatsApp" ? <img src={whatsApp_logo} alt="whatsApp_logo" width={30} height={30}/> : info.getValue()==="android" ? <img src={android_logo} alt="android_logo" width={30} height={30}/> : info.getValue()==="ios"  ? <img src={ios_logo} alt="whatsApp_logo" width={30} height={30}/> : ""}
        </p>
      ),
    }),
    columnHelper.accessor("bookingDate", {
      id: "bookingDate",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Booking Date
        </p>
      ),
      cell: (info: any) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("bookingTime", {
      id: "bookingTime",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Booking Time
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("riderMobileNum", {
      id: "riderMobileNum",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Rider Mobile No.
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
          Driver Mobile No.
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("fare", {
      id: "fare",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Fare</p>
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
          Status
        </p>
      ),
      cell: (info) => (
        // <div className="flex items-center">
        //   {getStatusImage(info.row.original.status)}
        //   <p className="ml-2 text-sm font-bold text-navy-700 dark:text-white">
        //     {info.getValue()}
        //   </p>
        // </div>
        <div className="flex items-center">
          {info.getValue() === "completed" ? (
            <img src={completedRide} height={25} width={25} alt="Completed" />
          ) : info.getValue() === "cancelled" || info.getValue() === "Failed" ? (
            <img src={cancelRide} height={25} width={25} alt="Canceled" />
          ) : (
            <img
              src={ongoingRide}
              height={21}
              width={21}
              alt="Ongoing"
              className="me-1"
            />
          )}
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {" "}
            {info.getValue().charAt(0).toUpperCase() +
                            info.getValue()?.slice(1)}
            {/* {info.getValue()} */}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("origin", {
      id: "origin",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Origin
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()?.slice(0, 15)}...
        </p>
      ),
    }),
    columnHelper.accessor("destination", {
      id: "destination",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Destination
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
        <p className="text-sm font-bold text-gray-600 dark:text-white">View</p>
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
            onClick={() => navigate(`/admin/rides/ridedetails/${info.getValue()}`)}
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
    <div className="flex items-center justify-between" style={{cursor:'pointer'}} {...props}>
      <img src={filterIcon} className="ml-3" height={20} width={20} />
      {children}
    </div>
  );

  const arrowdown = () => (
    <div className="flex items-center justify-between" style={{cursor:'pointer'}}>
      <img src={arrow_down} className="mr-3" height={15} width={15} />
    </div>
  );

  useEffect(() => {
    setData([...tableData]);
  }, [tableData]);

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Rides
        </div>
        <div style={{ width: "200px" }}>
          <Select
            isSearchable={false}
            // className="w-400"
            className="custom-select"
            options={statusOptions}
            onChange={(e: any) => {
              setRideStatus(e.value);
            }}
            value={statusOptions.filter(function (option: any) {
              return option.value === rideStatus;
            })}
            name="rideStatus"
            styles={{
              // Fixes the overlapping problem of the component
              menu: (provided: any) => ({ ...provided, zIndex: 9999 }),
              option: (provided: any, state: any) => ({
                ...provided,
                backgroundColor: state.isSelected ? "#f2f3f7" : "white", // Change the background color here
                cursor:'pointer',
                color: "black", // Change the text color herevscode-file://vscode-app/c:/Users/codeb/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html
                "&:hover": {
                  backgroundColor: "#f2f3f7", // Change the background color on hover
                },
              }),
              // control: (base: any) => ({
              //   ...base,
              //   flexDirection: 'row-reverse',
              // })
            }}
            components={{
              DropdownIndicator: arrowdown,
              IndicatorSeparator: () => null,
              ValueContainer: filter,
            }}
          />
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
                        {/* {{
                          asc: "",
                          desc: "",
                        }[header.column.getIsSorted() as string] ?? null} */}
                         {
                          <>
                            {header.column.getIsSorted() === "asc" ? (
                              <FaCaretUp className="mr-[-6] text-gray-600 font-bold" size={20} />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <FaCaretDown size={20} className="text-gray-600 font-bold" />
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
