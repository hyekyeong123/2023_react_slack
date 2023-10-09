import Modal from "@components/modal/Modal";
import useInput from '@hooks/useInput';
import { IUser } from '@typings/db';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { Button, Input, Label } from "@pages/signup/styles";
import { fetcher } from "@utils/fetcher";

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flag: boolean) => void;
}

{/* 워크스페이스 내의 채널에 사용자 초대 모달 */}
const InviteChannelModal: FC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { data: userData } = useSWR<IUser>('/api/users', fetcher.getAxiosReturnData);
  const { mutate: mutateWCM } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher.getAxiosReturnData,
  );
  
  const onInviteMember = useCallback(
    (e:any) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        return;
      }
      axios.post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
          email: newMember,
        })
        .then(() => {
          mutateWCM();
          setShowInviteChannelModal(false);
          setNewMember('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [channel, newMember, mutateWCM, setNewMember, setShowInviteChannelModal, workspace],
  );
// ****************************************************
  if(!show) return null;
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>채널 멤버 초대</span>
          <Input id="member" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteChannelModal;