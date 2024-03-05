import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageNum } from "../../modules/boardSlice.js";
import { getAuth, signOut } from "firebase/auth";
import app from "../../../firebase.js";
import { useAuth } from "../../hooks/useAuth.js";
import storage from "../../utils/storage.js";
import { persistor } from "../../modules/store.js";

import "./Navbar.css";
import uPhoto from "../../../assets/photo.png";

const Navbar = () => {
  const dispatch = useDispatch(); // getState
  const auth = getAuth(app);
  const { isAuth, photo } = useAuth();

  const isPhoto = photo ? photo : uPhoto;

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        persistor.purge();
        storage.remove("user");
        window.location.reload();
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <nav className=' bg-slate-300 px-5 flex justify-between items-center'>
        <div>
          <Link
            to='/'
            // className='w-[100px] h-[100px] flex justify-center items-center border-2 rounded-full '
            className='w-[100px] h-[100px] flex justify-center items-center　'
            onClick={() => dispatch(setPageNum(0))}
          >
            {/* <div>board</div> */}
            <div className='loader'>
              <div className='loader__bar'></div>
              <div className='loader__bar'></div>
              <div className='loader__bar'></div>
              <div className='loader__bar'></div>
              <div className='loader__bar'></div>
              <div className='loader__ball'></div>
            </div>
          </Link>
        </div>

        {isAuth ? (
          <>
            <div className='flex relative group'>
              <img
                src={isPhoto}
                alt='userPhoto'
                className='w-[80px] h-[80px] rounded-full group'
              />
              {/* <FiLogOut className='none' title='logout' /> */}
              {/* <div className='absolute w-[100px] hidden bottom-[-20px] right-[0px] group-hover:block border-2 bg-black text-white text-center'> */}

              <div
                onClick={handleLogOut}
                className='w-[80px] h-[80px] hidden rounded-full absolute bg-slate-500 group-hover:flex justify-center items-center cursor-pointer'
              >
                <span>Sign Out</span>
              </div>
            </div>
          </>
        ) : (
          <Link to={"/login"}>
            <div className=' w-[auto] h-[100px] items-center justify-center flex cursor-pointer'>
              <div className='mx-10'>Login</div>
            </div>
          </Link>
        )}
      </nav>
    </>
  );
};

export default Navbar;
