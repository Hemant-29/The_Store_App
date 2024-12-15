import React, { useEffect } from "react";

const WarningCard = ({ type, message, onclick }) => {
  let textcolor = type == "positive" ? "text-green-400" : "text-red-500"; // Hide the warning card after 2 seconds

  useEffect(() => {
    const timer = setTimeout(() => {
      onclick();
    }, 2000);
    return () => clearTimeout(timer);
    // Cleanup the timer if the component unmounts
  }, [message, onclick]);

  return (
    <div
      onClick={onclick}
      className="flex items-center justify-center inset-0 w-fit h-full p-6 animate-growAndShrink"
    >
      <p
        className={`text-lg text-center font-semibold ${textcolor} p-6 box-content bg-neutral-100 bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-2xl select-none shadow-even-md`}
      >
        {message}
      </p>
    </div>
  );
};

export default WarningCard;
