// =====================================
// ELEMENTOS
// =====================================

const financeForm = document.getElementById("financeForm");
const financeList = document.getElementById("financeList");


// =====================================
// MOSTRAR FINANZAS
// =====================================

async function showFinances() {

    const movements = await getAllData("finances");

    financeList.innerHTML = "";

    let income = 0;
    let expenses = 0;

    movements.forEach(movement => {

        if (movement.type === "Ingreso") {

            income += movement.amount;

        } else {

            expenses += movement.amount;

        }

    });

    const balance = income - expenses;

    document.getElementById("totalIncome").textContent =
        "$" + income.toFixed(2);

    document.getElementById("totalExpenses").textContent =
        "$" + expenses.toFixed(2);

    document.getElementById("totalBalance").textContent =
        "$" + balance.toFixed(2);


    if (movements.length === 0) {

        financeList.textContent = "Todavía no tienes movimientos.";

        return;

    }

    movements.reverse().forEach(movement => {

        const card = document.createElement("article");

        const title = document.createElement("h3");
        title.textContent = movement.description;

        const amount = document.createElement("p");

        amount.textContent =
            movement.type + ": $" + movement.amount.toFixed(2);

        const date = document.createElement("p");
        date.textContent = movement.date;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";

        deleteButton.addEventListener("click", async () => {

            if (confirm("¿Eliminar este movimiento?")) {

                await deleteData("finances", movement.id);

                showFinances();

            }

        });

        card.append(title, amount, date, deleteButton);

        financeList.appendChild(card);

    });

}


// =====================================
// REGISTRAR MOVIMIENTO
// =====================================

financeForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const amount = Number(
        document.getElementById("financeAmount").value
    );

    if (!Number.isFinite(amount) || amount <= 0) {

        alert("Introduce una cantidad válida.");

        return;

    }

    const movement = {

        description: document.getElementById("financeDescription").value.trim(),

        amount: amount,

        type: document.getElementById("financeType").value,

        date: new Date().toLocaleDateString("es-MX")

    };

    if (!movement.description) return;

    await saveData("finances", movement);

    financeForm.reset();

    showFinances();

});