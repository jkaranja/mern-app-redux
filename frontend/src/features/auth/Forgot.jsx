import React, { useEffect, useState } from "react";

import {
  Avatar,
  Badge,
  Button,
  Divider,
  Grid,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import { Box } from "@mui/system";

import InputLabel from "@mui/material/InputLabel";

import FormControl from "@mui/material/FormControl";

import OutlinedInput from "@mui/material/OutlinedInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import InputAdornment from "@mui/material/InputAdornment";
import GoogleIcon from "@mui/icons-material/Google";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import { Card, CardActions, CardContent, CardHeader } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import useTitle from "../../hooks/useTitle";

import { forgotPwd, reset,  selectCurrentToken } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { EMAIL_REGEX } from "../../constants/regex";

const Forgot = () => {
  useTitle("Forgot password");

  const { isLoading, isError, isSuccess, message } =
    useSelector(selectCurrentToken);

    const dispatch = useDispatch();

 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (inputs, e) => {
    e.preventDefault();

   dispatch(forgotPwd(inputs));
  };

   useEffect(() => {
     return () => {
       dispatch(reset());
     };
   }, []);

  return (
    <Box sx={{ display: "flex" }} justifyContent="center">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError || isSuccess || isLoading}
        autoHideDuration={4000}
        // onClose={() => dispatch(reset())}
      >
        <Alert
          variant="filled"
          severity="error"
          // onClose={() => dispatch(reset())}
        >
          {isLoading && "Loading..."}
          {message}
        </Alert>
      </Snackbar>
      <Card sx={{ pt: 4, px: 2, pb: 2, maxWidth: "450px" }}>
        <CardHeader
          title={
            <Typography variant="h4" gutterBottom>
              Forgot Password?
            </Typography>
          }
          subheader="Enter your email and we′ll send you instructions to reset your password"
        />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup sx={{ mb: 0.5 }}>
              <TextField
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: EMAIL_REGEX,
                    message: "Enter an email address",
                  },
                })}
                id="outlined-basic"
                label="Email"
                color="secondary"
              />
              <Typography color="error.main" variant="caption">
                {errors.email?.message}
              </Typography>
            </FormGroup>

            <Button
              type="submit"
              size="large"
              sx={{ mt: 2 }}
              variant="contained"
              fullWidth
              color="secondary"
            >
              Send reset link
            </Button>
          </form>
        </CardContent>
        <CardActions sx={{ display: "block", textAlign: "center" }}>
          <Button
            component={Link}
            to="/login"
            color="secondary"
            startIcon={<ChevronLeftIcon color="secondary" fontSize="small" />}
            sx={{ textTransform: "none" }}
          >
            Back to login
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Forgot;
