---
title: "Значения параметров по умолчанию"
description: "Необязательные параметры Python, правильный порядок параметров и безопасная работа с изменяемыми значениями по умолчанию."
tags:
  - "python"
  - "core"
  - "functions"
updatedAt: "2026-11-09"
---
## Значение по умолчанию {#znachenie-po-umolchaniyu}

Параметру можно заранее назначить значение. Тогда соответствующий аргумент становится необязательным:

```python
def custom_greeting(*, name: str, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}"
```

Если `greeting` не передать, Python возьмёт `"Hello"`:

```python
print(custom_greeting(name="John"))  # Hello, John
```

Переданный аргумент заменяет значение по умолчанию:

```python
print(custom_greeting(name="John", greeting="Good morning"))
# Good morning, John
```

## Порядок параметров {#poryadok-parametrov}

В обычном списке позиционных параметров сначала указывают обязательные параметры, затем параметры со значениями по умолчанию:

```python
def func(a, b=5, c=10):
    return a, b, c


print(func(1))        # (1, 5, 10)
print(func(1, 2))     # (1, 2, 10)
print(func(1, 2, 3))  # (1, 2, 3)
```

Первому параметру тоже можно назначить значение, потому что все параметры после него уже имеют значения по умолчанию:

```python
def func(a=1, b=5, c=10):
    return a, b, c


print(func())       # (1, 5, 10)
print(func(2))      # (2, 5, 10)
print(func(2, 3))   # (2, 3, 10)
```

Ошибка возникает, если после необязательного позиционного параметра находится обязательный:

```python
def func(a=5, b):
    return a, b
```

Python остановится ещё до запуска программы:

```text
SyntaxError: non-default argument follows default argument
```

Позиционные аргументы связываются с параметрами слева направо. Поэтому Python не может пропустить необязательный `a` и догадаться, что единственный аргумент предназначен для обязательного `b`.

Краткое правило:

```text
сначала обязательные параметры -> затем параметры со значениями по умолчанию
```

## Keyword-only параметры {#keyword-only-parametry}

Для параметров после `*` это ограничение не действует, потому что аргументы передаются по именам:

```python
def func(*, a=5, b):
    return a, b


print(func(b=10))  # (5, 10)
```

Python точно знает, что `10` предназначено параметру `b`.

## Изменяемые значения по умолчанию {#izmenyaemye-znacheniya-po-umolchaniyu}

Значения по умолчанию создаются один раз — в момент объявления функции. Поэтому не стоит использовать изменяемый список как значение по умолчанию:

```python
def append_in_list(*, element: int, lst: list[int] = []) -> list[int]:
    lst.append(element)
    return lst


first = append_in_list(element=1)
second = append_in_list(element=2)

print(first)            # [1, 2]
print(second)           # [1, 2]
print(first is second)  # True
```

Оба вызова используют один список. Во втором вызове в нём уже находится `1`.

## Безопасный шаблон с `None` {#bezopasnyy-shablon-s-none}

Вместо изменяемого объекта используют `None`, а новый список создают внутри функции:

```python
def append_in_list(
    *,
    element: int,
    lst: list[int] | None = None,
) -> list[int]:
    if lst is None:
        lst = []

    lst.append(element)
    return lst
```

Теперь независимые вызовы получают разные списки:

```python
my_list = append_in_list(element=1)
another_list = append_in_list(element=2)

print(my_list)                  # [1]
print(another_list)             # [2]
print(my_list is another_list)  # False
```

Если передать существующий список, функция изменит именно его:

```python
numbers = [10, 20]
result = append_in_list(element=30, lst=numbers)

print(numbers)            # [10, 20, 30]
print(result)             # [10, 20, 30]
print(result is numbers)  # True
```

Проверять нужно именно `lst is None`, а не `if not lst`. Пустой список может быть намеренно передан вызывающим кодом, но условие `if not lst` посчитает его отсутствующим.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Создай функцию `connect(host, port=8000)` и вызови её с портом по умолчанию и с другим портом.
2. Объясни, почему `def func(a=1, b=2)` допустимо, а `def func(a=1, b)` — нет.
3. Исправь функцию `def add_item(item, items=[]): ...`, чтобы разные вызовы не использовали один список.

<RelatedTopics
    :items="[
        { title: 'Обзор функций', href: '/python/yazyk-python/1-core/funktsii-v-python/' },
        { title: 'Параметры и аргументы', href: '/python/yazyk-python/1-core/funktsii-v-python/parametry-i-argumenty' },
        { title: 'Изменяемые типы', href: '/python/yazyk-python/tipy-dannykh/izmenyaemye-tipy' },
        { title: 'is и ==', href: '/python/yazyk-python/tipy-dannykh/neizmenyaemye-tipy' },
    ]"
/>
