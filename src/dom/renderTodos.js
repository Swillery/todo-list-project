import { getProjects } from "../modules/projectManager.js";

function createTodoElement(todo) {
  const todoElement = document.createElement("div");

  todoElement.dataset.id = todo.id;

  todoElement.classList.add("todo-item");

  const title = document.createElement("h3");
  title.textContent = todo.title;

  const dueDate = document.createElement("p");
  dueDate.textContent = `Due: ${todo.dueDate}`;

  const desc = document.createElement("p");
  desc.textContent = todo.desc;

  todoElement.appendChild(title);
  todoElement.appendChild(desc);
  todoElement.appendChild(dueDate);

  return todoElement;
}

function renderTodos(projectId) {

  const todoContainer = document.querySelector("#todoContainer");

  const projects = getProjects();

  const project = projects.find(p => p.id === projectId);

  if (!project) return;

  todoContainer.innerHTML = "";

  const projectTitle = document.createElement("h2");
  projectTitle.textContent = project.name;

  todoContainer.appendChild(projectTitle);

  project.todos.forEach(todo => {

    const todoElement = createTodoElement(todo);

    todoContainer.appendChild(todoElement);

  });

}

export default renderTodos;