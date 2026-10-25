---
title: "Хеширование и сортировка"
description: "Хеш-таблицы, словари, множества, частотные словари, Counter, defaultdict, sorted, sort, key и стабильная сортировка в Python."
tags:
  - "python"
  - "algorithms"
  - "hashing"
  - "sorting"
updatedAt: "2026-10-16"
---
## Что такое хеширование {#chto-takoe-kheshirovanie}

Хеширование позволяет по ключу быстро найти связанную с ним позицию в хеш-таблице.

В Python этот подход используется в:

- `dict` - хранит пары «ключ - значение»;
- `set` - хранит уникальные значения.

Поиск, добавление и удаление обычно работают за `O(1)` в среднем. Это делает хеширование одним из основных способов заменить повторный линейный поиск.

## Пример перехода от O(n²) к O(n) {#primer-perekhoda-ot-o-n2-k-o-n}

Нужно определить, есть ли в списке повторяющиеся значения.

### Полный перебор {#polnyy-perebor}

```python
def has_duplicate_slow(numbers: list[int]) -> bool:
    for left in range(len(numbers)):
        for right in range(left + 1, len(numbers)):
            if numbers[left] == numbers[right]:
                return True

    return False
```

- Время - `O(n²)`.
- Дополнительная память - `O(1)`.

### Решение через set {#reshenie-cherez-set}

```python
def has_duplicate(numbers: list[int]) -> bool:
    seen = set()

    for number in numbers:
        if number in seen:
            return True

        seen.add(number)

    return False
```

- Время - в среднем `O(n)`.
- Дополнительная память - `O(n)`.

Множество хранит уже просмотренные значения. Поэтому для каждого нового элемента не нужно заново просматривать предыдущую часть списка.

## Хешируемые объекты {#kheshiruemye-obekty}

Ключ словаря и элемент множества должны быть хешируемыми. Упрощенно это означает, что объект имеет стабильный хеш и не изменяет свое значение во время нахождения в таблице.

Обычно хешируемы:

- `int`;
- `float`;
- `str`;
- `bytes`;
- `None`;
- `tuple`, если все его элементы хешируемы.

Не хешируемы:

- `list`;
- `dict`;
- `set`.

```python
coordinates = {(10, 20), (30, 40)}

# invalid = {[10, 20]}  # TypeError: unhashable type: 'list'
```

В задачах на матрицы удобно хранить посещенную позицию как кортеж `(row, column)`.

## Словарь как таблица соответствий {#slovar-kak-tablitsa-sootvetstviy}

```python
phone_by_name = {
    "Alex": "+100000000",
    "Sam": "+200000000",
}

print(phone_by_name["Alex"])  # +100000000
```

Словарь подходит, когда нужно:

- связать идентификатор с данными;
- сохранить индекс элемента;
- подсчитать частоты;
- сгруппировать значения;
- кэшировать вычисления.

## Частотный словарь вручную {#chastotnyy-slovar-vruchnuyu}

```python
def count_values(values: list[str]) -> dict[str, int]:
    frequencies: dict[str, int] = {}

    for value in values:
        frequencies[value] = frequencies.get(value, 0) + 1

    return frequencies


result = count_values(["a", "b", "a"])
print(result)  # {'a': 2, 'b': 1}
```

`frequencies.get(value, 0)` возвращает текущее количество или `0`, если ключ еще не встречался.

- Время - в среднем `O(n)`.
- Память - `O(k)`, где `k` - количество уникальных значений.

Сначала научись писать эту логику вручную. Тогда использование `Counter` будет осознанным.

## Counter {#counter}

```python
from collections import Counter

frequencies = Counter(["a", "b", "a"])

print(frequencies["a"])  # 2
print(frequencies["c"])  # 0
```

`Counter` подходит для подсчета хешируемых значений и делает намерение кода явным.

Пример проверки анаграмм:

