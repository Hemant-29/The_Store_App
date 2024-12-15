import { useContext, useEffect, useState } from "react";
import { colorContext } from "../../context/context";
import darkModeIcon from "../assets/darkMode(old).png";
import lightModeIcon from "../assets/lightMode.png";
import { Link } from "react-router-dom";
import CartIcon from "../icons/cartIcon";
import UserIcon from "../icons/userIcon";
import WishlistIcon from "../icons/WishlistIcon";

const TitleBar = () => {
  const [modeIcon, setModeIcon] = useState(lightModeIcon);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userType, setUserType] = useState(false);
  const { appTheme, setAppTheme } = useContext(colorContext);

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
      localStorage.setItem("ulPosition", "-8px");
    } else if (linkId === "titlebar-cart") {
      localStorage.setItem("ulPosition", "59px");
    } else if (linkId === "titlebar-user") {
      localStorage.setItem("ulPosition", "119px");
    } else if (linkId === "titlebar-seller") {
      localStorage.setItem("ulPosition", "119px");
    }
  };

  return (
    <div
      className={`h-72 sm:h-11 whitespace-nowrap ${appColors.bgColor} text-${appColors.fgColor} z-50`}
    >
      <div
        id="titleBar"
        className={`flex flex-col h-72 sm:h-14 sm:flex-row  items-center justify-between shadow-md fixed top-0 w-full z-10 px-5 backdrop-filter rounded-b-2xl ${appColors.titlebarColor}`}
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
              className={`text-lg font-medium sm:ml-auto p-3 `}
              onClick={underlineSelected}
            >
              Login
            </Link>

            <Link
              id="titlebar-signup"
              to="/signup"
              className={`text-lg font-medium p-3 decoration-4 underline-offset-8`}
              onClick={underlineSelected}
            >
              Sign Up
            </Link>
            <div
              className={`absolute bottom-0 right-48 h-1 transition-all duration-300 ${localStorage.getItem("selectedLink") == "titlebar-logo" ? "animate-scaleDown" : "animate-slide"} pointer-events-none`}
              // bg-amber-500
              style={{
                width: "80px",
                "--tw-translate-start": localStorage.getItem("ulPositionPrev"),
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
              className="text-lg font-medium sm:ml-auto p-3"
              onClick={underlineSelected}
            >
              <WishlistIcon></WishlistIcon>
            </Link>

            <Link
              to="/user/cart"
              className="text-lg font-medium p-3"
              id="titlebar-cart"
              onClick={underlineSelected}
            >
              <CartIcon></CartIcon>
            </Link>

            <Link
              to="/user"
              id="titlebar-user"
              className="text-lg font-medium p-3"
              onClick={underlineSelected}
            >
              <UserIcon></UserIcon>
            </Link>

            <div
              className={`absolute bottom-0 right-48 h-1 rounded-lg transition-all duration-300 pointer-events-none ${localStorage.getItem("selectedLink") == "titlebar-logo" ? "animate-scaleDown" : "animate-slide"}`}
              // className="bg-amber-500"
              style={{
                width: "60px",
                "--tw-translate-start": localStorage.getItem("ulPositionPrev"),
                "--tw-translate-end": localStorage.getItem("ulPosition"),
              }}
            >
              <div className="relative bottom-14 h-14 border-2 border-sky-400 border-opacity-25 shadow-even-md rounded-lg"></div>
            </div>
          </>
        )}
        <button onClick={changeAppTheme} className="shadow-none rounded-lg">
          <img src={modeIcon} alt="Change Mode" className="p-3" width="50px" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
