---
title: "Управление генератором: send, throw и close"
description: "Двусторонняя связь с генератором в Python: yield как выражение, send и запуск генератора, throw для передачи исключения, close и GeneratorExit, состояния генератора, связь с корутинами и аналогии с JS."
tags:
  - "python"
  - "core"
  - "generators"
  - "coroutines"
updatedAt: "2026-10-22"
---
## `yield` как выражение {#yield-kak-vyrazhenie}

До сих пор данные шли только наружу: генератор отдавал значения через `yield`. Но `yield` - это еще и выражение, которое может **получить** значение снаружи:

```python
received = yield value
```

Эта строка делает две вещи:

1. отдает `value` наружу и ставит генератор на паузу;
2. когда генератор продолжат, `received` получит значение, переданное через `send()`.

Если генератор продолжили обычным `next()`, `received` будет `None`.

Простая аналогия: генератор - сотрудник у окошка. Через `yield` он выдает тебе бланк и ждет. Через `send()` ты возвращаешь заполненный бланк, сотрудник его обрабатывает и выдает следующий.

## `send()`: передать значение внутрь {#send-peredat-znachenie-vnutr}

Классический пример - скользящее среднее:

```python
def averager():
    total = 0
    count = 0
    average = None
    while True:
        value = yield average   # отдать текущее среднее, получить новое число
        total += value
        count += 1
        average = total / count


avg = averager()
print(next(avg))       # None - запустили генератор до первого yield
print(avg.send(10))    # 10.0
print(avg.send(20))    # 15.0
print(avg.send(30))    # 20.0
```

Что происходит при `avg.send(20)`:

| Шаг | Что делает генератор |
| --- | --- |
| 1 | просыпается на `yield`, `value` получает `20` |
| 2 | `total = 30`, `count = 2`, `average = 15.0` |
| 3 | доходит до следующего `yield average`, отдает `15.0` и засыпает |

`send()` одновременно передает значение внутрь и возвращает следующее значение генератора.

## Первый запуск {#pervyy-zapusk}

Только что созданный генератор еще не дошел ни до одного `yield`, поэтому значение некуда положить:

```python
avg = averager()
avg.send(10)
# TypeError: can't send non-None value to a just-started generator
```

Сначала генератор нужно запустить до первого `yield`. Есть два равнозначных способа:

```python
avg = averager()
next(avg)          # способ 1
# или
avg.send(None)     # способ 2
```

Чтобы не забывать про этот шаг, используют декоратор:

```python
from functools import wraps


def primed(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        gen = func(*args, **kwargs)
        next(gen)
        return gen
    return wrapper


@primed
def averager():
    ...
```

Подробнее про декораторы - в разделе [Декораторы](../1-core/dekoratory-v-python.md).

## `throw()`: бросить исключение внутрь {#throw-brosit-isklyuchenie-vnutr}

`gen.throw(error)` бросает исключение в том месте, где генератор стоит на паузе, то есть прямо на строке с `yield`. Генератор может его поймать и продолжить работу:

```python
def resilient_reader():
    while True:
        try:
            yield "ok"
        except ValueError as error:
            print("пропускаю:", error)


reader = resilient_reader()
next(reader)
print(reader.throw(ValueError("битая строка")))

# пропускаю: битая строка
# ok
```

Если генератор исключение не поймал, оно вылетит наружу из вызова `throw()`, а генератор закроется.

Где пригодится: сообщить генератору об ошибке снаружи, например «соединение потеряно» или «данные невалидны», чтобы он сам решил, пропустить элемент или завершиться.

## `close()`: остановить генератор {#close-ostanovit-generator}

`gen.close()` бросает внутрь специальное исключение `GeneratorExit`. Благодаря этому выполняются блоки `finally` и закрываются ресурсы `with`:

```python
def read_rows():
    print("открыли соединение")
    try:
        yield 1
        yield 2
        yield 3
    finally:
        print("закрыли соединение")


rows = read_rows()
print(next(rows))
rows.close()

# открыли соединение
# 1
# закрыли соединение
```

После `close()` генератор исчерпан, и `next()` бросит `StopIteration`.

Python сам вызывает `close()`, когда генератор удаляется сборщиком мусора. Но надежнее закрывать явно, особенно если генератор держит файл или соединение и его бросили на середине.

Для этого есть `contextlib.closing`:

```python
from contextlib import closing

with closing(read_rows()) as rows:
    for row in rows:
        if row == 2:
            break
# закрыли соединение - даже после break
```

Нельзя игнорировать `GeneratorExit` и продолжать отдавать значения:

```python
def stubborn():
    while True:
        try:
            yield 1
        except GeneratorExit:
            yield 2  # так нельзя


gen = stubborn()
next(gen)
gen.close()
# RuntimeError: generator ignored GeneratorExit
```

## Состояния генератора {#sostoyaniya-generatora}

```python
import inspect

inspect.getgeneratorstate(gen)
```

| Состояние | Что значит |
| --- | --- |
| `GEN_CREATED` | создан, тело еще не запускалось |
| `GEN_RUNNING` | выполняется прямо сейчас |
| `GEN_SUSPENDED` | стоит на паузе на `yield` |
| `GEN_CLOSED` | завершился или закрыт через `close()` |

