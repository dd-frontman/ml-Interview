---
title: "Генераторы и yield"
description: "Генераторные функции в Python: как работает yield, пошаговое выполнение, сохранение состояния, return в генераторе, бесконечные генераторы, ленивые ошибки, чтение файлов и батчи, аналогии с function* в JS."
tags:
  - "python"
  - "core"
  - "generators"
  - "yield"
updatedAt: "2026-10-22"
---
## Что такое генератор {#chto-takoe-generator}

Генераторная функция - это функция, в теле которой есть `yield`. Она ведет себя совсем не так, как обычная:

- вызов функции **не выполняет** ее тело, а возвращает объект-генератор;
- тело начинает выполняться при первом `next()`;
- на каждом `yield` функция отдает значение и **встает на паузу**;
- следующий `next()` продолжает выполнение с места паузы.

```python
def countdown(n: int):
    while n > 0:
        yield n
        n -= 1


gen = countdown(3)
print(gen)        # <generator object countdown at 0x...>
print(next(gen))  # 3
print(next(gen))  # 2
print(list(gen))  # [1]
```

Генератор - это итератор, поэтому с ним работает все, что работает с итераторами: `for`, `next()`, `list()`, `sum()` и так далее.

Простая аналогия: обычная функция похожа на повара, который готовит весь заказ и отдает его разом. Генератор похож на повара, который выносит блюда по одному: отдал первое, ждет, пока его позовут, потом готовит следующее.

## Пошаговое выполнение {#poshagovoe-vypolnenie}

Чтобы увидеть паузы, добавим `print`:

```python
def trace():
    print("start")
    yield 1
    print("after 1")
    yield 2
    print("end")


t = trace()
print("created")
print(next(t))
print(next(t))
next(t)
```

Вывод:

```text
created
start
1
after 1
2
end
StopIteration - исключение, генератор закончился
```

Что видно из вывода:

- `trace()` ничего не напечатал: тело не запускалось;
- первый `next()` выполнил код до первого `yield`;
- второй `next()` продолжил после `yield 1` и дошел до `yield 2`;
- третий `next()` дошел до конца функции, и генератор бросил `StopIteration`.

## Состояние сохраняется {#sostoyanie-sokhranyaetsya}

Пока генератор на паузе, все его локальные переменные живы. Поэтому генератор удобно использовать как счетчик или источник идентификаторов:

```python
def id_generator(prefix: str):
    number = 0
    while True:
        number += 1
        yield f"{prefix}-{number}"


ids = id_generator("run")
print(next(ids))  # run-1
print(next(ids))  # run-2
```

Обычной функции для этого понадобилась бы глобальная переменная, замыкание или класс.

Текущее состояние генератора можно посмотреть через `inspect`:

```python
import inspect

gen = countdown(2)
print(inspect.getgeneratorstate(gen))  # GEN_CREATED - еще не запускался
next(gen)
print(inspect.getgeneratorstate(gen))  # GEN_SUSPENDED - на паузе
list(gen)
print(inspect.getgeneratorstate(gen))  # GEN_CLOSED - закончился
```

## `yield` и `return` {#yield-i-return}

| | `return` | `yield` |
| --- | --- | --- |
| Сколько раз срабатывает | один, функция завершается | много, функция ставится на паузу |
| Что возвращает вызов функции | значение | объект-генератор |
| Локальные переменные после | удаляются | сохраняются до следующего `next()` |

`return` внутри генератора тоже можно писать. Он завершает генератор, а значение попадает в атрибут `value` исключения `StopIteration`:

```python
def load():
    yield "row 1"
    yield "row 2"
    return "загружено 2 строки"


gen = load()
next(gen)
next(gen)
try:
    next(gen)
except StopIteration as stop:
    print(stop.value)  # загружено 2 строки
```

