import React, { useState } from "react";
import Form from "../Form/Form";
import app from "../../../../../firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);

  const [firebaseError, setFirebaseError] = useState("");

  const handleSignup = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/login");
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
              <span>회원가입</span>
            </div>
          </div>
          <Form handleAuth={handleSignup} type={"register"} />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
