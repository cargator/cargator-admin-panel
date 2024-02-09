import React, { useEffect, useState } from "react";
import Card from "components/card";
import deleteIcon from "../../../assets/svg/deleteIcon.svg";
import ButtonEdit from "../../../assets/svg/ButtonEdit.svg";

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
import { deleteVehicleType, getVehicleTypeList } from "services/customAPI";
import Loader from "components/loader/loader";
import { toast } from "react-toastify";

type RowObj = {
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  action : string;
};

function VehicleTypeList() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  
  const columns = [
    columnHelper.accessor("vehicleMake", {
      id: "vehicleMake",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Vehicle Make
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("vehicleModel", {
      id: "vehicleModel",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Vehicle Model
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
    columnHelper.accessor("action", {
      id: "action",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Action
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          <div className="cursor-pointer">
            <img
              src={ButtonEdit}
              style={{ marginRight: "8px" }}
              onClick={() =>
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

  const handleClickForDeleteModal = async (data: any) => {
    setLoading(true);
    const result: any = await deleteVehicleType(data?._id);
    getData();
    if (result.message) {
      successToast("VehicleType deleted successfully");
      setLoading(false);
    } else {
      setLoading(false);
      errorToast("Something went wrong");
    }
  };

  const handleUpdate = (data: any) =>{
    const id = data._id;
    navigate(`/admin/settings/vehicletypeform/${id}`)
  }

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

  const getData = async() => {
    try {
      setLoading(true);
      const res = await getVehicleTypeList();
      setData(res.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      errorToast("Something went wrong");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Navbar flag={false} brandText="Settings" />
      {loading ? (
        <Loader />
      ) : (
        <Card extra="w-full mt-4 pb-10 p-4 h-full">
          <header className="relative flex items-center justify-between">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              Vehicles Details
            </div>
            <div>
              <button
                className="my-sm-0 add-driver-button my-2 ms-1 bg-brand-500 dark:bg-brand-400"
                type="submit"
                onClick={() => navigate("/admin/settings/vehicletypeform")}
              >
                Add Vehicle Type
              </button>
            </div>
          </header>

          <div className="mt-4 overflow-x-scroll xl:overflow-x-hidden">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="!border-px !border-gray-400">
                    {headerGroup.headers.map((header) => (
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
                          {header.column.getIsSorted() === "asc" ? (
                            <FaCaretUp className="mr-[-6] text-gray-600 font-bold" size={20} />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <FaCaretDown size={20} className="text-gray-600 font-bold" />
                          ) : (
                            <div className="flex mr-[-6]">
                              <FaCaretDown size={20} className="text-gray-600 font-bold" />
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
                    <td colSpan={columns.length} style={{ textAlign: "center" }}>
                      <h2 className="m-4" style={{ fontSize: "30px" }}>
                        No Results!
                      </h2>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {table.getRowModel().rows?.slice(0, 10).map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="min-w-[135px] border-white/0 py-3 pr-4 text-start"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </Card>
      )}
    </>
  );
};

export default VehicleTypeList;
const columnHelper = createColumnHelper<RowObj>();
