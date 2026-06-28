---
title: "Операторы сравнения"
description: "Операторы сравнения в Python: равно, не равно, больше, меньше, больше либо равно, меньше либо равно, цепочки сравнений и типичные ошибки."
tags:
  - "python"
  - "core"
  - "operators"
  - "comparison"
updatedAt: "2026-06-21"
---
## Что это за операторы

Операторы сравнения нужны, чтобы сравнить два значения и получить ответ `True` или `False`.

| Оператор | Смысл | Пример |
| --- | --- | --- |
| `==` | равно | `age == 18` |
| `!=` | не равно | `status != "blocked"` |
| `>` | больше | `score > 0.8` |
| `<` | меньше | `loss < 0.1` |
| `>=` | больше либо равно | `age >= 18` |
| `<=` | меньше либо равно | `temperature <= 37.0` |

## Базовые примеры

```python
print(10 == 10)  # True
print(10 != 5)   # True
print(10 > 5)    # True
print(10 < 5)    # False
print(10 >= 10)  # True
print(5 <= 10)   # True
```

Результат сравнения - это `bool`.

```python
is_adult = 20 >= 18

print(is_adult)        # True
print(type(is_adult))  # <class 'bool'>
```

## `=` и `==`

`=` и `==` - разные операции.

`=` присваивает значение переменной.

```python
age = 18
```

`==` сравнивает два значения.

```python
print(age == 18)  # True
```

В условии почти всегда нужен `==`, а не `=`.

```python
age = 18

if age == 18:
    print("adult")
```

## Использование в условиях

Операторы сравнения часто используются внутри `if`.

```python
score = 0.91

if score >= 0.8:
    print("good model")
```

Можно соединять сравнения через `and` и `or`.

```python
age = 25
has_ticket = True

if age >= 18 and has_ticket:
    print("can enter")
```

## Цепочки сравнений

В Python можно писать сравнение как в математике.

```python
age = 25

if 18 <= age <= 65:
    print("working age")
```

Это читается как:

```python
if age >= 18 and age <= 65:
    print("working age")
```

Для диапазонов такая запись обычно понятнее.

## Сравнение строк

Строки можно сравнивать через `==` и `!=`.

```python
role = "admin"

print(role == "admin")  # True
print(role != "guest")  # True
```

Операторы `>`, `<`, `>=`, `<=` для строк сравнивают строки по порядку символов. Это полезно для сортировки, но редко подходит для проверки "какое слово больше по смыслу".

```python
print("b" > "a")  # True
```

## Сравнение `float`

С числами с плавающей точкой нужно помнить про ограниченную точность.

```python
print(0.1 + 0.2 == 0.3)  # False
```

Для таких сравнений часто используют допуск.

```python
from math import isclose

print(isclose(0.1 + 0.2, 0.3))  # True
```

## Сравнение с `None`

Для проверки на `None` обычно используют `is`, а не `==`.

```python
value = None

if value is None:
    print("empty")
```

Это отдельная проверка идентичности объекта, но на практике ее часто встречают рядом с операторами сравнения.

## Типичные ошибки

1. Писать `=` вместо `==`.
   Проблема: `=` - присваивание, а не сравнение.
   Решение: в условиях использовать `==`.

2. Писать `=>` или `=<`.
   Проблема: в Python таких операторов нет.
   Решение: использовать `>=` и `<=`.

3. Ожидать точного сравнения от `float`.
   Проблема: `0.1 + 0.2 == 0.3` дает `False`.
   Решение: использовать `math.isclose()` или сравнение с допуском.

4. Сравнивать разные типы через `>` или `<`.
   Проблема: например, `"10" > 2` вызовет `TypeError`.
   Решение: привести значения к одному типу до сравнения.

5. Путать `==` и `is`.
   Проблема: `==` сравнивает значения, `is` проверяет, один ли это объект.
   Решение: для обычных значений использовать `==`, для `None` - `is None`.

## Cheat-sheet

| Задача | Оператор |
| --- | --- |
| Проверить равенство | `a == b` |
| Проверить неравенство | `a != b` |
| Проверить, что больше | `a > b` |
| Проверить, что меньше | `a < b` |
| Проверить нижнюю границу | `a >= min_value` |
| Проверить верхнюю границу | `a <= max_value` |
| Проверить диапазон | `min_value <= value <= max_value` |
| Проверить `None` | `value is None` |
| Сравнить `float` с допуском | `isclose(a, b)` |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python: Comparisons', href: 'https://docs.python.org/3/reference/expressions.html#comparisons' },
        { title: 'Python: Boolean type', href: 'https://docs.python.org/3/library/stdtypes.html#boolean-type-bool' },
        { title: 'Python: Floating-point arithmetic', href: 'https://docs.python.org/3/tutorial/floatingpoint.html' },
        { title: 'Python: math.isclose', href: 'https://docs.python.org/3/library/math.html#math.isclose' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Boolean и условия', href: '/python/yazyk-python/1-core/boolean-i-usloviya' },
        { title: 'Основы синтаксиса и переменные', href: '/python/yazyk-python/1-core/osnovy-sintaksisa-i-peremennye' },
        { title: 'Арифметические операторы', href: '/python/yazyk-python/1-core/arifmeticheskie-operatory' },
        { title: 'Логические и побитовые операторы', href: '/python/yazyk-python/1-core/logicheskie-i-pobitovye-operatory' },
        { title: 'Основные функции', href: '/python/yazyk-python/1-core/osnovnye-funktsii' },
    ]"
/>
