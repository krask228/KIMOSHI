// База данных товаров с описаниями и размерами
const productsDatabase = {
    // Одежда
    'product-card_1': {
        id: 'product-card_1',
        name: 'ЗИП-ХУДИ | SHINIGAMI',
        price: '14 500 ₽',
        oldPrice: '25 790 ₽',
        images: [
            '../../IMG/product/ZIP-HOODIE-SHINIGAMI.jpeg',
            '../../IMG/product/ZIP-HOODIE-SHINIGAMI-R.jpeg'
        ],
        description: 'Стильное худи с капюшоном и молнией от KIMOSHI. Качественный материал, удобный крой, идеально подходит для повседневной носки. Дизайн вдохновлен аниме эстетикой.',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        category: 'clothing'
    },
    'product-card_2': {
        id: 'product-card_2',
        name: 'БОМБЕР | DARK SUPREME',
        price: '25 000 ₽',
        oldPrice: '30 790 ₽',
        images: [
            '../../IMG/product/bomber-blk-supreme.webp',
            '../../IMG/product/bomber-blk-supreme-back.webp'
        ],
        description: 'Премиальный бомбер темного цвета с качественной отделкой. Подходит для прохладной погоды. Стильный дизайн и отличное качество материала.',
        sizes: ['S', 'M', 'L', 'XL'],
        category: 'clothing'
    },
    'product-card_3': {
        id: 'product-card_3',
        name: 'ХУДИ | TOAD SAGE',
        price: '14 500 ₽',
        oldPrice: '25 790 ₽',
        images: [
            '../../IMG/product/toad-front.webp',
            '../../IMG/product/toad-back.webp'
        ],
        description: 'Классическое худи с капюшоном в стиле аниме. Мягкий и комфортный материал, удобная посадка. Отлично подходит для ежедневной носки.',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        category: 'clothing'
    },
    'product-card_4': {
        id: 'product-card_4',
        name: 'БОМБЕР | MISA',
        price: '25 000 ₽',
        oldPrice: '30 790 ₽',
        images: [
            '../../IMG/product/Bomber-Misa.jpg',
            '../../IMG/product/Bomber-Misa-back.jpg'
        ],
        description: 'Элегантный бомбер с уникальным дизайном. Качественные материалы и стильная отделка. Идеален для создания яркого образа.',
        sizes: ['S', 'M', 'L', 'XL'],
        category: 'clothing'
    },
    
    // Техника
    'product-card-1': {
        id: 'product-card-1',
        name: 'APPLE AIRPODS MAX',
        price: '14 500 ₽',
        oldPrice: '25 790 ₽',
        images: [
            '../../IMG/Техника/apple airpods max.png',
            '../../IMG/Техника/apple airpods max-2.png'
        ],
        description: 'Премиальные наушники Apple AirPods Max с активным шумоподавлением. Высокое качество звука, комфортная посадка и премиальный дизайн. Идеальны для музыки и звонков.',
        sizes: null,
        category: 'tech'
    },
    'product-card-2': {
        id: 'product-card-2',
        name: 'APPLE WATCH ULTRA',
        price: '25 000 ₽',
        oldPrice: '30 790 ₽',
        images: [
            '../../IMG/Техника/Apple Watch Ultra.jpg',
            '../../IMG/Техника/Apple Watch Ultra-2.jpg'
        ],
        description: 'Apple Watch Ultra - профессиональные умные часы для активного образа жизни. Ударопрочный корпус, расширенная функциональность, долгий срок работы батареи.',
        sizes: ['40mm', '44mm'],
        category: 'tech'
    },
    'product-card-3': {
        id: 'product-card-3',
        name: 'APPLE AIRPODS PRO 2',
        price: '14 500 ₽',
        oldPrice: '25 790 ₽',
        images: [
            '../../IMG/Техника/Apple AirPods Pro.jpeg',
            '../../IMG/Техника/Apple AirPods Pro-2.jpeg'
        ],
        description: 'Apple AirPods Pro 2 - беспроводные наушники с активным шумоподавлением. Отличное качество звука, адаптивный режим прозрачности, защита от пота и воды.',
        sizes: null,
        category: 'tech'
    },
    'product-card-4': {
        id: 'product-card-4',
        name: 'APPLE MAGSAFE BATTERY PACK',
        price: '25 000 ₽',
        oldPrice: '30 790 ₽',
        images: [
            '../../IMG/Техника/Apple MagSafe Battery Pack.jpeg',
            '../../IMG/Техника/Apple MagSafe Battery Pack-2.webp'
        ],
        description: 'Apple MagSafe Battery Pack - портативное зарядное устройство для iPhone. Магнитное крепление, компактный размер, быстрая зарядка.',
        sizes: null,
        category: 'tech'
    },
    
    // Дополнительные товары
    'DENIM ДЖИНСЫ | EVA 01': {
        id: 'denim-eva-01',
        name: 'DENIM ДЖИНСЫ | EVA 01',
        price: '15 000 ₽',
        oldPrice: '20 790 ₽',
        images: [
            './Img/product/Denim_Eva_01.jpg',
            './Img/product/Denim_Eva_01-back.jpg'
        ],
        description: 'Стильные джинсы в стиле EVA 01. Качественный деним, удобный крой, современный дизайн.',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        category: 'clothing'
    },
    'ФУТБОЛКА | RIKUGAN': {
        id: 't-shirt-rikugan',
        name: 'ФУТБОЛКА | RIKUGAN',
        price: '6 500 ₽',
        oldPrice: '8 000 ₽',
        images: [
            './Img/product/T_SHIRT-RIKUGAN.jpeg',
            './Img/product/T_SHIRT-RIKUGAN-back.jpeg'
        ],
        description: 'Стильная футболка с уникальным дизайном. Качественный хлопок, удобная посадка, яркий принт.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        category: 'clothing'
    },
    'Наушники APPLE AIRPODS MAX': {
        id: 'airpods-max',
        name: 'Наушники APPLE AIRPODS MAX',
        price: '14 500 ₽',
        oldPrice: '25 790 ₽',
        images: [
            '../../IMG/Техника/apple airpods max.png',
            '../../IMG/Техника/apple airpods max-2.png'
        ],
        description: 'Премиальные наушники Apple AirPods Max с активным шумоподавлением. Высокое качество звука, комфортная посадка и премиальный дизайн.',
        sizes: null,
        category: 'tech'
    },
    'Часы APPLE WATCH ULTRA': {
        id: 'watch-ultra',
        name: 'Часы APPLE WATCH ULTRA',
        price: '25 000 ₽',
        oldPrice: '30 790 ₽',
        images: [
            '../../IMG/Техника/Apple Watch Ultra.jpg',
            '../../IMG/Техника/Apple Watch Ultra-2.jpg'
        ],
        description: 'Apple Watch Ultra - профессиональные умные часы для активного образа жизни. Ударопрочный корпус, расширенная функциональность.',
        sizes: ['40mm', '44mm'],
        category: 'tech'
    },
    'Наушники AIRPODS PRO 2': {
        id: 'airpods-pro-2',
        name: 'Наушники AIRPODS PRO 2',
        price: '14 500 ₽',
        oldPrice: '25 790 ₽',
        images: [
            '../../IMG/Техника/Apple AirPods Pro.jpeg',
            '../../IMG/Техника/Apple AirPods Pro-2.jpeg'
        ],
        description: 'Apple AirPods Pro 2 - беспроводные наушники с активным шумоподавлением. Отличное качество звука, адаптивный режим прозрачности.',
        sizes: null,
        category: 'tech'
    },
    'Повербанк APPLE MAGSAFE BATTERY PACK': {
        id: 'magsafe-battery',
        name: 'Повербанк APPLE MAGSAFE BATTERY PACK',
        price: '25 000 ₽',
        oldPrice: '30 790 ₽',
        images: [
            '../../IMG/Техника/Apple MagSafe Battery Pack.jpeg',
            '../../IMG/Техника/Apple MagSafe Battery Pack-2.webp'
        ],
        description: 'Apple MagSafe Battery Pack - портативное зарядное устройство для iPhone. Магнитное крепление, компактный размер.',
        sizes: null,
        category: 'tech'
    }
};

// Функция для получения товара по ID
function getProductById(productId) {
    return productsDatabase[productId] || null;
}

// Функция для получения товара по названию
function getProductByName(productName) {
    for (const key in productsDatabase) {
        if (productsDatabase[key].name === productName) {
            return productsDatabase[key];
        }
    }
    return null;
}

