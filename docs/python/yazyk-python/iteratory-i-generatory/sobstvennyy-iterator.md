---
title: "Собственный итератор: __iter__ и __next__"
description: "Как сделать свой класс перебираемым в Python: протокол итератора, одноразовые итераторы, многоразовые контейнеры, __iter__ через генератор, старый протокол __getitem__ и аналогии с JS."
tags:
  - "python"
  - "core"
  - "iterators"
  - "classes"
updatedAt: "2026-10-22"
---
## Протокол итератора {#protokol-iteratora}

Чтобы объект можно было перебирать в `for`, Python ищет у него специальные методы:

- `__iter__()` - вернуть итератор. У самого итератора этот метод возвращает `self`;
- `__next__()` - вернуть следующий элемент или бросить `StopIteration`, если элементы закончились.

`iter(obj)` вызывает `obj.__iter__()`, а `next(it)` вызывает `it.__next__()`. Вся остальная механика перебора построена на этих двух методах.

## Первый итератор {#pervyy-iterator}

Обратный отсчет:

```python
class Countdown:
    def __init__(self, start: int) -> None:
        self.current = start

    def __iter__(self):
        return self

    def __next__(self) -> int:
        if self.current <= 0:
            raise StopIteration

        value = self.current
        self.current -= 1
        return value


for n in Countdown(3):
    print(n)

# 3
# 2
# 1
```

Что происходит по шагам:

1. `for` вызывает `iter(Countdown(3))`, и `__iter__` возвращает сам объект.
2. `for` вызывает `next()`: `__next__` возвращает `3` и уменьшает `current`.
3. Так продолжается до `current == 0`.
4. `__next__` бросает `StopIteration`, `for` его ловит и завершает цикл.

Состояние итератора - это обычные атрибуты объекта, здесь `self.current`.

## Пример с данными: батчи {#primer-s-dannymi-batchi}

```python
class BatchIterator:
    def __init__(self, rows: list[dict], batch_size: int) -> None:
        self.rows = rows
        self.batch_size = batch_size
        self.position = 0

    def __iter__(self):
        return self

    def __next__(self) -> list[dict]:
        if self.position >= len(self.rows):
            raise StopIteration

        batch = self.rows[self.position : self.position + self.batch_size]
        self.position += self.batch_size
        return batch


rows = [{"id": 1}, {"id": 2}, {"id": 3}]
for batch in BatchIterator(rows, batch_size=2):
    print(batch)

# [{'id': 1}, {'id': 2}]
# [{'id': 3}]
```

## Проблема: итератор одноразовый {#problema-iterator-odnorazovyy}

```python
batches = BatchIterator(rows, batch_size=2)

print(len(list(batches)))  # 2
print(len(list(batches)))  # 0 - position уже в конце
```

Для итератора это нормально: закладка дошла до конца книги. Но если объект описывает набор данных, который хочется обходить на каждой эпохе обучения, такое поведение мешает.

## Решение: контейнер отдельно от итератора {#reshenie-konteyner-otdelno-ot-iteratora}

Контейнер хранит данные, а при каждом `iter()` создает новый итератор:

```python
class Dataset:
    def __init__(self, rows: list[dict], batch_size: int) -> None:
        self.rows = rows
        self.batch_size = batch_size

    def __iter__(self) -> BatchIterator:
        return BatchIterator(self.rows, self.batch_size)  # новая закладка


dataset = Dataset(rows, batch_size=2)

for epoch in range(2):
    for batch in dataset:
        print(epoch, batch)

# 0 [{'id': 1}, {'id': 2}]
# 0 [{'id': 3}]
# 1 [{'id': 1}, {'id': 2}]
# 1 [{'id': 3}]
```

Так устроены `list`, `dict` и `range`: сами они итерируемые, а итератор каждый раз новый.

## Короткий путь: `__iter__` через генератор {#korotkiy-put-iter-cherez-generator}

Писать отдельный класс итератора не обязательно. Если `__iter__` содержит `yield`, он становится генераторной функцией и при каждом вызове возвращает новый генератор:

```python
class Dataset:
    def __init__(self, rows: list[dict], batch_size: int) -> None:
        self.rows = rows
        self.batch_size = batch_size

    def __iter__(self):
        for start in range(0, len(self.rows), self.batch_size):
            yield self.rows[start : start + self.batch_size]
```

Поведение то же, что у пары `Dataset` + `BatchIterator`, но без ручного `position` и `StopIteration`. На практике чаще всего пишут именно так. Подробнее о `yield` - в разделе [Генераторы и yield](./generatory-i-yield.md).

