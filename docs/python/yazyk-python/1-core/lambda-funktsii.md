---
title: "Lambda-функции"
description: "Конспект по lambda-функциям в Python: синтаксис, неявный return, сортировка и фильтрация, составные ключи, замыкания и частые ошибки."
tags:
  - "python"
  - "core"
  - "functions"
  - "lambda"
updatedAt: "2026-08-16"
---
## Что такое `lambda` {#chto-takoe-lambda}

`lambda` создает короткую функцию без объявления через `def`. У такой функции нет собственного имени, поэтому ее также называют анонимной.

```python
lambda arguments: expression
```

В этой записи:

- `lambda` начинает объявление функции;
- `arguments` - параметры функции;
- после `:` находится выражение, результат которого функция вернет.

Простой пример:

```python
get_length = lambda word: len(word)

print(get_length("Python"))  # 6
```

Эта `lambda` выполняет то же действие, что и обычная функция:

```python
def get_length(word):
    return len(word)
```

## Почему в `lambda` нет `return` {#pochemu-v-lambda-net-return}

Результат выражения после двоеточия возвращается автоматически.

```python
multiply = lambda first, second: first * second

result = multiply(4, 5)
print(result)  # 20
```

Запись эквивалентна функции:

```python
def multiply(first, second):
    return first * second
```

Писать `return` внутри `lambda` нельзя:

```python
# SyntaxError
lambda number: return number * 2
```

## Количество параметров {#kolichestvo-parametrov}

У `lambda` может быть любое количество параметров.

```python
square = lambda number: number ** 2
add = lambda first, second: first + second
calculate_price = lambda price, quantity, discount: price * quantity * (1 - discount)

print(square(4))                       # 16
print(add(10, 5))                      # 15
print(calculate_price(100, 3, 0.1))   # 270.0
```

Можно создать функцию без параметров:

```python
get_message = lambda: "Hello!"

print(get_message())  # Hello!
```

Поддерживаются и параметры со значениями по умолчанию:

```python
power = lambda number, exponent=2: number ** exponent

print(power(5))     # 25
print(power(5, 3))  # 125
```

## Одно выражение, а не одна операция {#odno-vyrazhenie-a-ne-odna-operatsiya}

Тело `lambda` должно состоять из одного выражения. Выражение вычисляет значение.

Допустимы арифметика, вызовы функций, обращение к коллекциям и условное выражение:

```python
get_status = lambda age: "adult" if age >= 18 else "minor"

print(get_status(20))  # adult
print(get_status(15))  # minor
```

Обычные инструкции использовать нельзя:

- `return`;
- `for` и `while` как отдельные циклы;
- `try`/`except`;
- присваивание через `=`;
- несколько последовательных инструкций.

Если логике нужны проверки, цикл или несколько действий, используй `def`.

```python
def normalize_name(name):
    cleaned_name = name.strip()

    if not cleaned_name:
        return "Unknown"

    return cleaned_name.title()
```

## Главное применение: функция как аргумент {#glavnoe-primenenie-funktsiya-kak-argument}

Чаще всего `lambda` не сохраняют в переменную. Ее передают другой функции там, где нужна короткая одноразовая операция.

```python
fruits = ["banana", "apple", "cherry", "date"]
sorted_fruits = sorted(fruits, key=lambda fruit: len(fruit))

print(sorted_fruits)
# ['date', 'apple', 'banana', 'cherry']
```

`sorted()` вызывает `lambda` для каждого элемента:

```text
"banana" -> 6
"apple"  -> 5
"cherry" -> 6
"date"   -> 4
```

Полученные числа используются для сравнения, но в итоговый список попадают исходные строки.

## Сортировка по нескольким условиям {#sortirovka-po-neskolkim-usloviyam}

Чтобы задать несколько критериев, `lambda` может вернуть кортеж. Python сравнивает элементы кортежа слева направо.

