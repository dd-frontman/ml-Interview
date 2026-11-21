---
title: "TaskGroup и ошибки"
description: "Структурированный запуск задач через asyncio.TaskGroup, получение результатов, отмена и обработка ExceptionGroup через except*."
tags:
  - "python"
  - "asyncio"
  - "taskgroup"
  - "exceptions"
updatedAt: "2026-11-21"
---
## Группа связанных задач {#gruppa-svyazannykh-zadach}

`asyncio.TaskGroup` доступен с Python 3.11. Группа не завершает блок `async with`, пока не закончатся все добавленные задачи.

```python
import asyncio


async def show(value: int, delay: float) -> None:
    await asyncio.sleep(delay)
    print(value)


async def main() -> None:
    async with asyncio.TaskGroup() as group:
        group.create_task(show(1, 0))
        group.create_task(show(2, 1))
        group.create_task(show(3, 0))


asyncio.run(main())
```

Результат:

```text
1
3
(пауза 1 секунда)
2
```

После выхода из блока все задачи группы завершены. В фоне не остаётся незавершённой работы.

## Получение результатов {#poluchenie-rezultatov}

`create_task()` возвращает объект задачи. Результат безопасно получать после выхода из группы:

```python
async def square(number: int) -> int:
    await asyncio.sleep(0.1)
    return number * number


async def main() -> None:
    async with asyncio.TaskGroup() as group:
        tasks = [group.create_task(square(number)) for number in range(4)]

    print([task.result() for task in tasks])  # [0, 1, 4, 9]
```

## Ошибка отменяет остальные задачи {#oshibka-otmenyaet-ostalnye-zadachi}

Если одна задача завершается необработанной ошибкой, группа отменяет остальные и формирует `ExceptionGroup`.

```python
async def slow() -> None:
    try:
        await asyncio.sleep(2)
        print("slow done")
    except asyncio.CancelledError:
        print("slow cancelled")
        raise


async def broken() -> None:
    await asyncio.sleep(0.2)
    raise ValueError("bad data")


async def main() -> None:
    async with asyncio.TaskGroup() as group:
        group.create_task(slow())
        group.create_task(broken())
```

Через 0.2 секунды `broken()` завершается с ошибкой, а `slow()` получает `asyncio.CancelledError`. Ошибку отмены можно поймать для освобождения ресурсов, но затем её нужно передать дальше через `raise`.

## Обработка через except* {#obrabotka-cherez-except}

Несколько задач могут завершиться разными ошибками. Для разбиения `ExceptionGroup` по типам используется `except*`:

```python
async def broken_key() -> None:
    await asyncio.sleep(0.2)
    raise KeyError("user_id")


async def main() -> None:
    try:
        async with asyncio.TaskGroup() as group:
            group.create_task(broken())
            group.create_task(broken_key())
    except* ValueError as group:
        print("ошибки данных:", group.exceptions)
    except* KeyError as group:
        print("нет ключа:", group.exceptions)
```

Каждый блок получает только исключения подходящего типа.

## Группа имеет границы времени жизни {#gruppa-imeet-granitsy-vremeni-zhizni}

После выхода из `async with` добавлять задачи нельзя:

```python
async with asyncio.TaskGroup() as group:
    pass

group.create_task(show(1, 0))
# RuntimeError: TaskGroup ... is finished
```

<RelatedTopics
    :items="[
        { title: 'Asyncio: обзор', href: '/python/yazyk-python/asyncio-korutiny-i-taskgroup' },
        { title: 'Задачи и gather', href: '/python/yazyk-python/asyncio-korutiny-i-taskgroup/zadachi-i-gather' },
        { title: 'Обработка исключений', href: '/python/yazyk-python/1-core/tipy-oshibok-i-isklyucheniy/obrabotka-isklyucheniy-try-except' },
    ]"
/>
