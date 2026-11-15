---
title: "Объявление и вызов функции"
description: "Как объявлять функции через def, вызывать их и устранять повторение кода в Python."
tags:
  - "python"
  - "core"
  - "functions"
updatedAt: "2026-11-09"
---
## Зачем нужны функции {#zachem-nuzhny-funktsii}

Представим, что программа вычисляет среднее значение нескольких списков. Без функции одинаковая логика повторяется:

```python
numbers_1 = [1, 2, 3, 4, 5]
average_1 = sum(numbers_1) / len(numbers_1)
print(average_1)  # 3.0

numbers_2 = [6, 7, 8, 9, 10]
average_2 = sum(numbers_2) / len(numbers_2)
print(average_2)  # 8.0
```

Формула в обоих случаях одинаковая:

```python
sum(numbers) / len(numbers)
```

Если формулу придётся изменить, без функции нужно будет искать и исправлять каждую копию. Функция позволяет хранить логику в одном месте.

## Объявление через `def` {#obyavlenie-cherez-def}

```python
def find_average(numbers):
    average = sum(numbers) / len(numbers)
    return average
```

Разберём объявление:

- `def` сообщает Python, что начинается объявление функции;
- `find_average` — имя функции;
- `numbers` — входной параметр;
- двоеточие `:` завершает заголовок;
- тело функции записывается с отступом;
- `return average` возвращает вычисленное значение.

При объявлении Python запоминает функцию, но ещё не выполняет её тело.

## Вызов функции {#vyzov-funktsii}

Чтобы выполнить функцию, после её имени ставят круглые скобки:

```python
numbers_1 = [1, 2, 3, 4, 5]
numbers_2 = [6, 7, 8, 9, 10]

average_1 = find_average(numbers_1)
average_2 = find_average(numbers_2)

print(average_1)  # 3.0
print(average_2)  # 8.0
```

Запись `find_average` обозначает сам объект функции, а `find_average(...)` вызывает её.

```python
print(find_average)           # <function find_average at ...>
print(find_average([2, 4]))   # 3.0
```

Адрес после `at` в первом выводе может отличаться при каждом запуске.

## Функция без параметров {#funktsiya-bez-parametrov}

Если входные данные не нужны, скобки в объявлении остаются пустыми:

```python
def show_menu():
    print("1. Начать")
    print("2. Выйти")


show_menu()
# 1. Начать
# 2. Выйти
```

Скобки обязательны и при объявлении, и при вызове.

## Типичные ошибки {#tipichnye-oshibki}

### Забыть вызвать функцию {#zabyt-vyzvat-funktsiyu}

```python
def greet():
    print("Привет")


greet  # Тело функции не выполнится
```

Нужны круглые скобки:

```python
greet()  # Привет
```

### Нарушить отступ {#narushit-otstup}

```python
def greet():
print("Привет")  # IndentationError
```

Тело функции должно находиться внутри блока с отступом:

```python
def greet():
    print("Привет")
```

### Вызвать функцию до её объявления {#vyzvat-funktsiyu-do-eyo-obyavleniya}

Python выполняет файл сверху вниз. К моменту вызова имя функции уже должно существовать:

```python
greet()  # NameError


def greet():
    print("Привет")
```

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Создай функцию `show_language()`, которая выводит строку `Python`.
2. Создай функцию `calculate_square(number)`, которая возвращает квадрат числа.
3. Вызови `calculate_square()` для чисел `3` и `10`, не копируя формулу вычисления.

<RelatedTopics
    :items="[
        { title: 'Обзор функций', href: '/python/yazyk-python/1-core/funktsii-v-python/' },
        { title: 'Параметры и аргументы', href: '/python/yazyk-python/1-core/funktsii-v-python/parametry-i-argumenty' },
        { title: 'return, print и pass', href: '/python/yazyk-python/1-core/funktsii-v-python/return-print-i-pass' },
    ]"
/>