```python
from collections import Counter


def are_anagrams(left: str, right: str) -> bool:
    return Counter(left) == Counter(right)
```

Если длины строк равны `n` и `m`, время - `O(n + m)`, а дополнительная память зависит от количества уникальных символов.

## Defaultdict для группировки {#defaultdict-dlya-gruppirovki}

```python
from collections import defaultdict


def group_by_first_letter(words: list[str]) -> dict[str, list[str]]:
    groups: defaultdict[str, list[str]] = defaultdict(list)

    for word in words:
        groups[word[0]].append(word)

    return dict(groups)


result = group_by_first_letter(["cat", "car", "dog"])
print(result)  # {'c': ['cat', 'car'], 'd': ['dog']}
```

При обращении к отсутствующему ключу `defaultdict(list)` автоматически создает пустой список.

Не используй `defaultdict`, если обычный `dict` читается так же просто. Это инструмент для конкретных случаев, а не обязательная замена словаря.

## Задача Two Sum {#zadacha-two-sum}

Нужно вернуть индексы двух чисел, сумма которых равна `target`.

```python
def two_sum(numbers: list[int], target: int) -> tuple[int, int] | None:
    index_by_number: dict[int, int] = {}

    for index, number in enumerate(numbers):
        required = target - number

        if required in index_by_number:
            return index_by_number[required], index

        index_by_number[number] = index

    return None
```

Для каждого числа вычисляется недостающее значение. Словарь отвечает на вопрос: «встречалось ли оно раньше и под каким индексом?»

- Время - в среднем `O(n)`.
- Дополнительная память - `O(n)`.

Порядок проверки важен. Сначала ищется дополнение, затем текущее число записывается в словарь. Так один элемент не используется дважды.

## Когда set недостаточно {#kogda-set-nedostatochno}

`set` сообщает только о наличии значения. Используй `dict`, если вместе со значением нужно хранить:

- индекс;
- количество;
- родительскую вершину;
- сгруппированные элементы;
- дополнительное состояние.

## sorted и list.sort {#sorted-i-list-sort}

```python
numbers = [3, 1, 2]

new_numbers = sorted(numbers)

print(numbers)      # [3, 1, 2]
print(new_numbers)  # [1, 2, 3]
```

`sorted()` принимает любой итерируемый объект и возвращает новый список.

```python
numbers = [3, 1, 2]
result = numbers.sort()

print(numbers)  # [1, 2, 3]
print(result)   # None
```

`.sort()` изменяет исходный список и возвращает `None`.

Обычная оценка времени сортировки - `O(n log n)`.

## Параметр key {#parametr-key}

`key` получает один элемент и возвращает значение, по которому этот элемент нужно сравнивать.

```python
people = ["Bob", "Alice", "Diana"]
result = sorted(people, key=len)

print(result)  # ['Bob', 'Alice', 'Diana']
```

Исходные строки не меняются. Для сравнения используются их длины.

## Сортировка по нескольким условиям {#sortirovka-po-neskolkim-usloviyam}

Кортежи сравниваются слева направо. Поэтому функция `key` может вернуть несколько критериев:

```python
people = ["Diana", "Bob", "Alice", "Alex"]
result = sorted(people, key=lambda name: (len(name), name))

print(result)  # ['Bob', 'Alex', 'Alice', 'Diana']
```

Сначала сравнивается длина, затем само имя по алфавиту.

Для сортировки числового критерия по убыванию можно изменить его знак:

```python
students = [
    {"name": "Alex", "score": 90},
    {"name": "Bob", "score": 100},
    {"name": "Diana", "score": 90},
]

result = sorted(students, key=lambda student: (-student["score"], student["name"]))
```

Сначала баллы идут по убыванию, а при одинаковом результате имена - по возрастанию.

## Стабильная сортировка {#stabilnaya-sortirovka}

Сортировка Python стабильна: элементы с одинаковым ключом сохраняют взаимный порядок.

