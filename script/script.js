document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('tasks-list');
    const completedTasksList = document.getElementById('completed-tasks-list');
    const timerDisplay = document.getElementById('timer-display');
    const startTimerBtn = document.getElementById('start-timer');
    const stopTimerBtn = document.getElementById('stop-timer');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    let timer;
    let currentTaskIndex = null;
    let elapsedSeconds = 0;

    renderTasks();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskName = document.getElementById('task-name').value;
        const taskDesc = document.getElementById('task-desc').value;
        const taskDeadline = document.getElementById('task-deadline').value;

        const task = {
            name: taskName,
            description: taskDesc,
            deadline: taskDeadline,
            timeAllocated: 1, // Duración preestablecida en 1 segundo
            completed: false,
            timeSpent: 0
        };

        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Guardar tareas en localStorage
        renderTasks(); // Renderizar la lista de tareas
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
        clearInterval(timer); // Detener el temporizador si está en funcionamiento
        tasks[index].completed = true;
        tasks[index].timeSpent += elapsedSeconds; // Agregar el tiempo transcurrido al tiempo total de la tarea
        elapsedSeconds = 0; // Restablecer los segundos transcurridos
        timerDisplay.textContent = formatTime(0); // Restablecer la visualización del temporizador
        alert("¡Felicidades! Has terminado la tarea.");
        renderTasks();

        // Guardar las tareas completadas en localStorage
        completedTasks.push(tasks[index]);
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
});
