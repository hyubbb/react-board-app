import React from "react";
import { selectUser } from "../../modules/userSlice";
import { useSelector } from "react-redux";
const CommentItem = ({ onDelete, post, startEdit }) => {
  const users = useSelector(selectUser);
  return (
    <>
      <div
        className='flex border-b-2 h-[50px] p-3 mt-[20px] items-center group'
        key={post.id}
      >
        <div className='flex-1'>{post.text}</div>
        {post.userId === users.id ? (
          <div className='flex basis-[200px] justify-end mr-3'>
            <div
              className='hidden border-2 text-center rounded-full basis-[50px] group-hover:block'
              onClick={() => startEdit(post.id)}
            >
              edit
            </div>
            <div
              className='hidden   border-2 text-center rounded-full basis-[50px] ml-2 group-hover:block'
              onClick={() => onDelete(post.id)}
            >
              X
            </div>
          </div>
        ) : (
          ""
        )}
        <div className=''>{post.createdAt}</div>
      </div>
    </>
  );
};

export default CommentItem;
