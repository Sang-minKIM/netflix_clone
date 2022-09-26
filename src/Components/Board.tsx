import { useForm } from "react-hook-form";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { ITodo, toDoState } from "../atom";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div`
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  width: 100%;
  min-height: 300px;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 700;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Area = styled.div<ISnapshotProps>`
  flex-grow: 1;
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#b2bec3"
      : props.draggingFromThisWith
      ? "#dfe6e9"
      : "transparent"};
  transition: 0.3s ease-in;
  padding: 15px;
`;
const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;

interface ISnapshotProps {
  isDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}
interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onVaild = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return { ...allBoards, [boardId]: [...allBoards[boardId], newToDo] };
    });
    setValue("toDo", "");
  };
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onVaild)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {toDos.map((todo, index) => (
              <DraggableCard
                key={todo.id}
                toDoId={todo.id}
                toDoText={todo.text}
                index={index}
              />
              //  key와 draggableId가 같아야한다.
            ))}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}
export default Board;
