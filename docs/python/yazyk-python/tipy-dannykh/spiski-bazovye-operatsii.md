---
title: "Списки: базовые операции"
description: "Краткий конспект по спискам Python: создание, append, pop, extend, reverse, sort, len, in, bool, split, join, sum, min, max и сравнение списков."
tags:
  - "python"
  - "core"
  - "data-types"
  - "list"
updatedAt: "2026-06-28"
search: false
---
## Что такое список

`list` - это изменяемая упорядоченная коллекция.

```python
fruits = ["apple", "banana", "cherry"]
print(fruits)
```

Список хранит элементы в порядке добавления. Порядок важен при сравнении, индексации и сортировке.

## Создание списка

Список можно создать через литерал `[]`.

```python
fruits = ["apple", "banana", "cherry"]
```

Пустой список можно создать через `list()`.

```python
my_list = list()
print(my_list)  # []
```

Список может хранить разные типы данных.

```python
my_list = [1, "apple", True, 1.5, [1, 2, 3]]
print(my_list)
```

В реальном коде лучше не смешивать разные типы без необходимости: такой список сложнее обрабатывать.

## `append()`

`append()` добавляет один элемент в конец списка.

```python
fruits = ["apple", "banana", "cherry"]
fruits.append("watermelon")

print(fruits)  # ["apple", "banana", "cherry", "watermelon"]
```

Метод меняет исходный список.

## `pop()`

`pop()` удаляет элемент и возвращает его.

Без аргумента удаляется последний элемент.

```python
fruits = ["apple", "banana", "cherry"]
fruit = fruits.pop()

print(fruit)   # cherry
print(fruits)  # ["apple", "banana"]
```

Если нужно удалить конкретную позицию, можно передать индекс.

```python
fruits = ["apple", "banana", "cherry"]
fruit = fruits.pop(1)

print(fruit)   # banana
print(fruits)  # ["apple", "cherry"]
```

## `extend()`

`extend()` добавляет в список все элементы из другой коллекции.

```python
fruits = ["apple", "banana", "cherry"]
fruits2 = ["fig", "grape"]

fruits.extend(fruits2)
print(fruits)  # ["apple", "banana", "cherry", "fig", "grape"]
```

Разница:

- `append(x)` добавляет `x` как один элемент;
- `extend(xs)` добавляет элементы из `xs` по одному.

## `reverse()`

`reverse()` переворачивает список на месте.

```python
fruits = ["apple", "banana", "cherry"]
fruits.reverse()

print(fruits)  # ["cherry", "banana", "apple"]
```

Метод не создает новый список.

## `sort()`

`sort()` сортирует список на месте.

```python
my_list = [5, 4, 8, 10, 1, 2, 14, 4]
my_list.sort()

print(my_list)  # [1, 2, 4, 4, 5, 8, 10, 14]
```

Для сортировки по убыванию используется `reverse=True`.

```python
my_list.sort(reverse=True)
print(my_list)  # [14, 10, 8, 5, 4, 4, 2, 1]
```

## `len()`, `max()`, `min()`, `sum()`

`len()` возвращает количество элементов.

```python
fruits = ["apple", "banana", "cherry"]
print(len(fruits))  # 3
```

Для числовых списков можно использовать `max()`, `min()` и `sum()`.

```python
my_list = [5, 4, 8, 10, 1, 2, 14, 4]

print(max(my_list))  # 14
print(min(my_list))  # 1
print(sum(my_list))  # 48
```

Если в списке смешаны числа и строки, `sum()` упадет.

```python
my_list = [5, 4, 8, 10, 1, 2, 14, "word"]
print(sum(my_list))  # TypeError
```

Python не может сложить `int` и `str`.

## `split()` и `join()`

`split()` превращает строку в список.

```python
my_string = "My name is Alex"
my_list = my_string.split(" ")

print(my_list)  # ["My", "name", "is", "Alex"]
```

`join()` превращает список строк в строку.