```python
people = ["Bob", "Alice", "Charlie", "Diana"]

sorted_people = sorted(
    people,
    key=lambda person: (len(person), person),
)

print(sorted_people)
# ['Bob', 'Alice', 'Diana', 'Charlie']
```

Сначала слова сортируются по длине. Если длина совпала, сравниваются сами строки по алфавиту.

Для сортировки без учета регистра:

```python
words = ["banana", "Apple", "cherry", "apricot"]
result = sorted(words, key=lambda word: (len(word), word.lower()))
```

## `lambda` с `min()` и `max()` {#lambda-s-min-i-max}

Аргумент `key` поддерживают также `min()` и `max()`.

```python
fruits = ["apple", "banana", "cherry", "date"]

longest_word = max(fruits, key=lambda fruit: len(fruit))
shortest_word = min(fruits, key=lambda fruit: len(fruit))

print(longest_word)   # banana
print(shortest_word)  # date
```

Функции возвращают исходный элемент, а не значение ключа. Поэтому `max(...)` вернет строку `"banana"`, а не число `6`.

Составной ключ работает так же:

```python
people = [
    {"name": "Alice", "age": 25},
    {"name": "Charlie", "age": 20},
    {"name": "Bob", "age": 20},
]

youngest_person = min(
    people,
    key=lambda person: (person["age"], person["name"]),
)

print(youngest_person)
# {'name': 'Bob', 'age': 20}
```

Сначала выбирается минимальный возраст. При одинаковом возрасте выбирается имя, которое стоит раньше по алфавиту.

## `lambda` с `filter()` {#lambda-s-filter}

`filter()` оставляет элементы, для которых функция вернула truthy-значение.

```python
numbers = [-3, 0, 4, -1, 8, 2]

positive_numbers = list(
    filter(lambda number: number > 0, numbers)
)

print(positive_numbers)  # [4, 8, 2]
```

Для простого условия list comprehension обычно читается легче:

```python
positive_numbers = [number for number in numbers if number > 0]
```

## `lambda` с `map()` {#lambda-s-map}

`map()` применяет функцию к каждому элементу и возвращает ленивый объект `map`.

```python
numbers = [1, 2, 3, 4]

squares = list(map(lambda number: number ** 2, numbers))

print(squares)  # [1, 4, 9, 16]
```

Этот пример также можно записать через list comprehension:

```python
squares = [number ** 2 for number in numbers]
```

Для простого преобразования comprehension часто понятнее. `map()` удобен, если уже есть готовая именованная функция.

## Переменные из внешней области видимости {#peremennye-iz-vneshney-oblasti-vidimosti}

`lambda`, как и обычная функция, видит переменные из внешней области.

```python
multiplier = 10
multiply = lambda number: number * multiplier

print(multiply(5))  # 50
```

Значение внешней переменной ищется в момент вызова функции:

```python
multiplier = 10
multiply = lambda number: number * multiplier

multiplier = 3

print(multiply(5))  # 15
```

Такое поведение называется поздним связыванием. Оно особенно важно при создании функций в цикле.

```python
functions = []

for number in range(3):
    functions.append(lambda: number)

print([function() for function in functions])
# [2, 2, 2]
```

Все функции обращаются к одной переменной `number`. После цикла она равна `2`.

Чтобы сохранить текущее значение каждой итерации, его можно передать в параметр по умолчанию:

```python
functions = []

for number in range(3):
    functions.append(lambda number=number: number)

print([function() for function in functions])
# [0, 1, 2]
```

## Сохранять `lambda` в переменную или использовать `def` {#sokhranyat-lambda-v-peremennuyu-ili-ispolzovat-def}

Технически `lambda` можно присвоить переменной:

```python
is_even = lambda number: number % 2 == 0
```

Но для функции с постоянным именем предпочтительнее `def`:

```python
def is_even(number):
    return number % 2 == 0
```

У именованной функции понятнее сообщения об ошибках, документация и назначение. `lambda` лучше использовать непосредственно в месте вызова:

