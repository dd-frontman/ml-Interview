---
title: "Comprehensions в Python"
description: "Конспект по comprehensions в Python: создание списков, словарей и множеств, фильтрация, условные выражения и вложенные конструкции."
tags:
  - "python"
  - "core"
  - "comprehensions"
  - "collections"
updatedAt: "2026-07-25"
---
## Что такое comprehension

Comprehension - компактный синтаксис создания новой коллекции на основе другой последовательности.

Чаще всего используется list comprehension:

```python
squares = [x ** 2 for x in range(6)]

print(squares)
# [0, 1, 4, 9, 16, 25]
```

Python перебирает значения `range(6)`, вычисляет `x ** 2` для каждого значения и добавляет результат в новый список.

## Обычный цикл и list comprehension

Создание квадратов через обычный цикл:

```python
squares = []

for x in range(6):
    squares.append(x ** 2)
```

Эквивалентный list comprehension:

```python
squares = [x ** 2 for x in range(6)]
```

Общая форма:

```python
[выражение for элемент in коллекция]
```

Части конструкции:

| Часть | Назначение |
| --- | --- |
| `x ** 2` | какое значение попадет в новый список |
| `for x` | переменная текущего элемента |
| `in range(6)` | источник элементов |

Comprehension всегда создает новую коллекцию. Исходная последовательность не изменяется.

## Преобразование элементов

В левой части может находиться любое выражение, возвращающее значение.

```python
numbers = [x + 1 for x in range(6)]

print(numbers)
# [1, 2, 3, 4, 5, 6]
```

Можно вызывать функции и методы:

```python
names = ["alice", "bob", "charlie"]
upper_names = [name.upper() for name in names]

print(upper_names)
# ['ALICE', 'BOB', 'CHARLIE']
```

```python
def calculate_square(number):
    return number ** 2


squares = [calculate_square(x) for x in range(6)]
```

Если вычисление занимает несколько действий, лучше использовать обычный цикл или отдельную функцию.

## Почему нельзя использовать `+=`

Такой код содержит синтаксическую ошибку:

```python
numbers = [x += 1 for x in range(6)]  # SyntaxError
```

`x += 1` - инструкция присваивания. Она изменяет переменную и не является выражением, результат которого можно добавить в список.

В левой части comprehension требуется выражение. Поэтому используется `x + 1`:

```python
numbers = [x + 1 for x in range(6)]
```

## Фильтрация через `if`

Условие после `for` определяет, попадет ли элемент в результат.

```python
even_squares = [x ** 2 for x in range(10) if x % 2 == 0]

print(even_squares)
# [0, 4, 16, 36, 64]
```

Общая форма:

```python
[выражение for элемент in коллекция if условие]
```

Эквивалентный цикл:

```python
even_squares = []

for x in range(10):
    if x % 2 == 0:
        even_squares.append(x ** 2)
```

Условие в конце фильтрует элементы. Для неподходящего элемента выражение `x ** 2` не вычисляется.

## `if-else` внутри выражения

Если для каждого элемента нужно выбрать одно из двух значений, используется условное выражение.

```python
numbers = [1, 2, 3, 4, 5]

labels = ["even" if number % 2 == 0 else "odd" for number in numbers]

print(labels)
# ['odd', 'even', 'odd', 'even', 'odd']
```

Общая форма:

```python
[значение_если_true if условие else значение_если_false for элемент in коллекция]
```

Здесь количество элементов не уменьшается: для каждого исходного числа выбирается одна метка.

Важно различать две конструкции:

```python
# Фильтрация: часть элементов отбрасывается
[x for x in numbers if x > 0]

# Выбор значения: результат создается для каждого элемента
[x if x > 0 else 0 for x in numbers]
```

## Dict comprehension

Dict comprehension создает словарь.

```python
square_dict = {x: x ** 2 for x in range(6)}

print(square_dict)
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
```

Общая форма:

```python
{ключ: значение for элемент in коллекция}
```

Пример преобразования существующего словаря:

```python
prices = {
    "apple": 100,
    "banana": 80,
    "orange": 120,
}

discount_prices = {
    name: round(price * 0.9, 2)
    for name, price in prices.items()
}
```

Если вычисленный ключ повторяется, в словаре останется последнее значение для этого ключа.

## Set comprehension

Set comprehension создает множество уникальных значений.

```python
numbers = [1, 1, 2, 2, 3, 3]
squares = {number ** 2 for number in numbers}

print(squares)
# {1, 4, 9}
```

