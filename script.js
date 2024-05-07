Vue.createApp({
  data() {
    return {
      todos: [],

      descVal: "",

      todosVal: "All",

      tdLine: "",
    };
  },
  computed: {
    filteredTodos() {
      if (this.todosVal === "All") {
        return this.todos;
      } else if (this.todosVal === "ToDos") {
        return this.todos.filter((todo) => !todo.done);
      } else if (this.todosVal === "Done") {
        return this.todos.filter((todo) => todo.done);
      }
    },
  },

  methods: {
    async addToDo() {
      const newToDo = {
        description: this.descVal,
        done: false,
      };
      this.todos.push(newToDo);
      await fetch("http://localhost:4730/todos", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newToDo),
      });

      this.descVal = "";
      this.readTodos();
    },
    doneTask(todo) {
      this.updateToDo(todo.id, todo);
    },

    updateToDo(id, changedTodo) {
      fetch("http://localhost:4730/todos/" + id, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(changedTodo),
      });
    },
    deleteDoneTodos() {
      const doneTodos = this.todos.filter((todo) => todo.done);

      const fetches = doneTodos.map((deletedTodo) => {
        return fetch("http://localhost:4730/todos/" + deletedTodo.id, {
          method: "DELETE",
        });
      });
      Promise.all(fetches).then(() => {
        this.todos = this.todos.filter((todo) => !todo.done);
      });
    },
    doneTask(todo) {
      this.updateToDo(todo.id, todo);
    },
    line(status) {
      if (status) {
        return "Hello";
      }
    },

    async readTodos() {
      this.todos = [];
      const resolve = await fetch("http://localhost:4730/todos");
      const data = await resolve.json();
      this.todos.push(...data);
    },
  },
  mounted() {
    console.log(this.todos);
  },
  created() {
    this.readTodos();
  },
}).mount("#app");
