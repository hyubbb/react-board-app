import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { selectComments } from "../../modules/boardSlice.js";
import {
  deleteComment,
  fetchComment,
  updateComment,
} from "../../actions/comments.js";
import { useParams } from "react-router-dom";
import CommentCreate from "./CommentCreate.js";
import CommentItem from "./CommentItem.js";
import CommentEdit from "./CommentEdit.js";

const CommentList = () => {
  const dispatch = useDispatch();
  const postId = +useParams().id;
  const postComments = useSelector(selectComments, shallowEqual) || [];
  const [editingId, setEditingId] = useState(0);
  const editRef = useRef();
  useEffect(() => {
    dispatch(fetchComment(postId));
  }, [dispatch, postId]);

  const startEdit = (id) => {
    return setEditingId(id);
  };

  const onDelete = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  const onSubmit = (editingText, prevText, post) => {
    if (editingText !== prevText) {
      dispatch(updateComment({ editingId, editingText }));
    }
    setEditingId(0);
  };
  return (
    <>
      <CommentCreate />
      <div className='mt-12'>
        {postComments.map((post) => {
          return editingId === post.id ? (
            <CommentEdit
              comment={post}
              onSubmit={onSubmit}
              inputRef={editRef}
              key={post.id}
            />
          ) : (
            <CommentItem
              onDelete={onDelete}
              comment={post}
              startEdit={startEdit}
              key={post.id}
            />
          );
        })}
      </div>
    </>
  );
};

export default CommentList;
