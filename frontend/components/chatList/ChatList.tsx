import React, { ForwardedRef, forwardRef, memo, RefObject, useCallback, useRef, VFC } from "react";
import { ChatZone, Section, StickyHeader } from "@components/chatList/style";
import { IDM,IChat } from "@typings/db";
import Chat from "@components/chat/Chat";
import Scrollbars from "react-custom-scrollbars";
import chat from "@components/chat/Chat";

interface Props {
  isReachingEnd?: boolean;
  isEmpty: boolean;
  chatSections: { [key: string] : (IDM)[] };
  setSize:(f:(size:number) => number) => Promise<IDM[][] | undefined>
  scrollRef:RefObject<Scrollbars>
  // setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
}

// const ChatList = forwardRef<Scrollbars, Props>(({chatSections},ref) => {
const ChatList:VFC<Props> = ((
  {chatSections,setSize,scrollRef,isEmpty,isReachingEnd}) => {
   // ******************************************************
   const onScroll = useCallback((values:any)=>{
    if(values.scrollTop === 0 && !isReachingEnd){
      console.log("최상단")
      
      // 데이터 로딩(인피니트 스크롤링) => 페이지를 하나 더 불러옴
      setSize((prevSize)=>prevSize + 1).then(()=>{
        
        // 스크롤 위치 유지
        if(scrollRef?.current) {
          scrollRef.current?.scrollTop(scrollRef.current?.getScrollHeight() - values.scrollHeight)}
      })
    }
   },[])
  // ************************************************
  return (
    <ChatZone>
      <Scrollbars
        autoHide={true}
        ref={scrollRef}
        onScrollFrame={onScroll}
      >
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
      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;