import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import List from "./listProduct.jsx";
import NotFoundPage from "./notFoundPage.jsx";
import Delete from "./DeleteProduct";
import { colorContext } from "../context/context.js";

import "./index.css";

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
  ]);

  return (
    <colorContext.Provider value={{ appTheme, setAppTheme, bgColor, fgColor }}>
      <RouterProvider router={router} />
    </colorContext.Provider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Main></Main>
  </StrictMode>
);
