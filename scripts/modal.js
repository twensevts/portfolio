document.addEventListener('DOMContentLoaded', function() {
    // Функциональность для модальных окон проектов
    const projectCards = document.querySelectorAll('.project-card-full');
    
    projectCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });

    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal');
            openModals.forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal.id);
                }
            });
        }
    });

    // Функциональность для дневника - добавление записей
    const addEntryBtn = document.querySelector('.btn-secondary');
    
    if (addEntryBtn && addEntryBtn.textContent.includes('Добавить запись')) {
        addEntryBtn.addEventListener('click', function() {
            openAddEntryModal();
        });
    }

    function openAddEntryModal() {
        // Создаем модальное окно для добавления записи
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'add-entry-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Добавить новую запись</h2>
                <form class="diary-form">
                    <div class="form-group">
                        <label for="entry-date">Дата:</label>
                        <input type="date" id="entry-date" name="entry-date" required>
                    </div>
                    <div class="form-group">
                        <label for="entry-title">Название:</label>
                        <input type="text" id="entry-title" name="entry-title" placeholder="Например: Изучение React" required>
                    </div>
                    <div class="form-group">
                        <label for="entry-description">Описание:</label>
                        <textarea id="entry-description" name="entry-description" placeholder="Опишите что вы изучили..." rows="4" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="entry-status">Статус:</label>
                        <select id="entry-status" name="entry-status" required>
                            <option value="completed">Выполнено</option>
                            <option value="pending">В процессе</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Добавить запись</button>
                        <button type="button" class="btn-secondary" id="cancel-entry">Отмена</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Фокусируемся на поле даты (сегодняшняя дата по умолчанию)
        const dateInput = document.getElementById('entry-date');
        dateInput.value = new Date().toISOString().split('T')[0];

        // Обработчики событий для модального окна дневника
        setupDiaryModalHandlers(modal);
    }

    function setupDiaryModalHandlers(modal) {
        // Закрытие по кнопке отмена
        const cancelBtn = modal.querySelector('#cancel-entry');
        cancelBtn.addEventListener('click', function() {
            closeDiaryModal(modal);
        });

        // Закрытие по клику вне модального окна
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeDiaryModal(modal);
            }
        });

        // Закрытие по Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeDiaryModal(modal);
            }
        });

        // Обработка отправки формы
        const form = modal.querySelector('.diary-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewEntry(this);
            closeDiaryModal(modal);
        });
    }

    function closeDiaryModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Удаляем модальное окно из DOM после анимации
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    function addNewEntry(form) {
        const formData = new FormData(form);
        const date = formData.get('entry-date');
        const title = formData.get('entry-title');
        const description = formData.get('entry-description');
        const status = formData.get('entry-status');

        const formattedDate = formatDate(date);

        const newEntry = document.createElement('div');
        newEntry.className = `timeline-item ${status}`;
        newEntry.innerHTML = `
            <div class="timeline-date">${formattedDate}</div>
            <div class="timeline-content">
                <h3>${title}</h3>
                <p class="entry-description">${description}</p>
                <span class="status ${status}">${status === 'completed' ? '✓ Выполнено' : '✗ В процессе'}</span>
            </div>
        `;

        const timeline = document.querySelector('.timeline');
        if (timeline) {
            timeline.insertBefore(newEntry, timeline.firstChild);
        }

        showNotification('Новая запись успешно добавлена!');
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('ru', { month: 'short' });
        return `${day} ${month}`;
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
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
        }, 3000);
    }
});