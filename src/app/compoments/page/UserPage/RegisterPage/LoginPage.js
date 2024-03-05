import React, { useState } from "react";
import Form from "../Form/Form";
import { useNavigate } from "react-router-dom";
import app from "../../../../../firebase";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { setUser } from "../../../../modules/userSlice";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [firebaseError, setFirebaseError] = useState("");
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleGoogleAuth = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        dispatch(setUser(result.user));
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const handleLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        dispatch(
          setUser({
            email: userCredential.user.email,
            id: userCredential.user.email,
            token: userCredential.user.refreshToken,
          })
        );
        navigate("/");
      })
      .catch((error) => {
        return (
          error &&
          setFirebaseError(
            "이메일 또는 비밀번호가 잘못 되었습니다.",
            error.message
          )
        );
      });
  };
  return (
    <>
      <div className={`flex justify-center py-[5%]`}>
        <div className={`w-[400px]`}>
          <div className={`login-title my-10 flex text-left`}>
            <div className={`text-[1.5rem]`}>
              <span>Welcome Back !</span>
            </div>
          </div>
          <Form
            handleAuth={handleLogin}
            handleGoogleAuth={handleGoogleAuth}
            type={"login"}
          />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
