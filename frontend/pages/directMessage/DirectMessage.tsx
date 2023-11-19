import React, { useCallback, useEffect, useRef } from "react";
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
import useSWRInfinite from 'swr/infinite'
import useSocket from "@hooks/useSocket";

// 1대1 채팅 페이지 View
const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  
  const { data: myData } = useSWR('/api/users', fetcher.getUserData);
  // 상대방 데이터
  const { data: memberData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher.getAxiosReturnData);
  
  // region ************************** 채팅 무한 스크롤 데이터 **************************
  // 실시간 채팅 내용 받아오기
  const { data: chatData, mutate: mutateChat,setSize } = useSWRInfinite<IDM[]>(
    (index) =>
      `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index+1}`,
    fetcher.getAxiosReturnData,
    {
      onSuccess(data) {},
    },
  );
  const isEmpty = chatData?.[0]?.length===0;
  const isReachingEnd=isEmpty || (chatData && chatData[chatData.length-1]?.length < 20);
  // endregion ************************** 채팅 무한 스크롤 데이터 **************************
  
  // region ******************** 채팅 관련 ***********************
  const [chat, onChangeChat, setChat] = useInput(''); // 현재 입력하고자 하는 채팅의 내용
  
  const onChatSubmitForm = useCallback((e:any)=>{
    console.log(`chat submit : ${chat}`);
    e.preventDefault()
    if(!chat?.trim() || !chatData) {return null;}
  
    //optimisic UI를 사용하여 사용성 up
    mutateChat((prevChatData) => {
      // 2차원배열의 가장 최신의 데이터에 추가
      prevChatData?.[0].unshift({
        id: (chatData[0][0]?.id || 0) + 1,
        content: chat,
        SenderId: myData.id,
        Sender: myData,
        ReceiverId: memberData.id,
        Receiver: memberData,
        createdAt: new Date(),
      })
      return prevChatData;
    },false).then(()=>{
      setChat("");
      scrollbarRef?.current?.scrollToBottom();
    })
    axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`,{
        content:chat
      },{withCredentials:true})
      .then(()=>{
        // console.log("chat 내용 서버로 보내기")
        mutateChat(); // 처음부터 다시 데이터 가져오기
        scrollbarRef?.current?.scrollToBottom();
      })
      .catch(console.error)
  },[chat, chatData, myData, memberData,id])
  // 채팅 날짜별로 묶어주고 순서 정렬
  // useSWRInfinite을 사용할경우 데이터가 2차원 배열이 됨
  // chatData = [[{id:1,content:"2222"}],[{id:1,content:"2222"}]]
  const chatSections = makeSection(chatData ? ([] as IDM[]).concat(...chatData).reverse() : []);
  // endregion ******************** 채팅 관련 ********************
  const scrollbarRef=useRef<Scrollbars>(null);
  // 로딩 시 스크롤바 제일 아래로
  useEffect(()=>{
    if(chatData?.length === 1){
      scrollbarRef?.current?.scrollToBottom();
    }
  },[chatData])
  
  // region ****************************** 소켓 연결 ******************************
  const onMessage = useCallback(
    (data: IDM) => {
      
      // 보내는 사람의 아이디가 내 아이디가 아니라면
      if (data.SenderId === Number(id) && myData.id !== Number(id)) {
        
        // 서버데이터 실시간으로 웹소켓에서 가져오기()
        mutateChat((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }, false)
          .then(() => {
          
          // 내가 150px 이상일 경우 타인이 채팅을 보내도 스크롤이 내려가지 않는다.
          if (scrollbarRef.current) {
            
            // 내가 스크롤바를 150px 이상 올렸는가?
            if (
              scrollbarRef.current.getScrollHeight() <
              scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
            ) {
              console.log('scrollToBottom!', scrollbarRef.current?.getValues());
              setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
              }, 100);
            }
            
            // 스크롤바 내려감
            else {
              scrollbarRef.current?.scrollToBottom();
              alert("'새 메시지가 도착했습니다.'")
            }
          }
        });
      }
    },
    [id, myData, mutateChat],
  );
  
  const [socket] = useSocket()
  useEffect(() => {
    socket?.on("dm",onMessage);
    return () => {
      socket?.off("dm",onMessage);
    }
  }, [socket, onMessage]);
  // endregion ****************************** 소켓 연결 ******************************
  
  
  
  
  
  
  
  
  
  
  
  // ================================================================================
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
          scrollRef={scrollbarRef}
          setSize={setSize}
          isEmpty={isEmpty}
          isReachingEnd={isReachingEnd}
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
