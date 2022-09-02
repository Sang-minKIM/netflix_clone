import React from "react";
import { useSetRecoilState } from "recoil";
import { Categories, ITodo, toDoAtom } from "./atoms";

function ToDo({ text, category, id }: ITodo) {
  const setToDos = useSetRecoilState(toDoAtom);
  const setCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = event.currentTarget;

    //e.target will be one of the 10 buttons and e.currentTarget will always be the "btns" clip.

    setToDos((oldToDos) => {
      const targetIndex = oldToDos.findIndex((oldToDo) => oldToDo.id === id);
      const newToDo = { text, id, category: name as Categories };
      return [
        ...oldToDos.slice(0, targetIndex),
        newToDo,
        ...oldToDos.slice(targetIndex + 1),
      ];
    });
  };
  const DeleteToDo = () => {
    setToDos((oldToDos) => {
      const targetIndex = oldToDos.findIndex((oldToDo) => oldToDo.id === id);
      return [
        ...oldToDos.slice(0, targetIndex),
        ...oldToDos.slice(targetIndex + 1),
      ];
    });
  };
  return (
    <li>
      <span>{text}</span>
      {category !== Categories.DOING && (
        <button name={Categories.DOING} onClick={setCategory}>
          Doing
        </button>
      )}
      {category !== Categories.TO_DO && (
        <button name={Categories.TO_DO} onClick={setCategory}>
          To Do
        </button>
      )}
      {category !== Categories.DONE && (
        <button name={Categories.DONE} onClick={setCategory}>
          Done
        </button>
      )}
      <button onClick={DeleteToDo}>❎</button>
    </li>
  );
}
export default ToDo;
