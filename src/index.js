import createTodo from "./modules/todo.js";
import { format } from "date-fns";

const todos = [];

const dueDate = format(new Date(), "yyyy-MM-dd");

const todo = createTodo(
  "Study Webpack",
  "Review modules and bundling",
  dueDate,
  "green"
);

todo.addChecklistItem("Watch lesson");
todo.addChecklistItem("Take notes");

todo.toggleComplete();

todos.push(todo);

console.log(todos);