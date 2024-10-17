import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../(services)/api/api";

const loadUserfromStorage = async () => {
  try {
    const userInfo = await AsyncStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    return null;
  }
};

const initialState = {
  user: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUserAction: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      AsyncStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logoutUserAction: (state, action) => {
      state.user = "null";
      state.isLoading = false;
      AsyncStorage.removeItem("userInfo");
    },
    setUserAction: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
  },
});

export const { loginUserAction, logoutUserAction, setUserAction } =
  authSlice.actions;

//Reducer
export const authReducer = authSlice.reducer;

//load user
export const loadUser = () => async (dispatch) => {
  const userInfo = await loadUserfromStorage();
  if (userInfo) {
    dispatch(setUserAction(userInfo));
  }
};
