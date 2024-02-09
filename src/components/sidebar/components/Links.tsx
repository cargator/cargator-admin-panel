/* eslint-disable */
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";
import { GiRoad } from "react-icons/gi";
import { Select } from "@chakra-ui/react";
import VehicleType from "views/admin/settings/vehicleType/vehicleType";
// chakra imports

export const SidebarLinks = (props: { routes: RoutesType[] }): JSX.Element => {
  // Chakra color mode
  let location = useLocation();
  const [settingsActive, setSettingsActive] = useState(false);

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName: string) => {
    return location.pathname.includes(routeName);
  };

  const createLinks = (routes: RoutesType[]) => {
    return routes.map((route, index) => {
      if (
        route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl"
      ) {
        if (!route.secondary) {
          return (
            <>
              <Link
                key={index}
                to={route.layout + "/" + route.path}
                onClick={() =>
                  route.name === "Settings"
                    ? setSettingsActive(!settingsActive)
                    : setSettingsActive(false)
                }
              >
                <div className="relative mb-3 flex hover:cursor-pointer">
                  <li
                    className="my-[3px] flex cursor-pointer items-center px-8"
                    key={index}
                  >
                    <span
                      className={`${
                        activeRoute(route.path) === true
                          ? "font-bold text-brand-500 dark:text-white"
                          : "font-medium text-gray-600"
                      }`}
                    >
                      {route.icon ? route.icon : <DashIcon />}{" "}
                    </span>
                    <p
                      className={`leading-1 ml-4 flex ${
                        activeRoute(route.path) === true
                          ? "font-bold text-navy-700 dark:text-white"
                          : "font-medium text-gray-600"
                      }`}
                    >
                      {route.name}
                    </p>
                  </li>
                  {activeRoute(route.path) ? (
                    <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                  ) : null}
                </div>
              </Link>
              {/* Conditionally render additional options if Settings is active */}
              {settingsActive && activeRoute(route.path) && (
                <div className="ml-14 flex flex-col">
                  <Link
                    className="mb-2 text-sm font-medium text-gray-600 hover:text-blue-700"
                    to={route.layout + "/" + route.path + "/general"}
                  >
                    <div>
                      <span>General</span>
                      {/* {activeRoute(route.path + "/general") ? (
                        <div className="absolute right-0 top-15 h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                      ) : null} */}
                    </div>
                  </Link>
                  <Link
                    className="mb-2 text-sm font-medium text-gray-600 hover:text-blue-700"
                    to={route.layout + "/" + route.path}
                  >
                    <div>
                      <span>Vehicle Details</span>
                      {/* {activeRoute(route.path) ? (
                        <div className="absolute right-0 top-15 h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                      ) : null} */}
                    </div>
                  </Link>
                  {/* <Link
                    className="text-sm font-medium text-gray-600 hover:text-blue-700"
                    to={route.layout + "/" + route.path + "/fare"}
                  >
                    <span>Fare</span> */}
                    {/* {activeRoute(route.path + '/fare') ? (
                      <div className="absolute right-0 top-15 h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                    ) : null} */}
                  {/* </Link> */}
                </div>
              )}
            </>
          );
        }
      }
    });
  };
  // BRAND
  return <>{createLinks(routes)}</>;
};

export default SidebarLinks;
