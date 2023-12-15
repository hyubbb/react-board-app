import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchComment = createAsyncThunk(
  "comments/fetchComment",
  async (postId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/posts/${postId}/comments?_sort=id&_order=desc`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (postData) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/comments`,
        postData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async (commentData) => {
    try {
      const { editingId: commentId, editingText: commentText } = commentData;
      const response = await axios.patch(
        `http://localhost:3001/comments/${commentId}`,
        {
          text: commentText,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId) => {
    try {
      await axios.delete(`http://localhost:3001/comments/${commentId}`);
      return commentId;
    } catch (error) {
      throw error;
    }
  }
);
