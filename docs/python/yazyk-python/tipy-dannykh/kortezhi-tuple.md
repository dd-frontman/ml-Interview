---
title: "Кортежи tuple"
description: "Конспект по кортежам tuple в Python: создание, len, перебор, in, индексы, неизменяемость, кортеж из одного элемента и распаковка значений."
tags:
  - "python"
  - "core"
  - "data-types"
  - "tuple"
updatedAt: "2026-07-09"
---
## Что такое `tuple`

`tuple` - это кортеж: упорядоченная неизменяемая коллекция.

```python
user_roles = ("admin", "editor", "viewer")

print(user_roles)  # ("admin", "editor", "viewer")
```

Кортеж похож на список, но после создания его элементы нельзя заменить, добавить или удалить.

## Когда использовать кортеж

Кортеж удобно использовать, когда набор значений фиксированный.

Примеры:

- роли пользователя;
- координаты `(x, y)`;
- пара `(id, status)`;
- результат функции из нескольких значений;
- настройки, которые не должны случайно меняться.

Если коллекцию нужно часто менять, лучше использовать `list`.

## `len()`

`len()` возвращает количество элементов.

```python
user_roles = ("admin", "editor", "viewer")

print(len(user_roles))  # 3
```

## Перебор кортежа

По кортежу можно пройти циклом `for`.

```python
user_roles = ("admin", "editor", "viewer")

for role in user_roles:
    print(role)
```

Вывод:

```text
admin
editor
viewer
```

## Проверка наличия через `in`

Оператор `in` проверяет, есть ли значение в кортеже.

```python
user_roles = ("admin", "editor", "viewer")

print("admin" in user_roles)   # True
print("writer" in user_roles)  # False
```

Это работает так же, как со списками и строками.

## Индексы

Кортеж поддерживает индексацию.

```python
user_roles = ("admin", "editor", "viewer")

print(user_roles[0])  # admin
print(user_roles[1])  # editor
print(user_roles[2])  # viewer
```

Индексы начинаются с `0`.

## Кортеж неизменяемый

Элемент кортежа нельзя заменить по индексу.

```python
user_roles = ("admin", "editor", "viewer")

user_roles[1] = "author"  # TypeError
```

Ошибка:

```text
TypeError: 'tuple' object does not support item assignment
```

Это главное отличие от списка.

```python
roles = ["admin", "editor", "viewer"]
roles[1] = "author"

print(roles)  # ["admin", "author", "viewer"]
```

## Кортеж из одного элемента

Скобок недостаточно, чтобы создать кортеж из одного элемента.

```python
not_tuple = ("apple")

print(type(not_tuple))  # <class 'str'>
```

Для кортежа из одного элемента нужна запятая.

```python
my_tuple = ("admin",)

print(type(my_tuple))  # <class 'tuple'>
```

Именно запятая делает значение кортежем.

## Распаковка кортежа

Кортеж можно распаковать в несколько переменных.

```python
user_roles = ("admin", "editor", "viewer")

role_1, role_2, role_3 = user_roles

print(role_1)  # admin
print(role_2)  # editor
print(role_3)  # viewer
```

Количество переменных должно совпадать с количеством элементов.

```python
role_1, role_2 = user_roles  # ValueError
```

## Распаковка работает не только с tuple

Распаковка работает и со списками.

```python
user_roles = ["admin", "editor", "viewer"]

role_1, role_2, role_3 = user_roles

print(role_1)  # admin
print(role_2)  # editor
print(role_3)  # viewer
```

Это работает с любыми последовательностями подходящей длины.

## `_` для ненужного значения

Если одно значение не нужно, часто используют `_`.

```python
user_roles = ("admin", "editor", "viewer")

role_1, role_2, _ = user_roles

print(role_1)  # admin
print(role_2)  # editor
```

`_` - это обычное имя переменной, но по соглашению оно показывает: "это значение намеренно игнорируется".

## Tuple или list

Выбирай `tuple`, когда структура фиксированная.

```python
point = (10, 20)
```

Выбирай `list`, когда коллекция должна изменяться.

```python
roles = ["admin", "editor"]
roles.append("viewer")
```

Практическое правило:

- `tuple` - фиксированный набор;
- `list` - изменяемая коллекция.

## Вложенные изменяемые объекты

Сам кортеж неизменяемый, но если внутри лежит изменяемый объект, этот объект можно менять.

```python
data = ([1, 2], "active")

data[0].append(3)

print(data)  # ([1, 2, 3], "active")
```

Кортеж всё ещё хранит тот же список, но содержимое списка изменилось.

Поэтому `tuple` не всегда означает "полностью замороженные данные".

## Частые ошибки

1. Думать, что `("apple")` создает кортеж.
   Проблема: это строка в скобках.
   Решение: для одного элемента нужна запятая: `("apple",)`.

2. Пытаться заменить элемент кортежа.
   Проблема: `tuple` не поддерживает item assignment.
   Решение: если нужны изменения, использовать `list`.

3. Забывать, что индексы начинаются с `0`.
   Проблема: `user_roles[1]` - это второй элемент, а не первый.
   Решение: первый элемент - `user_roles[0]`.

4. Распаковывать в неправильное количество переменных.
   Проблема: Python выбросит `ValueError`.
   Решение: количество переменных должно совпадать с количеством значений.

5. Считать, что кортеж замораживает вложенные списки.
   Проблема: вложенный список всё равно можно изменить.
   Решение: не хранить mutable-объекты внутри tuple, если нужна строгая неизменяемость.

## Cheat-sheet

| Синтаксис | Что делает |
| --- | --- |
| `("admin", "editor")` | Создает кортеж |
| `("admin",)` | Кортеж из одного элемента |
| `len(values)` | Количество элементов |
| `value in values` | Проверка наличия |
| `values[0]` | Первый элемент |
| `for value in values:` | Перебор кортежа |
| `a, b = values` | Распаковка |
| `a, _, c = values` | Игнорирование значения по соглашению |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Tuples and Sequences', href: 'https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences' },
        { title: 'Python Built-in Types: Tuples', href: 'https://docs.python.org/3/library/stdtypes.html#tuples' },
        { title: 'Python Tutorial: Data Structures', href: 'https://docs.python.org/3/tutorial/datastructures.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Неизменяемые типы', href: '/python/yazyk-python/tipy-dannykh/neizmenyaemye-tipy' },
        { title: 'Списки: базовые операции', href: '/python/yazyk-python/tipy-dannykh/spiski-bazovye-operatsii' },
        { title: 'Индексы и срезы', href: '/python/yazyk-python/tipy-dannykh/indeksy-i-srezy' },
        { title: 'Циклы for и range', href: '/python/yazyk-python/1-core/tsikly-for-i-range' },
    ]"
/>
