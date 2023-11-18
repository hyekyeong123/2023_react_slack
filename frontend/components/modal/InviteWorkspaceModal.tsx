import Modal from '@components/modal/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/signup/styles';
import { IUser } from '@typings/db';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "@utils/fetcher";

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteWorkspaceModal: (flag: boolean) => void;
}
const InviteWorkspaceModal: FC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
  const { mutate } = useSWRConfig();
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const [email, onChangeNewMember, setNewMember] = useInput('');
  const { data: userData } = useSWR<IUser>('/api/users', fetcher.getAxiosReturnData);
  
  const { mutate: mutateMember } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher.getAxiosReturnData,
  );
  
  // 워크스페이스 멤버 초대하기
  const onInviteMember = useCallback(
    (e:any) => {
      e.preventDefault();
      if (!email || !email.trim()) {return;}
      axios.post(`/api/workspaces/${workspace}/members`, { email})
        .then((res) => {
          mutateMember();
          setShowInviteWorkspaceModal(false);
          setNewMember('');
        })
        .catch((error) => {
          console.log(error);
          alert(error.response?.data)
        });
    },
    [email, workspace, mutateMember, setShowInviteWorkspaceModal, setNewMember],
  );
  // ****************************************************
  if(!show) return null;
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>초대받을 사람 이메일</span>
          <Input id="member" type="email" value={email} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteWorkspaceModal;