---
title: "Операторы сравнения"
description: "Операторы сравнения в Python: равно, не равно, больше, меньше, различия между == и is, цепочки сравнений и типичные ошибки."
tags:
  - "python"
  - "core"
  - "operators"
  - "comparison"
updatedAt: "2026-06-21"
---
## Что это за операторы {#chto-eto-za-operatory}

Операторы сравнения нужны, чтобы сравнить два значения и получить ответ `True` или `False`.

| Оператор | Смысл | Пример |
| --- | --- | --- |
| `==` | равно | `age == 18` |
| `!=` | не равно | `status != "blocked"` |
| `>` | больше | `score > 0.8` |
| `<` | меньше | `loss < 0.1` |
| `>=` | больше либо равно | `age >= 18` |
| `<=` | меньше либо равно | `temperature <= 37.0` |

## Базовые примеры {#bazovye-primery}

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

## `=` и `==` {#i}

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

## Чем `is` отличается от `==` {#chem-is-otlichaetsya-ot}

Операторы `==` и `is` отвечают на разные вопросы:

- `a == b` проверяет: **равны ли значения объектов**;
- `a is b` проверяет: **являются ли `a` и `b` одним и тем же объектом в памяти**.

Например, два разных списка могут содержать одинаковые значения.

```python
first = [1, 2, 3]
second = [1, 2, 3]

print(first == second)  # True
print(first is second)  # False
```

`first == second` возвращает `True`, потому что содержимое списков одинаковое. Но каждый список был создан отдельно, поэтому это разные объекты и `first is second` возвращает `False`.

Если две переменные ссылаются на один объект, оба оператора вернут `True`.

```python
first = [1, 2, 3]
second = first

print(first == second)  # True
print(first is second)  # True
```

Здесь новый список не создается. В переменную `second` записывается ссылка на тот же список, на который уже ссылается `first`.

Это можно заметить после изменения списка:

```python
first = [1, 2, 3]
second = first

second.append(4)

print(first)  # [1, 2, 3, 4]
```

Список изменился и для `first`, потому что `first` и `second` указывают на один объект.

Для сравнения чисел, строк, списков и других значений обычно нужен `==`.

```python
name = "Alex"

print(name == "Alex")  # True
```

Не следует заменять здесь `==` на `is`. Python может повторно использовать некоторые неизменяемые объекты, например небольшие числа или строки, поэтому результат `is` иногда случайно окажется `True`. Это особенность внутренней работы Python, на которую нельзя опираться при сравнении значений.

Оператор `is not` выполняет обратную проверку: переменные ссылаются не на один и тот же объект.

```python
first = []
second = []

print(first is not second)  # True
```

Короткое правило:

- сравниваешь значения - используй `==` или `!=`;
- проверяешь объект `None` - используй `is None` или `is not None`;
- проверка идентичности других объектов нужна редко.

## Использование в условиях {#ispolzovanie-v-usloviyakh}

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

## Цепочки сравнений {#tsepochki-sravneniy}

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

## Сравнение строк {#sravnenie-strok}

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

## Сравнение `float` {#sravnenie-float}

С числами с плавающей точкой нужно помнить про ограниченную точность.

```python
print(0.1 + 0.2 == 0.3)  # False
```

Для таких сравнений часто используют допуск.

```python
from math import isclose

print(isclose(0.1 + 0.2, 0.3))  # True
```

## Сравнение с `None` {#sravnenie-s-none}

Для проверки на `None` используют `is`, а не `==`.

```python
value = None

if value is None:
    print("empty")  # empty
```

`None` существует в единственном экземпляре, поэтому здесь нужно проверить, что переменная ссылается именно на объект `None`.

Обратная проверка записывается через `is not None`.

```python
value = "Python"

if value is not None:
    print(value)  # Python
```

## Типичные ошибки {#tipichnye-oshibki}

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

## Cheat-sheet {#cheat-sheet}

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

## Official docs {#official-docs}

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
