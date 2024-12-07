import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { colorContext, urlContext } from "../context/context";
import TitleBar from "./components/TitleBar";
import Footer from "./components/Footer";
import { Link, useParams } from "react-router-dom";
import checkLogin from "./functions/checkLogin";
import WarningCard from "./components/WarningCard";

const ProductPage = (props) => {
  const baseUrl = useContext(urlContext);
  const appColors = useContext(colorContext);
  const [productData, setProductData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  // Messages
  const [cartMessage, setCartMessage] = useState("");

  const productID = useParams().id;

  useEffect(() => {
    fetchProduct();
    setLoggedIn(checkLogin().loggedIn);
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/products/single/${productID}`
      );
      setProductData(response.data.product);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };

  const addToCart = async () => {
    if (loggedIn) {
      console.log("Adding to cart");

      try {
        const url = `${baseUrl}/api/v1/user/product/addtocart/${productID}`;

        // Send PUT request with credentials
        const response = await axios.put(
          url,
          {}, // Empty body if not needed
          { withCredentials: true } // Options go here
        );

        setCartMessage(true);

        console.log("Response data:", response.data);
      } catch (error) {
        console.error("Error adding to cart:", error);

        // Handle specific error cases
        if (error.response) {
          console.error(
            `Server responded with status: ${error.response.status}`
          );
          console.error("Error message:", error.response.data);
        } else {
          console.error("Error:", error.message);
        }
      }
    } else {
      // Redirect to Login
      setTimeout(() => {
        window.location.href = "/login";
      }, 200);
    }
  };

  const buyNow = () => {
    if (loggedIn) {
      console.log("Buying Now...");
    } else {
      // Go to Login
      setTimeout(() => {
        window.location.href = "/login";
      }, 200);
    }
  };

  return (
    <>
      <TitleBar></TitleBar>
      {loading ? (
        <>
          <div className="p-24">
            <p className="text-center text-black text-4xl font-semibold">
              Loading...
            </p>
          </div>
        </>
      ) : productData ? (
        <>
          {" "}
          <div
            className={`flex ${appColors.bgColor} text-${appColors.fgColor}`}
          >
            <div className="w-full">
              <img src={productData.image} alt="product image" />
            </div>
            <div className="flex flex-col gap-3 py-3 items-center w-full">
              <h2 className="text-2xl font-bold py-3"> {productData.name}</h2>
              <p>{productData.price} $</p>
              <p className="flex">
                {productData.rating}
                <svg
                  width="25px"
                  height="25px"
                  viewBox="-2.4 -2.4 28.80 28.80"
                  fill="yellow"
                  xmlns="http://www.w3.org/2000/svg"
                  transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M11.245 4.174C11.4765 3.50808 11.5922 3.17513 11.7634 3.08285C11.9115 3.00298 12.0898 3.00298 12.238 3.08285C12.4091 3.17513 12.5248 3.50808 12.7563 4.174L14.2866 8.57639C14.3525 8.76592 14.3854 8.86068 14.4448 8.93125C14.4972 8.99359 14.5641 9.04218 14.6396 9.07278C14.725 9.10743 14.8253 9.10947 15.0259 9.11356L19.6857 9.20852C20.3906 9.22288 20.743 9.23007 20.8837 9.36432C21.0054 9.48051 21.0605 9.65014 21.0303 9.81569C20.9955 10.007 20.7146 10.2199 20.1528 10.6459L16.4387 13.4616C16.2788 13.5829 16.1989 13.6435 16.1501 13.7217C16.107 13.7909 16.0815 13.8695 16.0757 13.9507C16.0692 14.0427 16.0982 14.1387 16.1563 14.3308L17.506 18.7919C17.7101 19.4667 17.8122 19.8041 17.728 19.9793C17.6551 20.131 17.5108 20.2358 17.344 20.2583C17.1513 20.2842 16.862 20.0829 16.2833 19.6802L12.4576 17.0181C12.2929 16.9035 12.2106 16.8462 12.1211 16.8239C12.042 16.8043 11.9593 16.8043 11.8803 16.8239C11.7908 16.8462 11.7084 16.9035 11.5437 17.0181L7.71805 19.6802C7.13937 20.0829 6.85003 20.2842 6.65733 20.2583C6.49056 20.2358 6.34626 20.131 6.27337 19.9793C6.18915 19.8041 6.29123 19.4667 6.49538 18.7919L7.84503 14.3308C7.90313 14.1387 7.93218 14.0427 7.92564 13.9507C7.91986 13.8695 7.89432 13.7909 7.85123 13.7217C7.80246 13.6435 7.72251 13.5829 7.56262 13.4616L3.84858 10.6459C3.28678 10.2199 3.00588 10.007 2.97101 9.81569C2.94082 9.65014 2.99594 9.48051 3.11767 9.36432C3.25831 9.23007 3.61074 9.22289 4.31559 9.20852L8.9754 9.11356C9.176 9.10947 9.27631 9.10743 9.36177 9.07278C9.43726 9.04218 9.50414 8.99359 9.55657 8.93125C9.61593 8.86068 9.64887 8.76592 9.71475 8.57639L11.245 4.174Z"
                      stroke={appColors.fgColor}
                      strokeWidth="0.528"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </p>
              <p>Company: {productData.company}</p>
              <p>Seller: {productData.seller}</p>
              <p>Added Date: {formatDate(productData.createdAt)}</p>
              <div className="flex gap-5 py-6">
                <button
                  onClick={addToCart}
                  className="bg-orange-300 p-4 rounded-lg"
                >
                  Add To Cart
                </button>
                <button
                  onClick={buyNow}
                  className="bg-amber-600 p-4 rounded-lg"
                >
                  Buy Now
                </button>
              </div>
              <div className="flex justify-center">
                {cartMessage && (
                  <WarningCard
                    type={"positive"}
                    message={"Product added to cart"}
                    onclick={() => setCartMessage((prev) => !prev)}
                  ></WarningCard>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end mr-24"></div>
        </>
      ) : (
        <>
          <div className="p-24">
            <p className="text-center text-red-600 text-4xl font-bold">
              Product Doesn't exists!
            </p>
          </div>
        </>
      )}
      <Footer></Footer>
    </>
  );
};

export default ProductPage;