```python
my_list = ["My", "name", "is", "Alex"]
joined_string = " ".join(my_list)

print(joined_string)  # My name is Alex
```

Важно: `join()` работает со списком строк. Если внутри есть числа, их нужно сначала привести к `str`.

## Список из строки

`list()` может превратить строку в список символов.

```python
word = "Hello"
my_list = list(word)

print(my_list)  # ["H", "e", "l", "l", "o"]
```

## Сложение списков

Списки можно объединять через `+`.

```python
list_1 = [1, 2, 3]
list_2 = [4, 5, 6]
list_3 = list_1 + list_2

print(list_3)  # [1, 2, 3, 4, 5, 6]
```

Оператор `+` создает новый список.

## Сравнение списков

Списки сравниваются по значениям и порядку элементов.

```python
list_1 = [1, 2, 3]
list_2 = [1, 3, 2]
list_3 = [1, 2, 3]

print(list_1 == list_2)  # False
print(list_1 == list_3)  # True
```

`[1, 2, 3]` и `[1, 3, 2]` не равны, потому что порядок отличается.

## `bool()` и `in`

Пустой список - `False`.

```python
print(bool([]))   # False
print(bool([0]))  # True
```

Непустой список - `True`, даже если внутри лежит `0`.

Оператор `in` проверяет, есть ли элемент в списке.

```python
my_list = ["apple", "banana", "cherry"]

print("banana" in my_list)      # True
print("watermelon" in my_list)  # False
```

## Строки и списки: главное отличие

Список изменяемый.

```python
fruits = ["apple", "banana", "cherry"]
fruits.append("watermelon")

print(fruits)
```

Строка неизменяемая: метод `replace()` возвращает новую строку, а исходная не меняется.

```python
my_string = "Hello, world!"
new_string = my_string.replace("world", "Python")

print(my_string)   # Hello, world!
print(new_string)  # Hello, Python!
```

## Типичные ошибки

1. Ожидать, что `pop()` вернет элемент, которого нет в списке.
   Если список `["apple", "banana", "cherry"]`, то `pop()` вернет `"cherry"`.

2. Думать, что `extend()` добавляет предыдущие изменения из другого примера.
   Каждый пример начинается с нового списка, поэтому `watermelon` появится только после `append("watermelon")`.

3. Использовать `sum()` для списка, где смешаны числа и строки.
   Такой список нужно сначала очистить или привести элементы к совместимым типам.

4. Путать `append()` и `extend()`.
   `append(["fig", "grape"])` добавит вложенный список, а `extend(["fig", "grape"])` добавит две строки.

## Cheat-sheet

| Операция | Что делает |
| --- | --- |
| `list()` | Создает пустой список или список из iterable |
| `append(x)` | Добавляет один элемент в конец |
| `pop()` | Удаляет и возвращает последний элемент |
| `extend(xs)` | Добавляет все элементы из `xs` |
| `reverse()` | Переворачивает список на месте |
| `sort()` | Сортирует список на месте |
| `len(xs)` | Возвращает количество элементов |
| `x in xs` | Проверяет наличие элемента |
| `split()` | Делит строку на список |
| `join()` | Склеивает список строк |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: More on Lists', href: 'https://docs.python.org/3/tutorial/datastructures.html#more-on-lists' },
        { title: 'Python Built-in Types: list', href: 'https://docs.python.org/3/library/stdtypes.html#lists' },
        { title: 'Python Built-in Functions', href: 'https://docs.python.org/3/library/functions.html' },
        { title: 'Python Text Sequence Type: str', href: 'https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Изменяемые типы', href: '/python/yazyk-python/tipy-dannykh/izmenyaemye-tipy' },
        { title: 'Методы типов данных', href: '/python/yazyk-python/tipy-dannykh/metody-tipov-dannykh' },
        { title: 'Операции со строками', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami' },
        { title: 'Типы главная', href: '/python/yazyk-python/tipy-dannykh/tipy-glavnaya' },
    ]"
/>
