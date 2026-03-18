//todo factory function
function createTodo(
  title,
  desc,
  dueDate,
  priorityColor,
  checklist = [],
  notes = "",
) {
  return {
    title,
    id: crypto.randomUUID(), //use ~~~.id in find()
    desc,
    dueDate,
    priorityColor,
    checklist,
    notes,
    completed: false,

    toggleComplete() {
      this.completed = !this.completed;
    },

    addChecklistItem(item) {
      this.checklist.push({
        text: item,
        done: false,
      });
    },

    toggleChecklistItem(index) {
      this.checklist[index].done = !this.checklist[index].done;
    },
  };
}

export default createTodo;