Форма похожа на dict comprehension, но двоеточия между ключом и значением нет.

```python
{выражение for элемент in коллекция}
```

## Вложенные comprehensions

Comprehension может содержать несколько циклов.

```python
pairs = [
    (x, y)
    for x in range(3)
    for y in range(2)
]

print(pairs)
# [(0, 0), (0, 1), (1, 0), (1, 1), (2, 0), (2, 1)]
```

Порядок `for` совпадает с порядком вложенных циклов:

```python
pairs = []

for x in range(3):
    for y in range(2):
        pairs.append((x, y))
```

## Транспонирование матрицы

Транспонирование меняет строки и столбцы местами.

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

transpose = [
    [row[column_index] for row in matrix]
    for column_index in range(len(matrix[0]))
]

print(transpose)
# [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
```

Внешний comprehension перебирает индексы столбцов. Внутренний берет элемент с текущим индексом из каждой строки.

Этот пример предполагает, что матрица не пустая и все строки имеют одинаковую длину.

Для прикладного кода ту же операцию можно записать через `zip`:

```python
transpose = [list(column) for column in zip(*matrix)]
```

## Comprehension или обычный цикл

Comprehension подходит, когда нужно коротко описать одно преобразование или фильтрацию.

```python
active_names = [user["name"] for user in users if user["active"]]
```

Обычный цикл лучше, если внутри нужны:

- несколько последовательных действий;
- сложные условия;
- обработка исключений;
- логирование;
- изменение нескольких коллекций;
- понятные промежуточные переменные.

Главный критерий - читаемость, а не минимальное количество строк.

## List comprehension и generator expression

Квадратные скобки сразу создают весь список в памяти:

```python
squares = [x ** 2 for x in range(1_000_000)]
```

Круглые скобки создают ленивый генератор:

```python
squares = (x ** 2 for x in range(1_000_000))
```

Генератор вычисляет значения по мере перебора. Он полезен, если не требуется хранить весь результат одновременно.

## Частые ошибки

1. Использовать `+=`, `print(...)` или другую операцию ради побочного эффекта.
   Решение: comprehension должен создавать коллекцию; для действий используй обычный цикл.

2. Перепутать положение фильтра и условного выражения.
   Решение: фильтр пишется после `for`, а `if-else` - перед `for`.

3. Создавать слишком сложную вложенную конструкцию.
   Решение: разбить вычисление на цикл, функцию или несколько понятных шагов.

4. Использовать круглые скобки и ожидать список.
   Решение: круглые скобки создают generator expression; для списка нужны `[]`.

5. Забыть, что comprehension создает новую коллекцию.
   Решение: сохранить результат в переменную или присвоить его исходному имени явно.

## Практические задачи

### Задача 1

Создай список кубов чисел от `1` до `10`.

```python
cubes = [number ** 3 for number in range(1, 11)]
```

### Задача 2

Из списка оставь только непустые строки и удали пробелы по краям.

```python
values = [" Python ", "", "  ML", "   ", "SQL "]

clean_values = [value.strip() for value in values if value.strip()]

print(clean_values)
# ['Python', 'ML', 'SQL']
```

### Задача 3

Создай словарь, где ключ - число, а значение показывает его четность.

```python
parity = {
    number: "even" if number % 2 == 0 else "odd"
    for number in range(1, 6)
}
```

## Краткая шпаргалка

```python
# Преобразование
[f(x) for x in items]

# Фильтрация
[x for x in items if condition(x)]

# Выбор одного из двух значений
[a if condition(x) else b for x in items]

# Словарь
{key(x): value(x) for x in items}

# Множество
{f(x) for x in items}

# Генератор
(f(x) for x in items)
```

## Официальная документация

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: List comprehensions', href: 'https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions' },
        { title: 'Python Tutorial: Nested list comprehensions', href: 'https://docs.python.org/3/tutorial/datastructures.html#nested-list-comprehensions' },
        { title: 'Python Reference: Displays for lists, sets and dictionaries', href: 'https://docs.python.org/3/reference/expressions.html#displays-for-lists-sets-and-dictionaries' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'For и range', href: '/python/yazyk-python/1-core/tsikly-for-i-range' },
        { title: 'Итераторы и генераторы', href: '/python/yazyk-python/iteratory-generatory-i-comprehensions' },
        { title: 'Списки: базовые операции', href: '/python/yazyk-python/tipy-dannykh/spiski-bazovye-operatsii' },
        { title: 'Словари dict', href: '/python/yazyk-python/tipy-dannykh/slovari-dict' },
    ]"
/>
