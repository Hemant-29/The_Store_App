import notFoundImage from "../../assets/notFound.jpg";
import SellerTitlebar from "../../components/SellerTitlebar";
import TitleBar from "../../components/TitleBar";

const SellerNotFoundPage = () => {
  return (
    <>
      <SellerTitlebar></SellerTitlebar>
      <div className="flex flex-col items-center font-bold m-32 text-4xl">
        404 - Seller Page Not Found
        <img src={notFoundImage} alt="404 image" width="600px" />
      </div>
    </>
  );
};

export default SellerNotFoundPage;
