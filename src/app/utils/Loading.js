import React from "react";
import "./loading.css";
const Loading = () => {
  return (
    <div className='typing-indicator'>
      <div className='typing-circle'></div>
      <div className='typing-circle'></div>
      <div className='typing-circle'></div>
      <div className='typing-shadow'></div>
      <div className='typing-shadow'></div>
      <div className='typing-shadow'></div>
    </div>
  );
};

export default Loading;
