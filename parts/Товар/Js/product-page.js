document.addEventListener('DOMContentLoaded', function() {
    // Загружаем корзину
    if (typeof cart !== 'undefined') {
        cart.load();
    }
    
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const productName = urlParams.get('name');
    
    let product = null;
    
    // Пытаемся найти товар
    if (productId && typeof getProductById !== 'undefined') {
        product = getProductById(productId);
    } else if (productName && typeof getProductByName !== 'undefined') {
        product = getProductByName(productName);
    }
    
    // Если товар не найден в базе, создаем его из параметров URL
    if (!product) {
        let productImages = [];
        try {
            const imagesParam = urlParams.get('images');
            if (imagesParam) {
                productImages = JSON.parse(decodeURIComponent(imagesParam));
                // Нормализуем пути к изображениям
                productImages = productImages.map(imgPath => {
                    // Если путь начинается с ./IMG или ./Img, заменяем на путь от страницы продукта
                    if (imgPath.startsWith('./IMG/') || imgPath.startsWith('./Img/')) {
                        return '../../' + imgPath.substring(2);
                    }
                    // Если путь начинается с ../../IMG или ../../Img, оставляем как есть
                    if (imgPath.startsWith('../../IMG/') || imgPath.startsWith('../../Img/')) {
                        return imgPath;
                    }
                    // Если путь начинается с ../IMG или ../Img, добавляем еще один ../
                    if (imgPath.startsWith('../IMG/') || imgPath.startsWith('../Img/')) {
                        return '../' + imgPath;
                    }
                    return imgPath;
                });
            }
        } catch (e) {
            console.error('Ошибка при парсинге изображений:', e);
        }
        
        product = {
            id: productId || 'product-' + Date.now(),
            name: productName ? decodeURIComponent(productName) : 'Товар',
            price: urlParams.get('price') || '0 ₽',
            oldPrice: urlParams.get('oldPrice') || '',
            images: productImages,
            description: urlParams.get('description') || 'Описание товара отсутствует.',
            sizes: urlParams.get('sizes') ? JSON.parse(decodeURIComponent(urlParams.get('sizes'))) : null,
            category: urlParams.get('category') || 'clothing'
        };
        
        // Если изображения не переданы, пытаемся найти их из базы данных по ID
        if (product.images.length === 0 && productId && typeof getProductById !== 'undefined') {
            const dbProduct = getProductById(productId);
            if (dbProduct && dbProduct.images) {
                product.images = dbProduct.images;
                product.description = dbProduct.description || product.description;
                product.sizes = dbProduct.sizes || product.sizes;
            }
        }
    }
    
    // Отображаем товар
    if (product) {
        renderProduct(product);
    } else {
        // Если товар не найден, показываем сообщение об ошибке
        document.querySelector('.product-content').innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2>Товар не найден</h2>
                <p>Извините, информация о товаре недоступна.</p>
                <button class="back-btn" onclick="history.back()">
                    <i class="fas fa-arrow-left"></i> Вернуться назад
                </button>
            </div>
        `;
    }
    
    // Обработчик кнопки "Назад"
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            history.back();
        });
    }
    
    // Обработчик кнопки "Добавить в корзину"
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn && typeof cart !== 'undefined') {
        addToCartBtn.addEventListener('click', function() {
            const selectedSize = document.querySelector('.size-item.selected');
            
            // Проверяем, есть ли размеры и выбран ли размер
            if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                alert('Пожалуйста, выберите размер');
                return;
            }
            
            // Получаем выбранный размер
            const size = selectedSize ? selectedSize.textContent.trim() : null;
            
            // Получаем изображение товара
            const productImage = product.images && product.images.length > 0 
                ? product.images[0] 
                : '../../IMG/logo1.jpg';
            
            // Добавляем товар в корзину с размером и категорией
            cart.addItem(product.id, product.name, product.price, productImage, size, null, product.category);
            
            // Показываем уведомление
            if (cart.showNotification) {
                cart.showNotification('Товар добавлен в корзину!');
            }
            
            // Открываем корзину (опционально)
            // cart.openCart();
        });
    }
});

// Функция для отображения товара
function renderProduct(product) {
    // Заголовок
    const productTitle = document.getElementById('productTitle');
    if (productTitle) {
        productTitle.textContent = product.name;
    }
    
    // Цена
    const productPriceCurrent = document.getElementById('productPriceCurrent');
    if (productPriceCurrent) {
        productPriceCurrent.textContent = product.price;
    }
    
    const productPriceOld = document.getElementById('productPriceOld');
    if (productPriceOld) {
        if (product.oldPrice) {
            productPriceOld.textContent = product.oldPrice;
            productPriceOld.style.display = 'inline';
        } else {
            productPriceOld.style.display = 'none';
        }
    }
    
    // Изображения
    const mainProductImage = document.getElementById('mainProductImage');
    const productThumbnails = document.getElementById('productThumbnails');
    
    if (product.images && product.images.length > 0) {
        // Главное изображение
        if (mainProductImage) {
            mainProductImage.src = product.images[0];
            mainProductImage.alt = product.name;
        }
        
        // Миниатюры
        if (productThumbnails) {
            productThumbnails.innerHTML = '';
            
            product.images.forEach((imageUrl, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'product-thumbnail' + (index === 0 ? ' active' : '');
                thumbnail.innerHTML = `<img src="${imageUrl}" alt="${product.name} ${index + 1}">`;
                
                thumbnail.addEventListener('click', function() {
                    // Убираем активный класс со всех миниатюр
                    document.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('active'));
                    // Добавляем активный класс текущей миниатюре
                    thumbnail.classList.add('active');
                    // Меняем главное изображение
                    if (mainProductImage) {
                        mainProductImage.src = imageUrl;
                    }
                });
                
                productThumbnails.appendChild(thumbnail);
            });
        }
    }
    
    // Размеры
    const productSizesSection = document.getElementById('productSizesSection');
    const sizesList = document.getElementById('sizesList');
    
    if (product.sizes && product.sizes.length > 0) {
        if (productSizesSection) {
            productSizesSection.style.display = 'flex';
        }
        
        if (sizesList) {
            sizesList.innerHTML = '';
            
            product.sizes.forEach(size => {
                const sizeItem = document.createElement('button');
                sizeItem.className = 'size-item';
                sizeItem.type = 'button';
                sizeItem.textContent = size;
                
                sizeItem.addEventListener('click', function() {
                    // Убираем выбранный класс со всех размеров
                    document.querySelectorAll('.size-item').forEach(s => s.classList.remove('selected'));
                    // Добавляем выбранный класс текущему размеру
                    sizeItem.classList.add('selected');
                });
                
                sizesList.appendChild(sizeItem);
            });
        }
    } else {
        if (productSizesSection) {
            productSizesSection.style.display = 'none';
        }
    }
    
    // Описание
    const productDescription = document.getElementById('productDescription');
    if (productDescription) {
        productDescription.textContent = product.description;
    }
}

