import { useState, useEffect, useContext } from "react";
import { colorContext } from "../context/context";

import AllProducts from "./components/AllProducts";
import TitleBar from "./components/TitleBar";
import Footer from "./components/Footer";

const DeleteProduct = () => {
  const appColors = useContext(colorContext);

  const [sort, setSort] = useState("name");
  const [sort_order, setSort_order] = useState("");
  const [page, setPage] = useState(1);
  const [url, setUrl] = useState(
    `http://localhost:5000/api/v1/products?page=${page}&sortby=${sort_order + sort}`
  );

  return (
    <>
      <div className={appColors.bgColor}>
        <TitleBar></TitleBar>
        <h2 className="bg-orange-100 flex h-14 items-center pl-9 py-20 text-3xl w-screen  mt-48 sm:mt-0">
          Delete A Product
        </h2>

        <main className="flex flex-col items-center mt-14 ">
          <h2 className={`text-xl p-5 text-${appColors.fgColor}`}>
            Select the product to delete
          </h2>

          <AllProducts
            sort={sort}
            setSort={setSort}
            sort_order={sort_order}
            setSort_order={setSort_order}
            page={page}
            setPage={setPage}
            url={url}
            setUrl={setUrl}
            visible={{ delete: true, price: true }}
          ></AllProducts>
        </main>
      </div>
      <Footer></Footer>
    </>
  );
};

export default DeleteProduct;
