import axios from "axios";
import { useContext } from "react";
import { colorContext, urlContext } from "../../context/context";
import { Link } from "react-router-dom";
import StarIcon from "../icons/StarIcon";

function ProductsCardCart(props) {
  const appColors = useContext(colorContext);
  const visible = props.visible;

  function calculateOffer(mrp, price) {
    if (isNaN(mrp) || isNaN(price) || mrp === 0) {
      return "N/A"; // Handle invalid values
    }
    return ((100 * (mrp - price)) / mrp).toFixed(2); // Limit to 2 decimal places
  }

  return (
    <>
      <div className="text-black flex">
        <img
          src={props.image}
          alt="product image"
          className="h-64 w-64 hover:scale-95 transition-all ease-in-out object-cover object-center rounded-lg"
        />
        <Link to={`/product/${props.id}`} target="_blank" className="pr-20">
          <div className={`flex flex-col gap-2 justify-between text-lg mx-8`}>
            <p>{props.name}</p>
            {visible.rating ? (
              <div className="flex">
                {props.rating < 0 ? (
                  <p>Product not rated yet</p>
                ) : (
                  <p>{props.rating}</p>
                )}
                <StarIcon strokeColor={"black"}></StarIcon>
              </div>
            ) : (
              <></>
            )}
            {/* Price Section */}

            {visible.price ? (
              <div>
                <div className="flex items-center text-xl">
                  <p className="text-green-600">
                    {calculateOffer(props.mrp, props.price)}% off
                  </p>
                  <p className="text-3xl font-bold mx-3">${props.price}</p>
                  Inclusive of all taxes
                </div>
                <pre className="flex text-xl">
                  M.R.P: <p className="line-through">${props.mrp}</p>
                </pre>

                <div className="mt-4">
                  {props.stock <= 100 && props.stock > 0 ? (
                    <p className="text-red-600">
                      Hurry only {props.stock} left in stock!
                    </p>
                  ) : props.stock <= 0 ? (
                    <p className="text-red-600">Product is out of stock</p>
                  ) : null}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </Link>
      </div>
    </>
  );
}

export default ProductsCardCart;
