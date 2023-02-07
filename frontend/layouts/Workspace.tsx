import React, { FC, useCallback } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import {Navigate} from "react-router-dom";

const Workspace:FC<React.PropsWithChildren<{}>>  = ({ children }) => {
  const { data, error, mutate } = useSWR('/api/users', fetcher, {
    dedupingInterval: 100000,
    errorRetryInterval: 100000,
    errorRetryCount: 5,
  });


  // 로그아웃하기
  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, {
      withCredentials: true,
    }).then((response)=>{
      mutate(undefined);
    })
  }, []);
  if (!data) {
    return <Navigate to="/login" />;
  }else{
    console.log("data data : "+data);
  }
  // **************************


  return (
    <div>
      <button type="button" onClick={onLogout}>
        로그아웃
      </button>
      {children}
    </div>
  );
};

export default Workspace;
