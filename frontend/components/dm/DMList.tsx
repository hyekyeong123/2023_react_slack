// import EachDM from '@components/EachDM';
// import useSocket from '@hooks/useSocket';
import { IUser, IUserWithOnline } from "@typings/db";
import { fetcher } from "@utils/fetcher";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import { CollapseButton } from "@components/dm/style";
import EachDM from "@components/dm/EachDM";
import useSocket from "@hooks/useSocket";

// 1 대 1 채팅 목록 리스트
const DMList = () => {
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher.getUserData, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher.getAxiosReturnData,
  );

  const [channelCollapse, setChannelCollapse] = useState(false); // true면 멤버 목록 보여주기
  const [onlineList, setOnlineList] = useState<number[]>([]);
  
  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);
  
  useEffect(() => {
    setOnlineList([]);
  }, [workspace]);
  
// region **************** 소켓으로 현재 활성화 유저 정보 가져오기 ****************
  const [socket] = useSocket(workspace);
  useEffect(() => {
    
    // 현재 활성화 유저 정보 가져오기
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    
    return () => {
      // 리턴함수에서 반드시 socket을 off 해야함
      socket?.off('onlineList');
    };
  }, [socket]);
// endregion **************** 소켓으로 현재 활성화 유저 정보 가져오기 ****************
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