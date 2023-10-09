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
  setShowCreateChannelModal:(flag:boolean) => void;
}
const CreateChannelModal:VFC<Props> = (
  {show, onCloseModal, setShowCreateChannelModal}
) => {
  const { mutate } = useSWRConfig();
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const {workspace, channel} = useParams<{workspace:string; channel:string}>();
  
  // 채널 생성하기
  const onSubmit = useCallback((e:any) =>{
    e.preventDefault();
    axios.post(`/api/workspaces/${workspace}/channels`,{
      name:newChannel
    },{withCredentials:true})
    .then((res)=>{
        setShowCreateChannelModal(false); // 모달창 닫기
        mutate(`/api/workspaces/${workspace}/channels`); // 채널 목록 다시 불러오기
        setNewChannel('');
      }).catch((error)=>{
      alert(error.response.data);
    })
  },[newChannel])
  // *****************************************
  if(!show) return null;
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onSubmit}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel}/>
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
