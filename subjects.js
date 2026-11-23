// =====================================
// ELEMENTOS HTML
// =====================================

const subjectForm = document.getElementById("subjectForm");
const subjectList = document.getElementById("subjectList");


// =====================================
// MOSTRAR MATERIAS
// =====================================

async function showSubjects() {

    const subjects = await getAllData("subjects");

    subjectList.innerHTML = "";

    if (subjects.length === 0) {
        subjectList.textContent = "Todavía no tienes materias registradas.";
        return;
    }

    subjects.forEach(subject => {

        const card = document.createElement("article");

        const title = document.createElement("h3");
        title.textContent = subject.name;

        const teacher = document.createElement("p");
        teacher.textContent = "Profesor: " + (subject.teacher || "Sin registrar");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";

        deleteButton.addEventListener("click", async () => {

            const confirmDelete = confirm(
                `¿Quieres eliminar la materia ${subject.name}?`
            );

            if (confirmDelete) {
                await deleteData("subjects", subject.id);
                showSubjects();
            }

        });

        card.append(title, teacher, deleteButton);

        subjectList.appendChild(card);

    });

}


// =====================================
// AGREGAR MATERIAS
// =====================================

subjectForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const newSubject = {

        name: document.getElementById("subjectName").value.trim(),

        teacher: document.getElementById("subjectTeacher").value.trim()

    };

    if (!newSubject.name) return;

    try {

        await saveData("subjects", newSubject);

        subjectForm.reset();

        await showSubjects();

    } catch (error) {

        console.error("Error al guardar materia:", error);

        alert("No se pudo guardar la materia.");

    }

});