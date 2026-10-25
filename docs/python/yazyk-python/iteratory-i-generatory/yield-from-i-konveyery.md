---
title: "yield from и конвейеры генераторов"
description: "Как работает yield from в Python: передача работы другому генератору, рекурсивный обход вложенных структур и папок, получение return-значения, конвейеры обработки данных и аналогия с yield* в JS."
tags:
  - "python"
  - "core"
  - "generators"
  - "pipelines"
updatedAt: "2026-10-22"
---
## Зачем нужен `yield from` {#zachem-nuzhen-yield-from}

Часто генератор должен отдать все значения другого итерируемого объекта. Без `yield from` пишут цикл:

```python
def train_then_test(train: list, test: list):
    for row in train:
        yield row
    for row in test:
        yield row
```

`yield from` делает то же самое одной строкой:

```python
def train_then_test(train: list, test: list):
    yield from train
    yield from test


print(list(train_then_test([1, 2], [3])))  # [1, 2, 3]
```

Справа от `yield from` может быть любой итерируемый объект: список, строка, `range`, другой генератор.

```python
def demo():
    yield from range(2)
    yield from "ab"


print(list(demo()))  # [0, 1, 'a', 'b']
```

Простая аналогия: менеджер получает заказ и говорит «этим займется мой коллега». Пока коллега выдает результаты, менеджер просто передает их дальше, а когда коллега закончил, менеджер продолжает свою работу.

## Рекурсивный обход {#rekursivnyy-obkhod}

`yield from` особенно полезен в рекурсии. Разворачиваем вложенный список любой глубины:

```python
def flatten(items: list):
    for item in items:
        if isinstance(item, list):
            yield from flatten(item)  # вложенный список отдаем рекурсивно
        else:
            yield item


print(list(flatten([1, [2, [3, 4]], 5])))  # [1, 2, 3, 4, 5]
```

Без `yield from` пришлось бы писать `for x in flatten(item): yield x`.

Тот же прием - свой упрощенный `os.walk` для обхода папок:

```python
import os


def walk_dirs(root: str):
    yield root
    try:
        entries = list(os.scandir(root))
    except OSError:
        return  # нет доступа или папку удалили - пропускаем

    for entry in entries:
        if entry.is_dir(follow_symlinks=False):
            yield from walk_dirs(entry.path)


for path in walk_dirs(os.path.expanduser("~/Downloads")):
    print(path)
```

Генератор не собирает список всех папок заранее, а находит следующую только по запросу. Ограничение рекурсии: на очень глубоких деревьях, больше примерно 1000 уровней, будет `RecursionError`.

## Возврат значения через `yield from` {#vozvrat-znacheniya-cherez-yield-from}

Если вложенный генератор завершился через `return value`, это значение становится результатом выражения `yield from`:

```python
def load_part(rows: list):
    for row in rows:
        yield row
    return len(rows)  # сколько строк отдали


def load_all():
    first = yield from load_part(["a", "b"])
    second = yield from load_part(["c"])
    print("всего строк:", first + second)


print(list(load_all()))

# всего строк: 3
# ['a', 'b', 'c']
```

Через `for` такое значение не получить, `for` его игнорирует.

## `yield from` передает и управление {#yield-from-peredaet-i-upravlenie}

`yield from` не просто перебирает вложенный генератор. Он связывает внешний код с внутренним генератором напрямую: значения из `send()`, исключения из `throw()` и вызов `close()` тоже проходят насквозь. Подробнее об этих методах - в разделе [Управление генератором](./upravlenie-generatorom-send-throw-close.md).

## Конвейеры генераторов {#konveyery-generatorov}

Конвейер - это цепочка генераторов, где каждый берет данные у предыдущего и отдает следующему. Похоже на Unix-команды через `|`: `cat log.txt | grep ERROR | head`.

```python
def read(rows):
    for row in rows:
        print("read", row)
        yield row


def parse(rows):
    for row in rows:
        print("parse", row)
        yield int(row)


def only_even(numbers):
    for n in numbers:
        if n % 2 == 0:
            yield n


pipeline = only_even(parse(read(["1", "2"])))

for n in pipeline:
    print("got", n)
```

Вывод:

```text
read 1
parse 1
read 2
parse 2
got 2
```

Важно, что элементы идут по одному через всю цепочку, а не этапами. Сначала первый элемент проходит `read`, `parse` и `only_even`, потом второй. Поэтому:

