// RTL.tsx

import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar/RTL";
import Sidebar from "components/sidebar/RTL";
import Footer from "components/footer/Footer";
import { authenticatedRoutes, publicRoutes } from "routes";

interface RoutesType {
  name: string;
  layout: string;
  path: string;
  component: React.ReactNode;
  secondary?: boolean;
  icon?: JSX.Element;
}

const RTL: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [currentRoute, setCurrentRoute] = useState("Main Dashboard");

  useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);

  useEffect(() => {
    getActiveRoute([...authenticatedRoutes, ...publicRoutes]);
  }, [location.pathname]);

  const getActiveRoute = (routes: RoutesType[]): void => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.includes(routes[i].layout + "/" + routes[i].path)) {
        setCurrentRoute(routes[i].name);
        return;
      }
    }
    setCurrentRoute("Main Dashboard");
  };

  const getActiveNavbar = (routes: RoutesType[]): boolean => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.includes(routes[i].layout + routes[i].path)) {
        return !!routes[i].secondary;
      }
    }
    return false;
  };

  const getRoutes = (routes: RoutesType[]): JSX.Element[] => {
    return routes.map((prop, key) => (
      <Route key={key} path={`/${prop.layout}/${prop.path}`} element={prop.component} />
    ));
  };

  document.documentElement.dir = "rtl";

  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main className={`mx-[12px] h-full flex-none transition-all md:pe-2 xl:mr-[313px]`}>
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              brandText={currentRoute}
              secondary={getActiveNavbar([...authenticatedRoutes, ...publicRoutes])}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes([...authenticatedRoutes, ...publicRoutes])}
                <Route path="/" element={<Navigate to="/admin/default" replace />} />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RTL;
