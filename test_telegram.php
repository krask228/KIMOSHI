<?php
/**
 * Тестовый скрипт для проверки соединения с Telegram Bot API
 * Откройте этот файл в браузере после запуска локального сервера
 */

header('Content-Type: text/html; charset=utf-8');

// Настройки Telegram
$botToken = '8315054422:AAFhru9oaG6IANlHJIYEV-60qlrr6uiataQ';
$chatId = '8031234667';

echo "<h1>🔍 Тест подключения к Telegram Bot API</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
    .test-section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .success { color: #4caf50; font-weight: bold; }
    .error { color: #f44336; font-weight: bold; }
    .info { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 10px 0; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
</style>";

// Тест 1: Проверка PHP версии
echo "<div class='test-section'>";
echo "<h2>1. Проверка PHP</h2>";
echo "<p>Версия PHP: <strong>" . phpversion() . "</strong></p>";

if (version_compare(phpversion(), '7.0.0', '>=')) {
    echo "<p class='success'>✓ PHP версия подходит</p>";
} else {
    echo "<p class='error'>✗ Требуется PHP 7.0 или выше</p>";
}
echo "</div>";

// Тест 2: Проверка cURL
echo "<div class='test-section'>";
echo "<h2>2. Проверка cURL расширения</h2>";
if (function_exists('curl_version')) {
    $curlVersion = curl_version();
    echo "<p class='success'>✓ cURL установлен</p>";
    echo "<p>Версия cURL: <strong>" . $curlVersion['version'] . "</strong></p>";
    echo "<p>Поддерживаемые протоколы: " . implode(', ', $curlVersion['protocols']) . "</p>";
} else {
    echo "<p class='error'>✗ cURL не установлен. Нужно включить расширение curl в php.ini</p>";
}
echo "</div>";

// Тест 3: Проверка соединения с Telegram API
echo "<div class='test-section'>";
echo "<h2>3. Проверка соединения с Telegram Bot API</h2>";

$testMessage = "🧪 Тестовое сообщение\n\n";
$testMessage .= "Дата и время: " . date('d.m.Y H:i:s') . "\n";
$testMessage .= "Если вы видите это сообщение, значит бот работает! ✅";

$url = "https://api.telegram.org/bot{$botToken}/sendMessage";
$data = [
    'chat_id' => $chatId,
    'text' => $testMessage,
    'parse_mode' => 'HTML'
];

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

echo "<div class='info'>";
echo "<strong>HTTP код ответа:</strong> " . $httpCode . "<br>";
if ($curlError) {
    echo "<strong>Ошибка cURL:</strong> <span class='error'>" . htmlspecialchars($curlError) . "</span><br>";
}
echo "</div>";

if ($httpCode === 200 && !empty($response)) {
    $responseData = json_decode($response, true);
    
    if (isset($responseData['ok']) && $responseData['ok'] === true) {
        echo "<p class='success'>✓ Сообщение успешно отправлено в Telegram!</p>";
        echo "<p>Проверьте ваш Telegram-чат (ID: $chatId) — там должно быть тестовое сообщение.</p>";
        
        if (isset($responseData['result']['message_id'])) {
            echo "<p>ID сообщения в Telegram: <strong>" . $responseData['result']['message_id'] . "</strong></p>";
        }
    } else {
        echo "<p class='error'>✗ Ошибка при отправке сообщения</p>";
        if (isset($responseData['description'])) {
            echo "<p class='error'>Описание ошибки: " . htmlspecialchars($responseData['description']) . "</p>";
        }
        if (isset($responseData['error_code'])) {
            echo "<p class='error'>Код ошибки: " . $responseData['error_code'] . "</p>";
        }
    }
} else {
    echo "<p class='error'>✗ Не удалось установить соединение с Telegram API</p>";
    if ($curlError) {
        echo "<p class='error'>Ошибка cURL: " . htmlspecialchars($curlError) . "</p>";
    }
}

echo "<h3>Полный ответ от API:</h3>";
echo "<pre>" . htmlspecialchars($response) . "</pre>";
echo "</div>";

// Тест 4: Проверка токена бота
echo "<div class='test-section'>";
echo "<h2>4. Проверка информации о боте</h2>";

$getMeUrl = "https://api.telegram.org/bot{$botToken}/getMe";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $getMeUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$botInfo = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $botData = json_decode($botInfo, true);
    if (isset($botData['ok']) && $botData['ok'] === true) {
        $bot = $botData['result'];
        echo "<p class='success'>✓ Токен бота валиден</p>";
        echo "<p><strong>Имя бота:</strong> " . htmlspecialchars($bot['first_name']) . "</p>";
        if (isset($bot['username'])) {
            echo "<p><strong>Username:</strong> @" . htmlspecialchars($bot['username']) . "</p>";
        }
        echo "<p><strong>ID бота:</strong> " . $bot['id'] . "</p>";
    } else {
        echo "<p class='error'>✗ Токен бота невалиден</p>";
    }
} else {
    echo "<p class='error'>✗ Не удалось получить информацию о боте</p>";
}

echo "<h3>Ответ API getMe:</h3>";
echo "<pre>" . htmlspecialchars($botInfo) . "</pre>";
echo "</div>";

// Инструкции
echo "<div class='test-section'>";
echo "<h2>📋 Следующие шаги</h2>";
echo "<ol>";
echo "<li>Если все тесты пройдены (зеленые галочки), отправка заказов должна работать</li>";
echo "<li>Если есть ошибки, исправьте их согласно указаниям выше</li>";
echo "<li>Перейдите на страницу оформления заказа и попробуйте отправить тестовый заказ</li>";
echo "<li>Проверьте консоль браузера (F12) на наличие ошибок JavaScript</li>";
echo "</ol>";
echo "</div>";

echo "<p style='text-align: center; margin-top: 30px;'>";
echo "<a href='parts/Оформить заказ/Checkout.html' style='display: inline-block; padding: 10px 20px; background: #4caf50; color: white; text-decoration: none; border-radius: 5px;'>Перейти на страницу оформления заказа</a>";
echo "</p>";
?>


