---
title: "Генераторные выражения"
description: "Генераторные выражения в Python: синтаксис, отличие от list comprehension, экономия памяти, передача в sum, any и join, позднее связывание переменных, цепочки обработки и аналогии с JS."
tags:
  - "python"
  - "core"
  - "generators"
  - "comprehensions"
updatedAt: "2026-10-22"
---
## Синтаксис {#sintaksis}

Генераторное выражение выглядит как list comprehension, только в круглых скобках:

```python
scores = [0.2, 0.7, 0.9]

high_list = [s for s in scores if s > 0.5]  # список
high_gen = (s for s in scores if s > 0.5)   # генератор

print(high_list)  # [0.7, 0.9]
print(high_gen)   # <generator object <genexpr> at 0x...>
print(list(high_gen))  # [0.7, 0.9]
```

Это короткая запись генераторной функции. Выражение `(s for s in scores if s > 0.5)` делает то же самое, что:

```python
def _high(scores):
    for s in scores:
        if s > 0.5:
            yield s
```

## Чем отличается от list comprehension {#chem-otlichaetsya-ot-list-comprehension}

List comprehension сразу считает все значения и складывает их в память. Генераторное выражение не считает ничего, пока его не начнут перебирать.

```python
import sys

squares_list = [x * x for x in range(1_000_000)]
squares_gen = (x * x for x in range(1_000_000))

print(sys.getsizeof(squares_list))  # около 8 МБ
print(sys.getsizeof(squares_gen))   # около 200 байт
```

Размер генератора не зависит от количества элементов: он хранит только текущее состояние, а не результаты.

| | `[... for ...]` | `(... for ...)` |
| --- | --- | --- |
| Результат | список | генератор |
| Когда считаются значения | сразу | по запросу |
| Память | все элементы | одно текущее состояние |
| Повторный обход | да | нет |
| `len()`, индекс | да | нет |

## Скобки можно не писать {#skobki-mozhno-ne-pisat}

Если генераторное выражение - единственный аргумент функции, вторые скобки не нужны:

```python
total = sum(x * x for x in range(10))
labels = ",".join(name.upper() for name in ["cat", "dog"])
```

Если аргументов больше одного, скобки обязательны:

```python
sorted(x for x in [3, 1, 2], reverse=True)
# SyntaxError: Generator expression must be parenthesized

sorted((x for x in [3, 1, 2]), reverse=True)  # правильно
```

## Функции, которые принимают генераторы {#funktsii-kotorye-prinimayut-generatory}

Любая функция, которая принимает итерируемый объект, примет и генератор:

```python
values = [3, 8, 1]

sum(v * 2 for v in values)       # 24
max(v for v in values if v < 5)  # 3
any(v > 5 for v in values)       # True
all(v > 0 for v in values)       # True
set(v % 2 for v in values)       # {0, 1}
dict((v, v * v) for v in values) # {3: 9, 8: 64, 1: 1}
```

`any()` и `all()` останавливаются, как только ответ ясен. Вместе с генератором это значит, что лишние элементы даже не будут вычислены:

```python
def is_big(x: int) -> bool:
    print("проверяю", x)
    return x > 1


print(any(is_big(x) for x in [1, 2, 3]))

# проверяю 1
# проверяю 2
# True - до тройки дело не дошло
```

Со списком `any([is_big(x) for x in ...])` сначала проверились бы все элементы.

## Когда вычисляется выражение {#kogda-vychislyaetsya-vyrazhenie}

Здесь есть неочевидная деталь, которую любят спрашивать на собеседованиях.

**Первый источник** (`in scores`) вычисляется сразу при создании генератора:

```python
gen = (x for x in undefined_name)
# NameError: name 'undefined_name' is not defined - ошибка сразу

scores = [0.2, 0.7]
gen = (s for s in scores)
scores = [0.9]           # переменная указывает на новый список
print(list(gen))         # [0.2, 0.7] - генератор держит старый список
```

**Все остальное** - условия, выражение слева, вложенные `for` - вычисляется лениво, в момент перебора:

```python
threshold = 0.5
scores = [0.2, 0.7, 0.9]
high = (s for s in scores if s > threshold)

threshold = 0.8          # поменяли до перебора
print(list(high))        # [0.9] - использовался новый порог
```

Правило простое: если генератор создан в одном месте, а перебирается в другом, не меняй переменные, от которых он зависит.

## Цепочки генераторов {#tsepochki-generatorov}

Генераторные выражения удобно соединять в цепочку. Каждый шаг берет данные у предыдущего по одному элементу:

```python
lines = ["  0.3\n", "\n", "0.9 ", "bad", "0.1"]

stripped = (line.strip() for line in lines)
non_empty = (line for line in stripped if line)
numbers = (float(line) for line in non_empty if line.replace(".", "", 1).isdigit())

print(list(numbers))  # [0.3, 0.9, 0.1]
```

