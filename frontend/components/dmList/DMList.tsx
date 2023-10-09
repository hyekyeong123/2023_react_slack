// import EachDM from '@components/EachDM';
// import useSocket from '@hooks/useSocket';
import { IUser, IUserWithOnline } from "@typings/db";
import { fetcher } from "@utils/fetcher";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import { CollapseButton } from "@components/dmList/style";
import EachDM from "@components/EachDM";

// 채팅 목록 리스트
const DMList = () => {
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher.getAxiosReturnData, {
    dedupingInterval: 2000, // 2초
  });
  
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher.getAxiosReturnData,
  );
  // const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelCollapse] = useState(false); // true면 멤버 목록 보여주기
  const [onlineList, setOnlineList] = useState<number[]>([]);
  
  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);
  
  useEffect(() => {
    setOnlineList([]);
  }, [workspace]);
  
  // useEffect(() => {
  //   socket?.on('onlineList', (data: number[]) => {
  //     setOnlineList(data);
  //   });
  //   console.log('socket on dm', socket?.hasListeners('dm'), socket);
  //   return () => {
  //     console.log('socket off dm', socket?.hasListeners('dm'));
  //     socket?.off('onlineList');
  //   };
  // }, [socket]);
  
  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return <EachDM key={member.id} member={member} isOnline={isOnline} />;
          })}
      </div>
    </>
  );
};

export default DMList;