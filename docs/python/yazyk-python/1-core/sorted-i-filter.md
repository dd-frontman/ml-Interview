---
title: "Функции sorted и filter"
description: "Конспект по sorted и filter в Python: сортировка без изменения исходной коллекции, key, reverse, составные ключи и фильтрация через функцию-предикат."
tags:
  - "python"
  - "core"
  - "sorted"
  - "filter"
updatedAt: "2026-08-11"
---
## Что изучаем {#chto-izuchaem}

В этом уроке рассматриваются две встроенные функции:

- `sorted()` создает отсортированный список;
- `filter()` оставляет элементы, соответствующие условию.

Обе функции принимают итерируемый объект: список, кортеж, множество, строку или другой объект, по которому можно пройти циклом.

## Базовая сортировка через `sorted()` {#bazovaya-sortirovka-cherez-sorted}

```python
fruits = ["banana", "apple", "cherry", "date"]
sorted_fruits = sorted(fruits)

print(sorted_fruits)
# ['apple', 'banana', 'cherry', 'date']

print(fruits)
# ['banana', 'apple', 'cherry', 'date']
```

`sorted()` возвращает новый список и не изменяет исходную коллекцию.

Общая сигнатура:

```python
sorted(iterable, *, key=None, reverse=False)
```

Аргументы:

| Аргумент | Назначение |
| --- | --- |
| `iterable` | объект, элементы которого нужно отсортировать |
| `key` | функция, вычисляющая ключ сравнения |
| `reverse` | направление сортировки |

Результатом всегда будет `list`, даже если передан другой тип коллекции.

```python
numbers = (3, 1, 2)
result = sorted(numbers)

print(result)        # [1, 2, 3]
print(type(result))  # <class 'list'>
```

## `sorted()` и `.sort()` {#sorted-i-sort}

Функция `sorted()` получает коллекцию, сортирует ее элементы и возвращает новый список.

```python
my_list = [3, 1, 2]
another_list = sorted(my_list)

print(my_list)       # [3, 1, 2]
print(another_list)  # [1, 2, 3]
```

Что происходит по шагам:

1. `my_list` ссылается на исходный список `[3, 1, 2]`.
2. `sorted(my_list)` читает его элементы и создает новый отсортированный список.
3. Ссылка на новый список записывается в `another_list`.
4. Исходный `my_list` остается без изменений.

Получаются два разных объекта:

```python
print(my_list is another_list)  # False
```

У списков также есть метод `.sort()`. Он не создает новый список, а изменяет существующий на месте.

```python
my_list = [3, 1, 2]
result = my_list.sort()

print(my_list)  # [1, 2, 3]
print(result)   # None
```

Метод `.sort()` возвращает `None`. Поэтому результат нельзя сохранять как новый отсортированный список:

```python
my_list = [3, 1, 2]
another_list = my_list.sort()

print(my_list)       # [1, 2, 3]
print(another_list)  # None
```

Используй `sorted()`, если исходные данные нужно сохранить. Используй `.sort()`, если нужно изменить сам список и отдельная копия не требуется.

## Обратный порядок {#obratnyy-poryadok}

`reverse=True` сортирует в обратном порядке.

```python
fruits = ["banana", "apple", "cherry", "date"]
sorted_fruits = sorted(fruits, reverse=True)

print(sorted_fruits)
# ['date', 'cherry', 'banana', 'apple']
```

Для чисел:

```python
numbers = [5, 1, 10, 3]

print(sorted(numbers))                # [1, 3, 5, 10]
print(sorted(numbers, reverse=True))  # [10, 5, 3, 1]
```

## Аргумент `key` {#argument-key}

По умолчанию Python сравнивает сами элементы. Через `key` можно указать, какое значение использовать для сравнения.

```python
def sort_by_length(element):
    return len(element)


fruits = ["banana", "apple", "cherry", "date"]
sorted_fruits = sorted(fruits, key=sort_by_length)

print(sorted_fruits)
# ['date', 'apple', 'banana', 'cherry']
```

Для каждого элемента происходит примерно следующее:

