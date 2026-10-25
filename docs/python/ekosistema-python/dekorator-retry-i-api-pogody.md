---
title: "Декоратор retry и API погоды"
description: "Практика урока 25: повторные запросы через декоратор retry, паузы между попытками, Requests, JSON погоды и отдельная обработка полученных данных."
tags:
  - "python"
  - "ecosystem"
  - "decorators"
  - "requests"
updatedAt: "2026-09-10"
---
## Задача декоратора retry {#zadacha-dekoratora-retry}

Запрос погоды может не выполниться из-за временной проблемы сети. Нужно повторить вызов после паузы, а при окончательной неудаче сообщить об ошибке вызывающему коду.

Функция загрузки отвечает за адрес API и разбор ответа. Декоратор `retry` отвечает за попытки. Один декоратор можно применить к нескольким функциям загрузки.

Перед практикой разбери [основы декораторов](../yazyk-python/1-core/dekoratory-v-python.md).

## Обертка из урока {#obertka-iz-uroka}

```python
import time

from functools import wraps
from requests.exceptions import RequestException


def retry(func):
    @wraps(func)
    def wrapper_retry(*args, **kwargs):
        retries = [5, 30]

        for seconds in retries:
            try:
                return func(*args, **kwargs)
            except RequestException:
                print(f"Retrying in {seconds} seconds")
                time.sleep(seconds)

        return func(*args, **kwargs)

    return wrapper_retry
```

Здесь сохранена схема урока и добавлен `wraps`, чтобы обертка сохраняла имя исходной функции.

## Почему попыток три {#pochemu-popytok-tri}

В `retries` находятся длительности пауз, а не номера попыток:

| Попытка | Где выполняется | Что будет при RequestException |
| --- | --- | --- |
| первая | первая итерация цикла | пауза 5 секунд |
| вторая | вторая итерация цикла | пауза 30 секунд |
| третья | вызов после цикла | исключение выходит наружу |

Если первый вызов успешен, `return` сразу завершает обертку: следующих запросов и пауз нет. Если второй вызов успешен, последняя попытка тоже не нужна.

Последний `func(...)` находится вне `try`. Поэтому после трех неудач программа получит исключение, а не ложный успешный результат `None`.

`time.sleep()` приостанавливает текущий поток. Две паузы занимают 35 секунд, к которым добавляется время самих запросов.

## Какие ошибки стоит повторять {#kakie-oshibki-stoit-povtoryat}

Учебный `RequestException` - общий класс ошибок Requests. Для практического примера ниже сузим обработку до `ConnectionError` и `Timeout`.

