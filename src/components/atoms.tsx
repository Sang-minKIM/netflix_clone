import { atom, selector } from "recoil";

export enum Categories {
  "TO_DO" = "TO_DO",
  "DOING" = "DOING",
  "DONE" = "DONE",
}

export interface ITodo {
  text: string;
  id: number;
  category: Categories;
}
const savedToDos = localStorage.getItem("toDos");

export const toDoAtom = atom<ITodo[]>({
  key: "toDo",
  default: savedToDos ? JSON.parse(savedToDos) : [],
});

export const categoryState = atom<ITodo["category"]>({
  key: "category",
  default: Categories.TO_DO,
});

export const toDoSelector = selector({
  key: "toDoSelector",
  get: ({ get }) => {
    const toDos = get(toDoAtom);
    const category = get(categoryState);
    return toDos.filter((toDo) => toDo.category === category);
  },
});
