import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosPrivate from "../../api/axiosPrivate";

//register
export const registerUser = createAsyncThunk(
  "user/register",
  async (inputs, thunkAPI) => {
    try {
      const { data: response } = await axiosPrivate({
        cookie: true,
      }).post("/api/users/register", inputs);

      return response.message;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//resend
export const resendEmail = createAsyncThunk(
  "user/resend",
  async (inputs, thunkAPI) => {
    try {
      const { data: response } = await axiosPrivate({
        cookie: true,
      }).post("/api/users/resend/email");

      return response.message;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user info
export const getUser = createAsyncThunk(
  "notes/getUser",
  async (id, thunkAPI) => {
    try {
      const dispatch = thunkAPI.dispatch;
      const token = thunkAPI.getState().auth.token;
      const { data } = await axiosPrivate({ token, dispatch }).get(
        "/api/users"
      );

      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//update profile
export const updateUser = createAsyncThunk(
  "user/update",
  async ({ userData, id }, thunkAPI) => {
    try {
      const dispatch = thunkAPI.dispatch;
      const token = thunkAPI.getState().auth.token;
      const { data: updatedUser } = await axiosPrivate({
        token,
        dispatch,
        contentType: "multipart/form-data",
      }).patch(`/api/users/${id}`, userData);

      return updatedUser;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//delete a/c
export const deleteAccount = createAsyncThunk(
  "user/delete",
  async (id, thunkAPI) => {
    try {
      const dispatch = thunkAPI.dispatch;
      const token = thunkAPI.getState().auth.token;
      const { data: response } = await axiosPrivate({
        token,
        dispatch,
        cookie: true,
      }).delete(`/api/users/${id}`);

      return response.message;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//slice

const initialState = {
  user: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //resend email
      .addCase(resendEmail.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(resendEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(resendEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //get user
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //update
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "Updated!";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //delete a/c
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
