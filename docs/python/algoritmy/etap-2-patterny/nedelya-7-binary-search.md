---
title: "Неделя 7. Binary Search"
description: "Подробный разбор бинарного поиска, инвариантов границ, lower bound, поиска в повернутом массиве и Binary Search on Answer."
tags:
  - "python"
  - "algorithms"
  - "binary-search"
  - "patterns"
updatedAt: "2026-10-19"
---
## Цель недели {#tsel-nedeli}

Научиться уменьшать пространство поиска в два раза и не ошибаться в границах.

После недели нужно уметь:

- написать классический бинарный поиск;
- выбрать закрытый или полуоткрытый диапазон;
- найти первую подходящую позицию;
- объяснить инвариант границ;
- искать в повернутом отсортированном массиве;
- применять Binary Search on Answer;
- осознанно использовать `bisect`.

## Когда работает бинарный поиск {#kogda-rabotaet-binarnyy-poisk}

Нужна возможность отбросить половину вариантов после одной проверки.

Это возможно, когда:

- список отсортирован;
- условие меняется монотонно: сначала все ответы `False`, затем все `True`;
- нужно найти минимальное допустимое или максимальное допустимое значение;
- одна половина массива гарантированно отсортирована.

Бинарный поиск нельзя применять только потому, что нужно что-то найти. Нужен упорядоченный признак.

## Закрытый диапазон {#zakrytyy-diapazon}

В классическом варианте обе границы входят в поиск:

```text
[left, right]
```

Поэтому:

- `right = len(numbers) - 1`;
- цикл продолжается, пока `left <= right`;
- исключая `middle`, используем `middle - 1` или `middle + 1`.

## Пример 1. Поиск точного значения {#primer-1-poisk-tochnogo-znacheniya}

```python
def binary_search(numbers: list[int], target: int) -> int:
    left = 0
    right = len(numbers) - 1

    while left <= right:
        middle = (left + right) // 2
        middle_value = numbers[middle]

        if middle_value == target:
            return middle

        if middle_value < target:
            # middle и вся левая часть меньше target.
            left = middle + 1
        else:
            # middle и вся правая часть больше target.
            right = middle - 1

    return -1
```

### Пошаговый разбор {#poshagovyy-razbor}

```text
numbers = [2, 4, 7, 10, 13, 18]
target = 13
```

| Шаг | `left` | `right` | `middle` | Значение | Действие |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 5 | 2 | 7 | `left = 3` |
| 2 | 3 | 5 | 4 | 13 | Ответ `4` |

Размер диапазона на каждом шаге уменьшается примерно в два раза.

- Время: `O(log n)`.
- Память: `O(1)`.

## Полуоткрытый диапазон {#poluotkrytyy-diapazon}

Для поиска границы удобно использовать:

```text
[left, right)
```

Левая граница входит, правая не входит.

Поэтому:

- `right = len(numbers)`;
- цикл продолжается, пока `left < right`;
- `right = middle` сохраняет `middle` как возможный ответ.

## Пример 2. Lower Bound {#primer-2-lower-bound}

Нужно найти первую позицию, где значение не меньше `target`.

```python
def lower_bound(numbers: list[int], target: int) -> int:
    left = 0
    right = len(numbers)

    while left < right:
        middle = (left + right) // 2

        if numbers[middle] < target:
            # middle слишком мал и точно не подходит.
            left = middle + 1
        else:
            # middle подходит, но слева может быть более ранняя позиция.
            right = middle

    return left
```

Для `[1, 3, 3, 3, 7]` и `target = 3` ответ равен `1`, а не любой индекс со значением `3`.

Если все элементы меньше `target`, функция вернет `len(numbers)`. Это корректная позиция вставки в конец.

### Инвариант {#invariant}

- Все индексы меньше `left` точно не подходят.
- Первая подходящая позиция всегда остается внутри `[left, right)`.
- Когда `left == right`, диапазон сузился до ответа.

## Upper Bound {#upper-bound}

Upper Bound - первая позиция со значением строго больше `target`.

Отличается одним сравнением:

```python
def upper_bound(numbers: list[int], target: int) -> int:
    left = 0
    right = len(numbers)

    while left < right:
        middle = (left + right) // 2

        if numbers[middle] <= target:
            left = middle + 1
        else:
            right = middle

    return left
```

Количество элементов, равных `target`:

```text
upper_bound(numbers, target) - lower_bound(numbers, target)
```

## Bisect {#bisect}

Стандартный модуль предоставляет готовые границы:

```python
from bisect import bisect_left, bisect_right

first_position = bisect_left(numbers, target)
after_last_position = bisect_right(numbers, target)
```

