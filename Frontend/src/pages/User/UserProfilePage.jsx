import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { colorContext, urlContext } from "../../../context/context";
import TitleBar from "../../components/TitleBar";
import Footer from "../../components/Footer";
import UserPage from "./imports/UserSection";
import WarningCard from "../../components/WarningCard";

const UserProfilePage = () => {
  const [userDetail, setUserDetail] = useState(null);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Get the user access token from session storage

  const baseUrl = useContext(urlContext);
  const appColors = useContext(colorContext);

  const getUserDetail = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/user/`,
        {
          withCredentials: true,
        } // Include cookies in the request
      );

      console.log("response:", response);

      if (response.status === 200) {
        setUserDetail(response.data.user);
      } else {
        setUserDetail(false); // Explicitly set to false if user data is not retrieved
      }
    } catch (error) {
      setUserDetail(false);
      if (error.response) {
        setErrorMessage(error.response.data.msg || "An error occurred");
      } else {
        setErrorMessage("Failed to connect to the server");
      }
    }
  };

  const logout = async () => {
    // localStorage.setItem("selectedLink", 'titlebar-logo');
    localStorage.setItem("ulPosition", "280px");
    try {
      // Call the backend to clear the cookie
      const response = await axios.post(
        `${baseUrl}/api/v1/user/logout`,
        {},
        { withCredentials: true }
      );

      

      // Remove any local tokens or session information
      localStorage.removeItem("tokenExpiry");

      if (response.data.msg) {
        setMessage(response.data.msg);
      }

      // Redirect the user after logout
      // Reload Window after logout
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  useEffect(() => {
    // if (userDetail === false) {
    //   console.log("No user details!");
    //   window.location.href = "/";
    // }
  }, [userDetail]);

  return (
    <>
      <TitleBar></TitleBar>
      {/* <h2 className="bg-orange-100 flex h-14 items-center pl-9 py-20 text-3xl w-screen mt-48 sm:mt-0">
        User Page
      </h2> */}

      <div className={`${appColors.bgColor} min-h-screen pt-20`}>
        <div
          className={`flex flex-col items-center mx-auto text-${appColors.fgColor}`}
        >
          {errorMessage && (
            <WarningCard
              type={"negative"}
              message={errorMessage}
              onclick={() => setErrorMessage((prev) => !prev)}
            ></WarningCard>
          )}

          <UserPage user={userDetail}></UserPage>

          <button
            onClick={logout}
            className="bg-orange-100 rounded-md w-56 p-2 my-6 mx-4 text-black"
          >
            Logout
          </button>
          {message && (
            <WarningCard
              type={"positive"}
              message={message}
              onclick={() => setMessage((prev) => !prev)}
            ></WarningCard>
          )}
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default UserProfilePage;
