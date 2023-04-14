import styles from "../../CSSFiles/card.module.scss";
export const Card = ({ listOfTodos }: any) => {
  return listOfTodos.map((todo: any) => {
    return (
      <ul key={todo.id}>
        <li>{todo.content}</li>
      </ul>
    );
  });
};
