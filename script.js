// Estado inicial del tigre
let tiger = {
    type: null,
    hunger: 100,
    happiness: 100,
    energy: 100,
    level: 1,
    name: "",
    personality: "",
    eyes: ""
};

// Definición de tipos de tigres
const tigerTypes = [
    { type: "Tigre Blanco Clásico", eyes: "azules", personality: "Valiente", messages: ["¡Ruge conmigo!", "¡Soy el rey!"] },
    { type: "Tigre Blanco Grisáceo", eyes: "verdes", personality: "Curioso", messages: ["¿Qué hay ahí?", "¡Exploremos!"] },
    { type: "Tigre Blanco Dorado", eyes: "ámbar", personality: "Leal", messages: ["Siempre contigo", "¡Gracias por cuidarme!"] }
];

// Habitaciones
const rooms = [
    "assets/piclumen-1742244709405.png", // Porche
    "assets/piclumen-1742244621405.png", // Cocina
    "assets/piclumen-1742247794486.png", // Comedor
    "assets/piclumen-1742244520464.png", // Salón
    "assets/piclumen-1742244746912.png"  // Piscina
];

let currentRoomIndex = 0;

// Iniciar juego
function startGame() {
    document.getElementById("intro-scene").classList.add("hidden");
    document.getElementById("game-scene").classList.remove("hidden");
    initializeTiger();
}

// Inicializar tigre aleatorio
function initializeTiger() {
    const randomIndex = Math.floor(Math.random() * tigerTypes.length);
    const selectedTiger = tigerTypes[randomIndex];
    tiger.type = selectedTiger.type;
    tiger.eyes = selectedTiger.eyes;
    tiger.personality = selectedTiger.personality;
    document.getElementById("personality").textContent = tiger.personality;
    showSpeech(`Soy un ${tiger.type} con ojos ${tiger.eyes}. ¡Cuídame bien!`);
    updateStats();
}

// Actualizar estadísticas
function updateStats() {
    document.getElementById("hunger-value").textContent = tiger.hunger;
    document.getElementById("happiness-value").textContent = tiger.happiness;
    document.getElementById("energy-value").textContent = tiger.energy;
    document.getElementById("level").textContent = tiger.level;
    document.getElementById("hunger-bar").style.width = `${tiger.hunger}%`;
    document.getElementById("happiness-bar").style.width = `${tiger.happiness}%`;
    document.getElementById("energy-bar").style.width = `${tiger.energy}%`;
}

// Acciones del tigre
function feedTiger() {
    if (tiger.hunger < 100) {
        tiger.hunger = Math.min(100, tiger.hunger + 25);
        tiger.energy -= 5;
        updateStats();
        showSpeech("¡Ñam, qué rico!");
        notify(`${tiger.name || "Tu tigre"} ha comido.`);
    }
}

function playWithTiger() {
    if (tiger.energy > 20) {
        tiger.happiness = Math.min(100, tiger.happiness + 20);
        tiger.energy -= 15;
        tiger.hunger -= 10;
        updateStats();
        showSpeech(getRandomMessage());
        notify(`${tiger.name || "Tu tigre"} está jugando felizmente.`);
    }
}

function restTiger() {
    if (tiger.energy < 100) {
        tiger.energy = Math.min(100, tiger.energy + 30);
        tiger.hunger -= 5;
        updateStats();
        showSpeech("Zzz... gracias.");
        notify(`${tiger.name || "Tu tigre"} ha descansado.`);
    }
}

// Cambiar habitación
function changeRoom() {
    currentRoomIndex = (currentRoomIndex + 1) % rooms.length;
    const roomImg = document.getElementById("room-bg");
    roomImg.style.opacity = 0;
    setTimeout(() => {
        roomImg.src = rooms[currentRoomIndex];
        roomImg.style.opacity = 1;
    }, 500);
}

// Personalización
function showCustomization() {
    const panel = document.getElementById("customization-panel");
    panel.classList.toggle("hidden");
    if (tiger.level >= 2) {
        document.getElementById("animal-options").classList.remove("hidden");
    }
}

function setTigerName() {
    const nameInput = document.getElementById("tiger-name").value;
    if (nameInput) {
        tiger.name = nameInput;
        document.getElementById("tiger-title").textContent = `${tiger.name} - Mi Tigre Virtual`;
        showSpeech(`¡Me encanta mi nombre, ${tiger.name}!`);
        notify(`Tu tigre ahora se llama ${tiger.name}`);
    }
}

function changeAnimal(animal) {
    tiger.type = animal;
    showSpeech(`¡Ahora soy un ${animal}!`);
    notify(`Has cambiado a ${tiger.name} a ${animal}`);
    // Aquí podrías cambiar la imagen del tigre si tuvieras más assets
}

// Mostrar mensajes del tigre
function showSpeech(message) {
    const speech = document.getElementById("tiger-speech");
    speech.textContent = message;
    speech.classList.remove("hidden");
    setTimeout(() => speech.classList.add("hidden"), 3000);
}

function getRandomMessage() {
    const tigerData = tigerTypes.find(t => t.type === tiger.type);
    return tigerData.messages[Math.floor(Math.random() * tigerData.messages.length)];
}

// Notificaciones
function notify(message) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(message);
    } else {
        alert(message); // Fallback
    }
}

// Degradación y nivelación
setInterval(() => {
    tiger.hunger = Math.max(0, tiger.hunger - 1);
    tiger.happiness = Math.max(0, tiger.happiness - 1);
    tiger.energy = Math.max(0, tiger.energy - 1);
    updateStats();

    if (tiger.hunger <= 20 || tiger.happiness <= 20 || tiger.energy <= 20) {
        notify(`${tiger.name || "Tu tigre"} necesita atención urgente!`);
        showSpeech("¡Ayúdame, por favor!");
    }

    if (tiger.hunger >= 80 && tiger.happiness >= 80 && tiger.energy >= 80 && tiger.level < 2) {
        tiger.level = 2;
        notify("¡Has alcanzado el nivel 2! Ahora puedes personalizar más.");
        showSpeech("¡Soy más fuerte ahora!");
    }
}, 3000);

// Solicitar permiso de notificaciones
if ("Notification" in window && Notification.permission !== "denied") {
    Notification.requestPermission();
}
