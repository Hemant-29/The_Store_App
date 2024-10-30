import axios from "axios";
import { useContext } from "react";
import { colorContext, urlContext } from "../../context/context";

import starImage from "../assets/star.svg";

function ProductsCard(props) {
  const hostName = useContext(urlContext);

  const deleteProduct = async (productID) => {
    try {
      const response = await axios.delete(
        `${hostName}/api/v1/products/${productID}`
      );
      console.log("Product deleted:", response.data);
      location.reload();
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code outside the range of 2xx
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
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

  const appColors = useContext(colorContext);
  const visible = props.visible;
  return (
    <>
      <div className="flex-row w-64">
        <a href="" target="_blank">
          <img
            src={props.image}
            alt="product image"
            className="h-64 object-cover object-center"
          />
          <div className={`flex justify-between text-${appColors.fgColor}`}>
            <p>{props.name}</p>
            {visible.rating ? (
              <div className="flex">
                <p>{props.rating}</p>
                <img src={starImage} alt="star" width="20px" />
              </div>
            ) : (
              <></>
            )}
            {visible.price ? <p>{props.price}</p> : <></>}
          </div>
        </a>
        {visible.delete ? (
          <button
            type="button"
            onClick={() => {
              deleteProduct(props.id);
            }}
            className="bg-red-600 p-2 rounded-md text-white"
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
