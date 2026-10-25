---
title: "Обработка исключений: try и except"
description: "Конспект по исключениям в Python: try, except, else, finally, raise, конкретные типы ошибок и обработка сетевых запросов requests."
tags:
  - "python"
  - "core"
  - "exceptions"
  - "try-except"
updatedAt: "2026-08-18"
---
## Что такое исключение {#chto-takoe-isklyuchenie}

Исключение - это объект, который сообщает об ошибке во время выполнения программы.

Например, при делении на ноль Python создает исключение `ZeroDivisionError`:

```python
result = 10 / 0

# ZeroDivisionError: division by zero
```

Если исключение не обработано, выполнение текущей программы прерывается и Python показывает traceback - последовательность вызовов, которая привела к ошибке.

```python
print("Начало")
print(10 / 0)
print("Конец")  # Эта строка не выполнится
```

`try` и `except` позволяют перехватить ожидаемую ошибку и определить, что программа должна сделать вместо аварийного завершения.

## Базовая конструкция `try`/`except` {#bazovaya-konstruktsiya-try-except}

```python
try:
    risky_operation()
except SomeError:
    handle_error()
```

Порядок выполнения:

1. Python начинает выполнять код внутри `try`.
2. Если ошибок нет, блок `except` пропускается.
3. Если возникает исключение указанного типа, оставшаяся часть `try` пропускается.
4. Выполняется соответствующий блок `except`.
5. После обработки программа продолжает работу со следующей строки.

Пример:

```python
numbers = []

try:
    average = sum(numbers) / len(numbers)
    print(average)
except ZeroDivisionError:
    print("Список не должен быть пустым")

print("Программа продолжает работу")
```

Результат:

```text
Список не должен быть пустым
Программа продолжает работу
```

## Обработка ошибки внутри функции {#obrabotka-oshibki-vnutri-funktsii}

Функция для вычисления среднего может вернуть результат, а решение о способе обработки ошибки оставить вызывающему коду.

```python
def nums_average(*, numbers: list[float]) -> float:
    return sum(numbers) / len(numbers)


try:
    result = nums_average(numbers=[])
    print(result)
except ZeroDivisionError:
    print("Невозможно вычислить среднее пустого списка")
```

Здесь функция действительно возвращает `float`. Не нужно писать `return print(...)`, потому что `print()` возвращает `None`.

У этой задачи есть и другой вариант: заранее проверить входные данные и создать более понятное исключение.

```python
def nums_average(*, numbers: list[float]) -> float:
    if not numbers:
        raise ValueError("Список чисел не должен быть пустым")

    return sum(numbers) / len(numbers)
```

`ValueError` точнее описывает проблему: функция получила значение, с которым не может работать.

## Перехватывай конкретные исключения {#perekhvatyvay-konkretnye-isklyucheniya}

Лучше указывать ожидаемый тип ошибки:

```python
try:
    age = int(user_input)
except ValueError:
    print("Возраст должен быть целым числом")
```

Так код обработает ошибочный формат числа, но не скроет постороннюю ошибку в программе.

Пустой `except` использовать не следует:

```python
try:
    age = int(user_input)
except:
    print("Что-то пошло не так")
```

Он перехватывает почти все исключения, включая системные сигналы остановки программы. Из-за этого настоящую причину ошибки трудно найти.

Перехват `Exception` немного уже, но тоже не должен использоваться без необходимости:

```python
try:
    process_data()
except Exception:
    print("Ошибка")
```

Такой вариант допустим на внешней границе приложения, если ошибка обязательно записывается в журнал или передается дальше. В обычной бизнес-логике выбирай конкретные типы.

## Получение объекта исключения через `as` {#poluchenie-obekta-isklyucheniya-cherez-as}

После `as` указывается переменная, в которую попадет объект исключения.

```python
try:
    number = int("12.5")
except ValueError as error:
    print(f"Не удалось преобразовать значение: {error}")
```

Переменная `error` содержит диагностическую информацию, которую сформировал Python.

Не стоит всегда показывать технический текст исключения конечному пользователю. Он полезен для журнала и отладки, а пользователю обычно нужно понятное сообщение.

## Несколько блоков `except` {#neskolko-blokov-except}

Разные ошибки можно обрабатывать по-разному.

