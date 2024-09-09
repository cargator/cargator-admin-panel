/* eslint-disable */

import React, { useEffect } from "react";
import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import SidebarCard from "components/sidebar/componentsrtl/SidebarCard";
import { authenticatedRoutes, publicRoutes } from "../../routes"; // Adjust path as per your file structure
// import logo from "../../assets/images/sukam-logo 3.png";
import logo from "../../assets/images/sukam-logo 1.png";
// import logo from "../../assets/svg/sukam-logo 3.svg"
import { useDispatch, useSelector } from "react-redux";
import { setSideBarState } from "../../redux/reducers/sideBarReducer";

const Sidebar: React.FC<{
  open: boolean;
  onClose: React.MouseEventHandler<HTMLSpanElement>;
}> = ({ open, onClose }) => {
  const sidebarFlag = useSelector((store: any) => {
    if (
      window.innerWidth > 1200 &&
      store.sideBarStateChange.sideBarState === false
    ) {
      return true;
    } else {
      return store.sideBarStateChange.sideBarState;
    }
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1200) {
        dispatch(setSideBarState(true));
      }
    };

    handleResize(); // Call on initial render

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex h-screen min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        sidebarFlag ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className={`absolute right-4 top-4 block cursor-pointer xl:hidden`}
        onClick={() => dispatch(setSideBarState(false))}
      >
        <HiX />
      </span>

      <div className={`mx-[90px] mt-[100px] flex items-center`}>
        <div style={{ widows: "1px" }}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "80px", height: "auto", margin: "0%" }}
          />
        </div>
      </div>
      <div className="mb-7 mt-[58px] h-px " />

      <ul className="mb-auto overflow-y-auto pt-1">
        <Links routes={[...authenticatedRoutes, ...publicRoutes]} />
      </ul>

      {/* Example of SidebarCard usage */}
      {/* <div className="flex justify-center">
        <SidebarCard />
      </div> */}
    </div>
  );
};

export default Sidebar;