```text
banana -> sort_by_length("banana") -> 6
apple  -> sort_by_length("apple")  -> 5
date   -> sort_by_length("date")   -> 4
```

Python сортирует строки по полученным числам, но в результат помещает исходные строки.

В `key` передается сама функция без круглых скобок:

```python
sorted(fruits, key=sort_by_length)    # правильно
sorted(fruits, key=sort_by_length())  # ошибка
```

`sorted()` самостоятельно вызовет функцию для каждого элемента.

## Сортировка словарей по полю {#sortirovka-slovarey-po-polyu}

Список словарей нельзя полезно отсортировать без указания поля сравнения.

```python
people = [
    {"name": "Alice", "age": 25},
    {"name": "Bob", "age": 20},
    {"name": "Charlie", "age": 30},
]


def sort_by_age(person):
    return person["age"]


sorted_people = sorted(people, key=sort_by_age)
```

Результат:

```python
[
    {"name": "Bob", "age": 20},
    {"name": "Alice", "age": 25},
    {"name": "Charlie", "age": 30},
]
```

Функция `sort_by_age()` получает один словарь и возвращает его возраст. Возраст используется только для сравнения.

## Сортировка по нескольким полям {#sortirovka-po-neskolkim-polyam}

Если `key` возвращает кортеж, Python сравнивает его элементы слева направо.

```python
people = [
    {"name": "Alice", "age": 25},
    {"name": "Bob", "age": 20},
    {"name": "Diana", "age": 30},
    {"name": "Charlie", "age": 30},
]


def sort_by_age_and_name(person):
    return person["age"], person["name"]


sorted_people = sorted(people, key=sort_by_age_and_name)
```

Сначала сравнивается `age`. Если возраст одинаковый, сравнивается `name`.

```python
[
    {"name": "Bob", "age": 20},
    {"name": "Alice", "age": 25},
    {"name": "Charlie", "age": 30},
    {"name": "Diana", "age": 30},
]
```

## Стабильность сортировки {#stabilnost-sortirovki}

Сортировка Python стабильна: элементы с одинаковым ключом сохраняют относительный порядок из исходной коллекции.

```python
people = [
    {"name": "Alice", "age": 20},
    {"name": "Bob", "age": 20},
]

print(sorted(people, key=lambda person: person["age"]))
# Alice останется перед Bob
```

Это полезно, когда сортировка выполняется последовательно по нескольким критериям.

## Что такое `filter()` {#chto-takoe-filter}

`filter()` оставляет элементы, для которых проверяющая функция вернула истинное значение.

```python
def is_even(number):
    return number % 2 == 0


numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
filtered_numbers = filter(is_even, numbers)
```

Общая форма:

```python
filter(predicate, iterable)
```

`predicate` - функция-предикат. Она получает один элемент и возвращает результат, который Python проверяет как `True` или `False`.

## Почему нужен `list()` {#pochemu-nuzhen-list}

`filter()` возвращает не список, а ленивый объект-фильтр.

```python
print(type(filtered_numbers))
# <class 'filter'>
```

Элементы проверяются по мере перебора. Чтобы сразу получить список, результат передают в `list()`:

```python
even_numbers = list(filter(is_even, numbers))

print(even_numbers)
# [2, 4, 6, 8]
```

Ленивый объект можно перебрать только один раз:

```python
filtered_numbers = filter(is_even, numbers)

print(list(filtered_numbers))  # [2, 4, 6, 8]
print(list(filtered_numbers))  # []
```

После первого преобразования итератор уже исчерпан.

## Фильтрация словарей {#filtratsiya-slovarey}

```python
def is_adult(person):
    return person["age"] >= 18


people = [
    {"name": "Alice", "age": 17},
    {"name": "Bob", "age": 30},
    {"name": "Charlie", "age": 19},
    {"name": "David", "age": 40},
]

adults = list(filter(is_adult, people))
```

Результат содержит только словари людей не младше 18 лет.

```python
[
    {"name": "Bob", "age": 30},
    {"name": "Charlie", "age": 19},
    {"name": "David", "age": 40},
]
```

