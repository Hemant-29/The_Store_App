import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { urlContext } from "../../../../context/context";
import StarIcon from "../../../icons/StarIcon";

const UserReviewsSection = () => {
  const baseUrl = useContext(urlContext);
  const [userReviews, setuserReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/user/review/all`, {
        withCredentials: true,
      });
      if (response.data.reviews) {
        console.log("reviews response from api:", response.data.reviews);
        setuserReviews(response.data.reviews);
      }
    } catch (error) {
      console.log("error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <>
      <div className="flex flex-col flex-wrap md:flex-row gap-4">
        {userReviews &&
          userReviews.map((review) => {
            if (review != null) {
              return (
                <div className="border rounded-xl flex-1">
                  <h2 className="font-bold">Review</h2>
                  <p>
                    Dated:<p>{review.date}</p>
                  </p>
                  <p>{review.title}</p>
                  <p className="flex">
                    {review.rating}{" "}
                    <StarIcon
                      strokeColor={"transparent"}
                      fillColor={"orange"}
                    ></StarIcon>
                  </p>
                  <p>{review.comment}</p>
                </div>
              );
            }
          })}
      </div>
    </>
  );
};

export default UserReviewsSection;
