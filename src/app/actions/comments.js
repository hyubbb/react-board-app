import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchComment = createAsyncThunk(
  "comments/fetchComment",
  async (postId) => {
    console.log("fetch");
    try {
      const response = await axios.get(
        `http://localhost:3002/comments/fetch/${postId}`
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
        `http://localhost:3002/comments/create`,
        postData
      );
      console.log(response.data);
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
        `http://localhost:3002/comments/update/${commentId}`,
        {
          commentText,
        }
      );
      console.log(response);
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
      await axios.delete(`http://localhost:3002/comments/delete/${commentId}`);

      return commentId;
    } catch (error) {
      throw error;
    }
  }
);
