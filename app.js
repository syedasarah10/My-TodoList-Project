const projectsList = document.getElementById("projects-list");
const inputAddProject = document.querySelector(".input-add-project-popup");
const addProjectForm = document.querySelector(".add-new-project-form");
const defaultProjectButton = document.getElementById("button-default-projects");
const projectDisplayPreview = document.getElementById("project-preview");
const projectButtons = document.querySelectorAll(".button-project");
const header = document.querySelector(".project-name");
const addTaskPopupButton = document.getElementById("button-add-task-popup");
const cancelTaskPopupButton = document.getElementById(
  "button-cancel-task-popup"
);

let projects = JSON.parse(localStorage.getItem("projects")) || [];
let selectedListId = localStorage.getItem("selectedListId");

function saveToLocalStorage(projectsArray = projects, listID = selectedListId) {
  localStorage.setItem("projects", JSON.stringify(projectsArray));
  localStorage.setItem("selectedListId", listID);
}

projectsList.addEventListener("click", (event) => {
  selectedListId = event.target.dataset.projectId;
  addProjectsToList();
});

addProjectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const projectName = inputAddProject.value;
  if (projectName == null || projectName === " ") return;
  const list = createProject(projectName);
  inputAddProject.value = "";
  projects.push(list);
  selectedListId = list.id;
  openProjectDetails(projectName);
  addProjectsToList();
  saveToLocalStorage();
});

function buttonAddTaskPopUp(event) {
  if (event.target) {
    document.getElementById("add-task-popup").classList.add("active");
    event.target.classList.add("active");
  }
}
function addProjectsToList(projectArray = projects) {
  clearExtraElements(projectsList);
  displayTask();
  projectArray.forEach((project) => {
    const projectParentDiv = document.createElement("div");
    projectParentDiv.className = "project";
    const buttonTag = document.createElement("button");
    buttonTag.className = "button-project";
    buttonTag.addEventListener("click", (event) => {
      openProjectDetails(project.name);
    });
    buttonTag.dataset.projectId = project.id;
    buttonTag.innerText = project.name;
    if (project.id === selectedListId) {
      buttonTag.classList.add("active-list");
    }
    const iTag = document.createElement("i");
    iTag.innerHTML = '<i class="fas fa-times delete"></i>';
    iTag.addEventListener("click", (event) => {
      deleteProject(
        event.target.parentElement.parentElement.firstChild.dataset.projectId
      );
      if (projects.length > 0) {
        openProjectDetails(projects[projects.length - 1].name);
        saveToLocalStorage(projects, projects[projects.length - 1].id);
      }
    });
    projectParentDiv.appendChild(buttonTag);
    projectParentDiv.appendChild(iTag);
    projectsList.appendChild(projectParentDiv);
    inputAddProject.value = "";
  });
}

