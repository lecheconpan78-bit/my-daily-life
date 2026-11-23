// =====================================
// ELEMENTOS HTML
// =====================================

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");


// =====================================
// MOSTRAR TAREAS
// =====================================

async function showTasks() {

    const tasks = await getAllData("tasks");

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        taskList.textContent = "No tienes tareas registradas.";

        updateTaskStatistics(tasks);

        return;

    }

    tasks.sort((a, b) => {

        if (a.completed !== b.completed) {
            return Number(a.completed) - Number(b.completed);
        }

        return (a.date || "").localeCompare(b.date || "");

    });

    tasks.forEach(task => {

        const card = document.createElement("article");

        const title = document.createElement("h3");
        title.textContent = task.title;

        const date = document.createElement("p");
        date.textContent = "Fecha: " + (task.date || "Sin fecha");

        const priority = document.createElement("p");
        priority.textContent = "Prioridad: " + task.priority;

        const status = document.createElement("p");
        status.textContent = task.completed
            ? "Estado: Completada ✔️"
            : "Estado: Pendiente ⏳";


        // BOTÓN COMPLETAR

        const completeButton = document.createElement("button");

        completeButton.textContent = task.completed
            ? "Reabrir"
            : "Completar";

        completeButton.addEventListener("click", async () => {

            task.completed = !task.completed;

            await updateData("tasks", task);

            await showTasks();

        });


        // BOTÓN ELIMINAR

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Eliminar";

        deleteButton.addEventListener("click", async () => {

            if (confirm("¿Quieres eliminar esta tarea?")) {

                await deleteData("tasks", task.id);

                await showTasks();

            }

        });


        card.append(
            title,
            date,
            priority,
            status,
            completeButton,
            deleteButton
        );

        taskList.appendChild(card);

    });

    updateTaskStatistics(tasks);

}


// =====================================
// AGREGAR TAREAS
// =====================================

taskForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const newTask = {

        title: document.getElementById("taskTitle").value.trim(),

        date: document.getElementById("taskDate").value,

        priority: document.getElementById("taskPriority").value,

        completed: false

    };

    if (!newTask.title) return;

    try {

        await saveData("tasks", newTask);

        taskForm.reset();

        await showTasks();

    } catch (error) {

        console.error("Error al guardar tarea:", error);

        alert("No se pudo guardar la tarea.");

    }

});


// =====================================
// ESTADÍSTICAS DE TAREAS
// =====================================

function updateTaskStatistics(tasks) {

    const completed = tasks.filter(task => task.completed).length;

    const pending = tasks.length - completed;

    document.getElementById("completedTasks").textContent = completed;

    document.getElementById("pendingTasks").textContent = pending;

}