```python
def divide_from_strings(first: str, second: str) -> float:
    return int(first) / int(second)


try:
    result = divide_from_strings("10", "0")
except ValueError:
    print("Оба значения должны быть целыми числами")
except ZeroDivisionError:
    print("Делитель не должен быть равен нулю")
```

Python выполняет первый подходящий `except`, поэтому более конкретные исключения должны находиться выше общих.

```python
try:
    process_data()
except ValueError:
    print("Некорректное значение")
except Exception as error:
    print(f"Неожиданная ошибка: {error}")
```

## Несколько исключений с одной обработкой {#neskolko-isklyucheniy-s-odnoy-obrabotkoy}

Если реакция на разные ошибки одинакова, их можно объединить в кортеж.

```python
try:
    result = int(user_input) / divisor
except (ValueError, ZeroDivisionError):
    print("Не удалось выполнить вычисление")
```

Объединяй исключения только тогда, когда для пользователя и программы действительно требуется одинаковая реакция.

## Блок `else` {#blok-else}

`else` выполняется, только если в `try` не возникло исключение.

```python
try:
    number = int(user_input)
except ValueError:
    print("Введите целое число")
else:
    print(f"Получено число: {number}")
```

В `try` желательно оставлять только операцию, которая может вызвать ожидаемую ошибку. Код, который должен выполняться после успешной операции, можно перенести в `else`.

```python
try:
    number = int(user_input)
except ValueError:
    print("Введите целое число")
else:
    save_number(number)
```

Так `except ValueError` не перехватит случайный `ValueError`, который может возникнуть внутри `save_number()`.

## Блок `finally` {#blok-finally}

`finally` выполняется всегда: и после успешного `try`, и после исключения.

```python
file = open("data.txt", encoding="utf-8")

try:
    content = file.read()
finally:
    file.close()
```

`finally` используют для освобождения ресурсов: закрытия соединений, файлов или завершения транзакций.

Для файлов предпочтительнее контекстный менеджер `with`, который закрывает файл автоматически:

```python
with open("data.txt", encoding="utf-8") as file:
    content = file.read()
```

Полная конструкция может содержать все блоки:

```python
try:
    value = perform_operation()
except ValueError as error:
    print(error)
else:
    print(value)
finally:
    print("Операция завершена")
```

## Создание исключения через `raise` {#sozdanie-isklyucheniya-cherez-raise}

`raise` явно создает исключение.

```python
def calculate_discount(price: float, discount: float) -> float:
    if price < 0:
        raise ValueError("Цена не может быть отрицательной")

    if not 0 <= discount <= 1:
        raise ValueError("Скидка должна находиться между 0 и 1")

    return price * (1 - discount)
```

Вызывающий код может обработать эту ошибку:

```python
try:
    final_price = calculate_discount(1000, 1.5)
except ValueError as error:
    print(error)
```

Если исключение нужно обработать частично и передать дальше, используется `raise` без аргументов:

```python
try:
    process_data()
except ValueError as error:
    print(f"Ошибка обработки: {error}")
    raise
```

## Частые типы исключений {#chastye-tipy-isklyucheniy}

| Исключение | Когда возникает |
| --- | --- |
| `ValueError` | тип подходит, но значение имеет неправильный формат или диапазон |
| `TypeError` | операция получила несовместимый тип |
| `ZeroDivisionError` | деление или остаток от деления на ноль |
| `IndexError` | индекс находится за границами последовательности |
| `KeyError` | в словаре отсутствует указанный ключ |
| `FileNotFoundError` | файл не найден |
| `AttributeError` | у объекта нет указанного атрибута |
| `ImportError` | не удалось выполнить импорт |

Не нужно запоминать все классы исключений сразу. Сначала прочитай последнюю строку traceback: там находятся тип и сообщение ошибки.

## Исключения при HTTP-запросах {#isklyucheniya-pri-http-zaprosakh}

Сетевой запрос может завершиться ошибкой соединения, тайм-аутом или HTTP-ответом со статусом `4xx`/`5xx`.

```python
import requests


try:
    response = requests.get(
        "https://api.binance.com/api/v3/ticker/price",
        params={"symbol": "BTCUSDT"},
        timeout=10,
    )
    response.raise_for_status()
    price = float(response.json()["price"])
except requests.exceptions.Timeout:
    print("Сервер не ответил вовремя")
except requests.exceptions.ConnectionError:
    print("Не удалось подключиться к серверу")
except requests.exceptions.HTTPError as error:
    print(f"Сервер вернул ошибку: {error}")
else:
    print(price)
```

