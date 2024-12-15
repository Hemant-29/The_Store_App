import React, { useContext, useState } from "react";
import { urlContext } from "../../context/context";
import axios from "axios";
import WarningCard from "./WarningCard";

const AddProductReview = ({ productId, visible }) => {
  const [rating, setRating] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewErrorMessage, setReviewErrorMessage] = useState("");

  const baseUrl = useContext(urlContext);

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewData = {
      product: productId,
      rating: Number(rating),
      title,
      comment,
    };
    addReviewRequest(reviewData);
  };

  const addReviewRequest = async (reviewData) => {
    const url = `${baseUrl}/api/v1/user/review/add/${productId}`;
    try {
      const response = await axios.post(url, reviewData, {
        withCredentials: true,
      }); // Await the axios post request
      if (response.data) {
        console.log(response.data.msg);
        setReviewMessage(response.data.msg);
      }
    } catch (error) {
      console.error(
        "Error adding review:",
        error.response.data.msg || error.response.data.error
      );
      setReviewErrorMessage(
        error.response.data.msg || error.response.data.error
      );
    }
  };

  return (
    <div className="flex flex-col items-center my-10">
      {visible && (
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white rounded-xl shadow-md md:w-1/2"
        >
          <h2 className="text-2xl text-center py-4 mb-4">
            Write a Product Review
          </h2>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="rating"
            >
              Rating:
            </label>
            <select
              id="rating"
              value={rating}
              onChange={handleRatingChange}
              required
              className="w-fit p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="title"
            >
              Title:
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Review title"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="comment"
            >
              Comment:
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Write your review"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-fit py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}
      {reviewMessage && (
        <WarningCard
          type="positive"
          message={reviewMessage}
          onclick={() => setReviewMessage(false)}
        ></WarningCard>
      )}
      {reviewErrorMessage && (
        <WarningCard
          type="negative"
          message={reviewErrorMessage}
          onclick={() => setReviewErrorMessage(false)}
        ></WarningCard>
      )}
    </div>
  );
};

export default AddProductReview;
