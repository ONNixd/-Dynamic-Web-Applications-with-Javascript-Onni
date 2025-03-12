document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const filters = document.querySelectorAll(".filter");
    const clearCompletedBtn = document.getElementById("clearCompleted");
    const itemsLeft = document.getElementById("itemsLeft");
    const error = document.getElementById("error");
    
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    
    function renderTasks(filter = "all") {
        taskList.innerHTML = "";
        let count = 0;
        tasks.forEach((task, index) => {
            if (filter === "active" && task.completed) return;
            if (filter === "completed" && !task.completed) return;
            
            const li = document.createElement("li");
            li.className = task.completed ? "completed" : "";
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}">
                <span>${task.text}</span>
                <button class="delete" data-index="${index}">&times;</button>
            `;
            taskList.appendChild(li);
            if (!task.completed) count++;
        });
        itemsLeft.textContent = `${count} items left`;
        saveTasks();
    }
    
    addTaskBtn.addEventListener("click", () => {
        const text = taskInput.value.trim();
        if (text.length < 3) {
            error.textContent = "Task must be at least 3 characters long!";
            return;
        }
        error.textContent = "";
        tasks.push({ text, completed: false });
        taskInput.value = "";
        renderTasks();
    });
    
    taskList.addEventListener("click", (e) => {
        if (e.target.matches("input[type='checkbox']")) {
            tasks[e.target.dataset.index].completed = e.target.checked;
        }
        if (e.target.matches(".delete")) {
            tasks.splice(e.target.dataset.index, 1);
        }
        renderTasks();
    });
    
    filters.forEach(button => {
        button.addEventListener("click", () => {
            filters.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            renderTasks(button.dataset.filter);
        });
    });
    
    clearCompletedBtn.addEventListener("click", () => {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
    });
    
    renderTasks();
});
