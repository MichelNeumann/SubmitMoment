const chatToggle = document.querySelector('.chat-toggle');
const chatWindow = document.querySelector('.chat-window');
const chatContent = document.querySelector('.chat-content');

chatWindow.classList.add('open');
chatToggle.textContent = '↓';

chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    chatToggle.textContent = chatWindow.classList.contains('open') ? '↓' : '↑';
})

const chatDataByPage = {
    "tutor-overview": [
        {
            message: "Willkommen zurück!",
            options: [],
        },
        {
            message: "In deiner Abwesenheit hat Gruppe 2 ihre Abgabe im Fach Programmierung hochgeladen.",
            options: [],
        },
        {
            message: "Möchtest du sie dir anschauen?",
            options: [{ text: "Abgabe ansehen", action: "viewSubmission" }],
        }
    ],
    "tutor-submission": [
        {
            message: "Du hast schon 50% der vorhandenen Abgaben korrigiert, eine ist noch übrig. Du schaffst das!",
            options: [],
        },
        {
            message: "Möchtest du die Korrektur für Gruppe 2 jetzt hochladen?",
            options: [{text: "Korrektur hochladen", action: "uploadCorrection"}],
        }
    ],
    "student-overview": [
        {
            message: "Willkommen zurück!",
            options: [],
        },
        {
            message: 'Der Abgabezeitraum für Programmierung "Übungsblatt 6: Pointer Arrays und Hashmaps" endet in 2 Tagen.',
            options: [{ text: "Kurs öffnen", action: "openCourse" }],
        }
    ],
    "student-submission": [
        {
            message: "Zwei von drei Aufgaben sind schon erledigt. Deine fehlt noch.",
            options: [],
        },
        {
            message: "Möchtest du deine Aufgabe einreichen?",
            options: [{ text: "Datei hochladen", action: "uploadExercise" }],
        },
    ],
    "help-command": [
        {
            message: "Hier sind die verfügbaren Befehle:",
            options: [],
        },
        {
            message: "- /help: Zeigt diese Hilfenachricht an\n- /handbuch: Lädt das Benutzerhandbuch herunter",
            options: [{ text: "Benutzerhandbuch anzeigen", action: "downloadHandbook" }],
        }
    ]
};

function uploadCorrection() {
    const fileInput = document.getElementById("file-upload");
    fileInput.accept = ".pdf, .zip";

    fileInput.onchange = function () {
        const file = fileInput.files[0];
        if (file) {
            setTimeout(() => {
                const chatMessages = document.getElementById("chat-messages");
                const messageElement1 = document.createElement("p");
                messageElement1.textContent = "Du hast die Bewertung für Gruppe 2 erfolgreich hochgeladen. Gut gemacht!";
                chatMessages.appendChild(messageElement1);

                const messageElement2 = document.createElement("p");
                messageElement2.textContent = "Es gibt aktuell keine weitere Abgabe zu korrigieren.";
                chatMessages.appendChild(messageElement2);

                const existingButton = document.querySelector(".chat-option");
                if (existingButton) {
                    existingButton.remove();
                }

                const button = document.createElement("button");
                button.textContent = "Kursübersicht öffnen";
                button.className = "chat-option";
                button.onclick = () => handleChatOption("kursuebersichtT");
                const chatOptions = document.getElementById("chat-options");
                chatOptions.appendChild(button);

                sessionStorage.setItem("correctionUploaded", "true");
                checkCorrectionStatus();
            }, 1000);
        }
    };
    fileInput.click();
}

