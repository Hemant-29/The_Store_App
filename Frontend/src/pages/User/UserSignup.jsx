import React, { useState, useContext } from "react";
import axios from "axios";
import TitleBar from "../../components/TitleBar";
import Footer from "../../components/Footer";
import { colorContext, urlContext } from "../../../context/context";
import { Link } from "react-router-dom";

const UserSignup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const baseUrl = useContext(urlContext);
  const appColors = useContext(colorContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/api/v1/user/signup`, {
        username,
        password,
      });

      if (response.status === 201) {
        setMessage(response.data.msg);
      }

      // Reload Window after Signup
      setTimeout(() => {
        // location.reload();
        window.location.href = "/login";
      }, 500);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.msg || "An error occurred");
      } else {
        setMessage("Failed to connect to the server");
      }
    }
  };

  return (
    <>
      <div className={appColors.bgColor}>
        <TitleBar></TitleBar>
        <h2 className="bg-orange-100 flex h-14 items-center pl-9 py-20 text-3xl w-screen rounded-b-2xl shadow-lg mt-48 sm:mt-0">
          Sign Up
        </h2>

        <main
          className={`flex flex-col items-center text-${appColors.fgColor}`}
        >
          <div
            id="signupBox"
            className={`shadow-xl my-10 border-black border-opacity-20 rounded-2xl ${appColors.appTheme == "light" ? "" : "border"}`}
          >
            <h2 className={`text-xl p-5 text-center`}>
              Fill The Following Details
            </h2>

            <form
              id="loginForm"
              className="flex flex-col gap-5 p-8 text-black  w-30 sm:w-80"
              onSubmit={handleSignup}
            >
              <input
                type="text"
                placeholder="Username"
                value={username}
                id="userlogin_username"
                onChange={(e) => setUsername(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded-xl"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                id="userlogin_password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded-xl"
              />
              <button
                type="submit"
                className="bg-orange-100 rounded-md w-56 p-2 my-4 mx-4 text-black"
              >
                SignUp
              </button>
            </form>

            <div className="text-red-500 font-bold mb-5 text-center">
              {message && <p>{message}</p>}
            </div>

            <div className="text-blue-400 mb-5 text-center">
              <Link to="/signup/seller">Sign-Up as a Seller</Link>
            </div>
          </div>
        </main>

        <Footer></Footer>
      </div>
    </>
  );
};

export default UserSignup;
