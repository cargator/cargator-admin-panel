import React from "react";
import { useEffect, useState, FC } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useParams } from "react-router-dom";
import Navbar from "../../../../components/navbar";
import Loader from "../../../../components/loader/loader";
import Card from "../../../../components/card";
import time from "../../../../assets/svg/time.svg";
import date from "../../../../assets/svg/date.svg";
import ridePickDest from "../../../../assets/svg/ridePickDest.svg";
import call from "../../../../assets/svg/call.svg";
import dummyCar from "../../../../assets/svg/dummyCar.svg";
import dummyProfile from "../../../../assets/svg/dummyProfile.svg";

import axios, { AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";

import {
  getDriverLocationApi,
  getRideDetailsApi,
  getS3SignUrlApi,
  orderById,
} from "services/customAPI";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
const center = { lat: 19.118830203528184, lng: 72.88509654051545 };

const ImageWithFallback: React.FC<{
  src: string;
  alt: string;
  fallbackSrc: string;
}> = ({ src, alt, fallbackSrc }) => {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    // This function is called when the original image fails to load.
    // Set the source (src) of the image to the fallback source.
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
  const [path, setPath] = useState<any>([]);
  const [realPath, setRealPath] = useState([]);
  const [driverLocation, setDriverLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [driverImagePath, setDriverImagePath] = useState("");
  const [vehicleImagePath, setVehicleImagePath] = useState("");
  
  const [dateTimeCreatedAt, setDateTimeCreatedAt] = useState("");
  const[pickUp,setpickUp]=useState("");
  const[drop,setDrop]=useState("");
  const[orderPrice,setOrderPrice]=useState(0);
  const[driverName,setDriverName]=useState("");
  const[driverMobileNumber,setDriverMobileNumber]=useState(0);
  const[vehicalName,setVehicalName]=useState("");
  const[vehicalNumber,setVehicalNumber]=useState("");
  const [orderStatus,setOrderStatus]=useState("")
  const [orderDetails,setOrderDetails]=useState(null)

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    // googleMapsApiKey: "",
  });

  if (!isLoaded) {
    console.log("not loading");
  }

  const convertPath = (coords: any) => {
    const path = coords?.map((ele: any) => {
      return { lat: ele.latitude, lng: ele.longitude };
    });
    console.log(`convertPath >> path :>> `, path);
    // setPath(path)
    return path;
  };

  const getDriverLocation = async (id: string) => {
    console.log(`getDriverLocationcalled`);
    const response = await getDriverLocationApi({
      driverId: id,
    });
    console.log("getDriverLocation >> response :>> ", response);
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
      console.log("getS3SignUrl", response?.url);
      return response?.url;
    }
  }

  const getDriverImage = async (keys: string) => {
    // const key = keys;
    const contentType = "image/*";
    const type = "get";
    const data: any = await getS3SignUrl(keys, contentType, type);
    console.log("data :>> ", data);
    setDriverImagePath(data);
  };

  const getVehicleImage = async (keys: string) => {
    // const key = keys;
    const contentType = "image/*";
    const type = "get";
    const data: any = await getS3SignUrl(keys, contentType, type);
    console.log("data :>> ", data);
    setVehicleImagePath(data);
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await orderById(params.id);
      const order=res.data;
      setOrderDetails(order)
      //   console.log(order.order_details);
      setpickUp(order.pickup_details.address)
      setDrop(order.drop_details.address)
      setOrderPrice(order.order_details.order_total)
      setDriverName(order.driver_details.name)
      setDriverMobileNumber(order.driver_details.contact)
      setVehicalName(order.driver_details.vehicalName)
      setVehicalNumber(order.driver_details.vehicalNumber)
      setOrderStatus(order.status)
      setDateTimeCreatedAt(convertUtcToIst(order.createdAt));
   
      setIsLoading(false);
    } catch (error) {
      // errorToast(error.response.data.message)
      setIsLoading(false);
    }
  };
 

  useEffect(() => {
   
    console.log(params.id);

    getData();
    

    // getImage()
  }, []);

  return (
    <>
      <Navbar flag={false} brandText="Ride details" />
      <Link
        to="/admin/rides"
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <FaArrowLeft />
        <div>Back</div>
      </Link>
      {isLoading ? (
        <Loader />
      ) : (
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
                    ride?.status === "completed"
                      ? "completedClass"
                      : ride?.status === "cancelled" ||
                        ride?.status === "Failed"
                      ? "cancelledClass"
                      : "ongoingClass"
                  }
                >
                    
                  {orderStatus}
                </span>
              </div>
              <div className="grid grid-cols-8 gap-2 pb-3">
                <div className="col-span-1">
                  <img src={ridePickDest} width={20} height={88} />
                </div>
                <div
                  className="col-span-7"
                  style={{ fontSize: "12px", fontWeight: "400", width: "70%" }}
                >
                  <div style={{ paddingBottom: "30px" }}>
                    {pickUp}
                  </div>
                  <div>{drop}</div>
                </div>
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
              <div className="grid grid-cols-8 gap-2 pb-3">
                <div className="col-span-2">
                  {/* {profileImagePath !== "" ? (
                    <img
                      src={profileImagePath}
                      width={70}
                      height={70}
                      alt="profile image"
                      onerror="this.onerror=null;img/noimg.jpg;"
                    />
                  ) : (
                    <img
                      src={dummyProfileImage}
                      width={70}
                      height={70}
                      alt="profile image"
                    />
                  )} */}
                  {driverImagePath ? (
                    <ImageWithFallback
                      src={driverImagePath}
                      alt={"profile image"}
                      fallbackSrc={dummyProfile}
                    />
                  ) : (
                    <img src={dummyProfile} width={70} height={70} />
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
                    {driverName ||"NA"}
                  </div>
                  <div>
                    <img
                      src={call}
                      width={16}
                      height={16}
                      style={{ display: "inline-block", marginRight: "2px" }}
                    />{" "}
                    <span style={{ fontSize: "12px", fontWeight: "600" }}>
                      { driverMobileNumber ||"NA"}
                    </span>
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
                  {/* <img src={dummyCar} width={70} height={70} /> */}
                </div>
                <div className="col-span-6">
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "500",
                      paddingBottom: "10px",
                    }}
                  >
                    {vehicalName  || "NA"}
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: "600" }}>
                      {vehicalNumber || "NA"}
                    </span>
                  </div>
                </div>
              </div>
              <hr style={{ color: "#E1E2F1" }} />
            </div>

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
                  center={center}
                  zoom={10}
                >
                  <Marker
                    position={{
                        lat: orderDetails?.pickup_details?.latitude,
                        lng: orderDetails?.pickup_details?.longitude,
                    }}
                    // icon={car}
                    label="P"
                  />

                  <Marker
                    position={{
                      lat: orderDetails?.drop_details?.latitude,
                      lng: orderDetails?.drop_details?.longitude,
                    }}
                    // icon={car}
                    label="D"
                  />

                  {driverLocation && (
                    <Marker
                      position={driverLocation}
                      // icon={car}
                      label="DR"
                    />
                  )}

                  <Polyline
                    path={path}
                    options={{
                      strokeWeight: 4,
                    }}
                  />

                  <Polyline
                    path={realPath}
                    // strokeWidth={4}
                    options={{ strokeColor: "red", strokeWeight: 4 }}
                  />
                </GoogleMap>
              )}
            </div>
            {/* </div> */}
          </Card>
        </>
      )}
    </>
  );
};

export default OrderView;
