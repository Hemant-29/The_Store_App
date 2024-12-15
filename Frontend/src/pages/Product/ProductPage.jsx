import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { colorContext, urlContext } from "../../../context/context";
import TitleBar from "../../components/TitleBar";
import Footer from "../../components/Footer";
import { Link, useParams } from "react-router-dom";
import checkLogin from "../../functions/checkLogin";
import WarningCard from "../../components/WarningCard";
import StarIcon from "../../icons/StarIcon";
import returnIcon from "../../assets/package-return-icon.png";
import replacementIcon from "../../assets/product-replacement-icon.png";
import UpvoteIcon from "../../icons/UpvoteIcon1";
import HeartIcon from "../../icons/heartIcon";
import AddProductReview from "../../components/AddProductReview";

const ProductPage = (props) => {
  const baseUrl = useContext(urlContext);
  const appColors = useContext(colorContext);
  const productID = useParams().id;

  // States
  const [productData, setProductData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [imageIndex, setImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(null);
  const [favlist, setFavlist] = useState(null);
  const [wishlist, setWishlist] = useState(null);
  const [reviews, setReviews] = useState(null);

  // Zoom
  const [zoomX, setZoomX] = useState(0);
  const [zoomY, setZoomY] = useState(0);
  const [displayZoom, setDisplayZoom] = useState(false);

  // Messages
  const [cartMessage, setCartMessage] = useState("");

  const [wishlistMessage, setWishlistMessage] = useState("");
  const [wishlistErrorMessage, setwishlistErrorMessage] = useState("");

  // Reivew
  const [writeReview, setWriteReview] = useState(false);

  // Effect Hooks
  useEffect(() => {
    if (productData && productData.image && productData.image.length > 0) {
      const intervalId = setInterval(() => {
        setImageIndex(
          (prevIndex) => (prevIndex + 1) % productData.image.length
        );
      }, 2000);
      // Change image every 2 seconds
      return () => clearInterval(intervalId);
    }
  }, [productData]);

  useEffect(() => {
    fetchProduct();
    fetchFavorites();
    fetchReviews();
    setLoggedIn(checkLogin().loggedIn);
    // fetchUsername("6759e8644893f41710077a04");
  }, []);

  useEffect(() => {
    checkFavorite();
    // console.log("Product data:", productData);
  }, [favlist, productData]);

  // Functions

  const upvoteReview = async (reviewId) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/user/review/upvote/${reviewId}`,
        {},
        { withCredentials: true }
      );
      if (response.data) {
        console.log("Upvote response = ", response.data.msg);
      }
      fetchProduct();
      fetchReviews();
    } catch (error) {
      console.log("error upvoting:", error.response.data || error.response);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        const response = await axios.delete(
          `${baseUrl}/api/v1/user/wishlist/delete`,
          {
            data: {
              listName: "liked",
              product: productData._id,
            },
            withCredentials: true,
          }
        );

        if (response) {
          // console.log("Removing Favorite.. ", response.data);
        }
      }
      // If its not already favorite
      else {
        const response = await axios.post(
          `${baseUrl}/api/v1/user/wishlist/create`,
          { listName: "liked", product: productData._id },
          { withCredentials: true }
        );

        if (response) {
          // console.log("Adding to Favorite.. ", response.data);
        }
      }
    } catch (error) {
      console.log("error toggling the favorite:", error);
    }
    await fetchFavorites();
  };

  const checkFavorite = () => {
    if (favlist && productData) {
      const isFav = favlist.some((product) => product._id === productData._id);
      setIsFavorite(isFav);
    } else {
      setIsFavorite(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/user/wishlist`, {
        withCredentials: true,
      });

      if (response) {
        const response_wishlist = response.data.wishlist;
        if (response_wishlist) {
          let liked = response_wishlist.find(
            (list) => list.listName === "liked"
          );
          if (liked) {
            liked = liked.products;
          }
          setFavlist(liked);
          setWishlist(response_wishlist);
        }
        // console.log("favlist:", favlist);
      }
    } catch (error) {
      console.log("error fetching favlist:", error);
    }
  };

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

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/products/reviews/${productID}`
      );
      const reviewsResponse = response.data.reviews;

      // Remove null values from the reviewsResponse array
      const filteredReviews = reviewsResponse.filter(
        (review) => review && Object.keys(review).length > 0
      );

      console.log("reviews fetched are:", filteredReviews);

      // Fetch user details for each review
      const reviewsWithUserNames = await Promise.all(
        filteredReviews.map(async (review) => {
          if (review) {
            const user = await fetchUser(review.user);
            return {
              ...review,
              userFullName: user.name,
              userCity: user.city,
            };
          }
        })
      );
      setReviews(reviewsWithUserNames);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/public/user/672cbfb4cfc93ee6107e9057`
      );
      return response.data.user;
    } catch (error) {
      resizeBy.status(500).json({ error: error.message });
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

  const addToWishlist = async (event) => {
    const selectedListName = event.target.value;
    if (selectedListName) {
      try {
        const response = await axios.post(
          `${baseUrl}/api/v1/user/wishlist/create`,
          { listName: selectedListName, product: productData._id },
          { withCredentials: true }
        );

        if (response) {
          console.log(
            `Product added to ${selectedListName} wishlist:`,
            response.data
          );
          if (response.data.msg) setWishlistMessage(response.data.msg);
          fetchFavorites(); // Update the favorites list if needed
        }
      } catch (error) {
        console.log("Error adding to wishlist:", error);
        if (error.response) {
          setwishlistErrorMessage(error.response.data.msg);
        }
      }
    }
  };

  const imageZoom = (e) => {
    setDisplayZoom(true);
    setZoomX((100 * e.nativeEvent.offsetX) / e.target.offsetWidth);
    setZoomY((100 * e.nativeEvent.offsetY) / e.target.offsetHeight);
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
          <div
            className={`flex flex-col ${appColors.bgColor} text-${appColors.fgColor}`}
          >
            <div
              id={"product_page_top-section"}
              className="flex flex-col sm:flex-row"
            >
              {/* Image Section */}
              <div className="relative w-fit h-fit sm:w-140 sm:sticky pb-6 pt-4 top-20 ">
                <img
                  onMouseMove={imageZoom}
                  onMouseLeave={() => {
                    setDisplayZoom(false);
                  }}
                  onMouseEnter={() => {
                    setDisplayZoom(true);
                  }}
                  src={productData.image[imageIndex]}
                  className="w-full h-full object-contain shadow-lg cursor-magnifier"
                  alt="product image"
                />
                <div className="absolute right-0 top-0 mt-4 flex items-center justify-center text-white">
                  <div>
                    <button
                      className="m-2 p-2 bg-white bg-opacity-70 rounded-xl"
                      onClick={toggleFavorite}
                    >
                      <HeartIcon
                        isFavorite={isFavorite}
                        size={"30"}
                      ></HeartIcon>
                    </button>
                  </div>
                </div>

                {/* Buy and Add to Cart Section */}
                <div className="flex flex-col items-center gap-4">
                  <div
                    className={`text-${appColors.appTheme == "light" ? "white" : "black"} flex items-center justify-center gap-6 py-6 mt-6`}
                  >
                    <button
                      onClick={addToCart}
                      className="bg-orange-300 p-4 rounded-xl"
                    >
                      Add To Cart
                    </button>
                    <button
                      onClick={buyNow}
                      className="bg-amber-600 p-4 rounded-xl"
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
                  {loggedIn && (
                    <select
                      className="text-black p-4 rounded-lg bg-white shadow-even-md"
                      name="Add to Wishlist"
                      id="product_select-addtolist"
                      onChange={(e) => {
                        addToWishlist(e);
                        document.getElementById(
                          "product_select-addtolist"
                        ).value = "";
                      }}
                    >
                      <option value="" hidden>
                        Add to Wishlist
                      </option>
                      {wishlist &&
                        wishlist.map((list) => (
                          <option
                            className="p-4 h-8"
                            value={list.listName}
                            key={list.listName}
                          >
                            {list.listName}
                          </option>
                        ))}
                    </select>
                  )}
                  <div className="inset-0">
                    {wishlistMessage && (
                      <WarningCard
                        type={"positive"}
                        message={wishlistMessage}
                        onclick={() => setWishlistMessage((prev) => !prev)}
                      ></WarningCard>
                    )}
                    {wishlistErrorMessage && (
                      <WarningCard
                        type={"negative"}
                        message={wishlistErrorMessage}
                        onclick={() => setwishlistErrorMessage((prev) => !prev)}
                      ></WarningCard>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div
                id="detailSection"
                className="flex flex-col gap-3 p-7 sm:w-1/2"
              >
                {/* Zoomed Image */}
                <div
                  className="top-24 bg-black z-30"
                  style={{
                    width: "45rem",
                    height: "30rem",
                    backgroundImage: `url(${productData.image[imageIndex]})`,
                    backgroundSize: "200%",
                    backgroundPositionX: `${zoomX}%`,
                    backgroundPositionY: `${zoomY}%`,
                    display: `${displayZoom ? "" : "none"}`,
                    position: "fixed",
                  }}
                ></div>

                {/* Product Name */}
                <h2 className="text-2xl font-semibold"> {productData.name}</h2>

                {/* Ratings Section */}
                <div className="flex gap-3">
                  <div className="flex border-r-2 pr-2 border-neutral-300">
                    <p>
                      {productData.rating > 0
                        ? productData.rating
                        : "Product Not rated yet"}
                    </p>
                    <StarIcon
                      strokeColor={"black"}
                      fillColor={"#fbad08"}
                      className="z-10"
                    />
                  </div>
                  {productData.reviews && (
                    <p>{productData.reviews.length} Reviews</p>
                  )}
                </div>

                {/* Price Section */}
                <div>
                  <div className="flex items-center text-xl">
                    <p className="text-green-600">
                      {(
                        (100 * (productData.mrp - productData.price)) /
                        productData.mrp
                      ).toPrecision(4)}
                      % off
                    </p>
                    <pre className="text-3xl font-bold">
                      {" "}
                      ${productData.price}{" "}
                    </pre>
                    Inclusive of all taxes
                  </div>
                  <pre className="flex text-xl">
                    M.R.P: <p className="line-through "> ${productData.mrp} </p>
                  </pre>

                  <div className="mt-4">
                    {productData.stock > 100 ? (
                      <></>
                    ) : (
                      <p className="text-red-600">
                        Hurry only {productData.stock} left in stock!
                      </p>
                    )}
                  </div>
                </div>

                {/* Offers Section */}
                <p className="my-4 text-2xl font-semibold text-start">
                  Available Offers
                </p>
                <div className="flex gap-5 ">
                  <div className="flex gap-5 flex-wrap">
                    {productData.offers.map((offer) => (
                      <div className="flex flex-col gap-2 text-center shadow-even-md rounded-lg w-52 p-3">
                        <p className="font-semibold text-center">
                          {offer.offer}
                        </p>
                        <p>{offer.description}</p>
                        <p>Offer Amount: ${offer.amount}</p>
                      </div>
                    ))}
                    <div className="flex flex-col gap-2 p-3 w-52 rounded-lg shadow-even-md text-center">
                      <p className="font-semibold mb-2">Exclusive Discount</p>
                      <p>
                        Additional {productData.discount}$ discount on this
                        product
                      </p>
                      <p>Offer Amount: ${productData.discount}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Section */}
                <div>
                  <h2 className="my-4 text-2xl font-semibold text-start">
                    Delivery Details
                  </h2>
                  <div className="flex flex-col gap-1">
                    <p>
                      Delivery to{" "}
                      <p className="inline-block underline underline-offset-2 decoration-blue-600">
                        {"313001"}
                      </p>
                    </p>
                    <p>expected in {4} days</p>

                    {/* Return Replacement */}
                    <div className="flex gap-4 mt-4">
                      <div className="flex gap-4">
                        <img src={returnIcon} alt="" className="h-9 w-9" />
                        {productData.return} Return Policy
                      </div>
                      <div className="flex gap-4">
                        <img src={replacementIcon} alt="" className="h-9 w-9" />
                        {productData.replacement} Replacement Policy
                      </div>
                    </div>
                    <div className="mt-2">
                      <p>Sold By : {productData.seller}</p>
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                <div className="text-justify">
                  <p className="my-4 text-2xl font-semibold text-start">
                    Product Description
                  </p>
                  <div className="list-disc pl-6 flex flex-col gap-2">
                    {productData.description && (
                      <p>{productData.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              id="product_page_details-section"
              className="flex gap-6 p-6 justify-between mx-4 flex-col sm:flex-row"
            >
              {/* Features Section */}
              <div className="flex-1 shadow-lg rounded-lg">
                <p className="my-4 text-2xl font-semibold text-start">
                  Product Features
                </p>
                <ul className="list-disc pl-6 flex flex-col gap-2">
                  {productData.features &&
                    productData.features.map((feature) => {
                      return <li>{feature}</li>;
                    })}
                </ul>
              </div>

              {/* Technical Specifications */}
              <div className="flex-1 shadow-lg rounded-lg">
                <p className="my-4 text-2xl font-semibold text-start">
                  Technical Specifications
                </p>
                <ul className="pl-6 flex flex-col gap-2">
                  {productData.specifications &&
                    Object.entries(productData.specifications).map(
                      ([key, value]) => (
                        <li key={key} className="text-md">
                          {" "}
                          <strong>
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                          </strong>{" "}
                          {value}{" "}
                        </li>
                      )
                    )}
                </ul>
              </div>
              {/* Additional Information */}
              <div className="flex-1 shadow-lg rounded-lg">
                <p className="my-4 text-2xl font-semibold text-start">
                  Additional Information
                </p>
                <ul className="pl-6 flex flex-col gap-2">
                  {productData.additionalInfo &&
                    Object.entries(productData.additionalInfo).map(
                      ([key, value]) => (
                        <li key={key} className="text-md">
                          {" "}
                          <strong>
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                          </strong>{" "}
                          {value}{" "}
                        </li>
                      )
                    )}
                </ul>
              </div>
            </div>

            <div id="product_page_review-section" className="flex flex-col p-6">
              {/* QnA Section */}
              <div>
                <p className="my-4 text-2xl font-semibold text-start">
                  Question and Answers
                </p>
              </div>

              {/* Reviews Section */}
              <UpvoteIcon fillColor="red"></UpvoteIcon>
              <div>
                <div className="flex items-center justify-between">
                  <p className="my-4 text-2xl font-semibold text-start">
                    Product Reviews
                  </p>
                  <button
                    className="py-4 px-6 m-4"
                    onClick={() => setWriteReview((prev) => !prev)}
                  >
                    Add a Review
                  </button>
                </div>
                <AddProductReview
                  productId={productData._id}
                  visible={writeReview}
                ></AddProductReview>
                {reviews && reviews.length > 0 && (
                  <div className="flex gap-10 flex-col md:flex-row">
                    {reviews.map((review) => {
                      return (
                        <div className="flex-1 shadow-even-sm p-4 rounded-xl max-w-screen-md">
                          <div className="flex justify-between px-4 ">
                            <div>
                              <div>{review.userFullName},</div>
                              <div>{review.userCity}</div>
                            </div>

                            <p>
                              {new Date(review.date).toLocaleDateString(
                                "en-UK",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>

                          <p className="font-bold text-center">
                            {review.title}
                          </p>

                          <div className="flex">
                            <strong>User Rating : </strong> {review.rating}{" "}
                            <StarIcon></StarIcon>
                          </div>

                          <p>
                            <strong>User Review:</strong> {review.comment}
                          </p>
                          <div className="flex items-center">
                            <button
                              className="shadow-none"
                              onClick={() => upvoteReview(review._id)}
                            >
                              <UpvoteIcon></UpvoteIcon>
                            </button>
                            <p>{review.upvotes.length}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* <div className="flex justify-end mr-24"></div> */}
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
