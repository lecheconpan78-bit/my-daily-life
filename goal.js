// =====================================
// ELEMENTOS
// =====================================

const goalForm = document.getElementById("goalForm");
const goalList = document.getElementById("goalList");


// =====================================
// MOSTRAR METAS
// =====================================

async function showGoals() {

    const goals = await getAllData("goals");

    goalList.innerHTML = "";

    document.getElementById("totalGoals").textContent = goals.length;

    if (goals.length === 0) {

        goalList.textContent = "Todavía no tienes metas.";

        return;

    }

    goals.forEach(goal => {

        const card = document.createElement("article");

        const title = document.createElement("h3");
        title.textContent = goal.title;

        const date = document.createElement("p");
        date.textContent = "Fecha límite: " + (goal.date || "Sin fecha");

        const status = document.createElement("p");
        status.textContent = goal.completed
            ? "Meta cumplida 🏆"
            : "En progreso 🎯";

        const completeButton = document.createElement("button");

        completeButton.textContent = goal.completed
            ? "Reabrir meta"
            : "Marcar cumplida";

        completeButton.addEventListener("click", async () => {

            goal.completed = !goal.completed;

            await updateData("goals", goal);

            showGoals();

        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";

        deleteButton.addEventListener("click", async () => {

            if (confirm("¿Eliminar esta meta?")) {

                await deleteData("goals", goal.id);

                showGoals();

            }

        });

        card.append(title, date, status, completeButton, deleteButton);

        goalList.appendChild(card);

    });

}


// =====================================
// CREAR META
// =====================================

goalForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const newGoal = {

        title: document.getElementById("goalTitle").value.trim(),

        date: document.getElementById("goalDate").value,

        completed: false

    };

    if (!newGoal.title) return;

    await saveData("goals", newGoal);

    goalForm.reset();

    showGoals();

});