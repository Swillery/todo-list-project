import createTodo from '../modules/todo.js';
import { addTodoToProject, getProjects, addProject } from '../modules/projectManager.js';
import renderTodos from './renderTodos.js';
import renderProjects from './renderProjects.js';

// helper to build details content
export function buildDetailsContent(todo) {
  const container = document.createElement("div");
  container.classList.add("todo-details");

  if (todo.notes) {
    const notes = document.createElement("p");

    // make sure notes is a string
    if (typeof todo.notes === "object") {
      notes.textContent = todo.notes.text ?? JSON.stringify(todo.notes);
    } else {
      notes.textContent = `Notes: ${todo.notes}`;
    }

    container.appendChild(notes);
  }

  if (todo.checklist && todo.checklist.length > 0) {
    const checklistContainer = document.createElement("ul");
    todo.checklist.forEach((item, index) => {
      const li = document.createElement("li");

      const itemCheckbox = document.createElement("input");
      itemCheckbox.type = "checkbox";
      itemCheckbox.checked = todo.completedItems?.includes(index) || false;

      const label = document.createElement("span");

      // make sure item is a string
      if (typeof item === "object") {
        // if your checklist is an object with text property
        label.textContent = item.text ?? JSON.stringify(item);
      } else {
        label.textContent = item;
      }

      li.appendChild(itemCheckbox);
      li.appendChild(label);
      checklistContainer.appendChild(li);
    });
    container.appendChild(checklistContainer);
  }

  return container;
}

export function setupDomEvents(currentProjectIdRef) {
  const sidebar = document.querySelector('#projectSidebar');

  // todo modal
  const addTaskBtn = document.querySelector('#addTaskBtn');
  const todoModal = document.querySelector('#todoModal');
  const todoForm = document.querySelector('#todoForm');
  const todoTitle = document.querySelector('#todoTitle');
  const todoDesc = document.querySelector('#todoDesc');
  const todoDate = document.querySelector('#todoDate');
  const todoPriority = document.querySelector('#todoPriority');
  const todoProject = document.querySelector('#todoProject');

  // project modal
  const addProjectBtn = document.querySelector('#addProjectBtn');
  const projectModal = document.querySelector('#projectModal');
  const projectForm = document.querySelector('#projectForm');
  const projectNameInput = document.querySelector('#projectName');

  // details modal
  const detailsModal = document.querySelector("#todoDetailsModal");
  const detailsContent = document.querySelector("#todoDetailsContent");

  const todoContainer = document.querySelector("#todoContainer");

  // helper to populate project dropdown
  function populateProjectDropdown() {
    todoProject.innerHTML = '';
    getProjects().forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      todoProject.appendChild(opt);
    });
  }

  renderProjects(currentProjectIdRef.value);

  // todo modal
  addTaskBtn.addEventListener("click", () => {
    populateProjectDropdown();
    todoProject.value = currentProjectIdRef.value;
    todoModal.classList.add("show");
  });

  todoModal.addEventListener("click", e => {
    if (e.target === todoModal) todoModal.classList.remove("show");
  });

  // project modal
  addProjectBtn.addEventListener("click", () => projectModal.classList.add("show"));
  projectModal.addEventListener("click", e => {
    if (e.target === projectModal) projectModal.classList.remove("show");
  });

  // escape closes all modals
  document.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "escape") {
      todoModal.classList.remove("show");
      projectModal.classList.remove("show");
      detailsModal.classList.remove("show");
    }
  });

  // handle new todo
  todoForm.addEventListener("submit", e => {
    e.preventDefault();
    const newTodo = createTodo(
      todoTitle.value,
      todoDesc.value,
      todoDate.value,
      todoPriority.value
    );

    console.log(todoPriority);
    addTodoToProject(todoProject.value, newTodo);
    renderTodos(todoProject.value);
    todoModal.classList.remove("show");
    todoForm.reset();
    todoProject.value = currentProjectIdRef.value;
  });

  // handle new project
  projectForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = projectNameInput.value.trim();
    if (!name) return;
    const newProject = addProject(name);
    currentProjectIdRef.value = newProject.id;
    renderProjects(currentProjectIdRef.value);
    populateProjectDropdown();
    projectModal.classList.remove("show");
    projectForm.reset();
  });

  // sidebar project clicks
  sidebar.addEventListener("click", e => {
    const projectId = e.target.dataset.id;
    if (!projectId) return;
    currentProjectIdRef.value = projectId;
    renderTodos(projectId);
    renderProjects(projectId);
  });

  todoContainer.addEventListener("click", e => {
    const todoEl = e.target.closest(".todo-item");
    if (!todoEl) return;

    const projectId = todoEl.dataset.projectId;
    const project = getProjects().find(p => p.id === projectId);
    const todo = project.todos.find(t => t.id === todoEl.dataset.id);

    // toggle completion
    if (e.target.tagName === "INPUT" && e.target.type === "checkbox" && !e.target.classList.contains("todo-checklist-checkbox")) {
      todo.toggleComplete();
      renderTodos(projectId);
    }

    // delete todo
    if (e.target.classList.contains("todo-delete-btn")) {
      project.todos = project.todos.filter(t => t.id !== todo.id);
      renderTodos(projectId);
    }

    // open details modal
    if (e.target.classList.contains("todo-details-btn")) {
      detailsContent.innerHTML = "";
      detailsContent.appendChild(buildDetailsContent(todo));
      detailsModal.classList.add("show");
    }
  });

  // close details modal on overlay click
  detailsModal.addEventListener("click", e => {
    if (e.target === detailsModal) detailsModal.classList.remove("show");
  });
}