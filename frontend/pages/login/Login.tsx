import useInput from '@hooks/useInput';
import { useNavigate } from "react-router-dom";
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/signup/styles';
// import { fetcher } from "@utils/fetcher";
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR, {useSWRConfig} from 'swr';
import { fetcher } from "@utils/fetcher";

// useSWR 컨트룰하기
// 1. 로그인 클릭시 바로 API 요청하기(mutate)
// 2. 서버 API 요청 간격 넓히기
const LogIn = () => {
  const { mutate } = useSWRConfig();
  const navigate = useNavigate();
  // 로그인 정보 가져오기, 로그인 되어 있지 않다면 false
  // data는 리턴한 데이터값
  const { data:userData, error} = useSWR('/api/users', fetcher.getUserAxiosReturnData,{
    errorRetryCount:2, // 최대 2번까지만 재 요청
    dedupingInterval:30*60*1000, // (30분) 해당 기간 내에는 캐시에서 가져오기
  });
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('11@11');
  const [password, onChangePassword] = useInput('11');

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          '/api/users/login',
          { email, password },
          { withCredentials: true, },
        )
        .then((response) => {
          // mutate => 서버에 요청 보내지 않고 데이터를 수정하는것(뒤의 옵션에 false 할 경우),
          // revalidate는 요청 자체를 새로 하는 것(mutete도 false를 안 할경우 재요청 보내서 서버 점검을 함)
            mutate('/api/users',response.data,false)
        })
        .catch((error) => {
            console.log(error.response);
          setLogInError(error.response.status === 401);
        });
    },
    [email, password],
  );
  // *******************************************************************************
  if(error){console.log('로그인 fail', error);}
  if (userData) {navigate("/workspace/sleact/channel/normal", {replace:true});} // 채널로 이동, 뒤로가기 불가
  if (userData === undefined){return <div>Loading</div>}
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
