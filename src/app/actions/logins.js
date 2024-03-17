import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
const LOCALHOST = process.env.REACT_APP_HOST;

export const fetchLogin = createAsyncThunk(
  "users/fetchLogin",
  async (userId) => {
    const response = await axios.get(
      `http://${LOCALHOST}:${process.env.REACT_APP_PORT}/users/${userId}`
    );
    return response.data;
  }
);
