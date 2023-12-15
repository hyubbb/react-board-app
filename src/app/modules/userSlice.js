import { createSlice, current } from "@reduxjs/toolkit";

import { fetchLogin } from "../actions/logins";

const initialState = {
  user: {},
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  initialState,
  name: "users",
  reducers: {
    create: (state, action) => {
      console.log(action.payload);
    },
  },
  // 비동기또는 다른슬라이스에서 발생하는 액션을 처리하기 위한 부가적인 리듀서,
  extraReducers: (builder) => {
    builder.addCase(fetchLogin.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export default userSlice.reducer;

export const selectUser = (state) => state.users.user;
