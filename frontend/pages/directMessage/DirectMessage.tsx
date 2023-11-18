import React, { useCallback, useRef } from "react";
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
import makeSection from "@utils/makeSection";
import Scrollbars from "react-custom-scrollbars";

// 1대1 채팅 페이지 View
const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  
  const { data: myData } = useSWR('/api/users', fetcher.getUserData);
  // 상대방 데이터
  const { data: memberData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher.getAxiosReturnData);
  
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
        // console.log("chat 내용 서버로 보내기")
        setChat("");
        mutateChat();
      })
      .catch(console.error)
    }
  },[chat])
  
  const chatSections = makeSection(chatData
    ? [...chatData].reverse()
    : []
  );
  // endregion ******************** 채팅 관련 ********************
  const scrollbarRef = useRef<Scrollbars>(null);
  // ****************************************************
  if (!memberData || !myData) {return null;}
  return (
    <Workspace>
      <Container>
        <Header>
          <img src={gravater.url(memberData.email, { s: '24px', d: 'retro' })} alt={memberData.nickname} />
          <span>{memberData.nickname}</span>
        </Header>
        {/*// scrollbarRef={scrollbarRef}*/}
        {/*// isReachingEnd={isReachingEnd}*/}
        {/*// isEmpty={isEmpty}*/}
        {/*// chatSections={chatSections}*/}
        {/*// setSize={setSize}*/}
        <ChatList
          chatSections={chatSections}
          // ref={scrollbarRef}
        />
        
        {/* 보내는 메시지를 입력하는 창*/}
        <ChatBox
          onSubmitForm={onChatSubmitForm}
          chat={chat}
          onChangeChat={onChangeChat}
          placeholder={`Message ${memberData.nickname}`}
          data={[]}
        />
      </Container>
    </Workspace>
  );
};

export default DirectMessage;
