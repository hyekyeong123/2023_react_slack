import React, { FC, useCallback, useState } from "react";
import useSWR from 'swr';
import axios from 'axios';
import { Link, Navigate } from "react-router-dom";
import { useSWRConfig } from "swr"
import getAxiosReturnData from "@utils/fetcher";
import {
  AddButton,
  Channels,
  Chats,
  Header, LogOutButton, MenuScroll,
  ProfileImg, ProfileModal,
  RightMenu, WorkspaceButton, WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper
} from "@layouts/workspace/style";
import gravater from 'gravatar';
import Menu from "@components/menu/Menu";
import { IChannel, IUser } from "@typings/db";
import useInput from "@hooks/useInput";
import Modal from "@components/modal/Modal";
import { Button, Input, Label } from "@pages/signup/styles";
import { toast } from "react-toastify";
import CreateChannelModal from "@components/modal/createChannelModal/CreateChannelModal";
import { useParams } from "react-router";
import { Simulate } from "react-dom/test-utils";
import dragOver = Simulate.dragOver;

const Workspace:FC<React.PropsWithChildren<{}>>  = ({ children }) => {

  
  const { mutate } = useSWRConfig();
  const { data:userData, error, } = useSWR<IUser | false>(
    '/api/users',
    getAxiosReturnData, {
    errorRetryCount: 5,
    dedupingInterval:30*60*1000,
  });
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  // 로그아웃하기
  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, {
      withCredentials: true,
    })
    .then((response)=>{
      mutate('/api/users',false,false);
    })
  }, []);
  
  // 프로필 토글 버튼
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
      console.log(`error : ${error}`);
      toast.error(error.response?.data, {position:'bottom-center'});
    })
  },[newWorkspace, newUrl])
  
  const onCloseModal =useCallback(() =>{
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
  },[]);
  
  const toggleWorkspaceModal = useCallback(() =>{
    setShowWorkspaceModal((prev) => !prev);
  },[]);
  
  const onClickAddChannel = useCallback(() =>{
    setShowCreateChannelModal(true);
  },[]);
  
  // ***************** 채널 데이터 가져오기 *****************
  const {workspace} = useParams<{workspace:string;}>();
  const { data:channelData, } = useSWR<IChannel | false>(
    userData ? `/api/workspaces/${workspace}/channels` : null, // 로그인한 상태에서만 가져오기
    getAxiosReturnData, {
      errorRetryCount: 5,
      dedupingInterval:30*60*1000,
    });
  // *****************************************************************************************
  if (!userData) {return <Navigate to="/login" />;} // 이걸 추가하면 데이터가 있어도 무조건 로그인 페이지로 들어가버림
  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onCLickUserProfile}>
            <ProfileImg src={gravater.url(userData.email,{s:'28px', d:'retro'})} alt={userData.nickname}></ProfileImg>
            {showUserMenu && <Menu style={{right:0, top:38}} show={showUserMenu} onCloseModal={onCLickUserProfile}>
              <ProfileModal>
                <img src={gravater.url(userData.email,{s:'28px', d:'retro'})} alt={userData.nickname} />
                <div>
                  <span id="profile-name">{userData.nickname}</span>
                  <span id="profile-active">Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
            </Menu>}
          </span>
        </RightMenu>
        
      </Header>
      
      <button type="button" onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>
          {
          userData?.Workspaces.map((item)=>(
            <Link key={item.id} to={`/workspace/${123}/channel/일반`}>
            <WorkspaceButton>{item.name.slice(0,1).toUpperCase()}</WorkspaceButton>
          </Link>
          ))
          }
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Slack</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{top:95, left:80}}>
              <WorkspaceModal>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            {channelData?.map((item)=>(
              <div>{item.name}</div>
            ))}
          </MenuScroll>
        </Channels>
        <Chats>
          {children}
        </Chats>
      </WorkspaceWrapper>
      
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
          
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal
      show={showCreateChannelModal}
      onCloseModal={onCloseModal}
      setShowCreateChannelModal={setShowCreateChannelModal}
      />
    </div>
  );
};

export default Workspace;