function uploadExercise() {
    const fileInput = document.getElementById("file-upload");
    fileInput.accept = ".zip";

    fileInput.onchange = function () {
        const file = fileInput.files[0];
        if (file) {
            console.log("Datei ausgewählt:", file.name);

            setTimeout(() => {
                console.log("Upload erfolgreich: " + file.name);
                const chatMessages = document.getElementById("chat-messages");
                const messageElement1 = document.createElement("p");
                messageElement1.textContent = "Du hast deine Aufgabe erfolgreich hochgeladen. Gut gemacht!";
                chatMessages.appendChild(messageElement1);

                const messageElement2 = document.createElement("p");
                messageElement2.textContent = "Dein aktualisierter Fortschritt liegt bei 100%.";
                chatMessages.appendChild(messageElement2);

                const existingButton = document.querySelector(".chat-option");
                if (existingButton) {
                    existingButton.remove();
                }
                document.getElementById('user-progress').style.width = '100%';

                document.querySelector('.group-progress .progress-fill').style.width = '100%';
                document.querySelector('.group-progress small').textContent = '3 von 3 Abgaben completed';
                const button = document.createElement("button");
                button.textContent = "Kursübersicht öffnen";
                button.className = "chat-option";
                button.onclick = () => handleChatOption("kursuebersichtS_TEST");
                const chatOptions = document.getElementById("chat-options");
                chatOptions.appendChild(button);

                sessionStorage.setItem("exerciseUploaded", "true");
                checkExerciseStatus();
            }, 1000);
        }
    };

    fileInput.click();
}

function downloadHandbook() {
    var link = document.createElement("a");
    link.download = name;
    link.href = "../Benutzerhandbuch.md";
    link.click();
}

function handleChatInput(input) {
    const chatMessages = document.getElementById("chat-messages");
    const chatOptions = document.getElementById("chat-options");

    switch(input.toLowerCase()) {
        case '/help':
        case 'help':
            currentChatData = chatDataByPage["help-command"];
            displayMessagesWithDelay(currentChatData, 500);
            break;

        case '/handbuch':
            const messageElement = document.createElement("p");
            messageElement.textContent = "Das Benutzerhandbuch wird heruntergeladen...";
            chatMessages.appendChild(messageElement);
            downloadHandbook();
            break;

        default:
            const responseElement = document.createElement("p");
            responseElement.textContent = "Befehl nicht erkannt. Nutze /help für eine Liste der verfügbaren Befehle.";
            chatMessages.appendChild(responseElement);
    }
}

let currentStep = 0;
let currentChatData = [];

function loadChatData() {
    const page = document.body.getAttribute("data-page");
    currentChatData = chatDataByPage[page] || [];
}

function loadChatStep(step) {
    const chatMessages = document.getElementById("chat-messages");
    const chatOptions = document.getElementById("chat-options");

    if (!currentChatData[step]) return;

    const messageElement = document.createElement("p");
    messageElement.textContent = currentChatData[step].message;
    chatMessages.appendChild(messageElement);

    chatOptions.innerHTML = "";
    currentChatData[step].options.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option.text;
        button.className = "chat-option";
        button.onclick = () => handleChatOption(option.action);
        chatOptions.appendChild(button);
    });
}

function displayMessagesWithDelay(messages, delay) {
    let step = 0;
    function showNextMessage() {
        if (step < messages.length) {
            loadChatStep(step);
            step++;
            setTimeout(showNextMessage, delay);
        }
    }
    showNextMessage();
}

function handleChatOption(action) {
    if (action == "viewSubmission") {
        window.location.href = "submissionT.html";
    }
    else if (action == "uploadCorrection") {
        uploadCorrection();
    }
    else if (action == "openCourse") {
        window.location.href = "submissionS.html";
    }
    else if (action == "uploadExercise") {
        uploadExercise();
    }
    else if (action == "kursuebersichtS") {
        window.location.href = "progUebersichtS.html";
    }
    else if (action == "kursuebersichtS_TEST") {
        window.location.href = "progUebersichtS_TEST.html";
    }
    else if (action == "kursuebersichtT") {
        window.location.href = "progUebersichtT.html";
    }
    else if (action === "downloadHandbook") {
        downloadHandbook();
    }
}

window.onload = () => {
    loadChatData();

    // Add event listeners for chat input
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.chat-input button');

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            handleChatInput(message);
            chatInput.value = '';
        }
    }

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    sendButton.addEventListener('click', sendMessage);

    if (document.body.getAttribute("data-page") === "tutor-overview"
        || document.body.getAttribute("data-page") === "tutor-submission"
        || document.body.getAttribute("data-page") === "student-overview"
        || document.body.getAttribute("data-page") === "student-submission") {
        displayMessagesWithDelay(currentChatData, 1000);
    } else {
        loadChatStep(currentStep);
    }
};