Сначала научись писать обе границы вручную. Иначе легко выбрать неправильную функцию.

`bisect` находит позицию за `O(log n)`, но `insort()` вставляет в список за `O(n)`, потому что элементы нужно сдвинуть.

## Пример 3. Повернутый массив {#primer-3-povernutyy-massiv}

Список был отсортирован, а затем повернут:

```text
[0, 1, 2, 4, 5, 6, 7] -> [4, 5, 6, 7, 0, 1, 2]
```

В каждой итерации хотя бы одна половина остается отсортированной.

```python
def search_rotated(numbers: list[int], target: int) -> int:
    left = 0
    right = len(numbers) - 1

    while left <= right:
        middle = (left + right) // 2

        if numbers[middle] == target:
            return middle

        if numbers[left] <= numbers[middle]:
            # Левая половина отсортирована.
            if numbers[left] <= target < numbers[middle]:
                right = middle - 1
            else:
                left = middle + 1
        else:
            # Правая половина отсортирована.
            if numbers[middle] < target <= numbers[right]:
                left = middle + 1
            else:
                right = middle - 1

    return -1
```

Здесь предполагается, что элементы уникальны. Дубликаты требуют дополнительных правил и иногда ухудшают сложность.

## Binary Search on Answer {#binary-search-on-answer}

Иногда списка для поиска нет. Есть диапазон возможных ответов и функция проверки:

```text
can_finish(value) -> True или False
```

Если после некоторой границы все значения становятся допустимыми, можно найти минимальное допустимое значение бинарным поиском.

## Пример 4. Минимальная скорость обработки {#primer-4-minimalnaya-skorost-obrabotki}

Есть объемы работ `piles` и ограничение `hours`. За час можно обработать до `speed` единиц только из одной группы. Нужно найти минимальную достаточную скорость.

```python
def min_speed(piles: list[int], hours: int) -> int:
    left = 1  # Скорость не может быть нулевой.
    right = max(piles)  # Этой скорости достаточно для любой одной группы.

    def can_finish(speed: int) -> bool:
        required_hours = 0

        for pile in piles:
            # Округление вверх без float.
            required_hours += (pile + speed - 1) // speed

        return required_hours <= hours

    while left < right:
        middle = (left + right) // 2

        if can_finish(middle):
            # middle подходит, но ищем меньшую достаточную скорость.
            right = middle
        else:
            # middle слишком мал.
            left = middle + 1

    return left
```

Проверка одной скорости занимает `O(n)`, количество проверок - `O(log m)`, где `m` - максимальный объем. Итог: `O(n log m)`.

## Частые ошибки {#chastye-oshibki}

1. Смешать правила закрытого и полуоткрытого диапазона.
2. Использовать `left = middle` и получить бесконечный цикл.
3. Потерять `middle` как возможный ответ при поиске границы.
4. Не обработать пустой список.
5. Использовать Binary Search без монотонности.
6. Считать всю операцию `insort()` логарифмической.
7. Не проговорить, что вернется при отсутствии точного значения.

## Как отлаживать границы {#kak-otlazhivat-granitsy}

Проверь алгоритм вручную на списках:

- `[]`;
- `[5]` с найденным и ненайденным значением;
- `[1, 2]`;
- все элементы меньше `target`;
- все элементы больше `target`;
- несколько одинаковых значений.

На каждой итерации убеждайся, что диапазон строго уменьшается.

## Задачи для самостоятельного решения {#zadachi-dlya-samostoyatelnogo-resheniya}

### Задача 1. Первая и последняя позиция {#zadacha-1-pervaya-i-poslednyaya-pozitsiya}

В отсортированном списке найди первый и последний индекс `target`.

```text
numbers = [5, 7, 7, 8, 8, 10]
target = 8
result = [3, 4]
```

Если значения нет, верни `[-1, -1]`. Решение должно работать за `O(log n)`.

### Задача 2. Минимальная вместимость доставки {#zadacha-2-minimalnaya-vmestimost-dostavki}

Грузы должны быть доставлены по порядку за заданное количество дней. Найди минимальную вместимость корабля.

Определи:

- минимально возможный ответ;
- максимально возможный ответ;
- функцию `can_ship(capacity)`;
- монотонное свойство, позволяющее применить бинарный поиск.

<RelatedTopics
    :items="[
        { title: 'Неделя 6. Prefix Sum', href: '/python/algoritmy/etap-2-patterny/nedelya-6-prefix-sum' },
        { title: 'Неделя 8. Intervals', href: '/python/algoritmy/etap-2-patterny/nedelya-8-sorting-i-intervaly' },
        { title: 'Обзор этапа 2', href: '/python/algoritmy/etap-2-patterny/glavnaya' },
    ]"
/>
