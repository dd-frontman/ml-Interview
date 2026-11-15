---
title: "Параметры и аргументы функции"
description: "Разница между параметрами и аргументами, позиционные, именованные и keyword-only аргументы в Python."
tags:
  - "python"
  - "core"
  - "functions"
updatedAt: "2026-11-09"
---
## Параметры и аргументы {#parametry-i-argumenty}

Важно различать два термина:

- **параметры** — имена переменных, указанные при объявлении функции;
- **аргументы** — конкретные значения, переданные при вызове функции.

```python
def greet(name, age):
    return f"Привет, {name}! Тебе {age} лет."


message = greet("Анна", 25)
print(message)  # Привет, Анна! Тебе 25 лет.
```

В этом примере:

- `name` и `age` — параметры;
- `"Анна"` и `25` — аргументы.

Можно запомнить так: параметры находятся в объявлении функции, аргументы — в месте её вызова.

## Как параметр получает значение {#kak-parametr-poluchaet-znachenie}

Параметр работает как локальная переменная, которая получает переданный аргумент:

```python
def count_vowels(string):
    vowels = "aeiouyAEIOUY"
    count = 0

    for char in string:
        if char in vowels:
            count += 1

    return count


print(count_vowels("Hello, World!"))  # 3
print(count_vowels("Python is a very powerful language."))  # 13
```

Во время первого вызова параметр `string` ссылается на строку `"Hello, World!"`, а во время второго — на другую строку.

## Позиционные аргументы {#pozitsionnye-argumenty}

По умолчанию аргументы связываются с параметрами слева направо:

```python
def format_date(day, month):
    return f"The date is {day} of {month}."


print(format_date(15, "October"))  # The date is 15 of October.
```

Порядок важен:

```python
print(format_date("January", 1))  # The date is January of 1.
```

Python не понимает смысл аргументов. Первый аргумент попадает в `day`, второй — в `month`.

## Именованные аргументы {#imenovannye-argumenty}

Имя параметра можно явно указать при вызове:

```python
print(format_date(day=15, month="October"))  # The date is 15 of October.
```

Преимущества именованных аргументов:

- вызов легче читать;
- сложнее перепутать значения;
- порядок именованных аргументов можно менять.

```python
print(format_date(month="October", day=15))  # The date is 15 of October.
```

После именованного аргумента нельзя передавать обычный позиционный аргумент:

```python
format_date(day=15, "October")  # SyntaxError
```

## Keyword-only параметры {#keyword-only-parametry}

Звёздочка `*` в объявлении делает все следующие параметры доступными только по имени:

```python
def format_date(*, day: int, month: str) -> str:
    return f"The date is {day} of {month}."


print(format_date(day=15, month="October"))  # The date is 15 of October.
```

Позиционный вызов завершится ошибкой:

```python
format_date(15, "October")  # TypeError
```

Такой подход полезен, когда значения одного типа легко перепутать или у функции много настроек.

### Keyword-only параметр после `*args` {#keyword-only-parametr-posle-args}

Параметры, объявленные после `*args`, тоже можно передавать только по имени:

```python
def total(initial=5, *numbers, extra_number):
    count = initial

    for number in numbers:
        count += number

    count += extra_number
    return count


print(total(10, 1, 2, 3, extra_number=50))  # 66
```

Аргументы распределяются так:

- `initial` получает `10`;
- `numbers` получает кортеж `(1, 2, 3)`;
- `extra_number` получает `50` только по имени.

У `extra_number` нет значения по умолчанию, поэтому он остаётся обязательным. Если его не передать, функция не сможет начать выполнение:

```python
total(10, 1, 2, 3)  # TypeError: пропущен обязательный keyword-only аргумент
```

Точный текст `TypeError` может немного отличаться в разных версиях Python.

### Одиночная `*` без `args` {#odinochnaya-bez-args}

Если собирать дополнительные позиционные аргументы не нужно, укажи `*` без имени:

```python
def total(initial=5, *, extra_number):
    return initial + extra_number


print(total(10, extra_number=50))  # 60
```

После одиночной `*` параметр `extra_number` разрешено передавать только по имени:

```python
total(10, 50)  # TypeError
```

Значение по умолчанию делает keyword-only параметр необязательным:

```python
def total(initial=5, *, extra_number=0):
    return initial + extra_number


print(total())                    # 5
print(total(extra_number=10))     # 15
```

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Создай функцию `create_user(name, age)` и вызови её позиционными аргументами.
2. Вызови ту же функцию именованными аргументами в обратном порядке.
3. Сделай параметры `width` и `height` функции `calculate_area()` keyword-only.

<RelatedTopics
    :items="[
        { title: 'Обзор функций', href: '/python/yazyk-python/1-core/funktsii-v-python/' },
        { title: 'Значения параметров по умолчанию', href: '/python/yazyk-python/1-core/funktsii-v-python/znacheniya-parametrov-po-umolchaniyu' },
        { title: '*args', href: '/python/yazyk-python/1-core/funktsii-v-python/args-proizvolnye-pozitsionnye-argumenty' },
        { title: 'Порядок параметров', href: '/python/yazyk-python/1-core/funktsii-v-python/poryadok-parametrov-funktsii' },
    ]"
/>
