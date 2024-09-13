import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import car from "../../../../assets/images/car.svg";
import orderAccepted from "../../../../assets/images/orderAccepted.svg";
import ArrivedPickLoc from "../../../../assets/images/ArrivedPickLoc.svg";
import orderDisp from "../../../../assets/images/orderDisp...svg";
import ArrivedCustLoc from "../../../../assets/images/ArrivedCustLoc.svg";
import Delivered from "../../../../assets/images/Delivered.svg";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../../../components/navbar";
import Loader from "../../../../components/loader/loader";
import Card from "../../../../components/card";
import time from "../../../../assets/svg/time.svg";
import date from "../../../../assets/svg/date.svg";
import ridePickDest from "../../../../assets/svg/ridePickDest.svg";
import call from "../../../../assets/svg/call.svg";
import dummyCar from "../../../../assets/svg/dummyCar.svg";
import dummyProfile from "../../../../assets/svg/dummyProfile.svg";
import { FaArrowLeft } from "react-icons/fa";
import {
  getCurrentMap,
  getDriverLocationApi,
  getS3SignUrlApi,
  orderById,
} from "services/customAPI";
import { toast } from "react-toastify";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
const MapLibreMap = maplibregl.Map;
const NavigationControl = maplibregl.NavigationControl;
const olaMarker = maplibregl.Marker;
const markers = new Map();

let center = { lat: 28.496265, lng: 77.089844 };

const ImageWithFallback: React.FC<{
  src: string;
  alt: string;
  fallbackSrc: string;
}> = ({ src, alt, fallbackSrc }) => {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = fallbackSrc;
  };

  return (
    <img
      src={src}
      alt={alt}
      onError={handleImageError}
      width={70}
      height={70}
    />
  );
};

