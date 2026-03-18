import { getProjects } from "../modules/projectManager.js";

function renderProjects(currentProjectId) {
  const sidebar = document.querySelector("#projectSidebar");
  const projects = getProjects();

  //clear sidebar before rendering
  sidebar.innerHTML = "";

  projects.forEach((project) => {
    const projectElement = document.createElement("div");
    projectElement.textContent = project.name;
    //attach project id to the element
    projectElement.dataset.id = project.id;
    projectElement.classList.add("project-item");

    if (currentProjectId && project.id === currentProjectId) {
      projectElement.classList.add("active");
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.classList.add("project-delete-btn");
    deleteBtn.dataset.id = project.id;
    projectElement.appendChild(deleteBtn);

    sidebar.appendChild(projectElement);
  });
  const addProjectBtn = document.createElement("button");
  addProjectBtn.id = "addProjectBtn";
  addProjectBtn.textContent = "+ Add Project";
  addProjectBtn.style.marginTop = "10px";
  sidebar.appendChild(addProjectBtn);
}

export default renderProjects;
