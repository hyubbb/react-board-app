import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// const LOCALHOST = "localhost";
const LOCALHOST = "18.116.200.216";
export const fetchComment = createAsyncThunk(
  "comments/fetchComment",
  async (postId) => {
    console.log("fetch");
    try {
      const response = await axios.get(
        `http://${LOCALHOST}:3002/comments/fetch/${postId}`
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
        `http://${LOCALHOST}:3002/comments/create`,
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
        `http://${LOCALHOST}:3002/comments/update/${commentId}`,
        {
          commentText,
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
      await axios.delete(
        `http://${LOCALHOST}:3002/comments/delete/${commentId}`
      );

      return commentId;
    } catch (error) {
      throw error;
    }
  }
);
