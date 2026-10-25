---
title: "Модуль itertools"
description: "Готовые инструменты для итераторов в Python: count, cycle, islice, chain, batched, pairwise, groupby, accumulate, product, combinations, tee, практические примеры для ML и аналогии с JS."
tags:
  - "python"
  - "core"
  - "iterators"
  - "itertools"
updatedAt: "2026-10-22"
---
## Что это {#chto-eto}

`itertools` - модуль стандартной библиотеки с готовыми «кирпичиками» для работы с итераторами. Все функции в нем ленивые: они возвращают итератор и считают значения по запросу.

```python
from itertools import islice, count

print(list(islice(count(10, 5), 4)))  # [10, 15, 20, 25]
```

Простая аналогия: если генератор - это конвейерная лента, то `itertools` - набор готовых станков, которые ставят на ленту: резак, склейка, сортировщик по коробкам.

Ниже функции разбиты на группы по задачам.

## Бесконечные итераторы {#beskonechnye-iteratory}

```python
from itertools import count, cycle, repeat, islice

list(islice(count(1), 3))          # [1, 2, 3] - счетчик без конца
list(islice(count(0, 0.5), 3))     # [0, 0.5, 1.0] - с шагом
list(islice(cycle("AB"), 5))       # ['A', 'B', 'A', 'B', 'A'] - по кругу
list(repeat("x", 3))               # ['x', 'x', 'x'] - повтор
```

Где применяются:

- `count()` - нумерация шагов, идентификаторы;
- `cycle()` - чередование, например распределение задач по воркерам по кругу;
- `repeat()` - постоянное значение для `zip` или `map`.

Без ограничения через `islice`, `zip` или `break` бесконечный итератор нельзя передавать в `list()`.

## Срезы и фильтры {#srezy-i-filtry}

У итератора нет индексов, поэтому `gen[:10]` не работает. Для этого есть `islice`:

```python
from itertools import islice

def read_rows():
    for i in range(1_000_000):
        yield {"id": i}

preview = list(islice(read_rows(), 3))      # первые 3
middle = list(islice(range(10), 2, 8, 2))   # [2, 4, 6] - start, stop, step
```

Отрицательные индексы не поддерживаются: итератор не знает, где его конец.

```python
from itertools import takewhile, dropwhile, filterfalse, compress

values = [1, 2, 3, 1]

list(takewhile(lambda x: x < 3, values))   # [1, 2] - пока условие верно
list(dropwhile(lambda x: x < 3, values))   # [3, 1] - пропустить, пока верно
list(filterfalse(lambda x: x > 1, values)) # [1, 1] - обратный filter
list(compress("abcd", [1, 0, 1, 0]))       # ['a', 'c'] - отбор по маске
```

Отличие `takewhile` от `filter`: `takewhile` останавливается на первом неподходящем элементе и дальше не смотрит.

## Склейка {#skleyka}

```python
from itertools import chain, zip_longest

list(chain([1, 2], (3, 4)))                    # [1, 2, 3, 4]
list(chain.from_iterable([[1, 2], [3]]))       # [1, 2, 3] - список списков в плоский
list(zip_longest([1, 2, 3], "ab", fillvalue="-"))
# [(1, 'a'), (2, 'b'), (3, '-')]
```

- `chain` - пройти несколько источников подряд, например несколько файлов с данными;
- `chain.from_iterable` - развернуть один уровень вложенности;
- `zip_longest` - как `zip`, но не обрезает по самой короткой последовательности.

## Группировка {#gruppirovka}

### `batched` - батчи {#batched-batchi}

С Python 3.12:

```python
from itertools import batched

list(batched(range(7), 3))  # [(0, 1, 2), (3, 4, 5), (6,)]
```

Главный инструмент для батчей в ML. Батчи - кортежи. Последний может быть короче.

### `pairwise` - соседние пары {#pairwise-sosednie-pary}

С Python 3.10:

