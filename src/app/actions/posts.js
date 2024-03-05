import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const LOCALHOST = "localhost";
export const fetchPostsPage = createAsyncThunk(
  "posts/fetchPostsPage",
  async ({ page, limit }) => {
    console.log(page, limit);
    try {
      const response = await axios.get(
        `http://${LOCALHOST}:3002/posts/fetch/${page}/${limit}`
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
      const resPost = await axios.get(
        `http://${LOCALHOST}:3002/posts/${postId}/views`
      );
      return resPost.data;
    } catch (error) {
      throw error;
    }
  }
);

export const addPost = createAsyncThunk("post/addPost", async (post) => {
  try {
    // 서버로 게시글 추가 요청을 보내고 새로운 게시글 데이터를 반환하는 로직
    const response = await axios.post(
      `http://${LOCALHOST}:3002/post/create`,
      post
    );
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId) => {
    console.log(postId);
    try {
      await axios.delete(`http://${LOCALHOST}:3002/post/delete/${postId}`);
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
      await axios.patch(`http://${LOCALHOST}:3002/posts/${id}`, postData);
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
        `http://${LOCALHOST}:3100/upload`,
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
  delete: async (imageUrl: string) => {
    try {
      axios.post(`http://${LOCALHOST}:3100/deleteImage`, {
        imageUrl,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  },
};
