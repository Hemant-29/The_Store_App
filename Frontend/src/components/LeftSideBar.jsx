import { useState, useEffect, useContext } from "react";
import { colorContext } from "../../context/context";
import "./components.css";

function LeftSidebar(props) {
  const appColors = useContext(colorContext);
  const ratingsArray = [1, 2, 3, 4, 5];
  const [isVisible, setIsVisible] = useState(false);

  // Functions

  const updateStars = (ratingValue, highlightColor) => {
    for (let index = 1; index <= 5; index++) {
      const star = document.querySelector(`#rating_star_${index}`);
      const starpath = document.querySelector(`#staricon_${index}_path`);
      if (!star || !starpath) {
        return;
      }

      if (index <= ratingValue) {
        star.setAttribute("fill", highlightColor);
        starpath.setAttribute("stroke", "none");
      } else {
        star.setAttribute("fill", "none");
        starpath.setAttribute("stroke", appColors.fgColor);
      }
    }
  };

  const reflectRating = (target) => {
    const ratingValue = target.getAttribute("value");
    updateStars(ratingValue, "#ffa200");
    props.setRating(ratingValue);
  };

  const lightStars = (ratingValue) => {
    updateStars(ratingValue, "#ffda99");
  };

  const fadeStars = () => {
    const ratingValue = props.rating || 0;
    updateStars(ratingValue, "#ffa200");
  };

  const resetValues = () => {
    props.setMaxPrice(10000);
    props.setRating(0);
    props.setMinPrice(0);
    props.setCompany("");
    props.setSearch("");
  };

  useEffect(() => {
    fadeStars();
  }, [props.rating]);

  return (
    <>
      <div className={`flex w-full flex-col sm:w-fit`}>
        <button
          className={`block sm:hidden rounded-xl w-fit px-8 py-3 mx-auto mt-4 text-${appColors.fgColor}`}
          onClick={() => setIsVisible((prev) => !prev)}
        >
          {isVisible ? "Hide Filters" : "Show Filters"}
        </button>

        {(isVisible || props.windowWidth >= 640) && (
          <div
            className={`flex flex-col gap-4 p-8 border-2 rounded-r-3xl border-t-0 border-l-0 shadow-xl ${appColors.appTheme == "light" ? "border-blue-300 " : "border-neutral-900"} border-opacity-25 max-h-screen animate-slideDownExpand`}
          >
            <input
              type="text"
              name="search"
              id="searchbox"
              placeholder="Search"
              className="max-w-40 h-10 mb-4 bg-slate-200 rounded pl-4 mx-auto"
              value={props.search}
              onChange={(evt) => {
                return props.setSearch(evt.target.value);
              }}
            />
            <h3 className={`text-${appColors.fgColor}`}>Company</h3>
            <div>
              <select
                name="company_name"
                id="select_company"
                className="bg-slate-200"
                value={props.company}
                onChange={(evt) => {
                  console.log("company name: ", evt.target.value);
                  props.setCompany(evt.target.value);
                }}
              >
                <option value="">All</option>
                <option value="ikea">Ikea</option>
                <option value="macros">Macros</option>
                <option value="liddy">Liddy</option>
                <option value="caressa">Caressa</option>
              </select>
            </div>
            {/* <h3>Minimum price</h3>
        <div className="flex gap-2">
          <p>0</p>
          <input
            type="range"
            id="minPriceRange"
            name="minPriceRange"
            min="0"
            max="1000"
            step="100"
            onInput={(evt) => {
              props.setMinPrice(evt.target.value);
            }}
          ></input>
          <p>1000</p>
        </div> */}

            <h3 className={`text-${appColors.fgColor}`}>Maximum price</h3>
            <div className={`flex gap-2 text-${appColors.fgColor}`}>
              <p>0</p>
              <input
                type="range"
                id="maxPriceRange"
                name="maxPriceRange"
                min="0"
                max="10000"
                step="20"
                value={props.maxPrice} // Make this a controlled component
                onChange={(evt) => {
                  props.setMaxPrice(evt.target.value);
                }}
                className="w-full"
                // style={{width:'200px'}}
              />
              <p>10000</p>
            </div>
            <p
              className={`ml-auto mr-auto border-2 rounded-lg text-${appColors.fgColor}`}
            >
              <input
                className="text-center text-black w-24 px-2 py-1 rounded-lg"
                type="number"
                value={props.maxPrice} // Make this a controlled component
                onChange={(evt) => {
                  props.setMaxPrice(evt.target.value); // Update maxPrice state
                }}
              />
            </p>

            <h3 className={`text-${appColors.fgColor}`}>Rating</h3>
            <div
              id="rating_buttons"
              className="flex gap-3 justify-center"
              onMouseLeave={fadeStars}
            >
              {ratingsArray.map((rating, index) => (
                <button
                  type="button"
                  key={index}
                  className="rounded-2xl shadow-none"
                  onMouseEnter={() => {
                    lightStars(index + 1);
                  }}
                >
                  {/* {String(index + 1)} */}
                  <svg
                    width="25px"
                    height="25px"
                    viewBox="-2.4 -2.4 28.80 28.80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
                    value={String(index + 1)}
                    onClick={(evt) => reflectRating(evt.currentTarget)}
                    id={`rating_star_${index + 1}`}
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <g id="SVGRepo_iconCarrier">
                      <path
                        id={`staricon_${index + 1}_path`}
                        d="M11.245 4.174C11.4765 3.50808 11.5922 3.17513 11.7634 3.08285C11.9115 3.00298 12.0898 3.00298 12.238 3.08285C12.4091 3.17513 12.5248 3.50808 12.7563 4.174L14.2866 8.57639C14.3525 8.76592 14.3854 8.86068 14.4448 8.93125C14.4972 8.99359 14.5641 9.04218 14.6396 9.07278C14.725 9.10743 14.8253 9.10947 15.0259 9.11356L19.6857 9.20852C20.3906 9.22288 20.743 9.23007 20.8837 9.36432C21.0054 9.48051 21.0605 9.65014 21.0303 9.81569C20.9955 10.007 20.7146 10.2199 20.1528 10.6459L16.4387 13.4616C16.2788 13.5829 16.1989 13.6435 16.1501 13.7217C16.107 13.7909 16.0815 13.8695 16.0757 13.9507C16.0692 14.0427 16.0982 14.1387 16.1563 14.3308L17.506 18.7919C17.7101 19.4667 17.8122 19.8041 17.728 19.9793C17.6551 20.131 17.5108 20.2358 17.344 20.2583C17.1513 20.2842 16.862 20.0829 16.2833 19.6802L12.4576 17.0181C12.2929 16.9035 12.2106 16.8462 12.1211 16.8239C12.042 16.8043 11.9593 16.8043 11.8803 16.8239C11.7908 16.8462 11.7084 16.9035 11.5437 17.0181L7.71805 19.6802C7.13937 20.0829 6.85003 20.2842 6.65733 20.2583C6.49056 20.2358 6.34626 20.131 6.27337 19.9793C6.18915 19.8041 6.29123 19.4667 6.49538 18.7919L7.84503 14.3308C7.90313 14.1387 7.93218 14.0427 7.92564 13.9507C7.91986 13.8695 7.89432 13.7909 7.85123 13.7217C7.80246 13.6435 7.72251 13.5829 7.56262 13.4616L3.84858 10.6459C3.28678 10.2199 3.00588 10.007 2.97101 9.81569C2.94082 9.65014 2.99594 9.48051 3.11767 9.36432C3.25831 9.23007 3.61074 9.22289 4.31559 9.20852L8.9754 9.11356C9.176 9.10947 9.27631 9.10743 9.36177 9.07278C9.43726 9.04218 9.50414 8.99359 9.55657 8.93125C9.61593 8.86068 9.64887 8.76592 9.71475 8.57639L11.245 4.174Z"
                        stroke={appColors.fgColor}
                        strokeWidth="0.528"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </button>
              ))}
            </div>

            {/* Reset Button */}
            <div
              className={`w-full flex flex-col items-center text-${appColors.fgColor}`}
              onClick={resetValues}
            >
              <button className="px-6 py-3 mt-4 rounded-xl">Reset</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default LeftSidebar;