HTTP-статусы проверяются через `raise_for_status()`. Ошибка ключа API или неправильная структура JSON не исправятся от простого ожидания. Механизм исключений и тайм-аутов описан в [документации Requests](https://requests.readthedocs.io/en/latest/user/quickstart/#errors-and-exceptions).

## Загрузка почасовой погоды {#zagruzka-pochasovoy-pogody}

Этот блок самостоятелен и содержит свою версию `retry`.

```python
import os
import time
from functools import wraps
from urllib.parse import quote

import requests


def retry(func):
    @wraps(func)
    def wrapper_retry(*args, **kwargs):
        for seconds in (5, 30):
            try:
                return func(*args, **kwargs)
            except (
                requests.exceptions.ConnectionError,
                requests.exceptions.Timeout,
            ):
                print(f"Retrying in {seconds} seconds")
                time.sleep(seconds)

        return func(*args, **kwargs)

    return wrapper_retry


@retry
def get_weather_by_hours_for_day_from_api(
    *, date: str, city: str
) -> list[dict]:
    api_key = os.environ["VISUAL_CROSSING_API_KEY"]
    base_url = (
        "https://weather.visualcrossing.com/"
        "VisualCrossingWebServices/rest/services/timeline"
    )
    url = f"{base_url}/{quote(city, safe='')}/{date}/{date}"

    response = requests.get(
        url,
        params={
            "unitGroup": "us",
            "include": "hours",
            "contentType": "json",
            "key": api_key,
        },
        timeout=10,
    )
    response.raise_for_status()
    data = response.json()
    return data["days"][0]["hours"]
```

Для запуска нужны установленный `requests` и переменная окружения `VISUAL_CROSSING_API_KEY` с собственным ключом сервиса. Если переменной нет, `os.environ[...]` вызовет `KeyError` до запроса.

`date` передается в формате `YYYY-MM-DD`, например `"2023-08-04"`. `quote()` кодирует город для использования в пути URL. Query-параметры передаются через `params`.

`timeout=10` ограничивает ожидание соединения и ожидание данных при чтении; это не общий предел времени всех попыток. Исключения HTTP и ошибки данных в этой версии не повторяются автоматически.

## Где находится `hours` {#gde-nakhoditsya-hours}

В формате JSON Timeline API почасовые записи вложены в конкретный день. Поэтому используется `data["days"][0]["hours"]`, а не `data["hours"]`. Структура и параметры запроса приведены в [документации Visual Crossing](https://www.visualcrossing.com/resources/documentation/weather-api/timeline-weather-api/).

Упрощенный ответ:

```json
{
  "days": [
    {
      "datetime": "2023-08-04",
      "hours": [
        {"datetime": "12:00:00", "temp": 68, "uvindex": 4}
      ]
    }
  ]
}
```

Разбор по шагам:

```python
weather_by_days = data["days"]
first_day = weather_by_days[0]
weather_by_hours = first_day["hours"]
```

`.json()` вызывается один раз, результат сохраняется в `data`. Учебный пример предполагает, что ответ содержит хотя бы один день и его почасовые записи. При нарушении этой структуры возможны `KeyError` или `IndexError`.

## Обработка данных отдельно от запроса {#obrabotka-dannykh-otdelno-ot-zaprosa}

В уроке выбрана система `us`, поэтому температуру переводят из Фаренгейта в Цельсий. Отбор часов с `uvindex >= 3` здесь служит условием учебной задачи.

```python
def fahrenheit_to_celsius(*, fahrenheit_temperature: float) -> int:
    return round((fahrenheit_temperature - 32) * 5 / 9)


def get_dangerous_hours(*, weather_by_hour: list[dict]) -> list[dict]:
    dangerous_hours = []

    for weather in weather_by_hour:
        uvindex = weather["uvindex"]
        temperature = weather["temp"]

        if uvindex is None or temperature is None:
            continue

        if uvindex >= 3:
            dangerous_hours.append({
                "time": weather["datetime"],
                "uvindex": uvindex,
                "temperature": fahrenheit_to_celsius(
                    fahrenheit_temperature=temperature
                ),
            })

    return dangerous_hours
```

Функция возвращает новый список. Записи без температуры или UV-индекса пропускаются; исходный список не изменяется.

Обработку можно запустить без сети и API-ключа:

```python
sample_hours = [
    {"datetime": "08:00:00", "temp": 50, "uvindex": 1},
    {"datetime": "12:00:00", "temp": 68, "uvindex": 4},
]

print(get_dangerous_hours(weather_by_hour=sample_hours))
# [{'time': '12:00:00', 'uvindex': 4, 'temperature': 20}]
```

## Соединяем части {#soedinyaem-chasti}

После объявления функций из предыдущих блоков:

```python
try:
    weather_by_hour = get_weather_by_hours_for_day_from_api(
        date="2023-08-04",
        city="London,UK",
    )
except requests.exceptions.RequestException:
    print("Weather request failed")
else:
    result = get_dangerous_hours(weather_by_hour=weather_by_hour)
    print(result)
```

Внешний `except` обрабатывает окончательную ошибку запроса. Он не повторяет запрос сам: за повторы отвечает `@retry`.

## Ограничения и частые ошибки {#ogranicheniya-i-chastye-oshibki}

- Забыть `return func(...)`: успешный результат не дойдет до вызывающего кода.
- Убрать вызов после цикла: получится две попытки и лишняя пауза после второй неудачи.
- Ловить все исключения: ошибка в обработке словаря начнет выглядеть как сетевой сбой.
- Ожидать, что любой сбой соединения временный: например, проблема сертификата может сохраняться при каждом повторе.
- Повторять операции с побочными эффектами без проверки: повтор отправки заказа может создать дубликат. Здесь повторяется чтение погоды через GET.
- Хранить ключ в исходниках или печатать полный URL с ключом. Для настройки используй окружение; в лог выводи только необходимые сведения.

Это учебная реализация. Для приложения с большим количеством запросов нужны отдельные правила повторов по HTTP-статусам и ограничениям сервиса.

## Задачи {#zadachi}

### Задача 1 {#zadacha-1}

Замени задержки на `(1, 2, 3)`. До запуска определи максимальное количество попыток и суммарное время пауз.

### Задача 2 {#zadacha-2}

Создай функцию, которая дважды выбрасывает `requests.exceptions.ConnectionError`, а затем возвращает строку. Примени `retry` и проследи порядок вызовов без обращения к API.

### Задача 3 {#zadacha-3}

Передай в функцию обработки пустой список и записи с `None`. Проверь, что входные данные не меняются.

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Requests: Quickstart', href: 'https://requests.readthedocs.io/en/latest/user/quickstart/' },
        { title: 'Python: time.sleep', href: 'https://docs.python.org/3/library/time.html#time.sleep' },
        { title: 'Visual Crossing: Timeline Weather API', href: 'https://www.visualcrossing.com/resources/documentation/weather-api/timeline-weather-api/' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Декораторы в Python', href: '/python/yazyk-python/1-core/dekoratory-v-python' },
        { title: 'HTTP-запросы requests', href: '/python/ekosistema-python/http-zaprosy-requests' },
        { title: 'JSON и сериализация', href: '/python/ekosistema-python/json-i-serializatsiya' },
        { title: 'Обработка исключений', href: '/python/yazyk-python/1-core/obrabotka-isklyucheniy-try-except' },
    ]"
/>
