import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import car from "../../../assets/images/car.svg";
import RidesIcon from "../../../assets/svg/RidesIcon.svg";
import RevenueIcon from "../../../assets/svg/RevenueIcon.svg";
import VehiclesIcon from "../../../assets/svg/VehiclesIcon.svg";
import { isEmpty as _isEmpty } from "lodash";
import { useTranslation } from "react-i18next";
import {
  dashboardDataApi,
  getCurrentMap,
  onlineDriversApi,
} from "../../../services/customAPI";
import Navbar from "components/navbar";
import Loader from "components/loader/loader";
import Card from "components/card";
import { Link, useNavigate } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { toast } from "react-toastify";
import OlaMap from "../../../assets/images/Ola_Map_logo.svg";
import google_Map_logo from "../../../assets/images/Google_Maps_Logo.svg";
// import { Map as MapLibreMap, NavigationControl, Marker, Popup  } from "maplibre-gl";
const MapLibreMap = maplibregl.Map;
const NavigationControl = maplibregl.NavigationControl;
const olaMarker = maplibregl.Marker;
const markers = new Map();

const center = { lat: 28.458684, lng: 77.03579 };

interface LoaderProps {
  size?: number;
}

const CustomSpinner: React.FC<LoaderProps> = ({ size = 40 }) => {
  const loaderStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderTopColor: "blue",
  };

  return (
    <div className="float-right">
      <div className="loader" style={loaderStyle}></div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [intervalState, setIntervalState] = useState();
  const [allOnlineDrivers, setAllOnlineDrivers] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinner, setIsSpinner] = useState(true);
  const [ongoingRidesCount, setOngoingRidesCount] = useState([]);
  const [completeRidesCount, setCompleteRidesCount] = useState([]);
  const [onlineDriversCount, setOnlineDriversCount] = useState();
  const [totalDriver, setTotalDriver] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [driverPosition, setDriverPosition] = useState(null);
  const [currentMap, setcurrentMap] = useState<any>("olaMap");
  const mapContainerRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);


  function formatNumber(num:any) {
    const numStr = num.toString();

    if (numStr.length === 12) {
        return `${numStr.slice(0, 2)} ${numStr.slice(2, 7)} ${numStr.slice(7)}`;
    } else {
        return `91 ${numStr.slice(0, 5)} ${numStr.slice(5)}`;
    }
}

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    // googleMapsApiKey: "",
  });

  // const getAllDrivers = async () => {
  //   try {
  //     const response = await customAxios.get(`/allActiveDrivers`)
  //     setTotalDriver(response)
  //   } catch (error) {
  //   }
  // }

  const errorToast = (message: any) => {
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

  const getCurrentMapFLow = async () => {
    setIsLoading(true);
    try {
      const res = await getCurrentMap();
      setcurrentMap(res.data?.currentMap);
      console.log("respones:>>>>", res.data);
    } catch (error: any) {
      errorToast(error?.response?.data?.message || "Something went wrong");
    }
    setIsLoading(false);
  };

  const getDashboardData = async () => {
    try {
      setIsSpinner(true);
      const dashboardDataResponse: any = await dashboardDataApi();
      setDashboardData(dashboardDataResponse.data);
      setOngoingRidesCount(dashboardDataResponse.data.ongoingOrderCount);
      setCompleteRidesCount(dashboardDataResponse.data.completedRidesCount);
      setOnlineDriversCount(dashboardDataResponse.data.onlineDriversCount);
      setTotalDriver(dashboardDataResponse.data.totalDriversCount);
      console.log("Dashboard Data", dashboardDataResponse.data);
    } catch (error: any) {
      console.log(`getDashboardData error :>> `, error);
    }
  };

  const getAllOnlineDrivers = async () => {
    try {
      setIsLoading(true);
      let intervalId: any;
      intervalId = setInterval(async () => {
        // setIsSpinner(true)
        const response: any = await onlineDriversApi();
        setAllOnlineDrivers(response);
        setOnlineDriversCount(response.length);
        console.log("All online drivers", allOnlineDrivers);
        // const dashboardDataResponse = await customAxios.get(`/dashboard-data`)
        // setDashboardData(dashboardDataResponse.data)
      }, 10000);
      setIntervalState(intervalId);
    } catch (error: any) {
      console.log(`getAllOnlineDrivers error :>> `, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = () => {
    navigate("/admin/order?data=ongoing-rides");
  };

  const handleNavigationCompleteRide = () => {
    navigate("/admin/order?data=completed");
  };

  const showDriversDetails = (driver: any, position: any) => {
    console.log(driver);

    setSelectedDriver(driver);
    setDriverPosition(position);
  };

  useEffect(() => {
    getCurrentMapFLow();
    // console.log('useEffect dashboardData :>> ', dashboardData)
    if (!_isEmpty(dashboardData)) {
      setIsSpinner(false);
    }
  }, [dashboardData]);

  useEffect(() => {
    if (!mapReady || !mapContainerRef.current) return;

    // Initialize the map
    mapRef.current = new MapLibreMap({
      container: mapContainerRef.current,
      center: [77.2201, 28.631605], // Center on India
      zoom: 9,
      style:
        "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      transformRequest: (url: any, resourceType: any) => {
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
    }; // Clean up map on unmount
  }, [mapReady]);

  useEffect(() => {
    if (!mapRef.current || !allOnlineDrivers || allOnlineDrivers.length === 0)
      return;

    // Clear previous markers before adding new ones
    clearMarkers();

    // Update markers after the map is loaded
    if (mapRef.current.loaded()) {
      updateMarkers();
    }

    function clearMarkers() {
      // Remove all existing markers from the map
      markers.forEach((marker) => {
        marker.remove(); // Remove the marker from the map
      });
      markers.clear(); // Clear the marker map
    }

    function updateMarkers() {
      allOnlineDrivers.forEach((driver) => {
        if (!driver.liveLocation || driver.liveLocation.length < 2) {
          console.error("Invalid driver location", driver);
          return;
        }

        const position = {
          lng: driver.liveLocation[1],
          lat: driver.liveLocation[0],
        };

        console.log("Adding marker at", position);

        // Create a custom car icon marker
        const carIcon = document.createElement("img");
        carIcon.src = car;
        carIcon.style.cursor = "pointer";

        const popup = new maplibregl.Popup({
          offset: [0, -30],
          anchor: "bottom",
        }).setHTML(`<div class="w-100 h-30 p-0 text-gray-800">
    <div class="text-xl font-bold mb-2">
      Rider Info
    </div>
    <div class="text-md">
      <strong>Name:</strong> ${driver.firstName}
    </div>
    <div class="text-md">
      <strong>Mobile:</strong> ${formatNumber(driver.mobileNumber)}
    </div>
    <div class="text-md">
      <strong>Vehicle Number:</strong> ${driver.vehicleNumber}
    </div>
  </div>`);

        if (mapRef.current && position.lng && position.lat) {
          const marker = new olaMarker({
            element: carIcon,
            anchor: "center",
          })
            .setLngLat([position.lng, position.lat])
            .setPopup(popup)
            .addTo(mapRef.current);

          // Store the marker in the map by driver ID
          markers.set(driver._id, marker);
        } else {
          console.error("Error adding marker", mapRef.current, position);
        }
      });
    }
  }, [allOnlineDrivers]);

  useEffect(() => {
    setMapReady(true);
    getAllOnlineDrivers();
    // getAllDrivers()
    getDashboardData();
  }, []);

  useEffect(() => {
    return () => {
      if (intervalState) {
        clearInterval(intervalState);
      }
    };
  }, [intervalState]);

  return (
    <div>
      <Navbar flag={false} brandText="Dashboard" />
      {isLoading && (
        <div className="absolute z-10 flex h-full w-3/4 items-center justify-center">
          <Loader />
        </div>
      )}
      <>
        <Card extra={"w-full pb-10 p-4 h-full"}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "25px",
            }}
          >
            <Card
              style={{
                flex: 1,
                border: "1px dashed #A3A3B7",
                borderRadius: "15px",
                marginRight: "10px",
              }}
            >
              <div
                className="m-5"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div>
                  <img
                    src={RevenueIcon}
                    width={40}
                    height={40}
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                    }}
                  />
                  <h1
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginLeft: "10px",
                    }}
                  >
                    {t("Ongoing")}
                  </h1>
                </div>
                <h3 className="mt-12 text-end" style={{ color: "#2BB180" }}>
                  {isSpinner ? (
                    <CustomSpinner />
                  ) : (
                    <span
                      style={{ fontSize: 33, cursor: "pointer" }}
                      onClick={handleNavigation}
                    >
                      {ongoingRidesCount}
                    </span>
                  )}
                </h3>
              </div>
            </Card>
            <Card
              style={{
                flex: 1,
                border: "1px dashed #A3A3B7",
                borderRadius: "15px",
                marginRight: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                className="m-5"
              >
                <div className="d-flex align-items-center mb-3 gap-3">
                  <img
                    src={VehiclesIcon}
                    width={40}
                    height={40}
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                    }}
                  />
                  <h1
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginLeft: "10px",
                    }}
                  >
                    {t("Riders")}
                  </h1>
                </div>

                <div
                  className="mt-9"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="d-flex gap-2">
                    <h4
                      className="dark:text-white"
                      style={{
                        // color: "#000000",
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    >
                      {t("Total:")}
                    </h4>
                    <h4
                      className=""
                      style={{
                        color: "#2BB180",
                        display: "inline-block",
                        verticalAlign: "middle",
                        marginLeft: "10px",
                      }}
                    >
                      {isSpinner ? (
                        <CustomSpinner />
                      ) : (
                        <Link
                          style={{ fontSize: 32 }}
                          to="/admin/drivers?status=all"
                        >
                          {totalDriver}
                        </Link>
                      )}
                    </h4>
                  </div>

                  <div className="d-flex gap-2">
                    <h4
                      className="dark:text-white"
                      style={{
                        // color: "#000000",
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    >
                      {t("Online:")}
                    </h4>
                    <h4
                      className=""
                      style={{
                        color: "#2BB180",
                        display: "inline-block",
                        verticalAlign: "middle",
                        marginLeft: "10px",
                      }}
                    >
                      {isSpinner ? (
                        <CustomSpinner />
                      ) : (
                        <Link
                          style={{ fontSize: 32 }}
                          to="/admin/drivers?status=online"
                        >
                          {onlineDriversCount}
                        </Link>
                      )}
                    </h4>
                  </div>
                </div>
              </div>
            </Card>
            <Card
              style={{
                flex: 1,
                border: "1px dashed #A3A3B7",
                borderRadius: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                className="m-5"
              >
                <div>
                  <img
                    src={RidesIcon}
                    width={40}
                    height={40}
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                    }}
                  />
                  <h1
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginLeft: "10px",
                    }}
                  >
                    {t("Completed")}
                  </h1>
                </div>
                <h3 className="mt-12 text-end" style={{ color: "#2BB180" }}>
                  {isSpinner ? (
                    <CustomSpinner />
                  ) : (
                    <span
                      style={{ fontSize: 33, cursor: "pointer" }}
                      onClick={handleNavigationCompleteRide}
                    >
                      {completeRidesCount}
                    </span>
                  )}
                </h3>
              </div>
            </Card>
          </div>

          <div className="mb-2 mt-8">
            <div>
              <h4
                id="traffic"
                className="card-title mb-2"
                style={{ fontSize: "25px" }}
              >
                {t("Active Riders:")}
              </h4>
            </div>
            <div className="d-none d-md-block">
              {/* <CButtonGroup className="float-end me-3">
                    {['Map', 'Satellite'].map((value) => (
                      <CButton
                        color="outline-secondary"
                        key={value}
                        className="mx-0"
                        active={value === 'Map'}
                      >
                        {value}
                      </CButton>
                    ))}
                  </CButtonGroup> */}
            </div>
          </div>

          {currentMap == "olaMap" && (
            <div
            style={{ position: "relative" }}
              className="h-100 w-100  bg-info"
            >
              <div
                // className="h-100 w-100 bg-info"
                style={{ width: "100%", height: "500px" }}
                ref={mapContainerRef}
                id="central-map"
              />
              <img
                src={OlaMap}
                alt="OlaMap Icon"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  width: "70px",
                  height: "70px",
                  zIndex: 10,
                }}
              />
            </div>
          )}
          {currentMap == "google" && (
            <div className="h-100 w-100  bg-info">
              {!isLoaded ? (
                <h1>Loading...</h1>
              ) : (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "500px" }}
                  center={center}
                  zoom={10}
                >
                  {/* <img
                    src={google_Map_logo}
                    alt="OlaMap Icon"
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      width: "70px",
                      height: "70px",
                      zIndex: 10,
                    }}
                  /> */}
                  {allOnlineDrivers &&
                    allOnlineDrivers.length > 0 &&
                    allOnlineDrivers.map((driverId) => {
                      const position = {
                        lng: driverId.liveLocation && driverId.liveLocation[1],
                        lat: driverId.liveLocation && driverId.liveLocation[0],
                      };
                      return (
                        <Marker
                          key={driverId}
                          position={position}
                          icon={car}
                          onClick={() => showDriversDetails(driverId, position)}
                        />
                      );
                    })}
                  {selectedDriver && driverPosition && (
                    <InfoWindow
                      position={driverPosition}
                      onCloseClick={() => setSelectedDriver(null)}
                    >
                      <div style={{ width: "100%" }}>
                        <h2 style={{ fontWeight: "bold" }}>Rider Details</h2>
                        <p style={{ display: "flex", fontWeight: "400" }}>
                          {/* <p>ID:</p> <p> {selectedDriver?.driverId}</p> */}
                        </p>
                        <p style={{ display: "flex", fontWeight: "400" }}>
                          <p>Name:</p>{" "}
                          <p>
                            {selectedDriver?.firstName}
                            {"  "} {selectedDriver?.lastName}
                          </p>
                        </p>
                        <p style={{ display: "flex", fontWeight: "400" }}>
                          <p> Mobile Number:</p>
                          <p> {formatNumber(selectedDriver?.mobileNumber)}</p>
                        </p>
                        <p style={{ display: "flex", fontWeight: "400" }}>
                          <p>Vehical Number.:</p>
                          <p> {selectedDriver?.vehicleNumber}</p>
                        </p>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              )}
            </div>
          )}
        </Card>
      </>
    </div>
  );
};

export default Dashboard;
