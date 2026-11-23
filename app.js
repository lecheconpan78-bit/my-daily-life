// =====================================
// FECHA ACTUAL
// =====================================

const currentDate = document.getElementById("currentDate");

function updateDate() {

    const today = new Date();

    currentDate.textContent = today.toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

}

updateDate();


// =====================================
// SALUDO AUTOMÁTICO
// =====================================

function updateGreeting() {

    const hour = new Date().getHours();

    let greeting;

    if (hour < 12) {
        greeting = "¡Buenos días! ☀️";
    } else if (hour < 19) {
        greeting = "¡Buenas tardes! 🌤️";
    } else {
        greeting = "¡Buenas noches! 🌙";
    }

    document.getElementById("greeting").textContent = greeting;

}

updateGreeting();


// =====================================
// TEMA CLARO Y OSCURO
// =====================================

const themeButton = document.getElementById("themeButton");

function applyTheme(theme) {

    document.body.classList.toggle("dark-mode", theme === "dark");

    themeButton.textContent = theme === "dark" ? "☀️" : "🌙";

    localStorage.setItem("myDailyLifeTheme", theme);

}

const savedTheme = localStorage.getItem("myDailyLifeTheme") || "light";

applyTheme(savedTheme);


themeButton.addEventListener("click", () => {

    const newTheme = document.body.classList.contains("dark-mode")
        ? "light"
        : "dark";

    applyTheme(newTheme);

});


document.getElementById("lightThemeButton").addEventListener("click", () => {
    applyTheme("light");
});

document.getElementById("darkThemeButton").addEventListener("click", () => {
    applyTheme("dark");
});