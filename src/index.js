//imports
import renderProjects from "./dom/renderProjects.js";
import createTodo from "./modules/todo.js";
import { addProject, getProjects, addTodoToProject } from "./modules/projectManager.js";
import renderTodos from "./dom/renderTodos.js";
import { format } from "date-fns";
import "./styles/styles.css";
import { setupDomEvents } from "./dom/domEvents.js";

//clickable sidebar
const sidebar = document.querySelector("#projectSidebar");

//default dueDate
const dueDate = format(new Date(), "MM-dd-yyyy");

//currently loaded project
let currentProjectId = null;

//projects
const studyproject = addProject("Study");

//todos for studyproject
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
studying.dueDate = format(new Date(2026, 2, 15), "MM-dd-yyyy");

const studying2 = createTodo(
  "Study Math",
  "Figure out 2+2...It's so confusing...",
  dueDate,
  "red"
);
studying2.addChecklistItem("Use Calculator");
studying2.dueDate = format(new Date(2026, 3, 21), "MM-dd-yyyy");

// dd todos to project
addTodoToProject(studyproject.id, studying);
addTodoToProject(studyproject.id, studying2);

//render projects
renderProjects();

//auto render first project
const projects = getProjects();
if (projects.length > 0) {
  currentProjectId = projects[0].id;
  renderTodos(currentProjectId);
}

setupDomEvents({ value: currentProjectId });