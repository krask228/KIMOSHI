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
            
            checkoutItem.innerHTML = `
                <img src="${imagePath}" alt="${item.name}" class="checkout-item-image" onerror="this.src='../../IMG/product/default.jpg'">
                <div class="checkout-item-info">
                    <div class="checkout-item-name">${item.name}</div>
                    <div class="checkout-item-details">
                        <span class="checkout-item-quantity">Количество: ${item.quantity}</span>
                        <span class="checkout-item-price">${cart.formatPrice(item.price * item.quantity)}</span>
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

