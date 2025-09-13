// script.js - with checkbox, filters, login/logout, stats
let filter = "all";

/* ===== Signup ===== */
function signup() {
  let username = document.getElementById("signupUsername").value;
  let password = document.getElementById("signupPassword").value;

  if (username && password) {
    localStorage.setItem(username, password);
    alert("Signup successful! Please login.");
    window.location.href = "index.html";
  } else {
    alert("Please enter username and password.");
  }
}

/* ===== Login ===== */
function login() {
  let username = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPassword").value;
  let storedPassword = localStorage.getItem(username);

  if (storedPassword === password) {
    localStorage.setItem("loggedInUser", username);
    window.location.href = "todo.html";
  } else {
    alert("Invalid login credentials!");
  }
}

/* ===== Add Task ===== */
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskInput.value = "";
  loadTasks();
}

/* ===== Load Tasks ===== */
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskList = document.getElementById("taskList");
  if (!taskList) return;

  taskList.innerHTML = "";

  const total = tasks.length;
  const active = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;

  if (document.getElementById("totalTasks")) {
    document.getElementById("totalTasks").textContent = total;
    document.getElementById("activeTasks").textContent = active;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("allCount").textContent = total;
    document.getElementById("activeCount").textContent = active;
    document.getElementById("completedCount").textContent = completed;
  }

  let anyRendered = false;

  tasks.forEach((task, index) => {
    const shouldShow =
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed);

    if (!shouldShow) return;

    anyRendered = true;

    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", (e) => {
      e.stopPropagation();
      toggleTask(index);
    });

    const span = document.createElement("span");
    span.textContent = task.text;
    span.addEventListener("click", () => toggleTask(index));

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTask(index);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(btn);
    taskList.appendChild(li);
  });

  if (!anyRendered) {
    taskList.innerHTML = `<p class="empty-msg" style="color: grey;">No tasks yet. Add your first task above!</p>`;
  }
}

/* ===== Toggle Task ===== */
function toggleTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (typeof tasks[index] === "undefined") return;
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

/* ===== Delete Task ===== */
function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (typeof tasks[index] === "undefined") return;
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

/* ===== Filters ===== */
function filterTasks(type, btn) {
  filter = type;
  document.querySelectorAll(".task-filters button").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  loadTasks();
}

/* ===== Auth Check + Logout ===== */
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("todo.html")) {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    const welcomeEl = document.getElementById("welcomeUser");
    if (welcomeEl) welcomeEl.textContent = "Welcome back, " + user + "!";

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "thankyou.html";
      });
    }

    loadTasks();
  }
});
