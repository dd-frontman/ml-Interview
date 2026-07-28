---
title: "HTTP-запросы через requests"
description: "Конспект по библиотеке requests в Python: GET-запросы, параметры URL, объект Response, JSON-ответ, HTTP-статусы, timeout и обработка ошибок."
tags:
  - "python"
  - "requests"
  - "http"
  - "api"
updatedAt: "2026-07-23"
---
## Что изучаем

Библиотека `requests` позволяет Python-программе обращаться к сайтам и API по HTTP.

В этом уроке разбираются:

- установка и импорт `requests`;
- отправка GET-запроса;
- параметры запроса `params`;
- объект `Response`;
- получение байтов, текста и JSON;
- преобразование данных из ответа;
- повторные запросы с паузой;
- проверка статуса и обработка ошибок.

## Что такое API

API определяет, как одна программа может обратиться к другой программе и получить данные.

Например, Binance предоставляет endpoint для получения цены торговой пары:

```text
https://api.binance.com/api/v3/ticker/price
```

Endpoint - это конкретный адрес API, выполняющий определенную задачу.

Клиент отправляет HTTP-запрос, сервер его обрабатывает и возвращает HTTP-ответ.

```text
Python-код -> HTTP-запрос -> API
Python-код <- HTTP-ответ  <- API
```

## Установка `requests`

`requests` не входит в стандартную библиотеку Python, поэтому пакет нужно установить.

```bash
python -m pip install requests
```

Установка должна выполняться в том же виртуальном окружении, которое выбрано в VS Code.

Проверка:

```bash
python -c "import requests; print(requests.__version__)"
```

После установки библиотеку можно импортировать:

```python
import requests
```

## Первый GET-запрос

GET используется для получения данных.

```python
import requests

endpoint = "https://api.binance.com/api/v3/ticker/price"
response = requests.get(endpoint, timeout=10)

print(type(response))
# <class 'requests.models.Response'>
```

`requests.get()` не возвращает цену напрямую. Он возвращает объект `Response`, содержащий весь ответ сервера.

`timeout=10` ограничивает время ожидания ответа десятью секундами. Без timeout программа может ждать проблемный сервер неопределенно долго.

## Параметры запроса `params`

Чтобы запросить цену конкретной торговой пары, передадим словарь `params`.

```python
import requests

endpoint = "https://api.binance.com/api/v3/ticker/price"
params = {
    "symbol": "BTCUSDT",
}

response = requests.get(endpoint, params=params, timeout=10)
print(response.url)
```

`requests` самостоятельно добавит параметры к URL:

```text
https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
```

Использовать `params` удобнее и безопаснее, чем самостоятельно собирать URL строкой: библиотека правильно кодирует значения.

## Что находится в `Response`

У объекта ответа есть несколько важных свойств и методов.

```python
print(response.status_code)
print(response.headers)
print(response.content)
print(response.text)
```

Основные варианты чтения тела ответа:

| Способ | Результат | Когда использовать |
| --- | --- | --- |
| `response.content` | `bytes` | файлы и необработанные байты |
| `response.text` | `str` | текст, HTML или просмотр ответа |
| `response.json()` | `dict` или `list` | JSON-ответ API |

В примере API возвращает JSON, поэтому удобнее использовать `response.json()`.

## Разбор JSON-ответа

```python
price_object = response.json()

print(price_object)
print(type(price_object))
```

Ответ для одной торговой пары имеет структуру, похожую на эту:

```python
{
    "symbol": "BTCUSDT",
    "price": "12345.67000000",
}
```

JSON-объект преобразуется в словарь Python. Значение `price` приходит строкой, поэтому для вычислений его нужно преобразовать в число.

```python
price = float(price_object["price"])
price = round(price, 2)

print(price)
```

Не используй пример цены как актуальное значение: сервер возвращает цену на момент выполнения запроса.

## Проверка HTTP-статуса

HTTP-статус показывает результат обработки запроса.

Основные группы:

| Диапазон | Значение |
| --- | --- |
| `200-299` | запрос выполнен успешно |
| `400-499` | ошибка в запросе клиента |
| `500-599` | ошибка на стороне сервера |

Сам код `requests.get()` может выполниться без исключения, даже если сервер вернул `404` или `500`.

Для проверки используется `raise_for_status()`:

```python
response = requests.get(endpoint, params=params, timeout=10)
response.raise_for_status()

data = response.json()
```

При ошибочном HTTP-статусе метод вызовет `requests.exceptions.HTTPError`.

## Безопасная функция получения цены

