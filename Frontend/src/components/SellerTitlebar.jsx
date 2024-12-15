import React, { useContext, useState, useEffect } from "react";
import darkModeIcon from "../assets/darkMode(old).png";
import lightModeIcon from "../assets/lightMode.png";
import { colorContext } from "../../context/context";
import { Link } from "react-router-dom";

const SellerTitlebar = () => {
  const appColors = useContext(colorContext);

  // States
  const [modeIcon, setModeIcon] = useState(lightModeIcon);
  const [loggedIn, setLoggedIn] = useState(false);
  const { appTheme, setAppTheme } = useContext(colorContext);

  // Effect Hooks
  useEffect(() => {
    const expiry = localStorage.getItem("tokenExpiry");

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
      setLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (appTheme == "light") setModeIcon(lightModeIcon);
    else setModeIcon(darkModeIcon);
    localStorage.setItem("appTheme", appTheme);
  }, [appTheme]);

  // functions
  const changeAppTheme = () => {
    appTheme == "dark" ? setAppTheme("light") : setAppTheme("dark");
  };

  return (
    <>
      <div
        className={`h-72 sm:h-11 whitespace-nowrap ${appColors.bgColor} text-${appColors.fgColor} z-50`}
      >
        <div
          id="titleBar"
          className={`flex flex-col h-72 sm:h-14 sm:flex-row  items-center justify-between shadow-md fixed top-0 w-full z-10 px-5 backdrop-filter rounded-b-2xl ${appColors.titlebarColor}`}
        >
          <Link
            to="/seller"
            id="titlebar-logo"
            className="text-3xl font-semibold"
            // onClick={underlineSelected}
          >
            The Store App
            <sub className="text-base font text-violet-900"> seller</sub>
          </Link>

          {!loggedIn && (
            <>
              <Link
                to="/login/seller"
                id="titlebar-wishlist"
                className="text-lg font-medium sm:ml-auto p-3"
                // onClick={underlineSelected}
              >
                {/* <WishlistIcon></WishlistIcon> */}
                Login
              </Link>
            </>
          )}

          {loggedIn && (
            <>
              <Link
                to="/seller/product/list"
                id="titlebar-wishlist"
                className="text-lg font-medium sm:ml-auto p-3"
                // onClick={underlineSelected}
              >
                {/* <WishlistIcon></WishlistIcon> */}
                List a Product
              </Link>

              <Link
                to="/seller/product/delete"
                id="titlebar-wishlist"
                className="text-lg font-medium p-3"
                // onClick={underlineSelected}
              >
                {/* <WishlistIcon></WishlistIcon> */}
                Delete a Product
              </Link>

              <Link
                to="/seller/profile"
                id="titlebar-seller"
                className="text-lg font-medium p-3"
                //   onClick={underlineSelected}
              >
                Seller
              </Link>
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
    </>
  );
};

export default SellerTitlebar;
