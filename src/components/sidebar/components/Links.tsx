/* eslint-disable */
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";
import { useTranslation } from "react-i18next";
import { RoutesType } from "routes"; // Adjust the path as per your project structure

export const SidebarLinks = (props: { routes: RoutesType[] }): JSX.Element => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { routes } = props;
  const [settingsActive, setSettingsActive] = useState(false);

  // Function to check if a route is active based on its path
  const isActiveRoute = (routePath: string): boolean => {
    return location.pathname.includes(routePath);
  };

  // Function to generate sidebar links based on routes
  const createLinks = (routes: RoutesType[]): JSX.Element[] => {
    return routes.map((route, index) => {
      if (
        route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl"
      ) {
        if (!route.secondary) {
          return (
            <div key={index} className="h-full">
              <div className="relative mb-3 hover:cursor-pointer">
                <li
                  className="my-[3px] flex cursor-pointer items-center px-8"
                  onClick={() => {
                    if (route.name === "Settings") {
                      setSettingsActive(!settingsActive);
                    } else {
                      setSettingsActive(false);
                      navigate(`${route.layout}/${route.path}`);
                    }
                  }}
                >
                  <span
                    className={`${
                      isActiveRoute(route.path)
                        ? "font-bold text-brand-500 dark:text-white"
                        : "font-medium text-gray-600"
                    }`}
                  >
                    {route.icon ? route.icon : <DashIcon />}
                  </span>
                  <p
                    className={`leading-1 ml-4 flex ${
                      isActiveRoute(route.path)
                        ? "font-bold text-navy-700 dark:text-white"
                        : "font-medium text-gray-600"
                    }`}
                  >
                    {t(route.name)} {/* Use translation function directly */}
                  </p>
                </li>
                {isActiveRoute(route.path) ? (
                  <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                ) : null}
              </div>

              {/* Render additional options if Settings is active */}
              {settingsActive && route.name === "Settings" && (
                <div className="ml-14 flex flex-col">
                  <Link
                    className="mb-2 text-sm font-medium text-gray-600 hover:text-blue-700"
                    to={`${route.layout}/settings/general`}
                  >
                    <div>
                      <span>{t("General")}</span>
                    </div>
                  </Link>
                  <Link
                    className="mb-2 text-sm font-medium text-gray-600 hover:text-blue-700"
                    to={`${route.layout}/settings/users`}
                  >
                    <div>
                      <span>{t("Users")}</span>
                    </div>
                  </Link>
                  <Link
                    className="mb-2 text-sm font-medium text-gray-600 hover:text-blue-700"
                    to={`${route.layout}/settings/countrycode`}
                  >
                    <div>
                      <span>{t("Country Code")}</span>
                    </div>
                  </Link>
                  <Link
                    className="mb-2 text-sm font-medium text-gray-600 hover:text-blue-700"
                    to={`${route.layout}/settings/flows`}
                  >
                    <div>
                      <span>{t("Flows")}</span>
                    </div>
                  </Link>
                  <Link
                    className="mb-2 text-sm font-medium text-gray-600 hover:text-blue-700"
                    to={`${route.layout}/${route.path}`}
                  >
                    <div>
                      <span>{t("Vehicle Details")}</span>
                    </div>
                  </Link>
                  <Link
                    className="mb-2 text-sm font-medium text-gray-600 hover:text-blue-700"
                    to={`${route.layout}/settings/activity`}
                  >
                    <div>
                      <span>{t("Activity")}</span>
                    </div>
                  </Link>
                  <Link
                    className="mb-2 text-sm font-medium text-gray-600 hover:text-blue-700"
                    to={`${route.layout}/settings/privacyPolicy`}
                  >
                    <div>
                      <span>{t("Privacy Policy")}</span>
                    </div>
                  </Link>
                  <Link
                    className="mb-2 text-sm font-medium text-gray-600 hover:text-blue-700"
                    to={`${route.layout}/settings/support`}
                  >
                    <div>
                      <span>{t("Support")}</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          );
        }
      }
      return null; // Ensure a valid return statement in all paths of map function
    });
  };

  return <div className="overflow-y-auto">{createLinks(routes)}</div>; // Render generated links
};

export default SidebarLinks;
