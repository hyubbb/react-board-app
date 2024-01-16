import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageNum } from "../../modules/boardSlice.js";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import app from "../../../firebase.js";
import { useAuth } from "../../hooks/useAuth.js";
import { FiLogIn, FiLogOut } from "react-icons/fi/index.esm.js";
import { setUser } from "../../modules/userSlice.js";
import storage from "../../utils/storage.js";
import { persistor } from "../../modules/store.js";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch(); // getState
  const auth = getAuth(app);
  const { isAuth, photo } = useAuth();
  const navigate = useNavigate();
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

  const provider = new GoogleAuthProvider();

  const handleAuth = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        dispatch(setUser(result.user));
        // storage.set("userData", result.user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <>
      <nav className=' bg-slate-300 px-5 py-5 flex justify-between items-center'>
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
          <div className='relative hover:cursor-pointer group '>
            <img
              src={photo}
              alt=''
              className='w-[80px] h-[80px] flex justify-center items-center rounded-full '
            />
            {/* <FiLogOut className='none' title='logout' /> */}
            <div className='absolute w-[100px] hidden bottom-[-20px] right-[0px] group-hover:block border-2 bg-black text-white text-center'>
              <span onClick={handleLogOut}>Sign Out</span>
            </div>
          </div>
        ) : (
          <div
            onClick={handleAuth}
            className=' w-[100px] h-[100px] items-center justify-center flex'
          >
            <div>
              {/* login */}
              {/* <FiLogIn title='login' /> */}
              Login
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
