// ==========================================
// MY DAILY LIFE 💚
// SISTEMA DE RECORDATORIOS
// ==========================================

const reminderForm = document.getElementById("reminderForm");
const reminderList = document.getElementById("reminderList");

const reminderTitle = document.getElementById("reminderTitle");
const reminderDate = document.getElementById("reminderDate");

const enableNotifications = document.getElementById("enableNotifications");

// ==========================================
// ACTIVAR NOTIFICACIONES
// ==========================================

async function requestNotificationPermission() {

    if (!("Notification" in window)) {

        alert("Tu navegador no permite notificaciones.");

        return false;

    }

    if (Notification.permission === "granted") {
        return true;
    }

    if (Notification.permission === "denied") {

        alert("Las notificaciones están bloqueadas.");

        return false;

    }

    const permission = await Notification.requestPermission();

    return permission === "granted";

}

// ==========================================
// ENVIAR NOTIFICACIÓN
// ==========================================

function sendNotification(title, message) {

    if (!("Notification" in window)) return;

    if (Notification.permission !== "granted") return;

    new Notification("MY DAILY LIFE 💚", {

        body: `${title}\n${message}`,

        icon: "assets/icons/icon-192.png"

    });

}

// ==========================================
// MOSTRAR RECORDATORIOS
// ==========================================

async function showReminders() {

    if (!reminderList) return;

    try {

        const reminders = await getAllData("reminders");

        reminderList.innerHTML = "";

        if (!reminders || reminders.length === 0) {

            reminderList.textContent = "No tienes recordatorios todavía 💚";

            return;

        }

        reminders.sort((a, b) => {

            return new Date(a.date) - new Date(b.date);

        });

        reminders.forEach(reminder => {

            const item = document.createElement("div");

            item.className = "reminder-item";

            const title = document.createElement("h3");

            title.textContent = reminder.title;

            const date = document.createElement("p");

            date.textContent = new Date(reminder.date).toLocaleString();

            const status = document.createElement("small");

            status.textContent = reminder.notified
                ? "Notificado ✓"
                : "Pendiente";

            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Eliminar";

            deleteButton.type = "button";

            deleteButton.addEventListener("click", async () => {

                try {

                    await deleteData("reminders", reminder.id);

                    await showReminders();

                } catch (error) {

                    console.error("Error al eliminar:", error);

                }

            });

            item.appendChild(title);

            item.appendChild(date);

            item.appendChild(status);

            item.appendChild(deleteButton);

            reminderList.appendChild(item);

        });

    } catch (error) {

        console.error("Error al mostrar recordatorios:", error);

        reminderList.textContent = "No se pudieron cargar los recordatorios.";

    }

}

// ==========================================
// GUARDAR RECORDATORIO
// ==========================================

if (reminderForm) {

    reminderForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const title = reminderTitle.value.trim();

        const date = reminderDate.value;

        if (!title || !date) {

            alert("Completa todos los campos.");

            return;

        }

        const selectedDate = new Date(date);

        if (Number.isNaN(selectedDate.getTime())) {

            alert("La fecha no es válida.");

            return;

        }

        if (selectedDate <= new Date()) {

            alert("Selecciona una fecha futura.");

            return;

        }

        try {

            await saveData("reminders", {

                title: title,

                date: selectedDate.toISOString(),

                notified: false

            });

            reminderForm.reset();

            await showReminders();

            alert("¡Recordatorio guardado! 💚");

        } catch (error) {

            console.error("Error al guardar:", error);

            alert("No se pudo guardar el recordatorio.");

        }

    });

}

// ==========================================
// ACTIVAR BOTÓN DE NOTIFICACIONES
// ==========================================

if (enableNotifications) {

    enableNotifications.addEventListener("click", async () => {

        const permission = await requestNotificationPermission();

        if (permission) {

            alert("¡Notificaciones activadas! 💚");

        }

    });

}

// ==========================================
// REVISAR RECORDATORIOS
// ==========================================

async function checkReminders() {

    if (!("Notification" in window)) return;

    if (Notification.permission !== "granted") return;

    try {

        const reminders = await getAllData("reminders");

        const now = new Date();

        for (const reminder of reminders) {

            const reminderTime = new Date(reminder.date);

            if (!reminder.notified && reminderTime <= now) {

                sendNotification(
                    reminder.title,
                    "¡Es momento de realizar tu actividad!"
                );

                reminder.notified = true;

                await updateData("reminders", reminder);

            }

        }

        await showReminders();

    } catch (error) {

        console.error("Error al revisar recordatorios:", error);

    }

}

// ==========================================
// REVISIÓN AUTOMÁTICA
// ==========================================

setInterval(checkReminders, 30000);