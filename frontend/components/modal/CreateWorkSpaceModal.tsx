import React, { useCallback, VFC } from "react";
import Modal from "@components/modal/Modal";
import { Button, Input, Label } from "@pages/signup/styles";
import useInput from "@hooks/useInput";
import axios from "axios";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";

interface Props {
  show:boolean;
  onCloseModal:()=>void;
  setShowModal:(flag:boolean) => void;
}

export const CreateWorkSpaceModal:VFC<Props> = (
  {show, onCloseModal, setShowModal}
) => {
  const { mutate } = useSWRConfig();
  const [workspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [url, onChangeNewUrl, setNewUrl] = useInput('');
  
  // 워크스페이스 생성
  const onCreateWorkspace =useCallback((e:any) =>{
    e.preventDefault();
    // console.log(newWorkspace+"/"+newUrl)
    
    if (workspace.trim() === "") return;
    if (url.trim() === "") return;
    
    axios.post('/api/workspaces',{
        workspace:workspace, url
      },{withCredentials:true})
      .then((response)=>{
        mutate('/api/users')
        setShowModal(false); // 모달창 닫기
        
        // 버튼 연달아서 클릭 못하게
        setNewWorkspace('');
        setNewUrl('');
        console.log(`성공 response.data : ${JSON.stringify(response.data)}`);
      }).catch((error)=>{
      // console.log(error);
      alert(error.response.data);
    })
  },[workspace, url])
  // *****************************************
  if(!show) return null;
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateWorkspace}>
        <Label id="workspace-label">
          <span>워크스페이스 이름</span>
          <Input id="workspace" value={workspace} onChange={onChangeNewWorkspace} />
        </Label>
    
        <Label id="workspace-url-label">
          <span>워크스페이스 url</span>
          <Input id="workspace-url" value={url} onChange={onChangeNewUrl} />
        </Label>
    
        <Button type="submit">워크스페이스 생성</Button>
      </form>
    </Modal>
  );
};
