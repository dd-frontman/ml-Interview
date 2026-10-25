---
title: "Множества set в Python"
description: "Конспект по множествам set в Python: уникальные элементы, создание, добавление и удаление, операции над множествами, отсутствие индексов и частые ошибки."
tags:
  - "python"
  - "core"
  - "data-types"
  - "set"
updatedAt: "2026-08-04"
---
## Что такое `set` {#chto-takoe-set}

`set` - изменяемая коллекция уникальных хешируемых элементов.

```python
numbers = {1, 2, 3, 4, 5}

print(type(numbers))  # <class 'set'>
print(numbers)        # {1, 2, 3, 4, 5}
```

Главные свойства множества:

- каждый элемент хранится только один раз;
- порядок элементов не гарантирован;
- индексы и срезы не поддерживаются;
- само множество можно изменять;
- элементы множества должны быть хешируемыми.

`set` удобно использовать для удаления повторов, быстрой проверки наличия элемента и математических операций над наборами значений.

## Создание множества {#sozdanie-mnozhestva}

Множество с элементами можно создать через фигурные скобки.

```python
fruits = {"apple", "banana", "orange"}
```

Пустое множество создается только через `set()`:

```python
empty_set = set()

print(type(empty_set))  # <class 'set'>
```

Пустые фигурные скобки создают словарь, а не множество:

```python
value = {}

print(type(value))  # <class 'dict'>
```

В `set()` можно передать любую итерируемую коллекцию.

```python
numbers = set([1, 2, 2, 3, 3, 3])

print(numbers)  # {1, 2, 3}
```

## Уникальность элементов {#unikalnost-elementov}

Повторные значения автоматически удаляются.

```python
numbers = {1, 1, 2, 2, 3, 3}

print(numbers)  # {1, 2, 3}
```

Добавление уже существующего значения ничего не меняет.

```python
numbers = {1, 2, 3}
numbers.add(2)

print(numbers)  # {1, 2, 3}
```

Множество сравнивается по составу элементов, а не по порядку.

```python
print({1, 2, 3} == {3, 2, 1})  # True
```

## Почему у `set` нет индексов {#pochemu-u-set-net-indeksov}

У списка порядок является частью структуры: у каждого элемента есть определенная позиция.

```python
fruits = ["apple", "banana", "orange"]
print(fruits[0])  # apple
```

Множество хранит только принадлежность элементов набору. Оно не обещает, какой элемент будет первым или последним.

Поэтому такой код вызывает ошибку:

```python
fruits = {"apple", "banana", "orange"}
print(fruits[0])
# TypeError: 'set' object is not subscriptable
```

Порядок при выводе может отличаться между запусками программы. Нельзя строить логику на том, как `set` напечатался в консоли.

## Как получить элемент {#kak-poluchit-element}

Если подходит любой элемент, используй итератор:

```python
fruits = {"apple", "banana", "orange"}

fruit = next(iter(fruits))
print(fruit)
```

Для пустого множества можно указать значение по умолчанию:

```python
fruit = next(iter(fruits), None)
```

Если нужен предсказуемый первый элемент, данные необходимо упорядочить:

```python
fruit = sorted(fruits)[0]

print(fruit)  # apple
```

`sorted()` возвращает новый список. Элементы должны поддерживать сравнение друг с другом.

Для обработки всех элементов используй цикл:

```python
for fruit in fruits:
    print(fruit)
```

Метод `pop()` тоже возвращает произвольный элемент, но одновременно удаляет его:

```python
fruit = fruits.pop()
```

Поэтому `pop()` не следует использовать только ради просмотра элемента.

## Добавление элементов {#dobavlenie-elementov}

`add()` добавляет один элемент.

```python
numbers = {1, 2, 3}
numbers.add(4)

print(numbers)  # {1, 2, 3, 4}
```

`update()` добавляет элементы из итерируемого объекта.

```python
numbers.update([3, 4, 5])

print(numbers)  # {1, 2, 3, 4, 5}
```

Строка тоже является итерируемым объектом, поэтому ее символы добавятся отдельно:

```python
letters = set()
letters.update("hello")

print(letters)  # {'h', 'e', 'l', 'o'} в произвольном порядке
```

## Удаление элементов {#udalenie-elementov}

`remove()` удаляет элемент и вызывает `KeyError`, если его нет.

```python
numbers = {1, 2, 3}
numbers.remove(2)
```

`discard()` ничего не делает, если элемент отсутствует.

```python
numbers.discard(10)
```

`clear()` удаляет все элементы.

```python
numbers.clear()
print(numbers)  # set()
```

Используй `remove()`, когда отсутствие элемента считается ошибкой, и `discard()`, когда оно допустимо.

## Проверка наличия {#proverka-nalichiya}

Оператор `in` проверяет, входит ли значение в множество.

```python
allowed_roles = {"admin", "editor", "viewer"}

print("admin" in allowed_roles)  # True
print("guest" in allowed_roles)  # False
```

Проверка принадлежности - одна из основных задач `set`. В среднем она выполняется быстрее, чем поиск в длинном списке.

## Операции над множествами {#operatsii-nad-mnozhestvami}

