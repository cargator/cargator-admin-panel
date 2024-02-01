// Admin Imports
import Drivers from "views/admin/drivers";
import Analytics from "views/admin/analytics";
import Rides from "views/admin/rides";
import DriverForm from "views/admin/drivers/driverForm";
import RideView from "views/admin/rides/rideview";
import Vehicles from "views/admin/vehicles";
import { GiMountainRoad, GiSteeringWheel } from "react-icons/gi";
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
import { BsChatLeftText, BsFillCarFrontFill, BsWindow } from "react-icons/bs";
import { IoCarSportSharp } from "react-icons/io5";
import { RiRoadsterLine } from "react-icons/ri";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <Dashboard />,
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
    path: "rides/:value",
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
];
export default routes;
