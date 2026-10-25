---
title: "Iterable и iterator: протокол итерации"
description: "Разница между итерируемым объектом и итератором в Python, функции iter и next, StopIteration, устройство цикла for, исчерпание итератора и аналогии с JS."
tags:
  - "python"
  - "core"
  - "iterators"
updatedAt: "2026-10-22"
---
## Два разных понятия {#dva-raznykh-ponyatiya}

Эти два слова часто путают, хотя это разные вещи.

**Итерируемый объект (iterable)** - то, что можно перебрать в `for`. Это список, кортеж, строка, словарь, множество, `range`, файл.

**Итератор (iterator)** - объект, который отдает элементы по одному и помнит, на каком элементе остановился.

Простая аналогия: итерируемый объект - это книга, итератор - закладка в ней. Книга сама не знает, какую страницу ты читаешь, это знает закладка. Из одной книги можно сделать сколько угодно закладок, и каждая будет двигаться независимо.

```python
scores = [0.2, 0.7, 0.9]   # книга

first = iter(scores)       # закладка 1
second = iter(scores)      # закладка 2

print(next(first))   # 0.2
print(next(first))   # 0.7
print(next(second))  # 0.2, вторая закладка начинает с начала
```

## Функции `iter()` и `next()` {#funktsii-iter-i-next}

- `iter(obj)` просит объект предоставить итератор. Для списка создается новый итератор, а уже существующий итератор возвращает сам себя.
- `next(it)` берет из итератора следующий элемент.

```python
labels = ["cat", "dog"]
it = iter(labels)

print(type(it))  # <class 'list_iterator'>
print(next(it))  # cat
print(next(it))  # dog
print(next(it))  # StopIteration
```

## Как понять `iter()` совсем простыми словами {#kak-ponyat-iter-sovsem-prostymi-slovami}

Представь список как книгу:

```python
numbers = [10, 20, 30]
```

В книге находятся все элементы, но сама книга не хранит текущую позицию чтения.

Вызов `iter(numbers)` создает закладку:

```python
iterator = iter(numbers)
```

Закладка запоминает, какой элемент нужно выдать следующим. Сам список при этом не изменяется.

```text
Список:   [10, 20, 30]
           ^
           следующая позиция итератора
```

## Как двигается закладка через `next()` {#kak-dvigaetsya-zakladka-cherez-next}

Каждый вызов `next(iterator)` берет текущий элемент и передвигает закладку вперед:

```python
numbers = [10, 20, 30]
iterator = iter(numbers)

first = next(iterator)   # 10
second = next(iterator)  # 20
third = next(iterator)   # 30
```

После первого вызова положение можно представить так:

```text
Список:   [10, 20, 30]
               ^
               следующая позиция итератора
```

После третьего вызова закладка находится за последним элементом. Еще один `next(iterator)` вызовет `StopIteration`.

## У каждого итератора своя позиция {#u-kazhdogo-iteratora-svoya-pozitsiya}

Для одного списка можно создать несколько независимых итераторов:

```python
numbers = [10, 20, 30]

first_iterator = iter(numbers)
second_iterator = iter(numbers)

next(first_iterator)   # 10
next(first_iterator)   # 20
next(second_iterator)  # 10, второй начинает с начала
```

Первый итератор уже дошел до `30`, а второй только до `20`. Они читают один список, но хранят разные позиции.

Кратко:

```text
Итерируемый объект — данные, по которым можно пройти.
Итератор — отдельный объект с текущей позицией обхода.
iter(obj) — получить итератор.
next(iterator) — взять следующий элемент и сдвинуть позицию.
```

У `next()` есть второй аргумент - значение по умолчанию. Тогда вместо исключения вернется это значение:

```python
it = iter([])
print(next(it, "пусто"))  # пусто
```

Это удобно, когда нужно взять первый подходящий элемент:

```python
scores = [0.1, 0.4, 0.8, 0.95]
first_high = next((s for s in scores if s > 0.5), None)
print(first_high)  # 0.8
```

## `StopIteration` {#stopiteration}

Когда элементы закончились, `next()` бросает исключение `StopIteration`. Это не ошибка программы, а сигнал «больше ничего нет».