```python
set_1 = {1, 2, 3, 4}
set_2 = {3, 4, 5, 6}
```

Объединение содержит элементы обоих множеств без повторов:

```python
print(set_1.union(set_2))  # {1, 2, 3, 4, 5, 6}
print(set_1 | set_2)       # {1, 2, 3, 4, 5, 6}
```

Пересечение оставляет общие элементы:

```python
print(set_1.intersection(set_2))  # {3, 4}
print(set_1 & set_2)              # {3, 4}
```

Разность оставляет элементы первого множества, которых нет во втором:

```python
print(set_1.difference(set_2))  # {1, 2}
print(set_1 - set_2)            # {1, 2}
print(set_2 - set_1)            # {5, 6}
```

Симметрическая разность оставляет элементы, присутствующие только в одном множестве:

```python
print(set_1.symmetric_difference(set_2))  # {1, 2, 5, 6}
print(set_1 ^ set_2)                      # {1, 2, 5, 6}
```

Эти операции создают новое множество. Исходные множества не изменяются.

## Подмножество и надмножество {#podmnozhestvo-i-nadmnozhestvo}

```python
required = {"Python", "SQL"}
candidate = {"Python", "SQL", "Docker"}

print(required.issubset(candidate))    # True
print(candidate.issuperset(required))  # True
print(required <= candidate)           # True
print(candidate >= required)           # True
```

Так можно проверить, содержит ли один набор все обязательные значения другого.

## Удаление повторов из списка {#udalenie-povtorov-iz-spiska}

```python
numbers = [1, 2, 2, 3, 4, 4, 4, 5]
unique_numbers = list(set(numbers))

print(unique_numbers)
```

Повторы исчезнут, но исходный порядок может потеряться.

Если порядок нужно сохранить, для хешируемых элементов можно использовать словарь:

```python
unique_numbers = list(dict.fromkeys(numbers))

print(unique_numbers)  # [1, 2, 3, 4, 5]
```

## Set comprehension {#set-comprehension}

Множество можно создать через comprehension.

```python
squares = {x ** 2 for x in range(10)}
```

Фильтрация записывается после `for`:

```python
even_squares = {x ** 2 for x in range(10) if x % 2 == 0}

print(even_squares)  # {0, 4, 16, 36, 64}
```

Если выражение несколько раз дает одинаковый результат, в итоговом множестве он останется один раз.

## Какие элементы можно хранить {#kakie-elementy-mozhno-khranit}

Элементы `set` должны быть хешируемыми. Обычно это неизменяемые объекты:

```python
values = {
    10,
    3.14,
    "Python",
    (1, 2),
    frozenset({3, 4}),
}
```

Список, словарь или обычное множество добавить нельзя:

```python
values = {[1, 2]}  # TypeError: unhashable type: 'list'
```

Если нужна последовательность внутри множества, список можно заменить кортежем:

```python
coordinates = {(10, 20), (30, 40)}
```

## Частые ошибки {#chastye-oshibki}

1. Создавать пустое множество через `{}`.
   Результат: создается `dict`.
   Решение: использовать `set()`.

2. Обращаться по индексу `my_set[0]`.
   Результат: `TypeError`.
   Решение: использовать цикл, `next(iter(...))` или отсортировать данные.

3. Полагаться на порядок вывода.
   Результат: поведение может отличаться между запусками.
   Решение: использовать `list` или `sorted()`, если порядок важен.

4. Добавлять изменяемый объект.
   Результат: `TypeError: unhashable type`.
   Решение: использовать `tuple` или `frozenset`.

5. Удалять отсутствующий элемент через `remove()`.
   Результат: `KeyError`.
   Решение: использовать `discard()`, если отсутствие допустимо.

## Краткая шпаргалка {#kratkaya-shpargalka}

| Операция | Метод или оператор |
| --- | --- |
| Создать пустое множество | `set()` |
| Добавить один элемент | `items.add(value)` |
| Добавить несколько | `items.update(values)` |
| Удалить с ошибкой при отсутствии | `items.remove(value)` |
| Удалить без ошибки | `items.discard(value)` |
| Проверить наличие | `value in items` |
| Объединение | `a \| b` |
| Пересечение | `a & b` |
| Разность | `a - b` |
| Симметрическая разность | `a ^ b` |
| Любой элемент без удаления | `next(iter(items), None)` |
| Упорядоченный результат | `sorted(items)` |

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Sets', href: 'https://docs.python.org/3/tutorial/datastructures.html#sets' },
        { title: 'Python: Set types', href: 'https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset' },
        { title: 'Python: Set displays', href: 'https://docs.python.org/3/reference/expressions.html#set-displays' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Изменяемые типы', href: '/python/yazyk-python/tipy-dannykh/izmenyaemye-tipy' },
        { title: 'Методы типов данных', href: '/python/yazyk-python/tipy-dannykh/metody-tipov-dannykh' },
        { title: 'Comprehensions', href: '/python/yazyk-python/1-core/comprehensions-v-python' },
        { title: 'Списки: базовые операции', href: '/python/yazyk-python/tipy-dannykh/spiski-bazovye-operatsii' },
    ]"
/>
