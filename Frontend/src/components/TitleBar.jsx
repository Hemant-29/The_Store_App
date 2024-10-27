import { useContext, useEffect, useState } from "react";
import { colorContext } from "../../context/context";
import darkModeIcon from "../assets/darkMode(old).png";
import lightModeIcon from "../assets/lightMode.png";
import { Link } from "react-router-dom";

const TitleBar = () => {
  const [modeIcon, setModeIcon] = useState(lightModeIcon);
  const { appTheme, setAppTheme } = useContext(colorContext);

  const changeAppTheme = () => {
    appTheme == "dark" ? setAppTheme("light") : setAppTheme("dark");
  };

  useEffect(() => {
    if (appTheme == "light") setModeIcon(lightModeIcon);
    else setModeIcon(darkModeIcon);
    localStorage.setItem("appTheme", appTheme);
  }, [appTheme]);

  return (
    <div className="mb-14">
      <div id="titleBar" className="flex flex-col h-48 sm:h-14 sm:flex-row bg-orange-50 items-center justify-between shadow-md fixed top-0 w-full z-10 px-5 ">
        <Link to="/" className="text-3xl font-semibold">
          The Store App
        </Link>

        <Link to="/upload" className="text-lg font-medium sm:ml-auto p-3">
          Add Product
        </Link>

        <Link to="/delete" className="text-lg font-medium p-3">
          Delete Product
        </Link>

        <button onClick={changeAppTheme}>
          <img src={modeIcon} alt="Change Mode" className="p-3" width="50px" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
