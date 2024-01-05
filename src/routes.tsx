// Admin Imports
import Analytics from "views/admin/analytics";
import Drivers from "views/admin/drivers";
import DriverForm from "views/admin/drivers/driverForm";
import Rides from "views/admin/rides";
import RideView from "views/admin/rides/rideview";
import Vehicles from "views/admin/vehicles";
// import RTLDefault from "views/rtl/default";

// Auth Imports

// Icon Imports
import {
  MdBarChart,
  MdHome,
  MdOutlineShoppingCart,
  MdPerson,
} from "react-icons/md";
import Dashboard from "views/admin/dashboard";
import Riders from "views/admin/riders";
import VehicleForm from "views/admin/vehicles/vehicleform";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <Dashboard />,
  },

  {
    name: "Vehicles",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "vehicles",
    component: <Vehicles />,
  },
  {
    name: "Drivers",
    layout: "/admin",
    path: "drivers",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <Drivers />,
    // secondary: true,
  },
  {
    name: "Riders",
    layout: "/admin",
    path: "riders",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Riders />,
  },
  {
    name: "Rides",
    layout: "/admin",
    path: "rides",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Rides />,
  },
  {
    name: "Analytics",
    layout: "/admin",
    path: "analytics",
    icon: <MdPerson className="h-6 w-6" />,
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
