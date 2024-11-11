// Importing Libraries
import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importing Various Pages and Components
import App from "./App.jsx";
import List from "./listProduct.jsx";
import NotFoundPage from "./notFoundPage.jsx";
import Delete from "./DeleteProduct";
import UserLogin from "./UserLogin.jsx";
import { colorContext, urlContext } from "../context/context.js";

// Importing CSS File
import "./index.css";
import UserPage from "./UserPage.jsx";
import UserSignup from "./userSignup.jsx";

// Main Function with all the logic
const Main = () => {
  const [appTheme, setAppTheme] = useState(
    localStorage.getItem("appTheme") || "light"
  );
  const [bgColor, setBgColor] = useState("");
  const [fgColor, setFgColor] = useState("");

  useEffect(() => {
    if (appTheme == "light") {
      setBgColor("bg-slate-50");
      setFgColor("black");
    }
    if (appTheme == "dark") {
      setBgColor("bg-slate-800");
      setFgColor("white");
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
      path: "/login",
      element: <UserLogin />,
    },
    {
      path: "/User",
      element: <UserPage />,
    },
    {
      path: "/signup",
      element: <UserSignup />,
    },
  ]);

  return (
    // <urlContext.Provider value="https://the-store-app.vercel.app">
    <urlContext.Provider value="http://localhost:5000">
      <colorContext.Provider
        value={{ appTheme, setAppTheme, bgColor, fgColor }}
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
