import React, { useCallback, useState, VFC } from 'react';
import { Button, Form, Header, Input, Label, LinkContainer, Error, Success } from './styles';
import {Link, Navigate} from 'react-router-dom';
import useInput from '@hooks/useInput';
import axios from 'axios';
import useSWR from "swr";
import { fetcher } from "@utils/fetcher";

const SignUp = () => {
    const { data:userData, error, mutate } = useSWR('/api/users', fetcher.getAxiosReturnData,{});
  
  // 중복 제거
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  
  
  const [pwdMisMatchError, setPwdMismatchError] = useState(false); // 비밀번호가 다를 경우
  const [apiResultError, setApiResultError] = useState(''); // 서버 통신 실패시
  const [apiResultSuccess, setApiResultSuccess] = useState(false);
  // *********************************************************************************

  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setPwdMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );
  const onChangePasswordCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(e.target.value);
      setPwdMismatchError(e.target.value !== password);
    },
    [password],
  );

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(email, nickname, password, passwordCheck);
      
      // 비밀번호 매치에 문제가 없다면 회원가입 하기
      if (!pwdMisMatchError) {
        // 비동기요청 전 반드시 state 초기화 과정 필요
        setApiResultError('');
        setApiResultSuccess(false);

        axios.post('/api/users', // 프록시를 사용했기때문에 http://localhost 생략 가능
            { email, nickname, password })
          .then((res) => {
            // console.log('success : ' + res);
            setApiResultSuccess(true);
          })
          .catch((error) => {
            // console.log('fail : ' + error.response);
            setApiResultError(error.response.data);
          })
          .finally(() => {});
      }
    },
    [email, nickname, password, passwordCheck, pwdMisMatchError],
  );
// *******************************************************************************
  if (userData) {return <Navigate to="/workspace/sleact/channel/normal" />;}
  if(userData === undefined){return <div>Loading</div>}
  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>

        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input type="password" id="password-check" name="password-check" value={passwordCheck} onChange={onChangePasswordCheck} />
          </div>
          {pwdMisMatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {apiResultError && <Error>{apiResultError}</Error>}
          {apiResultSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
