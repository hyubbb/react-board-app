import React from "react";
import { useDispatch } from "react-redux";
import { deletePost } from "../../actions/posts";
import { useNavigate } from "react-router-dom";

const PageDelete = ({ postId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onDelete = () => {
    dispatch(deletePost(postId)).then(() => {
      navigate("/");
    });
  };
  return (
    <>
      <button
        className='border-2 border-solid border-black rounded w-24'
        onClick={onDelete}
      >
        delete
      </button>
    </>
  );
};

export default PageDelete;