Важно различать ошибки:

- `ConnectionError` означает проблему подключения;
- `Timeout` означает превышение заданного времени ожидания;
- `HTTPError` появляется после `response.raise_for_status()` для ответов `4xx` и `5xx`;
- ошибка декодирования JSON и отсутствие ключа `"price"` требуют отдельной обработки, если такие ответы ожидаются.

Без `timeout` запрос может ждать ответ слишком долго. Без `raise_for_status()` ответ со статусом `404` или `500` сам по себе не вызовет `HTTPError`.

## Проверка условия или `try`/`except` {#proverka-usloviya-ili-try-except}

Если условие легко проверить заранее, явная проверка часто понятнее:

```python
if numbers:
    average = sum(numbers) / len(numbers)
else:
    print("Список пуст")
```

`try`/`except` полезен, когда:

- операция сама сообщает о неудаче исключением;
- невозможно надежно проверить условие заранее;
- между проверкой и операцией состояние может измениться;
- нужно обработать ошибку внешней библиотеки.

Не используй исключения для обычного ветвления, если простое условие лучше выражает смысл программы.

## Частые ошибки {#chastye-oshibki}

1. Перехватывать все исключения пустым `except`.
   Риск: программные ошибки скрываются и становятся сложнее для диагностики.

2. Ничего не делать внутри `except`.
   Риск: программа продолжит работу в некорректном состоянии.

```python
try:
    process_data()
except ValueError:
    pass
```

3. Помещать слишком много кода в `try`.
   Риск: `except` может перехватить одноименную ошибку не от той операции.

4. Считать, что `ConnectionError` обрабатывает HTTP-статусы `4xx` и `5xx`.
   Решение: вызвать `raise_for_status()` и обработать `HTTPError`.

5. Продолжать работу с переменной, которая могла не получить значение.

```python
try:
    number = int(user_input)
except ValueError:
    print("Некорректный ввод")

print(number)  # number может быть не определена
```

6. Возвращать результат `print()` из функции с типом результата `float`.
   Решение: вернуть вычисленное значение, а `print()` вызвать отдельно.

## Практические задачи {#prakticheskie-zadachi}

### Задача 1 {#zadacha-1}

Запроси у пользователя два числа и выведи результат деления. Отдельно обработай неправильный формат числа и деление на ноль.

### Задача 2 {#zadacha-2}

Напиши функцию `get_item(items, index)`, которая возвращает элемент списка. При неправильном индексе перехвати `IndexError` и верни `None`.

### Задача 3 {#zadacha-3}

Напиши функцию вычисления среднего. Для пустого списка самостоятельно создай `ValueError` с понятным сообщением, затем обработай его при вызове.

### Задача 4 {#zadacha-4}

Выполни HTTP-запрос с `timeout`. Отдельно обработай `Timeout`, `ConnectionError` и `HTTPError`.

## Краткая шпаргалка {#kratkaya-shpargalka}

```python
try:
    result = risky_operation()
except ValueError as error:
    print(error)
else:
    use_result(result)
finally:
    release_resources()
```

```python
# Одинаковая обработка нескольких исключений
except (ValueError, TypeError):
    handle_invalid_data()

# Создать исключение
raise ValueError("Некорректное значение")

# Повторно передать текущее исключение
raise
```

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Errors and Exceptions', href: 'https://docs.python.org/3/tutorial/errors.html' },
        { title: 'Python Reference: try statement', href: 'https://docs.python.org/3/reference/compound_stmts.html#the-try-statement' },
        { title: 'Python: Built-in Exceptions', href: 'https://docs.python.org/3/library/exceptions.html' },
        { title: 'Requests: Errors and Exceptions', href: 'https://requests.readthedocs.io/en/latest/user/quickstart/#errors-and-exceptions' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Исключения и файлы', href: '/python/yazyk-python/isklyucheniya-context-managers-i-fayly' },
        { title: 'HTTP-запросы с requests', href: '/python/ekosistema-python/http-zaprosy-requests' },
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python' },
        { title: 'Словари dict', href: '/python/yazyk-python/tipy-dannykh/slovari-dict' },
    ]"
/>
