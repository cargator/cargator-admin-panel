import { MapContainer, TileLayer, Marker, Popup, Rectangle, Map, FeatureGroup, Circle, useMap } from 'react-leaflet';
import L, { bounds } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import React, { useEffect, useState, ReactNode } from "react";
import Card from "components/card";
import { deleteSpot } from 'services/customAPI';
import deleteIcon from '../../../../assets/svg/deleteIcon.svg'
import ButtonEdit from '../../../../assets/svg/ButtonEdit.svg'
import { toast } from 'react-toastify'
import '../map.css'
import './Spots.css'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import LocationPin from '../../../../assets/svg/LocationPin.svg'
import { useNavigate } from 'react-router-dom';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

const icon = L.icon({
  html: `<div class="custom-marker"><span>1</span></div>`,
  // iconUrl: LocationPin,
  className: 'custom-icon',
  iconSize: [40, 40]
})


const ResetCenterView = (props) => {
  const { position } = props;
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.setView(
        L.latLng(position[0], position[1]),
        map.getZoom(),
        {
          animate: true
        }
      )
    }
  }, [position])

  return null;
}


function ColumnsTable(props) {
  const { tableData, handleClickForDeleteModal } = props;
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState([19.07, 72.87]);

  const parser = new DOMParser();

  const customIcon = (number) => {
    return L.divIcon({
      html: `<div class="custom-marker" style="position: relative;">
                 <img src="${LocationPin}" class="icon-image" style="width: 100%; height: auto;">
                 <span class="number-overlay">${number}</span>
               </div>`,
      className: 'custom-icon',
      iconSize: [30, 30], // Adjust icon size as needed
    });

  };

  const columns = [
    columnHelper.accessor("spotName", {
      id: "spotName",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Spot Name
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white cursor-pointer" onClick={() => { setPositionForMap(info.row.original) }}>
          {info.getValue()}
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
              src={deleteIcon}
              onClick={() =>
                handleClickForDeleteModal(info.row.original)
              }
            />
          </div>
        </div>
      ),
    }),
  ]; // eslint-disable-next-line


  const setPositionForMap = (marker) => {
    // console.log("data", marker)
    const bounds = marker.bounds;

    // Create an object representing the center point
    const centerPoint = [bounds[0].lat, bounds[0].lng];

    setPosition(centerPoint)

    console.log("data111111", centerPoint);
  }

  useEffect(() => {
    console.log("po", position)
  }, [position])




  const [data, setData] = useState([...tableData]);

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





  return (
    <Card extra={"w-full pb-0 p-4 bg-white rounded-lg pt-0 pe-0 h-[700px] mt-5 mb-5 grid grid-cols-12 gap-4"}>
      {/* Header */}
      <header className="relative flex items-center justify-between col-span-12">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Spots
        </div>
        <div>
          <button
            className="my-sm-0 add-driver-button my-2 ms-1 bg-brand-500 dark:bg-brand-400 dark:text-white mr-4 mt-3"
            type="submit"
            onClick={() => navigate("/admin/spot/spot-form")}
          >
            Add Spots
          </button>
        </div>
      </header>

      {/* Left side - Table data */}
      <div className="col-span-5">
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
          {data.length == 0 ? (
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

      {/* Right side - Map container */}
      <div className="col-span-7 overflow-hidden">
        <div className="w-full h-full">
          <MapContainer center={position} zoom={12} className="z-10 leaf-Container-spot">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {data.map((marker, i) => {

              const bounds = marker.bounds;

              if (bounds[0]?.lat == undefined) {
                return
              }
              const centerPoint = [bounds[0]?.lat, bounds[0]?.lng];

              return (
                <Marker key={i} position={centerPoint} icon={customIcon(i + 1)}>
                  <Popup>
                    <div className="text-center">{marker.spotName}</div>
                  </Popup>
                </Marker>
              )
            })}
            <ResetCenterView position={position} />
          </MapContainer>
        </div>
      </div>

      {/* </div> */}
    </Card>

  )
}

export default ColumnsTable;
const columnHelper = createColumnHelper();