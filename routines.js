// =====================================
// ELEMENTOS
// =====================================

const routineForm = document.getElementById("routineForm");
const routineList = document.getElementById("routineList");


// =====================================
// MOSTRAR RUTINAS
// =====================================

async function showRoutines() {

    const routines = await getAllData("routines");

    routineList.innerHTML = "";

    if (routines.length === 0) {

        routineList.textContent = "Todavía no tienes rutinas.";

        return;

    }

    routines.forEach(routine => {

        const card = document.createElement("article");

        const title = document.createElement("h3");
        title.textContent = routine.name;

        const frequency = document.createElement("p");
        frequency.textContent = "Frecuencia: " + routine.frequency;

        const status = document.createElement("p");
        status.textContent = routine.completedToday
            ? "Completada hoy ✔️"
            : "Pendiente hoy";

        const completeButton = document.createElement("button");

        completeButton.textContent = routine.completedToday
            ? "Desmarcar"
            : "Completar hoy";

        completeButton.addEventListener("click", async () => {

            routine.completedToday = !routine.completedToday;

            await updateData("routines", routine);

            showRoutines();

        });

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Eliminar";

        deleteButton.addEventListener("click", async () => {

            if (confirm("¿Eliminar esta rutina?")) {

                await deleteData("routines", routine.id);

                showRoutines();

            }

        });

        card.append(
            title,
            frequency,
            status,
            completeButton,
            deleteButton
        );

        routineList.appendChild(card);

    });

}


// =====================================
// AGREGAR RUTINA
// =====================================

routineForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const newRoutine = {

        name: document.getElementById("routineName").value.trim(),

        frequency: document.getElementById("routineFrequency").value,

        completedToday: false

    };

    if (!newRoutine.name) return;

    await saveData("routines", newRoutine);

    routineForm.reset();

    showRoutines();

});