## Старый протокол: `__getitem__` {#staryy-protokol-getitem}

Если у класса нет `__iter__`, но есть `__getitem__`, `for` все равно сработает. Python будет вызывать `obj[0]`, `obj[1]` и так далее, пока не получит `IndexError`:

```python
class Squares:
    def __getitem__(self, index: int) -> int:
        if index >= 3:
            raise IndexError
        return index * index


print(list(Squares()))  # [0, 1, 4]
```

Это наследие старых версий Python. Новый код так не пишут, но знать полезно: `isinstance(Squares(), Iterable)` вернет `False`, хотя перебрать объект можно.

## Аналогия с JS {#analogiya-s-js}

Тот же `Countdown` в JS:

```js
class Countdown {
  constructor(start) {
    this.current = start;
  }

  [Symbol.iterator]() {   // __iter__
    return this;
  }

  next() {                // __next__
    if (this.current <= 0) {
      return { value: undefined, done: true };  // raise StopIteration
    }
    return { value: this.current--, done: false };
  }
}

for (const n of new Countdown(3)) console.log(n);  // 3, 2, 1
```

А многоразовый контейнер с генератором в JS выглядит почти так же, как в Python:

```js
class Dataset {
  constructor(rows, batchSize) {
    this.rows = rows;
    this.batchSize = batchSize;
  }

  *[Symbol.iterator]() {
    for (let start = 0; start < this.rows.length; start += this.batchSize) {
      yield this.rows.slice(start, start + this.batchSize);
    }
  }
}
```

| Python | JS |
| --- | --- |
| `def __iter__(self)` | `[Symbol.iterator]()` |
| `def __next__(self)` | `next()` |
| `return value` | `return { value, done: false }` |
| `raise StopIteration` | `return { done: true }` |
| `__iter__` с `yield` | `*[Symbol.iterator]()` |

## Частые ошибки {#chastye-oshibki}

1. `__iter__` возвращает не итератор.

```python
class Bad:
    def __iter__(self):
        return [1, 2]

iter(Bad())
# TypeError: iter() returned non-iterator of type 'list'
```

Нужно вернуть итератор: `return iter([1, 2])`, или написать `__iter__` через `yield`.

2. Возвращать `None` в конце вместо `StopIteration`.
   Цикл не закончится и будет бесконечно получать `None`.

3. Хранить позицию в контейнере, а не в итераторе.
   Объект становится одноразовым, а два вложенных `for` по нему мешают друг другу.

4. Забыть сдвинуть состояние в `__next__`.
   Итератор бесконечно отдает один и тот же элемент.

5. Писать класс итератора, когда хватит генератора.
   Если не нужны дополнительные методы и сложное состояние, `__iter__` с `yield` короче и надежнее.

## Практические задачи {#prakticheskie-zadachi}

### Задача 1 {#zadacha-1}

Напиши класс `Range2(start, stop, step)` с `__iter__` и `__next__`, который повторяет поведение `range` для положительного шага.

### Задача 2 {#zadacha-2}

Сделай класс `Sentence(text)`, который при переборе отдает слова. Проверь, что его можно обойти два раза подряд.

### Задача 3 {#zadacha-3}

Перепиши `BatchIterator` так, чтобы `__iter__` контейнера был генератором. Сравни количество строк кода.

## Краткая шпаргалка {#kratkaya-shpargalka}

```python
class Iterator:
    def __iter__(self):
        return self

    def __next__(self):
        if ...:  # элементы закончились
            raise StopIteration
        return ...


class Container:
    def __iter__(self):
        yield ...  # новый генератор при каждом обходе
```

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Iterators', href: 'https://docs.python.org/3/tutorial/classes.html#iterators' },
        { title: 'Python: Iterator Types', href: 'https://docs.python.org/3/library/stdtypes.html#iterator-types' },
        { title: 'Python Data model: __iter__', href: 'https://docs.python.org/3/reference/datamodel.html#object.__iter__' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Iterable и iterator', href: '/python/yazyk-python/iteratory-i-generatory/iterable-i-iterator' },
        { title: 'Генераторы и yield', href: '/python/yazyk-python/iteratory-i-generatory/generatory-i-yield' },
        { title: 'Класс и экземпляр', href: '/python/yazyk-python/klassy/klass-i-ekzemplyar' },
        { title: 'Инициализация, self и методы', href: '/python/yazyk-python/klassy/init-self-atributy-i-metody' },
    ]"
/>
