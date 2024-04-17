/* eslint-disable */
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";
import { GiRoad } from "react-icons/gi";
import { Select } from "@chakra-ui/react";
import VehicleType from "views/admin/settings/vehicleType/vehicleType";
import { useTranslation } from 'react-i18next'
// chakra imports

export const SidebarLinks = (props: { routes: RoutesType[] }): JSX.Element => {
  // Chakra color mode
  const { t } = useTranslation();
  let location = useLocation();
  const [settingsActive, setSettingsActive] = useState(false);
  const navigate = useNavigate()
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
      ) 
      {
        if (!route.secondary) {
          return (
            <>
              <div
                key={index}
                onClick={() =>{
                  if(route.name === "Settings")
                  {
                    setSettingsActive(!settingsActive)
                  }
                  else {
                    setSettingsActive(false)
                    navigate(route.layout + "/" + route.path)
                  }
                 
                  
                }
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
                      {t(`${route.name}`)}
                    </p>
                  </li>
                  {activeRoute(route.path) ? (
                    <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                  ) : null}
                </div>
              </div>
              {/* Conditionally render additional options if Settings is active */}
              {settingsActive && route.name === "Settings" && (
                <div className="ml-14 flex flex-col">
                  <Link
                    className="mb-2 text-sm font-medium text-gray-600 hover:text-blue-700"
                    to={route.layout + "/" + "settings" + "/general"}
                  >
                    <div>
                      <span>{t("General")}</span>
                      {/* {activeRoute(route.path + "/general") ? (
                        <div className="absolute right-0 top-15 h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                      ) : null} */}
                    </div>
                  </Link>
                  <Link
                    className="mb-2 text-sm font-medium text-gray-600 hover:text-blue-700"
                    to={route.layout + "/" + "settings" + "/countrycode"}
                  >
                    <div>
                      <span>{t("Country Code")}</span>
                 
                    </div>
                  </Link>
                  <Link
                    className="mb-2 text-sm font-medium text-gray-600 hover:text-blue-700"
                    to={route.layout + "/" + route.path}
                  >
                    <div>
                      <span>{t("Vehicle Details")}</span>
                 
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
