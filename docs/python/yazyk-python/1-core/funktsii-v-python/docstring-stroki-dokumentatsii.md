---
title: "Docstring: строки документации"
description: "Как документировать функции Python с помощью docstring, получать документацию через __doc__ и help, оформлять описание параметров и результата."
tags:
  - "python"
  - "core"
  - "functions"
  - "documentation"
updatedAt: "2026-11-10"
---
## Что такое docstring {#chto-takoe-docstring}

**Docstring** (documentation string, строка документации) — это строка, которая описывает назначение функции, класса или модуля.

Docstring помогает понять:

- что делает функция;
- какие данные она принимает;
- что возвращает;
- какие ограничения и исключения нужно учитывать.

В отличие от обычного комментария, docstring сохраняется в объекте Python. Поэтому её можно получить во время выполнения программы.

## Минимальный пример {#minimalnyy-primer}

Docstring записывают первой инструкцией внутри функции, обычно в тройных двойных кавычках:

```python
def greet(name: str) -> str:
    """Возвращает приветствие для пользователя."""
    return f"Привет, {name}!"


print(greet("Анна"))  # Привет, Анна!
```

Python связывает первую строку с объектом функции `greet`.

## Получение документации через `__doc__` {#poluchenie-dokumentatsii-cherez-doc}

Строка документации доступна через атрибут `__doc__`:

```python
def greet(name: str) -> str:
    """Возвращает приветствие для пользователя."""
    return f"Привет, {name}!"


print(greet.__doc__)  # Возвращает приветствие для пользователя.
```

Именно поэтому docstring можно прочитать во время выполнения программы.

Если у функции нет строки документации, `__doc__` содержит `None`:

```python
def add(a: int, b: int) -> int:
    return a + b


print(add.__doc__)  # None
```

## Функция `help()` {#funktsiya-help}

Встроенная функция `help()` выводит справку об объекте, включая его сигнатуру и docstring:

```python
def greet(name: str) -> str:
    """Возвращает приветствие для пользователя."""
    return f"Привет, {name}!"


help(greet)
```

Сокращённо вывод будет выглядеть так:

```text
Help on function greet:

greet(name: str) -> str
    Возвращает приветствие для пользователя.
```

IDE также использует docstring для подсказок при наведении и вызове функции.

## Многострочная docstring {#mnogostrochnaya-docstring}

Если одного предложения недостаточно, используют многострочное описание:

```python
def calculate_average(numbers: list[float]) -> float:
    """Вычисляет среднее арифметическое чисел.

    Args:
        numbers: Непустой список чисел.

    Returns:
        Среднее арифметическое элементов списка.

    Raises:
        ValueError: Если передан пустой список.
    """
    if not numbers:
        raise ValueError("Список не должен быть пустым")

    return sum(numbers) / len(numbers)


print(calculate_average([2, 4, 6]))  # 4.0
```

В примере используются распространённые разделы:

- `Args` — параметры функции;
- `Returns` — возвращаемое значение;
- `Raises` — возможные исключения.

Это Google-style оформление. В проектах также встречаются reStructuredText и NumPy style. Важно придерживаться одного формата внутри проекта.

## Docstring должна быть первой строкой {#docstring-dolzhna-byt-pervoy-strokoy}

Python считает строку документацией только тогда, когда она является первой инструкцией в теле функции:

```python
def greet(name: str) -> str:
    message = f"Привет, {name}!"
    """Эта строка уже не станет docstring."""
    return message


print(greet.__doc__)  # None
```

Правильный порядок:

```python
def greet(name: str) -> str:
    """Возвращает приветствие для пользователя."""
    message = f"Привет, {name}!"
    return message
```

## Docstring и комментарий {#docstring-i-kommentariy}

```python
def calculate_tax(price: float) -> float:
    """Возвращает цену с налогом 20%."""
    # Коэффициент 1.2 включает исходную цену и налог.
    return price * 1.2
```

Здесь у записей разные задачи:

- docstring объясняет пользователю функции её назначение;
- комментарий поясняет конкретное неочевидное решение внутри реализации.

Комментарии не попадают в `__doc__` и недоступны через `help()`.

## Практические правила {#prakticheskie-pravila}

1. Начинай описание с короткого ответа на вопрос «Что делает функция?».
2. Не пересказывай очевидный код построчно.
3. Описывай важные ограничения и пограничные случаи.
4. Для публичной функции указывай параметры, результат и возможные исключения.
5. Обновляй docstring вместе с поведением функции.

Плохое описание повторяет имя функции и ничего не объясняет:

```python
def get_user(user_id: int):
    """Получает пользователя."""
```

Более полезный вариант фиксирует контракт:

```python
def get_user(user_id: int):
    """Возвращает пользователя по идентификатору или None, если он не найден."""
```

## Типичные ошибки {#tipichnye-oshibki}

1. Размещать строку не первой инструкцией функции.
2. Использовать комментарий `#` вместо docstring и ожидать значение в `__doc__`.
3. Описывать поведение, которое уже не соответствует коду.
4. Не указывать важное исключение или ограничение входных данных.
5. Писать большое описание для очевидной внутренней функции из двух строк.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Добавь однострочную docstring функции, которая возвращает квадрат числа.
2. Выведи документацию функции через `.__doc__` и `help()`.
3. Напиши многострочную docstring для функции деления, указав параметры, результат и `ZeroDivisionError`.

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Documentation Strings', href: 'https://docs.python.org/3/tutorial/controlflow.html#documentation-strings' },
        { title: 'PEP 257: Docstring Conventions', href: 'https://peps.python.org/pep-0257/' },
        { title: 'Python built-in help', href: 'https://docs.python.org/3/library/functions.html#help' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Обзор функций', href: '/python/yazyk-python/1-core/funktsii-v-python/' },
        { title: 'Объявление и вызов функции', href: '/python/yazyk-python/1-core/funktsii-v-python/obyavlenie-i-vyzov-funktsii' },
        { title: 'Аннотации типов', href: '/python/yazyk-python/1-core/funktsii-v-python/annotatsii-tipov' },
    ]"
/>