```python
it = iter([1])
next(it)  # 1

try:
    next(it)
except StopIteration:
    print("элементы закончились")
```

В обычном коде `StopIteration` руками почти не ловят: это за тебя делает `for`.

## Как на самом деле работает `for` {#kak-na-samom-dele-rabotaet-for}

Цикл

```python
for label in ["cat", "dog"]:
    print(label)
```

Python выполняет примерно так:

```python
it = iter(["cat", "dog"])      # 1. получить итератор
while True:
    try:
        label = next(it)       # 2. взять следующий элемент
    except StopIteration:      # 3. элементы кончились - выйти
        break
    print(label)               # 4. тело цикла
```

Из этого следуют важные выводы:

- `for` работает с любым объектом, у которого можно получить итератор;
- `for` сам ловит `StopIteration`, поэтому ты его не видишь;
- те же `iter()` и `next()` вызывают внутри себя `list()`, `sum()`, `max()`, `in`, распаковка `a, b = obj` и многие другие функции.

## Итератор тоже итерируемый {#iterator-tozhe-iteriruemyy}

У итератора `iter()` возвращает его самого:

```python
it = iter([1, 2, 3])
print(iter(it) is it)  # True
```

Поэтому итератор можно передать в `for`. Но новой закладки не появится: цикл продолжит с того места, где итератор остановился.

```python
it = iter([1, 2, 3, 4])
next(it)  # 1

for x in it:
    print(x)  # 2, 3, 4
```

## Исчерпание итератора {#ischerpanie-iteratora}

Итератор одноразовый. Когда он дошел до конца, повторный обход ничего не даст.

```python
names = map(str.upper, ["cat", "dog"])

print(list(names))  # ['CAT', 'DOG']
print(list(names))  # [] - итератор уже исчерпан
```

А `range` и список - итерируемые объекты, но не итераторы. Каждый `for` получает от них новый итератор, поэтому обходить их можно сколько угодно:

```python
r = range(3)
print(list(r))  # [0, 1, 2]
print(list(r))  # [0, 1, 2]
```

## `in` тоже расходует итератор {#in-tozhe-raskhoduet-iterator}

Проверка `x in iterator` двигает итератор вперед до найденного элемента:

```python
numbers = iter([1, 2, 3, 4])

print(3 in numbers)   # True, при этом прочитаны 1, 2, 3
print(list(numbers))  # [4]
```

## Что итератор, а что нет {#chto-iterator-a-chto-net}

| Объект | Итерируемый | Итератор | Повторный обход |
| --- | --- | --- | --- |
| `list`, `tuple`, `str` | да | нет | да |
| `dict`, `set` | да | нет | да |
| `range(n)` | да | нет | да |
| `iter(list)` | да | да | нет |
| `map`, `filter`, `zip` | да | да | нет |
| `enumerate`, `reversed` | да | да | нет |
| открытый файл | да | да | нет |
| генератор | да | да | нет |

Частый сюрприз после JS: `map` и `filter` в Python возвращают не список, а одноразовый итератор.

## Как проверить {#kak-proverit}

```python
from collections.abc import Iterable, Iterator

print(isinstance([1, 2], Iterable))        # True
print(isinstance([1, 2], Iterator))        # False
print(isinstance(iter([1, 2]), Iterator))  # True
```

Самый надежный способ проверить, можно ли перебрать объект, - вызвать `iter()` и поймать `TypeError`:

```python
def is_iterable(obj) -> bool:
    try:
        iter(obj)
    except TypeError:
        return False
    return True


print(is_iterable(42))     # False
print(is_iterable("abc"))  # True
```

