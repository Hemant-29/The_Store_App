import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { urlContext } from "../../../../context/context";

const LoginDetailsSection = ({ TitleBox, PropertyBox, User }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formDetails, setFormDetails] = useState({});
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const baseUrl = useContext(urlContext);

  const sendApiRequest = async () => {
    console.log("sending data to the API:", formDetails);

    try {
      const response = await axios.patch(
        `${baseUrl}/api/v1/user/update/login`,
        {
          username: formDetails.username,
          password: formDetails.password,
        },
        {
          withCredentials: true,
        }
      );
      if (response) {
        setMessage(response.data.msg);
        console.log("Response:", response.data.msg);
      }
    } catch (error) {
      console.log("Error Response:", error.response.data.msg);
      setErrorMessage(error.response.data.msg);
      console.error(
        "Error updating login info:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const submitFunction = (e) => {
    e.preventDefault();
    sendApiRequest();
    setIsEditing(false);
  };

  const setFormValues = (event, key) => {
    setFormDetails((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const onEditFunction = () => {
    setMessage("");
    setErrorMessage("");
    setIsEditing(!isEditing);
  };

  const cancelFunction = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div>
      <TitleBox
        title="Account Details"
        onEditClick={onEditFunction}
        isEditing={isEditing}
      />
      {!isEditing ? (
        <>
          <PropertyBox property={"Username"} value={User.username} />
          <PropertyBox property={"Password"} value={"********"} />
        </>
      ) : (
        <>
          <form onSubmit={submitFunction} className="space-y-3 mt-2">
            {/* Username Field */}
            <div className="flex items-center">
              <p className="font-semibold min-w-32 text-center">
                {"Username"} :
              </p>
              <input
                type="text"
                value={formDetails.username || ""}
                onChange={(e) => setFormValues(e, "username")}
                className="text-black min-w-60 border border-gray-200 p-3 m-2 rounded-md shadow-md w-fit"
              />
            </div>

            {/* Password Field */}
            <div className="flex items-center" key={"password"}>
              <p className="font-semibold min-w-32 text-center">
                {"Password"} :
              </p>
              <input
                type="password"
                value={formDetails.password || ""}
                onChange={(e) =>
                  setFormDetails((prev) => {
                    return { ...prev, password: e.target.value };
                  })
                }
                className=" text-black min-w-60 border border-gray-200 p-3 m-2 rounded-md shadow-md w-fit"
              />
            </div>

            {/* <div>{message ? <p>message</p> : <></>}</div> */}

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>

              {cancelFunction && (
                <button
                  type="button"
                  onClick={cancelFunction}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </>
      )}

      {/* Messages DIV */}
      {message && (
        <div className="text-green-700 text-lg p-6 m-6 bg-gray-200 w-fit rounded-md">
          {<p>{message}</p>}
        </div>
      )}
      {errorMessage && (
        <div className="text-red-700 text-lg p-6 m-6 bg-gray-200 w-fit rounded-md">
          {<p>{errorMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default LoginDetailsSection;
