// Seleccionamos todos los botones del menú
const menuItems = document.querySelectorAll(".menu-item");

// Seleccionamos todas las secciones
const sections = document.querySelectorAll(".content-section");

// Función para cambiar de sección
function showSection(sectionId) {

    // Ocultar todas las secciones
    sections.forEach(section => {
        section.classList.remove("active");
    });

    // Quitar selección de todos los botones
    menuItems.forEach(item => {
        item.classList.remove("active");
    });

    // Mostrar la sección seleccionada
    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    // Marcar el botón seleccionado
    const selectedButton = document.querySelector(
        `.menu-item[data-section="${sectionId}"]`
    );

    if (selectedButton) {
        selectedButton.classList.add("active");
    }
}


// Eventos del menú lateral
menuItems.forEach(item => {

    item.addEventListener("click", () => {

        const sectionId = item.dataset.section;

        showSection(sectionId);

    });

});


// Botones de accesos rápidos
document.querySelectorAll("[data-go]").forEach(button => {

    button.addEventListener("click", () => {

        showSection(button.dataset.go);

    });

});