import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import SellerTitlebar from "../../components/SellerTitlebar";
import Footer from "../../components/Footer";
import { colorContext, urlContext } from "../../../context/context";
import { Link } from "react-router-dom";

function SellerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [accessToken, setAccessToken] = useState("");

  // Import context APIs
  const baseUrl = useContext(urlContext);
  const appColors = useContext(colorContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/seller/login`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMessage(response.data.msg);
        setAccessToken(response.data.accessToken);

        // Reload Window after login
        setTimeout(() => {
          // location.reload();
          window.location.href = "/seller";
        }, 500);

        // Store "token, token Expiry and Logged in status" in session Storage
        sessionStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("tokenExpiry", response.data.exp);
        localStorage.setItem("userType", "seller");
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.msg || "An error occurred");
      } else {
        setMessage("Failed to connect to the server");
      }
    }
  };

  return (
    <div className={appColors.bgColor}>
      <SellerTitlebar></SellerTitlebar>
      <h2 className="bg-orange-100 flex h-14 items-center pl-9 py-20 text-3xl w-screen  mt-48 sm:mt-0">
        Seller Log In
      </h2>
      <main
        className={`flex flex-col items-center mt-14 text-${appColors.fgColor}`}
      >
        <h2 className="text-xl p-5 text-center">
          Enter Your Seller Credentials
        </h2>

        <form
          id="loginForm"
          className="flex flex-col gap-5 p-8 text-black w-30 sm:w-80"
          onSubmit={handleLogin}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            id="userlogin_username"
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            id="userlogin_password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-orange-100 rounded-md w-56 p-2 my-4 mx-4 text-black"
          >
            Login
          </button>
        </form>

        <div className="text-red-500 font-bold mb-5 text-center">
          {message && <p>{message}</p>}
        </div>

        {/* {accessToken && (
          <div className="text-green-500 font-bold">
            <p>Access Token: {accessToken}</p>
          </div>
        )} */}

        <div className="text-orange-300 font-bold mb-5 text-center">
          <Link to="/login"> User Login Here</Link>
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
}

export default SellerLogin;
