document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    // الرابط الكامل للواجهة الخلفية على Render
    const BACKEND_URL = 'https://gpt-back-zloy.onrender.com/chat';

    // دالة لإضافة رسالة إلى صندوق الشات
    function addMessage(text, sender ) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = text;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // تمرير للأسفل دائماً
    }

    // دالة لإظهار مؤشر "جاري الكتابة..."
    function showLoadingIndicator() {
        const loadingElement = document.createElement('div');
        loadingElement.id = 'loading-indicator'; // تم إضافة ID لسهولة الحذف
        loadingElement.classList.add('loading-indicator');
        loadingElement.innerHTML = '<span></span><span></span><span></span>';
        chatBox.appendChild(loadingElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // دالة لإخفاء مؤشر "جاري الكتابة..."
    function hideLoadingIndicator() {
        const loadingElement = document.getElementById('loading-indicator');
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    // الدالة الرئيسية لإرسال الرسالة
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

            // إخفاء مؤشر التحميل فور وصول الرد (سواء كان ناجحاً أو فاشلاً)
            hideLoadingIndicator();

            if (!response.ok) {
                // إذا كان الرد خطأ (مثل 500 أو 400)، حاول قراءة رسالة الخطأ من الخادم
                const errorData = await response.json().catch(() => ({ error: "An unknown server error occurred." }));
                throw new Error(errorData.error);
            }

            const data = await response.json();
            addMessage(data.reply, 'bot');

        } catch (error) {
            // --- تم التصحيح هنا ---
            // التأكد من إخفاء مؤشر التحميل في حال حدوث أي خطأ
            hideLoadingIndicator(); 
            
            // عرض رسالة الخطأ للمستخدم في الشات
            addMessage(`عذراً، حدث خطأ: ${error.message}`, 'bot');
            console.error('Error during fetch:', error);
        }
    }

    // ربط الأحداث مع الأزرار وحقل الإدخال
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (event) => {
        // إرسال الرسالة عند الضغط على Enter (وليس Shift+Enter)
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // منع إدخال سطر جديد
            sendMessage();
        }
    });

    // تعديل ارتفاع حقل الإدخال تلقائياً مع الكتابة
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = (userInput.scrollHeight) + 'px';
    });
});
