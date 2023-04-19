/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { connect } = require("./connectDB");
const Todo = require("./TodoModel.js");
const formattedDate = (d) => {
  return d.toISOString().split("T")[0];
};
const createTodo = async () => {
  try {
    await connect();
    const todo = await Todo.addTask({
      title: "Fifth item",
      dueDate: formattedDate(
        new Date(new Date().setDate(dateToday.getDate() - 1))
      ),
      completed: false,
    });
    console.log(`Created todo with ID: ${todo.id}`);
  } catch (err) {
    console.error(err);
  }
};

const countItems = async () => {
  try {
    const totalCount = await Todo.count();
    console.log(`Found ${totalCount} items in the table`);
  } catch (err) {
    console.error(err);
  }
};

const getAllTodos = async () => {
  try {
    const todos = await Todo.findAll();
    const todoList = todos.map((todo) => todo.displayableString()).join("\n");
    console.log(todoList);
  } catch (err) {
    console.error(err);
  }
};

const getSingleTodo = async () => {
  try {
    const todo = await Todo.findOne({
      where: {
        completed: false,
      },
    });
    console.log(todo.displayableString());
  } catch (err) {
    console.error(err);
  }
};

const updateTodo = async (id) => {
  try {
    await Todo.update(
      { completed: true },
      {
        where: {
          id: id,
        },
      }
    );
  } catch (err) {
    console.error(err);
  }
};

const deleteTodo = async (id) => {
  try {
    const deletedItems = await Todo.destroy({
      where: {
        id: id,
      },
    });
    console.log(`Deleted ${deletedItems} rows!!`);
  } catch (err) {
    console.error(err);
  }
};

(async () => {
  await createTodo();
  await countItems();
  // await getAllTodos();
  // await getSingleTodo();
  // await updateTodo(5);
  // await deleteTodo(6);
  await getAllTodos();
})();
