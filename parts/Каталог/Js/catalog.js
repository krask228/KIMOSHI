document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const resetBtn = document.getElementById('resetFilters');
    const productsContainer = document.getElementById('productsContainer');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    
    const products = Array.from(document.querySelectorAll('.product'));
    
    // Функция фильтрации товаров
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;
        const minPrice = priceMin.value ? parseInt(priceMin.value) : 0;
        const maxPrice = priceMax.value ? parseInt(priceMax.value) : Infinity;
        
        let visibleCount = 0;
        
        products.forEach(product => {
            const productName = product.getAttribute('data-name').toLowerCase();
            const productCategory = product.getAttribute('data-category');
            const productPrice = parseInt(product.getAttribute('data-price'));
            
            // Проверка поиска по названию
            const matchesSearch = !searchTerm || productName.includes(searchTerm);
            
            // Проверка категории
            const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory;
            
            // Проверка цены
            const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;
            
            // Показываем/скрываем товар
            if (matchesSearch && matchesCategory && matchesPrice) {
                product.style.display = '';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });
        
        // Показываем/скрываем сообщение "Товары не найдены"
        if (visibleCount === 0) {
            productsContainer.style.display = 'none';
            noResults.style.display = 'block';
        } else {
            productsContainer.style.display = 'flex';
            noResults.style.display = 'none';
        }
        
        // Обновляем счетчик результатов
        resultsCount.textContent = visibleCount;
    }
    
    // Обработчики событий
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    priceMin.addEventListener('input', filterProducts);
    priceMax.addEventListener('input', filterProducts);
    
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
    
    // Инициализация
    filterProducts();
});

