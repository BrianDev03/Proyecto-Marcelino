document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('tasks-list');
    const timerDisplay = document.getElementById('timer-display');
    const startTimerBtn = document.getElementById('start-timer');
    const stopTimerBtn = document.getElementById('stop-timer');
    const clearAllTasksBtn = document.getElementById('clear-all-tasks-btn'); // Nuevo botón para eliminar todas las tareas

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let timer;
    let currentTaskIndex = null;
    let elapsedSeconds = 0;

    renderTasks();

    // Agregar evento para el botón de eliminar todas las tareas
    clearAllTasksBtn.addEventListener('click', () => {
        // Limpiar todas las tareas y actualizar el almacenamiento local
        tasks = [];
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(); // Volver a renderizar las tareas
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskName = document.getElementById('task-name').value;
        const taskDesc = document.getElementById('task-desc').value;
        const taskDeadline = document.getElementById('task-deadline').value;
    
        const task = {
            name: taskName,
            description: taskDesc,
            deadline: taskDeadline,
            timeAllocated: 1,
            completed: false,
            timeSpent: 0
        };
    
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        taskForm.reset();
    });
    

    startTimerBtn.addEventListener('click', () => {
        if (currentTaskIndex !== null) {
            clearInterval(timer);
            alert("Tu tiempo ha iniciado.");
            elapsedSeconds = 0;
            timerDisplay.textContent = formatTime(elapsedSeconds);
            timer = setInterval(() => {
                elapsedSeconds++;
                timerDisplay.textContent = formatTime(elapsedSeconds);
            }, 1000);
        } else {
            alert("Selecciona una tarea para iniciar el temporizador.");
        }
    });

    stopTimerBtn.addEventListener('click', () => {
        if (currentTaskIndex !== null) {
            clearInterval(timer);
            tasks[currentTaskIndex].timeSpent += elapsedSeconds;
            elapsedSeconds = 0;
            timerDisplay.textContent = formatTime(0);
            renderTasks();
        } else {
            alert("No hay temporizador en funcionamiento.");
        }
    });

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.innerHTML = `
                <span>${task.name} - ${task.deadline} - ${formatTime(task.timeSpent)}</span>
                <button class="start-btn" data-index="${index}">Iniciar</button>
                <button class="complete-btn" data-index="${index}">Completar</button>
            `;
            taskList.appendChild(taskDiv);
        });

        document.querySelectorAll('.start-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                startTask(index);
            });
        });

        document.querySelectorAll('.complete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index =  e.target.getAttribute('data-index');
                completeTask(index);
            });
        });
    }

    function startTask(index) {
        currentTaskIndex = parseInt(index);
        clearInterval(timer);
        elapsedSeconds = 0;
        timerDisplay.textContent = formatTime(elapsedSeconds);
        alert("Tu tiempo ha iniciado.");
        timer = setInterval(() => {
            elapsedSeconds++;
            timerDisplay.textContent = formatTime(elapsedSeconds);
        }, 1000);
    }

    function completeTask(index) {
        clearInterval(timer);
        tasks[index].completed = true;
        tasks[index].timeSpent += elapsedSeconds;
        elapsedSeconds = 0;
        timerDisplay.textContent = formatTime(0);
        alert("¡Felicidades! Has terminado la tarea.");
        renderTasks();
    }

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
});
