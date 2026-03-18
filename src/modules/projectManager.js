import createProject from "./project.js";
import createTodo from "./todo.js";

const projects = [];
//local storage
const saved = localStorage.getItem("projects");

if (saved) {
  JSON.parse(saved).forEach((rawProject) => {
    const project = createProject(rawProject.name);
    project.id = rawProject.id;

    rawProject.todos.forEach((rawTodo) => {
      const todo = createTodo(
        rawTodo.title,
        rawTodo.desc,
        rawTodo.dueDate,
        rawTodo.priorityColor,
        rawTodo.checklist,
        rawTodo.notes,
      );
      todo.id = rawTodo.id;
      todo.completed = rawTodo.completed;
      project.todos.push(todo);
    });

    projects.push(project);
  });
}

//save helper function
function save() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function addProject(name) {
  const project = createProject(name);
  projects.push(project);
  save();
  return project;
}

function getProjects() {
  return projects;
}

function addTodoToProject(projectId, todo) {
  const project = projects.find((p) => p.id === projectId);
  if (project) {
    project.addTodo(todo);
    save();
  }
}

function deleteProject(projectID) {
  const index = projects.findIndex((p) => p.id === projectID);

  if (index !== -1) {
    projects.splice(index, 1);
    save();
  }
}

export { addProject, getProjects, addTodoToProject, save, deleteProject };
