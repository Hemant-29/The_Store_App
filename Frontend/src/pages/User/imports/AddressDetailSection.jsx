import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { urlContext } from "../../../../context/context";

const AddressDetailSection = ({ TitleBox, PropertyBox, AddressCard, User }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formDetails, setFormDetails] = useState({});
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [addressArray, setAddressArray] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(false);
  const [newAddressEditing, setNewAddressEditing] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const baseUrl = useContext(urlContext);

  const getAddresses = async () => {
    const response = await axios.get(`${baseUrl}/api/v1/user/address`, {
      withCredentials: true,
    });
    console.log("fetching data from api:", response.data);

    setAddressArray(response.data.address);
  };

  useEffect(() => {
    getAddresses();
  }, []);

  const updateAddress = async () => {
    console.log("sending data to the API:", formDetails);
    try {
      // Update form Details
      const response = await axios.patch(
        `${baseUrl}/api/v1/user/update/address/${formDetails._id}`,
        {
          person: formDetails.person,
          phone: formDetails.phone,
          address: formDetails.address,
          landmark: formDetails.landmark,
          city: formDetails.city,
          state: formDetails.state,
          pin: formDetails.pin,
          type: formDetails.type,
          isDefault: formDetails.isDefault,
        },
        {
          withCredentials: true,
        }
      );
      if (response) {
        setMessage(response.data.msg);
        console.log("Response:", response.data.msg);
      }

      // Make the default address default
      if (defaultAddress) {
        makeAddressDefault();
      }

      // Fetch the Adresses again
      getAddresses();
    } catch (error) {
      console.log("Error Response:", error.response.data.msg);
      setErrorMessage(error.response.data.msg);
      console.error(
        "Error updating login info:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const addNewAddress = async () => {
    console.log("sending data to the API:", formDetails);
    try {
      // Update form Details
      const response = await axios.post(
        `${baseUrl}/api/v1/user/update/address/new`,
        {
          person: formDetails.person,
          phone: formDetails.phone,
          address: formDetails.address,
          landmark: formDetails.landmark,
          city: formDetails.city,
          state: formDetails.state,
          pin: formDetails.pin,
          type: formDetails.type,
          isDefault: formDetails.isDefault,
        },
        {
          withCredentials: true,
        }
      );
      if (response) {
        setMessage(response.data.msg);
        console.log("Response:", response.data.msg);
      }

      // Make the default address default
      if (defaultAddress) {
        makeAddressDefault();
      }

      // Fetch the Adresses again
      getAddresses();
    } catch (error) {
      console.log("Error Response:", error.response.data.msg);
      setErrorMessage(error.response.data.msg);
      console.error(
        "Error updating login info:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const deleteAddress = async (addressID) => {
    console.log("sending data to the API:", formDetails);
    try {
      // Update form Details
      const response = await axios.delete(
        `${baseUrl}/api/v1/user/update/address/${addressID}`,
        {
          withCredentials: true,
        }
      );
      if (response) {
        setMessage(response.data.msg);
        console.log("Delete Response:", response.data.msg);
      }

      // Fetch the Adresses again
      getAddresses();
    } catch (error) {
      console.log("Delete Error Response:", error.response.data.msg);
      setErrorMessage(error.response.data.msg);
      console.error(
        "Error Deleting address:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const makeAddressDefault = async () => {
    try {
      if (!defaultAddress) {
        return;
      }
      const response = await axios.post(
        `${baseUrl}/api/v1/user/update/address/default/${defaultAddress}`,
        {},
        { withCredentials: true }
      );

      // Fetch the Adresses again
      getAddresses();
    } catch (error) {
      console.log("Error Response:", error.response.data.msg);
    }
  };

  const submitNewAddress = (e) => {
    e.preventDefault();
    console.log("new address");
    console.log("form Details:", formDetails);
    setNewAddressEditing(false);
    addNewAddress();
  };

  const submitAddressUpdate = (e) => {
    e.preventDefault();
    updateAddress();
    setIsEditing(false);
  };

  // const addressDeletePopup = ({ addressID }) => {};

  const setFormValues = (event, key) => {
    setFormDetails((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const cancelFunction = () => {
    setIsEditing((prev) => !prev);
  };

  const toggleEditAddress = (index) => {
    setIsEditing((prev) => ({
      [index]: !prev[index],
    }));
  };

  return (
    <div>
      <TitleBox
        title="Address Details"
        onEditClick={false}
        isEditing={isEditing}
      />

      {/* Delete PopUp */}
      {deletePopup && (
        <div className="fixed top-1/3 text-white bg-slate-400 p-32 bg-opacity-70 backdrop-filter backdrop-blur-md rounded-2xl">
          <p>Are you sure you want to delete this address?</p>
          <div className="flex gap-10 justify-center m-5">
            <button
              onClick={() => {
                deleteAddress(deletePopup);
                setDeletePopup(false);
              }}
              className="px-6 py-3 bg-blue-500 rounded-lg"
            >
              Yes
            </button>
            <button
              onClick={() => setDeletePopup(false)}
              className="px-6 py-3 bg-gray-200 text-black rounded-lg"
            >
              No
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap">
        {addressArray.map((address, index) => (
          <div key={index} className="w-96 border p-4 rounded-md shadow-md m-4">
            {!isEditing[index] ? (
              <AddressCard
                {...address}
                onDeleteClick={() => {
                  setDeletePopup(address._id);
                }}
                onEditClick={() => {
                  setNewAddressEditing(false);
                  setMessage("");
                  setErrorMessage("");
                  toggleEditAddress(index);
                  setFormDetails((prev) => {
                    return { ...prev, ...address };
                  });
                }}
              />
            ) : (
              // Form to edit an Address
              <>
                <form
                  onChange={(e) =>
                    setFormDetails((prev) => ({
                      ...prev,
                      _id: address._id,
                    }))
                  }
                  onSubmit={submitAddressUpdate}
                  className="space-y-4"
                >
                  <div className="flex items-center">
                    <label
                      htmlFor="addressType"
                      className="font-semibold min-w-32 text-right pr-4"
                    >
                      Address Type:
                    </label>
                    <select
                      onChange={(e) => setFormValues(e, "type")}
                      name="type"
                      id="addressType"
                      className="text-black text-center p-2 rounded-md"
                      value={formDetails.type || ""}
                    >
                      <option value="" default disabled>
                        Select Below
                      </option>
                      <option value="home">Home</option>
                      <option value="office">Office</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label
                      htmlFor="person"
                      className="font-semibold min-w-32 text-right pr-4"
                    >
                      Name:
                    </label>
                    <input
                      type="text"
                      id="person"
                      name="person"
                      value={formDetails.person}
                      onChange={(e) => setFormValues(e, "person")}
                      className="text-black border border-gray-200 p-2 rounded-md w-full"
                    />
                  </div>

                  <div className="flex items-center">
                    <label
                      htmlFor="phone"
                      className="font-semibold min-w-32 text-right pr-4"
                    >
                      Phone:
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formDetails.phone}
                      onChange={(e) => setFormValues(e, "phone")}
                      className="text-black border border-gray-200 p-2 rounded-md w-full"
                    />
                  </div>

                  <div className="flex items-center">
                    <label
                      htmlFor="address"
                      className="font-semibold min-w-32 text-right pr-4"
                    >
                      Address:
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formDetails.address}
                      onChange={(e) => setFormValues(e, "address")}
                      className="text-black border border-gray-200 p-2 rounded-md w-full"
                    />
                  </div>

                  <div className="flex items-center">
                    <label
                      htmlFor="landmark"
                      className="font-semibold min-w-32 text-right pr-4"
                    >
                      Landmark:
                    </label>
                    <input
                      type="text"
                      id="landmark"
                      name="landmark"
                      value={formDetails.landmark}
                      onChange={(e) => setFormValues(e, "landmark")}
                      className="text-black border border-gray-200 p-2 rounded-md w-full"
                    />
                  </div>

                  <div className="flex items-center">
                    <label
                      htmlFor="city"
                      className="font-semibold min-w-32 text-right pr-4"
                    >
                      City:
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formDetails.city}
                      onChange={(e) => setFormValues(e, "city")}
                      className="text-black border border-gray-200 p-2 rounded-md w-full"
                    />
                  </div>

                  <div className="flex items-center">
                    <label
                      htmlFor="state"
                      className="font-semibold min-w-32 text-right pr-4"
                    >
                      State:
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formDetails.state}
                      onChange={(e) => setFormValues(e, "state")}
                      className="text-black border border-gray-200 p-2 rounded-md w-full"
                    />
                  </div>

                  <div className="flex items-center">
                    <label
                      htmlFor="pin"
                      className="font-semibold min-w-32 text-right pr-4"
                    >
                      Pincode:
                    </label>
                    <input
                      type="text"
                      id="pin"
                      name="pin"
                      value={formDetails.pin}
                      onChange={(e) => setFormValues(e, "pin")}
                      className="text-black border border-gray-200 p-2 rounded-md w-full"
                    />
                  </div>

                  <div className="flex items-center justify-center text-black">
                    <button
                      type="button"
                      id="set-address-as-default-button"
                      className="p-3 bg-gray-100"
                      onClick={() => {
                        setDefaultAddress(address._id);
                        const element = document.getElementById(
                          "set-address-as-default-button"
                        );
                        element.style.backgroundColor = "#a3cbff";
                      }}
                    >
                      Set this Address as Default
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Submit
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
          </div>
        ))}
      </div>

      {/* Add new Address */}
      <div id="newAddress" className="flex items-center">
        <p>Add an Address : </p>
        <button
          onClick={() => {
            setFormDetails({});
            setIsEditing(false);
            setMessage("");
            setErrorMessage("");
            setNewAddressEditing((prev) => !prev);
          }}
          className="text-6xl text-white rounded-full shadow-none ml-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="50"
            height="50"
            viewBox="0 0 255.99098 255.99098"
          >
            <g
              fill="#0033ff"
              fillRule="nonzero"
              stroke="none"
              strokeWidth="1"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              strokeMiterlimit="10"
              strokeDasharray=""
              strokeDashoffset="0"
              fontFamily="none"
              fontWeight="none"
              fontSize="none"
              textAnchor="none"
              style={{ mixBlendMode: "normal" }}
            >
              <g transform="scale(5.12,5.12)">
                <path d="M25,2c-12.683,0 -23,10.317 -23,23c0,12.683 10.317,23 23,23c12.683,0 23,-10.317 23,-23c0,-12.683 -10.317,-23 -23,-23zM37,26h-11v11h-2v-11h-11v-2h11v-11h2v11h11z"></path>
              </g>
            </g>
          </svg>
        </button>
      </div>

      {/* New Address form */}
      <div>
        {newAddressEditing ? (
          <div>
            Adding a new Address
            <form onSubmit={submitNewAddress} className="space-y-4">
              <div className="flex items-center">
                <label
                  htmlFor="addressType"
                  className="font-semibold min-w-32 text-right pr-4"
                >
                  Address Type:
                </label>
                <select
                  onChange={(e) => setFormValues(e, "type")}
                  name="type"
                  id="addressType"
                  className="text-black text-center p-2 rounded-md"
                  value={formDetails.type || ""}
                >
                  <option value="" default disabled>
                    Select Below
                  </option>
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                </select>
              </div>

              <div className="flex items-center">
                <label
                  htmlFor="person"
                  className="font-semibold min-w-32 text-right pr-4"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="person"
                  name="person"
                  value={formDetails.person}
                  onChange={(e) => setFormValues(e, "person")}
                  className="text-black border border-gray-200 p-2 rounded-md w-full"
                />
              </div>

              <div className="flex items-center">
                <label
                  htmlFor="phone"
                  className="font-semibold min-w-32 text-right pr-4"
                >
                  Phone:
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formDetails.phone}
                  onChange={(e) => setFormValues(e, "phone")}
                  className="text-black border border-gray-200 p-2 rounded-md w-full"
                />
              </div>

              <div className="flex items-center">
                <label
                  htmlFor="address"
                  className="font-semibold min-w-32 text-right pr-4"
                >
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formDetails.address}
                  onChange={(e) => setFormValues(e, "address")}
                  className="text-black border border-gray-200 p-2 rounded-md w-full"
                />
              </div>

              <div className="flex items-center">
                <label
                  htmlFor="landmark"
                  className="font-semibold min-w-32 text-right pr-4"
                >
                  Landmark:
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={formDetails.landmark}
                  onChange={(e) => setFormValues(e, "landmark")}
                  className="text-black border border-gray-200 p-2 rounded-md w-full"
                />
              </div>

              <div className="flex items-center">
                <label
                  htmlFor="city"
                  className="font-semibold min-w-32 text-right pr-4"
                >
                  City:
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formDetails.city}
                  onChange={(e) => setFormValues(e, "city")}
                  className="text-black border border-gray-200 p-2 rounded-md w-full"
                />
              </div>

              <div className="flex items-center">
                <label
                  htmlFor="state"
                  className="font-semibold min-w-32 text-right pr-4"
                >
                  State:
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formDetails.state}
                  onChange={(e) => setFormValues(e, "state")}
                  className="text-black border border-gray-200 p-2 rounded-md w-full"
                />
              </div>

              <div className="flex items-center">
                <label
                  htmlFor="pin"
                  className="font-semibold min-w-32 text-right pr-4"
                >
                  Pincode:
                </label>
                <input
                  type="text"
                  id="pin"
                  name="pin"
                  value={formDetails.pin}
                  onChange={(e) => setFormValues(e, "pin")}
                  className="text-black border border-gray-200 p-2 rounded-md w-full"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Submit
                </button>
                {cancelFunction && (
                  <button
                    type="button"
                    onClick={() => setNewAddressEditing((prev) => !prev)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* Messages DIV */}
      {message && (
        <div
          onClick={() => setMessage("")}
          className="text-green-700 text-lg p-6 m-6 bg-gray-200 w-fit rounded-md"
        >
          {<p>{message}</p>}
        </div>
      )}
      {errorMessage && (
        <div
          onClick={() => setErrorMessage("")}
          className="text-red-700 text-lg p-6 m-6 bg-gray-200 w-fit rounded-md"
        >
          {<p>{errorMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default AddressDetailSection;
