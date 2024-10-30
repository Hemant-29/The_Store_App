import { useState, useEffect, useContext } from "react";
import { colorContext, urlContext } from "../context/context";

import "./App.css";

import LeftSidebar from "./components/LeftSideBar";
import AllProducts from "./components/AllProducts";
import Footer from "./components/Footer";
import TitleBar from "./components/TitleBar";

function App() {
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState("1");
  const [sort, setSort] = useState("name");
  const [search, setSearch] = useState("");
  const [sort_order, setSort_order] = useState("");
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(10000);

  const baseUrl = useContext(urlContext);
  const [url, setUrl] = useState(
    `${baseUrl}/api/v1/products?page=${page}&sortby=${sort_order + sort}`
  );

  const appColors = useContext(colorContext);

  useEffect(() => {
    console.log(url);
    setUrl(
      `${baseUrl}/api/v1/products?name=${search}&page=${page}&company=${company}&sortby=${sort_order + sort}&numericfilters=price<${maxPrice},rating>=${rating}`
    );
  }, [page, sort, sort_order, company, minPrice, maxPrice, rating, search]); // Trigger URL update when page, sort, etc. changes

  return (
    <>
      <TitleBar></TitleBar>
      <h2 className="bg-orange-100 flex h-14 items-center pl-9 py-20 text-3xl w-screen mt-48 sm:mt-0">
        Home Page
      </h2>
      <div className={`flex ${appColors.bgColor} flex-col sm:flex-row`}>
        <LeftSidebar
          setCompany={setCompany}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          rating={rating}
          setRating={setRating}
          search={search}
          setSearch={setSearch}
        ></LeftSidebar>

        <AllProducts
          sort={sort}
          setSort={setSort}
          sort_order={sort_order}
          setSort_order={setSort_order}
          page={page}
          setPage={setPage}
          url={url}
          setUrl={setUrl}
          visible={{ rating: true, price: true }}
        ></AllProducts>
      </div>
      <Footer></Footer>
    </>
  );
}

export default App;
