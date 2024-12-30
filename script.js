function manageScrollAndPageNotifier() {
    const SCROLL_KEY = "lastScrollHeight";
    const PAGE_KEY = "lastPage";
    let PAGE_WIDTH = window.screen.availWidth;
    let PAGE_HEIGHT = window.screen.availHeight; // Высота страницы в пикселях
    let currentPage = 0; // Текущая страница
    let totalPages = Math.floor(document.body.scrollHeight / PAGE_HEIGHT);

    const btn = document.getElementById("set-height")
    btn.textContent = `Установить страницу ${localStorage.getItem(PAGE_KEY) ?? 1}`

    // Функция для отображения уведомления
    function showNotification(pageNumber) {
        const notification = document.createElement("div");
        notification.textContent = `Страница ${pageNumber} / ${totalPages}`;
        notification.style.position = "fixed";
        notification.style.width = "fit-content";
        notification.style.top = "20px";
        notification.style.left = "50%";
        notification.style.transform = "translateX(-50%)";
        notification.style.backgroundColor = "#333";
        notification.style.color = "#fff";
        notification.style.padding = "0px 16px";
        notification.style.borderRadius = "5px";
        notification.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        notification.style.zIndex = "1000";
        notification.style.opacity = "0";
        notification.style.transition = "opacity 0.3s";

        document.body.appendChild(notification);

        // Показать уведомление
        setTimeout(() => {
            notification.style.opacity = "1";
        }, 0);

        //Скрыть и удалить уведомление через 2 секунды
        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Обработчик события скролла
    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;
        const newPage = Math.floor(scrollPosition / PAGE_HEIGHT) + 1;

        if (newPage !== currentPage) {
            currentPage = newPage;
            showNotification(currentPage);
        }

        if(scrollPosition > localStorage.getItem(SCROLL_KEY)) {
            // Сохранить текущую страницу и её высоту
            localStorage.setItem(PAGE_KEY, currentPage);
            localStorage.setItem(SCROLL_KEY, scrollPosition);

            const btn = document.getElementById("set-height")
            btn.textContent = `Установить страницу ${localStorage.getItem(PAGE_KEY)}`
        }

    });

    // Кнопка для установки сохранённой высоты
    const setHeightButton = document.getElementById("set-height");
    setHeightButton.addEventListener("click", () => {
        const savedHeight = localStorage.getItem(SCROLL_KEY);
        const savedPage = localStorage.getItem(PAGE_KEY);
        if (savedHeight && savedPage) {
            window.scrollTo(0, parseInt(savedHeight, 10), { behavior: "smooth" });
        }
    });

    // Кнопка для очистки сохранённой высоты
    const clearHeightButton = document.getElementById("clear-height");
    clearHeightButton.addEventListener("click", () => {
        localStorage.removeItem(SCROLL_KEY);
        localStorage.removeItem(PAGE_KEY);
        alert("Сохранённые данные очищены!");
    });

    window.addEventListener("resize", (e) => {
        // Определяем высоту страницы в зависимости от ориентации
        const isVertical = window.matchMedia("(orientation: portrait)").matches;
        const pageDimension = isVertical ? PAGE_HEIGHT : PAGE_WIDTH;
        const scrollDimension = isVertical ? window.scrollY : window.scrollX

        // document.body.style.maxWidth = `${isVertical ? (PAGE_WIDTH - 16) : (PAGE_HEIGHT - 32)}px`;
        // console.log(`${isVertical ? (PAGE_WIDTH - 16) : (PAGE_HEIGHT - 32)}px`)

        // Пересчитываем общее количество страниц
        totalPages = Math.floor(document.body.scrollHeight / pageDimension);

        // Пересчитываем текущую страницу
        const updatedScrollPosition = scrollDimension;
        const updatedPage = Math.floor(updatedScrollPosition / pageDimension) + 1;

        // Обновляем локальное хранилище
        localStorage.setItem(SCROLL_KEY, updatedScrollPosition);
        localStorage.setItem(PAGE_KEY, updatedPage);

        // Обновить текущую страницу
        currentPage = updatedPage;
    });
}

// Инициализация функции
manageScrollAndPageNotifier();

// // Получаем ширину экрана пользователя
// const screenWidth = window.innerWidth;
//
// // Устанавливаем ширину на body
// document.body.style.maxWidth = `${screenWidth - 16}px`;