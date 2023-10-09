import React from 'react';
import axios from 'axios';
import {mutate} from "swr";
// import { fetcher } from "@utils/fetcher";
// fetcher.getAxiosReturnData
export class fetcher{
  static getUserAxiosReturnData = (url: string) => {
    return axios.get(url, {
      withCredentials: true // 쿠키 생성 허용
    }).then((res) => {
      localStorage.setItem("user",JSON.stringify(res.data)); // 유저 데이터 확인하기 위해
      return res.data
    });
  };
  
  
  static getAxiosReturnData = (url: string) => {
    return axios.get(url, {
      withCredentials: true // 쿠키 생성 허용
    }).then((res) => {
      return res.data
    });
  };
}


