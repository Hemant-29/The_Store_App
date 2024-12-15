import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { colorContext, urlContext } from "../../../context/context";
import SellerTitleBar from "../../components/SellerTitlebar";
import Footer from "../../components/Footer";
import WarningCard from "../../components/WarningCard";

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
    // localStorage.setItem("selectedLink", 'titlebar-logo');
    localStorage.setItem("ulPosition", "280px");
    try {
      // Call the backend to clear the cookie
      const response = await axios.post(`${baseUrl}/api/v1/seller/logout`);
      console.log("seller logout server response:", response);

      // Remove any local tokens or session information
      localStorage.removeItem("tokenExpiry");

      // Remove acess token from the localstorage
      sessionStorage.removeItem("accessToken");

      if (response.data.msg) {
        setMessage(response.data.msg);
      }

      // Redirect the user after logout
      setTimeout(() => {
        window.location.href = "/seller";
      }, 500);
    } catch (error) {
      console.error("Error during logout:", error);
    }
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
      <SellerTitleBar></SellerTitleBar>
      <div className={appColors.bgColor}>
        <div
          className={`flex flex-col items-center pt-8 mx-auto text-${appColors.fgColor}`}
        >
          {message && (
            <WarningCard
              message={message}
              onclick={() => setMessage((prev) => !prev)}
            ></WarningCard>
          )}

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