```python
from itertools import pairwise

timestamps = [10, 15, 27, 30]
deltas = [b - a for a, b in pairwise(timestamps)]
print(deltas)  # [5, 12, 3] - интервалы между событиями
```

### `groupby` - группы подряд идущих элементов {#groupby-gruppy-podryad-idushchikh-elementov}

`groupby` объединяет только **соседние** элементы с одинаковым ключом:

```python
from itertools import groupby

print([(key, list(group)) for key, group in groupby("aabbbac")])
# [('a', ['a', 'a']), ('b', ['b', 'b', 'b']), ('a', ['a']), ('c', ['c'])]
```

Буква `a` попала в две разные группы, потому что между ними стоят `b`. Поэтому перед `groupby` данные почти всегда сортируют по тому же ключу:

```python
events = [("u2", "click"), ("u1", "view"), ("u2", "buy"), ("u1", "click")]
events.sort(key=lambda event: event[0])

for user, user_events in groupby(events, key=lambda event: event[0]):
    print(user, [action for _, action in user_events])

# u1 ['view', 'click']
# u2 ['click', 'buy']
```

Если нужна группировка без сортировки, проще собрать словарь через `collections.defaultdict(list)`.

## Накопление {#nakoplenie}

```python
from itertools import accumulate
import operator

list(accumulate([1, 2, 3, 4]))                 # [1, 3, 6, 10] - накопленная сумма
list(accumulate([3, 1, 4, 1, 5], max))         # [3, 3, 4, 4, 5] - текущий максимум
list(accumulate([1, 2, 3, 4], operator.mul))   # [1, 2, 6, 24] - накопленное произведение
```

Пример: накопленная выручка по дням или лучший результат метрики на каждой эпохе.

## Комбинаторика {#kombinatorika}

```python
from itertools import product, permutations, combinations

list(product("ab", [0, 1]))      # [('a', 0), ('a', 1), ('b', 0), ('b', 1)]
list(permutations("abc", 2))     # 6 пар, порядок важен: ('a', 'b') и ('b', 'a') разные
list(combinations("abc", 2))     # [('a', 'b'), ('a', 'c'), ('b', 'c')] - порядок не важен
```

Практический пример `product` - перебор гиперпараметров (grid search):

```python
from itertools import product

grid = {"lr": [0.1, 0.01], "depth": [3, 5]}

for values in product(*grid.values()):
    params = dict(zip(grid, values))
    print(params)

# {'lr': 0.1, 'depth': 3}
# {'lr': 0.1, 'depth': 5}
# {'lr': 0.01, 'depth': 3}
# {'lr': 0.01, 'depth': 5}
```

Количество комбинаций растет очень быстро: 5 параметров по 10 значений дают 100 000 вариантов. Ленивость `product` спасает память, но не время.

## Копирование итератора {#kopirovanie-iteratora}

`tee` делает из одного итератора несколько независимых:

```python
from itertools import tee

source = iter([1, 2, 3])
first, second = tee(source)

print(list(first))   # [1, 2, 3]
print(list(second))  # [1, 2, 3]
```

Две оговорки:

- после `tee` исходный итератор трогать нельзя, иначе копии пропустят элементы;
- если одна копия ушла далеко вперед, `tee` хранит в памяти все элементы, которые вторая еще не прочитала. Тогда проще сразу сделать `list()`.

## Практика: превью большого файла {#praktika-prevyu-bolshogo-fayla}

```python
from itertools import islice, chain


def read_lines(path: str):
    with open(path, encoding="utf-8") as file:
        yield from file


# первые 5 строк без чтения всего файла
for line in islice(read_lines("train.csv"), 5):
    print(line, end="")

# несколько файлов как один поток
all_lines = chain.from_iterable(read_lines(p) for p in ["part1.csv", "part2.csv"])
```

## Аналогия с JS {#analogiya-s-js}

Встроенного аналога `itertools` в JS нет. Часть функций закрывают методы итераторов из ES2025, остальное - библиотеки вроде `lodash`.

