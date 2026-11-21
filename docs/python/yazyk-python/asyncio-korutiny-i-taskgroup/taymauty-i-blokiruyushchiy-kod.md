---
title: "Таймауты и блокирующий код"
description: "Ограничение времени через asyncio.timeout, влияние блокирующих функций и перенос синхронного кода через asyncio.to_thread."
tags:
  - "python"
  - "asyncio"
  - "timeout"
  - "blocking"
updatedAt: "2026-11-21"
---
## Таймаут для группы задач {#taymaut-dlya-gruppy-zadach}

`asyncio.timeout()` доступен с Python 3.11. Когда время заканчивается, операции внутри контекста отменяются, а снаружи возникает `TimeoutError`.

```python
import asyncio


async def main() -> None:
    try:
        async with asyncio.timeout(5):
            async with asyncio.TaskGroup() as group:
                group.create_task(fetch_users())
                group.create_task(fetch_orders())
    except TimeoutError:
        print("сервисы не ответили за 5 секунд")
```

Таймаут ограничивает всю операцию, а не каждую задачу по отдельности.

## Почему блокирующий код останавливает asyncio {#pochemu-blokiruyushchiy-kod-ostanavlivaet-asyncio}

Цикл событий переключает задачи в точках `await`. Обычная блокирующая функция не отдаёт ему управление.

```python
import asyncio
import time


async def blocking() -> None:
    time.sleep(1)
    print("blocking done")


async def show_immediately() -> None:
    print("ready")


async def main() -> None:
    async with asyncio.TaskGroup() as group:
        group.create_task(blocking())
        group.create_task(show_immediately())
```

`ready` появится только после `time.sleep(1)`, потому что весь поток был заблокирован.

## Асинхронные замены {#asinkhronnye-zameny}

| Блокирующий код | Что использовать в asyncio |
| --- | --- |
| `time.sleep()` | `await asyncio.sleep()` |
| `requests.get()` | асинхронный HTTP-клиент |
| синхронный драйвер базы данных | асинхронный драйвер |
| своя блокирующая функция | `await asyncio.to_thread(func, *args)` |

## Перенос функции в отдельный поток {#perenos-funktsii-v-otdelnyy-potok}

`asyncio.to_thread()` запускает синхронную функцию в рабочем потоке и позволяет циклу событий продолжить выполнение других задач.

```python
def read_big_file() -> str:
    time.sleep(1)
    return "file read"


async def tick() -> None:
    for index in range(2):
        await asyncio.sleep(0.4)
        print("tick", index)


async def main() -> None:
    async with asyncio.TaskGroup() as group:
        file_task = group.create_task(asyncio.to_thread(read_big_file))
        group.create_task(tick())

    print(file_task.result())
```

`to_thread()` подходит для блокирующего ввода-вывода и существующего синхронного кода. Для тяжёлых вычислений ограничение GIL может не дать ускорения, поэтому там обычно рассматривают процессы.

<RelatedTopics
    :items="[
        { title: 'Asyncio: обзор', href: '/python/yazyk-python/asyncio-korutiny-i-taskgroup' },
        { title: 'TaskGroup и ошибки', href: '/python/yazyk-python/asyncio-korutiny-i-taskgroup/taskgroup-i-oshibki' },
        { title: 'HTTP-запросы requests', href: '/python/ekosistema-python/http-zaprosy-requests' },
    ]"
/>
