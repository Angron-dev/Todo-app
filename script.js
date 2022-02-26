const form = document.querySelector("#add-todo");
const todoList = document.querySelector(".todo-list");
const labelTags = document.querySelectorAll(".todo-container");
const buttons = document.querySelectorAll("button");
const itemsLeft = document.querySelector(".items-left");

//Add new todo
form.addEventListener("submit", () => {
  let inputValue = form.todoInput.value.trim();
  let inputObj = {
    inputValue: inputValue,
    checkbox: false,
  };
  saveLocalStorage(inputObj);
  addNewTodo(form);
});
// Delete todo
todoList.addEventListener("click", deleteTodo);
todoList.addEventListener("click", checkFun);

//Filters
buttons.forEach((button) => {
  button.addEventListener("click", filters);
});
// Display from Local Storage
document.addEventListener("DOMContentLoaded", getTodos);

// Dragging
document.addEventListener("DOMContentLoaded", () => {
  const liDraggables = document.querySelectorAll(".draggable");
  liDraggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });
    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  });
});
todoList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterEl = getDragAfterEl(todoList, e.clientY);
  const draggable = document.querySelector(".dragging");
  if (afterEl == null) {
    todoList.appendChild(draggable);
  } else {
    todoList.insertBefore(draggable, afterEl);
  }
});

//  ****  Functions  ****  //

// Get todos from local storage
function getElFromLS() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  return todos.reverse();
}

// Add new todo
function addNewTodo(form) {
  const inputValue = form.todoInput.value;
  const newTodo = `
            <li data-index draggable=true class="draggable">
              <label class="todo-container">
                <input type="checkbox" class="input-checkbox" />
                <span class="checkbox-span"><img src="images/icon-check.svg"/><span class="el-inside"></span></span>
                <p>
                    ${inputValue}
                </p>
              </label>
              <img src="images/icon-cross.svg" class="delete-btn" />
            </li>`;
  todoList.innerHTML += newTodo;
  form.reset();
  itemsLeftFun();
}
function saveLocalStorage(todo) {
  let todos = getElFromLS();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Delete todo
function deleteTodo(e) {
  let element = e.target;
  deleteFromLocalStorage(e);
  if (element.classList == "delete-btn") {
    element.parentElement.classList.add("fall");
    element.parentElement.addEventListener("transitionend", () => {
      element.parentElement.remove();
      itemsLeftFun();
    });
  }
}
function deleteFromLocalStorage(e) {
  let todos = getElFromLS();
  if (e.target.classList == "delete-btn") {
    let li = e.target.nextSibling.parentElement;
    let liName = li.children.item(0).children.item(2).innerText;
    for (let x = 0; x < todos.length; x++) {
      let objValues = Object.values(todos[x]);
      if (objValues[0] === liName) {
        todos.splice(x, 1);
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    }
  }
}

// Filters
function filters(e) {
  if (e.target.value != "clear") {
    for (let x = 0; x < buttons.length; x++) {
      buttons[x].classList.remove("active-btn");
    }
    e.target.classList.add("active-btn");
  }
  const todos = todoList.childNodes;
  todos.forEach((todo) => {
    if (todo.tagName == "LI") {
      switch (e.target.value) {
        case "all":
          todo.style.display = "flex";
          filtredItemsLeft();
          break;
        case "active":
          if (todo.classList.contains("completed")) {
            todo.style.display = "none";
          } else {
            todo.style.display = "flex";
          }
          filtredItemsLeft();
          break;
        case "completed":
          if (todo.classList.contains("completed")) {
            todo.style.display = "flex";
          } else {
            todo.style.display = "none";
          }
          filtredItemsLeft();
          break;
        default:
          if (todo.classList.contains("completed")) {
            todo.remove();
            let todos = getElFromLS();
            const todoText = todo.children[0].children[2].innerText.trim();
            for (let x = 0; x < todos.length; x++) {
              let objValues = Object.values(todos[x]);
              if (objValues[0] == todoText) {
                todos.splice(x, 1);
                localStorage.setItem("todos", JSON.stringify(todos));
              }
            }
            itemsLeftFun();
          }

          break;
      }
    }
  });
}

// Display todos from local storage
function getTodos() {
  let todos = getElFromLS();
  todos.forEach((todo) => {
    const input = todo.checkbox;
    let checked = "";
    let classChecked = "";
    if (input == true) {
      checked = "checked";
      classChecked = "completed";
    }
    const newTodo = `
            <li draggable=true class="draggable ${classChecked}" data-index >
              <label class="todo-container ${classChecked}">
                <input type="checkbox" class="input-checkbox" ${checked}/>
                <span class="checkbox-span"><img src="images/icon-check.svg"/><span class="el-inside"></span></span>
                <p>
                    ${todo.inputValue}
                </p>
              </label>
              <img src="images/icon-cross.svg" class="delete-btn" />
            </li>`;
    todoList.innerHTML += newTodo;
  });
  itemsLeftFun();
}

// Change checkbox in local storage
function checkFun(e) {
  let todos = getElFromLS();
  if (e.target.tagName == "LABEL") {
    let labelInnerText = e.target.children[2].innerText;
    let checkbox = e.target.children[0].checked;
    for (let x = 0; x < todos.length; x++) {
      let objValues = Object.values(todos[x]);
      if (objValues[0] == labelInnerText) {
        if (checkbox == false) {
          todos[x].checkbox = true;
          e.target.classList.add("completed");
          e.target.parentElement.classList.add("completed");
        } else {
          todos[x].checkbox = false;
          e.target.classList.remove("completed");
          e.target.parentElement.classList.remove("completed");
        }
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    }
  }
}

// How many todos left
function itemsLeftFun() {
  const li = document.querySelectorAll("[data-index]");
  itemsLeft.innerHTML = `${li.length} items left`;
}
function filtredItemsLeft() {
  const li = document.querySelectorAll("[data-index]");
  const arr = [];
  li.forEach((el) => {
    if (el.style.display == "flex") {
      arr.push(el);
    }
  });
  itemsLeft.innerHTML = `${arr.length} items left`;
}

// Drag and drop
function getDragAfterEl(container, y) {
  const draggableEl = [...container.querySelectorAll(".draggable:not(.dragging)")];
  return draggableEl.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return {
          offset: offset,
          element: child,
        };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
