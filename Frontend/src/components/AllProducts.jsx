import { useState, useEffect, useContext } from "react";
import ProductsCard from "./ProductsCard";
import { colorContext, urlContext } from "../../context/context";
import axios from "axios";

function AllProducts(props) {
  // useContext
  const appColors = useContext(colorContext);
  const baseUrl = useContext(urlContext);

  // States
  const [ApiData, setApiData] = useState(["None"]);
  const [pageProductCount, setPageProductCount] = useState(0);
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [pageLimit, setPageLimit] = useState(0);
  const [favoritesList, setFavoritesList] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    const response = await axios.get(`${baseUrl}/api/v1/user/wishlist`, {
      withCredentials: true,
    });

    if (response) {
      const wishlist = response.data.wishlist;
      if (wishlist) {
        let liked = wishlist.find((list) => list.listName === "liked");
        if (liked) {
          liked = liked.products;
        }
        setFavoritesList(liked);
      }
      // console.log("wishlist:", wishlist);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    fetch(props.url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setApiData(data.products);
        setPageProductCount(data.nbHits);
        setTotalProductCount(data.totalHits);
        setPageLimit(data.pageLimit);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [props.url]); //Fetch Products from the API whenever the url changes

  function addPage() {
    console.log(props.page, totalProductCount, pageLimit);
    if (props.page < Math.ceil(totalProductCount / pageLimit)) {
      props.setPage((page) => page + 1);
    }
  }

  const reducePage = () => {
    if (props.page > 1) {
      props.setPage((page) => page - 1);
    }
  };

  return (
    <>
      <div className="top-0 w-full p-8">
        <div className="flex flex-wrap justify-between my-4">
          <p
            className={`text-${appColors.fgColor} text-nowrap p-2 hidden lg:block`}
          >
            {totalProductCount} Products Found
          </p>
          <div className="flex items-center text-nowrap">
            <p className={`text-${appColors.fgColor} p-2`}>Items per page</p>
            <input
              type="number"
              defaultValue="10"
              name="itemsPerPage"
              id="itemsPerPage"
              className="w-10 h-6 rounded m-2 pl-2"
              onChange={(evt) => {
                props.setItemsLimit(evt.target.value);
              }}
            />
          </div>
          <p className={`text-${appColors.fgColor} p-3`}>Page - {props.page}</p>
          <div className="flex flex-row gap-4 p-2">
            <p className={`text-${appColors.fgColor}`}>Sort By</p>
            <select
              name="sortby"
              id="sortby"
              className="bg-slate-200 rounded-md"
              onChange={(e) => {
                props.setSort(e.target.value);
              }}
            >
              <option value="name">name</option>
              <option value="price">price</option>
              <option value="rating">rating</option>
              <option value="date">created at</option>
              <option value="company">company</option>
            </select>
            <select
              name="sort_order"
              id="sort_order"
              className="bg-slate-200 rounded-md"
              onChange={(evt) => {
                if (evt.target.value == "descending") {
                  props.setSort_order("-");
                } else {
                  props.setSort_order("");
                }
              }}
            >
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap justify-center sm:justify-normal gap-12 ">
          {isLoading ? (
            <p className={`text-${appColors.fgColor} text-lg`}>Loading...</p>
          ) : (
            ApiData &&
            ApiData.map((product, index) => (
              <ProductsCard
                key={index}
                name={product.name}
                price={`${product.price}$`}
                image={product.image}
                rating={product.rating}
                id={product._id}
                visible={props.visible}
                favorites={favoritesList}
                fetchApi={fetchFavorites}
              />
            ))
          )}
        </div>
        <div className="flex gap-5 justify-center my-8">
          <button
            className="bg-slate-200 p-2 rounded-md hover:bg-slate-400"
            onClick={reducePage}
          >
            Prev
          </button>
          <button
            className="bg-slate-200 p-2 rounded-md hover:bg-slate-400"
            onClick={addPage}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default AllProducts;
