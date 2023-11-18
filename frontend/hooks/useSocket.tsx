import io, { Socket } from 'socket.io-client';
import { useCallback } from "react";

const baseBackendUrl = process.env.NODE_ENV === 'production' ? 'https://sleact.nodebird.com' : 'http://localhost:3095';

// 어떤 키가 들어오든 문자열이기만 하면 됨
const sockets: { [key: string]: Socket } = {};

// 글로벌 훅에다가 소켓 정보를 저장
const useSocket = (workspace?:string)
  : [Socket | undefined, () => void] =>
{
  // 소켓 연결 끊는 함수
  const disconnectSocket = useCallback(() => {
    if (workspace && sockets[workspace]) {
      console.log('소켓 연결 끊음');
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  // ======================================================================
  // console.log(`useSocket`)
  if (!workspace) {return [undefined, disconnectSocket];}
  
  // 각 소켓 타입별 한번만 소켓 io 연결하기
  if(!sockets[workspace]){
    sockets[workspace] = io(`${baseBackendUrl}/ws-${workspace}`, {
      transports: ['websocket'], // 굳이 polling 하지 말고 웹소켓 바로 사용하자
    });
  }
  // ======================================================================
  return [sockets[workspace], disconnectSocket]
}
export default useSocket;

// 사용방법
// const [socket, disconnectSocket] = useSocket(workspace);