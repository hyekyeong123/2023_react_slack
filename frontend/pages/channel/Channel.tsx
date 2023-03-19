import React from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import Workspace from '@layouts/workspace/Workspace';
import { Container, Header } from '@pages/channel/style';

const Channel = () => {
  return (
    <Workspace>
      <Container>
        <Header>Header</Header>
      </Container>
    </Workspace>
  );
};

export default Channel;
