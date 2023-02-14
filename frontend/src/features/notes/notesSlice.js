import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosPrivate from "../../api/axiosPrivate";

// Create new note
export const createNote = createAsyncThunk(
  "notes/create",
  async ({ noteData, uploadProgress }, thunkAPI) => {
    try {
      const dispatch = thunkAPI.dispatch;

      const token = thunkAPI.getState().auth.token;

      const { data: response } = await axiosPrivate({
        token,
        dispatch,
        contentType: "multipart/form-data",
      }).post(`/api/notes`, noteData, {
        ...uploadProgress,
      });

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

// Get notes
export const getNotes = createAsyncThunk(
  "notes/getAll",
  async (
    { currentPage, itemsPerPage, fromDate, toDate, debouncedSearchTerm },
    thunkAPI
  ) => {
    try {
      const dispatch = thunkAPI.dispatch;

      const token = thunkAPI.getState().auth.token;

      const { data: notesInfo } = await axiosPrivate({ token, dispatch }).get(
        `/api/notes?page=${currentPage}&size=${itemsPerPage}&fromDate=${fromDate}&toDate=${toDate}&search=${debouncedSearchTerm}`
      );

      return notesInfo;
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

// Get single note
export const getNote = createAsyncThunk(
  "notes/getOne",
  async (id, thunkAPI) => {
    try {
      const dispatch = thunkAPI.dispatch;
      const token = thunkAPI.getState().auth.token;

      const { data: note } = await axiosPrivate({ token, dispatch }).get(
        `/api/notes/${id}`
      );

      return note;
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

// update note
export const updateNote = createAsyncThunk(
  "notes/update",
  async ({ noteData, id, uploadProgress }, thunkAPI) => {
    try {
      const dispatch = thunkAPI.dispatch;

      const token = thunkAPI.getState().auth.token;
      const { data: updatedNote } = await axiosPrivate({
        token,
        dispatch,
        contentType: "multipart/form-data",
      }).patch(`/api/notes/${id}`, noteData, {
        ...uploadProgress,
      });

      return updatedNote;
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

// Delete note
export const deleteNote = createAsyncThunk(
  "notes/delete",
  async (id, thunkAPI) => {
    try {
      const dispatch = thunkAPI.dispatch;

      const token = thunkAPI.getState().auth.token;
      const { data: response } = await axiosPrivate({ token, dispatch }).delete(
        `/api/notes/${id}`
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

//slice
const initialState = {
  notes: {
    page: 0,
    pages: 0,
    count: 0,
    noteList: [],
    note: {},
  },
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNote.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //get all notes
      .addCase(getNotes.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes = action.payload;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.notes = {
          page: 0,
          pages: 0,
          count: 0,
          noteList: [],
          note: {},
        };
      })
      //get one
      .addCase(getNote.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes.note = action.payload;
      })
      .addCase(getNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //update note
      .addCase(updateNote.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes.note = action.payload;
        state.message = "Updated!";
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //delete one
      .addCase(deleteNote.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
        state.notes.noteList = state.notes.noteList.filter(
          (note) => note._id !== action.payload.id
        );
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = notesSlice.actions;

export const selectNotes = (state) => state.notes;

export default notesSlice.reducer;
