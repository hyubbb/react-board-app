import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageNum } from "../../modules/boardSlice";

const Navbar = () => {
  const dispatch = useDispatch(); // getState

  return (
    <>
      <div className=' bg-slate-300 px-5 py-5'>
        <div>
          <Link
            to='/'
            className='w-[100px] h-[100px] flex justify-center items-center border-2 rounded-full '
            onClick={() => dispatch(setPageNum(0))}
          >
            <div>Home</div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
