//project factory function
function createProject(name, todos = []) {
  return {
    id: crypto.randomUUID(),  //use ~~~.id in find()
    name,
    todos,

    addTodo(todo) {
      this.todos.push(todo);
    },

    removeTodo(todoId) {
      this.todos = this.todos.filter(todo => todo.id !== todoId);
    }
  };
}

export default createProject