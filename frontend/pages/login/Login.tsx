import useInput from '@hooks/useInput';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/signup/styles';
// import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR, {useSWRConfig} from 'swr';
import fetcher from "@utils/fetcher";
import {Navigate} from "react-router-dom";

const LogIn = () => {
  const { data, error, mutate } = useSWR('/api/users', fetcher,);
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          '/api/users/login',
          { email, password },
          {
            withCredentials: true,
          },
        )
        .then((response) => {
            console.log('success : ' + response);
            mutate(response.data, true) // 기존에 가지고 있는 데이터를 넣어버리기
        })
        .catch((error) => {
            console.log('fail : ' + JSON.stringify(error.response));
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
  );

  // if (data === undefined) {
  //   return <div>로딩중...</div>;
  // }
  if (data) {
    return <Navigate to="/workspace/channel" />;
  }
  // if(data === undefined){
  //     console.log('data fail : ', data);
  //     return <div>Loading</div>
  // }

  if(error){
      console.log('로그인 fail', error);
  }
  // console.log(error, userData);
  // if (!error && userData) {
  //   console.log('로그인됨', userData);
  //   return <Redirect to="/workspace/sleact/channel/일반" />;
  // }

  return (
    <div id="container">
      <Header>슬랙</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