- в памяти одновременно находится один элемент, даже если строк миллиард;
- первый результат появляется сразу, не нужно ждать обработки всего файла;
- каждый этап - маленькая функция, которую легко тестировать отдельно.

## Практика: конвейер для логов {#praktika-konveyer-dlya-logov}

```python
import json


def read_lines(path: str):
    with open(path, encoding="utf-8") as file:
        yield from file


def parse_json(lines):
    for line in lines:
        try:
            yield json.loads(line)
        except json.JSONDecodeError:
            continue  # битые строки пропускаем


def only_errors(events):
    for event in events:
        if event.get("level") == "error":
            yield event


def batch(items, size: int):
    current = []
    for item in items:
        current.append(item)
        if len(current) == size:
            yield current
            current = []
    if current:
        yield current


events = only_errors(parse_json(read_lines("app.jsonl")))
for chunk in batch(events, size=100):
    print(len(chunk))  # например, отправить пачку в хранилище
```

`yield from file` здесь работает потому, что открытый файл - итератор по строкам.

## Аналогия с JS {#analogiya-s-js}

В JS `yield from` называется `yield*`, и работает так же, включая возврат значения:

```js
function* loadPart(rows) {
  yield* rows;
  return rows.length;
}

function* loadAll() {
  const first = yield* loadPart(["a", "b"]);
  const second = yield* loadPart(["c"]);
  console.log("всего строк:", first + second);
}

[...loadAll()];  // ["a", "b", "c"], в консоли "всего строк: 3"
```

| Python | JS |
| --- | --- |
| `yield from iterable` | `yield* iterable` |
| `result = yield from gen()` | `const result = yield* gen()` |
| конвейер генераторов | Node.js streams и `pipeline`, RxJS |

## Частые ошибки {#chastye-oshibki}

1. Написать `yield` вместо `yield from`.

```python
def wrong():
    yield [1, 2]  # отдаст сам список одним элементом


def right():
    yield from [1, 2]  # отдаст 1, потом 2
```

2. Вызвать генератор и ничего с ним не сделать.

```python
def outer():
    inner()       # создан генератор, но не запущен
    yield from inner()  # правильно
```

3. Ждать, что этапы конвейера выполняются по очереди целиком.
   Элементы проходят цепочку по одному. Если этап должен видеть все данные сразу, например для сортировки, ему придется собрать список.

4. Использовать рекурсию с `yield from` на очень глубоких структурах.
   Будет `RecursionError`. Для глубоких деревьев делай обход через свой стек.

## Практические задачи {#prakticheskie-zadachi}

### Задача 1 {#zadacha-1}

Напиши генератор `chain_all(*iterables)`, который по очереди отдает элементы всех переданных итерируемых объектов. Используй `yield from`.

### Задача 2 {#zadacha-2}

Напиши генератор, который обходит вложенный словарь вида `{"a": {"b": 1, "c": {"d": 2}}}` и отдает пары `("a.b", 1)`, `("a.c.d", 2)`.

### Задача 3 {#zadacha-3}

Собери конвейер из трех генераторов: чтение строк файла, перевод в `float` с пропуском ошибок, фильтр значений больше `0.5`. Добавь `print` в каждый этап и посмотри порядок вывода.

## Краткая шпаргалка {#kratkaya-shpargalka}

```python
def gen():
    yield from [1, 2]           # отдать все элементы
    result = yield from other() # получить return вложенного генератора


def flatten(items):
    for item in items:
        if isinstance(item, list):
            yield from flatten(item)
        else:
            yield item


pipeline = step3(step2(step1(source)))  # конвейер
```

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python Reference: yield expressions', href: 'https://docs.python.org/3/reference/expressions.html#yield-expressions' },
        { title: 'PEP 380: yield from', href: 'https://peps.python.org/pep-0380/' },
        { title: 'Python: os.scandir()', href: 'https://docs.python.org/3/library/os.html#os.scandir' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Генераторы и yield', href: '/python/yazyk-python/iteratory-i-generatory/generatory-i-yield' },
        { title: 'Управление генератором', href: '/python/yazyk-python/iteratory-i-generatory/upravlenie-generatorom-send-throw-close' },
        { title: 'Модуль itertools', href: '/python/yazyk-python/iteratory-i-generatory/modul-itertools' },
        { title: 'JSON и сериализация', href: '/python/ekosistema-python/json-i-serializatsiya' },
    ]"
/>
