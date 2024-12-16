// Importing Libraries
import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useParams,
} from "react-router-dom";

// Importing Various Pages and Components
import App from "./App.jsx";
import "./index.css";
// import List from "./listProduct.jsx";
// import Delete from "./DeleteProduct";
import NotFoundPage from "./pages/Other/notFoundPage.jsx";
import ProductPage from "./pages/Product/ProductPage.jsx";

// Import User pages
import UserLogin from "./pages/User/UserLogin.jsx";
import UserSignup from "./pages/User/UserSignup.jsx";
import UserProfilePage from "./pages/User/UserProfilePage.jsx";
import CartPage from "./pages/User/CartPage.jsx";
import WishListPage from "./pages/User/WishListPage.jsx";

// Importing Sellers Pages
import SellerLogin from "./pages/seller/SellerLogin.jsx";
import SellerSignup from "./pages/seller/SellerSignup.jsx";
import SellerProfilePage from "./pages/seller/SellerProfilePage.jsx";
import SellerHomePage from "./pages/seller/SellerHomePage.jsx";
import SellerNotFoundPage from "./pages/Other/SellerNotFoundPage.jsx";

// Import Contexts
import { colorContext, urlContext } from "../context/context.js";
import SellerProductsPage from "./pages/seller/SellerProductsPage.jsx";
import ListProduct from "./pages/seller/ListProduct.jsx";
import DeleteProduct from "./pages/seller/DeleteProduct.jsx";

// Main Function with all the logic
const Main = () => {
  const [appTheme, setAppTheme] = useState(
    localStorage.getItem("appTheme") || "light"
  );
  const [bgColor, setBgColor] = useState("");
  const [fgColor, setFgColor] = useState("");
  const [footerColor, setFooterColor] = useState("");
  const [titlebarColor, setTitlebarColor] = useState("");
  const [headingbarColor, setHeadingbarColor] = useState("");

  useEffect(() => {
    if (appTheme == "light") {
      setBgColor("bg-slate-50");
      setFgColor("black");
      setFooterColor("bg-neutral-100");
      setTitlebarColor("bg-sky-100 bg-opacity-35 backdrop-blur-md");
      setHeadingbarColor("bg-violet-100");
    }
    if (appTheme == "dark") {
      setBgColor("bg-stone-700");
      setFgColor("white");
      setFooterColor("bg-stone-800");
      setTitlebarColor("bg-sky-100 bg-opacity-20 backdrop-blur-md");
      setHeadingbarColor("bg-violet-200");
    }
  }, [appTheme]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <NotFoundPage />,
    },
    // {
    //   path: "/upload",
    //   element: <List />,
    // },
    // {
    //   path: "/delete",
    //   element: <Delete />,
    // },
    {
      path: "/signup",
      element: <UserSignup />,
    },
    {
      path: "/login",
      element: <UserLogin />,
    },
    {
      path: "/user",
      element: <UserProfilePage />,
    },
    {
      path: "/product/:id",
      element: <ProductPage />,
    },
    {
      path: "/user/cart",
      element: <CartPage />,
    },
    {
      path: "/user/wishlist",
      element: <WishListPage />,
    },
    {
      path: "/seller",
      element: <SellerHomePage />,
      errorElement: <SellerNotFoundPage></SellerNotFoundPage>,
    },
    {
      path: "/signup/seller",
      element: <SellerSignup />,
    },
    {
      path: "/login/seller",
      element: <SellerLogin />,
    },
    {
      path: "/seller/profile",
      element: <SellerProfilePage />,
    },
    {
      path: "/seller/products",
      element: <SellerProductsPage></SellerProductsPage>,
    },
    {
      path: "/seller/product/list",
      element: <ListProduct></ListProduct>,
    },
    {
      path: "seller/product/delete",
      element: <DeleteProduct></DeleteProduct>,
    },
  ]);

  return (
    // <urlContext.Provider value="https://the-store-app.vercel.app">
    <urlContext.Provider value="http://localhost:5000">
      <colorContext.Provider
        value={{
          appTheme,
          setAppTheme,
          bgColor,
          fgColor,
          footerColor,
          titlebarColor,
          headingbarColor,
        }}
      >
        <RouterProvider router={router} />
      </colorContext.Provider>
    </urlContext.Provider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Main></Main>
  </StrictMode>
);
