import React, { useCallback } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';

const Workspace = () => {
  const { data, error, mutate } = useSWR('/api/users', fetcher, {
    dedupingInterval: 100000,
    errorRetryInterval: 100000,
    errorRetryCount: 5,
  });

  // 로그아웃하기
  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, {
      withCredentials: true,
    });
  }, []);
  // **************************
  return (
    <div>
      <button type="button" onClick={onLogout}>
        로그아웃
      </button>
    </div>
  );
};

export default Workspace;
