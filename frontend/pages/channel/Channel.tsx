import React, { useCallback } from "react";
import Workspace from '@layouts/workspace/Workspace';
import { Container, Header } from '@pages/channel/style';
import ChatList from "@components/chatList/ChatList";
import ChatBox from "@components/chatBox/ChatBox";
import useSWR from "swr";
import { fetcher } from "@utils/fetcher";
import useInput from "@hooks/useInput";
import { useParams } from "react-router";
import { Navigate } from "react-router-dom";

const Channel = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: myData,isLoading } = useSWR('/api/users', fetcher.getUserData);
  // region ******************** 채팅 관련 ***********************
  const [chat, onChangeChat, setChat] = useInput(''); // 현재 입력하고자 하는 채팅의 내용
  const onChatSubmitForm = useCallback((e:any)=>{
    e.preventDefault()
  },[])
  // endregion ******************** 채팅 관련 ********************

  // ========================================================
  if (myData == false) {return <Navigate to="/login" />;}
  if(isLoading) return <div>로딩중</div>;
  return (
    <Workspace>
      <Container>
        <Header>채널</Header>
        
        {/* 채팅 했던 내역들 */}
        {/*<ChatList />*/}
        <ChatBox
          onSubmitForm={onChatSubmitForm}
          chat={chat}
          onChangeChat={onChangeChat}
          placeholder={`Message ${myData.nickname}`}
          data={[]}
        />
      </Container>
    </Workspace>
  );
};

export default Channel;
