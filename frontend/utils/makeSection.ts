import dayjs from "dayjs";
import { IDM } from "@typings/db";

export default function makeSection(chatList:IDM[]){
  const sections:{[key:string]:IDM[]} = {};
  chatList.forEach((chat) => {
    const monthData = dayjs(chat.createdAt).format('YYYY-MM-DD');
    
    // 이미 만들었다면
    if(Array.isArray(sections[monthData])){
      sections[monthData].push(chat);
    }else{
      sections[monthData] = [chat];
    }
  });
  return sections;
}