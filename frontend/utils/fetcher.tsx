import React from 'react';
import axios from 'axios';
import {mutate} from "swr";

const fetcher = (url: string) => {
  return axios.get(url, {
    withCredentials: true // 쿠키 생성 허용
  }).then((res) => {
    return res.data
  });
};

export default fetcher;
