document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    // **مهم جداً:** قم بتغيير هذا الرابط إلى رابط الواجهة الخلفية الخاصة بك على Render
    const BACKEND_URL = 'https://gpt-back-zloy.onrender.com/';

    // إضافة رسالة إلى صندوق الشات
    function addMessage(text, sender ) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = text;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // تمرير للأسفل دائماً
    }

    // إظهار مؤشر الكتابة
    function showLoadingIndicator() {
        const loadingElement = document.createElement('div');
        loadingElement.classList.add('loading-indicator');
        loadingElement.innerHTML = '<span></span><span></span><span></span>';
        chatBox.appendChild(loadingElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // إخفاء مؤشر الكتابة
    function hideLoadingIndicator() {
        const loadingElement = document.querySelector('.loading-indicator');
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    // دالة إرسال الرسالة
    async function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        addMessage(messageText, 'user');
        userInput.value = '';
        userInput.style.height = 'auto'; // إعادة ضبط ارتفاع حقل الإدخال
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
                throw new Error('حدث خطأ أثناء الاتصال بالخادم.');
            }

            const data = await response.json();
            addMessage(data.reply, 'bot');

        } catch (error) {
            hideLoading-indicator();
            addMessage('عذراً، لا يمكن الوصول إلى الخدمة حالياً. يرجى المحاولة مرة أخرى لاحقاً.', 'bot');
            console.error('Error:', error);
        }
    }

    // ربط الأحداث
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    // تعديل ارتفاع حقل الإدخال تلقائياً
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = (userInput.scrollHeight) + 'px';
    });
});
