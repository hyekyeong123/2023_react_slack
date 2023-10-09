import React, { VFC } from "react";
import { ChatZone } from '@components/chatList/style';
import { IDM } from "@typings/db";

interface Props {
  chatData:IDM[]
  // scrollbarRef: RefObject<Scrollbars>;
  // isReachingEnd?: boolean;
  // isEmpty: boolean;
  // chatSections: { [key: string]: (IDM | IChat)[] };
  // setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
}

const ChatList:VFC<Props> = ({chatData}) => {
  return (
    <ChatZone>
      {chatData.map(item => {
        return <Chat key={item.id} data={item}></Chat>
      })}
    </ChatZone>
  );
};

export default ChatList;