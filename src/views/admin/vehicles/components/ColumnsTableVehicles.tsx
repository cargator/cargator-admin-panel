import React, { useEffect, useState } from "react";
import Card from "components/card";
import ButtonEdit from "../../../../assets/imgesDriver/ButtonEdit.svg";
import DeleteIcon from "../../../../assets/imgesDriver/deleteIcon.svg";
import completedRide from "../../../../assets/svg/completedRide.svg";
import cancelRide from "../../../../assets/svg/cancelRide.svg";
import "../vehicles.css";
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
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
type RowObj = {
  vehicleName: customFieldType1;
  vehicleNumber: string;
  vehicleType: string;
  vehicleStatus: string;
  action: customFieldType2;
};

type customFieldType1 = {
  name: string;
  path:string;
}


type customFieldType2 = {
  id: string;
  documentsKey?: string[];
  profileImageKey?: string;
}

const columnHelper = createColumnHelper<RowObj>();
// type vehicleType = {
//   label: string;
//   value: string;
// };
function ColumnsTableVehicles(props: {
  tableData: any;
  // vehicleTypes: vehicleType[];
  // setVehicleStatus: (val: string) => void;
  // vehicleStatus: string;
  handleClickForDeleteModal: (data: any) => void;
}) {
  const { tableData, handleClickForDeleteModal } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const navigate = useNavigate(); // Create a history object
  const handleEditClick = (vehicleId: string) => {
    // Redirect to the VehicleForm page with the vehicle ID as a parameter
    navigate(`../vehicles/vehicleform/${vehicleId}`);
  };
  const columns = [
    columnHelper.accessor("vehicleName", {
      id: "vehicleName",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Vehicle Nickname
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
                {info.getValue()?.name.slice(0, 1).toUpperCase()}
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
    columnHelper.accessor("vehicleNumber", {
      id: "vehicleNumber",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Vehicle Number
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("vehicleType", {
      id: "vehicleType",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Vehicle Type
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("vehicleStatus", {
      id: "vehicleStatus",
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
          {/* {info.getValue() === "available" ? (
            <img src={completedRide} height={25} width={25} alt="Available" />
          ) : (
            <img src={cancelRide} height={25} width={25} alt="Unavailable" />
          )} */}
          <p
            className={
              info.getValue() === "available"
                ? "onlineClass text-sm font-bold text-navy-700 "
                : "offlineClass text-sm font-bold text-navy-700 "
            }
          >
            {" "}
            {info.getValue() === "available" ? "Available" : "Assigned"}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("action", {
      id: "action",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Actions
        </p>
      ),
      cell: (info) => (
        // <p className="text-sm font-bold text-navy-700 dark:text-white">
        //   <img src={eyeview} height={30} width={30} />
        // </p>
        <div className="flex items-center">
          <img
            src={ButtonEdit}
            className="button-edit me-2"
            onClick={() => handleEditClick(info.row.original.action.id)}
            height={30}
            width={30}
          />
          <img
            src={DeleteIcon}
            className="button-delete"
            onClick={() => handleClickForDeleteModal(info.row.original)}
            height={30}
            width={30}
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
  useEffect(() => {
    setData([...tableData]);
  }, [tableData]);
  const vehicleForm = () => {
    navigate("../vehicles/vehicleform");
  };
  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Vehicles
        </div>
        <div>
           <Button
            type="submit"
            className="my-sm-0 add-driver-button my-2 ms-1 bg-brand-500 dark:bg-brand-400 dark:text-white"
            onClick={vehicleForm}
          >
            Add Vehicle
          </Button>
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
                      className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-start"
                    >
                      <div className="flex gap-4 text-xs text-gray-200">
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
                .rows.slice(0, 10)
                .map((row) => {
                  // console.log("object row :>> ", row);
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td
                            key={cell.id}
                            className="min-w-[20%] border-white/0 py-3 pr-4 text-start"
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
export default ColumnsTableVehicles;
