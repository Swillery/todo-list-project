//imports
import renderProjects from "./dom/renderProjects.js";
import createTodo from "./modules/todo.js";
import { addProject, getProjects, addTodoToProject } from "./modules/projectManager.js";
import renderTodos from "./dom/renderTodos.js";
import { format } from "date-fns";
import "./styles/styles.css";

//clickable sidebar
const sidebar = document.querySelector("#projectSidebar");

//default dueDate
const dueDate = format(new Date(), "yyyy-MM-dd");

//currently loaded project
let currentProjectId = null;

//projects
const studyproject = addProject("Study");

//todos for p1
//todo1
const studying = createTodo(
  "Study Webpack",
  "Review modules and bundling",
  dueDate,
  "green",
  [],
  "Don't Give Up!",
);
studying.addChecklistItem("Watch lesson");
studying.addChecklistItem("Take notes");
studying.toggleComplete();
studying.dueDate = format(new Date(2026, 2, 15), "yyyy-MM-dd");

//todo2
const studying2 = createTodo(
  "Study Math",
  "Figure out 2+2...It's so confusing...",
  dueDate,
  "red"
);
studying2.addChecklistItem("Use Calculator");
studying2.dueDate = format(new Date(2026, 3, 21), "yyyy-MM-dd");

//add todos to projects
addTodoToProject(studyproject.id, studying);
addTodoToProject(studyproject.id, studying2);

console.log(JSON.stringify(getProjects(), null, 2)); //cleaner console log ( ~JSON.stringify(data, replacer, spacing)~ )

//console.table(getProjects()[0].todos); ~~~ use this to get tabled todo's for individual projects

//call renders
renderProjects()

//auto render first project
const projects = getProjects();

if (projects.length > 0) {
  currentProjectId = projects[0].id;
  renderTodos(currentProjectId);
}

//modal task button
const addTaskBtn = document.querySelector("#addTaskBtn");
const modal = document.querySelector("#todoModal");

// open modal
addTaskBtn.addEventListener("click", () => {
  modal.classList.add("show");
});

// close modal (click outside)
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

// close modal (Escape key)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.classList.remove("show");
  }
});

//sidebar clicks
sidebar.addEventListener("click", (e) => {

  const projectId = e.target.dataset.id;

  if (!projectId) return;

  currentProjectId = projectId;

  console.log("Project clicked:", projectId);

  renderTodos(projectId);

});