import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import car from "../../../assets/images/car.svg";
import RidesIcon from "../../../assets/svg/RidesIcon.svg";
import RevenueIcon from "../../../assets/svg/RevenueIcon.svg";
import VehiclesIcon from "../../../assets/svg/VehiclesIcon.svg";
import { isEmpty as _isEmpty } from "lodash";
import {
  dashboardDataApi,
  onlineDriversApi,
} from "../../../services/customAPI";
import Navbar from "components/navbar";
import Loader from "components/loader/loader";
import Card from "components/card";
import { Link, useNavigate } from "react-router-dom";

const center = { lat: 19.118830203528184, lng: 72.88509654051545 };

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
  const [intervalState, setIntervalState] = useState();
  const [allOnlineDrivers, setAllOnlineDrivers] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinner, setIsSpinner] = useState(true);
  const [ongoingRidesCount, setOngoingRidesCount] = useState([]);
  const [completeRidesCount, setCompleteRidesCount] = useState([]);
  const [onlineDriversCount, setOnlineDriversCount] = useState([]);
  const [totalDriver, setTotalDriver] = useState([]);

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

  const getDashboardData = async () => {
    try {
      setIsSpinner(true);
      const dashboardDataResponse: any = await dashboardDataApi();
      setDashboardData(dashboardDataResponse.data);
      setOngoingRidesCount(dashboardDataResponse.data.ongoingRidesCount);
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
    navigate('/admin/rides?data=ongoing-rides');
  };

  const handleNavigationCompleteRide = () => {
    navigate('/admin/rides?data=completed');
  };

  useEffect(() => {
    getAllOnlineDrivers();
    // getAllDrivers()
    getDashboardData();
  }, []);

  useEffect(() => {
    // console.log('useEffect dashboardData :>> ', dashboardData)
    if (!_isEmpty(dashboardData)) {
      setIsSpinner(false);
    }
  }, [dashboardData]);

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
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* <WidgetsDropdown totalDriver={totalDriver} allOnlineDriver={allOnlineDriver} /> */}

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
                      Ongoing Trips
                    </h1>
                  </div>
                  <h3 className="mt-12 text-end" style={{ color: "#2BB180" }}>
                    {isSpinner ? <CustomSpinner /> :  <span style={{fontSize:33, cursor: "pointer"}} onClick={handleNavigation}>{ongoingRidesCount}</span>}
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
                      Drivers
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
                        Total:
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
                        {isSpinner ? <CustomSpinner /> : <Link style={{fontSize:32}} to="/admin/drivers">{totalDriver}</Link>}
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
                        Online:
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
                        {isSpinner ? <CustomSpinner /> : <Link style={{fontSize:32}} to="/admin/drivers">{onlineDriversCount}</Link>}
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
                      Completed Trips
                    </h1>
                  </div>
                  <h3 className="mt-12 text-end" style={{ color: "#2BB180" }}>
                    {isSpinner ? <CustomSpinner /> : <span style={{fontSize:33, cursor: "pointer"}} onClick={handleNavigationCompleteRide}>{completeRidesCount}</span>}
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
                  Active Drivers:
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

            <div className="h-100 w-100  bg-info">
              {!isLoaded ? (
                <h1>Loading...</h1>
              ) : (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "500px" }}
                  center={center}
                  zoom={10}
                >
                  {allOnlineDrivers &&
                    allOnlineDrivers.length > 0 &&
                    allOnlineDrivers.map((driverId) => {
                      return (
                        <Marker
                          key={driverId}
                          position={{
                            lat:
                              driverId.liveLocation && driverId.liveLocation[1],
                            lng:
                              driverId.liveLocation && driverId.liveLocation[0],
                          }}
                          icon={car}
                        />
                      );
                    })}
                </GoogleMap>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