## `filter()` и list comprehension {#filter-i-list-comprehension}

Тот же фильтр можно записать через list comprehension.

```python
even_numbers = [number for number in numbers if is_even(number)]
```

Или без отдельной функции:

```python
even_numbers = [number for number in numbers if number % 2 == 0]
```

List comprehension часто проще читать, если условие короткое. `filter()` полезен, когда уже существует понятная именованная функция-предикат или нужен ленивый результат.

## `filter(None, iterable)` {#filter-none-iterable}

Если вместо функции передать `None`, останутся только truthy-значения.

```python
values = [0, 1, "", "Python", None, False, True]
result = list(filter(None, values))

print(result)
# [1, 'Python', True]
```

Будь осторожен: вместе с `None` удалятся также `0`, пустая строка и `False`.

Если нужно убрать только `None`, условие должно быть явным:

```python
result = [value for value in values if value is not None]
```

## Фильтрация и сортировка вместе {#filtratsiya-i-sortirovka-vmeste}

Сначала можно отфильтровать данные, затем отсортировать результат.

```python
adults_by_age = sorted(
    filter(is_adult, people),
    key=sort_by_age,
)
```

Порядок выполнения:

```text
people -> filter(is_adult, ...) -> только взрослые -> sorted(...)
```

`sorted()` принимает любой итерируемый объект, поэтому промежуточный вызов `list()` не нужен.

## Частые ошибки {#chastye-oshibki}

1. Ожидать, что `sorted()` изменит исходный список.
   Решение: сохранить возвращаемый список или использовать `.sort()`.

2. Присвоить результат `.sort()` переменной.
   Результат: переменная получит `None`.
   Решение: вызвать `.sort()` отдельно или использовать `sorted()`.

3. Вызвать функцию при передаче в `key` или `filter`.
   Решение: передавать `key=sort_by_age` и `filter(is_even, numbers)` без `()`.

4. Сортировать несовместимые типы.
   Результат: например, сравнение `int` и `str` вызовет `TypeError`.
   Решение: хранить однородные данные или вернуть общий тип из `key`.

5. Ожидать список от `filter()`.
   Решение: использовать `list(...)`, если результат нужен сразу целиком.

6. Повторно использовать исчерпанный объект `filter`.
   Решение: создать фильтр заново или один раз сохранить результат в списке.

## Практические задачи {#prakticheskie-zadachi}

### Задача 1 {#zadacha-1}

Отсортируй слова сначала по длине, затем по алфавиту.

```python
words = ["pear", "banana", "apple", "fig", "kiwi"]
result = sorted(words, key=lambda word: (len(word), word))
```

### Задача 2 {#zadacha-2}

Оставь только положительные числа и отсортируй их по убыванию.

```python
numbers = [3, -2, 0, 10, -5, 7]

positive_numbers = sorted(
    filter(lambda number: number > 0, numbers),
    reverse=True,
)

print(positive_numbers)  # [10, 7, 3]
```

## Краткая шпаргалка {#kratkaya-shpargalka}

```python
# Новый отсортированный список
sorted_items = sorted(items)

# По убыванию
sorted_items = sorted(items, reverse=True)

# По вычисляемому ключу
sorted_items = sorted(items, key=key_function)

# По нескольким полям
sorted_items = sorted(items, key=lambda item: (item["age"], item["name"]))

# Ленивый фильтр
filtered_items = filter(predicate, items)

# Готовый список
filtered_items = list(filter(predicate, items))
```

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python: sorted()', href: 'https://docs.python.org/3/library/functions.html#sorted' },
        { title: 'Python: Sorting HOW TO', href: 'https://docs.python.org/3/howto/sorting.html' },
        { title: 'Python: filter()', href: 'https://docs.python.org/3/library/functions.html#filter' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Comprehensions', href: '/python/yazyk-python/1-core/comprehensions-v-python' },
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python' },
        { title: 'For и range', href: '/python/yazyk-python/1-core/tsikly-for-i-range' },
        { title: 'Множества set', href: '/python/yazyk-python/tipy-dannykh/mnozhestva-set' },
    ]"
/>
