/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";

import SidebarCard from "components/sidebar/componentsrtl/SidebarCard";
import routes from "routes";
import logo from "../../assets/svg/logosidebar.svg";
import { useDispatch, useSelector } from "react-redux";
import { setSideBarState } from "../../redux/reducers/sideBarReducer";
import { useEffect } from "react";

const Sidebar = (props: {
  open: boolean;
  onClose: React.MouseEventHandler<HTMLSpanElement>;
}) => {
  const { open, onClose } = props;
  const sidebarFlag = useSelector((store: any) => {
    if (
      window.innerWidth > 1200 &&
      store.sideBarStateChange.sideBarState == false
    ) {
      return true;
    } else {
      return store.sideBarStateChange.sideBarState;
    }
  });
  console.log("sidebarFlag", sidebarFlag);
  const dispatch = useDispatch();
  // const handleSideBarStateChange = () => {dispatch(setToken(null)}

  useEffect(() => {
    // console.log("object sidebarFlag :>> ", sidebarFlag);
    if (window.innerWidth > 1200) {
      dispatch(setSideBarState(true));
    }
  }, [window.innerWidth]);

  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        sidebarFlag ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className={` absolute right-4 top-4 block cursor-pointer xl:hidden`}
        onClick={() => dispatch(setSideBarState(false))}
      >
        <HiX />
      </span>

      <div className={`mx-[90px] mt-[50px] flex items-center`}>
        <div className="ml-1 mt-1 h-2.5 ">
          {/* Horizon <span className="font-medium">FREE</span> */}
          <img src={logo} />
        </div>
      </div>
      <div className="mb-7 mt-[58px] h-px " />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={routes} />
      </ul>

      {/* Free Horizon Card */}
      {/* <div className="flex justify-center">
        <SidebarCard />
      </div> */}

      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;
