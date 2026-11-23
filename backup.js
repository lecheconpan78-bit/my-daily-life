// =====================================
// COPIAS DE SEGURIDAD
// MY DAILY LIFE
// =====================================

const databaseStores = [
    "tasks",
    "subjects",
    "notes",
    "finances",
    "routines",
    "ideas",
    "goals",
    "events",
    "reminders"
];

// EXPORTAR INFORMACIÓN
async function exportData() {
    try {
        const backup = {};

        for (const store of databaseStores) {
            backup[store] = await getAllData(store);
        }

        const file = new Blob(
            [JSON.stringify(backup, null, 2)],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(file);

        const link = document.createElement("a");
        link.href = url;
        link.download = "MY_DAILY_LIFE_BACKUP.json";

        link.click();

        URL.revokeObjectURL(url);

        alert("¡Copia de seguridad creada correctamente!");

    } catch (error) {
        console.error("Error al exportar:", error);
        alert("No se pudo crear la copia de seguridad.");
    }
}


// IMPORTAR INFORMACIÓN
async function importData(file) {
    if (!file) return;

    try {
        const text = await file.text();
        const backup = JSON.parse(text);

        const validBackup = databaseStores.every(store =>
            Array.isArray(backup[store])
        );

        if (!validBackup) {
            throw new Error("El archivo no tiene un formato válido.");
        }

        const confirmation = confirm(
            "IMPORTANTE: importar esta copia reemplazará los datos actuales de la aplicación. ¿Deseas continuar?"
        );

        if (!confirmation) return;

        const transaction = db.transaction(
            databaseStores,
            "readwrite"
        );

        for (const storeName of databaseStores) {
            const store = transaction.objectStore(storeName);

            store.clear();

            backup[storeName].forEach(item => {
                store.put(item);
            });
        }

        transaction.oncomplete = () => {
            alert("¡Copia restaurada correctamente!");
            location.reload();
        };

        transaction.onerror = () => {
            alert("Ocurrió un problema al restaurar los datos.");
        };

    } catch (error) {
        console.error("Error al importar:", error);
        alert("El archivo seleccionado no es válido.");
    }
}