import { useContext, useEffect, useState } from "react";
import { colorContext } from "../../context/context";
import darkModeIcon from "../assets/darkMode(old).png";
import lightModeIcon from "../assets/lightMode.png";
import { Link } from "react-router-dom";

const TitleBar = () => {
  const [modeIcon, setModeIcon] = useState(lightModeIcon);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userType, setUserType] = useState(false);
  const { appTheme, setAppTheme } = useContext(colorContext);

  const changeAppTheme = () => {
    appTheme == "dark" ? setAppTheme("light") : setAppTheme("dark");
  };

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

  return (
    <div className="mb-72 sm:mb-14 whitespace-nowrap">
      <div
        id="titleBar"
        className="flex flex-col h-72 sm:h-14 sm:flex-row bg-orange-50 items-center justify-between shadow-md fixed top-0 w-full z-10 px-5 "
      >
        <Link to="/" className="text-3xl font-semibold">
          The Store App
        </Link>

        {!loggedIn && (
          <>
            <Link to="/login" className="text-lg font-medium sm:ml-auto p-3">
              Login
            </Link>

            <Link to="/signup" className="text-lg font-medium p-3">
              Sign Up
            </Link>
          </>
        )}

        {loggedIn && (
          <>
            {/* <Link to="/upload" className="text-lg font-medium sm:ml-auto p-3">
              Add Product
            </Link>

            <Link to="/delete" className="text-lg font-medium p-3">
              Delete Product
            </Link> */}

            <Link
              to="/user/wishlist"
              className="text-lg font-medium sm:ml-auto p-3"
            >
              WishList
            </Link>

            <Link to="/user/cart" className="text-lg font-medium p-3">
              Cart
            </Link>

            {userType == "user" && (
              <Link to="/user" className="text-lg font-medium p-3">
                User
              </Link>
            )}
            {userType == "seller" && (
              <Link to="/seller" className="text-lg font-medium p-3">
                Seller
              </Link>
            )}
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
