import React from "react";

const WarningCard = ({ type, message, onclick }) => {
  let textcolor = type == "positive" ? "text-green-400" : "text-red-500";

  return (
    <div onClick={onclick} className="fixed p-6 w-64">
      <p
        className={`text-lg text-center font-semibold ${textcolor} p-6 box-content bg-neutral-500 bg-opacity-70 backdrop-filter backdrop-blur-md rounded-md select-none`}
      >
        {message}
      </p>
    </div>
  );
};

export default WarningCard;
