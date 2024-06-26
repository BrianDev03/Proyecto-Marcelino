document.addEventListener('DOMContentLoaded', () => {
    const completedTasksList = document.getElementById('completed-tasks-list');
    const clearCompletedTasksBtn = document.getElementById('clear-completed-tasks-btn');

    let completedTasks = [];

    if (localStorage.getItem('completedTasks')) {
        completedTasks = JSON.parse(localStorage.getItem('completedTasks'));
        renderCompletedTasks();
    }

    clearCompletedTasksBtn.addEventListener('click', () => {
        completedTasks = [];
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        renderCompletedTasks();

        const tasksInIndex = JSON.parse(localStorage.getItem('tasks')) || [];
        const filteredTasks = tasksInIndex.filter(task => !task.completed);
        localStorage.setItem('tasks', JSON.stringify(filteredTasks));
        renderTasksInIndex();
    });

    function renderCompletedTasks() {
        completedTasksList.innerHTML = '';
        completedTasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.innerHTML = `
                <span>${task.name} - ${task.deadline} - ${formatTime(task.timeSpent)}</span>
            `;
            completedTasksList.appendChild(taskDiv);
        });
    }

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function renderTasksInIndex() {
        // Renderizar las tareas en index.html
        // Asegúrate de definir la función formatTime también en el script de index.html si es necesario
    }
});
