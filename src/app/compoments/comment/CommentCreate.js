import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import DateFormat from "../../hooks/date";
import { useDispatch } from "react-redux";
import { addComment } from "../../actions/comments";

const CommentCreate = () => {
  const postId = +useParams().id;
  const [comment, setComment] = useState("");
  const ref = useRef("");
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const addSubmit = (e) => {
    e.preventDefault();

    if (comment !== "") {
      const commentData = {
        text: comment,
        postId,
        createdAt: DateFormat(),
        userId: 1,
      };
      dispatch(addComment(commentData));
      setComment("");
      ref.current.focus();
    } else {
      // 값을 입력하세요
    }
  };

  return (
    <div className='flex mt-10 flex-col'>
      <div className='flex-1'>
        <div className='col-span-full'>
          <label
            htmlFor='body'
            className='block text-sm font-medium leading-6 text-gray-900'
          >
            reply
          </label>
          <div className='mt-2'>
            <textarea
              ref={ref}
              name='body'
              id='body'
              value={comment}
              onChange={handleChange}
              placeholder='body'
              rows='3'
              className='block w-full rounded-md border-0 p-1.5 mb-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600'
            ></textarea>
            <p className='mt-3 text-sm leading-6 text-gray-600'>댓글</p>
          </div>
        </div>
      </div>
      <button
        className='border-2 border-solid border-black rounded w-24 basis-[30px] ml-auto'
        onClick={addSubmit}
      >
        post
      </button>
    </div>
  );
};

export default CommentCreate;