```python
even_numbers = list(filter(lambda number: number % 2 == 0, numbers))
```

## Когда использовать `lambda` {#kogda-ispolzovat-lambda}

Используй `lambda`, если одновременно выполняются условия:

- функция нужна один раз;
- логика помещается в одно короткое выражение;
- смысл выражения понятен без отдельного имени;
- `lambda` передается в `key`, `filter()`, `map()` или похожую функцию.

Используй `def`, если:

- функцию вызывают в нескольких местах;
- нужны несколько действий или ранний `return`;
- нужна документационная строка и аннотации типов;
- выражение трудно понять с первого взгляда;
- функции полезно дать предметное имя.

## Частые ошибки {#chastye-oshibki}

1. Писать `return` после двоеточия.
   Решение: оставить только возвращаемое выражение.

2. Пытаться поместить несколько инструкций в одну `lambda`.
   Решение: объявить обычную функцию через `def`.

3. Вызывать `lambda` при передаче в `key`.
   Решение: передать саму функцию: `key=lambda item: item["age"]`.

4. Присваивать результат `.sort()` переменной.
   Проблема не в `lambda`: метод `.sort()` изменяет список и возвращает `None`.
   Решение: использовать `sorted(items, key=...)` или вызвать `items.sort(...)` отдельно.

5. Создавать непонятную длинную `lambda`.
   Решение: вынести вычисление в именованную `def`-функцию.

6. Не учитывать позднее связывание переменных в цикле.
   Решение: при необходимости зафиксировать значение параметром по умолчанию.

## Практические задачи {#prakticheskie-zadachi}

### Задача 1 {#zadacha-1}

Отсортируй числа по их абсолютному значению.

```python
numbers = [-10, 3, -2, 8, 1]
```

Ожидаемый результат:

```python
[1, -2, 3, 8, -10]
```

### Задача 2 {#zadacha-2}

Из списка словарей выбери товар с максимальной ценой, используя `max()` и `lambda`.

```python
products = [
    {"name": "Keyboard", "price": 5000},
    {"name": "Mouse", "price": 2500},
    {"name": "Monitor", "price": 30000},
]
```

### Задача 3 {#zadacha-3}

Отсортируй людей сначала по возрасту, затем по имени.

```python
people = [
    {"name": "Alice", "age": 25},
    {"name": "Charlie", "age": 20},
    {"name": "Bob", "age": 20},
]
```

### Задача 4 {#zadacha-4}

Оставь только строки длиной не меньше пяти символов, используя `filter()` и `lambda`.

```python
words = ["cat", "python", "code", "lambda", "web"]
```

## Краткая шпаргалка {#kratkaya-shpargalka}

```python
# Один параметр
lambda value: value * 2

# Несколько параметров
lambda first, second: first + second

# Условное выражение
lambda number: "even" if number % 2 == 0 else "odd"

# Ключ сортировки
sorted(words, key=lambda word: len(word))

# Составной ключ
sorted(people, key=lambda person: (person["age"], person["name"]))

# Минимальный и максимальный элементы по ключу
min(items, key=lambda item: item["price"])
max(items, key=lambda item: item["price"])

# Фильтрация
list(filter(lambda number: number > 0, numbers))

# Преобразование
list(map(lambda number: number ** 2, numbers))
```

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Lambda expressions', href: 'https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions' },
        { title: 'Python Reference: Lambdas', href: 'https://docs.python.org/3/reference/expressions.html#lambdas' },
        { title: 'Python: Sorting HOW TO', href: 'https://docs.python.org/3/howto/sorting.html' },
        { title: 'PEP 8: Programming recommendations', href: 'https://peps.python.org/pep-0008/#programming-recommendations' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python' },
        { title: 'Sorted и filter', href: '/python/yazyk-python/1-core/sorted-i-filter' },
        { title: 'Comprehensions', href: '/python/yazyk-python/1-core/comprehensions-v-python' },
        { title: 'Область видимости переменных', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh' },
    ]"
/>
