import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : { email: "", id: "" };

const userSlice = createSlice({
  initialState,
  name: "user",
  reducers: {
    setUser: (state, action) => {
      console.log(action.payload);
      state.email = action.payload.email;
      state.name = action.payload.displayName;
      state.id = action.payload.uid;
      state.photo = action.payload.photoURL;
    },
    removeUser: (state) => {
      state.email = "";
      state.id = "";
      state.photo = "";
      state.name = "";

      localStorage.removeItem("user");
    },
  },
});

export default userSlice.reducer;
export const { setUser, removeUser } = userSlice.actions;
export const selectUser = (state) => state.users;
