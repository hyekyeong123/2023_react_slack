import dayjs from "dayjs";
import { IDM } from "@typings/db";

// 채팅 목록을 날짜별로 그룹화하기
//[{id:1. createdAt:"2021-02-25"},{id:1. createdAt:"2021-02-25"}]
export default function makeSection(chatList:IDM[]){
  const sections:{[key:string]:IDM[]} = {};
  chatList.forEach((chat) => {
    const monthData = dayjs(chat.createdAt).format('YYYY-MM-DD');
    
    // 이미 만들었다면 채팅 내용만 넣어주기
    if(Array.isArray(sections[monthData])){
      sections[monthData].push(chat);
    }else{
      
      // 배열 생성해주고 채팅 내용 또한 넣어주기
      sections[monthData] = [chat];
    }
  });
  return sections;
}