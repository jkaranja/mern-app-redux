import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormGroup,
  FormLabel,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Intro from "../../components/Intro";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import DatePicker from "../../components/DatePicker";
import Dropzone from "../../components/Dropzone";


import { useForm } from "react-hook-form";
import convertBytesToKB from "../../common/convertBytesToKB";
import { getNote, reset, selectNotes, updateNote } from "./notesSlice";
import showToast from "../../common/showToast";
import EditNoteForm from "./EditNoteForm";

// import { compareAsc, format } from "";

const EditNote = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    notes: { note },
    isLoading,
    isError,
    isSuccess,
    message,
  } = useSelector(selectNotes);

  const [progress, setProgress] = useState(0);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [removedFiles, setRemovedFiles] = useState([]);
  const [currentFiles, setCurrentFiles] = useState([]);

  const { id } = useParams();

  const from = location.state?.from?.pathname || "/notes";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm();

  //set defaults
  useEffect(() => {
    resetForm({ title: note?.title, content: note?.content });
    setCurrentFiles(note?.files);
    setSelectedFiles([]);

    setRemovedFiles([]);
    //setSelectedDate(format(new Date(data.deadline.toISOString()), "dd/MM/yyyy h:mm aa"));//not working
    setSelectedDate(new Date(note?.deadline).getTime()); //use .getTime() to pass as number//as date or iso string not working
  }, [note]);

  /* ----------------------------------------
   UPDATE NOTE
   ----------------------------------------*/
  ///submit note form
  const onSubmitNote = async (inputs, e) => {
    e.preventDefault();
    if (!selectedDate) return null;

    const formData = new FormData();

    selectedFiles.forEach((file, i) => {
      formData.append("files", selectedFiles[i]);
    });

    formData.append("deadline", selectedDate);

    formData.append("removedFiles", removedFiles);

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

    dispatch(updateNote({ noteData: formData, id, uploadProgress }));
  };

  /* ----------------------------------------
   REMOVE
   ----------------------------------------*/
  const handleRemove = (path) => {
    const removed = currentFiles.filter((file) => file.path === path);
    setRemovedFiles((prev) => [...prev, ...removed]);

    setCurrentFiles((prev) => {
      return prev.filter((file) => file.path !== path);
    });
  };

  /* ----------------------------------------
   FETCH NOTE
   ----------------------------------------*/
  useEffect(() => {
    dispatch(getNote(id));

    return () => {
      dispatch(reset());
    };
  }, []);

  //feedback
  useEffect(() => {
    showToast({
      message: message ? message : "Fetched",
      isLoading,
      isError,
      isSuccess,
      progress,
    });
  }, [isSuccess, isError, isLoading, progress]);

  //edit form props
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
    currentFiles,
    handleRemove,
    setCurrentFiles,
    setRemovedFiles,
    note,
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        color="secondary"
        sx={{ fontWeight: "bold", mb: 2 }}
        onClick={() => navigate(from, { replace: true })}
      >
        Notes
      </Button>
      <Intro>Edit note</Intro>
      <Box component={Paper} p={4}>
        <EditNoteForm {...formProps} />
      </Box>
    </Box>
  );
};

export default EditNote;
