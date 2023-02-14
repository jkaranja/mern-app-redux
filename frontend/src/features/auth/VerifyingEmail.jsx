import React, { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";

import { Card, CardContent, CardHeader } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

import { useDispatch, useSelector } from "react-redux";
import { confirmEmail, selectCurrentToken } from "./authSlice";

import { reset } from "../user/userSlice";

const VerifyingEmail = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } =
    useSelector(selectCurrentToken);

  const { token } = useParams();

  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (isSuccess) setStatus(200);
    if (isError) setStatus(400);
  }, [isSuccess, isError]);

  useEffect(() => {
    if (isSuccess || isError || isLoading) return;

    dispatch(confirmEmail(token));

    return () => {
      dispatch(reset());
    };
  }, []);

  return (
    <Box sx={{ display: "flex" }} justifyContent="center">
      <Card sx={{ pt: 4, px: 2, pb: 2, minWidth: "450px" }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex" }} justifyContent="center">
              {!status && (
                <CircularProgress size={45} color="inherit" thickness={2} />
              )}

              {status === 200 && (
                <Avatar sx={{ width: 45, height: 45, bgcolor: "success.main" }}>
                  {" "}
                  <CheckIcon />{" "}
                </Avatar>
              )}
              {status === 400 && (
                <Avatar sx={{ width: 45, height: 45, bgcolor: "error.main" }}>
                  {" "}
                  <ClearIcon />{" "}
                </Avatar>
              )}
            </Box>
          }
        />
        <CardContent>
          <Typography gutterBottom paragraph mb={5} align="center">
            {message}
            {isLoading && "Loading..."}
          </Typography>

          {status === 200 && (
            <Button
              type="submit"
              size="large"
              variant="contained"
              fullWidth
              color="secondary"
              onClick={() => navigate("/orders")}
            >
              Proceed to account
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerifyingEmail;
