import React from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import Workspace from '@layouts/Workspace';

const Channel = () => {
  return (
    <Workspace>
      <div>로그인하신 것을 축하드려요!</div>;
    </Workspace>
  );
};

export default Channel;
