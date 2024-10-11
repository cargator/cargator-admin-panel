import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Rectangle,
  FeatureGroup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState, useRef } from "react";
import Card from "components/card";
import { deleteSpot, getCurrentMap } from "services/customAPI";
import deleteIcon from "../../../../assets/svg/deleteIcon.svg";
import ButtonEdit from "../../../../assets/svg/ButtonEdit.svg";
import { toast } from "react-toastify";
import "../map.css";
import "./Spots.css";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import LocationPin from "../../../../assets/svg/LocationPin.svg";
import { useNavigate } from "react-router-dom";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import OlaMap from "../../../../assets/images/Ola_Map_logo.svg";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
const MapLibreMap = maplibregl.Map;
const NavigationControl = maplibregl.NavigationControl;
const olaMarker = maplibregl.Marker;

const icon = L.icon({
  html: `<div class="custom-marker"><span>1</span></div>`,
  // iconUrl: LocationPin,
  className: "custom-icon",
  iconSize: [40, 40],
});

const ResetCenterView = (props) => {
  const { position } = props;
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(L.latLng(position[0], position[1]), map.getZoom(), {
        animate: true,
      });
    }
  }, [position]);

  return null;
};

function ColumnsTable(props) {

  const { tableData, handleClickForDeleteModal, sortedBy, setSortedBy, isAscending, setIsAscending } = props;

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sorting, setSorting] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState([28.439990, 77.073380]);
  const [currentMap, setcurrentMap] = useState("olaMap");
  const mapContainerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const [markerPosition, setMarkerPostion] = useState([]);

  const parser = new DOMParser();

  const errorToast = (message) => {
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

  const customIcon = (number) => {
    return L.divIcon({
      html: `<div class="custom-marker" style="position: relative;">
                 <img src="${LocationPin}" class="icon-image" style="width: 100%; height: auto;">
                 <span class="number-overlay">${number}</span>
               </div>`,
      className: "custom-icon",
      iconSize: [30, 30], // Adjust icon size as needed
    });
  };

  const customIconOlaMap = (number) => {
    const markerElement = document.createElement('div');

    // Set innerHTML with the image and number overlay using a template literal
    markerElement.innerHTML = `
      <div class="custom-icon" style="position: relative;">
        <img src="${LocationPin}" class="icon-image" style="width: 100%; height: auto;">
        <span class="number-overlay">${number}</span>
      </div>
    `;

    markerElement.className = 'custom-icon'; // Optional, set additional classes if needed

    return markerElement;
  };

  const columns = [
    columnHelper.accessor("restaurantName", {
      id: "restaurantName",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {t("Restaurant Name")}
        </p>
      ),
      cell: (info) => (
        <p
          className="cursor-pointer text-sm font-bold text-navy-700 dark:text-white"
          onClick={() => {
            setPositionForMap(info.row.original);
          }}
        >
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
              onClick={() => handleClickForDeleteModal(info.row.original)}
            />
          </div>
        </div>
      ),
    }),
  ]; // eslint-disable-next-line

  const getCurrentMapFLow = async () => {
    setIsLoading(true);
    try {
      const res = await getCurrentMap();
      setcurrentMap(res.data?.currentMap);
      console.log("respones:>>>>", res.data);
    } catch (error) {
      errorToast(error?.response?.data?.message || "Something went wrong");
    }
    setIsLoading(false);
  };

  const setPositionForMap = (marker) => {
    // console.log("data", marker)
    const bounds = marker.bounds;
    const centerPoint = [bounds[0].lat, bounds[0].lng];
    setPosition(centerPoint);
  };

  useEffect(() => {
    getCurrentMapFLow();
  }, []);

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
    setMapReady(true);
    setData([...tableData]);
  }, [tableData]);

  useEffect(() => {
    if (!mapReady || !mapContainerRef.current) return;

    // Initialize the map
    mapRef.current = new MapLibreMap({
      container: mapContainerRef.current,
      center: [77.2201, 28.631605],
      zoom: 11,
      style:
        "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      transformRequest: (url, resourceType) => {
        const apiKey = process.env.REACT_APP_OLAMAP_API_KEY;
        if (url.includes("?")) {
          url = url + `&api_key=${apiKey}`;
        } else {
          url = url + `?api_key=${apiKey}`;
        }
        return { url, resourceType };
      },
    });

    // Add navigation controls
    const nav = new NavigationControl({
      visualizePitch: true,
    });
    mapRef.current.addControl(nav, "top-left");

    return () => {
      mapRef.current.remove();
    };
  }, [mapReady]);

  useEffect(() => {
    if (!mapRef.current || !data || data.length === 0) return;

    // Clear previous markers before adding new ones
    // clearMarkers();

    if (mapRef.current.loaded()) {
      console.log("Map is loaded");
      updateMarkers();
    } else {
      mapRef.current.on("load", () => {
        updateMarkers();
      });
    }




    function updateMarkers() {
      data.forEach((restaurant, i) => {
        if (!restaurant.bounds.length) {
          console.error("Invalid restaurant location", restaurant);
          return;
        }

        const position = [restaurant?.bounds[0], restaurant?.bounds[1]];

        console.log("Adding marker at", position);

        const popup = new maplibregl.Popup({
          offset: [0, -30],
          anchor: "bottom",
          className: "custom-popup",
        })
          .setHTML(`
            <div class="popup-content">
              <div class="popup-title">${restaurant?.restaurantName}</div>
            </div>
          `);

        const markerElement = customIconOlaMap(i + 1);

        const marker = new olaMarker({
          element: markerElement,
          anchor: "center",
        })
          .setLngLat(position)
          .setPopup(popup)
          .addTo(mapRef.current);
      });
    }
  }, [data]);
  return (
    <Card
      extra={
        "w-full pb-0 p-4 bg-white rounded-lg pt-0 pe-0 h-[700px] mt-5 mb-5 grid grid-cols-12 gap-4"
      }
    >
      {/* Header */}
      <header className="relative col-span-12 flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white ">
          {t("Restaurants")}
        </div>
        <div>
         

          <button
            className="my-sm-0 add-driver-button my-2 mr-4 ms-1 mt-3 bg-brand-500 dark:bg-brand-400 dark:text-white"
            type="submit"
            onClick={() => navigate("/admin/restaurant/restaurant-form")}
          >
            {t("Add Restaurant")}
          </button>
        </div>
      </header>

      {/* Left side - Table data */}
      <div className="col-span-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-start group">
              <th className="cursor-pointer px-4 py-2 text-left">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="text-sm font-bold text-gray-600 dark:text-white">
                    {t("Sr. No")}
                  </span>
                </div>
              </th>
              {table.getHeaderGroups().map((headerGroup) => (
                <React.Fragment key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}

                      onClick={(header.id !== 'action' && header.id !== 'status') ? () => { setSortedBy(header.id); setIsAscending(prev => !prev) } : undefined}
                      className="cursor-pointer px-4 py-2 text-left"
                    >
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {(header.id !== 'action' && header.id !== 'status') &&
                          <div className="w-5 h-5">
                            <span className={`${sortedBy === header.id ? 'block' : 'hidden'} group-hover:block`}>

                              {header.id == sortedBy ?
                                (isAscending ?
                                  (<FaCaretUp
                                    className="mr-[-6]  font-bold text-green-400"
                                    size={20}
                                  />)
                                  :
                                  (<FaCaretDown
                                    className="mr-[-6] font-bold text-green-400"
                                    size={20}
                                  />)
                                )
                                :
                                (<FaCaretUp
                                  className="mr-[-6] font-bold text-gray-600"
                                  size={20}
                                />)

                              }
                              {/* {header.column.getIsSorted() === "asc" ? (
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
                            )} */}
                            </span>
                          </div>
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
                <td colSpan={columns.length + 1} className="py-4 text-center">
                  <h2 className="text-xl text-gray-500">{t("No Results!")}</h2>
                </td>
              </tr>
            ) : (
              <>
                {table
                  .getRowModel()
                  .rows?.slice(0, 10)
                  .map((row, index) => (
                    <tr key={row.id}>
                      <td className="px-4 py-2 text-left">{index + 1}</td>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-2 text-left">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
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
        {currentMap == "olaMap" && (
          <div className="h-full w-full">
            <div
              style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
              ref={mapContainerRef}
              id="central-map"
            />
            <img
              src={OlaMap}
              alt="OlaMap Icon"
              style={{
                position: "absolute",
                bottom: "12px",
                // left: "10px",
                right: "10px",
                width: "70px",
                height: "70px",
                zIndex: 10,
              }}
            />
          </div>
        )}

        {currentMap !== "olaMap" && (
          <div className="h-full w-full">
            <MapContainer
              center={position}
              zoom={10}
              className="leaf-Container-spot z-10"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {data.map((marker, i) => {
                const bounds = marker.bounds;

                if (bounds[0] == undefined) {
                  return;
                }
                const centerPoint = [bounds[1], bounds[0]];

                return (
                  <Marker
                    key={i}
                    position={centerPoint}
                    icon={customIcon(i + 1)}
                  >
                    <Popup>
                      <div className="text-center">{marker.restaurantName}</div>
                    </Popup>
                  </Marker>
                );
              })}
              {/* <ResetCenterView position={position} /> */}
            </MapContainer>
          </div>
        )}
      </div>

      {/* </div> */}
    </Card>
  );
}

export default ColumnsTable;
const columnHelper = createColumnHelper();