function clearExtraElements(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function displayTask() {
  const tasksList = document.getElementById("tasks-list");
  clearExtraElements(tasksList);
  const selectedList = projects.find((project) => project.id == selectedListId);
  if (!selectedList) return;
  selectedList.tasks.forEach((task) => {
    tasksList.innerHTML += `
    <button class="button-task" data-task-button>
      <div class="left-task-panel">
        <i class="far fa-circle ${
          task.completed ? "checked" : ""
        }" data-taskid=${task.id}></i>
        <p class="task-id ${task.completed ? "completed" : ""}">${
      task.name
    }  -</p>
        <span class="task-content ${task.completed ? "completed" : ""}">${
      task.description
    }</span>
      </div>
      <div class="right-task-panel">
        <p>Priority -${task.priority}</p>
        <i class="fas fa-times remove" data-task-id=${task.id}></i>
      </div>
    </button>`;
  });
  const circles = document.querySelectorAll(".fa-circle");
  circles.forEach((circle) => {
    circle.addEventListener("click", (event) => {
      circle.classList.toggle("checked");
      const taskCompletedID = circle.attributes["data-taskid"].value;

      selectedList.tasks.forEach((task) => {
        if (task.id === taskCompletedID) {
          task.completed = !task.completed;
        }
      });

      const p = event.target.parentElement.children[1];
      const span = event.target.parentElement.children[2];
      p.classList.toggle("completed");
      span.classList.toggle("completed");
    });

    const crossBtn = document.querySelectorAll(".remove");
    crossBtn.forEach((cross) => {
      cross.addEventListener("click", (event) => {
        const currentTask = event.target.parentElement.parentElement.remove();
        const deleteTaskID = cross.attributes["data-task-id"].value;
        deleteTask(deleteTaskID);
      });
    });
  });
  saveToLocalStorage(projects);
}

function openProjectDetails(projectName) {
  const projectPreview = document.getElementById("project-preview");
  const buttonTag = document.createElement("button");
  buttonTag.classList.add("button-add-task");
  buttonTag.innerHTML = `<i class="fas fa-plus add-task-icon">
  </i>Add Task`;
  buttonTag.addEventListener("click", buttonAddTaskPopUp);
  projectPreview.innerHTML = `
  <h1 id = "project-name">${projectName}</h1>
  <div class="tasks-list" id= "tasks-list">
        </div>`;
  projectPreview.innerHTML += `
      <div class="add-task-popup" id="add-task-popup">
        <input
          class="input-add-task-popup"
          id="input-add-task-popup"
          placeholder="Enter Task"
          type="text"
        /><br/>
        <input
            class="input-add-description-popup"
            id="input-add-description-popup"
            type="text"
            placeholder="Enter Short Description"
            autocomplete="off"
            required
          /><br/>
          <label for="priority">Priority:</label>
          <select name="priority" id="priority" class="priority" required>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option></select
          ><br /><br/>
      </div>
    `;
  projectPreview.appendChild(buttonTag);

  const firstDivTag = document.querySelector(".add-task-popup");

  const divTag = document.createElement("div");
  divTag.classList.add("add-task-popup-buttons");

  const addButtonTag = document.createElement("button");
  addButtonTag.classList.add("button-add-task-popup");
  addButtonTag.setAttribute("id", "button-add-task-popup");
  addButtonTag.innerText = "Add";
  divTag.appendChild(addButtonTag);

  const cancelButtonTag = document.createElement("button");
  cancelButtonTag.classList.add("button-cancel-task-popup");
  cancelButtonTag.setAttribute("id", "button-cancel-task-popup");
  cancelButtonTag.innerText = "Cancel";
  divTag.appendChild(cancelButtonTag);

  firstDivTag.appendChild(divTag);

  addButtonTag.addEventListener("click", (event) => {
    const inputAddTask = document.getElementById("input-add-task-popup");
    const inputDescription = document.getElementById(
      "input-add-description-popup"
    );
    const prioritySelect = document.getElementById("priority");
    if (event.target) {
      const tName = inputAddTask.value;
      const tDescription = inputDescription.value;
      const tPriority = prioritySelect.value;

      if (tName == null || tName === "") return;
      const task = createNewTask(tName, tDescription, tPriority);
      firstDivTag.classList.remove("active");
      buttonTag.classList.remove("active");
      const selectedList = projects.find(
        (project) => project.id === selectedListId
      );
      selectedList.tasks.push(task);
      inputAddTask.value = "";
      inputDescription.value = "";
      saveToLocalStorage();
      addProjectsToList();
    }
  });

  cancelButtonTag.addEventListener("click", (event) => {
    if (event.target) {
      firstDivTag.classList.remove("active");
      buttonTag.classList.remove("active");
    }
  });
  displayTask();
}
function deleteProject(projectID) {
  projects = projects.filter((project) => project.id !== projectID);
  return projects;
}
function displayDefaultProjectOnLoad() {
  const savedProjects = JSON.parse(localStorage.getItem("projects"));
  openProjectDetails(savedProjects[0].name);
}

function deleteTask(deleteTaskID) {
  projects.forEach((project) => {
    project.tasks = project.tasks.filter((task) => task.id !== deleteTaskID);
  });
  saveToLocalStorage(projects);
}
addProjectsToList();
displayDefaultProjectOnLoad();
