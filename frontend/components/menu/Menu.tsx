import React, { CSSProperties, FC, ReactNode, useCallback } from "react";
import { CloseModalButton, CreateMenu } from "@components/menu/style";

interface Props{
  show:boolean;
  onCloseModal:(e:any)=>void;
  style:CSSProperties;
  closeButton?:boolean;
  children:ReactNode;
}

const Menu:FC<Props>  = ({ style, show, onCloseModal, closeButton,children }) => {
  {/* 본인을 클릭할 시 모달이 닫히면 안된다. */}
  const stopPropagation = useCallback((e:React.MouseEvent<HTMLDivElement>)=>{
    e.stopPropagation();
   },[])
  //( ************************************
  if(!show) return null;
  return (
    // 바깥 영역을 클릭시 모달이 자동으로 닫히게 하고(이벤트 버블링을 방지)
    <CreateMenu onClick={onCloseModal}>
      <div onClick={stopPropagation} style={style}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};

Menu.defaultProps={
  closeButton:true,
}
export default Menu;
