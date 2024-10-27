import { useContext } from "react";
import TitleBar from "./components/TitleBar";
import ListForm from "./components/ListForm";
import { colorContext } from "../context/context";
import Footer from "./components/Footer";

const upload = () => {
  const appColors = useContext(colorContext);

  return (
    <>
      <div className={appColors.bgColor}>
        <TitleBar></TitleBar>
        <h2 className="bg-orange-100 flex h-14 items-center pl-9 py-20 text-3xl w-screen  mt-48 sm:mt-0">
          List A Product on Website
        </h2>

        <main
          className={`flex flex-col items-center mt-14 text-${appColors.fgColor}`}
        >
          <h2 className="text-xl p-5">Enter Your Product Details</h2>
          <ListForm></ListForm>
        </main>
      </div>
      <Footer></Footer>
    </>
  );
};

export default upload;