```python
records = [
    ("Alex", 2),
    ("Sam", 1),
    ("Diana", 2),
]

result = sorted(records, key=lambda record: record[1])

print(result)  # [('Sam', 1), ('Alex', 2), ('Diana', 2)]
```

У `Alex` и `Diana` одинаковый ключ `2`, поэтому их исходный порядок сохранился.

## Когда сортировка упрощает задачу {#kogda-sortirovka-uproshchaet-zadachu}

Сортировка часто помогает:

- искать пары двумя указателями;
- объединять интервалы;
- группировать одинаковые значения;
- сравнивать соседние элементы;
- выбирать элементы в жадных алгоритмах.

Но сортировка обычно стоит `O(n log n)` и может уничтожить информацию об исходных индексах. Если индексы нужны, сортируй пары `(значение, индекс)` или используй словарь.

## Hashing или сортировка {#hashing-ili-sortirovka}

| Требование | Возможный подход |
| --- | --- |
| Быстро проверить наличие | `set` |
| Сохранить индекс или счетчик | `dict` |
| Получить элементы в порядке | сортировка |
| Использовать минимум дополнительной памяти | сортировка на месте, если изменение разрешено |
| Сохранить исходный порядок | словарь или множество посещенных значений |
| Сравнивать соседние значения | сортировка |

Один подход не всегда лучше другого. Нужно учитывать время, память, требование к порядку и возможность менять вход.

## Частые ошибки {#chastye-oshibki}

1. Искать значение в списке внутри цикла и незаметно получать `O(n²)`.
2. Использовать список как ключ словаря.
3. Ожидать, что `set` поддерживает индексы или сортировку.
4. Присвоить результат `.sort()` переменной и получить `None`.
5. Забыть, что `sorted()` создает новый список.
6. Потерять исходные индексы после сортировки.
7. Использовать `Counter` или `defaultdict`, не понимая ручную реализацию.
8. Говорить, что операции словаря гарантированно работают за `O(1)` в худшем случае.

## Практика {#praktika}

1. Реализуй частотный словарь без `Counter`.
2. Найди первый повторяющийся элемент.
3. Проверь, являются ли две строки анаграммами.
4. Реши `Two Sum` через словарь индексов.
5. Сгруппируй слова по первой букве через обычный `dict`, затем через `defaultdict`.
6. Отсортируй строки сначала по длине, затем по алфавиту.
7. Отсортируй записи по убыванию балла и возрастанию имени.
8. Объясни, когда для поиска пары лучше сортировка и два указателя, а когда - словарь.

## Критерий готовности {#kriteriy-gotovnosti}

Тема освоена, если ты можешь:

- вручную построить частотный словарь;
- выбрать между `dict` и `set`;
- объяснить среднюю сложность хеш-таблицы;
- определить, можно ли использовать объект как ключ;
- объяснить различие `sorted()` и `.sort()`;
- написать составной ключ сортировки;
- объяснить стабильность сортировки;
- решить `Two Sum` за `O(n)` в среднем.

<OfficialDocsLinks
    :links="[
        { title: 'Python: Data Structures', href: 'https://docs.python.org/3/tutorial/datastructures.html' },
        { title: 'Python: Counter and defaultdict', href: 'https://docs.python.org/3/library/collections.html' },
        { title: 'Python: Sorting Techniques', href: 'https://docs.python.org/3/howto/sorting.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Big O', href: '/python/algoritmy/etap-1-osnovy/big-o-i-analiz-slozhnosti' },
        { title: 'Сложность операций Python', href: '/python/algoritmy/etap-1-osnovy/slozhnost-operatsiy-python' },
        { title: 'Массивы и строки', href: '/python/algoritmy/etap-1-osnovy/massivy-i-stroki' },
        { title: 'Словари dict', href: '/python/yazyk-python/tipy-dannykh/slovari-dict' },
    ]"
/>
