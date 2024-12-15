import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { urlContext } from "../../../../context/context";

const PersonalDetailsSection = ({ TitleBox, PropertyBox, User }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formDetails, setFormDetails] = useState({});
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const baseUrl = useContext(urlContext);

  useEffect(() => {
    setFormDetails({
      name: User.name,
      email: User.email,
      phone: User.phone,
      age: User.age,
      gender: User.gender,
    });
  }, []);

  const sendApiRequest = async () => {
    console.log("sending data to the API:", formDetails);
    try {
      const response = await axios.patch(
        `${baseUrl}/api/v1/user/update/personal`,
        {
          name: formDetails.name,
          email: formDetails.email,
          phone: formDetails.phone,
          age: formDetails.age,
          gender: formDetails.gender,
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
          <PropertyBox property={"Name"} value={User.name} />
          <PropertyBox property={"E-Mail"} value={User.email} />
          <PropertyBox property={"Phone"} value={User.phone} />
          <PropertyBox property={"Age"} value={User.age} />
          <PropertyBox property={"Gender"} value={User.gender} />
        </>
      ) : (
        <>
          <form onSubmit={submitFunction} className="space-y-3 mt-2">
            {/* Name Field */}
            <div className="flex items-center">
              <p className="font-semibold min-w-32 text-center">{"Name"} :</p>
              <input
                type="text"
                value={formDetails.name || ""}
                onChange={(e) => setFormValues(e, "name")}
                className="text-black min-w-60 border border-gray-200 p-3 m-2 rounded-md shadow-md w-fit"
              />
            </div>

            {/* E-Mail Field */}
            <div className="flex items-center" key={"password"}>
              <p className="font-semibold min-w-32 text-center">{"E-Mail"} :</p>
              <input
                type="email"
                value={formDetails.email || ""}
                onChange={(e) => setFormValues(e, "email")}
                className=" text-black min-w-60 border border-gray-200 p-3 m-2 rounded-md shadow-md w-fit"
              />
            </div>

            {/* Phone Field */}
            <div className="flex items-center" key={"phone"}>
              <p className="font-semibold min-w-32 text-center">{"Phone"} :</p>
              <input
                type="number"
                value={formDetails.phone || ""}
                onChange={(e) => setFormValues(e, "phone")}
                className=" text-black min-w-60 border border-gray-200 p-3 m-2 rounded-md shadow-md w-fit"
              />
            </div>

            {/* Age Field */}
            <div className="flex items-center" key={"age"}>
              <p className="font-semibold min-w-32 text-center">{"Age"} :</p>
              <input
                type="number"
                value={formDetails.age || ""}
                onChange={(e) => setFormValues(e, "age")}
                className=" text-black min-w-60 border border-gray-200 p-3 m-2 rounded-md shadow-md w-fit"
                max={120}
                min={0}
              />
            </div>

            {/* Gender Field */}
            <div className="flex items-center" key={"gender"}>
              <p className="font-semibold min-w-32 text-center">{"Gender"} :</p>
              <select
                value={formDetails.gender || ""}
                onChange={(e) => setFormValues(e, "gender")}
                className="text-black min-w-60 border border-gray-200 p-3 m-2 rounded-md shadow-md w-fit"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Prefer not to say</option>
              </select>
            </div>

            {/* Submit Button */}
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

export default PersonalDetailsSection;
