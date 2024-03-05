import React from "react";
import { useForm } from "react-hook-form";
import "./form.styles.css";
import googleLogo from "../../../../../assets/google.svg";
import { Link } from "react-router-dom";
// import { signInWithPopup } from "firebase/auth";
const Form = ({ handleAuth, handleGoogleAuth, type }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "blur" });

  const validateEmail = {
    required: "필수 입력사항입니다.",
    pattern: {
      // 앞에는 영어소문자 ._%+- 만 허용, @ 뒤에는 영어소문자 .- 만 허용
      value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
      message: "이메일 형식에 맞게 입력해주세요.",
    },
  };

  const validatePass = {
    required: "필수 입력사항입니다.",
    pattern: {
      value: /(?=.*\d)(?=.*[a-z]).{8,}/,
      message: "비밀번호는 8자 이상, 숫자와 영문자를 모두 포함해야 합니다.",
    },
  };

  const validatePassConfirm = {
    validate: (value) =>
      value === watch("password") || "비밀번호가 일치하지 않습니다.",
  };

  const onSubmit = ({ email, password }) => {
    handleAuth(email, password);
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form className='loginForm' onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input
          type='text'
          {...register("email", validateEmail)}
          placeholder='email'
        />
        <div className='error-message'>
          {<span>{errors?.email?.message}</span>}
        </div>
      </div>
      <div>
        <label>Password</label>
        <input
          type='password'
          {...register("password", validatePass)}
          placeholder='password'
        />
        <div className='error-message'>
          {<span>{errors?.password?.message}</span>}
        </div>
      </div>
      {type === "login" ? (
        <>
          <div className='forgot-text'>
            <Link to={"/register"}>회원이 아니신가요?</Link>
          </div>
          <div>
            <button>Log In</button>
            <div className='bottom-divider'>or</div>
            <button
              className='googleBtn'
              onClick={handleGoogleAuth}
              type='button'
            >
              <object
                type='image/svg+xml'
                data={googleLogo} // Use the imported google.svg file
                aria-label='Google Logo'
              ></object>
              <span>Sign in with google</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <label>Password Confirm</label>
            <input
              type='password'
              {...register("password2", validatePassConfirm)}
              placeholder='password'
            />
            <div className='error-message'>
              {<span>{errors?.password2?.message}</span>}
            </div>
          </div>
          <div>
            <button>회원가입 하기</button>
          </div>
          <div className='hasAccount'>
            <span>이미 계정이 있으신가요?</span>
            <Link to={"/login"}>로그인</Link>
          </div>
        </>
      )}
    </form>
  );
};

export default Form;
