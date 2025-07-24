let tasks = [];

// DOM references
const taskInput = document.getElementById("taskInput");
const taskList = document.querySelector(".task-list");
const progressBar = document.getElementById("progress");
const numbersDisplay = document.getElementById("numbers");

document.getElementById("newtask").addEventListener("click", function (e) {
  e.preventDefault();
  addTask();
});

// Load tasks from localStorage on page load
window.addEventListener("load", () => {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);
    updateTaskList();
  }
});

function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text: text, completed: false });
    taskInput.value = "";
    saveTasks();
    updateTaskList();
  }
}

function updateTaskList() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("fade-in");

    listItem.innerHTML = `
      <div class="taskitem ${task.completed ? 'completed' : ''}">
        <div class="task">
          <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} data-index="${index}" />
          <p contenteditable="false" class="${task.completed ? "line" : ""}" data-index="${index}">${task.text}</p>
        </div>
        <div class="icon">
          <img src="pencil.png" class="edit-icon" data-index="${index}" title="Edit">
          <img src="delete.png" class="delete-icon" data-index="${index}" title="Delete">
        </div>
      </div>
    `;

    taskList.appendChild(listItem);
  });

  attachEventListeners();
  updateProgress();
}

function attachEventListeners() {
  // Checkbox
  document.querySelectorAll(".checkbox").forEach(cb => {
    cb.addEventListener("change", function () {
      const index = this.dataset.index;
      tasks[index].completed = this.checked;

      const taskItem = this.closest(".taskitem");
      if (this.checked) {
        taskItem.classList.add("pop");
        setTimeout(() => taskItem.classList.remove("pop"), 300);
      }

      saveTasks();
      updateTaskList();
    });
  });

  // Delete
  document.querySelectorAll(".delete-icon").forEach(icon => {
    icon.addEventListener("click", function () {
      const index = this.dataset.index;
      const listItem = this.closest("li");
      listItem.classList.add("fade-out");
      setTimeout(() => {
        tasks.splice(index, 1);
        saveTasks();
        updateTaskList();
      }, 300);
    });
  });

  // Edit
  document.querySelectorAll(".edit-icon").forEach(icon => {
    icon.addEventListener("click", function () {
      const index = this.dataset.index;
      const p = document.querySelector(`p[data-index='${index}']`);
      if (p.contentEditable === "false") {
        p.contentEditable = "true";
        p.focus();

        // Save on Enter
        p.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            p.contentEditable = "false";
            tasks[index].text = p.textContent.trim();
            saveTasks();
            updateTaskList();
          }
        });
      } else {
        p.contentEditable = "false";
        tasks[index].text = p.textContent.trim();
        saveTasks();
        updateTaskList();
      }
    });
  });
}

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressBar.style.width = `${percent}%`;
  numbersDisplay.textContent = `${completed}/${total}`;

  if (total > 0 && completed === total) {
    blastconfetti();
  }
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Confetti animation
function blastconfetti() {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ["star"],
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ["star"],
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ["circle"],
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
}

