document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('kimoshiIsLoggedIn') === 'true';
    const userRaw = localStorage.getItem('kimoshiUser');
    let user = null;

    try {
        user = userRaw ? JSON.parse(userRaw) : null;
    } catch (e) {
        user = null;
    }

    // Если пользователь не авторизован - отправляем на страницу входа
    if (!isLoggedIn) {
        window.location.href = '../Войти/Login.html';
        return;
    }

    // Заполняем данные пользователя в шапке
    const userNameEl = document.getElementById('accountUserName');
    const userEmailEl = document.getElementById('accountUserEmail');

    if (user) {
        if (userNameEl) userNameEl.textContent = user.name || 'Пользователь';
        if (userEmailEl) userEmailEl.textContent = user.email || '';
    }

    // Переключение разделов
    const menuButtons = document.querySelectorAll('.account-menu-item');
    const sections = document.querySelectorAll('.account-section');

    menuButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id === 'accountLogout') return;

            const sectionKey = btn.getAttribute('data-section');
            if (!sectionKey) return;

            menuButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));

            btn.classList.add('active');
            const target = document.getElementById('section-' + sectionKey);
            if (target) target.classList.add('active');
        });
    });

    // Логаут
    const logoutBtn = document.getElementById('accountLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('kimoshiIsLoggedIn');
            // Данные пользователя по желанию можно оставить для удобства
            window.location.href = '../Войти/Login.html';
        });
    }

    // Работа с заказами
    const ordersRaw = localStorage.getItem('orders') || '[]';
    let orders = [];
    try {
        orders = JSON.parse(ordersRaw);
    } catch (e) {
        orders = [];
    }

    const metricTotalOrders = document.getElementById('metricTotalOrders');
    const metricActiveOrders = document.getElementById('metricActiveOrders');
    const metricLastOrder = document.getElementById('metricLastOrder');

    const ordersEmpty = document.getElementById('ordersEmpty');
    const ordersWrapper = document.getElementById('ordersListWrapper');
    const ordersTableBody = document.querySelector('#ordersTable tbody');

    const statusEmpty = document.getElementById('statusEmpty');
    const statusContent = document.getElementById('statusContent');
    const statusOrderId = document.getElementById('statusOrderId');
    const statusOrderStatus = document.getElementById('statusOrderStatus');
    const statusOrderDate = document.getElementById('statusOrderDate');
    const statusOrderTotal = document.getElementById('statusOrderTotal');
    const statusTrackingCode = document.getElementById('statusTrackingCode');
    const statusOrderAddress = document.getElementById('statusOrderAddress');
    const statusItemsList = document.getElementById('statusItemsList');

    function formatDate(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return iso;
        return d.toLocaleString('ru-RU');
    }

    function detectStatus(order) {
        if (!order || !order.date) return 'Принят';
        const created = new Date(order.date);
        const diffHours = (Date.now() - created.getTime()) / 36e5;
        if (diffHours < 1) return 'Принят';
        if (diffHours < 24) return 'В пути';
        return 'Доставлен';
    }

    // Заполняем дашборд и таблицу заказов
    if (!orders.length) {
        if (ordersEmpty) ordersEmpty.style.display = 'block';
        if (ordersWrapper) ordersWrapper.style.display = 'none';
        if (statusEmpty) statusEmpty.style.display = 'block';
        if (statusContent) statusContent.style.display = 'none';

        if (metricTotalOrders) metricTotalOrders.textContent = '0';
        if (metricActiveOrders) metricActiveOrders.textContent = '0';
        if (metricLastOrder) metricLastOrder.textContent = '—';
    } else {
        if (ordersEmpty) ordersEmpty.style.display = 'none';
        if (ordersWrapper) ordersWrapper.style.display = 'block';

        const total = orders.length;
        const active = orders.filter(o => detectStatus(o) !== 'Доставлен').length;
        const lastOrder = orders[orders.length - 1];

        if (metricTotalOrders) metricTotalOrders.textContent = String(total);
        if (metricActiveOrders) metricActiveOrders.textContent = String(active);
        if (metricLastOrder) {
            metricLastOrder.textContent = `${formatDate(lastOrder.date)} · ${lastOrder.total || ''}`;
        }

        ordersTableBody.innerHTML = '';
        orders.forEach(order => {
            const tr = document.createElement('tr');
            const statusText = detectStatus(order);

            const itemsText = Array.isArray(order.items)
                ? order.items.map(i => i.name).join(', ')
                : '';

            tr.innerHTML = `
                <td>${formatDate(order.date)}</td>
                <td>${itemsText}</td>
                <td>${order.total || ''}</td>
                <td>${statusText}</td>
                <td>${order.trackingCode || ''}</td>
            `;
            ordersTableBody.appendChild(tr);
        });

        // Блок "Статус заказа" – показываем последний заказ
        if (statusEmpty) statusEmpty.style.display = 'none';
        if (statusContent) statusContent.style.display = 'block';

        if (statusOrderId) statusOrderId.textContent = `ID: ${lastOrder.id}`;
        if (statusOrderStatus) statusOrderStatus.textContent = detectStatus(lastOrder);
        if (statusOrderDate) statusOrderDate.textContent = formatDate(lastOrder.date);
        if (statusOrderTotal) statusOrderTotal.textContent = lastOrder.total || '';
        if (statusTrackingCode) statusTrackingCode.textContent = lastOrder.trackingCode || '—';
        if (statusOrderAddress) statusOrderAddress.textContent = lastOrder.address || '';

        if (statusItemsList) {
            statusItemsList.innerHTML = '';
            if (Array.isArray(lastOrder.items)) {
                lastOrder.items.forEach(item => {
                    const li = document.createElement('li');
                    const size = item.size ? `, размер: ${item.size}` : '';
                    const color = item.color ? `, цвет: ${item.color}` : '';
                    li.textContent = `${item.name || 'Товар'} (кол-во: ${item.quantity || 1}${size}${color})`;
                    statusItemsList.appendChild(li);
                });
            }
        }
    }

    // Личные данные
    const profileForm = document.getElementById('profileForm');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');
    const profileSuccess = document.getElementById('profileSuccess');

    if (user) {
        if (profileName) profileName.value = user.name || '';
        if (profileEmail) profileEmail.value = user.email || '';
        if (profilePhone) profilePhone.value = user.phone || '';
    }

    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const updatedUser = {
                ...(user || {}),
                name: profileName ? profileName.value.trim() : '',
                email: profileEmail ? profileEmail.value.trim() : '',
                phone: profilePhone ? profilePhone.value.trim() : ''
            };
            localStorage.setItem('kimoshiUser', JSON.stringify(updatedUser));
            if (profileSuccess) {
                profileSuccess.textContent = 'Данные успешно сохранены';
                profileSuccess.classList.add('visible');
                setTimeout(() => profileSuccess.classList.remove('visible'), 2000);
            }
            if (userNameEl) userNameEl.textContent = updatedUser.name || 'Пользователь';
            if (userEmailEl) userEmailEl.textContent = updatedUser.email || '';
        });
    }

    // Адресная книга
    const addressForm = document.getElementById('addressForm');
    const addressMain = document.getElementById('addressMain');
    const addressSuccess = document.getElementById('addressSuccess');

    const addressRaw = localStorage.getItem('kimoshiAddress');
    if (addressRaw && addressMain) {
        addressMain.value = addressRaw;
    }

    if (addressForm) {
        addressForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (addressMain) {
                localStorage.setItem('kimoshiAddress', addressMain.value.trim());
            }
            if (addressSuccess) {
                addressSuccess.textContent = 'Адрес сохранён';
                addressSuccess.classList.add('visible');
                setTimeout(() => addressSuccess.classList.remove('visible'), 2000);
            }
        });
    }
});

