import { getProjects } from "../modules/projectManager.js";

function renderProjects() {
  const sidebar = document.querySelector("#projectSidebar");
  const projects = getProjects();

  //clear sidebar before rendering
  sidebar.innerHTML = "";

  projects.forEach(project => {
    const projectElement = document.createElement("div");

    projectElement.textContent = project.name;

    //attach project id to the element
    projectElement.dataset.id = project.id;

    projectElement.classList.add("project-item");

    sidebar.appendChild(projectElement);
  });
}

export default renderProjects;