//imports
import renderProjects from "./dom/renderProjects.js";
import { getProjects } from "./modules/projectManager.js";
import renderTodos from "./dom/renderTodos.js";
import "./styles/styles.css";
import { setupDomEvents } from "./dom/domEvents.js";
import { addProject, addTodoToProject } from "./modules/projectManager.js";
import createTodo from "./modules/todo.js";
import { format } from "date-fns"; 


//auto render first project
const projects = getProjects();
let currentProjectId = null;

if (projects.length > 0) {
  currentProjectId = projects[0].id;
  renderTodos(currentProjectId);
} else {
  const welcomeProject = addProject("Welcome!");
  const welcomeTodo = createTodo(
    "Welcome to Todo Listifier!",
    "This is a default description, click the 'Add Project' button to get started!",
    format(new Date(), "MM/dd/yyyy"),
    "high",
    [{ text: "Add Checklist Items As Well!", done: true }],
    "This is where you can enter and edit notes..."
  )

  addTodoToProject(welcomeProject.id, welcomeTodo);
  currentProjectId = welcomeProject.id;
  renderTodos(currentProjectId);
}

//render projects
renderProjects(currentProjectId);
setupDomEvents({ value: currentProjectId });