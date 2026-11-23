// =====================================
// ELEMENTOS
// =====================================

const ideaForm = document.getElementById("ideaForm");
const ideaList = document.getElementById("ideaList");


// =====================================
// MOSTRAR IDEAS
// =====================================

async function showIdeas() {

    const ideas = await getAllData("ideas");

    ideaList.innerHTML = "";

    if (ideas.length === 0) {

        ideaList.textContent = "Todavía no has guardado ideas.";

        return;

    }

    ideas.forEach(idea => {

        const card = document.createElement("article");

        const title = document.createElement("h3");
        title.textContent = idea.title;

        const description = document.createElement("p");
        description.textContent = idea.description || "Sin descripción.";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";

        deleteButton.addEventListener("click", async () => {

            if (confirm("¿Eliminar esta idea?")) {

                await deleteData("ideas", idea.id);

                showIdeas();

            }

        });

        card.append(title, description, deleteButton);

        ideaList.appendChild(card);

    });

}


// =====================================
// GUARDAR IDEA
// =====================================

ideaForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const newIdea = {

        title: document.getElementById("ideaTitle").value.trim(),

        description: document.getElementById("ideaDescription").value.trim()

    };

    if (!newIdea.title) return;

    await saveData("ideas", newIdea);

    ideaForm.reset();

    showIdeas();

});