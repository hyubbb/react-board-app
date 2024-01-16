import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPostsPage = createAsyncThunk(
  "posts/fetchPostsPage",
  async ({ page, limit }) => {
    try {
      const response = await axios.get(
        `http://localhost:3002/posts/fetch/${page}/${limit}`
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
    let resPost;
    try {
      const response = await axios.get(
        `http://localhost:3002/posts/fetch/${postId}`
      );
      let post = response.data;
      if (post) {
        resPost = await axios.patch(
          `http://localhost:3002/posts/${postId}/views`
        );
      }
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
      "http://localhost:3002/post/create",
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
    console.log(postId);
    try {
      await axios.delete(`http://localhost:3002/post/delete/${postId}`);
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
      await axios.put(`http://localhost:3001/posts/${id}`, postData);
      return postData;
    } catch (error) {
      throw error;
    }
  }
);
