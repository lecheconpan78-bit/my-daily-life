// ==========================================
// MY DAILY LIFE 💚
// SISTEMA DE BASE DE DATOS
// ==========================================

const DB_NAME = "MyDailyLifeDB";
const DB_VERSION = 3;

let myDailyLifeDB = null;
let myDailyLifeDBPromise = null;

// ==========================================
// CONECTAR CON INDEXEDDB
// ==========================================

function connectMyDailyLifeDB() {

    if (myDailyLifeDB) {
        return Promise.resolve(myDailyLifeDB);
    }

    if (myDailyLifeDBPromise) {
        return myDailyLifeDBPromise;
    }

    myDailyLifeDBPromise = new Promise((resolve, reject) => {

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {

            const database = event.target.result;

            const stores = [
                "tasks",
                "subjects",
                "events",
                "calendar",
                "routines",
                "finances",
                "ideas",
                "goals",
                "notes",
                "reminders"
            ];

            stores.forEach(storeName => {

                if (!database.objectStoreNames.contains(storeName)) {

                    database.createObjectStore(storeName, {
                        keyPath: "id",
                        autoIncrement: true
                    });

                }

            });

        };

        request.onsuccess = () => {

            myDailyLifeDB = request.result;

            myDailyLifeDB.onversionchange = () => {

                myDailyLifeDB.close();

                myDailyLifeDB = null;
                myDailyLifeDBPromise = null;

            };

            resolve(myDailyLifeDB);

        };

        request.onerror = () => {

            myDailyLifeDBPromise = null;

            reject(request.error);

        };

        request.onblocked = () => {

            console.warn("La base de datos está bloqueada.");

        };

    });

    return myDailyLifeDBPromise;

}

// ==========================================
// GUARDAR INFORMACIÓN
// ==========================================

async function saveData(storeName, data) {

    const database = await connectMyDailyLifeDB();

    if (!database) {
        throw new Error("No se pudo conectar con la base de datos.");
    }

    return new Promise((resolve, reject) => {

        const transaction = database.transaction(storeName, "readwrite");

        const store = transaction.objectStore(storeName);

        const request = store.add(data);

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject(request.error);

        transaction.onerror = () => reject(transaction.error);

    });

}

// ==========================================
// OBTENER INFORMACIÓN
// ==========================================

async function getAllData(storeName) {

    const database = await connectMyDailyLifeDB();

    if (!database) {
        throw new Error("La conexión con la base de datos no existe.");
    }

    if (!database.objectStoreNames.contains(storeName)) {
        throw new Error("No existe el almacenamiento: " + storeName);
    }

    return new Promise((resolve, reject) => {

        const transaction = database.transaction(storeName, "readonly");

        const store = transaction.objectStore(storeName);

        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject(request.error);

        transaction.onerror = () => reject(transaction.error);

    });

}

// ==========================================
// ELIMINAR INFORMACIÓN
// ==========================================

async function deleteData(storeName, id) {

    const database = await connectMyDailyLifeDB();

    return new Promise((resolve, reject) => {

        const transaction = database.transaction(storeName, "readwrite");

        const store = transaction.objectStore(storeName);

        const request = store.delete(id);

        request.onsuccess = () => resolve(true);

        request.onerror = () => reject(request.error);

        transaction.onerror = () => reject(transaction.error);

    });

}

// ==========================================
// ACTUALIZAR INFORMACIÓN
// ==========================================

async function updateData(storeName, data) {

    const database = await connectMyDailyLifeDB();

    return new Promise((resolve, reject) => {

        const transaction = database.transaction(storeName, "readwrite");

        const store = transaction.objectStore(storeName);

        const request = store.put(data);

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject(request.error);

        transaction.onerror = () => reject(transaction.error);

    });

}

// ==========================================
// COMPROBAR BASE DE DATOS
// ==========================================

async function checkDatabase() {

    try {

        const database = await connectMyDailyLifeDB();

        console.log("MY DAILY LIFE: Base de datos conectada 💚");

        console.log(
            "Almacenamientos:",
            [...database.objectStoreNames]
        );

        return true;

    } catch (error) {

        console.error("Error de base de datos:", error);

        return false;

    }

}