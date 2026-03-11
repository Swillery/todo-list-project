import { getProjects } from "../modules/projectManager.js";

function createTodoElement(todo, projectId) {
  const todoElement = document.createElement("div");
  todoElement.dataset.id = todo.id;
  todoElement.dataset.projectId = projectId; // needed for event delegation
  todoElement.classList.add("todo-item");

  // checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;

  todoElement.appendChild(checkbox);

  // title
  const title = document.createElement("h3");
  title.textContent = todo.title;
  todoElement.appendChild(title);

  // description
  const desc = document.createElement("p");
  desc.textContent = todo.desc;
  todoElement.appendChild(desc);

  // due date
  const dueDate = document.createElement("p");
  dueDate.textContent = `Due: ${todo.dueDate}`;
  todoElement.appendChild(dueDate);

  // details button
  const detailsBtn = document.createElement("button");
  detailsBtn.textContent = "Details";
  detailsBtn.classList.add("todo-details-btn"); // for delegation
  todoElement.appendChild(detailsBtn);

  // delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑";
  deleteBtn.classList.add("todo-delete-btn");
  todoElement.appendChild(deleteBtn);

  // style completed
  if (todo.completed) todoElement.classList.add("completed");

  return todoElement;
}

function renderTodos(projectId) {
  const todoContainer = document.querySelector("#todoContainer");
  const projects = getProjects();
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  todoContainer.innerHTML = "";

  // project title
  const projectTitle = document.createElement("h2");
  projectTitle.textContent = project.name;
  todoContainer.appendChild(projectTitle);

  // render each todo
  project.todos.forEach(todo => {
    const todoEl = createTodoElement(todo, projectId);
    todoContainer.appendChild(todoEl);
  });
}

export default renderTodos;