```python
import requests


def get_price(symbol: str) -> float:
    endpoint = "https://api.binance.com/api/v3/ticker/price"
    params = {"symbol": symbol}

    response = requests.get(endpoint, params=params, timeout=10)
    response.raise_for_status()

    data = response.json()
    return round(float(data["price"]), 2)


bitcoin_price = get_price("BTCUSDT")
print(bitcoin_price)
```

Функция скрывает детали HTTP-запроса и возвращает готовое число. Вызывающему коду не нужно знать URL и структуру ответа.

## Обработка сетевых ошибок

Запрос может завершиться неудачно из-за отсутствия интернета, превышения timeout, ошибки DNS или ответа сервера.

```python
import requests

try:
    bitcoin_price = get_price("BTCUSDT")
    print(bitcoin_price)
except requests.exceptions.RequestException as error:
    print(f"Не удалось получить цену: {error}")
```

`RequestException` - базовое исключение библиотеки `requests`. Оно охватывает основные сетевые ошибки и ошибки HTTP, созданные через `raise_for_status()`.

На уровне приложения ошибку можно записать в лог, показать пользователю понятное сообщение или повторить запрос позже.

## Несколько запросов с паузой

В уроке цена запрашивается 30 раз с интервалом в одну секунду.

```python
import time

bitcoin_prices = []

for _ in range(30):
    price = get_price("BTCUSDT")
    bitcoin_prices.append(price)
    time.sleep(1)

print(bitcoin_prices)
print(len(bitcoin_prices))
print(max(bitcoin_prices))
print(min(bitcoin_prices))
```

Здесь:

- `range(30)` задает 30 повторений;
- `_` показывает, что номер итерации не используется;
- `append()` добавляет цену в список;
- `time.sleep(1)` приостанавливает выполнение на одну секунду;
- `max()` и `min()` находят максимальное и минимальное значения.

Пауза снижает частоту обращений, но не гарантирует соблюдение лимитов API. Ограничения нужно проверять в документации конкретного сервиса.

## Запрос без `params`

Если вызвать endpoint без `symbol`, API возвращает коллекцию торговых пар.

```python
response = requests.get(endpoint, timeout=10)
response.raise_for_status()

tickers = response.json()
print(type(tickers))  # <class 'list'>
```

Каждый элемент списка является словарем.

```python
for ticker in tickers:
    if ticker["symbol"] == "ETHUSDT":
        print(ticker["price"])
        break
```

`break` завершает цикл после найденного элемента. Это не влияет на результат, но исключает лишний просмотр оставшейся части списка.

Если нужна только одна торговая пара, лучше передать `params`: сервер вернет меньше данных, а клиенту не придется выполнять поиск.

## Частые ошибки

### Не установить библиотеку в активное окружение

```text
ModuleNotFoundError: No module named 'requests'
```

Проверь интерпретатор VS Code и устанавливай пакет через `python -m pip`, а не через случайный `pip`.

### Не задавать timeout

Без timeout запрос может надолго остановить выполнение программы.

```python
requests.get(endpoint, timeout=10)
```

### Не проверять HTTP-статус

Вместо попытки сразу прочитать ответ сначала вызывай:

```python
response.raise_for_status()
```

### Считать JSON обычной строкой

Для JSON-ответа используй `response.json()`, а не ручной разбор `response.text`.

### Делать слишком много запросов

Частые запросы могут привести к ограничению или блокировке клиента. Учитывай rate limit API и не создавай запрос внутри быстрого бесконечного цикла.

## Краткая шпаргалка

```python
import requests

endpoint = "https://api.example.com/items"
params = {"limit": 10}

try:
    response = requests.get(endpoint, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()
except requests.exceptions.RequestException as error:
    print(f"Ошибка запроса: {error}")
```

Последовательность работы:

```text
requests.get()
-> Response
-> raise_for_status()
-> response.json()
-> dict или list
-> проверка и преобразование данных
```

## Официальная документация

<OfficialDocsLinks
    :links="[
        { title: 'Requests: Quickstart', href: 'https://requests.readthedocs.io/en/latest/user/quickstart/' },
        { title: 'Requests: API', href: 'https://requests.readthedocs.io/en/latest/api/' },
        { title: 'MDN: HTTP response status codes', href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'JSON и сериализация', href: '/python/ekosistema-python/json-i-serializatsiya' },
        { title: 'Исключения и файлы', href: '/python/yazyk-python/isklyucheniya-context-managers-i-fayly' },
        { title: 'Словари dict', href: '/python/yazyk-python/tipy-dannykh/slovari-dict' },
        { title: 'Импорты и модули', href: '/python/yazyk-python/1-core/importy-i-moduli' },
    ]"
/>