| Python | JS |
| --- | --- |
| `islice(it, n)` | `it.take(n)` |
| `islice(it, n, None)` | `it.drop(n)` |
| `chain.from_iterable(xss)` | `xss.flat()` или `it.flatMap(x => x)` |
| `batched(xs, n)` | `_.chunk(xs, n)` в `lodash` |
| `zip_longest` | `_.zip` в `lodash` |
| `accumulate(xs)` | `xs.reduce` с массивом-накопителем |
| `groupby` после сортировки | `Object.groupBy(xs, fn)`, но он группирует без сортировки |
| `product`, `combinations` | нет, пишут вручную |

## Частые ошибки {#chastye-oshibki}

1. `groupby` без сортировки.
   Одинаковые ключи, которые стоят не подряд, попадут в разные группы.

2. Сохранить группы из `groupby` на потом.

```python
groups = list(groupby("aabb"))
print([(key, list(group)) for key, group in groups])
# [('a', []), ('b', [])] - группы уже пустые
```

Группа - это «окно» в общий итератор. Когда `groupby` переходит к следующему ключу, предыдущая группа становится пустой. Сразу превращай группу в список: `{key: list(group) for key, group in groupby(...)}`.

3. Отрицательные индексы в `islice`.
   `islice(it, -1)` дает `ValueError`. Итератор не знает свою длину.

4. Использовать исходный итератор после `tee`.
   Копии пропустят элементы.

5. `list()` на `count()` или `cycle()`.
   Программа зависнет.

6. Использовать `batched` на Python ниже 3.12.
   Будет `ImportError`. На старых версиях батчи делают через генератор или `zip(*[iter(xs)] * n)`.

## Практические задачи {#prakticheskie-zadachi}

### Задача 1 {#zadacha-1}

Есть список дат входа пользователя `[1, 2, 5, 6, 7, 10]`. С помощью `pairwise` найди самый большой перерыв между входами.

### Задача 2 {#zadacha-2}

Есть список событий `(user_id, amount)`. Через сортировку и `groupby` посчитай сумму `amount` для каждого пользователя.

### Задача 3 {#zadacha-3}

Через `product` перебери все сочетания `batch_size` из `[16, 32]`, `lr` из `[0.1, 0.01]` и `optimizer` из `["sgd", "adam"]`. Сколько получилось комбинаций?

## Краткая шпаргалка {#kratkaya-shpargalka}

| Функция | Что делает |
| --- | --- |
| `count(start, step)` | бесконечный счетчик |
| `cycle(xs)` | повтор по кругу |
| `repeat(x, n)` | одно значение `n` раз |
| `islice(it, start, stop, step)` | срез итератора |
| `takewhile` / `dropwhile` | взять или пропустить, пока условие верно |
| `chain(a, b)` | склеить источники |
| `zip_longest(a, b)` | `zip` без обрезки |
| `batched(xs, n)` | батчи по `n` |
| `pairwise(xs)` | соседние пары |
| `groupby(xs, key)` | группы подряд идущих |
| `accumulate(xs)` | накопленный итог |
| `product(a, b)` | декартово произведение |
| `permutations` / `combinations` | перестановки и сочетания |
| `tee(it, n)` | несколько копий итератора |

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python: itertools', href: 'https://docs.python.org/3/library/itertools.html' },
        { title: 'Python: itertools recipes', href: 'https://docs.python.org/3/library/itertools.html#itertools-recipes' },
        { title: 'Python: operator', href: 'https://docs.python.org/3/library/operator.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Генераторы и yield', href: '/python/yazyk-python/iteratory-i-generatory/generatory-i-yield' },
        { title: 'yield from и конвейеры', href: '/python/yazyk-python/iteratory-i-generatory/yield-from-i-konveyery' },
        { title: 'Sorted и filter', href: '/python/yazyk-python/1-core/sorted-i-filter' },
        { title: 'Lambda-функции', href: '/python/yazyk-python/1-core/lambda-funktsii' },
    ]"
/>
