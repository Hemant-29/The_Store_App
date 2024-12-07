import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { colorContext, urlContext } from "../context/context";
import TitleBar from "./components/TitleBar";
import Footer from "./components/Footer";
import { Link, useParams } from "react-router-dom";
import checkLogin from "./functions/checkLogin";
import ProductsCardCart from "./components/CartProductsCard";

const CartPage = (props) => {
  const baseUrl = useContext(urlContext);
  const appColors = useContext(colorContext);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const fetchCartProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/user/product/cart`, {
        withCredentials: true,
      });
      const cartResponse = response.data.cart;
      setProducts(cartResponse);
      setIsLoading(false);
    } catch (error) {
      console.error("error fetching user cart!", error);
    }
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  useEffect(() => {
    let finalPrice = 0;
    products.forEach((productObject) => {
      finalPrice += productObject.product.price * productObject.amount;
    });
    setTotalPrice(finalPrice + deliveryCharge - discount);
  }, [products]);

  return (
    <>
      <TitleBar></TitleBar>

      <h2 className="bg-orange-100 flex h-14 items-center pl-9 py-20 text-3xl w-screen mt-48 sm:mt-0">
        Cart
      </h2>
      <main className={`flex ${appColors.bgColor} text-${appColors.fgColor}`}>
        {!isLoading && checkLogin().loggedIn && (
          <div
            id="Products Cards"
            className="flex flex-col gap-2 my-8 w-full items-start"
          >
            {products.length != 0 ? (
              products.map((productObject, index) => {
                return (
                  <div className="flex flex-col gap-4 items-start text-black bg-zinc-100 bg-opacity-85 p-4 ml-20 w-full shadow-lg">
                    <ProductsCardCart
                      key={index}
                      name={productObject.product.name}
                      price={`${productObject.product.price}$`}
                      image={productObject.product.image}
                      rating={productObject.product.rating}
                      id={productObject.product._id}
                      visible={{ rating: true, price: true }}
                    />
                    <div className="flex flex-col justify-end mb-5">
                      <p>Amount: {productObject.amount}</p>
                      <div className="flex items-center  gap-2">
                        <button
                          className="bg-red-500 text-white rounded-lg p-2"
                          onClick={async () => {
                            try {
                              await axios.delete(
                                `${baseUrl}/api/v1/user/product/cart/delete/${productObject.productId}`,
                                { withCredentials: true }
                              );

                              // Update state by filtering out the deleted product or reducing its amount
                              setProducts((prevProducts) =>
                                prevProducts
                                  .map((product) =>
                                    product.productId ===
                                    productObject.productId
                                      ? {
                                          ...product,
                                          amount: product.amount - 1,
                                        }
                                      : product
                                  )
                                  .filter((product) => product.amount > 0)
                              );
                            } catch (error) {
                              console.error(
                                "Error deleting product from cart:",
                                error
                              );
                            }
                          }}
                        >
                          Delete
                        </button>

                        <button
                          onClick={async () => {
                            try {
                              await axios.put(
                                `${baseUrl}/api/v1/user/product/addtocart/${productObject.productId}`,
                                {},
                                { withCredentials: true }
                              );

                              // Update state by incrementing the amount of the added product
                              setProducts((prevProducts) =>
                                prevProducts.map((product) =>
                                  product.productId === productObject.productId
                                    ? { ...product, amount: product.amount + 1 }
                                    : product
                                )
                              );
                            } catch (error) {
                              console.error(
                                "Error adding product to cart:",
                                error
                              );
                            }
                          }}
                          className="bg-white text-black rounded-lg p-2"
                        >
                          +
                        </button>
                      </div>
                    </div>
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
        )}

        {!isLoading && checkLogin().loggedIn == false && (
          <div
            id="loginSignupMessage"
            className="flex flex-col gap-10 my-8 mx-10 items-center"
          >
            <h2 className="text-lg font-semibold">
              Please Log-In or Sign-up to see your Cart:
            </h2>
            <div className="text-black flex gap-6">
              <button
                className="rounded-lg p-4 bg-orange-50"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Log In to your Account
              </button>
              <button
                className="rounded-lg p-4 bg-amber-100"
                onClick={() => {
                  window.location.href = "/signup";
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        {!isLoading && checkLogin().loggedIn == true && products.length > 0 && (
          <div
            id="productsBill"
            className="flex flex-col items-center top-14 right-5 sticky h-min bg-white p-6 text-black text-lg"
          >
            <p className="text-2xl font-semibold my-6">Price Detail</p>
            {products.map((productObject, index) => {
              return (
                <div className="flex flex-row gap-2 justify-evenly">
                  <p>Product {index + 1}:</p>
                  <p>
                    {productObject.amount} x {productObject.product.price}${" "}
                  </p>
                </div>
              );
            })}
            <hr className="horizontal_ruler" />
            <div className="flex flex-row gap-2 justify-evenly">
              <p>Discount: </p>
              <p>- 0$</p>
            </div>
            <div className="flex flex-row gap-2 justify-evenly">
              <p>Delivery Charge: </p>
              <p>+ 0$</p>
            </div>
            <hr className="horizontal_ruler" />
            <div className="flex flex-row gap-2 justify-evenly">
              <p>Total: </p>
              <p className="font-bold">{totalPrice}$</p>
            </div>
            <button className="bg-lime-100 p-2 rounded-lg my-4">
              Proceed to Buy
            </button>
          </div>
        )}
      </main>
      <Footer></Footer>
    </>
  );
};

export default CartPage;
