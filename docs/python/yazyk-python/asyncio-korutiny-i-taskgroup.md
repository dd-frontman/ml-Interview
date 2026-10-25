---
title: "Asyncio: корутины, задачи и TaskGroup"
description: "Как работает асинхронность в Python: ленивые корутины, почему последовательный await не дает параллельности, create_task, gather, TaskGroup, ошибки через except*, таймауты, блокирующий код и аналогии с Promise в JS."
tags:
  - "python"
  - "core"
  - "asyncio"
  - "concurrency"
updatedAt: "2026-10-23"
search: false
---
## Зачем нужна асинхронность {#zachem-nuzhna-asinkhronnost}

Большую часть времени сетевой код ничего не делает, а ждет: ответа API, базы данных, чтения файла. `asyncio` позволяет в одном потоке ждать много таких операций одновременно.

Простая аналогия: официант в кафе. Он принял заказ у первого стола и не стоит у кухни, пока блюдо готовится. Он идет принимать заказ у второго стола, потом приносит готовое блюдо первому. Официант один, но обслуживает всех, потому что не тратит время на ожидание.

Где подходит:

- много запросов к API или базе данных;
- скачивание файлов, работа с очередями, веб-серверы, боты;
- параллельный опрос нескольких сервисов, например нескольких моделей за API.

Где не подходит: тяжелые вычисления на процессоре, например обучение модели или обработка большого массива. Там нет ожидания, официанту некуда отойти. Для таких задач нужны процессы (`multiprocessing`, `concurrent.futures`) или библиотеки, которые сами считают параллельно.

## Основные понятия {#osnovnye-ponyatiya}

| Понятие | Что это |
| --- | --- |
| `async def` | объявление асинхронной функции |
| Корутина | объект, который возвращает вызов `async def` функции |
| `await` | дождаться результата корутины или задачи, уступив управление другим |
| Цикл событий (event loop) | диспетчер, который по очереди продвигает задачи |
| Задача (`Task`) | корутина, поставленная в цикл событий на выполнение |
| `asyncio.run(main())` | создать цикл событий, выполнить `main()` и закрыть цикл |

## Корутина ленивая {#korutina-lenivaya}

Главная вещь, которую нужно запомнить: вызов `async def` функции **не запускает** ее.

```python
import asyncio


async def say_hello():
    print("hello")


async def main():
    coro = say_hello()  # ничего не напечатано
    print(type(coro))   # <class 'coroutine'>
    await coro          # hello - код выполнился только здесь


asyncio.run(main())
```