Промежуточных списков не создается: каждая строка проходит всю цепочку целиком, и только потом берется следующая. Подробнее о таких конвейерах - в разделе [yield from и конвейеры](./yield-from-i-konveyery.md#konveyery-generatorov).

## Кортежного comprehension нет {#kortezhnogo-comprehension-net}

Круглые скобки создают генератор, а не кортеж:

```python
result = (x for x in range(3))
print(type(result))  # <class 'generator'>

result = tuple(x for x in range(3))
print(result)  # (0, 1, 2)
```

## Что выбрать {#chto-vybrat}

| Ситуация | Что выбрать |
| --- | --- |
| Результат сразу передается в `sum`, `max`, `any`, `join` | генераторное выражение |
| Данных много или они читаются из файла | генераторное выражение |
| Результат нужен несколько раз, нужен `len()` или индекс | list comprehension |
| Результат нужно вывести или отладить | list comprehension |
| Логика больше одной строки | генераторная функция с `yield` |

## Аналогия с JS {#analogiya-s-js}

В JS цепочки `map` и `filter` у массивов жадные: каждый шаг создает новый массив целиком.

```js
const scores = [0.2, 0.7, 0.9];

// жадно: как list comprehension, создаются промежуточные массивы
const high = scores.filter((s) => s > 0.5).map((s) => s * 100);
```

Ленивый аналог генераторного выражения - вспомогательные методы итераторов из ES2025:

```js
// лениво: как генераторное выражение
const highLazy = scores.values().filter((s) => s > 0.5).map((s) => s * 100);

highLazy.next();      // { value: 70, done: false }
[...highLazy];        // [90]
```

| Python | JS |
| --- | --- |
| `[f(x) for x in xs]` | `xs.map(f)` |
| `(f(x) for x in xs)` | `xs.values().map(f)` |
| `(x for x in xs if p(x))` | `xs.values().filter(p)` |
| `any(p(x) for x in xs)` | `xs.some(p)` |
| `all(p(x) for x in xs)` | `xs.every(p)` |
| `sum(x for x in xs)` | `xs.reduce((a, b) => a + b, 0)` |

## Частые ошибки {#chastye-oshibki}

1. Обходить генераторное выражение второй раз.
   Второй раз оно пустое. Если результат нужен несколько раз, используй список.

2. Ждать кортеж от `(x for x in ...)`.
   Это генератор. Для кортежа нужен `tuple(...)`.

3. Забыть скобки при нескольких аргументах.
   `sorted(x for x in xs, reverse=True)` дает `SyntaxError`.

4. Менять переменные из условия до перебора.
   Генератор увидит новое значение.

5. Печатать генератор, чтобы посмотреть результат.
   `print(gen)` покажет только `<generator object ...>`. Для отладки оберни в `list()`, но помни, что это исчерпает генератор.

## Практические задачи {#prakticheskie-zadachi}

### Задача 1 {#zadacha-1}

Есть список строк `["10", "x", "20", "", "5"]`. Одним выражением посчитай сумму всех строк, которые являются числами.

### Задача 2 {#zadacha-2}

Сравни через `sys.getsizeof` размер `[x for x in range(10**6)]` и `(x for x in range(10**6))`. Объясни разницу.

### Задача 3 {#zadacha-3}

Создай генератор `(x for x in data if x > limit)`, затем измени `limit` и `data` до перебора. Предскажи результат, потом проверь.

## Краткая шпаргалка {#kratkaya-shpargalka}

```python
gen = (x * 2 for x in xs if x > 0)  # ленивый генератор
total = sum(x * 2 for x in xs)      # скобки можно не писать
sorted((x for x in xs), reverse=True)  # при нескольких аргументах нужны
found = next((x for x in xs if x > 10), None)  # первый подходящий
as_tuple = tuple(x for x in xs)     # кортежного comprehension нет
```

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python Reference: Generator expressions', href: 'https://docs.python.org/3/reference/expressions.html#generator-expressions' },
        { title: 'Python Tutorial: Generator Expressions', href: 'https://docs.python.org/3/tutorial/classes.html#generator-expressions' },
        { title: 'PEP 289: Generator Expressions', href: 'https://peps.python.org/pep-0289/' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Comprehensions в Python', href: '/python/yazyk-python/1-core/comprehensions-v-python' },
        { title: 'Генераторы и yield', href: '/python/yazyk-python/iteratory-i-generatory/generatory-i-yield' },
        { title: 'yield from и конвейеры', href: '/python/yazyk-python/iteratory-i-generatory/yield-from-i-konveyery' },
        { title: 'Sorted и filter', href: '/python/yazyk-python/1-core/sorted-i-filter' },
    ]"
/>
