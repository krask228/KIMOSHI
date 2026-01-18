<?php
header('Content-Type: application/json; charset=utf-8');

// Получаем данные из POST-запроса
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$address = isset($_POST['address']) ? trim($_POST['address']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Очистка данных от потенциально опасных символов
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$phone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$address = htmlspecialchars($address, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Валидация обязательных полей
if (empty($name) || empty($phone) || empty($address)) {
    echo json_encode([
        'success' => false,
        'error' => 'Заполните все обязательные поля'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Получаем список товаров из POST (если передается)
$items = [];
if (isset($_POST['items']) && is_string($_POST['items'])) {
    $items = json_decode($_POST['items'], true);
} elseif (isset($_POST['items']) && is_array($_POST['items'])) {
    $items = $_POST['items'];
}

// Получаем общую сумму и способ оплаты
$total = isset($_POST['total']) ? htmlspecialchars(trim($_POST['total']), ENT_QUOTES, 'UTF-8') : '';
$paymentMethod = isset($_POST['paymentMethod']) ? htmlspecialchars(trim($_POST['paymentMethod']), ENT_QUOTES, 'UTF-8') : '';

// Преобразуем способ оплаты в читаемый формат
$paymentMethods = [
    'card' => 'Банковская карта',
    'cash' => 'Наличными при получении',
    'online' => 'Онлайн оплата'
];
$paymentMethodText = isset($paymentMethods[$paymentMethod]) ? $paymentMethods[$paymentMethod] : ($paymentMethod ? $paymentMethod : 'Не указан');

// Настройки Telegram
$botToken = '8315054422:AAFhru9oaG6IANlHJIYEV-60qlrr6uiataQ';
$chatId = '8031234667';

// Формируем сообщение для Telegram
$telegramMessage = "🛒 <b>НОВЫЙ ЗАКАЗ</b>\n\n";
$telegramMessage .= "👤 <b>ФИО:</b> " . $name . "\n";
$telegramMessage .= "📱 <b>Телефон:</b> " . $phone . "\n";
$telegramMessage .= "📍 <b>Адрес доставки:</b> " . $address . "\n";
$telegramMessage .= "💳 <b>Способ оплаты:</b> " . $paymentMethodText . "\n\n";

// Добавляем список товаров, если есть
if (!empty($items) && is_array($items)) {
    $telegramMessage .= "📦 <b>Товары в заказе:</b>\n";
    $telegramMessage .= "━━━━━━━━━━━━━━━━━━━━\n";
    
    foreach ($items as $index => $item) {
        $itemName = isset($item['name']) ? htmlspecialchars($item['name'], ENT_QUOTES, 'UTF-8') : 'Товар';
        $itemQuantity = isset($item['quantity']) ? intval($item['quantity']) : 1;
        $itemPrice = isset($item['price']) ? htmlspecialchars($item['price'], ENT_QUOTES, 'UTF-8') : '0 ₽';
        $itemSize = isset($item['size']) ? htmlspecialchars($item['size'], ENT_QUOTES, 'UTF-8') : '';
        $itemColor = isset($item['color']) ? htmlspecialchars($item['color'], ENT_QUOTES, 'UTF-8') : '';
        
        $telegramMessage .= ($index + 1) . ". " . $itemName . "\n";
        $telegramMessage .= "   Количество: " . $itemQuantity . " шт.\n";
        
        if (!empty($itemSize)) {
            $telegramMessage .= "   Размер: " . $itemSize . "\n";
        }
        if (!empty($itemColor)) {
            $telegramMessage .= "   Цвет: " . $itemColor . "\n";
        }
        
        // Рассчитываем цену за позицию
        if (isset($item['price'])) {
            $priceStr = preg_replace('/[^\d]/', '', $item['price']);
            $priceNum = floatval($priceStr);
            $positionTotal = $priceNum * $itemQuantity;
            $telegramMessage .= "   Цена: " . number_format($positionTotal, 0, '.', ' ') . " ₽\n";
        }
        
        $telegramMessage .= "\n";
    }
    
    $telegramMessage .= "━━━━━━━━━━━━━━━━━━━━\n";
}

// Добавляем общую сумму
if (!empty($total)) {
    $telegramMessage .= "💰 <b>Итого:</b> " . $total . "\n\n";
}

// Добавляем комментарий, если есть
if (!empty($message)) {
    $telegramMessage .= "💬 <b>Комментарий:</b>\n" . $message . "\n\n";
}

// Добавляем дату и время заказа
$telegramMessage .= "🕐 <b>Дата:</b> " . date('d.m.Y H:i:s') . "\n";

// Отправляем сообщение в Telegram
$url = "https://api.telegram.org/bot{$botToken}/sendMessage";

$data = [
    'chat_id' => $chatId,
    'text' => $telegramMessage,
    'parse_mode' => 'HTML'
];

// Инициализируем cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Проверяем результат
if ($httpCode === 200 && !empty($response)) {
    $responseData = json_decode($response, true);
    if (isset($responseData['ok']) && $responseData['ok'] === true) {
        echo json_encode([
            'success' => true,
            'message' => 'Заказ успешно отправлен!'
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка отправки в Telegram: ' . (isset($responseData['description']) ? $responseData['description'] : 'Неизвестная ошибка')
        ], JSON_UNESCAPED_UNICODE);
    }
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка соединения с Telegram API' . (!empty($curlError) ? ': ' . $curlError : '')
    ], JSON_UNESCAPED_UNICODE);
}
?>

