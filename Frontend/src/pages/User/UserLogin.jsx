import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import TitleBar from "../../components/TitleBar";
import Footer from "../../components/Footer";
import { colorContext, urlContext } from "../../../context/context";
import { Link } from "react-router-dom";
import WarningCard from "../../components/WarningCard";

import sellerImage from "../../assets/shopOwner.png";
import loginImage from "../../assets/login/img1.jpg";

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [accessToken, setAccessToken] = useState("");

  // Import context APIs
  const baseUrl = useContext(urlContext);
  const appColors = useContext(colorContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    // localStorage.setItem("selectedLink", "titlebar-logo");
    localStorage.setItem("ulPosition", "280px");
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/user/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setMessage(response.data.msg);
        setAccessToken(response.data.accessToken);

        // Reload Window after login
        setTimeout(() => {
          window.location.href = "/";
        }, 500);

        // Store "token, token Expiry and Logged in status" in session Storage
        sessionStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("tokenExpiry", response.data.exp);
        localStorage.setItem("userType", "user");
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.msg || "An error occurred");
      } else {
        setMessage("Failed to connect to the server");
      }
    }
  };

  // For scrolling image
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      document.getElementById("scrolling-image").style.transform =
        `translateY(${scrollPosition * 0.5}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className={`${appColors.bgColor}`}>
        <TitleBar></TitleBar>
        {/* <h2 className="bg-orange-100 flex h-14 items-center pl-9 py-20 text-3xl w-screen  mt-48 sm:mt-0">
          Log In
        </h2> */}
        <div className="flex flex-col items-center w-full font-bold mb-5 text-center">
          <div className="aspect-h-1 aspect-w-3 sm:aspect-w-6 rounded-b-2xl sm:rounded-b-3xl w-full bg-none overflow-hidden  shadow-xl z-10">
            <img
              id="scrolling-image"
              src={loginImage}
              alt="Login Image"
              className="w-full h-full object-cover object-center rounded-b-2xl sm:rounded-b-3xl z-10"
              // style={{ objectPosition: "0px -350px" }}
            />
          </div>

          {message && (
            <WarningCard
              message={message}
              type={"positive"}
              onclick={() => setMessage((prev) => !prev)}
            ></WarningCard>
          )}
        </div>
        {/* <img src={loginImage} alt="" className="absolute" /> */}
        <login
          className={`flex flex-col items-center md:items-stretch md:flex-row rounded-2xl md:justify-center my-14 text-${appColors.fgColor}`}
        >
          <div
            id="Login Form"
            className="bg-sky-50 p-6 rounded-t-2xl md:rounded-none md:rounded-l-2xl backdrop-filter backdrop-blur-md bg-opacity-40 shadow-xl"
          >
            <h2 className="text-xl p-5 text-center ">
              Enter Your User Credentials
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
                className={`bg-blue-400 bg-opacity-10 rounded-md w-56 p-2 my-4 mx-4 text-${appColors.fgColor}`}
              >
                Login
              </button>
            </form>

            <div className="text-amber-400 mb-5 text-center">
              <Link to="/signup"> New to Store? Sign up</Link>
            </div>
          </div>
          <div
            id="Seller Login Section"
            onClick={() => {}}
            className="flex flex-col items-center bg-white p-8 rounded-b-2xl md:rounded-none md:rounded-r-2xl backdrop-filter backdrop-blur-md bg-opacity-60 shadow-md"
          >
            <div>
              <img
                src={sellerImage}
                alt="Seller Image"
                width="300"
                className="rounded-lg"
              />
            </div>
            <button
              className="bg-blue-500 text-white rounded-md w-56 p-2 my-4 mx-4 shadow-md active:shadow-inner active:scale-95 transition-all ease-in-out"
              onClick={() => {
                window.location.href = "/login/seller";
              }}
            >
              Login as Seller
            </button>
          </div>
        </login>

        <Footer></Footer>
      </div>
    </>
  );
};

export default UserLogin;
