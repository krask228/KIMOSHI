// Функция для сохранения состояния страницы
function savePageState() {
    const state = {
        scrollY: window.scrollY || window.pageYOffset || 0,
        timestamp: Date.now()
    };
    
    // Сохраняем состояние фильтров, если мы на странице каталога
    if (window.location.pathname.includes('Catalog.html')) {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const priceMin = document.getElementById('priceMin');
        const priceMax = document.getElementById('priceMax');
        
        state.filters = {
            search: searchInput ? searchInput.value : '',
            category: categoryFilter ? categoryFilter.value : 'all',
            priceMin: priceMin ? priceMin.value : '',
            priceMax: priceMax ? priceMax.value : ''
        };
        
        // Сохраняем количество видимых товаров
        if (window.catalogState && typeof window.catalogState.getVisibleCount === 'function') {
            state.visibleCount = window.catalogState.getVisibleCount();
        } else {
            // Альтернативный способ: подсчитать видимые товары через DOM
            const visibleProducts = document.querySelectorAll('.product[style=""], .product:not([style*="display: none"])');
            state.visibleCount = visibleProducts.length || 15;
        }
    }
    
    // Сохраняем URL текущей страницы
    state.fromUrl = window.location.href;
    
    sessionStorage.setItem('catalogPageState', JSON.stringify(state));
}

// Обработчик клика на название товара для открытия страницы продукта
document.addEventListener('DOMContentLoaded', function() {
    // Находим все ссылки с названиями товаров
    const productTitleLinks = document.querySelectorAll('.product__title a');
    
    productTitleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Находим родительскую карточку товара
            const productCard = this.closest('.product');
            if (!productCard) return;
            
            // Получаем данные о товаре
            const productId = productCard.id || productCard.getAttribute('data-product-id') || '';
            const productName = this.textContent.trim();
            
            // Получаем цену
            const priceElement = productCard.querySelector('.product-price__current');
            const productPrice = priceElement ? priceElement.textContent.trim() : '';
            
            const oldPriceElement = productCard.querySelector('.product-price__old');
            const productOldPrice = oldPriceElement ? oldPriceElement.textContent.trim() : '';
            
            // Получаем изображения
            const productImages = [];
            const imageElements = productCard.querySelectorAll('.image-switch__img img');
            imageElements.forEach(img => {
                const imageSrc = img.getAttribute('src');
                if (imageSrc && !productImages.includes(imageSrc)) {
                    // Сохраняем относительные пути как есть, но нормализуем
                    let imagePath = imageSrc;
                    // Если путь начинается с ./ или ../, оставляем как есть
                    // Если это абсолютный путь от корня, оставляем как есть
                    // Иначе добавляем относительный путь
                    if (!imageSrc.startsWith('http') && !imageSrc.startsWith('/') && !imageSrc.startsWith('./') && !imageSrc.startsWith('../')) {
                        // Определяем базовый путь в зависимости от текущей страницы
                        const currentPath = window.location.pathname;
                        if (currentPath.includes('/parts/')) {
                            imagePath = '../../' + imageSrc;
                        } else {
                            imagePath = './' + imageSrc;
                        }
                    }
                    productImages.push(imagePath);
                }
            });
            
            // Получаем категорию
            const productCategory = productCard.getAttribute('data-category') || 'clothing';
            
            // Формируем URL для страницы продукта
            let productPageUrl = './parts/Товар/Product.html';
            
            // Определяем путь в зависимости от текущей страницы
            const currentPath = window.location.pathname;
            if (currentPath.includes('/parts/')) {
                // Если мы в папке parts, идем на уровень выше
                productPageUrl = '../../parts/Товар/Product.html';
            } else {
                productPageUrl = './parts/Товар/Product.html';
            }
            
            // Исправляем пути к изображениям для страницы продукта
            const normalizedImages = productImages.map(imgPath => {
                // Если путь начинается с ./IMG или ./Img, заменяем на путь от корня
                if (imgPath.startsWith('./IMG/') || imgPath.startsWith('./Img/')) {
                    return '../../' + imgPath.substring(2);
                }
                // Если путь начинается с ../../IMG или ../../Img, оставляем как есть
                if (imgPath.startsWith('../../IMG/') || imgPath.startsWith('../../Img/')) {
                    return imgPath;
                }
                return imgPath;
            });
            
            // Создаем параметры URL
            const params = new URLSearchParams();
            params.append('id', productId);
            params.append('name', productName);
            params.append('price', productPrice);
            if (productOldPrice) {
                params.append('oldPrice', productOldPrice);
            }
            if (normalizedImages.length > 0) {
                params.append('images', JSON.stringify(normalizedImages));
            }
            params.append('category', productCategory);
            
            // Если категория "clothing", передаем стандартные размеры, если они еще не переданы
            if (productCategory === 'clothing') {
                params.append('sizes', JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']));
            }
            
            // Сохраняем состояние текущей страницы перед переходом
            savePageState();
            
            // Перенаправляем на страницу продукта
            window.location.href = productPageUrl + '?' + params.toString();
        });
    });
});

