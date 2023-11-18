import React, { FC, ReactNode, useCallback } from "react";
import { CloseModalButton } from "@components/modal/style";
import { CreateModal } from "@components/modal/style";

interface Props{
  show:boolean;
  onCloseModal:()=>void;
  children:ReactNode;
}

// 클릭시 중앙에 뜨는 팝업칭
const Modal:FC<Props> = ({
 show, onCloseModal, children
}) => {
  const stopPropagation = useCallback((e:React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);
  
  if(!show){return null}
  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;
