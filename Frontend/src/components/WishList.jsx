import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { colorContext, urlContext } from "../../context/context";
import { Link, useParams } from "react-router-dom";
import checkLogin from "../functions/checkLogin";
import WarningCard from "./WarningCard";

const WishList = () => {
  const appColors = useContext(colorContext);
  const baseUrl = useContext(urlContext);

  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchWishList = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/user/wishlist`, {
        withCredentials: true,
      });
      if (response.data.msg && response.status == "200") {
        setMessage(response.data.msg);
        setErrorMessage(false);
      }
      setWishlist(response.data.wishlist);
    } catch (error) {
      console.log("error fetching wishlist", error);
      if (error.response.data) {
        setErrorMessage(error.response.data.msg);
        setMessage(false);
      }
    }
  };

  useEffect(() => {
    console.log(`message: (${message})`);
    console.log(wishlist);
  }, [message]);

  useEffect(() => {
    fetchWishList();
  }, []);

  return (
    <main>
      <div
        className={`flex flex-col ${appColors.bgColor} text-${appColors.fgColor} min-h-screen`}
      >
        <div className="w-full flex justify-center">
          {/* {message && (
            <div className="text-center text-green-400 text-lg">
              <WarningCard
                type={"positive"}
                message={message}
                onclick={() => setMessage((prev) => !prev)}
              ></WarningCard>
            </div>
          )} */}
          {errorMessage && (
            <div className="text-center text-green-400 text-lg">
              <WarningCard
                type={"negative"}
                message={errorMessage}
                onclick={() => setMessage((prev) => !prev)}
              ></WarningCard>
            </div>
          )}
        </div>

        {/* Show Wishlist */}
        {wishlist &&
          wishlist.map((list) => (
            <div className="flex flex-col p-10 text-2xl font-semibold border-2 rounded-lg mx-4 mt-20">
              <h2 className="my-8">
                {list.listName.charAt(0).toUpperCase() + list.listName.slice(1)}
              </h2>

              {list.products && list.products.length > 0 ? (
                list.products.map((product) => {
                  return (
                    <div className="w-full bg-gray-200 p-8 bg-opacity-70 text-black shadow-md">
                      <Link
                        to={`/product/${product._id}`}
                        className="flex flex-col md:flex-row font-normal text-xl w-fit shadow-none items-center"
                      >
                        <div className="px-8">
                          <div className="w-72 h-72">
                            <img
                              src={product.image[0]}
                              alt="product image"
                              width={"300px"}
                              className="object-cover w-full h-full rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3>
                            <div className="mb-8">{product.name}</div>
                          </h3>
                          <p>Company - {product.company}</p>
                          <p>Price - {product.price} $</p>
                          <p>Rating - {product.rating}</p>
                        </div>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <h2 className="text-lg font-normal ml-10">
                  {" "}
                  This list has no items
                </h2>
              )}
            </div>
          ))}
      </div>
    </main>
  );
};

export default WishList;
