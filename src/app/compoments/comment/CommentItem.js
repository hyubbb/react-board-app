import React from "react";
import { selectUser } from "../../modules/userSlice.js";
import { useSelector } from "react-redux";
const CommentItem = ({ onDelete, comment, startEdit }) => {
  const users = useSelector(selectUser);
  return (
    <>
      <div
        className='flex border-b-2 h-[50px] p-3 mt-[20px] items-center group'
        key={comment.id}
      >
        <div className='flex-1'>{comment.text}</div>
        {comment.userId === users.id ? (
          <div className='flex basis-[200px] justify-end mr-3'>
            <div
              className='hidden border-2 text-center rounded-full basis-[50px] group-hover:block'
              onClick={() => startEdit(comment.id)}
            >
              edit
            </div>
            <div
              className='hidden   border-2 text-center rounded-full basis-[50px] ml-2 group-hover:block'
              onClick={() => onDelete(comment.id)}
            >
              X
            </div>
          </div>
        ) : (
          ""
        )}
        <div>{comment?.createdAt?.slice(0, 10)}</div>
      </div>
    </>
  );
};

export default CommentItem;
