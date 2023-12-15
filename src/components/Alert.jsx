import React from "react";
import { Link } from "react-router-dom";

const Alert = ({ message, alertType, alertLocation, setMessage}) => {
  // console.log(alertLocation);
  const handleClose = () => {
    setMessage('')
  };
  return (
    <div className='flex items-center justify-center fixed top-0 left-0 h-full w-full bg-black bg-opacity-[90%] z-[51]'>
      <div className="bg-white flex items-center justify-center mt-[90px] lg:mt-0 py-10 px-5 w-[80%] lg:w-1/3 gap-4 flex-col rounded-lg relative">
      <button onClick={handleClose} className='text-center absolute right-0 top-0 text-red-500 text-sm sm:text-lg py-1 px-2 mb-3'><i className="ri-close-circle-line"></i></button>
        {alertType === "Danger" ? (
          <div className="wrapper">
            <svg
              className="cancel"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <path
                className="check__cancel"
                fill="none"
                d="M14.1 14.1l23.8 23.8 m0,-23.8 l-23.8,23.8"
              />
            </svg>
          </div>
        ) : (
          <div className="wrapper">
            <svg
              className="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>
        )}

        {alertType === "Danger" ? (
          <p className="text-center text-red-500 text-sm sm:text-lg py-1 px-2 mb-3">
            {message}
          </p>
        ) : (
          <p className="text-center text-green-600 py-1 px-2 mb-3 text-sm sm:text-lg">
            {message}
          </p>
        )}

        {alertLocation === "settings" ? null : (
          <>
            {alertType === "Success" ? (
              <Link
                to="/home"
                className="text-green-600 text-sm sm:text-lg rounded-[4px] border-green-600 border-[1px] py-1 px-3 hover:bg-green-600 hover:text-white transition-all"
              >
                Continue
              </Link>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default Alert;
