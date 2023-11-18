import React, { ForwardedRef, forwardRef, memo, useCallback, useRef, VFC } from "react";
import { ChatZone, Section, StickyHeader } from "@components/chatList/style";
import { IDM } from "@typings/db";
import Chat from "@components/chat/Chat";
import Scrollbars from "react-custom-scrollbars";
import chat from "@components/chat/Chat";

interface Props {
  // ref: RefObject<Scrollbars>;
  // isReachingEnd?: boolean;
  // isEmpty: boolean;
  chatSections: { [key: string]: (IDM)[] };
  // setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
}

// const ChatList = forwardRef<Scrollbars, Props>(({chatSections},ref) => {
const ChatList:VFC<Props> = ({chatSections}) => {
   const onScroll = useCallback((values:any)=>{
    if(values.scrollTop === 0){
      console.log("최상단")
      
      // 데이터 추가 로딩
    }
   },[])
  // ************************************************
  return (
    <ChatZone>
      {/*<Scrollbars*/}
      {/*  autoHide={true}*/}
      {/*  ref={ref}*/}
      {/*  onScrollFrame={onScroll}*/}
      {/*>*/}
        {/* 객체를 배열로 변환 */}
        {Object.entries(chatSections).map(([date, chats]) => {
          return(
            <Section className={`section-${date}`} key={date}>
              <StickyHeader><button>{date}</button></StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          )
        })}
      {/*</Scrollbars>*/}
    </ChatZone>
  );
};

export default ChatList;