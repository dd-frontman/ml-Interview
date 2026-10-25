---
title: "Сложность операций Python"
description: "Справочник по временной сложности операций list, tuple, dict, set, deque, heapq, строк и сортировки в алгоритмических задачах на Python."
tags:
  - "python"
  - "algorithms"
  - "big-o"
  - "collections"
updatedAt: "2026-10-16"
---
## Зачем знать стоимость встроенных операций {#zachem-znat-stoimost-vstroennykh-operatsiy}

Сложность функции определяется не только количеством циклов. Внутри одной строки Python может выполняться проход, копирование или сортировка всей коллекции.

```python
def remove_first(numbers: list[int]) -> int:
    return numbers.pop(0)
```

В коде нет цикла, но после удаления первого элемента оставшиеся элементы списка нужно сдвинуть. Поэтому операция работает за `O(n)`.

Значения ниже используются как практические оценки для алгоритмических задач. Для `dict` и `set` `O(1)` означает среднюю сложность.

## List {#list}

Список Python реализован как динамический массив. Он быстро обращается к элементу по индексу и добавляет элементы в конец, но вставка или удаление в начале требуют сдвига.

| Операция | Сложность | Почему |
| --- | --- | --- |
| `items[index]` | `O(1)` | Адрес элемента вычисляется по индексу |
| `items[index] = value` | `O(1)` | Изменяется одна позиция |
| `len(items)` | `O(1)` | Длина хранится в объекте списка |
| `items.append(value)` | амортизированно `O(1)` | Обычно запись идет в свободную позицию |
| `items.pop()` | `O(1)` | Удаляется последний элемент |
| `items.insert(index, value)` | `O(n)` | Часть элементов нужно сдвинуть |
| `items.pop(index)` | `O(n)` | После удаления элементы сдвигаются |
| `value in items` | `O(n)` | Значения проверяются последовательно |
| `items.index(value)` | `O(n)` | Выполняется линейный поиск |
| `items.count(value)` | `O(n)` | Проверяется каждый элемент |
| `items[start:stop]` | `O(k)` | Создается список из `k` элементов |
| `items.copy()` | `O(n)` | Копируются ссылки на все элементы |
| `items + other` | `O(n + m)` | Создается новый объединенный список |
| `items.extend(other)` | `O(m)` | Добавляются все `m` элементов |
| `items.reverse()` | `O(n)` | Элементы переставляются на месте |
| `items.sort()` | `O(n log n)` | Выполняется сортировка |

### Почему список не подходит для обычной очереди {#pochemu-spisok-ne-podkhodit-dlya-obychnoy-ocheredi}

```python
queue = [10, 20, 30]
first = queue.pop(0)
```

После удаления `10` элементы `20` и `30` сдвигаются влево. Если повторять `pop(0)` для всех элементов, суммарная работа станет квадратичной.

Для очереди используй `collections.deque`.

## Tuple {#tuple}

Кортеж неизменяемый, поэтому в нем нет добавления и удаления элементов.

| Операция | Сложность |
| --- | --- |
| `values[index]` | `O(1)` |
| `len(values)` | `O(1)` |
| `value in values` | `O(n)` |
| `values[start:stop]` | `O(k)` |
| `values + other` | `O(n + m)` |

Кортеж можно использовать как ключ словаря или элемент множества, только если все его элементы хешируемы.

```python
point = (10, 20)          # можно использовать как ключ
invalid = ([10], [20])    # внутри находятся изменяемые списки
```

## Dict {#dict}

Словарь хранит пары «ключ - значение» и использует хеш ключа для поиска.

| Операция | Средняя сложность |
| --- | --- |
| `mapping[key]` | `O(1)` |
| `mapping[key] = value` | `O(1)` |
| `key in mapping` | `O(1)` |
| `mapping.get(key)` | `O(1)` |
| `mapping.pop(key)` | `O(1)` |
| `len(mapping)` | `O(1)` |
| Проход по ключам | `O(n)` |
| `mapping.copy()` | `O(n)` |

Проверка `value in mapping` ищет **ключ**, а не значение.

```python
ages = {"Alex": 30, "Sam": 25}

"Alex" in ages          # True: проверяется ключ
30 in ages              # False: 30 является значением
30 in ages.values()     # True, но поиск по значениям линейный
```

Худший случай операций словаря может быть медленнее из-за коллизий и изменения размера таблицы. На собеседованиях обычно явно говорят: доступ и поиск по ключу - `O(1)` в среднем.

## Set {#set}

Множество использует хеширование и хранит только уникальные элементы.

| Операция | Средняя сложность |
| --- | --- |
| `value in values` | `O(1)` |
| `values.add(value)` | `O(1)` |
| `values.remove(value)` | `O(1)` |
| `values.discard(value)` | `O(1)` |
| `len(values)` | `O(1)` |
| Проход по множеству | `O(n)` |
| `left \| right` | `O(n + m)` |
| `left & right` | зависит от размеров, обычно линейно по меньшему множеству |

`set` полезен, когда нужны:

- быстрая проверка принадлежности;
- удаление дубликатов;
- хранение посещенных вершин;
- поиск пересечения коллекций.

