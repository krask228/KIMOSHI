document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const resetBtn = document.getElementById('resetFilters');
    const productsContainer = document.getElementById('productsContainer');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    
    const products = Array.from(document.querySelectorAll('.product'));
    const ITEMS_PER_PAGE = 15;
    let currentVisibleCount = 0;
    let filteredProducts = [];
    
    // Делаем currentVisibleCount доступной для сохранения состояния
    window.catalogState = {
        currentVisibleCount: 0,
        getVisibleCount: function() {
            return document.querySelectorAll('.product[style=""]').length || 
                   document.querySelectorAll('.product:not([style*="display: none"])').length ||
                   currentVisibleCount;
        }
    };
    
    // Функция показа товаров с учетом пагинации
    function showProducts() {
        // Сначала скрываем все товары
        products.forEach(product => {
            product.style.display = 'none';
        });
        
        // Затем показываем только первые currentVisibleCount товаров из отфильтрованных
        const productsToShow = filteredProducts.slice(0, currentVisibleCount);
        productsToShow.forEach(product => {
            product.style.display = '';
        });
        
        // Показываем/скрываем кнопку "Показать еще"
        if (currentVisibleCount >= filteredProducts.length) {
            loadMoreContainer.style.display = 'none';
        } else {
            loadMoreContainer.style.display = 'block';
        }
    }
    
    // Функция фильтрации товаров
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;
        const minPrice = priceMin.value ? parseInt(priceMin.value) : 0;
        const maxPrice = priceMax.value ? parseInt(priceMax.value) : Infinity;
        
        // Фильтруем товары
        filteredProducts = products.filter(product => {
            const productName = product.getAttribute('data-name').toLowerCase();
            const productCategory = product.getAttribute('data-category');
            const productPrice = parseInt(product.getAttribute('data-price'));
            
            const matchesSearch = !searchTerm || productName.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory;
            const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;
            
            return matchesSearch && matchesCategory && matchesPrice;
        });
        
        // Сбрасываем счетчик видимых товаров
        currentVisibleCount = Math.min(ITEMS_PER_PAGE, filteredProducts.length);
        
        // Обновляем глобальное состояние
        if (window.catalogState) {
            window.catalogState.currentVisibleCount = currentVisibleCount;
        }
        
        // Показываем товары
        showProducts();
        
        // Показываем/скрываем сообщение "Товары не найдены"
        if (filteredProducts.length === 0) {
            productsContainer.style.display = 'none';
            loadMoreContainer.style.display = 'none';
            if (noResults) {
                noResults.style.display = 'block';
            }
        } else {
            productsContainer.style.display = 'flex';
            if (noResults) {
                noResults.style.display = 'none';
            }
        }
        
        // Обновляем счетчик результатов
        resultsCount.textContent = filteredProducts.length;
    }
    
    // Функция загрузки еще товаров
    function loadMoreProducts() {
        currentVisibleCount = Math.min(currentVisibleCount + ITEMS_PER_PAGE, filteredProducts.length);
        
        // Обновляем глобальное состояние
        if (window.catalogState) {
            window.catalogState.currentVisibleCount = currentVisibleCount;
        }
        
        showProducts();
    }
    
    // Обработчики событий
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    priceMin.addEventListener('input', filterProducts);
    priceMax.addEventListener('input', filterProducts);
    
    // Обработчик кнопки "Показать еще"
    loadMoreBtn.addEventListener('click', loadMoreProducts);
    
    // Сброс фильтров
    resetBtn.addEventListener('click', function() {
        searchInput.value = '';
        categoryFilter.value = 'all';
        priceMin.value = '';
        priceMax.value = '';
        filterProducts();
    });
    
    // Валидация ценового диапазона
    priceMin.addEventListener('blur', function() {
        if (priceMin.value && priceMax.value) {
            if (parseInt(priceMin.value) > parseInt(priceMax.value)) {
                priceMin.value = priceMax.value;
            }
        }
    });
    
    priceMax.addEventListener('blur', function() {
        if (priceMin.value && priceMax.value) {
            if (parseInt(priceMax.value) < parseInt(priceMin.value)) {
                priceMax.value = priceMin.value;
            }
        }
    });
    
    // Восстановление состояния страницы
    function restorePageState() {
        try {
            const savedState = sessionStorage.getItem('catalogPageState');
            if (savedState) {
                const state = JSON.parse(savedState);
                
                // Проверяем, что состояние свежее (не старше 5 минут)
                const stateAge = Date.now() - (state.timestamp || 0);
                if (stateAge > 5 * 60 * 1000) {
                    sessionStorage.removeItem('catalogPageState');
                    return;
                }
                
                // Восстанавливаем фильтры
                if (state.filters) {
                    if (searchInput && state.filters.search) {
                        searchInput.value = state.filters.search;
                    }
                    if (categoryFilter && state.filters.category) {
                        categoryFilter.value = state.filters.category;
                    }
                    if (priceMin && state.filters.priceMin) {
                        priceMin.value = state.filters.priceMin;
                    }
                    if (priceMax && state.filters.priceMax) {
                        priceMax.value = state.filters.priceMax;
                    }
                }
                
                // Применяем фильтры
                filterProducts();
                
                // Восстанавливаем количество видимых товаров
                if (state.visibleCount && state.visibleCount > ITEMS_PER_PAGE) {
                    currentVisibleCount = Math.min(state.visibleCount, filteredProducts.length);
                    
                    // Обновляем глобальное состояние
                    if (window.catalogState) {
                        window.catalogState.currentVisibleCount = currentVisibleCount;
                    }
                    
                    showProducts();
                }
                
                // Восстанавливаем позицию прокрутки после небольшой задержки
                // Используем несколько попыток, так как DOM может еще загружаться
                let scrollAttempts = 0;
                const maxScrollAttempts = 5;
                
                const restoreScroll = () => {
                    scrollAttempts++;
                    if (state.scrollY) {
                        window.scrollTo({
                            top: state.scrollY,
                            behavior: 'instant' // Используем instant для мгновенной прокрутки
                        });
                        
                        // Проверяем, применилась ли прокрутка
                        const currentScroll = window.scrollY || window.pageYOffset || 0;
                        const scrollDiff = Math.abs(currentScroll - state.scrollY);
                        
                        // Если прокрутка не применилась и у нас еще есть попытки, пытаемся снова
                        if (scrollDiff > 50 && scrollAttempts < maxScrollAttempts) {
                            setTimeout(restoreScroll, 50);
                        }
                    }
                };
                
                // Первая попытка восстановления через небольшую задержку
                setTimeout(restoreScroll, 100);
            }
        } catch (e) {
            console.error('Ошибка при восстановлении состояния:', e);
            sessionStorage.removeItem('catalogPageState');
        }
    }
    
    // Инициализация
    filterProducts();
    
    // Восстанавливаем состояние после первоначальной загрузки
    // Используем событие load для гарантии, что DOM полностью загружен
    window.addEventListener('load', function() {
        setTimeout(() => {
            restorePageState();
            
            // Очищаем сохраненное состояние только после успешного восстановления
            // Это предотвратит повторное восстановление при обновлении страницы
            // Но оставим состояние на некоторое время на случай возврата через кнопку браузера
            setTimeout(() => {
                // Оставляем состояние еще на 10 секунд для надежности
            }, 10000);
        }, 50);
    });
});

