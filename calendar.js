// =====================================
// ELEMENTOS
// =====================================

const eventForm = document.getElementById("eventForm");
const eventList = document.getElementById("eventList");


// =====================================
// MOSTRAR EVENTOS
// =====================================

async function showEvents() {

    const events = await getAllData("events");

    eventList.innerHTML = "";

    events.sort((a, b) => a.date.localeCompare(b.date));

    if (events.length === 0) {

        eventList.textContent = "No tienes eventos registrados.";

        return;

    }

    events.forEach(event => {

        const card = document.createElement("article");

        const title = document.createElement("h3");
        title.textContent = event.title;

        const date = document.createElement("p");
        date.textContent = "Fecha: " + event.date;

        const time = document.createElement("p");
        time.textContent = "Hora: " + (event.time || "Sin horario");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";

        deleteButton.addEventListener("click", async () => {

            if (confirm("¿Eliminar este evento?")) {

                await deleteData("events", event.id);

                showEvents();

            }

        });

        card.append(title, date, time, deleteButton);

        eventList.appendChild(card);

    });

}


// =====================================
// AGREGAR EVENTO
// =====================================

eventForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const newEvent = {

        title: document.getElementById("eventTitle").value.trim(),

        date: document.getElementById("eventDate").value,

        time: document.getElementById("eventTime").value

    };

    if (!newEvent.title || !newEvent.date) return;

    try {

        await saveData("events", newEvent);

        eventForm.reset();

        await showEvents();

    } catch (error) {

        console.error(error);

        alert("No se pudo guardar el evento.");

    }

});