import { ChatArea, Form, SendButton, Toolbox, EachMention, MentionsTextarea } from '@components/chatBox/style';
import { IUser, IUserWithOnline } from "@typings/db";
import autosize from 'autosize';
import gravatar from 'gravatar';
import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Mention, SuggestionDataItem } from "react-mentions";
import useSWR from "swr";
import { fetcher } from "@utils/fetcher";
import { useParams } from "react-router";
// import { Mention, SuggestionDataItem } from 'react-mentions';

interface Props {
  onSubmitForm: (e: any) => void;
  chat?: string;
  onChangeChat: (e: any) => void;
  placeholder: string;
  data?: IUser[];
}
const ChatBox: FC<Props> = ({
  onSubmitForm, chat, onChangeChat, placeholder, data
}) => {
  
  // autosize 라이브러리 적용(shift 엔터 클릭시 줄바꿈)
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {autosize(textareaRef.current);}
  }, []);
  
  const onKeydownChat = useCallback(
    (e:React.KeyboardEvent) => {
      if (!e.nativeEvent.isComposing && e.key === 'Enter') {
        if (!e.shiftKey) { // shiftKey는 줄바꿈
          e.preventDefault();
          onSubmitForm(e);
        }
      }
    },
    [onSubmitForm],
  );
  const {workspace} = useParams<{workspace:string}>();
  const { data:userData, error, } = useSWR<IUser | false>(
    '/api/users',
    fetcher.getUserData, {
      errorRetryCount: 50,
      dedupingInterval:30*60*1000,
    });
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher.getAxiosReturnData,
  );
  const renderUserSuggestion: (
    suggestion: SuggestionDataItem,
    search: string,
    highlightedDisplay: React.ReactNode,
    index: number,
    focused: boolean,
  ) => React.ReactNode = useCallback(
    (
      member, search, highlightedDisplay, index, focus
    ) => {
      if (!memberData) {
        return null;
      }
      return (
        <EachMention
          focus={focus}
        >
          <img src={gravatar.url(memberData[index].email, { s: '20px', d: 'retro' })} alt={memberData[index].nickname} />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    [data],
  );
  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onKeydownChat}
          placeholder={placeholder}
          inputRef={textareaRef}
          allowSuggestionsAboveCursor
        >
          {/* @ 누르면 상세 나오게 하는것 */}
          <Mention
            appendSpaceOnAdd // 추가 후 한깐 띄우기
            trigger="@"
            data={memberData?.map((v) => ({ id: v.id, display: v.nickname })) || []}
            renderSuggestion={renderUserSuggestion}
          />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;