import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const LOCALHOST = process.env.REACT_APP_HOST;

export const fetchComment = createAsyncThunk(
  "comments/fetchComment",
  async (postId) => {
    try {
      const response = await axios.get(
        `http://${LOCALHOST}:${process.env.REACT_APP_PORT}/comments/fetch/${postId}`
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
        `http://${LOCALHOST}:${process.env.REACT_APP_PORT}/comments/create`,
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
        `http://${LOCALHOST}:${process.env.REACT_APP_PORT}/comments/update/${commentId}`,
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
        `http://${LOCALHOST}:${process.env.REACT_APP_PORT}/comments/delete/${commentId}`
      );

      return commentId;
    } catch (error) {
      throw error;
    }
  }
);
