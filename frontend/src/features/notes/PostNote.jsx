import React, { useCallback, useEffect, useState } from "react";

import Dropzone from "../../components/Dropzone";

import {
  Alert,
  Button,
  FormGroup,
  FormLabel,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import Intro from "../../components/Intro";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import DatePicker from "../../components/DatePicker";

import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken } from "../auth/authSlice";
import { useForm } from "react-hook-form";

import { createNote, reset, selectNotes } from "./notesSlice";

import showToast from "../../common/showToast";
import PostNoteForm from "./PostNoteForm";

const PostNote = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [progress, setProgress] = useState(0);

  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector(selectNotes);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm();

  ///submit note form
  const onSubmitNote = async (inputs, e) => {
    e.preventDefault();
    if (!selectedDate) return null;

    const formData = new FormData();

    selectedFiles.forEach((file, i) => {
      formData.append("files", selectedFiles[i]);
    });

    formData.append("deadline", selectedDate);

    Object.keys(inputs).forEach((field, i) => {
      formData.append(field, inputs[field]);
    });

    //progress object
    const uploadProgress = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentage = Math.floor(((loaded / 1000) * 100) / (total / 1000));
        setProgress(percentage);
      },
    };

    dispatch(createNote({ noteData: formData, uploadProgress }));
  };

  useEffect(() => {
    if (isSuccess) {
      resetForm({ content: "", title: "" });
      setSelectedFiles([]);
    }

    showToast({
      message,
      isLoading,
      isSuccess,
      isError,
      progress,
    });
  }, [isSuccess, isError, isLoading, progress]);

  //clean up on unmount
  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, []);

  //post form props
  const formProps = {
    selectedFiles,
    setSelectedFiles,
    selectedDate,
    setSelectedDate,
    handleSubmit,
    onSubmitNote,
    register,
    errors,
    resetForm,
    isSuccess,
  };

  return (
    <Box>
      <Intro>Post new note</Intro>
      <Box component={Paper} p={4}>
        <PostNoteForm {...formProps} />
      </Box>
    </Box>
  );
};

export default PostNote;