const OrderView = () => {
  const params = useParams();
  const [ride, setRide] = useState(null);
  const [path, setPath] = useState<any[]>([]);
  const pathCoords = useRef<any[]>([]);
  const [realPath, setRealPath] = useState<any[]>([]);
  const realPathCoords = useRef<any[]>([]);
  const [driverLocation, setDriverLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [driverImagePath, setDriverImagePath] = useState("");
  const [vehicleImagePath, setVehicleImagePath] = useState("");
  const [dateTimeCreatedAt, setDateTimeCreatedAt] = useState("");
  const [pickUp, setPickUp] = useState("");
  const [drop, setDrop] = useState("");
  const [orderPrice, setOrderPrice] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerMobileNumber, setCustomerMobileNumber] = useState(0);
  const [driverName, setDriverName] = useState("");
  const [driverMobileNumber, setDriverMobileNumber] = useState(0);
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState([]);
  const [currentMap, setcurrentMap] = useState<any>("olaMap");
  const mapContainerRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);
  const orderCurrentLatLong = useRef<any>();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

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
    } catch (error: any) {
      errorToast(error?.response?.data?.message || "Something went wrong");
    }
    setIsLoading(false);
  };

  const convertPath = (coords: any) => {
    return coords.map((ele: any) => ({
      lat: ele.latitude,
      lng: ele.longitude,
    }));
  };

  const getDriverLocation = async (id: string) => {
    const response = await getDriverLocationApi({ driverId: id });
    const driverCoords = {
      lat: response.data.latitude,
      lng: response.data.longitude,
    };
    setDriverLocation(driverCoords);
  };

  function convertUtcToIst(utcTimeStr: string) {
    const utcDate = new Date(utcTimeStr);
    const istOffsetMinutes = 330; // IST offset in minutes (UTC+5:30)
    const istTime = new Date(utcDate.getTime() + istOffsetMinutes * 60 * 1000);
    return istTime.toISOString(); // Return in ISO format
  }

  async function getS3SignUrl(key: string, contentType: string, type: string) {
    const headers = { "Content-Type": "application/json" };
    if (key) {
      const response: any = await getS3SignUrlApi(
        {
          key,
          contentType,
          type,
        },
        { headers }
      );
      return response?.url;
    }
  }

  const getDriverImage = async (keys: string) => {
    const contentType = "image/*";
    const type = "get";
    const data: any = await getS3SignUrl(keys, contentType, type);
    setDriverImagePath(data);
  };

  const getVehicleImage = async (keys: string) => {
    const contentType = "image/*";
    const type = "get";
    const data: any = await getS3SignUrl(keys, contentType, type);
    setVehicleImagePath(data);
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await orderById(params.id);
      const order = res.data;
      setOrderDetails(order);
      orderCurrentLatLong.current = {
        lat: order?.pickup_details.latitude,
        lng: order?.pickup_details.longitude,
      };

      const combinedPath = [...order?.riderPathToPickUp, ...order.pickupToDrop];
      setPath(convertPath(combinedPath));
      pathCoords.current = convertPath(combinedPath);
      setRealPath(convertPath(order?.realPath));
      realPathCoords.current = convertPath(order?.realPath);
      setPickUp(order?.pickup_details?.address);
      setDrop(order?.drop_details?.address);
      setOrderPrice(order?.order_details?.order_total);
      setCustomerName(order?.drop_details?.name);
      setCustomerMobileNumber(order?.drop_details?.contact_number);
      setDriverName(order?.driver_details?.name);
      setDriverMobileNumber(order?.driver_details?.contact);
      setVehicleName(order?.vehicleName);
      setVehicleNumber(order?.vehicleNumber);
      setUpdatedStatus(order?.statusUpdates);
      setOrderStatus(order?.status);
      if (order?.status === "ACCEPTED") {
        setDateTimeCreatedAt(convertUtcToIst(order?.createdAt));
      } else {
        setDateTimeCreatedAt(convertUtcToIst(order?.updatedAt));
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
    setMapReady(true);
  };

  useEffect(() => {
    getData();
    getCurrentMapFLow();
  }, []);

  useEffect(() => {
    if (!mapReady || !mapContainerRef.current) return;
    // Initialize the map
    mapRef.current = new MapLibreMap({
      container: mapContainerRef.current,
      center: [
        orderCurrentLatLong.current.lng,
        orderCurrentLatLong.current.lat,
      ],
      zoom: 12.5,
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

    mapRef.current.on("load", () => {
      mapRef.current.addLayer({
        id: "path-layer1",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: pathCoords.current.map(({ lng, lat }) => [
                    lng,
                    lat,
                  ]),
                },
                properties: {},
              },
            ],
          },
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#00308F",
          "line-width": 4,
        },
      });

      mapRef.current.addLayer({
        id: "path-layer2",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: realPathCoords.current.map(({ lng, lat }) => [
                    lng,
                    lat,
                  ]),
                },
                properties: {},
              },
            ],
          },
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#018749",
          "line-width": 4,
        },
      });
    });
    return () => {
      mapRef.current.remove();
    }; // Clean up map on unmount
  }, [mapReady]);

  useEffect(() => {
    if (!mapRef.current || !updatedStatus || updatedStatus.length === 0) return;

    clearMarkers();

    if (!mapRef.current.loaded()) {
      mapRef.current.on("load", () => {
        console.log("Map has loaded");
        updateMarkers();
      });
    } else {
      updateMarkers();
    }

    function clearMarkers() {
      markers.forEach((marker) => {
        marker.remove();
      });
      markers.clear();
    }

    function updateMarkers() {
      updatedStatus.slice(1).forEach((orderStatus) => {
        if (!orderStatus.location || orderStatus.location.length < 2) {
          console.error("Invalid driver location", orderStatus);
          return;
        }

        const position = {
          lng: orderStatus.location[1],
          lat: orderStatus.location[0],
        };

        let icon: any;
        switch (orderStatus.status) {
          case "ALLOTTED":
            icon = document.createElement("img");
            icon.src = orderAccepted;
            break;

          case "ARRIVED":
            icon = document.createElement("img");
            icon.src = ArrivedPickLoc;
            break;

          case "DISPATCHED":
            icon = document.createElement("img");
            icon.src = orderDisp;
            break;

          case "ARRIVED_CUSTOMER_DOORSTEP":
            icon = document.createElement("img");
            icon.src = ArrivedCustLoc;
            break;

          case "DELIVERED":
            icon = document.createElement("img");
            icon.src = Delivered;
            break;

          default:
            return "cancelledClass";
        }

        console.log("Adding marker at", orderStatus.location);

        if (mapRef.current && position.lng && position.lat) {
          const marker = new olaMarker({
            element: icon,
            anchor: "center",
          })
            .setLngLat([position.lng, position.lat])
            .addTo(mapRef.current);

          // Store the marker in the map by driver ID
          markers.set(orderStatus._id, marker);
        } else {
          console.error("Error adding marker", mapRef.current, position);
        }
      });
    }
  }, [updatedStatus]);

  return (
    <>
      <Navbar flag={false} brandText="order details" />
      <Link
        to="/admin/order"
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <FaArrowLeft />
        <div>Back</div>
      </Link>
      {isLoading && (
        <div className="absolute z-10 flex h-full w-3/4 items-center justify-center">
          <Loader />
        </div>
      )}
      <>
        <Card
          extra={
            "w-full pb-0 p-4 pt-0 pe-0 h-full mt-5 mb-5 grid grid-cols-12 gap-4"
          }
        >
          <div className="col-span-5">
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
                paddingBottom: "10px",
                paddingTop: "14px",
              }}
            >
              Order Details
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "500",
                paddingBottom: "18px",
              }}
            >
              <img
                src={date}
                width={16}
                height={16}
                style={{ display: "inline-block", marginRight: "2px" }}
              />
              <span className="pe-5">
                {" "}
                {dateTimeCreatedAt?.substring(0, 10)}
              </span>
              <img
                src={time}
                width={16}
                height={16}
                style={{ display: "inline-block", marginRight: "2px" }}
              />
              <span className="pe-5">
                {" "}
                {dateTimeCreatedAt?.substring(11, 16)}
              </span>
              <span
                className={
                  orderStatus === "DELIVERED"
                    ? "completedClass"
                    : orderStatus === "CANCELLED"
                    ? "cancelledClass"
                    : "ongoingClass"
                }
              >
                {orderStatus || "NA"}
              </span>
            </div>
            <div className="m-1 w-1/4 rounded-[4px] p-3 dark:bg-white">
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#464E5F",
                }}
              >
                Order Price:{" "}
              </span>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#212121",
                }}
              >
                ₹{orderPrice}
              </span>
            </div>
            <hr style={{ color: "#E1E2F1" }} />
            {/* Customer Details */}
            <div className="mt-2 grid grid-cols-8 gap-3 pb-3">
              <div className="col-span-1 mt-4">
                <img src={ridePickDest} width={45} height={80} />
              </div>
              <div
                className="col-span-7"
                style={{
                  width: "70%",
                }}
              >
                <div
                  className="pt-3"
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    paddingBottom: "8px",
                  }}
                >
                  Rider
                </div>
                <div className="">
                  <div className="mb-3 grid grid-cols-8">
                    {" "}
                    <div className="">
                      {driverImagePath ? (
                        <ImageWithFallback
                          src={driverImagePath}
                          alt={"profile image"}
                          fallbackSrc={dummyProfile}
                        />
                      ) : (
                        <img src={dummyProfile} width={30} height={30} />
                      )}
                    </div>
                    <div className="col-span-6">
                      {" "}
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "500",
                          paddingBottom: "10px",
                        }}
                      >
                        {driverName || "NA"}
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            marginLeft: "5px",
                          }}
                        >
                          {`(${driverMobileNumber})` || "NA"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-11">
                    <div
                      className="col-span-7"
                      style={{
                        fontSize: "12px",
                        fontWeight: "400",
                        width: "70%",
                      }}
                    >
                      <div style={{ paddingBottom: "30px" }}>{drop}</div>
                    </div>
                  </div>
                </div>
                <hr style={{ color: "#E1E2F1" }} />
                <div
                  className="pt-3"
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    paddingBottom: "8px",
                  }}
                >
                  Customer
                </div>
                <div className="grid grid-cols-8 pb-3">
                  <div className="">
                    {driverImagePath ? (
                      <ImageWithFallback
                        src={driverImagePath}
                        alt={"profile image"}
                        fallbackSrc={dummyProfile}
                      />
                    ) : (
                      <img src={dummyProfile} width={30} height={30} />
                    )}
                  </div>
                  <div className="col-span-7">
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "500",
                        paddingBottom: "10px",
                      }}
                    >
                      {customerName || "NA"}
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          marginLeft: "5px",
                        }}
                      >
                        {`(${customerMobileNumber})` || "NA"}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px" }}>{pickUp}</div>
                  </div>
                </div>
              </div>
            </div>
            <hr style={{ color: "#E1E2F1" }} />

            <div
              className="pt-3"
              style={{
                fontSize: "20px",
                fontWeight: "600",
                paddingBottom: "8px",
              }}
            >
              Vehicle
            </div>
            <div className="grid grid-cols-8 gap-2 pb-3">
              <div className="col-span-2">
                {vehicleImagePath ? (
                  <ImageWithFallback
                    src={vehicleImagePath}
                    alt={"profile image"}
                    fallbackSrc={dummyCar}
                  />
                ) : (
                  <img src={dummyCar} width={70} height={70} />
                )}
              </div>
              <div className="col-span-6">
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    paddingBottom: "10px",
                  }}
                >
                  {vehicleName || "NA"}
                </div>
                <div>
                  <span style={{ fontSize: "12px", fontWeight: "600" }}>
                    {vehicleNumber || "NA"}
                  </span>
                </div>
              </div>
            </div>
            <hr style={{ color: "#E1E2F1" }} />
            {/* Order status History */}
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
                paddingBottom: "10px",
                paddingTop: "14px",
              }}
            >
              Order Status History
            </div>
            <div>
              {updatedStatus.map((statusItem) => {
                // Convert the UTC time to IST
                const utcDate = new Date(statusItem.time);
                const istDate = new Date(
                  utcDate.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000
                );

                // Extract the IST date and time in 'YYYY-MM-DD' and 'HH:MM' format
                const istDateString = istDate.toISOString().substring(0, 10);
                const istTimeString = istDate.toISOString().substring(11, 16);

                return (
                  <div
                    key={statusItem._id}
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      paddingBottom: "18px",
                    }}
                  >
                    {/* Date Icon and Date */}
                    <img
                      src={date}
                      width={16}
                      height={16}
                      style={{ display: "inline-block", marginRight: "2px" }}
                      alt="date icon"
                    />
                    <span className="pe-5">{istDateString}</span>

                    {/* Time Icon and Time */}
                    <img
                      src={time}
                      width={16}
                      height={16}
                      style={{ display: "inline-block", marginRight: "2px" }}
                      alt="time icon"
                    />
                    <span className="pe-5">{istTimeString}</span>

                    <span
                      className={
                        statusItem.status === "ACCEPTED"
                          ? "pendingClass"
                          : statusItem.status === "DELIVERED"
                          ? "completedClass"
                          : statusItem.status === "CANCELLED"
                          ? "cancelledClass"
                          : statusItem.status === "ARRIVED_CUSTOMER_DOORSTEP" ||
                            statusItem.status === "ALLOTTED" ||
                            statusItem.status === "ARRIVED" ||
                            statusItem.status === "DISPATCHED"
                          ? "ongoingClass"
                          : "pendingClass"
                      }
                    >
                      {statusItem.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {currentMap == "olaMap" && (
            <div
              className="col-span-7"
              style={{ width: "45.3vw", height: "80vh", overflow: "hidden" }}
              ref={mapContainerRef}
              id="central-map"
            />
          )}

          {currentMap == "google" && (
            <div className="col-span-7">
              {!isLoaded ? (
                <h1>Loading...</h1>
              ) : (
                <GoogleMap
                  mapContainerStyle={{
                    width: "100%",
                    height: "650px",
                    borderTopRightRadius: "10px",
                    borderBottomRightRadius: "10px",
                  }}
                  center={orderCurrentLatLong.current}
                  zoom={13}
                >
                  {path.length !== 0 && (
                    <Marker
                      position={{
                        lat: orderDetails?.riderPathToPickUp[0]?.latitude,
                        lng: orderDetails?.riderPathToPickUp[0]?.longitude,
                      }}
                      label="S"
                    />
                  )}
                  <Marker
                    position={{
                      lat: orderDetails?.pickup_details?.latitude,
                      lng: orderDetails?.pickup_details?.longitude,
                    }}
                    label="P"
                  />
                  <Marker
                    position={{
                      lat: orderDetails?.drop_details?.latitude,
                      lng: orderDetails?.drop_details?.longitude,
                    }}
                    label="D"
                  />
                  {driverLocation && (
                    <Marker position={driverLocation} label="DR" />
                  )}
                  <Polyline
                    path={path}
                    options={{ strokeColor: "blue", strokeWeight: 4 }}
                  />
                  <Polyline
                    path={realPath}
                    options={{ strokeColor: "green", strokeWeight: 4 }}
                  />
                </GoogleMap>
              )}
            </div>
          )}
        </Card>
      </>
    </>
  );
};

export default OrderView;
