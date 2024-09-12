import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import sideBarReducer from "./reducers/sideBarReducer";
import appDataReducer from "./reducers/appDataReducer";

const reducers = combineReducers({
  auth: authReducer,
  sideBarStateChange: sideBarReducer,
  app:appDataReducer
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({ reducer: persistedReducer });

export default store;