import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const LOCALHOST = process.env.REACT_APP_HOST;

export const fetchPostsPage = createAsyncThunk(
  "posts/fetchPostsPage",
  async ({ page, limit }) => {
    try {
      const response = await axios.get(`/posts/fetch/${page}/${limit}`);
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
      const response = await axios.get(`/posts/${postId}/views`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const addPost = createAsyncThunk("posts/addPost", async (post) => {
  try {
    console.log(post);
    const response = await axios.post(`/posts/create`, post);
    console.log("response : ", response);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId) => {
    try {
      await axios.delete(`/posts/delete/${postId}`);
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
      await axios.patch(`/posts/${id}`, postData);
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
      const response = await axios.post(`/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { data } = response;
      return data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  },
  delete: async (imageUrl) => {
    try {
      axios.post(`/deleteImage`, {
        imageUrl,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  },
};
