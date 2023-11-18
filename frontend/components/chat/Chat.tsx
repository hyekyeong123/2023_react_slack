import { ChatWrapper } from '@components/chat/style';
import { IDM,IChat } from '@typings/db';
import React, { useMemo } from "react";
import { memo, VFC } from "react";
import gravater from "gravatar";
import dayjs from "dayjs";
import regexifyString from "regexify-string";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
interface Props {
  data: IDM;
}

const BACK_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3095' : 'https://sleact.nodebird.com';

// 말단 컴포넌트는 memo로 감싸기(부모컴포넌트가 변경되어도 props가 변경되는것이 아니라면 리렌더링 하지 않음)
const Chat: VFC<Props> = memo(({ data }) => {
  const user= data.Sender;
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  // const user: IUser = 'Sender' in data ? data.Sender : data.User;
  
  // @[사람 닉네임](idx) 채팅 내용
  const result = useMemo<(string | JSX.Element)[] | JSX.Element>(
    () =>
      data.content.startsWith('uploads\\') || data.content.startsWith('uploads/') ? (
        <img src={`${BACK_URL}/${data.content}`} style={{ maxHeight: 200 }} />
      ) : (
        // +? : 단어 단위, /d : 숫자, +는 1개 이상, ?는 0개 또는 1개, g는 모두 찾기(findAll)
  
        // 아이디나 줄바꿈을 보면 아래와 같이 변경해라
        regexifyString({
          pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
          decorator(match, index) {
            const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!; // 아이디만 추출
            if (arr) {
              return (
                <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                  @{arr[1]}
                </Link>
              );
            }
            return <br key={index} />; // 줄바꿈 구현
          },
          input: data.content,
        })
      ),
    [workspace, data.content],
  );
  
  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravater.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          {/*<span>{new Date(data.createdAt).toDateString() }</span>*/}
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
});

export default Chat;