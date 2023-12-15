import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { selectComments } from "../../modules/boardSlice";
import {
  deleteComment,
  fetchComment,
  updateComment,
} from "../../actions/comments";
import { useParams } from "react-router-dom";
import CommentCreate from "./CommentCreate";
import CommentItem from "./CommentItem";
import CommentEdit from "./CommentEdit";

const CommentList = () => {
  const dispatch = useDispatch();
  const postId = +useParams().id;
  const postComments = useSelector(selectComments, shallowEqual) || [];
  const [editingId, setEditingId] = useState("");

  const editRef = useRef();
  useEffect(() => {
    dispatch(fetchComment(postId));
  }, [dispatch]);

  const startEdit = (id) => {
    setEditingId(id);
  };

  const onDelete = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  const onSubmit = (editingText, prevText) => {
    if (editingText !== prevText) {
      dispatch(updateComment({ editingId, editingText }));
    }
    setEditingId(0);
  };
  return (
    <>
      <CommentCreate postComments={postComments} onDelete={onDelete} />
      <div className='mt-12'>
        {postComments.map((post) => {
          return editingId === post.id ? (
            <CommentEdit
              post={post}
              onSubmit={onSubmit}
              inputRef={editRef}
              key={post.id}
            />
          ) : (
            <CommentItem
              onDelete={onDelete}
              post={post}
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
