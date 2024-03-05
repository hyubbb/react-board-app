import React, { useEffect, useState } from "react";

const CommentEdit = ({ comment, onSubmit, inputRef }) => {
  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);
  console.log(comment);

  const [editingText, setEditingText] = useState(comment.text);

  const handleSubmit = () => {
    onSubmit(editingText, comment.text, comment);
  };

  const onEdit = (e) => {
    setEditingText(e.target.value);
  };

  return (
    <div>
      <div
        className='flex border-b-2 h-[50px] p-3 mt-[20px] items-center group'
        key={comment.id}
      >
        <input
          type='text'
          className='flex-1 border-4 px-1'
          value={editingText}
          id='commentText'
          onChange={onEdit}
          ref={inputRef}
        />

        <div className='flex basis-[120px] justify-end mr-3'>
          <button
            className='hidden border-2 text-center rounded-full basis-[50px] group-hover:block'
            onClick={handleSubmit}
          >
            O
          </button>
          <div
            className='hidden   border-2 text-center rounded-full basis-[50px] ml-2 group-hover:block'
            onClick={handleSubmit}
          >
            X
          </div>
        </div>
        <div className=''>{comment?.createdAt?.slice(0, 10)}</div>
      </div>
    </div>
  );
};
export default CommentEdit;
