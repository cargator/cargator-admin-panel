// routes.ts

import React from "react";
import Dashboard from "views/admin/dashboard";
import Spots from "views/admin/spots";
import SpotForm from "views/admin/spots/components/SpotForm";
import Drivers from "views/admin/drivers";
import Orders from "views/admin/orders";
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
import CreateOrder from "views/admin/orders/components/createOrder";
import { MdHome, MdBarChart, MdFastfood, MdOutlineShoppingCart } from "react-icons/md";
import { HiLocationMarker } from "react-icons/hi";
import { BsChatLeftText } from "react-icons/bs";
import { IoCarSportSharp, IoSettingsOutline } from "react-icons/io5";

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
    name: "Dashboard",
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
    component: <SpotForm />,
    secondary: true,
  },
  {
    name: "Drivers",
    layout: "/admin",
    path: "drivers",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <Drivers />,
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
    path: "vehicles",
    icon: <IoCarSportSharp className="h-6 w-6" />,
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
    name: "Privacy Policy",
    layout: "/admin",
    path: "settings/privacyPolicy",
    component: <PrivacyPolicy />,
    secondary: true,
  },
  {
    name: "Support",
    layout: "/admin",
    path: "settings/support",
    component: <Support />,
    secondary: true,
  },
  {
    name: "Country Code",
    layout: "/admin",
    path: "settings/countrycode",
    component: <CountryCode />,
    icon: <IoSettingsOutline className="h-6 w-6" />,
    secondary: true,
  },
  {
    name: "Vehicle Type List",
    layout: "/admin",
    path: "settings",
    component: <VehicleTypeList />,
  },
  {
    name: "Flows",
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
  {
    name: "Vehicle Type",
    layout: "/admin",
    path: "settings/vehicletypeform",
    component: <VehicleType />,
    secondary: true,
  },
  {
    name: "Vehicle Type ID",
    layout: "/admin",
    path: "settings/vehicletypeform/:id",
    component: <VehicleType />,
    secondary: true,
  },
  {
    name: "Vehicle Form",
    layout: "/admin",
    path: "vehicles/vehicleform",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <VehicleForm />,
    secondary: true,
  },
  {
    name: "Vehicle Form ID",
    layout: "/admin",
    path: "vehicles/vehicleform/:id",
    component: <VehicleForm />,
    secondary: true,
  },
  {
    name: "Driver Form",
    layout: "/admin",
    path: "drivers/driverform",
    component: <DriverForm />,
    secondary: true,
  },
  {
    name: "Create Order",
    layout: "/admin",
    path: "order/add",
    component: <CreateOrder />,
    secondary: true,
  },
  {
    name: "Driver Form ID",
    layout: "/admin",
    path: "drivers/driverform/:id",
    component: <DriverForm />,
    secondary: true,
  },
  {
    name: "Ride Details",
    layout: "/admin",
    path: "rides/ridedetails/:id",
    component: <RideView />,
    secondary: true,
  },
  {
    name: "Country Code Form",
    layout: "/admin",
    path: "settings/countrycode-form",
    component: <CountryCodeForm />,
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    secondary: true,
  },
  {
    name: "Flows Form",
    layout: "/admin",
    path: "settings/flow-form",
    component: <FlowsForm />,
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    secondary: true,
  },
  {
    name: "Flows Form ID",
    layout: "/admin",
    path: "settings/flow-form/:id",
    component: <FlowsForm />,
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
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
  // Add more public routes as needed
];

export { authenticatedRoutes, publicRoutes };
