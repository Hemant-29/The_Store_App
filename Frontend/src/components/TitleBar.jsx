import { useContext, useEffect, useState } from "react";
import { colorContext } from "../../context/context";
import darkModeIcon from "../assets/darkMode(old).png";
import lightModeIcon from "../assets/lightMode.png";
import { Link } from "react-router-dom";

const TitleBar = () => {
  const [modeIcon, setModeIcon] = useState(lightModeIcon);
  const [loggedIn, setLoggedIn] = useState(false);
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
    const expiry = sessionStorage.getItem("tokenExpiry");
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

            <Link to="/Cart" className="text-lg font-medium sm:ml-auto p-3">
              Favorites
            </Link>

            <Link to="/Cart" className="text-lg font-medium p-3">
              Cart
            </Link>

            <Link to="/user" className="text-lg font-medium p-3">
              User
            </Link>
          </>
        )}

        <button onClick={changeAppTheme}>
          <img src={modeIcon} alt="Change Mode" className="p-3" width="50px" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
