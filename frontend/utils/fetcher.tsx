import React from 'react';
import axios from 'axios';

const fetcher = (url: string) => {
  console.log("fetcher 함수 불림");
  axios.get(url, {
    withCredentials: true
  }).then((res) => res.data);
};

export default fetcher;
