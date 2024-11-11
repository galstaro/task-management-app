// Handle form submission to add a new task
document.getElementById('taskForm').onsubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission

    // Collect form data
    const formData = new FormData(e.target);
    const task = Object.fromEntries(formData.entries());

    // Send the new task data to the backend
    const response = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });

    // Check if the task was added successfully
    if (response.ok) {
        console.log('Task added successfully');
        loadTasks();  // Refresh the task list
    } else {
        console.error('Failed to add task');
    }
};

// Function to load and display tasks
async function loadTasks() {
    const response = await fetch('/tasks');
    const tasks = await response.json();

    const tasksContainer = document.getElementById('tasksContainer');
    tasksContainer.innerHTML = '';  // Clear existing tasks

    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.id = `task-${task.id}`;
        taskDiv.innerHTML = `
            <div>
                <h3>${task.name}</h3>
                <p class="description">${task.description}</p>
                <p class="due_date">Due: ${task.due_date}</p>
                <p class="status">Status: ${task.status}</p>
            </div>
            <div>
                <button onclick="editTask(${task.id})" class="edit-button">Edit</button>
                <button onclick="deleteTask(${task.id})" class="delete-button">Delete</button>
            </div>
        `;
        tasksContainer.appendChild(taskDiv);
    });
}

// Function to delete a task
async function deleteTask(id) {
    const response = await fetch(`/tasks/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        console.log('Task deleted successfully');
        loadTasks();  // Refresh the task list after deletion
    } else {
        console.error('Failed to delete task');
    }
}

// Function to edit a task
async function editTask(id) {
    const taskDiv = document.getElementById(`task-${id}`);
    const taskName = prompt("Edit Task Name:", taskDiv.querySelector("h3").innerText);
    const taskDescription = prompt("Edit Description:", taskDiv.querySelector(".description").innerText);
    const taskDueDate = prompt("Edit Due Date (yyyy-mm-dd):", taskDiv.querySelector(".due_date").innerText.replace('Due: ', ''));
    const taskStatus = prompt("Edit Status:", taskDiv.querySelector(".status").innerText.replace('Status: ', ''));

    const response = await fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: taskName,
            description: taskDescription,
            due_date: taskDueDate,
            status: taskStatus
        })
    });

    if (response.ok) {
        console.log('Task updated successfully');
        loadTasks();  // Refresh the task list
    } else {
        console.error('Failed to update task');
    }
}

// Load tasks initially when the page loads
loadTasks();
