import { useState, useEffect, useContext } from "react";
import ProductsCard from "./ProductsCard";
import { colorContext } from "../../context/context";

function AllProducts(props) {
  const appColors = useContext(colorContext);
  const [ApiData, setApiData] = useState(["None"]);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    fetch(props.url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setApiData(data.products);
        setProductCount(data.nbHits);
      });
  }, [props.url]); //Fetch Products from the API whenever the url changes

  function addPage() {
    props.setPage((page) => {
      return page + 1;
    });
  }

  function reducePage() {
    props.setPage((page) => {
      if (page > 1) {
        return page - 1;
      }
      return page;
    });
  }

  return (
    <>
      <div className="top-0 w-full p-8">
        <div className="flex justify-between my-4">
          <p className={`text-${appColors.fgColor} p-2`}>
            {productCount} Products Found
          </p>
          <p className={`text-${appColors.fgColor} p-3`}>Page - {props.page}</p>
          <div className="flex flex-col sm:flex-row gap-4 p-2">
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

        <div className="flex flex-wrap gap-12">
          {ApiData.map((product, index) => (
            <ProductsCard
              key={index}
              name={product.name}
              price={`${product.price}$`}
              image={product.image}
              rating={product.rating}
              id={product._id}
              visible={props.visible}
            />
          ))}
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
