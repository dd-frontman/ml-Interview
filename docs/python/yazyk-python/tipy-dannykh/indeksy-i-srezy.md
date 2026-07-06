---
title: "Индексы и срезы"
description: "Краткий конспект по индексам и срезам в Python: доступ к элементам, отрицательные индексы, изменение списка, start:stop:step и разворот последовательностей."
tags:
  - "python"
  - "core"
  - "data-types"
  - "list"
updatedAt: "2026-07-02"
search: false
---
## Индексы

Индекс - это номер элемента в последовательности.

В Python индексация начинается с `0`.

```python
fruits = ["apple", "banana", "cherry", "watermelon"]

print(fruits[0])  # apple
print(fruits[3])  # watermelon
```

Первый элемент имеет индекс `0`, второй - `1`, третий - `2`.

## Отрицательные индексы

Отрицательный индекс считает элементы с конца.

```python
fruits = ["apple", "banana", "cherry", "watermelon"]

print(fruits[-1])  # watermelon
print(fruits[-2])  # cherry
print(fruits[-4])  # apple
```

`-1` - последний элемент, `-2` - предпоследний.

Если выйти за границы списка, будет ошибка `IndexError`.

```python
fruits = ["apple", "banana", "cherry", "watermelon"]

print(fruits[4])   # IndexError
print(fruits[-5])  # IndexError
```

Для списка из четырех элементов допустимы индексы от `0` до `3` и от `-1` до `-4`.

## Изменение элемента по индексу

Список изменяемый, поэтому элемент можно заменить по индексу.

```python
fruits = ["apple", "banana", "cherry", "watermelon"]
fruits[0] = "pineapple"

print(fruits)  # ["pineapple", "banana", "cherry", "watermelon"]
```

Так меняется исходный список.

## Обмен элементов местами

В Python можно поменять элементы местами через множественное присваивание.

```python
fruits = ["apple", "banana", "cherry", "watermelon"]
fruits[0], fruits[3] = fruits[3], fruits[0]

print(fruits)  # ["watermelon", "banana", "cherry", "apple"]
```

Сначала Python вычисляет правую часть, а потом присваивает значения в левую часть.

## Срезы

Срез позволяет получить часть последовательности.

Общий синтаксис:

```python
sequence[start:stop:step]
```

Где:

- `start` - индекс, с которого начинаем;
- `stop` - индекс, на котором останавливаемся, сам `stop` не входит в результат;
- `step` - шаг.

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

print(numbers[0:5])  # [0, 1, 2, 3, 4]
```

Элемент с индексом `5` не попадает в результат.

## Пропуск `start` и `stop`

Если не указать `start`, срез начнется с начала.

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

print(numbers[:5])  # [0, 1, 2, 3, 4]
```

Если не указать `stop`, срез дойдет до конца.

```python
print(numbers[5:])  # [5, 6, 7, 8, 9]
```

Если не указать оба значения, получится копия всей последовательности.

```python
print(numbers[:])  # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

Для списков `numbers[:]` создает новый список с теми же элементами.

## Шаг в срезах

Третий параметр задает шаг.

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

print(numbers[0:10:2])  # [0, 2, 4, 6, 8]
print(numbers[::2])     # [0, 2, 4, 6, 8]
```

`numbers[::2]` означает: пройти по всей последовательности с шагом `2`.

## Пустой срез

Если направление среза не совпадает с шагом, результат будет пустым.

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

print(numbers[3:2])  # []
```

По умолчанию шаг положительный, поэтому Python идет слева направо. От индекса `3` к индексу `2` так пройти нельзя.

## Срез за границами списка

Срезы не падают с `IndexError`, если `stop` выходит за границы.

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

print(numbers[0:20])  # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

Python просто вернет все доступные элементы в указанном диапазоне.

## Отрицательные индексы в срезах

Отрицательные индексы можно использовать и в срезах.

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

print(numbers[-5:-1])  # [5, 6, 7, 8]
```

