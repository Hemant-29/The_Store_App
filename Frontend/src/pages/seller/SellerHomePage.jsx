import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import SellerTitlebar from "../../components/SellerTitlebar";
import { colorContext, urlContext } from "../../../context/context";
import Footer from "../../components/Footer";
import ProductsCard from "../../components/ProductsCard";
import WarningCard from "../../components/WarningCard";

const SellerHomePage = () => {
  const [products, setProducts] = useState([]);
  const [detailedProducts, setDetailedProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const baseUrl = useContext(urlContext);
  const appColors = useContext(colorContext);

  // Fetch Functions
  const fetchSellerProducts = async () => {
    try {
      // const token = sessionStorage.getItem("accessToken"); // Retrieve the token each time
      const response = await axios.get(`${baseUrl}/api/v1/seller/products`, {
        withCredentials: true,
      });

      if (response.data.products) {
        setProducts(response.data.products);
        console.log("Backend API response:", response.data.products);
        setMessage(response.data.msg);
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load products");
      console.log("error fetching:", err);
      setErrorMessage(
        err.response?.data?.msg || "Error occurred while fetching products"
      );
      setLoading(false);
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const token = sessionStorage.getItem("accessToken"); // Retrieve the token each time

      const response = await axios.get(
        `${baseUrl}/api/v1/products/single/${productId}`
      );

      if (response.data) {
        return response.data.product;
      }
    } catch (error) {
      setError(err.response?.data?.error || "Failed to load products");
      console.log("error fetching details:", err);
      setErrorMessage(
        err.response?.data?.msg ||
          "Error occurred while fetching product details"
      );
    }
  };

  // Effect hooks
  useEffect(() => {
    fetchSellerProducts();
  }, []);

  useEffect(() => {
    const fetchDetailedProducts = async () => {
      if (products && products.length) {
        try {
          const detailedProductsArr = await Promise.all(
            products.map((product) => fetchProductDetails(product))
          );
          setDetailedProducts(detailedProductsArr);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      }
    };

    fetchDetailedProducts();
  }, [products]);

  return (
    <>
      <SellerTitlebar></SellerTitlebar>
      <div className={`${appColors.bgColor} text-${appColors.fgColor} p-8`}>
        {loading && <p className="text-4xl text-center">Loading...</p>}
        {!loading && (
          <div className={`flex flex-col gap-4 `}>
            <h1 className="my-5 text-3xl">Your Products</h1>
            {/* {message && (
              <WarningCard
                type="positive"
                message={message}
                onclick={() => setMessage((prev) => !prev)}
              ></WarningCard>
            )} */}
            {errorMessage && (
              <WarningCard
                type="negative"
                message={errorMessage}
                onclick={() => setErrorMessage((prev) => !prev)}
              ></WarningCard>
            )}
            <div
              id="seller-home-products_list"
              className="flex gap-8 flex-col sm:flex-row items-center"
            >
              {detailedProducts.map((product, index) => (
                <div className="product-card">
                  <ProductsCard
                    key={index}
                    id={product._id}
                    image={product.image}
                    name={product.name}
                    price={`${product.price}$`}
                    rating={product.rating}
                    visible={{ rating: true, price: true }}
                  ></ProductsCard>
                </div>
              ))}
            </div>
            <h1 className="my-5 text-3xl">Your Sales</h1>
            <h1 className="my-5 text-3xl">Your Profit</h1>
          </div>
        )}
      </div>
      <Footer></Footer>
    </>
  );
};

export default SellerHomePage;
