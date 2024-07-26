import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "components/sidebar";
import { authenticatedRoutes, RoutesType } from "../../routes"; // Ensure correct import path for RoutesType

export default function Admin(props: { [x: string]: any }) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);

  React.useEffect(() => {
    getActiveRoute(authenticatedRoutes); // Replace 'routes' with your authenticated routes array
  }, [location.pathname]);

  const getActiveRoute = (routes: RoutesType[]): void => {
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
        return; // Exit loop once active route is found
      }
    }
    setCurrentRoute("Main Dashboard"); // Default route if no match found
  };

  const getRoutes = (routes: RoutesType[]): JSX.Element[] => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={`/${prop.path}`}
            element={prop.component}
            key={key}
          />
        );
      }
      return null;
    });
  };

  document.documentElement.dir = "ltr";

  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="h-full w-full bg-lightPrimary dark:bg-navy-900">
        <main className="mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]">
          <div className="pt-5s mx-auto mb-auto h-full min-h-[100vh] p-2 md:pr-2">
            <Routes>
              {getRoutes(authenticatedRoutes)} {/* Replace 'routes' with authenticatedRoutes */}
              <Route path="/" element={<Navigate to="/admin/default" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
