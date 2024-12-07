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
import List from "./listProduct.jsx";
import NotFoundPage from "./notFoundPage.jsx";
import Delete from "./DeleteProduct";
import UserLogin from "./UserLogin.jsx";
import { colorContext, urlContext } from "../context/context.js";

// Importing CSS File
import "./index.css";
import UserSignup from "./userSignup.jsx";
import SellerLogin from "./SellerLogin.jsx";
import SellerSignup from "./SellerSignup.jsx";
import UserProfilePage from "./UserProfilePage.jsx";
import SellerProfilePage from "./SellerProfilePage.jsx";
import ProductPage from "./ProductPage.jsx";
import CartPage from "./CartPage.jsx";
import WishListPage from "./WishListPage.jsx";

// Main Function with all the logic
const Main = () => {
  const [appTheme, setAppTheme] = useState(
    localStorage.getItem("appTheme") || "light"
  );
  const [bgColor, setBgColor] = useState("");
  const [fgColor, setFgColor] = useState("");
  const [footerColor, setFooterColor] = useState("");

  useEffect(() => {
    if (appTheme == "light") {
      setBgColor("bg-slate-50");
      setFgColor("black");
      setFooterColor("bg-neutral-100");
    }
    if (appTheme == "dark") {
      setBgColor("bg-stone-700");
      setFgColor("white");
      setFooterColor("bg-stone-800");
    }
  }, [appTheme]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <NotFoundPage />,
    },
    {
      path: "/upload",
      element: <List />,
    },
    {
      path: "/delete",
      element: <Delete />,
    },
    {
      path: "/signup",
      element: <UserSignup />,
    },
    {
      path: "/signup/seller",
      element: <SellerSignup />,
    },
    {
      path: "/login",
      element: <UserLogin />,
    },
    {
      path: "/login/seller",
      element: <SellerLogin />,
    },
    {
      path: "/user",
      element: <UserProfilePage />,
    },
    {
      path: "/seller",
      element: <SellerProfilePage />,
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
  ]);

  return (
    // <urlContext.Provider value="https://the-store-app.vercel.app">
    <urlContext.Provider value="http://localhost:5000">
      <colorContext.Provider
        value={{ appTheme, setAppTheme, bgColor, fgColor, footerColor }}
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
