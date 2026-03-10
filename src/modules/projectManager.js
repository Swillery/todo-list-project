import createProject from "./project.js";

const projects = [];

function addProject(name) {
  const project = createProject(name);
  projects.push(project);
  return project;
}

function getProjects() {
  return projects;
}

function addTodoToProject(projectId, todo) {
  const project = projects.find(p => p.id === projectId);
  if (project) {
    project.addTodo(todo);
  }
}

export { addProject, getProjects, addTodoToProject };