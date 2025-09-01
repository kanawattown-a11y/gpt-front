// في ملف script.js
document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    // تأكد من أن هذا الرابط صحيح
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
        loadingElement.classList.add('loading-indicator');
        loadingElement.innerHTML = '<span></span><span></span><span></span>';
        chatBox.appendChild(loadingElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function hideLoadingIndicator() {
        const loadingElement = document.querySelector('.loading-indicator');
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText }),
            });

            hideLoadingIndicator();

            if (!response.ok) {
                // عرض رسالة خطأ أكثر تفصيلاً للمستخدم
                const errorData = await response.json();
                throw new Error(errorData.error || 'حدث خطأ أثناء الاتصال بالخادم.');
            }

            const data = await response.json();
            addMessage(data.reply, 'bot');

        } catch (error) {
            // *** تم التصحيح هنا ***
            hideLoadingIndicator(); // كان اسمها hideLoading-indicator
            addMessage(`عذراً، حدث خطأ: ${error.message}`, 'bot');
            console.error('Error:', error);
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
