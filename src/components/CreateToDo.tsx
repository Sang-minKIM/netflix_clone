import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { categoryState, toDoAtom } from "./atoms";

interface IForm {
  toDo: string;
}

function CreateToDo() {
  const [toDos, setToDos] = useRecoilState(toDoAtom);
  const category = useRecoilValue(categoryState);
  const { register, handleSubmit, setValue } = useForm<IForm>();

  const onValid = (data: IForm) => {
    console.log("add to do", data.toDo);
    setValue("toDo", "");
    setToDos((oldToDos) => [
      {
        text: data.toDo,
        id: Date.now(),
        category: category,
      },
      ...oldToDos,
    ]);
  };
  useEffect(
    () => localStorage.setItem("toDos", JSON.stringify(toDos)),
    [toDos]
  );
  return (
    <form onSubmit={handleSubmit(onValid)}>
      <input
        {...register("toDo", {
          required: "Please write a To Do",
        })}
        placeholder="Write a to do"
      />
      <button>Add</button>
    </form>
  );
}
export default CreateToDo;
