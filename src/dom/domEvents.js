// import the modules needed for todos and projects
import createTodo from '../modules/todo.js';
import { addTodoToProject, getProjects, addProject } from '../modules/projectManager.js';
import renderTodos from './renderTodos.js';
import renderProjects from './renderProjects.js';

export function setupDomEvents(currentProjectIdRef) {
  // select the sidebar element
  const sidebar = document.querySelector('#projectSidebar');

  // select todo modal elements
  const addTaskBtn = document.querySelector('#addTaskBtn');
  const todoModal = document.querySelector('#todoModal');
  const todoForm = document.querySelector('#todoForm');
  const todoTitle = document.querySelector('#todoTitle');
  const todoDesc = document.querySelector('#todoDesc');
  const todoDate = document.querySelector('#todoDate');
  const todoPriority = document.querySelector('#todoPriority');
  const todoProject = document.querySelector('#todoProject');

  // select project modal elements
  const projectModal = document.querySelector('#projectModal');
  const projectForm = document.querySelector('#projectForm');
  const projectNameInput = document.querySelector('#projectName');

  // helper function to populate the project dropdown in the todo modal
  function populateProjectDropdown() {
    const projects = getProjects();
    todoProject.innerHTML = '';
    projects.forEach(project => {
      const option = document.createElement('option');
      option.value = project.id;
      option.textContent = project.name;
      todoProject.appendChild(option);
    });
  }

  // render the sidebar projects initially
  renderProjects(currentProjectIdRef.value);

  // select the add project button after rendering
  const addProjectBtn = document.querySelector('#addProjectBtn');

  // add click listener to open the todo modal
  addTaskBtn.addEventListener('click', () => {
    populateProjectDropdown();
    todoProject.value = currentProjectIdRef.value;
    todoModal.classList.add('show');
  });

  // add click listener to close the todo modal if clicked outside
  todoModal.addEventListener('click', (e) => {
    if (e.target === todoModal) todoModal.classList.remove('show');
  });

  // add escape key listener to close both modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'escape') {
      todoModal.classList.remove('show');
      projectModal.classList.remove('show');
    }
  });

  // add submit listener to todo form to create new todo
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = todoTitle.value;
    const desc = todoDesc.value;
    const date = todoDate.value;
    const priority = todoPriority.value;
    const projectId = todoProject.value;

    if (!projectId) {
      alert('please select a project!');
      return;
    }

    const newTodo = createTodo(title, desc, date, priority);
    addTodoToProject(projectId, newTodo);
    renderTodos(projectId);

    todoModal.classList.remove('show');
    todoForm.reset();
    todoProject.value = currentProjectIdRef.value;
  });

  // add click listener to open the project modal
  addProjectBtn.addEventListener('click', () => {
    projectModal.classList.add('show');
  });

  // add click listener to close project modal if clicked outside
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) projectModal.classList.remove('show');
  });

  // add submit listener to project form to create new project
  projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = projectNameInput.value.trim();
    if (!name) return;

    const newProject = addProject(name);
    currentProjectIdRef.value = newProject.id;

    renderProjects(currentProjectIdRef.value);
    populateProjectDropdown();

    projectModal.classList.remove('show');
    projectForm.reset();
  });

  // add click listener to sidebar to switch projects
  sidebar.addEventListener('click', (e) => {
    const projectId = e.target.dataset.id;
    if (!projectId) return;

    currentProjectIdRef.value = projectId;
    renderTodos(currentProjectIdRef.value);
    renderProjects(currentProjectIdRef.value);
  });
}