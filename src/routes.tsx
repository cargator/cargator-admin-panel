// routes.ts

import React from "react";
import Dashboard from "views/admin/dashboard";
import Spots from "views/admin/spots";
import SpotForm from "views/admin/spots/components/SpotForm";
import Vehicles from "views/admin/vehicles";
import Analytics from "views/admin/analytics";
import General from "views/admin/settings/general";
import PrivacyPolicy from "views/admin/settings/privacyPolicy";
import Support from "views/admin/settings/support";
import CountryCode from "views/admin/settings/countryCode/components";
import CountryCodeForm from "views/admin/settings/countryCodeForm";
import Flows from "views/admin/settings/Flow";
import FlowsForm from "views/admin/settings/FlowsForm";
import VehicleType from "views/admin/settings/vehicleType/vehicleType";
import Fare from "views/admin/settings/fare";
import VehicleTypeList from "views/admin/settings/vehicleTypeList";
import DriverForm from "views/admin/drivers/driverForm";
import RideView from "views/admin/rides/rideview";
import VehicleForm from "views/admin/vehicles/vehicleform";
import {
  MdHome,
  MdBarChart,
  MdFastfood,
  MdOutlineShoppingCart,
  MdPerson,
  MdTwoWheeler,
} from "react-icons/md";
import { HiLocationMarker } from "react-icons/hi";
import { IoRestaurantOutline } from "react-icons/io5";
import { BsChatLeftText } from "react-icons/bs";
import { IoCarSportSharp, IoSettingsOutline } from "react-icons/io5";
import Drivers from "views/admin/drivers";
import Orders from "views/admin/orders";
import CreateOrder from "views/admin/orders/components/createOrder";
import OrderView from "views/admin/orders/components/orderView";
import Admins from "views/admin/settings/Admins";
import CreateUsers from "views/admin/settings/Admins/createUsers";
import Activity from "views/admin/settings/Activity";
import ActivityDetails from "views/admin/settings/Activity/ActivityDetails";
import Restaurent from "views/admin/restaurent";
import RestaurentForm from "views/admin/restaurent/components/RestaurentForm";

export interface RoutesType {
  name: string;
  layout: string;
  path: string;
  component: React.ReactNode;
  secondary?: boolean;
  icon?: JSX.Element;
}

const authenticatedRoutes: RoutesType[] = [
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
    name: "Restaurent",
    layout: "/admin",
    path: "restaurent",
    icon: <IoRestaurantOutline className="h-6 w-6" />,
    component: <Restaurent />,
  },
  {
    name: "Restaurent Form",
    layout: "/admin",
    path: "restaurent/restaurent-form",
    component: <RestaurentForm />,
    secondary: true,
  },
  {
    name: "Riders ",
    layout: "/admin",
    path: "drivers",
    icon: <MdTwoWheeler className="h-6 w-6" />,
    component: <Drivers />,
    // secondary: true,
  },
  {
    name: "Orders",
    layout: "/admin",
    path: "order",
    icon: <MdFastfood className="h-6 w-6" />,
    component: <Orders />,
  },
  {
    name: "Vehicles",
    layout: "/admin",
    icon: <IoCarSportSharp className="h-6 w-6" />,
    path: "vehicles",
    component: <Vehicles />,
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
    component: <General />,
    secondary: true,
  },
  {
    name: "Add Order",
    layout: "/admin",
    path: "order/add",
    component: <CreateOrder />,
    secondary: true,
  },
  {
    name: "privacyPolicy",
    layout: "/admin",
    path: "settings/privacyPolicy",
    component: <PrivacyPolicy />,
    secondary: true,
  },
  {
    name: "support",
    layout: "/admin",
    path: "settings/support",
    component: <Support />,
    secondary: true,
  },
  {
    name: "Settings",
    layout: "/admin",
    path: "settings/users",
    component: <Admins />,
    icon: <IoSettingsOutline className="h-6 w-6" />,
    secondary: true,
  },
  {
    name: "Settings",
    layout: "/admin",
    path: "settings/countrycode",
    component: <CountryCode />,
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
    component: <Flows />,
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
    name: "Order Details",
    layout: "/admin",
    path: "orders/orderDetails/:id",
    // icon: <MdPerson className="h-6 w-6" />,
    component: <OrderView />,
    secondary: true,
  },
  {
    name: "User-Form",
    layout: "/admin",
    path: "settings/users-form",
    component: <CreateUsers />,
    icon: <IoSettingsOutline className="h-6 w-6" />,
    secondary: true,
  },
  {
    name: "Activity",
    layout: "/admin",
    path: "settings/activity",
    component: <Activity />,
    icon: <IoSettingsOutline className="h-6 w-6" />,
    secondary: true,
  },
  {
    name: "Activity detail",
    layout: "/admin",
    path: "settings/activity/:id",
    component: <ActivityDetails />,
    icon: <IoSettingsOutline className="h-6 w-6" />,
    secondary: true,
  },
  {
    name: "Country-Form",
    layout: "/admin",
    path: "settings/countrycode-form",
    icon: <MdPerson className="h-6 w-6" />,
    component: <CountryCodeForm />,
    secondary: true,
  },
  {
    name: "Flows-Form",
    layout: "/admin",
    path: "settings/flow-form",
    icon: <MdPerson className="h-6 w-6" />,
    component: <FlowsForm />,
    secondary: true,
  },
  {
    name: "user-Form ID",
    layout: "/admin",
    path: "settings/user-form/:id",
    icon: <MdPerson className="h-6 w-6" />,
    component: <CreateUsers />,
    secondary: true,
  },
  {
    name: "Flows-Form ID",
    layout: "/admin",
    path: "settings/flow-form/:id",
    icon: <MdPerson className="h-6 w-6" />,
    component: <FlowsForm />,
    secondary: true,
  },
];

const publicRoutes: RoutesType[] = [
  {
    name: "Public Privacy Policy",
    layout: "/",
    path: "privacyPolicy",
    component: <PrivacyPolicy />,
  },
  {
    name: "support",
    layout: "/",
    path: "support",
    component: <Support />,
  },
  // Add more public routes as needed
];

export { authenticatedRoutes, publicRoutes };