`for` и `list()` это значение игнорируют. Получить его удобно через `yield from`, об этом в разделе [yield from и конвейеры](./yield-from-i-konveyery.md#vozvrat-znacheniya-cherez-yield-from).

## Генератор одноразовый {#generator-odnorazovyy}

Как и любой итератор, генератор нельзя обойти второй раз:

```python
gen = countdown(3)
print(sum(gen))  # 6
print(sum(gen))  # 0
```

Нужен новый обход - вызови функцию заново: `countdown(3)`.

## Бесконечные генераторы {#beskonechnye-generatory}

Генератор не обязан заканчиваться. Значения считаются только по запросу, поэтому бесконечный цикл внутри не вешает программу:

```python
def natural_numbers():
    n = 1
    while True:
        yield n
        n += 1


for n in natural_numbers():
    if n > 3:
        break
    print(n)  # 1, 2, 3
```

Взять первые `n` элементов удобно через `itertools.islice`:

```python
from itertools import islice

print(list(islice(natural_numbers(), 5)))  # [1, 2, 3, 4, 5]
```

Главное: никогда не вызывай `list()` или `sum()` на бесконечном генераторе, программа зависнет.

## Практика: чтение большого файла {#praktika-chtenie-bolshogo-fayla}

```python
def read_clean_lines(path: str):
    with open(path, encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if line:
                yield line


for line in read_clean_lines("train.csv"):
    ...
```

В памяти в каждый момент находится одна строка, поэтому размер файла не важен. Файл закроется, когда генератор дойдет до конца или когда его закроют через [`close()`](./upravlenie-generatorom-send-throw-close.md#close-ostanovit-generator).

## Практика: батчи для модели {#praktika-batchi-dlya-modeli}

```python
def iter_batches(items: list, batch_size: int):
    for start in range(0, len(items), batch_size):
        yield items[start : start + batch_size]


for batch in iter_batches(list(range(7)), batch_size=3):
    print(batch)

# [0, 1, 2]
# [3, 4, 5]
# [6]
```

Тот же прием подходит для постраничной загрузки из API: генератор запрашивает следующую страницу только тогда, когда предыдущая уже обработана.

```python
def fetch_all(fetch_page):
    page = 1
    while True:
        items = fetch_page(page)
        if not items:
            return
        yield from items
        page += 1
```

## Ошибки тоже ленивые {#oshibki-tozhe-lenivye}

Раз тело генератора не выполняется при вызове, ошибки внутри него тоже появятся позже:

```python
gen = read_clean_lines("missing.csv")  # ошибки нет
next(gen)  # FileNotFoundError - только здесь
```

Если проверку нужно сделать сразу, раздели функцию на две: обычная проверяет аргументы, а генератор делает работу.

```python
import os


def read_clean_lines(path: str):
    if not os.path.exists(path):
        raise FileNotFoundError(path)  # сработает сразу при вызове
    return _read_clean_lines(path)


def _read_clean_lines(path: str):
    with open(path, encoding="utf-8") as file:
        for line in file:
            if line.strip():
                yield line.strip()
```

## Не бросай `StopIteration` руками {#ne-brosay-stopiteration-rukami}

Внутри генератора для завершения используй `return`. Если бросить `StopIteration`, Python превратит его в `RuntimeError`:

```python
def bad():
    yield 1
    raise StopIteration


list(bad())
# RuntimeError: generator raised StopIteration
```

Так сделано специально: раньше случайный `StopIteration` из вложенного `next()` молча обрывал генератор, и такие ошибки было очень трудно найти.

## Аналогия с JS {#analogiya-s-js}

Генераторы в Python и JS почти одинаковые:

```js
function* countdown(n) {
  while (n > 0) {
    yield n;
    n--;
  }
}

const gen = countdown(3);
gen.next();  // { value: 3, done: false }
gen.next();  // { value: 2, done: false }
[...gen];    // [1]
```

| Python | JS |
| --- | --- |
| `def f(): ... yield` | `function* f() { ... yield }` |
| `next(gen)` | `gen.next().value` |
| `return x` в генераторе | `return x`, придет `{ value: x, done: true }` |
| `StopIteration` в конце | `{ done: true }` в конце |
| `list(gen)` | `[...gen]` |
| `inspect.getgeneratorstate(gen)` | нет аналога |

Отличие в синтаксисе: в JS генератор отмечается звездочкой `function*`, а в Python функция становится генератором просто из-за наличия `yield` где-то в теле.

## Частые ошибки {#chastye-oshibki}

1. Передать в `for` саму функцию, а не генератор.

```python
for x in countdown:  # TypeError: 'function' object is not iterable
    ...

for x in countdown(3):  # правильно
    ...
```

2. Ждать, что вызов генераторной функции что-то сделает.
   `countdown(3)` только создает генератор. Код внутри запустится при переборе.

3. Обходить генератор второй раз.
   Он уже исчерпан. Создай новый вызовом функции.

4. Вызывать `len()` или брать индекс.
   `len(gen)` дает `TypeError: object of type 'generator' has no len()`. Если нужна длина, собери список.

5. Вызвать `list()` на бесконечном генераторе.
   Программа зависнет. Ограничь через `islice` или `break`.

6. Добавить `yield` в функцию и не заметить этого.
   Функция перестает возвращать значение: `return result` уходит в `StopIteration.value`, а вызов возвращает генератор.

## Практические задачи {#prakticheskie-zadachi}

### Задача 1 {#zadacha-1}

Напиши генератор `fibonacci()`, который бесконечно отдает числа Фибоначчи. Выведи первые 10 через `islice`.

### Задача 2 {#zadacha-2}

Напиши генератор `read_numbers(path)`, который читает файл построчно, пропускает пустые строки и строки с `#` в начале, а остальные отдает как `float`.

### Задача 3 {#zadacha-3}

Добавь `print` в начало, середину и конец генератора `countdown`. Пошагово вызывай `next()` и объясни порядок вывода.

## Краткая шпаргалка {#kratkaya-shpargalka}

```python
def gen_func():
    yield 1         # отдать значение и встать на паузу
    yield 2
    return "итог"   # завершить, значение уйдет в StopIteration.value


gen = gen_func()    # тело еще не запущено
next(gen)           # 1
next(gen)           # 2
next(gen, None)     # None, генератор закончился
```

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Generators', href: 'https://docs.python.org/3/tutorial/classes.html#generators' },
        { title: 'Python Reference: yield expressions', href: 'https://docs.python.org/3/reference/expressions.html#yield-expressions' },
        { title: 'PEP 255: Simple Generators', href: 'https://peps.python.org/pep-0255/' },
        { title: 'PEP 479: StopIteration handling', href: 'https://peps.python.org/pep-0479/' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Собственный итератор', href: '/python/yazyk-python/iteratory-i-generatory/sobstvennyy-iterator' },
        { title: 'Генераторные выражения', href: '/python/yazyk-python/iteratory-i-generatory/generatornye-vyrazheniya' },
        { title: 'yield from и конвейеры', href: '/python/yazyk-python/iteratory-i-generatory/yield-from-i-konveyery' },
        { title: 'Файлы в Python', href: '/python/yazyk-python/1-core/fayly-v-python' },
    ]"
/>
