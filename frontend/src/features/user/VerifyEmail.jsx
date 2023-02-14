import React, { useEffect, useState } from "react";

import { Alert, Box, Button, Link, Snackbar, Typography } from "@mui/material";

import { Card, CardActions, CardContent, CardHeader } from "@mui/material";
import { useNavigate } from "react-router-dom";

import jwtDecode from "jwt-decode";
import { resendEmail, reset, selectUser } from "./userSlice";
import { useDispatch, useSelector } from "react-redux";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } =
    useSelector(selectUser);

  // document.cookie; //returns a string with list of all cookies separated by semicolon

  //use regex to extract a cookie by name/key //or use js-cookie
  let token = document.cookie.replace(
    /(?:(?:^|.*;\s*)resend\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  const decode = () => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  const email = decode()?.email;

  const handleResend = async () => {
    dispatch(resendEmail());
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
      >
        <Alert variant="filled" severity="error">
          {isLoading && "Loading..."}
          {message}
        </Alert>
      </Snackbar>
      <Card sx={{ pt: 4, px: 2, pb: 2, maxWidth: "450px" }}>
        <form>
          <CardHeader
            title={
              <Typography variant="h4" gutterBottom>
                Verify your email
              </Typography>
            }
            subheader={
              token ? (
                <Typography variant="body1">
                  We've sent a verification link to your email address:
                  <Typography
                    variant="body1"
                    component="span"
                    px
                    fontWeight="bold"
                  >
                    {email || "..."}.
                  </Typography>
                  Please click the link to activate your account.
                </Typography>
              ) : (
                <Typography gutterBottom paragraph mt={3} color="error.main">
                  Link has expired!
                </Typography>
              )
            }
          />
          <CardContent>
            {/* <Button
              type="submit"
              size="large"
              variant="contained"
              fullWidth
              color="secondary"
              onClick={() => navigate("/orders")}
            >
              Skip for now
            </Button> */}
          </CardContent>
          <CardActions sx={{ display: "block" }}>
            {token && (
              <Box>
                <Typography component="span" px={1}>
                  Didn't get the mail?
                </Typography>

                <Link
                  color="secondary"
                  sx={{ textDecoration: "none", cursor: "pointer" }}
                  onClick={handleResend}
                >
                  Resend
                </Link>
              </Box>
            )}
          </CardActions>
        </form>
      </Card>
    </Box>
  );
};

export default VerifyEmail;
