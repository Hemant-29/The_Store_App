import notFoundImage from "./assets/notFound.jpg";

const notFoundPage = () => {
  return (
    <div className="flex flex-col items-center font-bold m-10 text-4xl">
      404 - Page Not Found
      <img src={notFoundImage} alt="404 image" width="600px" />
    </div>
  );
};

export default notFoundPage;
