// Admin Imports
import Drivers from "views/admin/drivers";
import Analytics from "views/admin/analytics";
import Rides from "views/admin/rides";
import DriverForm from "views/admin/drivers/driverForm";
import RideView from "views/admin/rides/rideview";
import Vehicles from "views/admin/vehicles";
import { GiMountainRoad, GiSteeringWheel } from "react-icons/gi";
import Flows from 'views/admin/settings/Flow'
import FlowsForm from "views/admin/settings/FlowsForm";
// import RTLDefault from "views/rtl/default";

// Auth Imports

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
} from "react-icons/md";
import Riders from "views/admin/riders";
import VehicleForm from "views/admin/vehicles/vehicleform";
import Dashboard from "views/admin/dashboard";
import { BsChatLeftText } from "react-icons/bs";
import { IoCarSportSharp, IoSettingsOutline } from "react-icons/io5";
import Settings from "views/admin/settings/settings";
import VehicleType from "views/admin/settings/vehicleType/vehicleType";
import Fare from "views/admin/settings/fare";
import VehicleTypeList from "views/admin/settings/vehicleTypeList";
import General from "views/admin/settings/general";
import CountryCode from "views/admin/settings/countryCode/components";
import CountryCodeForm from "views/admin/settings/countryCodeForm";
import { HiLocationMarker } from "react-icons/hi";
import SpotForm from "views/admin/spots/components/SpotForm";
import Spots from "views/admin/spots";
// import CountryCodeForm from "views/admin/settings/countryCodeForm";
const routes = [
  {
    name: "Dashboards",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <Dashboard />,
  },
  {
    name: "Spots",
    layout: "/admin",
    path: "spots",
    icon: <HiLocationMarker className="h-6 w-6" />,
    component: <Spots />,
  },
  {
    name: "Spot Form",
    layout: "/admin",
    path: "spot/spot-form",
    // icon: <MdPerson className="h-6 w-6" />,
    component: <SpotForm />,
    secondary: true,
  },
  {
    name: "Drivers",
    layout: "/admin",
    path: "drivers",
    icon: <GiSteeringWheel className="h-6 w-6" />,
    component: <Drivers />,
    // secondary: true,
  },
  {
    name: "Riders",
    layout: "/admin",
    icon: <MdPerson className="h-6 w-6" />,
    path: "riders",
    component: <Riders />,
  },
  {
    name: "Vehicles",
    layout: "/admin",
    icon: <IoCarSportSharp className="h-6 w-6" />,
    path: "vehicles",
    component: <Vehicles />,
  },
  {
    name: "Rides",
    layout: "/admin",
    icon: <GiMountainRoad className="h-6 w-6" />,
    path: "rides",
    component: <Rides />,
  },
  {
    name: "Analytics",
    layout: "/admin",
    path: "analytics",
    icon: <BsChatLeftText className="h-5 w-5" />,
    component: <Analytics />,
  },
  {
    name: "General",
    layout: "/admin",
    path: "settings/general",
    component: <General/>,
    secondary: true,
  },
  {
    name: "Settings",
    layout: "/admin",
    path: "settings/countrycode",
    component: <CountryCode/>,
    icon: <IoSettingsOutline className="h-6 w-6" />,
    secondary: true,
  },
  {
    name: "Settings",
    layout: "/admin",
    path: "settings",
    icon: <IoSettingsOutline className="h-6 w-6" />,
    component: <VehicleTypeList />,
    // secondary: true,
  },
  {
    name: "Settings",
    layout: "/admin",
    path: "settings/flows",
    component: <Flows/>,
    icon: <IoSettingsOutline className="h-6 w-6" />,
    secondary: true,
  },
  {
    name: "Fare",
    layout: "/admin",
    path: "settings/fare",
    component: <Fare />,
    secondary: true,
  },
  // {
  //   name: "VehicleType",
  //   layout: "/admin",
  //   path: "settings/vehicle-type",
  //   component: <VehicleTypeList />,
  //   secondary: true,
  // },
  {
    name: "VehicleType",
    layout: "/admin",
    path: "settings/vehicletypeform",
    component: <VehicleType />,
    secondary: true,
  },
  {
    name: "VehicleType Id",
    layout: "/admin",
    path: "settings/vehicletypeform/:id",
    component: <VehicleType />,
    secondary: true,
  },
  {
    name: "VehicleForm",
    layout: "/admin",
    path: "vehicles/vehicleform",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <VehicleForm />,
    secondary: true,
  },

  {
    name: "VehicleForm Id",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "vehicles/vehicleform/:id",
    component: <VehicleForm />,
    secondary: true,
  },

  {
    name: "Driver Form",
    layout: "/admin",
    path: "drivers/driverform",
    // icon: <MdPerson className="h-6 w-6" />,
    component: <DriverForm />,
    secondary: true,
  },
  {
    name: "DriverForm Id",
    layout: "/admin",
    path: "drivers/driverform/:id",
    // icon: <MdPerson className="h-6 w-6" />,
    component: <DriverForm />,
    secondary: true,
  },
  {
    name: "Ride Details",
    layout: "/admin",
    path: "rides/ridedetails/:id",
    // icon: <MdPerson className="h-6 w-6" />,
    component: <RideView />,
    secondary: true,
  },
  {
    name: "Country-Form",
    layout: "/admin",
    path: "settings/countrycode-form",
    icon: <MdPerson className="h-6 w-6" />,
    component: <CountryCodeForm/>,
    secondary:true
  },
  {
    name: "Flows-Form",
    layout: "/admin",
    path: "settings/flow-form",
    icon: <MdPerson className="h-6 w-6" />,
    component: <FlowsForm/>,
    secondary:true
  },
  {
    name: "Flows-Form ID",
    layout: "/admin",
    path: "settings/flow-form/:id",
    icon: <MdPerson className="h-6 w-6" />,
    component: <FlowsForm/>,
    secondary:true
  },
];
export default routes;
