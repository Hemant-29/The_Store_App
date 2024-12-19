import { useContext, useEffect, useState } from "react";
import { colorContext, widthContext } from "../../context/context";
import darkModeIcon from "../assets/darkModeIcon.png";
import lightModeIcon from "../assets/lightMode.png";
import { Link } from "react-router-dom";
import CartIcon from "../icons/cartIcon";
import UserIcon from "../icons/userIcon";
import WishlistIcon from "../icons/WishlistIcon";
import HamburgerIcons from "../icons/HamburgerIcon";
import HamburgerIcon from "../icons/HamburgerIcon";

const TitleBar = () => {
  const [modeIcon, setModeIcon] = useState(lightModeIcon);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userType, setUserType] = useState(false);
  const { appTheme, setAppTheme } = useContext(colorContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Titlebar states
  const [titlebarOpen, setTitlebarOpen] = useState(false);

  const changeAppTheme = () => {
    appTheme == "dark" ? setAppTheme("light") : setAppTheme("dark");
  };

  const appColors = useContext(colorContext);

  useEffect(() => {
    if (appTheme == "light") setModeIcon(lightModeIcon);
    else setModeIcon(darkModeIcon);
    localStorage.setItem("appTheme", appTheme);
  }, [appTheme]);

  useEffect(() => {
    const expiry = localStorage.getItem("tokenExpiry");
    const type = localStorage.getItem("userType");

    if (expiry) {
      const currentTime = Date.now() / 1000; // Convert to seconds
      const expiryTime = expiry - currentTime;
      console.log("Token expiring In:", expiryTime);
      if (expiryTime > 0) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    } else {
      console.log("logged out");
      setLoggedIn(false);
    }

    if (type) {
      if (type == "user") {
        setUserType("user");
      } else if (type == "seller") {
        setUserType("seller");
      } else {
        setUserType(false);
      }
    } else {
      setUserType(false);
    }
  }, []);

  useEffect(() => {
    let titlebarElement;
    if (loggedIn) {
      titlebarElement = document.querySelector("#titlebar-menu-loggedin");
    } else {
      titlebarElement = document.querySelector("#titlebar-menu-loggedout");
    }

    if (titlebarElement) {
      console.log("titlebar height:", titlebarElement.offsetHeight);

      let contentElement = document.querySelector(
        ".titlebar_height-adjustable-background"
      );
      if (contentElement) {
        contentElement.style.height = `${titlebarElement.offsetHeight - 20}px`;
      }
    }
  }, [titlebarOpen]);

  // Window Width Change effect hook
  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 200); // Adjust the delay as needed
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Disappear the underline
  useEffect(() => {
    if (windowWidth <= 640) {
      localStorage.setItem("ulPosition", "280px");
    } else {
      updateUnderlinePosition();
    }
  }, [windowWidth]);

  const underlineSelected = (e) => {
    localStorage.setItem("ulPositionPrev", localStorage.getItem("ulPosition"));
    const linkId = e.target.id;
    localStorage.setItem("selectedLink", linkId);
    updateUnderlinePosition();
  };

  const updateUnderlinePosition = () => {
    const linkId = localStorage.getItem("selectedLink");
    console.log("is logged in:", loggedIn);
    console.log("linked ID:", linkId);

    // Logged out
    if (linkId === "titlebar-signup") {
      localStorage.setItem("ulPosition", "118px");
    } else if (linkId === "titlebar-login") {
      localStorage.setItem("ulPosition", "38px");
    } else if (linkId === "titlebar-logo") {
      localStorage.setItem("ulPosition", "280px");
    }

    // Logged in
    if (linkId === "titlebar-wishlist") {
      localStorage.setItem("ulPosition", "0px");
    } else if (linkId === "titlebar-cart") {
      localStorage.setItem("ulPosition", "63px");
    } else if (linkId === "titlebar-user") {
      localStorage.setItem("ulPosition", "121px");
    } else if (linkId === "titlebar-seller") {
      localStorage.setItem("ulPosition", "121px");
    }
  };

  return (
    <>
      <div
        className={`h-11 whitespace-nowrap ${appColors.bgColor} text-${appColors.fgColor} z-50`}
      >
        <div
          id="titleBar"
          className={`flex h-14 flex-row items-center justify-between shadow-md fixed top-0 w-full z-40 px-5 backdrop-filter rounded-b-2xl ${appColors.titlebarColor}`}
        >
          <Link
            to="/"
            id="titlebar-logo"
            className="text-3xl font-semibold"
            onClick={underlineSelected}
          >
            The Store App
          </Link>
          {(!loggedIn || userType == "seller") && (
            <>
              <Link
                id="titlebar-login"
                to="/login"
                className={`hidden sm:block text-lg font-medium sm:ml-auto p-3`}
                onClick={underlineSelected}
              >
                Login
              </Link>

              <Link
                id="titlebar-signup"
                to="/signup"
                className={`hidden sm:block text-lg font-medium p-3 decoration-4 underline-offset-8`}
                onClick={underlineSelected}
              >
                Sign Up
              </Link>

              <button
                id="titlebar_loggedin-hamburger-menu"
                className="shadow-none block sm:hidden text-lg font-medium ml-auto p-3 z-40"
                onClick={() => {
                  setTitlebarOpen((prev) => !prev);
                }}
              >
                <HamburgerIcon
                  strokeColor={appColors.fgColor}
                  size="30"
                ></HamburgerIcon>
              </button>

              <div
                className={`absolute bottom-0 right-48 h-1 transition-all duration-300 ${localStorage.getItem("selectedLink") == "titlebar-logo" ? "animate-scaleDown" : "animate-slide"} pointer-events-none`}
                // bg-amber-500
                style={{
                  width: "80px",
                  "--tw-translate-start":
                    localStorage.getItem("ulPositionPrev"),
                  "--tw-translate-end": localStorage.getItem("ulPosition"),
                }}
              >
                <div className="relative bottom-14 h-14 border-2 border-sky-400 border-opacity-25 shadow-even-md rounded-lg transition-all ease-in-out"></div>
              </div>
            </>
          )}
          {loggedIn && userType == "user" && (
            <>
              <Link
                to="/user/wishlist"
                id="titlebar-wishlist"
                className="hidden sm:block text-lg font-medium ml-auto p-3"
                onClick={underlineSelected}
              >
                <WishlistIcon
                  size={40}
                  color={appColors.fgColor}
                  stroke={4}
                ></WishlistIcon>
              </Link>

              <Link
                to="/user/cart"
                className="hidden sm:block text-lg font-medium p-3"
                id="titlebar-cart"
                onClick={underlineSelected}
              >
                <CartIcon
                  size={37}
                  color={appColors.fgColor}
                  stroke={0.2}
                ></CartIcon>
              </Link>

              <Link
                to="/user"
                id="titlebar-user"
                className="hidden sm:block text-lg font-medium p-3"
                onClick={underlineSelected}
              >
                <UserIcon
                  size={35}
                  color={appColors.fgColor}
                  stroke={0.3}
                ></UserIcon>
              </Link>

              <button
                id="titlebar_loggedin-hamburger-menu"
                className="shadow-none block sm:hidden text-lg font-medium ml-auto p-3 z-40"
                onClick={() => {
                  setTitlebarOpen((prev) => !prev);
                }}
              >
                <HamburgerIcon
                  strokeColor={appColors.fgColor}
                  size="30"
                ></HamburgerIcon>
              </button>

              <div
                className={`absolute bottom-0 right-48 h-1 rounded-lg transition-all duration-300 pointer-events-none ${localStorage.getItem("selectedLink") == "titlebar-logo" ? "animate-scaleDown" : "animate-slide"}`}
                // className="bg-amber-500"
                style={{
                  width: "60px",
                  "--tw-translate-start":
                    localStorage.getItem("ulPositionPrev"),
                  "--tw-translate-end": localStorage.getItem("ulPosition"),
                }}
              >
                <div className="relative bottom-14 h-14 border-2 border-sky-400 border-opacity-25 shadow-even-md rounded-lg"></div>
              </div>
            </>
          )}
          <button onClick={changeAppTheme} className="shadow-none rounded-lg">
            <img
              src={modeIcon}
              alt="Change Mode"
              className="p-3"
              width="50px"
            />
          </button>
        </div>
      </div>
      {titlebarOpen &&
        (loggedIn ? (
          <>
            <div
              id="titlebar-menu-loggedin"
              className={`flex flex-col gap-5 sm:hidden p-6 pt-10 fixed top-5 mt-3 shadow-md w-full px-5 backdrop-filter rounded-b-2xl ${appColors.titlebarColor} text-${appColors.fgColor} -mb-2 z-30 animate-slideDownExpand`}
            >
              <Link
                to="/user/wishlist"
                id="titlebar-wishlist"
                className="text-lg font-medium"
                onClick={underlineSelected}
              >
                <div className="flex justify-between items-center border border-gray-400 p-2 rounded-xl">
                  <WishlistIcon
                    size={40}
                    color={appColors.fgColor}
                    stroke={4}
                    className="pointer-events-none"
                  ></WishlistIcon>
                  <p>Wishlist</p>
                </div>
              </Link>

              <Link
                to="/user/cart"
                className="text-lg font-medium"
                id="titlebar-cart"
                onClick={underlineSelected}
              >
                <div className="flex justify-between items-center border border-gray-400 p-2 rounded-xl">
                  <CartIcon
                    size={37}
                    color={appColors.fgColor}
                    stroke={0.2}
                  ></CartIcon>
                  <p>Cart</p>
                </div>
              </Link>

              <Link
                to="/user"
                id="titlebar-user"
                className="text-lg font-medium"
                onClick={underlineSelected}
              >
                <div className="flex justify-between items-center border border-gray-400 p-2 rounded-xl">
                  <UserIcon
                    size={35}
                    color={appColors.fgColor}
                    stroke={0.3}
                  ></UserIcon>
                  <p>User</p>
                </div>
              </Link>
            </div>
            <div
              className={`titlebar_height-adjustable-background ${appColors.bgColor} sm:hidden`}
            ></div>
          </>
        ) : (
          <>
            <div
              id="titlebar-menu-loggedout"
              className={`flex flex-col gap-5 sm:hidden p-6 pt-10 fixed top-5 mt-3 shadow-md w-full px-5 backdrop-filter rounded-b-2xl ${appColors.titlebarColor} text-${appColors.fgColor} -mb-2 z-30 animate-slideDownExpand`}
            >
              <Link
                id="titlebar-login"
                to="/login"
                className={`text-lg font-medium sm:ml-auto p-3 border border-gray-400 rounded-xl`}
                onClick={underlineSelected}
              >
                Login
              </Link>

              <Link
                id="titlebar-signup"
                to="/signup"
                className={`text-lg font-medium p-3 decoration-4 underline-offset-8 border border-gray-400 rounded-xl`}
                onClick={underlineSelected}
              >
                Sign Up
              </Link>
            </div>
            <div
              className={`titlebar_height-adjustable-background ${appColors.bgColor} sm:hidden`}
            ></div>
          </>
        ))}
    </>
  );
};

export default TitleBar;