## Сводная таблица методов {#svodnaya-tablitsa-metodov}

| Метод | Что передает внутрь | Что возвращает |
| --- | --- | --- |
| `next(gen)` | `None` в выражение `yield` | следующее значение |
| `gen.send(value)` | `value` в выражение `yield` | следующее значение |
| `gen.throw(error)` | исключение на строке `yield` | следующее значение, если исключение поймано |
| `gen.close()` | `GeneratorExit` на строке `yield` | `None` |

## Связь с корутинами и `asyncio` {#svyaz-s-korutinami-i-asyncio}

Генератор, который принимает значения через `send()`, называют корутиной: это функция, которая умеет вставать на паузу, получать данные и продолжать работу.

Именно на генераторах, `send()` и `yield from` когда-то был построен `asyncio`: до Python 3.5 асинхронный код писали через `@asyncio.coroutine` и `yield from`. Потом появился отдельный синтаксис `async def` и `await`, а старый декоратор удалили в Python 3.11. Но идея осталась прежней: задача встает на паузу на `await`, а цикл событий переключается на другую задачу.

Как это выглядит на простых генераторах, разобрано в разделе [Генераторы как простая многозадачность](./generatory-kak-mnogozadachnost.md). Как работать с современным `asyncio`, разобрано в разделе [Asyncio: корутины, задачи и TaskGroup](../asyncio-korutiny-i-taskgroup.md).

## Аналогия с JS {#analogiya-s-js}

В JS все три метода тоже есть:

```js
function* averager() {
  let total = 0;
  let count = 0;
  let average = null;
  while (true) {
    const value = yield average;
    total += value;
    count++;
    average = total / count;
  }
}

const avg = averager();
avg.next();            // запуск, как next(avg) в Python
avg.next(10).value;    // 10, как avg.send(10)
avg.next(20).value;    // 15
```

| Python | JS |
| --- | --- |
| `gen.send(value)` | `gen.next(value)` |
| `gen.throw(error)` | `gen.throw(error)` |
| `gen.close()` | `gen.return()` |
| `GeneratorExit` внутри | исключения нет, просто выполняются блоки `finally` |
| `send(value)` до запуска дает `TypeError` | значение первого `next(value)` молча теряется |

Последнее отличие важно: в JS ошибки при первом вызове не будет, значение просто пропадет. В Python ты сразу узнаешь, что забыл запустить генератор.

## Частые ошибки {#chastye-oshibki}

1. Вызвать `send(value)` сразу после создания генератора.
   Будет `TypeError`. Сначала `next(gen)` или `send(None)`.

2. Ждать, что `send()` только передает значение.
   Он еще и продвигает генератор до следующего `yield` и возвращает его значение.

3. Не закрыть генератор, который держит ресурс.
   Используй `close()`, `contextlib.closing` или дочитывай до конца.

4. Продолжать `yield` после `GeneratorExit`.
   Будет `RuntimeError`. В обработчике `GeneratorExit` только освобождай ресурсы.

5. Писать новые корутины на генераторах.
   Для асинхронного кода используй `async def` и `await`. `send()` нужен в редких случаях и для понимания, как устроен `asyncio`.

## Практические задачи {#prakticheskie-zadachi}

### Задача 1 {#zadacha-1}

Напиши корутину `running_max()`, которая принимает числа через `send()` и каждый раз возвращает текущий максимум.

### Задача 2 {#zadacha-2}

Напиши генератор с `try/finally`, который печатает «начало» и «конец». Прерви его через `break` внутри `with closing(...)` и убедись, что «конец» напечатан.

### Задача 3 {#zadacha-3}

Напиши генератор, который отдает числа от 1 до бесконечности, а при получении `ValueError` через `throw()` начинает счет заново.

## Краткая шпаргалка {#kratkaya-shpargalka}

```python
def coro():
    while True:
        received = yield "ответ"  # отдать наружу и получить из send()


gen = coro()
next(gen)                  # запуск до первого yield
gen.send(42)               # received = 42, вернет следующий yield
gen.throw(ValueError("x")) # исключение на строке yield
gen.close()                # GeneratorExit, выполнится finally
```

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python Reference: Generator-iterator methods', href: 'https://docs.python.org/3/reference/expressions.html#generator-iterator-methods' },
        { title: 'Python: inspect.getgeneratorstate()', href: 'https://docs.python.org/3/library/inspect.html#inspect.getgeneratorstate' },
        { title: 'Python: contextlib.closing', href: 'https://docs.python.org/3/library/contextlib.html#contextlib.closing' },
        { title: 'PEP 342: Coroutines via Enhanced Generators', href: 'https://peps.python.org/pep-0342/' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Генераторы и yield', href: '/python/yazyk-python/iteratory-i-generatory/generatory-i-yield' },
        { title: 'yield from и конвейеры', href: '/python/yazyk-python/iteratory-i-generatory/yield-from-i-konveyery' },
        { title: 'Генераторы как многозадачность', href: '/python/yazyk-python/iteratory-i-generatory/generatory-kak-mnogozadachnost' },
        { title: 'Исключения и файлы', href: '/python/yazyk-python/isklyucheniya-context-managers-i-fayly' },
    ]"
/>
