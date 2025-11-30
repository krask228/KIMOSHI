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
    
    // Функция показа товаров с учетом пагинации
    function showProducts() {
        const productsToShow = filteredProducts.slice(0, currentVisibleCount);
        
        products.forEach((product, index) => {
            if (filteredProducts.includes(product)) {
                const shouldShow = productsToShow.includes(product);
                product.style.display = shouldShow ? '' : 'none';
            }
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
        showProducts();
        
        // Плавная прокрутка к новым товарам
        const lastVisibleProduct = filteredProducts[currentVisibleCount - 1];
        if (lastVisibleProduct) {
            lastVisibleProduct.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
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
    
    // Инициализация
    filterProducts();
});

