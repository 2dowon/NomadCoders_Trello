import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { toDoState } from "../atoms";
import { useRecoilState } from "recoil";

const Card = styled.div<{ isDragging: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  word-break: break-all;
  word-wrap: break-word;
  position: relative;
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: ${(props) => props.theme.cardColor};
  padding: 10px;
  background-color: ${(props) =>
    props.isDragging ? "#FDD20E" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.05)" : "none"};
`;

const TextBox = styled.div`
  width: 90%;
`;

const DeleteBtn = styled.button`
  position: absolute;
  right: 10px;
  border: none;
  background-color: transparent;
  font-size: 10px;
`;

interface IDragabbleCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}

function DragabbleCard({
  toDoId,
  toDoText,
  index,
  boardId,
}: IDragabbleCardProps) {
  const [toDos, setToDos] = useRecoilState(toDoState);

  const onDeleteCard = (toDoId: number) => {
    const boardTodos = { ...toDos }[boardId].filter(
      (todo) => todo.id !== toDoId
    );
    setToDos((allBoards) => {
      return { ...allBoards, [boardId]: boardTodos };
    });
  };

  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          <TextBox>{toDoText}</TextBox>
          <DeleteBtn
            onClick={() => {
              onDeleteCard(toDoId);
            }}
          >
            <i className="fas fa-times"></i>
          </DeleteBtn>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DragabbleCard);
