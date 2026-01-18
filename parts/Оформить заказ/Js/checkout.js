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
    
    // Обработка отправки формы
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (cart.items.length === 0) {
                alert('Корзина пуста. Добавьте товары перед оформлением заказа.');
                return;
            }
            
            // Собираем данные формы
            const formData = {
                items: cart.items,
                total: cart.getTotalPrice(),
                fullName: document.getElementById('fullName').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                paymentMethod: document.getElementById('paymentMethod').value,
                comments: document.getElementById('comments').value || ''
            };
            
            // Валидация
            if (!formData.fullName || !formData.phone || !formData.address || !formData.paymentMethod) {
                alert('Пожалуйста, заполните все обязательные поля.');
                return;
            }
            
            // Отключаем кнопку отправки
            if (checkoutSubmitBtn) {
                checkoutSubmitBtn.disabled = true;
                checkoutSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Оформление заказа...';
            }
            
            // Имитация отправки заказа (здесь можно добавить реальную отправку на сервер)
            setTimeout(() => {
                // Сохраняем заказ в localStorage (для демонстрации)
                const orders = JSON.parse(localStorage.getItem('orders') || '[]');
                orders.push({
                    id: Date.now(),
                    date: new Date().toISOString(),
                    ...formData
                });
                localStorage.setItem('orders', JSON.stringify(orders));
                
                // Очищаем корзину
                cart.items = [];
                cart.save();
                
                // Показываем сообщение об успехе
                alert('Заказ успешно оформлен! Номер заказа: #' + orders[orders.length - 1].id);
                
                // Перенаправляем на главную страницу
                window.location.href = '../../index.html';
            }, 1500);
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

