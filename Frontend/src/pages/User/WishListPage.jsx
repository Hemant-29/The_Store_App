import TitleBar from "../../components/TitleBar";
import Footer from "../../components/Footer";
import WishList from "../../components/WishList";
import { useContext } from "react";
import { colorContext } from "../../../context/context";

const WishListPage = () => {
  const appColors = useContext(colorContext);
  return (
    <>
      <TitleBar></TitleBar>
      {/* <h2 className="bg-orange-100 flex h-14 items-center pl-9 py-20 text-3xl w-screen mt-48 sm:mt-0">
        WishList
      </h2> */}
      <WishList></WishList>
      <Footer></Footer>
    </>
  );
};

export default WishListPage;
