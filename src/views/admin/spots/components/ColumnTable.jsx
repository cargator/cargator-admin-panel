import { MapContainer, TileLayer, Marker, Popup, Rectangle, Map, FeatureGroup, Circle, useMap } from 'react-leaflet';
import L, { bounds } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation();
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
          {t("Spot Name")}
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
          {t("Vehicle Number")}
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
          {t("Action")}
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

  }

  useEffect(() => {
    // console.log("po", position)
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
          {t("Spots")}
        </div>
        <div>
          <button
            className="my-sm-0 add-driver-button my-2 ms-1 bg-brand-500 dark:bg-brand-400 dark:text-white mr-4 mt-3"
            type="submit"
            onClick={() => navigate("/admin/spot/spot-form")}
          >
            {t("Add Spots")}
          </button>
        </div>
      </header>

      {/* Left side - Table data */}
      <div className="col-span-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-start">
              <th className="cursor-pointer px-4 py-2 text-left">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="text-sm font-bold text-gray-600 dark:text-white">{t("Sr. No")}</span>
                </div>
              </th>
              {table.getHeaderGroups().map((headerGroup) => (
                <React.Fragment key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer px-4 py-2 text-left"
                    >
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
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
                  ))}
                </React.Fragment>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-4">
                  <h2 className="text-xl text-gray-500">{t("No Results!")}</h2>
                </td>
              </tr>
            ) : (
              <>
                {table.getRowModel().rows?.slice(0, 10).map((row, index) => (
                  <tr key={row.id}>
                    <td className="px-4 py-2 text-left">{index + 1}</td>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-2 text-left">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>

      </div>

      {/* Right side - Map container */}
      <div className="col-span-6 overflow-hidden">
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