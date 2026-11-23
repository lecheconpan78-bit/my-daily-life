// =====================================
// ELEMENTOS
// =====================================

const noteForm = document.getElementById("noteForm");
const noteList = document.getElementById("noteList");


// =====================================
// MOSTRAR NOTAS
// =====================================

async function showNotes() {

    const notes = await getAllData("notes");

    noteList.innerHTML = "";

    if (notes.length === 0) {

        noteList.textContent = "Todavía no tienes notas.";

        return;

    }

    notes.forEach(note => {

        const card = document.createElement("article");

        const title = document.createElement("h3");
        title.textContent = note.title;

        const content = document.createElement("p");
        content.textContent = note.content;

        const date = document.createElement("small");
        date.textContent = note.date;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";

        deleteButton.addEventListener("click", async () => {

            if (confirm("¿Eliminar esta nota?")) {

                await deleteData("notes", note.id);

                showNotes();

            }

        });

        card.append(title, content, date, deleteButton);

        noteList.appendChild(card);

    });

}


// =====================================
// GUARDAR NOTA
// =====================================

noteForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const newNote = {

        title: document.getElementById("noteTitle").value.trim(),

        content: document.getElementById("noteContent").value.trim(),

        date: new Date().toLocaleString("es-MX")

    };

    if (!newNote.title || !newNote.content) return;

    await saveData("notes", newNote);

    noteForm.reset();

    showNotes();

});