Не полагайся на позицию элемента множества: у `set` нет индексов.

## Deque {#deque}

`collections.deque` - двусторонняя очередь.

| Операция | Сложность |
| --- | --- |
| `queue.append(value)` | приблизительно `O(1)` |
| `queue.appendleft(value)` | приблизительно `O(1)` |
| `queue.pop()` | приблизительно `O(1)` |
| `queue.popleft()` | приблизительно `O(1)` |
| `queue[0]` и `queue[-1]` | `O(1)` |
| Доступ к середине | `O(n)` |

```python
from collections import deque

queue = deque([10, 20, 30])
first = queue.popleft()

print(first)  # 10
print(queue)  # deque([20, 30])
```

Для BFS обычно нужны `append()` и `popleft()`.

## Строки {#stroki}

Строки неизменяемы. Любое действие, которое «изменяет» строку, создает новый объект.

| Операция | Сложность |
| --- | --- |
| `text[index]` | `O(1)` |
| `len(text)` | `O(1)` |
| `part in text` | зависит от алгоритма поиска, для базовой оценки до `O(n * m)` |
| `text[start:stop]` | `O(k)` |
| `text + other` | `O(n + m)` |
| `text.split()` | `O(n)` |
| `separator.join(parts)` | `O(n)` по общему размеру результата |

Не собирай длинную строку повторным сложением в цикле без необходимости:

```python
parts = []

for word in words:
    parts.append(word.upper())

result = " ".join(parts)
```

Так намерение явно: сначала собрать части, затем один раз создать итоговую строку.

## Сортировка {#sortirovka}

| Операция | Сложность | Изменяет исходный список |
| --- | --- | --- |
| `sorted(items)` | `O(n log n)` | Нет |
| `items.sort()` | `O(n log n)` | Да |

`sorted()` возвращает новый список. `.sort()` возвращает `None`.

```python
numbers = [3, 1, 2]
sorted_numbers = sorted(numbers)

print(numbers)         # [3, 1, 2]
print(sorted_numbers)  # [1, 2, 3]
```

Если `key` вычисляется для каждого элемента за `O(k)`, его работа также входит в итоговую сложность.

## Heapq {#heapq}

Модуль `heapq` реализует min-heap поверх обычного списка.

| Операция | Сложность |
| --- | --- |
| `heapq.heapify(items)` | `O(n)` |
| `heapq.heappush(heap, value)` | `O(log n)` |
| `heapq.heappop(heap)` | `O(log n)` |
| `heap[0]` | `O(1)` |

Куча нужна, когда требуется быстро получать минимальный элемент, но не нужна полная сортировка всех данных.

## Скрытая сложность одной строки {#skrytaya-slozhnost-odnoy-stroki}

```python
if target in numbers:          # O(n) для list
    position = numbers.index(target)  # еще O(n)
```

Здесь список может проходиться дважды. Это все еще `O(n)`, но работу можно не дублировать:

```python
for position, number in enumerate(numbers):
    if number == target:
        break
```

Другой пример:

```python
while numbers:
    numbers.pop(0)
```

Цикл выполняется `n` раз, а каждое удаление из начала стоит до `O(n)`. Суммарная сложность - `O(n²)`.

## Как выбирать коллекцию {#kak-vybirat-kollektsiyu}

| Требование | Подходящая структура |
| --- | --- |
| Быстрый доступ по индексу | `list` или `tuple` |
| Добавление и удаление с конца | `list` |
| Очередь с удалением слева | `deque` |
| Связать ключ со значением | `dict` |
| Быстро проверить наличие | `set` или `dict` |
| Хранить неизменяемую запись | `tuple` |
| Быстро получать минимум | heap через `heapq` |
| Получить полностью упорядоченный результат | `sorted()` или `.sort()` |

## Контрольные вопросы {#kontrolnye-voprosy}

1. Почему `list.pop()` и `list.pop(0)` имеют разную сложность?
2. Почему срез требует дополнительную память?
3. Что именно проверяет выражение `key in mapping`?
4. Почему доступ к середине `deque` не является `O(1)`?
5. Чем `sorted()` отличается от `.sort()`?
6. В чем разница между средней и худшей сложностью словаря?

<OfficialDocsLinks
    :links="[
        { title: 'Python: Data Structures', href: 'https://docs.python.org/3/tutorial/datastructures.html' },
        { title: 'Python: collections.deque', href: 'https://docs.python.org/3/library/collections.html#collections.deque' },
        { title: 'Python: heapq', href: 'https://docs.python.org/3/library/heapq.html' },
        { title: 'Python: Sorting Techniques', href: 'https://docs.python.org/3/howto/sorting.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Big O', href: '/python/algoritmy/etap-1-osnovy/big-o-i-analiz-slozhnosti' },
        { title: 'Массивы и строки', href: '/python/algoritmy/etap-1-osnovy/massivy-i-stroki' },
        { title: 'Хеширование и сортировка', href: '/python/algoritmy/etap-1-osnovy/heshirovanie-i-sortirovka' },
    ]"
/>
