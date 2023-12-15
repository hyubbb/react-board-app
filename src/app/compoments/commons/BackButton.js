import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const num = location.pathname.includes("board") ? "/" : -1;
  return (
    <button
      onClick={() => navigate(num)}
      className='border-2 border-solid border-black rounded w-24 mr-5 text-center'
    >
      back
    </button>
  );
};

export default BackButton;
