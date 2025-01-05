const chatToggle = document.querySelector('.chat-toggle');
const chatWindow = document.querySelector('.chat-window');

chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    chatToggle.textContent = chatWindow.classList.contains('open') ? '↓' : '↑';
})
