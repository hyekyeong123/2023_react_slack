import React, { useCallback } from "react";
import Workspace from '@layouts/workspace/Workspace';
import gravater from "gravatar";
import { fetcher } from "@utils/fetcher";
import { Container, Header } from '@pages/directMessage/style';
import useSWR from "swr";
import { useParams } from "react-router";
import ChatBox from "@components/chatBox/ChatBox";
import ChatList from "@components/chatList/ChatList";
import useInput from "@hooks/useInput";
import axios from "axios";
import { IDM } from '@typings/db';

// 1대1 채팅 페이지 View
const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: myData } = useSWR('/api/users', fetcher.getUserAxiosReturnData);
  
  // 상대방 데이터
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher.getAxiosReturnData);
  
  // 실시간 채팅 내용 받아오기
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    () => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher.getAxiosReturnData,
    {
      onSuccess(data) {},
    },
  );
  
/*  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
    fetcher,
    {
      onSuccess(data) {
        if (data?.length === 1) {
          setTimeout(() => {
            scrollbarRef.current?.scrollToBottom();
          }, 100);
        }
      },
    },
  );*/
  // region ******************** 채팅 관련 ***********************
  const [chat, onChangeChat, setChat] = useInput(''); // 현재 입력하고자 하는 채팅의 내용
  const onChatSubmitForm = useCallback((e:any)=>{
    console.log(`chat submit : ${chat}`);
    e.preventDefault()
    
    if(chat?.trim()){
      axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`,{
        content:chat
      },{withCredentials:true})
      .then(()=>{
        console.log("chat 내용 서버로 보내기")
        setChat("");
        mutateChat();
      })
      .catch(console.error)
    }
  },[chat])
  // endregion ******************** 채팅 관련 ********************
  
  // ****************************************************
  if (!userData || !myData) {return null;}
  return (
    <Workspace>
      <Container>
        <Header>
          <img src={gravater.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
          <span>{userData.nickname}</span>
        </Header>
        {/*// scrollbarRef={scrollbarRef}*/}
        {/*// isReachingEnd={isReachingEnd}*/}
        {/*// isEmpty={isEmpty}*/}
        {/*// chatSections={chatSections}*/}
        {/*// setSize={setSize}*/}
        <ChatList
          chatData={chatData}
        />
        
        <ChatBox
          onSubmitForm={onChatSubmitForm}
          chat={chat}
          onChangeChat={onChangeChat}
          placeholder={`Message ${userData.nickname}`}
          data={[]}
        />
      </Container>
    </Workspace>
  );
};

export default DirectMessage;
