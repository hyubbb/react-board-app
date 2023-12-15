import axios from "axios";
// import { create as boardCreate } from "../modules/boardSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchLogin = createAsyncThunk(
  "users/fetchLogin",
  async (userId) => {
    const response = await axios.get(`http://localhost:3001/users/${userId}`);
    return response.data;
  }
);
