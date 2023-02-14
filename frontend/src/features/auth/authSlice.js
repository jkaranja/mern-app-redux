import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axiosPrivate from "../../api/axiosPrivate";

//login
export const login = createAsyncThunk(
  "auth/login",
  async (inputs, thunkAPI) => {
    try {
      const {
        data: { accessToken },
      } = await axiosPrivate({ cookie: true }).post("/api/auth/login", inputs);

      return accessToken;
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

//verify/confirm email
export const confirmEmail = createAsyncThunk(
  "user/verify",
  async (emailToken, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const { data: response } = await axiosPrivate({}).post(
        `/api/auth/verify/${emailToken}`
      );

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

//refresh
// export const refreshToken = createAsyncThunk(
//   "auth/refresh",
//   async (_, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().auth.token;
//       const { data: accessToken } = await axiosPrivate(token, false, true).get(
//         "/api/auth/refresh"
//       );

//       return accessToken;
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

//forgot pwd
export const forgotPwd = createAsyncThunk(
  "auth/forgot",
  async (inputs, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const { data: response } = await axiosPrivate({}).post(
        "/api/auth/forgot",
        inputs
      );

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

//reset password
export const resetPwd = createAsyncThunk(
  "auth/reset",
  async ({ password, resetPwdToken }, thunkAPI) => {
    try {
      const { data: response } = await axiosPrivate({}).post(
        `/api/auth/reset/${resetPwdToken}`,
        {
          password,
        }
      );

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

//logout
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const { data: response } = await axiosPrivate({ cookie: true }).post(
      "/api/auth/logout"
    );

    localStorage.removeItem("persist");

    return response.message;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

//slice
const initialState = {
  token: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    reset: (state) => ({ ...initialState, token: state.token }),
    setCredentials: (state, action) => void (state.token = action.payload),
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //verify/confirm email
      .addCase(confirmEmail.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(confirmEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(confirmEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // //refresh
      // .addCase(refreshToken.pending, (state) => {
      //   state.isLoadingR = true;
      //state.isSuccess = false;
      //state.isError = false;
      // })
      // .addCase(refreshToken.fulfilled, (state, action) => {
      //   state.isLoadingR = false;
      //   state.isSuccessR = true;
      //   state.token = action.payload;
      // })
      // .addCase(refreshToken.rejected, (state, action) => {
      //   state.isLoadingR = false;
      //   state.isErrorR = true;
      //   state.message = action.payload;
      // })
      //forgot
      .addCase(forgotPwd.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(forgotPwd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(forgotPwd.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //reset
      .addCase(resetPwd.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(resetPwd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(resetPwd.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, setCredentials } = authSlice.actions;

export const selectCurrentToken = (state) => state.auth;

export default authSlice.reducer;
