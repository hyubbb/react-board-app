import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const LOCALHOST = process.env.REACT_APP_HOST;

export const fetchPostsPage = createAsyncThunk(
  "posts/fetchPostsPage",
  async ({ page, limit }) => {
    try {
      const response = await axios.get(
        `http://${LOCALHOST}:${process.env.REACT_APP_PORT}/posts/fetch/${page}/${limit}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchPostView = createAsyncThunk(
  "posts/fetchPostView",
  async (postId) => {
    try {
      const response = await axios.get(
        `http://${LOCALHOST}:${process.env.REACT_APP_PORT}/posts/${postId}/views`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const addPost = createAsyncThunk("post/addPost", async (post) => {
  try {
    const response = await axios.post(
      `http://${LOCALHOST}:${process.env.REACT_APP_PORT}/post/create`,
      post
    );
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId) => {
    try {
      await axios.delete(
        `http://${LOCALHOST}:${process.env.REACT_APP_PORT}/post/delete/${postId}`
      );
      return postId;
    } catch (error) {
      throw error;
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (postData) => {
    try {
      const { id } = postData;
      await axios.patch(
        `http://${LOCALHOST}:${process.env.REACT_APP_PORT}/posts/${id}`,
        postData
      );
      return postData;
    } catch (error) {
      throw error;
    }
  }
);

export const imageToServer = {
  create: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(
        `http://${LOCALHOST}:${process.env.REACT_APP_PORT}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { data } = response;
      return data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  },
  delete: async (imageUrl) => {
    try {
      axios.post(
        `http://${LOCALHOST}:${process.env.REACT_APP_PORT}/deleteImage`,
        {
          imageUrl,
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  },
};
