import notFoundImage from "../../assets/notFound.jpg";
import TitleBar from "../../components/TitleBar";

const notFoundPage = () => {
  return (
    <>
      <TitleBar></TitleBar>
      <div className="flex flex-col items-center font-bold m-32 text-4xl">
        404 - Page Not Found
        <img src={notFoundImage} alt="404 image" width="600px" />
      </div>
    </>
  );
};

export default notFoundPage;
