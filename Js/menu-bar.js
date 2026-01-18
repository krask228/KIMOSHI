console.log("menu-bar.js loaded");

$(document).ready(function(){
    console.log("jQuery ready");
    
    // Проверяем, найден ли элемент .bars
    console.log("Bars elements found:", $('.bars').length);
    console.log("Nav elements found:", $('.nav').length);
    
    // Создаем overlay элемент, если его нет
    if ($('.nav-overlay').length === 0) {
        $('body').append('<div class="nav-overlay"></div>');
    }
    
    let isMenuOpen = false;
    
    function closeMenu() {
        if (!isMenuOpen) return;
        
        $('.bars').removeClass('active');
        $('.nav').removeClass('active');
        $('.nav-overlay').removeClass('active');
        $('body').css('overflow', '');
        isMenuOpen = false;
        
        // Убираем overlay после анимации
        setTimeout(function() {
            if (!isMenuOpen) {
                $('.nav-overlay').hide();
            }
        }, 400);
    }
    
    function openMenu() {
        if (isMenuOpen) return;
        
        $('.nav-overlay').show();
        setTimeout(function() {
            $('.nav-overlay').addClass('active');
        }, 10);
        
        $('.bars').addClass('active');
        $('.nav').addClass('active');
        $('body').css('overflow', 'hidden');
        isMenuOpen = true;
    }
    
    function toggleMenu() {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    $('.bars').on('click', function(e){
        e.stopPropagation();
        e.preventDefault();
        
        toggleMenu();
    });
    
    // Закрытие меню при клике на overlay
    $(document).on('click', '.nav-overlay', function(e) {
        if (isMenuOpen) {
            closeMenu();
        }
    });
    
    // Закрытие меню при клике вне его
    $(document).on('click', function(e) {
        const isClickOnBars = $(e.target).closest('.bars').length > 0;
        const isClickOnNav = $(e.target).closest('.nav').length > 0;
        const isClickOnOverlay = $(e.target).hasClass('nav-overlay');
        
        if (isMenuOpen && !isClickOnBars && !isClickOnNav) {
            if (isClickOnOverlay) {
                closeMenu();
            }
        }
    });

    // Закрытие меню при клике на ссылку (на мобильных устройствах)
    $(document).on('click', '.nav__link', function() {
        if ($(window).width() <= 768 && isMenuOpen) {
            // Небольшая задержка для плавности
            setTimeout(function() {
                closeMenu();
            }, 150);
        }
    });
    
    // Закрытие меню при изменении размера окна (если стало больше 768px)
    $(window).on('resize', function() {
        if ($(window).width() > 768 && isMenuOpen) {
            closeMenu();
        }
    });
    
    // Закрытие меню при нажатии Escape
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });

    // Обработчик клика на логотип - переход или прокрутка к началу
    $('#logoLink').on('click', function(e) {
        const target = e.currentTarget;
        const homeUrl = target.dataset.home || target.getAttribute('href') || './index.html';
        const absoluteHomeUrl = new URL(homeUrl, window.location.origin).pathname.replace(/\/+$/, '');
        const currentPath = window.location.pathname.replace(/\/+$/, '');

        if (currentPath === absoluteHomeUrl || currentPath === '') {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        } else {
            target.setAttribute('href', homeUrl);
        }
    });
});