import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../config";

import { setCredentials } from "../features/auth/authSlice";

const useRefreshToken = () => {
  const dispatch = useDispatch();

  const refresh = async () => {
    const client = axios.create({
      baseURL: BASE_URL,
      withCredentials: true, //or add axios.defaults.withCredentials = true in app.js or top of file//for any req setting or sending cookies
    });

    try {
      const {
        data: { accessToken },
      } = await client.get("/api/auth/refresh");

      dispatch(setCredentials(accessToken));

      return accessToken;
    } catch (error) {
      //navigate to login
      //console.error("error");
      return;
    }
  };

  return refresh;
};

export default useRefreshToken;
