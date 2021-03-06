import { useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";

const Wrapper = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  padding: 50px;
`;

const Boards = styled.div<{ isDraggingOver: boolean }>`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
  gap: 10px;
  margin-top: 100px;
`;

const AddForm = styled.form`
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  padding: 50px 0;
  background-color: #3f8cf3;
  input {
    width: 80%;
    max-width: 300px;
    font-size: 16px;
    border: 0;
    background-color: white;
    padding: 15px 10px;
    border-radius: 5px;
    text-align: center;
    margin: 0 auto;
  }
`;

interface IDeleteBtnProps {
  isDraggingOver: boolean;
}

const DeleteBtn = styled.div<IDeleteBtnProps>`
  width: 70px;
  height: 70px;
  font-size: 30px;
  color: ${(props) => (props.isDraggingOver ? "red" : "white")};
  border: ${(props) =>
    props.isDraggingOver ? "2px solid red" : "2px solid white"};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 50%;
  transition: transform 100ms ease-in;
  transform: ${(props) =>
    props.isDraggingOver
      ? "scale(1.1) translate(-50%, -50%)"
      : "translate(-50%, -50%)"};
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source, draggableId } = info;
    console.log(destination, source, draggableId);
    if (!destination) return;
    if (destination.droppableId === "deleteBtn") {
      if (source.droppableId !== "boards") {
        setToDos((allBoards) => {
          const boardCopy = [...allBoards[source.droppableId]];
          boardCopy.splice(source.index, 1);
          return {
            ...allBoards,
            [source.droppableId]: boardCopy,
          };
        });
        return;
      } else {
        const boardsCopy = { ...toDos };
        delete boardsCopy[draggableId];
        setToDos(boardsCopy);
        return;
      }
    }

    if (
      source.droppableId !== "boards" &&
      destination.droppableId !== "boards"
    ) {
      if (destination?.droppableId === source.droppableId) {
        // same board movement.
        setToDos((allBoards) => {
          const boardCopy = [...allBoards[source.droppableId]];
          const taskObj = boardCopy[source.index];
          boardCopy.splice(source.index, 1);
          boardCopy.splice(destination?.index, 0, taskObj);
          return {
            ...allBoards,
            [source.droppableId]: boardCopy,
          };
        });
      }
      if (destination.droppableId !== source.droppableId) {
        // cross board movement
        setToDos((allBoards) => {
          const sourceBoard = [...allBoards[source.droppableId]];
          const taskObj = sourceBoard[source.index];
          const destinationBoard = [...allBoards[destination.droppableId]];
          sourceBoard.splice(source.index, 1);
          destinationBoard.splice(destination?.index, 0, taskObj);
          return {
            ...allBoards,
            [source.droppableId]: sourceBoard,
            [destination.droppableId]: destinationBoard,
          };
        });
      }
    }
  };

  // ????????? ?????? ??????
  const [value, setValue] = useState<string>("");
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setValue(value);
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToDos((allBoards) => {
      return { ...allBoards, [value]: [] };
    });
    setValue("");
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <AddForm onSubmit={onSubmit}>
        <input
          value={value}
          onChange={onChange}
          type="text"
          placeholder="Add New Board"
        />
      </AddForm>
      <Wrapper>
        <Droppable droppableId="boards">
          {(magic, snapshot) => (
            <Boards
              isDraggingOver={snapshot.isDraggingOver}
              ref={magic.innerRef}
              {...magic.droppableProps}
            >
              {Object.keys(toDos).map((boardId, index) => (
                <Board
                  boardId={boardId}
                  key={boardId}
                  toDos={toDos[boardId]}
                  index={index}
                />
              ))}
            </Boards>
          )}
        </Droppable>
      </Wrapper>
      <Droppable droppableId="deleteBtn">
        {(magic, snapshot) => (
          <DeleteBtn
            isDraggingOver={snapshot.isDraggingOver}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            <i className="fas fa-trash"></i>
          </DeleteBtn>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
