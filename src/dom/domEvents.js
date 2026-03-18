import createTodo from "../modules/todo.js";
import {
  addTodoToProject,
  getProjects,
  addProject,
  save,
  deleteProject,
} from "../modules/projectManager.js";
import renderTodos from "./renderTodos.js";
import renderProjects from "./renderProjects.js";
import { format } from "date-fns";

// helper to build details content
export function buildDetailsContent(todo) {
  const container = document.createElement("div");
  container.classList.add("todo-details");

  const notesLabel = document.createElement("label");
  notesLabel.textContent = "Notes";

  const notesField = document.createElement("textarea");
  notesField.value = todo.notes || "";
  notesField.placeholder = "Add a note...";

  // save back to the todo object on every keystroke
  notesField.addEventListener("input", () => {
    todo.notes = notesField.value;
    save();
  });

  container.appendChild(notesLabel);
  container.appendChild(notesField);

  if (todo.checklist && todo.checklist.length > 0) {
    const checklistContainer = document.createElement("ul");
    todo.checklist.forEach((item, index) => {
      const li = document.createElement("li");

      const itemCheckbox = document.createElement("input");
      itemCheckbox.type = "checkbox";
      itemCheckbox.checked = item.done || false;

      itemCheckbox.addEventListener("change", () => {
        todo.checklist[index].done = itemCheckbox.checked;
        save();
      });

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
  const sidebar = document.querySelector("#projectSidebar");

  // todo modal
  const addTaskBtn = document.querySelector("#addTaskBtn");
  const todoModal = document.querySelector("#todoModal");
  const todoForm = document.querySelector("#todoForm");
  const todoTitle = document.querySelector("#todoTitle");
  const todoDesc = document.querySelector("#todoDesc");
  const todoDate = document.querySelector("#todoDate");
  const todoNotes = document.querySelector("#todoNotes");
  const todoPriority = document.querySelector("#todoPriority");
  const todoProject = document.querySelector("#todoProject");
  const checklistInput = document.querySelector("#checklistInput");
  const addChecklistItemBtn = document.querySelector("#addChecklistItemBtn");
  const checklistPreview = document.querySelector("#checklistPreview");
  let pendingChecklist = [];

  // project modal
  const projectModal = document.querySelector("#projectModal");
  const projectForm = document.querySelector("#projectForm");
  const projectNameInput = document.querySelector("#projectName");

  // details modal
  const detailsModal = document.querySelector("#todoDetailsModal");
  const detailsContent = document.querySelector("#todoDetailsContent");

  const todoContainer = document.querySelector("#todoContainer");

  // helper to populate project dropdown
  function populateProjectDropdown() {
    todoProject.innerHTML = "";
    getProjects().forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      todoProject.appendChild(opt);
    });
  }

  // todo modal
  addTaskBtn.addEventListener("click", () => {
    populateProjectDropdown();
    todoProject.value = currentProjectIdRef.value;
    todoModal.classList.add("show");
  });

  todoModal.addEventListener("click", (e) => {
    if (e.target === todoModal) todoModal.classList.remove("show");
  });

  // project modal
  projectModal.addEventListener("click", (e) => {
    if (e.target === projectModal) projectModal.classList.remove("show");
  });

  // escape closes all modals
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "escape") {
      todoModal.classList.remove("show");
      projectModal.classList.remove("show");
      detailsModal.classList.remove("show");
    }
  });

  //checklist in form modal
  addChecklistItemBtn.addEventListener("click", () => {
    const text = checklistInput.value.trim();
    if (!text) return;

    pendingChecklist.push(text);

    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.textContent = text;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.type = "button";
    removeBtn.style.cssText =
      "background:none; border:none; cursor:pointer; opacity:0.5;";

    removeBtn.addEventListener("click", () => {
      const index = pendingChecklist.indexOf(text);
      if (index !== -1) pendingChecklist.splice(index, 1);
      li.remove();
    });

    li.appendChild(removeBtn);
    checklistPreview.appendChild(li);
    checklistInput.value = "";
    checklistInput.focus();
  });

  // handle new todo
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTodo = createTodo(
      todoTitle.value,
      todoDesc.value,
      format(new Date(todoDate.value + "T00:00:00"), "MM/dd/yyyy"),
      todoPriority.value,
      pendingChecklist.map((text) => ({ text, done: false })),
      todoNotes.value,
    );

    addTodoToProject(todoProject.value, newTodo);
    renderTodos(todoProject.value);
    todoModal.classList.remove("show");
    todoForm.reset();
    pendingChecklist = [];
    checklistPreview.innerHTML = "";
    todoProject.value = currentProjectIdRef.value;
  });

  // handle new project
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = projectNameInput.value.trim();
    if (!name) return;
    const newProject = addProject(name);
    currentProjectIdRef.value = newProject.id;
    renderProjects(currentProjectIdRef.value);
    renderTodos(currentProjectIdRef.value);
    populateProjectDropdown();
    projectModal.classList.remove("show");
    projectForm.reset();
  });

  // sidebar project clicks
  sidebar.addEventListener("click", (e) => {
    if (e.target.id === "addProjectBtn") {
      projectModal.classList.add("show");
      return;
    }

    if (e.target.classList.contains("project-delete-btn")) {
      const projectID = e.target.dataset.id;
      deleteProject(projectID);

      if (currentProjectIdRef.value === projectID) {
        const remaining = getProjects();
        if (remaining.length > 0) {
          currentProjectIdRef.value = remaining[0].id;
          renderTodos(currentProjectIdRef.value);
        } else {
          currentProjectIdRef.value = null;
          document.querySelector("#todoContainer").innerHTML = "";
        }
      }

      renderProjects(currentProjectIdRef.value);
      return;
    }

    const projectId = e.target.dataset.id;
    if (!projectId) return;
    currentProjectIdRef.value = projectId;
    renderTodos(projectId);
    renderProjects(projectId);
  });

  todoContainer.addEventListener("click", (e) => {
    const todoEl = e.target.closest(".todo-item");
    if (!todoEl) return;

    const projectId = todoEl.dataset.projectId;
    const project = getProjects().find((p) => p.id === projectId);
    const todo = project.todos.find((t) => t.id === todoEl.dataset.id);

    // toggle completion
    if (
      e.target.tagName === "INPUT" &&
      e.target.type === "checkbox" &&
      !e.target.classList.contains("todo-checklist-checkbox")
    ) {
      todo.toggleComplete();
      save();
      renderTodos(projectId);
    }

    // delete todo
    if (e.target.classList.contains("todo-delete-btn")) {
      project.todos = project.todos.filter((t) => t.id !== todo.id);
      save();
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
  detailsModal.addEventListener("click", (e) => {
    if (e.target === detailsModal) detailsModal.classList.remove("show");
  });
}
