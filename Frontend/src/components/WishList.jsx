import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { colorContext, urlContext } from "../../context/context";
import { Link, useParams } from "react-router-dom";
import checkLogin from "../functions/checkLogin";

const WishList = () => {
  const appColors = useContext(colorContext);
  const baseUrl = useContext(urlContext);

  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");

  const fetchWishList = async () => {
    const response = await axios.get(`${baseUrl}/api/v1/user/wishlist`, {
      withCredentials: true,
    });
    setMessage(response.data.msg);
    setWishlist(response.data.wishlist);
  };

  useEffect(() => {
    fetchWishList();
  }, []);
  return (
    <main>
      <div
        className={`flex flex-col ${appColors.bgColor} text-${appColors.fgColor}`}
      >
        {/* Wishlist Message */}
        <div className="text-center text-green-400 text-lg">
          {message && <p>{message}</p>}
        </div>

        {/* Show Wishlist */}
        {wishlist &&
          wishlist.map((list) => (
            <div className="flex flex-col p-10 text-2xl font-semibold">
              <h2 className="my-8">
                {list.listName.charAt(0).toUpperCase() + list.listName.slice(1)}
              </h2>

              {list.products && list.products.length > 0 ? (
                list.products.map((product) => {
                  return (
                    <div className="w-full bg-gray-200 p-8 bg-opacity-70 text-black shadow-md">
                      <Link
                        to={`/product/${product._id}`}
                        className="shadow-none flex font-normal text-xl w-fit"
                      >
                        <div className="px-8">
                          <h3>
                            <div className="p-6">{product.name}</div>
                          </h3>
                          <div className="w-72 h-72">
                            <img
                              src={product.image}
                              alt="product image"
                              width={"300px"}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                        <div className="mt-20">
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
