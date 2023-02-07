import React from 'react';
import axios from 'axios';
import {mutate} from "swr";

const fetcher = (url: string) => {
  console.log("fetcher 함수 불림");
  return axios.get(url, {
    withCredentials: true
  }).then((res) => {
    console.log("url : "+url, "data : "+JSON.stringify(res.data))
    return res.data
  });
};

export default fetcher;
