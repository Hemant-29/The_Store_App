import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { colorContext, urlContext } from "../../context/context";
import { Link } from "react-router-dom";
import checkLogin from "../functions/checkLogin";

import starImage from "../assets/star.svg";

function ProductsCard(props) {
  const appColors = useContext(colorContext);
  const visible = props.visible;
  const hostName = useContext(urlContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const [deletePrompt, setDeletePrompt] = useState(false);

  // States
  const [isFavorite, setIsFavorite] = useState(null);

  const checkFavorite = () => {
    const favoritesList = props.favorites;
    if (props.favorites) {
      // console.log("Favorites:", favoritesList);
      const isLiked = favoritesList.some(
        (favorite) => favorite._id === props.id
      );
      if (isLiked) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
      // console.log(`${props.name} Product Liked:`, isLiked);
    }
  };

  useEffect(() => {
    if (checkLogin().loggedIn && checkLogin().userType == "user") {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    checkFavorite();
  }, [props.favorites, props.id, props.name]);

  const toggleFavorite = async () => {
    if (isFavorite) {
      try {
        const response = await axios.delete(
          `${hostName}/api/v1/user/wishlist/delete`,
          {
            data: {
              listName: "liked",
              product: props.id,
            },
            withCredentials: true,
          }
        );

        if (response) {
          // console.log("Removing Favorite.. ", response.data);
        }
      } catch (error) {
        console.log("error removing favorite", error);
      }
    }
    // If its not already favorite
    else {
      try {
        const response = await axios.post(
          `${hostName}/api/v1/user/wishlist/create`,
          { listName: "liked", product: props.id },
          { withCredentials: true }
        );

        if (response) {
          // console.log("Adding to Favorite.. ", response.data);
        }
      } catch (error) {
        console.log("error Adding favorite", error.response.data);
      }
    }
    props.fetchApi();
    checkFavorite();
  };

  const deleteProduct = async (productID) => {
    try {
      const response = await axios.delete(
        `${hostName}/api/v1/seller/product/${productID}`,
        { withCredentials: true }
      );
      if (response) {
        props.setMessage(response.data.msg);
      }
      console.log("Product deleted:", response.data);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code outside the range of 2xx
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);

        props.setErrorMessage(error.response.data.msg);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error message:", error.message);
      }
      console.error("Config:", error.config);
    }
  };

  return (
    <>
      {deletePrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="w-1/3 h-1/3 bg-blue-200 flex flex-col items-center justify-center rounded-2xl bg-opacity-40 backdrop-filter backdrop-blur-lg animate-growAndShrink z-50">
            Confirm deleting the product: {props.name}
            <div className="flex gap-5">
              <button
                className="px-5 py-3 rounded-lg bg-red-200 text-black"
                onClick={() => {
                  deleteProduct(props.id);
                  setDeletePrompt(false);
                }}
              >
                Yes
              </button>
              <button
                className="px-5 py-3 rounded-lg bg-slate-200 text-black"
                onClick={() => setDeletePrompt(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col w-72 justify-center">
        <Link
          className="flex flex-col w-72 h-72 justify-center"
          to={`/product/${props.id}`}
          target="_blank"
        >
          <img
            src={props.image[0]}
            alt="product image"
            className="h-full w-full object-cover object-center hover:scale-90 transition-all ease-in-out rounded-xl shadow-2xl"
          />
        </Link>

        {/* Like The Product */}
        {loggedIn && (
          <div className="relative">
            <button
              className="shadow-none absolute right-2 bottom-2"
              onClick={toggleFavorite}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill={isFavorite ? "red" : "none"}
                stroke={isFavorite ? "red" : "black"}
                strokeWsidth="2"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        )}

        <Link to={`/product/${props.id}`} target="_blank">
          <div
            className={`mt-2 flex gap-2 justify-between text-${appColors.fgColor} text-lg`}
          >
            {/* Name */}
            <p className="text-base line-clamp-2">{props.name}</p>

            {/* Rating */}
            {visible.rating && props.rating > 0 ? (
              <div className="flex">
                <p>{props.rating}</p>
                <svg
                  width="25px"
                  height="25px"
                  viewBox="-2.4 -2.4 28.80 28.80"
                  fill="none"
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
              </div>
            ) : (
              <></>
            )}

            {/* Price */}
            {visible.price ? <p>{props.price}</p> : <></>}
          </div>
        </Link>
        {visible.delete ? (
          <button
            type="button"
            onClick={() => {
              setDeletePrompt(props.id);
              // deleteProduct(props.id);
            }}
            className="bg-red-600 p-2 w-fit rounded-md text-white"
          >
            Delete
          </button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default ProductsCard;
