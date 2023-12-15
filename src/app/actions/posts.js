import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const response = await axios.get(
      "http://localhost:3001/posts?_sort=id&_order=desc"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const fetchPostOne = createAsyncThunk(
  "posts/fetchPostOne",
  async (postId) => {
    try {
      const response = await axios.get(`http://localhost:3001/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchPostsPage = createAsyncThunk(
  "posts/fetchPostsPage",
  async (page, limitNum) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/posts?_sort=id&_order=desc&_page=${page}&_limit=${limitNum}`
      );
      const totalCount = response.headers["x-total-count"];
      return { response, totalCount };
    } catch (error) {
      throw error;
    }
  }
);

export const fetchPostAndIncreaseViews = createAsyncThunk(
  "posts/fetchPostAndIncreaseViews",
  async (pageId) => {
    try {
      const response = await axios.get(`http://localhost:3001/posts/${pageId}`);
      let post = response.data;
      if (post) {
        const resView = await axios.patch(
          `http://localhost:3001/posts/${pageId}`,
          { views: (post.views || 0) + 1 }
        );
        return resView.data;
      }
      return post;
    } catch (error) {
      throw error;
    }
  }
);

export const addPost = createAsyncThunk("posts/addPost", async (post) => {
  try {
    // 서버로 게시글 추가 요청을 보내고 새로운 게시글 데이터를 반환하는 로직
    const response = await axios.post("http://localhost:3001/posts", post);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId) => {
    try {
      await axios.delete(`http://localhost:3001/posts/${postId}`);
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
      const { postId } = postData;
      await axios.put(`http://localhost:3001/posts/${postId}`, postData);
      return postData;
    } catch (error) {
      throw error;
    }
  }
);
