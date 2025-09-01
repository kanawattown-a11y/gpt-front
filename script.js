document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    const BACKEND_URL = 'https://gpt-back-zloy.onrender.com/chat';

    function addMessage(text, sender ) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = text;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function showLoadingIndicator() {
        const loadingElement = document.createElement('div');
        loadingElement.id = 'loading-indicator';
        loadingElement.classList.add('loading-indicator');
        loadingElement.innerHTML = '<span></span><span></span><span></span>';
        chatBox.appendChild(loadingElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function hideLoadingIndicator() {
        const loadingElement = document.getElementById('loading-indicator');
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    async function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        addMessage(messageText, 'user');
        userInput.value = '';
        userInput.style.height = 'auto';
        showLoadingIndicator();

        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // إرسال رسالة واحدة فقط
                body: JSON.stringify({ message: messageText }),
            });

            hideLoadingIndicator();

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "An unknown server error occurred." }));
                throw new Error(errorData.error);
            }

            const data = await response.json();
            addMessage(data.reply, 'bot');

        } catch (error) {
            hideLoadingIndicator();
            addMessage(`عذراً، حدث خطأ: ${error.message}`, 'bot');
            console.error('Error during fetch:', error);
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = (userInput.scrollHeight) + 'px';
    });
});
