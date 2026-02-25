document.addEventListener('DOMContentLoaded', function() {
    const checkoutItemsList = document.getElementById('checkoutItemsList');
    const checkoutTotalPrice = document.getElementById('checkoutTotalPrice');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutSubmitBtn = document.getElementById('checkoutSubmitBtn');
    
    // Загружаем корзину
    cart.load();
    
    // Отображаем товары из корзины
    function renderCheckoutItems() {
        if (!checkoutItemsList) return;
        
        checkoutItemsList.innerHTML = '';
        
        if (cart.items.length === 0) {
            checkoutItemsList.innerHTML = `
                <div class="checkout-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Корзина пуста</p>
                    <a href="../../parts/Каталог/Catalog.html">Перейти в каталог</a>
                </div>
            `;
            if (checkoutSubmitBtn) {
                checkoutSubmitBtn.disabled = true;
            }
            return;
        }
        
        if (checkoutSubmitBtn) {
            checkoutSubmitBtn.disabled = false;
        }
        
        cart.items.forEach(item => {
            const checkoutItem = document.createElement('div');
            checkoutItem.className = 'checkout-item';
            
            const imagePath = item.image || '../../IMG/product/default.jpg';
            
            // Извлекаем число из строки цены (убираем все нецифровые символы и пробелы)
            const priceStr = item.price.replace(/[^\d]/g, '').replace(/\s/g, '');
            const price = parseFloat(priceStr) || 0;
            const totalPrice = price * item.quantity;
            
            // Формируем информацию о размере и цвете
            let attributesInfo = '';
            if (item.size || item.color) {
                const attributes = [];
                if (item.size) {
                    attributes.push(`Размер: ${item.size}`);
                }
                if (item.color) {
                    attributes.push(`Цвет: ${item.color}`);
                }
                attributesInfo = `<div class="checkout-item-attributes">${attributes.join(', ')}</div>`;
            }
            
            // Проверяем, нужно ли показать подсказку "выберите размер"
            let sizeWarningInfo = '';
            let hasSizes = false;
            if (item.category === 'clothing') {
                hasSizes = true; // Одежда обычно имеет размеры
            } else if (typeof productsDatabase !== 'undefined' && productsDatabase[item.id]) {
                hasSizes = productsDatabase[item.id].sizes && productsDatabase[item.id].sizes.length > 0;
            } else if (typeof productsData !== 'undefined' && productsData[item.id]) {
                hasSizes = productsData[item.id].sizes && productsData[item.id].sizes.length > 0;
            }
            
            if (!item.size && hasSizes) {
                const currentPath = window.location.pathname;
                let productPageUrl = '../../parts/Товар/Product.html';
                
                sizeWarningInfo = `
                    <div class="checkout-item-size-warning">
                        <a href="${productPageUrl}?id=${item.id}" class="checkout-item-size-warning-link">
                            <i class="fas fa-exclamation-circle"></i> Выберите размер
                        </a>
                    </div>
                `;
            }
            
            checkoutItem.innerHTML = `
                <img src="${imagePath}" alt="${item.name}" class="checkout-item-image" onerror="this.src='../../IMG/product/default.jpg'">
                <div class="checkout-item-info">
                    <div class="checkout-item-name">${item.name}</div>
                    ${attributesInfo}
                    ${sizeWarningInfo}
                    <div class="checkout-item-details">
                        <span class="checkout-item-quantity">Количество: ${item.quantity}</span>
                        <span class="checkout-item-price">${cart.formatPrice(totalPrice)}</span>
                    </div>
                </div>
            `;
            
            checkoutItemsList.appendChild(checkoutItem);
        });
        
        // Обновляем общую сумму
        if (checkoutTotalPrice) {
            checkoutTotalPrice.textContent = cart.formatPrice(cart.getTotalPrice());
        }
    }
    
    // Функция для показа уведомления
    function showNotification(message, type = 'success') {
        // Удаляем предыдущее уведомление, если есть
        const existingNotification = document.querySelector('.checkout-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `checkout-notification checkout-notification-${type}`;
        notification.innerHTML = `
            <div class="checkout-notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Добавляем в body
        document.body.appendChild(notification);
        
        // Показываем с анимацией
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Убираем через 5 секунд
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // Обработка отправки формы
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (cart.items.length === 0) {
                showNotification('Корзина пуста. Добавьте товары перед оформлением заказа.', 'error');
                return;
            }
            
            // Собираем данные формы
            const formData = {
                name: document.getElementById('fullName').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                address: document.getElementById('address').value.trim(),
                message: document.getElementById('comments').value.trim() || '',
                items: cart.items,
                total: cart.formatPrice(cart.getTotalPrice()),
                paymentMethod: document.getElementById('paymentMethod').value || ''
            };
            
            // Валидация
            if (!formData.name || !formData.phone || !formData.address) {
                showNotification('Пожалуйста, заполните все обязательные поля.', 'error');
                return;
            }
            
            // Валидация телефона (простая проверка)
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(formData.phone)) {
                showNotification('Пожалуйста, введите корректный номер телефона.', 'error');
                return;
            }
            
            // Отключаем кнопку отправки
            if (checkoutSubmitBtn) {
                checkoutSubmitBtn.disabled = true;
                const originalText = checkoutSubmitBtn.innerHTML;
                checkoutSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка заказа...';
                
                // Подготавливаем данные для отправки
                const dataToSend = new FormData();
                dataToSend.append('name', formData.name);
                dataToSend.append('phone', formData.phone);
                dataToSend.append('address', formData.address);
                dataToSend.append('message', formData.message);
                dataToSend.append('items', JSON.stringify(formData.items));
                dataToSend.append('total', formData.total);
                dataToSend.append('paymentMethod', formData.paymentMethod);
                
                // Отправляем данные на сервер
                fetch('../../send_order.php', {
                    method: 'POST',
                    body: dataToSend
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Сохраняем заказ в localStorage (для истории)
                        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
                        orders.push({
                            id: Date.now(),
                            date: new Date().toISOString(),
                            trackingCode: data.tracking_code || '',
                            status: 'Принят',
                            ...formData
                        });
                        localStorage.setItem('orders', JSON.stringify(orders));
                        
                        // Очищаем корзину
                        cart.items = [];
                        cart.save();
                        
                        // Показываем сообщение об успехе
                        let successText = 'Заказ успешно отправлен!';
                        if (data.tracking_code) {
                            successText += ` Трек-номер: ${data.tracking_code}`;
                        }
                        showNotification(successText, 'success');
                        
                        // Перенаправляем на главную страницу через 2 секунды
                        setTimeout(() => {
                            window.location.href = '../../index.html';
                        }, 2000);
                    } else {
                        // Восстанавливаем кнопку
                        checkoutSubmitBtn.disabled = false;
                        checkoutSubmitBtn.innerHTML = originalText;
                        
                        // Показываем ошибку
                        showNotification(data.error || 'Ошибка отправки заказа. Попробуйте еще раз.', 'error');
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    
                    // Восстанавливаем кнопку
                    checkoutSubmitBtn.disabled = false;
                    checkoutSubmitBtn.innerHTML = originalText;
                    
                    // Показываем ошибку
                    showNotification('Ошибка соединения с сервером. Проверьте подключение к интернету и попробуйте еще раз.', 'error');
                });
            }
        });
    }
    
    // Инициализация
    renderCheckoutItems();
    
    // Обновляем при изменении корзины
    const originalSave = cart.save;
    cart.save = function() {
        originalSave.call(this);
        renderCheckoutItems();
    };
});