`-5` указывает на элемент `5`, а `-1` указывает на последний элемент `9`. Но `stop` не включается, поэтому `9` не попадает в результат.

## Разворот через срез

Срез с шагом `-1` возвращает последовательность в обратном порядке.

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

new_numbers = numbers[::-1]

print(new_numbers)  # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
print(numbers)      # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

Такой способ создает новый список и не меняет исходный.

## `reverse()`

Метод `reverse()` переворачивает список на месте.

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
numbers.reverse()

print(numbers)  # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```

Важно: `reverse()` возвращает `None`.

```python
numbers = [1, 2, 3, 4, 5]
numbers2 = numbers.reverse()

print(numbers)   # [5, 4, 3, 2, 1]
print(numbers2)  # None
```

Если нужен новый перевернутый список, используй `numbers[::-1]` или `list(reversed(numbers))`.

## `reversed()`

Функция `reversed()` возвращает итератор, а не список.

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

new_numbers = reversed(numbers)

print(type(new_numbers))  # <class 'list_reverseiterator'>
```

Чтобы получить список, нужно обернуть результат в `list()`.

```python
new_numbers = list(reversed(numbers))

print(new_numbers)  # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```

`reversed(numbers)` не меняет исходный список.

## Срезы строк

Срезы работают не только со списками, но и со строками.

```python
text = "Hello, world!"

print(text[0:5])   # Hello
print(text[7:])    # world!
print(text[::2])   # Hlo ol!
print(text[::-1])  # !dlrow ,olleH
```

Строка неизменяемая, поэтому срез строки всегда возвращает новую строку.

## Частые ошибки

1. Думать, что `stop` входит в срез.
   В `numbers[0:5]` элемент с индексом `5` не входит в результат.

2. Пытаться получить элемент по индексу за границами списка.
   `fruits[4]` для списка из четырех элементов вызовет `IndexError`.

3. Ожидать `IndexError` от среза за границами.
   `numbers[0:20]` не падает, а возвращает все доступные элементы.

4. Сохранять результат `reverse()` в переменную.
   `numbers.reverse()` меняет список на месте и возвращает `None`.

5. Забывать преобразовать `reversed()` в список.
   `reversed(numbers)` возвращает итератор, поэтому для списка нужен `list(reversed(numbers))`.

## Cheat-sheet

| Операция | Что делает |
| --- | --- |
| `xs[0]` | Первый элемент |
| `xs[-1]` | Последний элемент |
| `xs[start:stop]` | Срез от `start` до `stop`, `stop` не включается |
| `xs[:stop]` | Срез от начала до `stop` |
| `xs[start:]` | Срез от `start` до конца |
| `xs[:]` | Копия всей последовательности |
| `xs[::2]` | Каждый второй элемент |
| `xs[::-1]` | Новая последовательность в обратном порядке |
| `xs.reverse()` | Переворачивает список на месте и возвращает `None` |
| `list(reversed(xs))` | Создает новый перевернутый список |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Lists', href: 'https://docs.python.org/3/tutorial/introduction.html#lists' },
        { title: 'Python Tutorial: More on Lists', href: 'https://docs.python.org/3/tutorial/datastructures.html#more-on-lists' },
        { title: 'Python Built-in Types: Sequence Types', href: 'https://docs.python.org/3/library/stdtypes.html#sequence-types-list-tuple-range' },
        { title: 'Python Built-in Functions: reversed', href: 'https://docs.python.org/3/library/functions.html#reversed' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Списки: базовые операции', href: '/python/yazyk-python/tipy-dannykh/spiski-bazovye-operatsii' },
        { title: 'Циклы for и range', href: '/python/yazyk-python/1-core/tsikly-for-i-range' },
        { title: 'Операции со строками', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami' },
        { title: 'Изменяемые типы', href: '/python/yazyk-python/tipy-dannykh/izmenyaemye-tipy' },
    ]"
/>
