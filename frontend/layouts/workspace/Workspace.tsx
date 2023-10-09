import React, { FC, useCallback, useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { fetcher } from "@utils/fetcher";
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper
} from "@layouts/workspace/style";
import gravater from "gravatar";
import Menu from "@components/menu/Menu";
import { IUser } from "@typings/db";
import useInput from "@hooks/useInput";
import Modal from "@components/modal/Modal";
import { Button, Input, Label } from "@pages/signup/styles";
import CreateChannelModal from "@components/modal/CreateChannelModal";
import { useParams } from "react-router";
import InviteWorkspaceModal from "@components/modal/InviteWorkspaceModal";
import InviteChannelModal from "@components/modal/InviteChannelModal";
import DMList from "@components/dmList/DMList";
import ChannelList from "@components/channelList/ChannelList";
import { IChannel } from "@typings/db";
import useSocket from "@hooks/useSocket";
const Workspace :
  FC<React.PropsWithChildren<{}>>  = ({ children }) => {
  const { mutate } = useSWRConfig();
  const { data:userData, error, } = useSWR<IUser | false>(
    '/api/users',
    fetcher.getUserAxiosReturnData, {
    errorRetryCount: 50,
    dedupingInterval:30*60*1000,
  });
  // 모달을 껐다 키는 state
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
// *******************************************************************
  const {workspace} = useParams<{workspace:string}>();
  const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher.getAxiosReturnData);
// *******************************************************************
  
  // 로그아웃하기
  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, { withCredentials: true, })
    .then((response)=>{
      mutate('/api/users',false,false);
    })
  }, []);
  
  // 유저 프로필 토글 버튼
  const [showUserMenu, setShowUserMenu] = useState(false);
  const onCLickUserProfile = useCallback((e:React.MouseEvent<HTMLDivElement>)=>{
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  },[])
  
  // 워크 스페이스 추가버튼 누를 경우 -> 모달 소환
  const onClickCreateWorkspace =useCallback(() =>{
    setShowCreateWorkspaceModal(true);
  },[])
  
  // 실제 워크스페이스 생성
  const onCreateWorkspace =useCallback((e:any) =>{
    console.log(newWorkspace+"/"+newUrl)
    e.preventDefault();
    
    // 필수값들이 모두 있나 검사
    if (newWorkspace === "" || newWorkspace.trim() === "") return;
    if (newUrl === "" || newUrl.trim() === "") return;
    
    axios.post('/api/workspaces',{
      workspace:newWorkspace,
      url:newUrl
    },{withCredentials:true})
    .then((response)=>{
      mutate('/api/users')
      setShowCreateWorkspaceModal(false); // 모달창 닫기
      
      // 버튼 연달아서 클릭 못하게
      setNewWorkspace('');
      setNewUrl('');
      console.log(`성공 response.data : ${JSON.stringify(response.data)}`);
    }).catch((error)=>{
      // console.log(error);
      alert(error.response.data);
    })
  },[newWorkspace, newUrl])
  
  // 버튼 클릭시 모든 모달창 닫아줌
  const onCloseModal =useCallback(() =>{
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false)
    setShowInviteChannelModal(false);
  },[]);
  
  const toggleWorkspaceModal = useCallback(() =>{
    setShowWorkspaceModal((prev) => !prev);
  },[]);
  
  const onClickAddChannel = useCallback(() =>{
    setShowCreateChannelModal(true);
  },[]);
  
  // 워크스페이스에 사용자 초대
  const onClickInviteWorkspace = useCallback(() =>{
    setShowInviteWorkspaceModal(true);
  },[]);
  
  
// region ********************** 채팅 Socket IO *************************
  const [socket, disconnectSocket] = useSocket(workspace);
  useEffect(() => {
    if (channelData && userData && socket) {
      console.info('***** 소켓 로그인 *****', socket);
      socket?.emit('login',
        {
          id: userData?.id,
          channels: channelData.map((v) => v.id)
        });
    }
  }, [socket, userData, channelData]);
  
  useEffect(() => {
    return () => {
      console.info('workspace 변경시 소켓 연결 끊기', workspace);
      disconnectSocket();
    };
  }, [disconnectSocket, workspace]);
// endregion ********************** 채팅 Socket IO **********************

// *****************************************************************************************
  if (userData === undefined){return <div>Loading</div>}
  if (userData === false) {return <Navigate to="/login" />;} // 로그아웃시 로그인 페이지로 이동
  return (
    <div>
      <Header>
        {/* ***************** 오른쪽 프로필 부분  ***************** */}
        <RightMenu>
          <span onClick={onCLickUserProfile}>
            
            {/* 유저 프로필(gravater 사용) */}
            <ProfileImg
              src={gravater.url(userData.email,{s:'28px', d:'retro'})}
              alt={userData.nickname}>
            </ProfileImg>
            
            {/* 프로필 클릭시 메뉴화면 보여주기 */}
            {
              showUserMenu &&
              <Menu
                style={{right:0, top:38}}
                show={showUserMenu}
                onCloseModal={onCLickUserProfile}>
              
                <ProfileModal>
                  <img
                    src={gravater.url(userData.email,{s:'28px', d:'retro'})}
                    alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            }
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
  
        {/* ********************* 워크 스페이스들 ********************* */}
        <Workspaces>
          {userData?.Workspaces?.map((item)=>(
            <Link key={item.id} to={`/workspace/${item.url}/channel/normal`}>
            <WorkspaceButton>{item.name.slice(0,1).toUpperCase()}</WorkspaceButton>
          </Link>
          ))
          }
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
  
        {/* ********************* 채널들 ********************* */}
        <Channels>
          <WorkspaceName
            onClick={toggleWorkspaceModal}
          >워크스페이스 이름</WorkspaceName>
          
          {/* ***** WorkspaceName 클릭시 ***** */}
          <MenuScroll>
            <Menu
              show={showWorkspaceModal}
              onCloseModal={toggleWorkspaceModal}
              style={{top:95, left:80}}
            >
              <WorkspaceModal>
                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            
            <ChannelList/>
            <DMList/>
            {/*{channelData?.map((v:any) => (*/}
            {/*  <div>{v.name}</div>*/}
            {/*))}*/}
          </MenuScroll>
        </Channels>
  
        {/* ********************* 채팅 내용들 ********************* */}
        <Chats>
          {children}
        </Chats>
      </WorkspaceWrapper>
      
      {/* + 버튼 클릭시 워크스페이스 생성 모달 */}
      {/* input이 있을 경우 다른 컴포넌트로 빼야 성능에 좋음 */}
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace-url" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">워크스페이스 생성</Button>
        </form>
      </Modal>
  
      {/* 채널 만들기 클릭시 모달 */}
      <CreateChannelModal
      show={showCreateChannelModal}
      onCloseModal={onCloseModal}
      setShowCreateChannelModal={setShowCreateChannelModal}
      />
      
      {/* 워크스페이스에 사용자 초대 모달 */}
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
     
      {/* 워크스페이스 내의 채널에 사용자 초대 모달 */}
      <InviteChannelModal
          show={showInviteChannelModal}
          onCloseModal={onCloseModal}
          setShowInviteChannelModal={setShowInviteChannelModal}/>
    </div>
  );
};

export default Workspace;
