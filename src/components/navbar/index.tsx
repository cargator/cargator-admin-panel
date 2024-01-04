import React, { useEffect } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import avatar from "assets/img/avatars/avatar4.png";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "redux/reducers/authReducer";
import { setSideBarState } from "../../redux/reducers/sideBarReducer";

const Navbar = (props: {
  onOpenSidenav?: () => void;
  brandText?: string;
  secondary?: boolean | string;
  handleSearch?: (e: React.SyntheticEvent<EventTarget>) => void;
  setSearchText?: (val: string) => void;
  flag?: boolean
}) => {
  const { onOpenSidenav, brandText, handleSearch, setSearchText, flag } = props;
  const [darkmode, setDarkmode] = React.useState(
    document.body.classList.contains("dark")
  );
const sidebarFlag = useSelector(
  (store: any) => store.sideBarStateChange.sideBarState
);
const dispatch = useDispatch();

  const handleLogout = () => {
    console.log(`handleLogout called`);
    dispatch(setToken(null));
  };

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-end rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <form onSubmit={handleSearch}>
        <div
          className={
            flag
              ? "relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2"
              : "relative mt-[3px] flex h-[61px] w-[150px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[150px] md:flex-grow-0 md:gap-1 xl:w-[150px] xl:gap-2"
          }
        >
          {flag && (
            <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
              <p className="pl-3 pr-2 text-xl">
                <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
              </p>
              <input
                type="text"
                placeholder="Search..."
                className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          )}
          <span
            className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
            onClick={() => dispatch(setSideBarState(!sidebarFlag))}
          >
            <FiAlignJustify className="h-5 w-5" />
          </span>
          <div
            className="cursor-pointer text-gray-600"
            onClick={() => {
              if (darkmode) {
                document.body.classList.remove("dark");
                setDarkmode(false);
              } else {
                document.body.classList.add("dark");
                setDarkmode(true);
              }
            }}
          >
            {darkmode ? (
              <RiSunFill
                className="h-4 w-4 text-gray-600 dark:text-white"
              />
            ) : (
              <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
            )}
          </div>
          {/* Profile & Dropdown */}
          <Dropdown
            button={
              <img
                className="h-10 w-10 rounded-full cursor-pointer"
                src={avatar}
                alt="Elon Musk"
              />
            }
            children={
              <div className="flex h-20 w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
                {/* <div className="ml-4 mt-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 Hey, Adela
                  </p>{" "}
                </div>
              </div>
              <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20 " /> */}

                <div className="ml-4 mt-3 flex flex-col">
                  {/* <a
                  href=" "
                  className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Profile Settings
                </a>
                <a
                  href=" "
                  className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Newsletter Settings
                </a> */}
                  <a
                    onClick={handleLogout}
                    href="/login"
                    className="mt-3 text-sm font-medium text-red-500 hover:text-red-500"
                  >
                    Log Out
                  </a>
                </div>
              </div>
            }
            classNames={"py-2 top-8 -left-[180px] w-max"}
          />
        </div>
      </form>
    </nav>
  );
};

export default Navbar;
