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
import "./SpotForm.css";
import {
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
import axios from "axios";
const MapLibreMap = maplibregl.Map;
const NavigationControl = maplibregl.NavigationControl;
const olaMarker = maplibregl.Marker;

const icon = L.icon({
  iconUrl: LocationPin,
  iconSize: [40, 40],
});

const SpotForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({ input1: "", input2: "" });
  const spot = useRef("")
  const [showPopup, setShowPopup] = useState(false);
  const [bounds, setBounds] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [searchText, setSearchText] = useState("Delhi");
  const [searchTextCoords, setSearchTextCoords] = useState([28.471250, 77.040300]);
  const [allAvailableVehicles, setAllAvailableVehicles] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const selectedVehicleNumber = useRef("")
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([
    {
      value: "",
      label: "",
    },
  ]);
  const [currentMap, setcurrentMap] = useState("olaMap");
  const mapRefStreet = useRef(null);
  const mapContainerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const [markerPosition, setMarkerPostion] = useState([]);

  let isSpotNameFilled = inputs.input1.trim() !== "";

  const addMarker = (pos) => {
    setMarkers((prevMarkers) => [...prevMarkers, pos]);
    setBounds([pos[1],pos[0]]);
    setShowPopup(true);
  };

  const getAvailableVehicles = async () => {
    try {
      const res = await getAllVehiclesApi();
      if (!res) {
        errorToast("Vehicles not available");
      }
      // console.log("respVehicle",res);
      setOptions(
        res.data
          .filter((option) => !option.spotName) // Filter out options with spotName present
          .map((option) => {
            return {
              value: option.vehicleNumber,
              label: option.vehicleNumber,
            };
          })
      );
      setAllAvailableVehicles(res.data);
    } catch (error) {
      errorToast(error.response.data.message);
    }
  };

  const removeLastMarker = () => {
    setInputs({ input1: "", input2: "" });
    setVehicleNumber("");
    setMarkers((prevMarkers) => prevMarkers.slice(0, prevMarkers.length - 1));
  };
  // function _onCreate(e)removeLastMarker {
  //     // Get the drawn shape
  //     const { layer } = e;
  //     console.log("layer", layer._latlng)
  //     const bounds = layer._latlng; // Assuming `layer` is your Rectangle or LatLngBounds object
  //     setBounds(bounds)
  //     setShowPopup(true)
  // }

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

  // const handleClickOnMap = () => {
  //     if (showPopup) {
  //         setShowPopup(false);
  //         removeLastMarker();
  //     } else {
  //         // setShowPopup(false);
  //     }
  // };

  // Function to handle submission from popup input box
  async function _onSubmit() {
    const spotName = inputs.input1;
    try {
      const resp = await createSpot({ bounds, spotName, vehicleNumber });
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


  const mapLocation = (coords) => {
    console.log("inside mapLocation",mapRefStreet.current);
    if (mapRefStreet.current) {
      mapRefStreet.current.flyTo([coords[0], coords[1]], 11);
    }
  }


  const getCoordsFromText = async (text) => {
    try {
      const api_Key = process.env.REACT_APP_OLAMAP_API_KEY;
      const resp = await axios.get(
        `https://api.olamaps.io/places/v1/geocode?address=${text}&language=hi&api_key=${api_Key}`
        );
        const arr = Object.values(
          resp.data.geocodingResults[0].geometry.location
          );
          setSearchTextCoords([arr[1], arr[0]]);
          console.log("getCoordsFromText>>>>>>", searchText,searchTextCoords);
    } catch (error) {
      console.log("error from Geocode API", error);
    }
    await mapLocation(searchTextCoords)
  };

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
    getAvailableVehicles();
    getCoordsFromText(searchText);
    setMapReady(true);
  }, []);

  useEffect(()=> {
    console.log("Inside useEffect>>>>>>", searchText);
    if(searchText){
      getCoordsFromText(searchText)
    }
  },[searchText])

  
  useEffect(()=> {
    console.log("Inside useEffect>>>>>>", searchTextCoords);
    if(searchTextCoords){
      mapLocation(searchTextCoords)
    }
  },[searchTextCoords])

  useEffect(() => {
    if (!mapReady || !mapContainerRef.current) return;

    // Initialize the map
    mapRef.current = new MapLibreMap({
      container: mapContainerRef.current,
      center: [searchTextCoords[1],searchTextCoords[0]],
      zoom: 9,
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

    mapRef.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      console.log(`Clicked at Latitude: ${lat}, Longitude: ${lng}`);
      setMarkerPostion([lng, lat]); 
    });

    return () => {
      mapRef.current.remove();
    };
  }, [mapReady]);

  useEffect(() => {
    if (mapRef.current && markerPosition) {
      if (markerPosition.length) {

        const popupContent = `
        <div class="popup absolute z-20 flex w-[25vw] flex-col justify-between rounded-2xl border bg-white p-7 shadow">
          <label
            htmlFor="input1"
            class="font-Poppins text-center text-xl font-bold"
          >
            ${t("Enter Spot Name")}
          </label>
            <input
              type="text"
              id="input1"
              class="mt-2 h-12 w-full border bg-white/0 text-sm outline-none"
              placeholder="${t("Enter restaurant name here")}"
              oninput="updateInput(event)"
            />
              <p id="errorMsg" class="mb-3 text-sm text-red-500 hidden">
            ${t("Please fill the spot name")}
          </p>
          <select
            id="vehicleNumber"
            name="vehicleNumber"
            class="mb-5 w-full h-12 border bg-white text-sm outline-none"
            onchange="updateVehicleNumber(event)"
          >
            <option value="">${t("Vehicle number")}</option>
            ${options.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
          </select>
          <div class="flex justify-center gap-2">
            <button
              class="h-[8vh] w-[7vw] rounded-xl bg-blue-500 text-white"
              onclick="confirmAction()"
            >
              ${t("Confirm")}
            </button>
            <button
              class="h-[8vh] w-[7vw] rounded-xl bg-gray-500 text-white"
              onclick="cancelAction()"
            >
              ${t("Cancel")}
            </button>
          </div>
        </div>
      `;
      
      const popup = new maplibregl.Popup({
        offset: [0, -30],
        anchor: 'bottom',
      })
      .setHTML(popupContent)
      .setLngLat(markerPosition)
      .addTo(mapRef.current);

      window.updateInput = (event) => {
        const value = event.target.value;
        spot.current = value.trim();
      };

      window.updateVehicleNumber = (event) => {
        selectedVehicleNumber.current = event.target.value;
      };

      window.confirmAction = async() => {
        if (!spot.current.length) {
          document.getElementById("errorMsg").classList.remove("hidden");
          return;
        }
          try {
            const spotName = spot.current;
            const vehicleNumber = selectedVehicleNumber.current;
            const resp = await createSpot({ bounds: markerPosition, spotName, vehicleNumber });
            successToast("Spot added Successfully");
            popup.remove();
          } catch (error) {
            console.log("error", error);
            errorToast(error.response.data.message);
          }
      };

      window.cancelAction = () => {
          popup.remove();
          marker.remove()
        };

        const marker = new maplibregl.Marker({})
          .setLngLat(markerPosition)
          .addTo(mapRef.current);
      }
    }
  }, [markerPosition]);

  return (
    <>
      <Navbar flag={false} brandText="driverform" />
      <Link
        to="/admin/spots"
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <FaArrowLeft />
        <div>Back</div>
      </Link>
      <div className="mb-5 mt-5 grid h-[100vh] w-full grid-cols-12 gap-4 rounded-lg bg-white p-4 pb-0 pe-0 pt-0">
        <header className="relative col-span-4 mt-4 flex items-center justify-between">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            {t("Add Spots")}
          </div>
          <div className="w-full max-w-xs">
            {" "}
            <input
              type="text"
              placeholder="Search"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                console.log("<<<<<<<<<<<<<<<object>>>>>>>>>>>>>>>",e.target.value);                
               setSearchText(e.target.value);
                }
              }}
              className="w-full rounded-md border px-4 py-2 text-sm focus:border-blue-300 focus:outline-none focus:ring"
      style={{ minWidth: '200px', maxWidth: '200px' }}
            />
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
                  ref={mapRefStreet}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                    {t("Enter Spot Name")}
                  </label>

                  <input
                    type="text"
                    id="input1"
                    className="mt-2 h-12 w-full border bg-white/0 text-sm outline-none"
                    placeholder={t("Enter spot name here")}
                    value={inputs.input1}
                    onChange={(e) =>
                      setInputs({ ...inputs, input1: e.target.value })
                    }
                  />

                  {!isSpotNameFilled && (
                    <p className="mt-1 text-sm text-red-500">
                      {t("Please fill the spot name")}
                    </p>
                  )}

                  <Select
                    options={options}
                    id="vehicleNumber"
                    name="vehicleNumber"
                    className="mb-5"
                    // onBlur={handleBlur}
                    onChange={(e) => {
                      setVehicleNumber(e.value);
                      // values.vehicleNumber = e.value;
                    }}
                    value={options.filter(function (option) {
                      return option.value == vehicleNumber;
                    })}
                    placeholder={t("Vehicle number")}
                    styles={{
                      // Fixes the overlapping problem of the component
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                      }),
                      control: (provided) => ({
                        ...provided,
                        height: "47px", // Adjust the height as needed
                        marginTop: "8px",
                        fontSize: "0.875rem",
                        borderColor: "#e6e6e6",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected ? "#f2f3f7" : "white", // Change the background color here
                        color: "black", // Change the text color here
                        "&:hover": {
                          backgroundColor: "#f2f3f7", // Change the background color on hover
                        },
                      }),
                    }}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                  />
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

          {currentMap === "olaMap" && (
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
          )}
        </div>
      </div>
    </>
  );
};

export default SpotForm;
const columnHelper = createColumnHelper();
