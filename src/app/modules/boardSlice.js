import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPostView,
  fetchPostsPage,
  addPost,
  updatePost,
  deletePost,
} from "../actions/posts.js";

import {
  addComment,
  deleteComment,
  fetchComment,
  updateComment,
} from "../actions/comments.js";

const initialState = {
  posts: { data: [], totalCount: 0, pageNum: 0 },
  postView: {},
  pageNum: 0,
  comments: [],
  status: "idle",
  error: null,
};

const handlePending = (state) => {
  state.status = "loading";
};

const handleRejected = (state, action) => {
  state.status = "failed";
  state.error = action.error.message;
};

const handleFulfilled = (actionType) => (state, action) => {
  switch (actionType) {
    case "fetchPostsPage":
      const { posts: data, totalCount, currentPage } = action.payload;
      const newFetchPostsPage = {
        data: data,
        totalCount: totalCount,
        pageNum: currentPage - 1,
      };
      state.status = "succeeded";
      state.posts = newFetchPostsPage;
      // state.pageNum = currentPage - 1;
      break;
    case "fetchPostView":
      state.status = "succeeded";
      state.postView = action.payload;
      break;
    case "addPost":
      state.status = "succeeded";
      state.posts.data.push(action.payload);
      break;
    case "deletePost":
      const postId = action.payload;
      console.log(postId);
      state.status = "succeeded";
      state.posts = state.posts.data.filter((post) => post.id !== postId);
      break;
    case "updatePost":
      const newPost = action.payload;
      const postIndex = state.posts.data.findIndex((post) => {
        return post.id === newPost.postId;
      });
      if (postIndex !== -1) {
        state.posts[postIndex] = { ...newPost };
      }
      break;
    case "fetchComment":
      state.status = "succeeded";
      state.comments = action.payload;
      break;
    case "addComment":
      state.status = "succeeded";
      state.comments.unshift(action.payload);
      break;
    case "updateComment":
      const { id, text } = action.payload;
      const newComment = state.comments.map((comment) =>
        comment.id === +id ? { ...comment, text } : comment
      );
      state.comments = newComment;
      break;
    case "deleteComment":
      const deleteCommentId = action.payload;
      state.status = "succeeded";
      state.comments = state.comments.filter(
        (comment) => comment.id !== deleteCommentId
      );
      break;
    default:
      break;
  }
};

const boardSlice = createSlice({
  initialState,
  name: "boards",
  reducers: {
    setPageNum: (state, action) => {
      const num = action.payload ? action.payload : 0;
      state.posts.pageNum = num;
    },
    postViewRemove: (state, _) => {
      state.postView = [];
    },
    commentRemove: (state, _) => {
      state.comments = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsPage.pending, handlePending)
      .addCase(fetchPostsPage.fulfilled, handleFulfilled("fetchPostsPage"))
      .addCase(fetchPostsPage.rejected, handleRejected)
      .addCase(fetchPostView.pending, handlePending)
      .addCase(fetchPostView.fulfilled, handleFulfilled("fetchPostView"))
      .addCase(fetchPostView.rejected, handleRejected)
      .addCase(addPost.pending, handlePending)
      .addCase(addPost.fulfilled, handleFulfilled("addPost"))
      .addCase(addPost.rejected, handleRejected)
      .addCase(deletePost.pending, handlePending)
      .addCase(deletePost.fulfilled, handleFulfilled("deletePost"))
      .addCase(deletePost.rejected, handleRejected)
      .addCase(updatePost.pending, handlePending)
      .addCase(updatePost.fulfilled, handleFulfilled("updatePost"))
      .addCase(updatePost.rejected, handleRejected)
      .addCase(addComment.pending, handlePending)
      .addCase(addComment.fulfilled, handleFulfilled("addComment"))
      .addCase(addComment.rejected, handleRejected)
      .addCase(fetchComment.pending, handlePending)
      .addCase(fetchComment.fulfilled, handleFulfilled("fetchComment"))
      .addCase(fetchComment.rejected, handleRejected)
      .addCase(updateComment.pending, handlePending)
      .addCase(updateComment.fulfilled, handleFulfilled("updateComment"))
      .addCase(updateComment.rejected, handleRejected)
      .addCase(deleteComment.pending, handlePending)
      .addCase(deleteComment.fulfilled, handleFulfilled("deleteComment"))
      .addCase(deleteComment.rejected, handleRejected);
  },
});

export default boardSlice.reducer;
export const { setPageNum, postViewRemove, commentRemove } = boardSlice.actions;
export const getPageNum = (state) => state.boards.pageNum;
export const selectPosts = (state) => state.boards.posts;
export const selectedPost = (state) => state.boards.postView;
export const selectComments = (state) => state.boards.comments;
