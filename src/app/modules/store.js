import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./boardSlice";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import userReducer from "./userSlice";

const userPersistConfig = {
  key: "users",
  storage,
};

const postPersistConfig = {
  key: "posts",
  storage,
};

const persistedPostReducer = persistReducer(postPersistConfig, boardReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    boards: persistedPostReducer, // persisted
    users: persistedUserReducer, // persisted
  },
  middleware: [thunk],
});

export const persistor = persistStore(store);