`isinstance(obj, Iterable)` не увидит старый способ перебора через `__getitem__`, а `iter()` его учитывает. Подробнее в разделе про [собственный итератор](./sobstvennyy-iterator.md#staryy-protokol-getitem).

## Изменение коллекции во время обхода {#izmenenie-kollektsii-vo-vremya-obkhoda}

Итератор списка хранит текущий индекс. Если удалить элемент во время обхода, индексы сдвинутся, и следующий элемент будет пропущен:

```python
nums = [1, 2, 2, 3]
for n in nums:
    if n == 2:
        nums.remove(n)

print(nums)  # [1, 2, 3] - вторая двойка пропущена
```

Словарь и множество в такой ситуации сразу падают:

```python
data = {"a": 1, "b": 2}
for key in data:
    data["c"] = 3
# RuntimeError: dictionary changed size during iteration
```

Решение: собирать новую коллекцию или перебирать копию.

```python
nums = [1, 2, 2, 3]
nums = [n for n in nums if n != 2]  # [1, 3]

for key in list(data):  # перебираем копию ключей
    ...
```

## Аналогия с JS {#analogiya-s-js}

В JS тот же протокол, только устроен чуть иначе:

```js
const labels = ["cat", "dog"];
const it = labels[Symbol.iterator]();  // iter(labels)

it.next();  // { value: "cat", done: false }  - next(it)
it.next();  // { value: "dog", done: false }
it.next();  // { value: undefined, done: true } - в Python здесь StopIteration
```

| Python | JS |
| --- | --- |
| `iter(obj)` | `obj[Symbol.iterator]()` |
| `next(it)` | `it.next().value` |
| `StopIteration` | `{ done: true }` |
| `for x in obj` | `for (const x of obj)` |
| `list(it)` | `[...it]` или `Array.from(it)` |
| `next(it, default)` | ручная проверка `done` |

Разница на практике: в JS забытый конец итератора даст `undefined`, а в Python упадет с `StopIteration`.

## Частые ошибки {#chastye-oshibki}

1. Обходить итератор второй раз.
   После первого `list(it)` он пустой. Если данные нужны несколько раз, сохрани их в список.

2. Путать итерируемый объект и итератор.
   `next([1, 2])` упадет с `TypeError: 'list' object is not an iterator`. Сначала нужен `iter()`.

3. Проверять `in` на итераторе и потом ожидать полный обход.
   `in` уже прочитал часть элементов.

4. Удалять элементы из списка во время `for`.
   Элементы пропускаются. Собирай новый список.

5. Вызывать `next()` без значения по умолчанию там, где элементов может не быть.
   Используй `next(it, None)`.

## Практические задачи {#prakticheskie-zadachi}

### Задача 1 {#zadacha-1}

Перепиши цикл `for word in ["a", "b", "c"]: print(word)` через `iter()`, `next()` и `while True` с обработкой `StopIteration`.

### Задача 2 {#zadacha-2}

Есть список вероятностей `[0.1, 0.3, 0.7, 0.2]`. Одной строкой с `next()` найди первую вероятность больше `0.5`. Если такой нет, верни `None`.

### Задача 3 {#zadacha-3}

Создай `it = iter(range(10))`. Проверь `5 in it`, затем выведи `list(it)`. Объясни результат.

## Краткая шпаргалка {#kratkaya-shpargalka}

```python
it = iter([1, 2, 3])  # итератор из итерируемого объекта
next(it)              # 1
next(it, None)        # 2, а в конце будет None вместо исключения
iter(it) is it        # True, итератор возвращает сам себя
list(it)              # [3], дочитать остаток
list(it)              # [], итератор исчерпан
```

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python: iter()', href: 'https://docs.python.org/3/library/functions.html#iter' },
        { title: 'Python: next()', href: 'https://docs.python.org/3/library/functions.html#next' },
        { title: 'Python: Iterator Types', href: 'https://docs.python.org/3/library/stdtypes.html#iterator-types' },
        { title: 'Python: collections.abc', href: 'https://docs.python.org/3/library/collections.abc.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Итераторы и генераторы: обзор', href: '/python/yazyk-python/iteratory-i-generatory/iteratory-i-generatory-glavnaya' },
        { title: 'Собственный итератор', href: '/python/yazyk-python/iteratory-i-generatory/sobstvennyy-iterator' },
        { title: 'Генераторы и yield', href: '/python/yazyk-python/iteratory-i-generatory/generatory-i-yield' },
        { title: 'Цикл for и range', href: '/python/yazyk-python/1-core/tsikly-for-i-range' },
    ]"
/>
