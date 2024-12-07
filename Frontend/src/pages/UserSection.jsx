import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import ProductsCard from "../components/ProductsCard";
import { colorContext, urlContext } from "../../context/context";
import axios from "axios";
import LoginDetailsSection from "./LoginDetailsSection";
import PersonalDetailsSection from "./PersonalDetailsSection";
import AddressDetailSection from "./AddressDetailSection";
import ProductsCardCart from "../components/CartProductsCard";
import WishListPage from "../WishListPage";
import WishList from "../components/WishList";

const UserSection = (props) => {
  const [activeSection, setActiveSection] = useState(null);
  const [formData, setFormData] = useState({});
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState({});

  const baseUrl = useContext(urlContext);

  const sections = [
    { key: "loginDetails", label: "Login Details" },
    { key: "personalDetails", label: "Personal Details" },
    { key: "addressDetails", label: "Address Details" },
    { key: "userCart", label: "User Cart" },
    { key: "userFavorites", label: "User Favorites" },
    { key: "userOrders", label: "User Orders" },
  ];

  const fetchCartProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/user/product/cart`, {
        withCredentials: true,
      });
      const cartResponse = response.data.cart;
      setProducts(cartResponse);
    } catch (error) {
      console.error("error fetching user cart!", error);
    }
  };

  useEffect(() => {
    fetchCartProducts();
    setUser(props.user);
    console.log("User Details:", props.user);
  }, [props.user]);

  const TitleBox = ({ title, onEditClick, isEditing }) => {
    return (
      <div className="flex gap-8 items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {onEditClick && (
          <button
            onClick={onEditClick}
            className="text-blue-500 font-semibold pt-1 shadow-none"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        )}
      </div>
    );
  };

  const PropertyBox = (box_props) => {
    return (
      <>
        <div className="flex items-center">
          <p className="font-semibold min-w-32 text-center">
            {box_props.property} :
          </p>
          <p className="min-w-60 border border-gray-200 p-3 m-4 rounded-md shadow-md w-fit h-10">
            {box_props.value}
          </p>
        </div>
      </>
    );
  };

  const AddressCard = (props) => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="bg-gray-200 p-1 rounded-sm text-black">
            {props.type}
          </span>
          {props.isDefault && (
            <div className="bg-green-100 p-1 rounded-md text-black">
              Default
            </div>
          )}
          <div>
            <button
              className="p-3 bg-transparent shadow-none text-red-500 font-semibold"
              onClick={props.onDeleteClick}
            >
              Delete
            </button>
            <button
              className="bg-transparent shadow-none text-blue-500 font-semibold"
              onClick={props.onEditClick}
            >
              Edit
            </button>
          </div>
        </div>
        <div className="font-semibold">
          <p>{props.person}</p>
          <p>{props.phone}</p>
        </div>
        <div>
          {props.address}, {props.landmark}, {props.city}, {props.state}
        </div>
        <p>Pincode - {props.pin}</p>
      </div>
    );
  };

  const renderContent = (key) => {
    const updateUserDetails = async (updatedData) => {
      console.log("Sending to API:", updatedData);
      // Call backend API to update user details (replace with actual API call)
      alert("Details updated successfully!");
    };

    const handleInputChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    switch (key) {
      case "loginDetails":
        return (
          <LoginDetailsSection
            TitleBox={TitleBox}
            PropertyBox={PropertyBox}
            User={user}
          ></LoginDetailsSection>
        );

      case "personalDetails":
        return (
          <PersonalDetailsSection
            TitleBox={TitleBox}
            PropertyBox={PropertyBox}
            User={user}
          ></PersonalDetailsSection>
        );
      case "addressDetails":
        return (
          <AddressDetailSection
            TitleBox={TitleBox}
            PropertyBox={PropertyBox}
            AddressCard={AddressCard}
            User={user}
          ></AddressDetailSection>
        );

      case "userCart":
        return (
          <>
            <TitleBox
              title="User Cart"
              onEditClick={() => (window.location.href = "/user/cart")}
              link={"/user/cart"}
            ></TitleBox>

            <div
              id="Products Cards"
              className="flex flex-col items-start gap-8 my-8 "
            >
              {products.length != 0 ? (
                products.map((productObject, index) => {
                  return (
                    <div className="bg-slate-200 p-4 w-full">
                      <ProductsCardCart
                        key={index}
                        name={productObject.product.name}
                        price={`${productObject.product.price}$`}
                        image={productObject.product.image}
                        rating={productObject.product.rating}
                        id={productObject.product._id}
                        visible={{ rating: true, price: true }}
                      />
                    </div>
                  );
                })
              ) : (
                <>
                  <h2 className="text-xl">Your Cart is Empty!</h2>
                  <Link to="/" className="text-blue-500">
                    {"<- Go Back to shopping"}
                  </Link>
                </>
              )}
            </div>
          </>
        );

      case "userFavorites":
        return (
          <div className="overflow-scroll h-screen">
            <WishList></WishList>
          </div>
        );

      default:
        return <p>Select a section to view details.</p>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
      {/* Sidebar */}
      <div className="flex flex-col w-full md:w-1/4  border-r border-gray-200">
        <ul className="space-y-5 md:ml-auto md:pr-8 p-4 text-center">
          <li className="my-6 text-center text-lg font-semibold ">
            <h2>
              Welcome,
              <br /> {user ? user.username : "user"}
            </h2>
          </li>
          {sections.map((section) => (
            <li key={section.key}>
              <button
                className={`w-44 text-left p-2 rounded-lg hover:bg-orange-50 transition ${
                  activeSection === section.key
                    ? "bg-orange-100 text-black"
                    : "bg-white text-gray-500"
                }`}
                onClick={() =>
                  setActiveSection(
                    activeSection === section.key ? null : section.key
                  )
                }
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Area */}
      <div className="w-full md:w-3/4 p-6">
        {activeSection ? (
          <div className=" p-4 rounded-lg shadow">
            {renderContent(activeSection)}
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            <p>Select a section to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSection;
