import { useState, useEffect, useContext } from "react";
import { colorContext, urlContext, widthContext } from "../context/context";

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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const baseUrl = useContext(urlContext);
  const [url, setUrl] = useState(
    `${baseUrl}/api/v1/products?page=${page}&limit=${itemsLimit}&sortby=${sort_order + sort}`
  );

  const appColors = useContext(colorContext);

  // Window Width Change effect hook
  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 200); // Adjust the delay as needed
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  localStorage.setItem("backendLoading", true);
  // Check backend health status
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/v1/public/health`);
        if (response.ok) {
          localStorage.setItem("backendLoading", false);
          setIsBackendLoading(false);
        } else {
          localStorage.setItem("backendLoading", true);
          setIsBackendLoading(true);
        }
      } catch (error) {
        localStorage.setItem("backendLoading", true);
        setIsBackendLoading(true);
      }
    };
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
    // Clean up interval on component unmount
  }, [baseUrl]);

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

  useEffect(() => {
    localStorage.setItem("ulPosition", "280px");
  }, []);

  if (localStorage.getItem("backendLoading") === true) {
    return (
      <>
        {/* <TitleBar></TitleBar> */}
        {/* <div className={`${appColors.bgColor} `}>
          <div className="h-72 bg-none overflow-hidden rounded-b-3xl shadow-xl "></div>
        </div> */}
        {/* <Footer></Footer> */}
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-4xl">
            <p>Loading...</p>
            <p>Please wait while the server is starting up</p>
            <p>(It may take 1-2 minutes)</p>
          </h1>
        </div>
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
        <div className="aspect-h-1 aspect-w-3 sm:aspect-w-6 rounded-b-2xl sm:rounded-b-3xl w-full bg-none overflow-hidden  shadow-xl z-10">
          <img
            id="scrolling-image"
            src={HeroImages.img6}
            alt="Hero Image"
            className="w-full h-full object-cover object-center rounded-b-2xl sm:rounded-b-3xl z-10"
            // style={{ objectPosition: "0px -350px" }}
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
            windowWidth={windowWidth}
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
