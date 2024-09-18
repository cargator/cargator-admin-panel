import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Rectangle,
  Map,
  FeatureGroup,
  Circle,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L, { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "../map.css";
import Select from "react-select";
import { EditControl } from "react-leaflet-draw";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../../../node_modules/leaflet/dist/leaflet.css";
import "../../../../../node_modules/leaflet-draw/dist/leaflet.draw.css";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import LocationPin from "../../../../assets/svg/LocationPinAdd.svg";
import "./RestaurentForm.css";
import {
  createRestaurent,
  createSpot,
  getAllVehiclesApi,
  getCurrentMap,
} from "services/customAPI";
import { getAvailableVehiclesApi } from "services/customAPI";
import Navbar from "components/navbar";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import OlaMap from "../../../../assets/images/Ola_Map_logo.svg";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
const MapLibreMap = maplibregl.Map;
const NavigationControl = maplibregl.NavigationControl;
const olaMarker = maplibregl.Marker;

const icon = L.icon({
  iconUrl: LocationPin,
  iconSize: [40, 40],
});

const RestaurentForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({ input1: "", input2: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [bounds, setBounds] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMap, setcurrentMap] = useState("olaMap");
  const mapContainerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const [markerPosition, setMarkerPostion] = useState([]);

  let isSpotNameFilled = inputs.input1.trim() !== "";

  const addMarker = (pos) => {
    setMarkers((prevMarkers) => [...prevMarkers, pos]);
    setBounds([{ lat: pos[0], lng: pos[1] }]);
    setShowPopup(true);
  };

  const removeLastMarker = () => {
    setInputs({ input1: "", input2: "" });
    setMarkers((prevMarkers) => prevMarkers.slice(0, prevMarkers.length - 1));
  };

  const successToast = (message) => {
    toast.success(`${message}`, {
      position: "top-right",
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

  const errorToast = (message) => {
    toast.error(`${message}`, {
      position: "top-right",
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


  // Function to handle submission from popup input box
  async function _onSubmit() {
    const restaurentName = inputs.input1;
    try {
      const resp = await createRestaurent({ bounds, restaurentName });
      setInputs({ input1: "", input2: "" });
      successToast("Spot added Successfully");
      setShowPopup(false);
    } catch (error) {
      console.log("error", error);
      errorToast(error.response.data.message);
    }
  }

  function DropMarker({ addMarker }) {
    const [position, setPosition] = useState(null);

    const map = useMapEvents({
      click: (e) => {
        if (!position) {
          setPosition([e.latlng.lat, e.latlng.lng]);
        }
      },
    });

    useEffect(() => {
      if (position !== null) {
        addMarker(position);
        setPosition(null);
      }
    }, [position, addMarker]);

    return position ? (
      <Circle
        center={position}
        radius={100}
        color="red"
        fillColor="#f03"
        opacity={0.5}
      >
        <Popup minWidth={90}>You clicked here!</Popup>
      </Circle>
    ) : null;
  }

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

  useEffect(() => {
    getCurrentMapFLow();
    setMapReady(true);
  }, []);

  // useEffect(() => {
  //   if (!mapReady || !mapContainerRef.current) return;

  //   // Initialize the map
  //   mapRef.current = new MapLibreMap({
  //     container: mapContainerRef.current,
  //     center: [77.2201, 28.631605],
  //     zoom: 9,
  //     style:
  //       "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
  //     transformRequest: (url, resourceType) => {
  //       const apiKey = process.env.REACT_APP_OLAMAP_API_KEY;
  //       if (url.includes("?")) {
  //         url = url + `&api_key=${apiKey}`;
  //       } else {
  //         url = url + `?api_key=${apiKey}`;
  //       }
  //       return { url, resourceType };
  //     },
  //   });

  //   // Add navigation controls
  //   const nav = new NavigationControl({
  //     visualizePitch: true,
  //   });
  //   mapRef.current.addControl(nav, "top-left");

  //   mapRef.current.on("click", (e) => {
  //     const { lng, lat } = e.lngLat;
  //     console.log(`Clicked at Latitude: ${lat}, Longitude: ${lng}`);
  //     setMarkerPostion([lng, lat]);
  //   });

  //   return () => {
  //     mapRef.current.remove();
  //   };
  // }, [mapReady]);

  // useEffect(() => {
  //   if (mapRef.current && markerPosition) {
  //     if (markerPosition.length) {

  //       const popupContent = `
  //       <div class="popup absolute z-20 flex w-[25vw] flex-col justify-between rounded-2xl border bg-white p-7 shadow">
  //         <label
  //           htmlFor="input1"
  //           class="font-Poppins text-center text-xl font-bold"
  //         >
  //           ${t("Enter Restaurent Name")}
  //         </label>
  //         <input
  //           type="text"
  //           id="input1"
  //           class="mt-2 h-12 w-full border bg-white/0 text-sm outline-none"
  //           placeholder="${t("Enter restaurent name here")}"
  //           value="${inputs.input1}"
  //           onChange="updateInput(event)"
  //         />
  //          ${!isSpotNameFilled ? `<p class="mt-1 text-sm text-red-500">${t("Please fill the spot name")}</p>` : ''}
  //         <div class="flex justify-center gap-2">
  //           <button
  //             class="h-[8vh] w-[7vw] rounded-xl bg-blue-500 text-white"
  //             onclick="confirmAction()"
  //             ${!isSpotNameFilled ? 'disabled' : ''}
  //           >
  //             ${t("Confirm")}
  //           </button>
  //           <button
  //             class="h-[8vh] w-[7vw] rounded-xl bg-gray-500 text-white"
  //             onclick="cancelAction()"
  //           >
  //             ${t("Cancel")}
  //           </button>
  //         </div>
  //       </div>
  //     `;
      
  //     const popup = new maplibregl.Popup({
  //       offset: [0, -30],
  //       anchor: 'bottom',
  //     })
  //     .setHTML(popupContent)
  //     .setLngLat(markerPosition)
  //     .addTo(mapRef.current);

  //     window.updateInput = (event) => {
  //       console.log("updateInput>>>>>>>>>>",event.target.value);
  //       setInputs({ ...inputs, input1: event.target.value });
  //       isSpotNameFilled = event.target.value.trim();
  //     };

  //     window.confirmAction = async() => {
  //       console.log("1534256476987089>>>>>>>>>>");
  //         const restaurentName = inputs.input1;
  //         try {
  //           const resp = await createRestaurent({ bounds: markerPosition, restaurentName });
  //           setInputs({ input1: "", input2: "" });
  //           successToast("Spot added Successfully");
  //           popup.remove();
  //         } catch (error) {
  //           console.log("error", error);
  //           errorToast(error.response.data.message);
  //         }
  //     };

  //     window.cancelAction = () => {
  //         popup.remove();
  //         marker.remove()
  //       };

  //       const marker = new maplibregl.Marker({})
  //         .setLngLat(markerPosition)
  //         .addTo(mapRef.current);
  //     }
  //   }
  // }, [markerPosition]);

  return (
    <>
      <Navbar flag={false} brandText="driverform" />
      <Link
        to="/admin/restaurent"
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <FaArrowLeft />
        <div>Back</div>
      </Link>
      <div className="mb-5 mt-5 grid h-[100vh] w-full grid-cols-12 gap-4 rounded-lg bg-white p-4 pb-0 pe-0 pt-0">
        <header className="relative col-span-12 mt-4 flex items-center justify-between">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            {t("Add Restaurent")}
          </div>
          <div>
          </div>
        </header>
        <div className="col-span-12 mb-5 mr-3 overflow-hidden">
          {currentMap !== "olaMap" && (
            <div className={`h-full w-full pr-4`}>
              <div
                className={`z-10 ${showPopup ? "blur" : ""}`}
                onClick={
                  showPopup
                    ? () => {
                        setShowPopup(false);
                        removeLastMarker();
                      }
                    : undefined
                }
              >
                <MapContainer
                  center={[19.07, 72.87]}
                  zoom={12}
                  className={`z-10`}
                  onClick={() => {
                    if (showPopup) {
                      setShowPopup(false);
                      removeLastMarker();
                    }
                  }}
                >
                  <TileLayer
                    url="https://nominatim.openstreetmap.org/search?q=Eiffel+Tower&format=json"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {markers.map((pos, index) => (
                    <Marker key={index} position={pos} icon={icon}>
                      <Popup>This is marker #{index + 1}</Popup>
                    </Marker>
                  ))}
                  <DropMarker addMarker={addMarker} />
                </MapContainer>
              </div>

              {showPopup && (
                <div className="popup absolute z-20 flex w-[25vw] flex-col justify-between rounded-2xl border bg-white p-7 shadow">
                  <label
                    htmlFor="input1"
                    className="font-Poppins text-center text-xl font-bold"
                  >
                    {t("Enter Restaurent Name")}
                  </label>

                  <input
                    type="text"
                    id="input1"
                    className="mt-2 h-12 w-full border bg-white/0 text-sm outline-none"
                    placeholder={t("Enter restaurent name here")}
                    value={inputs.input1}
                    onChange={(e) =>
                      setInputs({ ...inputs, input1: e.target.value })
                    }
                  />

                  {!isSpotNameFilled && (
                    <p className="mt-1 text-sm text-red-500">
                      {t("Please fill the restaurent name")}
                    </p>
                  )}

                  <div className="flex justify-center gap-2">
                    <button
                      className="h-[8vh] w-[7vw] rounded-xl"
                      onClick={_onSubmit}
                      disabled={!isSpotNameFilled}
                    >
                      {t("Confirm")}
                    </button>
                    <button
                      className="h-[8vh] w-[7vw] rounded-xl"
                      onClick={() => {
                        setShowPopup(false);
                        removeLastMarker();
                      }}
                    >
                      {t("Cancel")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* {currentMap === "olaMap" && (
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <div
                style={{
                  width: "90vw",
                  height: "100vh",
                  overflow: "hidden",
                  position: "relative",
                }} // Ensure the parent has relative positioning
                ref={mapContainerRef}
                id="central-map"
              />
              <img
                src={OlaMap}
                alt="OlaMap Icon"
                style={{
                  position: "absolute",
                  bottom: "11px",
                  left: "20px",
                  width: "70px",
                  height: "70px",
                  zIndex: 10,
                }}
              />
            </div>
          )} */}
        </div>
      </div>
    </>
  );
};

export default RestaurentForm;
const columnHelper = createColumnHelper();
