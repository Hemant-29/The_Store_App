import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { colorContext, urlContext } from "../context/context";
import TitleBar from "./components/TitleBar";
import Footer from "./components/Footer";

const SellerProfilePage = () => {
  const [userDetail, setUserDetail] = useState(null);
  const [message, setMessage] = useState(null);

  // Get the user access token from session storage

  const baseUrl = useContext(urlContext);
  const appColors = useContext(colorContext);

  const getUserDetail = async () => {
    try {
      const token = sessionStorage.getItem("accessToken"); // Retrieve the token each time
      const response = await axios.get(`${baseUrl}/api/v1/seller/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUserDetail(response.data.seller);
      } else {
        setUserDetail(false); // Explicitly set to false if user data is not retrieved
      }
    } catch (error) {
      setUserDetail(false);
      if (error.response) {
        setMessage(error.response.data.msg || "An error occurred");
      } else {
        setMessage("Failed to connect to the server");
      }
    }
  };

  const logout = async () => {
    const currentTime = Date.now() / 1000;
    localStorage.setItem("tokenExpiry", currentTime);

    // Reload Window after logout
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  useEffect(() => {
    if (userDetail === false) {
      console.log("No user details!");
      window.location.href = "/";
    }
  }, [userDetail]);

  return (
    <>
      <TitleBar></TitleBar>
      <div className={appColors.bgColor}>
        <div
          className={`flex flex-col items-center mx-auto text-${appColors.fgColor}`}
        >
          <div className="text-red-500 font-bold mb-5 text-center">
            {message}
          </div>

          {userDetail && <div>Welcome, {userDetail.username}!</div>}
          <button
            onClick={logout}
            className="bg-orange-100 rounded-md w-56 p-2 my-4 mx-4 text-black"
          >
            Logout
          </button>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default SellerProfilePage;
