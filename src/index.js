//imports
import renderProjects from "./dom/renderProjects.js";
import { getProjects } from "./modules/projectManager.js";
import renderTodos from "./dom/renderTodos.js";
import "./styles/styles.css";
import { setupDomEvents } from "./dom/domEvents.js";



//auto render first project
const projects = getProjects();
let currentProjectId = null;

if (projects.length > 0) {
  currentProjectId = projects[0].id;
  renderTodos(currentProjectId);
}


//render projects
renderProjects(currentProjectId);
setupDomEvents({ value: currentProjectId });