Корутина похожа на генератор, который еще ни разу не дернули через `next()`: тело не выполняется, пока его не начнут двигать. Это не случайное сходство, корутины выросли из генераторов. Подробнее - в разделе [Управление генератором](./iteratory-i-generatory/upravlenie-generatorom-send-throw-close.md#svyaz-s-korutinami-i-asyncio).

Если корутину создать и забыть, Python предупредит:

```text
RuntimeWarning: coroutine 'say_hello' was never awaited
```

## Почему последовательный `await` не работает параллельно {#pochemu-posledovatelnyy-await-ne-rabotaet-parallelno}

```python
import asyncio


async def print1():
    print(1)


async def print2():
    await asyncio.sleep(10)
    print(2)


async def print3():
    print(3)


async def main():
    task1 = print1()
    task2 = print2()
    task3 = print3()

    await task1
    await task2
    await task3


asyncio.run(main())
```

Вывод:

```text
1
(пауза 10 секунд)
2
3
```

Что происходит:

1. `print1()`, `print2()` и `print3()` только создают три корутины. Ни одна не запущена.
2. `await task1` запускает первую и ждет ее, печатается `1`.
3. `await task2` запускает вторую. Она засыпает на 10 секунд, и `main` ждет вместе с ней.
4. Цикл событий мог бы в это время выполнить что-то другое, но других задач у него нет: третья корутина еще не запущена.
5. Только после этого `await task3` запускает третью.

Названия `task1`, `task2` и `task3` обманчивы: это не задачи, а обычные корутины. Чтобы они выполнялись одновременно, их нужно превратить в задачи.

## Задачи: `create_task` {#zadachi-create-task}

`asyncio.create_task()` ставит корутину в цикл событий. Задача начнет выполняться, как только текущий код уступит управление, то есть на ближайшем `await`.

```python
async def main():
    task1 = asyncio.create_task(print1())
    task2 = asyncio.create_task(print2())
    task3 = asyncio.create_task(print3())

    await task1
    await task2
    await task3
```

Вывод:

```text
1
3
(пауза 10 секунд)
2
```

На `await task1` функция `main` уступает управление, и цикл событий запускает все три задачи. Вторая засыпает, первая и третья сразу печатают. Общее время - 10 секунд, а не 10 плюс время остальных.

## `gather`: запустить и собрать результаты {#gather-zapustit-i-sobrat-rezultaty}

`asyncio.gather()` сам превращает корутины в задачи и ждет все:

```python
async def square(x: int) -> int:
    await asyncio.sleep(0.1)
    return x * x


async def main():
    results = await asyncio.gather(square(1), square(2), square(3))
    print(results)  # [1, 4, 9]
```

Результаты идут в порядке аргументов, а не в порядке завершения.

У `gather` есть неприятная особенность: если одна задача упала, `gather` сразу пробрасывает ошибку, но остальные задачи **продолжают работать** в фоне. Никто их не отменяет и не ждет. Эту проблему решает `TaskGroup`.

## `TaskGroup`: группа задач {#taskgroup-gruppa-zadach}

`asyncio.TaskGroup` появился в Python 3.11. Это рекомендуемый способ запустить несколько задач и дождаться их.

```python
import asyncio


async def print1():
    print(1)


async def print2():
    await asyncio.sleep(10)
    print(2)


async def print3():
    print(3)


async def main():
    async with asyncio.TaskGroup() as tg:
        tg.create_task(print1())
        tg.create_task(print2())
        tg.create_task(print3())


asyncio.run(main())
```

Вывод:

```text
1
3
(пауза 10 секунд)
2
```

### Что происходит по шагам {#chto-proiskhodit-po-shagam}

1. `asyncio.run(main())` создает цикл событий и запускает `main`.
2. `async with asyncio.TaskGroup() as tg` открывает группу. `tg` - объект, через который в группу добавляют задачи.
3. Три вызова `tg.create_task(...)` ставят задачи в очередь. Сами задачи пока не выполняются: `main` еще не уступил управление.
4. Блок `async with` заканчивается. На выходе группа ждет все свои задачи, и `main` встает на паузу. Цикл событий получает управление.
5. Первая задача печатает `1`. Вторая доходит до `asyncio.sleep(10)` и засыпает. Третья печатает `3`.
6. Через 10 секунд вторая просыпается и печатает `2`.
7. Все задачи завершены, блок `async with` отпускает `main`, программа заканчивается.

Главная гарантия: после выхода из `async with` все задачи группы точно завершены. Ничего не остается работать в фоне.

Простая аналогия: руководитель отдела раздает задания сотрудникам и не уходит с работы, пока все не сдадут результат. Если один сотрудник сорвал задание, руководитель останавливает всех остальных и сообщает о проблеме.

### Результаты задач {#rezultaty-zadach}

`create_task` возвращает объект задачи. После выхода из блока результат берут через `.result()`:

```python
async def main():
    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(square(x)) for x in range(4)]

    print([task.result() for task in tasks])  # [0, 1, 4, 9]
```

### Ошибка отменяет остальные задачи {#oshibka-otmenyaet-ostalnye-zadachi}

Если одна задача упала, группа отменяет все остальные и бросает `ExceptionGroup` со всеми ошибками:

```python
async def slow():
    try:
        await asyncio.sleep(2)
        print("slow done")
    except asyncio.CancelledError:
        print("slow cancelled")
        raise


async def broken():
    await asyncio.sleep(0.2)
    raise ValueError("bad data")


async def main():
    async with asyncio.TaskGroup() as tg:
        tg.create_task(slow())
        tg.create_task(broken())


asyncio.run(main())

# slow cancelled
# ExceptionGroup: unhandled errors in a TaskGroup (1 sub-exception)
#   ValueError: bad data
```

`slow` не дождался двух секунд: через 0.2 секунды `broken` упал, и группа отменила `slow`. Внутри отмененной задачи на строке `await` возникает `asyncio.CancelledError`. Его можно поймать, чтобы освободить ресурсы, но потом нужно пробросить дальше через `raise`.

### Обработка ошибок через `except*` {#obrabotka-oshibok-cherez-except}

Ошибки приходят не по одной, а группой: несколько задач могут упасть одновременно. Обычный `except ValueError` группу не поймает. Для этого есть `except*`:

```python
async def broken_key():
    await asyncio.sleep(0.2)
    raise KeyError("user_id")


async def main():
    try:
        async with asyncio.TaskGroup() as tg:
            tg.create_task(broken())
            tg.create_task(broken_key())
    except* ValueError as group:
        print("ошибки данных:", group.exceptions)
    except* KeyError as group:
        print("нет ключа:", group.exceptions)
```

Каждый `except*` забирает из группы ошибки своего типа. Если упали обе задачи, сработают оба блока.

### После выхода задачи добавлять нельзя {#posle-vykhoda-zadachi-dobavlyat-nelzya}

```python
async def main():
    async with asyncio.TaskGroup() as tg:
        pass

    tg.create_task(print1())
    # RuntimeError: TaskGroup <TaskGroup entered> is finished
```

Внутри блока добавлять задачи можно, в том числе из других задач, если передать им `tg`.

## Таймаут для группы {#taymaut-dlya-gruppy}

С Python 3.11 есть `asyncio.timeout()`. Если время вышло, все задачи внутри отменяются:

```python
async def main():
    try:
        async with asyncio.timeout(5):
            async with asyncio.TaskGroup() as tg:
                tg.create_task(fetch_users())
                tg.create_task(fetch_orders())
    except TimeoutError:
        print("сервисы не ответили за 5 секунд")
```

## Блокирующий код ломает асинхронность {#blokiruyushchiy-kod-lomaet-asinkhronnost}

`asyncio` переключает задачи только на `await`. Если внутри задачи стоит обычная блокирующая функция, весь цикл событий стоит вместе с ней:

```python
import time


async def blocking():
    time.sleep(1)  # блокирует весь поток
    print("blocking done")


async def main():
    async with asyncio.TaskGroup() as tg:
        tg.create_task(blocking())
        tg.create_task(print3())

# blocking done  - через 1 секунду
# 3              - тоже через 1 секунду, хотя мог напечататься сразу
```

Что делать:

| Блокирующий код | Асинхронная замена |
| --- | --- |
| `time.sleep()` | `await asyncio.sleep()` |
| `requests.get()` | `httpx.AsyncClient` или `aiohttp` |
| синхронный драйвер базы данных | асинхронный драйвер, например `asyncpg` |
| своя блокирующая функция | `await asyncio.to_thread(func, *args)` |

`asyncio.to_thread` запускает обычную функцию в отдельном потоке и не блокирует цикл событий:

```python
async def tick():
    for i in range(2):
        await asyncio.sleep(0.4)
        print("tick", i)


def read_big_file() -> str:
    time.sleep(1)  # имитация долгого чтения
    return "file read"


async def main():
    async with asyncio.TaskGroup() as tg:
        file_task = tg.create_task(asyncio.to_thread(read_big_file))
        tg.create_task(tick())  # продолжает работать, пока файл читается

    print(file_task.result())
```

## Сравнение подходов {#sravnenie-podkhodov}

| Подход | Задачи идут одновременно | Ждет все задачи | Если одна упала | Версия Python |
| --- | --- | --- | --- | --- |
| `await f1(); await f2()` | нет | да, по очереди | следующие не запускаются | любая с `asyncio` |
| `create_task` + `await` | да | только те, что дождались явно | остальные работают дальше | 3.7+ |
| `gather(f1(), f2())` | да | да | ошибка сразу, остальные работают в фоне | любая с `asyncio` |
| `gather(..., return_exceptions=True)` | да | да | ошибки возвращаются как значения | любая с `asyncio` |
| `TaskGroup` | да | да, гарантированно | остальные отменяются, `ExceptionGroup` | 3.11+ |

Практическое правило: для нового кода на Python 3.11+ используй `TaskGroup`. `gather` с `return_exceptions=True` подходит, когда нужно получить все результаты, даже если часть запросов упала.

## Аналогия с JS {#analogiya-s-js}

Тот же пример в JS:

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function print1() { console.log(1); }
async function print2() { await sleep(10_000); console.log(2); }
async function print3() { console.log(3); }

async function main() {
  await Promise.all([print1(), print2(), print3()]);
}

main();  // 1, 3, через 10 секунд 2
```

Главное отличие: в JS вызов `async` функции **сразу запускает** ее и возвращает Promise. В Python вызов только создает корутину. Поэтому код с тремя последовательными `await` в JS работал бы одновременно, а в Python нет.

| Python | JS |
| --- | --- |
| `f()` создает корутину, ничего не запускает | `f()` сразу запускает функцию, возвращает Promise |
| `asyncio.create_task(f())` | `f()` |
| `await f()` | `await f()` |
| `asyncio.gather(a(), b())` | `Promise.all([a(), b()])` |
| `gather(..., return_exceptions=True)` | `Promise.allSettled([...])` |
| `TaskGroup` | прямого аналога нет, ближе всего `Promise.all` вместе с `AbortController` |
| `asyncio.timeout(5)` | `AbortSignal.timeout(5000)` |
| `await asyncio.sleep(1)` | `await new Promise((r) => setTimeout(r, 1000))` |
| `time.sleep(1)` | обычного аналога нет, паузу в JS делают через таймер |
| `ExceptionGroup` | `AggregateError` из `Promise.any` |
| цикл событий запускается через `asyncio.run` | цикл событий есть всегда |

`Promise.all` при ошибке тоже сразу отклоняется, но остальные промисы не останавливаются: промисы в JS нельзя отменить. Для отмены там нужен `AbortController`, который передают в каждый запрос вручную. `TaskGroup` делает отмену сам.

## Частые ошибки {#chastye-oshibki}

1. Вызвать корутину без `await`.
   Код не выполнится, появится `RuntimeWarning: coroutine '...' was never awaited`.

2. Писать последовательные `await` и ждать одновременного выполнения.
   Нужны задачи: `TaskGroup`, `create_task` или `gather`.

3. Использовать `time.sleep()` или `requests` внутри `async def`.
   Весь цикл событий останавливается. Используй асинхронные аналоги или `asyncio.to_thread`.

4. Ловить ошибки группы через обычный `except ValueError`.
   `TaskGroup` бросает `ExceptionGroup`, и обычный `except` его не поймает. Используй `except*`.

5. Создать задачу через `create_task` и не сохранить ссылку.
   Цикл событий хранит задачи по слабым ссылкам, и незавершенная задача может пропасть. В `TaskGroup` этой проблемы нет: группа держит свои задачи сама.

6. Вызвать `asyncio.run()` в Jupyter.
   Там цикл событий уже запущен, и будет `RuntimeError: asyncio.run() cannot be called from a running event loop`. В ячейке Jupyter можно сразу писать `await main()`.

7. Использовать `TaskGroup` на Python ниже 3.11.
   Будет `AttributeError`. Там используй `gather`.

## Практические задачи {#prakticheskie-zadachi}

### Задача 1 {#zadacha-1}

Запусти пример с тремя последовательными `await` и пример с `TaskGroup`. Замерь общее время через `time.monotonic()` и объясни разницу.

### Задача 2 {#zadacha-2}

Напиши корутину `fetch(name, delay)`, которая ждет `delay` секунд и возвращает `name`. Запусти пять таких корутин с разными задержками через `TaskGroup` и выведи результаты в порядке создания.

### Задача 3 {#zadacha-3}

Добавь в группу задачу, которая падает с `ValueError` через секунду, и задачу, которая работает 5 секунд. Обработай ошибку через `except*` и убедись, что вторая задача была отменена.

## Краткая шпаргалка {#kratkaya-shpargalka}

```python
import asyncio


async def main():
    async with asyncio.TaskGroup() as tg:          # Python 3.11+
        task = tg.create_task(work())              # задача в группе
    print(task.result())                           # все задачи уже завершены

    results = await asyncio.gather(a(), b())       # результаты по порядку
    async with asyncio.timeout(5):                 # ограничение по времени
        await work()
    await asyncio.to_thread(blocking_func)         # блокирующий код в потоке


try:
    asyncio.run(main())
except* ValueError as group:                       # ошибки из TaskGroup
    print(group.exceptions)
```

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python: Coroutines and Tasks', href: 'https://docs.python.org/3/library/asyncio-task.html' },
        { title: 'Python: Task Groups', href: 'https://docs.python.org/3/library/asyncio-task.html#task-groups' },
        { title: 'Python: asyncio.gather()', href: 'https://docs.python.org/3/library/asyncio-task.html#asyncio.gather' },
        { title: 'Python Tutorial: except*', href: 'https://docs.python.org/3/tutorial/errors.html#raising-and-handling-multiple-unrelated-exceptions' },
        { title: 'PEP 654: Exception Groups and except*', href: 'https://peps.python.org/pep-0654/' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Генераторы как многозадачность', href: '/python/yazyk-python/iteratory-i-generatory/generatory-kak-mnogozadachnost' },
        { title: 'Управление генератором', href: '/python/yazyk-python/iteratory-i-generatory/upravlenie-generatorom-send-throw-close' },
        { title: 'Обработка исключений', href: '/python/yazyk-python/1-core/obrabotka-isklyucheniy-try-except' },
        { title: 'HTTP-запросы requests', href: '/python/ekosistema-python/http-zaprosy-requests' },
    ]"
/>
