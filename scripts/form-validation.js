// Валидация контактной формы
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // Имитация отправки формы
                showFormSuccess();
                contactForm.reset();
                clearErrors();
            }
        });

        // Реальная валидация при вводе
        setupRealTimeValidation();
    }

    function validateForm() {
        let isValid = true;
        clearErrors();

        // Валидация имени
        const name = document.getElementById('name').value.trim();
        if (name === '') {
            showError('name-error', 'Поле обязательно для заполнения');
            isValid = false;
        } else if (name.length < 2) {
            showError('name-error', 'Имя должно содержать минимум 2 символа');
            isValid = false;
        }

        // Валидация email
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            showError('email-error', 'Поле обязательно для заполнения');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('email-error', 'Введите корректный email адрес');
            isValid = false;
        }

        // Валидация сообщения
        const message = document.getElementById('message').value.trim();
        if (message === '') {
            showError('message-error', 'Поле обязательно для заполнения');
            isValid = false;
        } else if (message.length < 10) {
            showError('message-error', 'Сообщение должно содержать минимум 10 символов');
            isValid = false;
        }

        return isValid;
    }

    function setupRealTimeValidation() {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        nameInput.addEventListener('blur', validateName);
        emailInput.addEventListener('blur', validateEmail);
        messageInput.addEventListener('blur', validateMessage);

        // Сброс ошибок при начале ввода
        nameInput.addEventListener('input', () => clearError('name-error'));
        emailInput.addEventListener('input', () => clearError('email-error'));
        messageInput.addEventListener('input', () => clearError('message-error'));
    }

    function validateName() {
        const name = document.getElementById('name').value.trim();
        if (name !== '' && name.length < 2) {
            showError('name-error', 'Имя должно содержать минимум 2 символа');
        }
    }

    function validateEmail() {
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email !== '' && !emailRegex.test(email)) {
            showError('email-error', 'Введите корректный email адрес');
        }
    }

    function validateMessage() {
        const message = document.getElementById('message').value.trim();
        if (message !== '' && message.length < 10) {
            showError('message-error', 'Сообщение должно содержать минимум 10 символов');
        }
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    function clearErrors() {
        clearError('name-error');
        clearError('email-error');
        clearError('message-error');
    }

    function showFormSuccess() {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            z-index: 1002;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
});