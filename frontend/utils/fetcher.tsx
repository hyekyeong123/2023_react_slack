import React from 'react';
import axios from 'axios';
import {mutate} from "swr";
// import { fetcher } from "@utils/fetcher";
// fetcher.getAxiosReturnData
export class fetcher{
  static getUserData = (url: string) => {
    return axios.get(url, {
      withCredentials: true // 쿠키 생성 허용
    }).then((res) => {
      console.log("getUserData",res)
      localStorage.setItem("user",JSON.stringify(res.data)); // 유저 데이터 저장
      return res.data
    });
  }
  
  static getAxiosReturnData = (url: string) => {
    return axios.get(url, {
      withCredentials: true // 쿠키 생성 허용
    }).then((res) => {
      return res.data
    });
  };
}


