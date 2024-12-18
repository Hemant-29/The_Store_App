import { useState, useEffect, useContext } from "react";
import { colorContext, urlContext } from "../context/context";

import "./App.css";

import LeftSidebar from "./components/LeftSideBar";
import AllProducts from "./components/AllProducts";
import Footer from "./components/Footer";
import TitleBar from "./components/TitleBar";
import HeroImages from "./images/HeroImages";

function App() {
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState("name");
  const [sort_order, setSort_order] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [itemsLimit, setItemsLimit] = useState(10);
  const [isBackendLoading, setIsBackendLoading] = useState(true);

  const baseUrl = useContext(urlContext);
  const [url, setUrl] = useState(
    `${baseUrl}/api/v1/products?page=${page}&limit=${itemsLimit}&sortby=${sort_order + sort}`
  );

  const appColors = useContext(colorContext);

  // Check backend health status
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/v1/public/health`);
        console.log("Backend Health response: ", response);
        if (response.ok) {
          setIsBackendLoading(false);
        } else {
          setIsBackendLoading(true);
        }
      } catch (error) {
        setIsBackendLoading(true);
      }
    };
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
    // Clean up interval on component unmount
  }, [baseUrl]);

  useEffect(() => {
    console.log("is Backend loading? State Variable : ", isBackendLoading);
  }, [isBackendLoading]);

  // Calls the API for data
  useEffect(() => {
    console.log("API Url:", url);

    setUrl(
      `${baseUrl}/api/v1/products?name=${search}&page=${page}&limit=${itemsLimit}&company=${company}&sortby=${sort_order + sort}&numericfilters=price<${maxPrice},rating>=${rating}`
    );
    // setUrl(
    //   `${baseUrl}/api/v1/seller/products?name=${search}&page=${page}&limit=${itemsLimit}&company=${company}&sortby=${sort_order + sort}&numericfilters=price<${maxPrice},rating>=${rating}`
    // );
  }, [
    page,
    sort,
    sort_order,
    company,
    minPrice,
    maxPrice,
    rating,
    search,
    itemsLimit,
  ]); // Trigger URL update when page, sort, etc. changes

  // for scrolling image
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      document.getElementById("scrolling-image").style.transform =
        `translateY(${scrollPosition * 0.7}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (isBackendLoading) {
    return (
      <>
        <TitleBar></TitleBar>
        <div className={`${appColors.bgColor} `}>
          <div className="h-72 bg-none overflow-hidden rounded-b-3xl shadow-xl ">
            <h1>Loading... Please wait while the server is starting up.</h1>
          </div>
        </div>
        <Footer></Footer>
        {/* <div className="flex items-center justify-center h-screen">
        </div> */}
      </>
    );
  }

  return (
    <>
      <TitleBar></TitleBar>
      {/* <h2 className="bg-slate-100 flex h-14 items-center pl-9 py-20 text-3xl w-screen mt-48 sm:mt-0">
        Home Page
      </h2> */}
      <div className={`${appColors.bgColor} `}>
        <div className="h-72 bg-none overflow-hidden rounded-b-3xl shadow-xl ">
          <img
            id="scrolling-image"
            src={HeroImages.img6}
            alt="Hero Image"
            className="w-full h-full object-cover rounded-b-3xl"
            style={{ objectPosition: "0px -350px" }}
          />
        </div>
        <div className={`flex flex-col sm:flex-row`}>
          <LeftSidebar
            company={company}
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
            setItemsLimit={setItemsLimit}
          ></AllProducts>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default App;
