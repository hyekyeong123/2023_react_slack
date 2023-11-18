import React, { CSSProperties, FC, ReactNode, useCallback } from "react";
import { CloseModalButton, CreateMenu } from "@components/menu/style";

interface Props{
  show:boolean;
  onCloseModal:(e:any)=>void;
  style:CSSProperties;
  closeButton?:boolean;
  children:ReactNode;
}

// 클릭했을때 바로 밑에 뜨는 팝업창
const Menu:FC<Props>  = ({
  style, show, onCloseModal, closeButton,children
}) => {
  
  {/* 자식을 클릭할 시 부모의 onCloseModal function을 방해 (닫힘 이벤트 버블링을 방지)*/}
  const stopPropagation = useCallback((e:React.MouseEvent<HTMLDivElement>)=>{
    e.stopPropagation();
   },[])
  //( ************************************
  if(!show) return null;
  return (
    // 바깥 영역을 클릭시 모달이 자동으로 닫히게 하고
    <CreateMenu onClick={onCloseModal}>
      <div
        onClick={stopPropagation}
        style={style}
      >
        {closeButton && <CloseModalButton
          onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};

Menu.defaultProps={
  closeButton:true,
}
export default Menu;
