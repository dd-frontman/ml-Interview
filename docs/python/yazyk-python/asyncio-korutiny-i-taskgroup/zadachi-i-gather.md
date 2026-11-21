---
title: "Задачи и gather"
description: "Конкурентный запуск корутин через asyncio.create_task и asyncio.gather, сбор результатов и обработка ошибок."
tags:
  - "python"
  - "asyncio"
  - "tasks"
  - "gather"
updatedAt: "2026-11-21"
---
## Задачи через create_task {#zadachi-cherez-create-task}

`asyncio.create_task()` ставит корутину в цикл событий. Задача начнёт выполняться, когда текущая корутина уступит управление на ближайшем `await`.

```python
import asyncio


async def show(value: int, delay: float) -> None:
    await asyncio.sleep(delay)
    print(value)


async def main() -> None:
    first = asyncio.create_task(show(1, 0))
    second = asyncio.create_task(show(2, 1))
    third = asyncio.create_task(show(3, 0))

    await first
    await second
    await third


asyncio.run(main())
```

Результат:

```text
1
3
(пауза 1 секунда)
2
```

На первом `await` функция `main()` уступает управление, и цикл событий начинает продвигать все три задачи. Вторая задача ждёт, а первая и третья завершаются сразу.

Сохраняй ссылки на задачи и явно дожидайся их. Для группы связанных задач обычно удобнее `TaskGroup`: он сам хранит задачи и гарантирует их завершение.

## Сбор результатов через gather {#sbor-rezultatov-cherez-gather}

`asyncio.gather()` принимает корутины или задачи, запускает их конкурентно и возвращает результаты в порядке аргументов.

```python
async def square(number: int) -> int:
    await asyncio.sleep(0.1)
    return number * number


async def main() -> None:
    results = await asyncio.gather(square(1), square(2), square(3))
    print(results)  # [1, 4, 9]
```

Порядок завершения задач может отличаться, но позиции в `results` соответствуют порядку аргументов `gather()`.

## Что происходит при ошибке {#chto-proiskhodit-pri-oshibke}

По умолчанию `gather()` передаёт первое исключение вызывающему коду. Остальные операции при этом не отменяются автоматически и могут продолжить выполнение.

Параметр `return_exceptions=True` заставляет дождаться всех операций и вернуть исключения вместе с обычными результатами:

```python
results = await asyncio.gather(
    square(2),
    broken_request(),
    return_exceptions=True,
)
```

После этого каждый элемент нужно проверить. Такой режим подходит, когда требуется собрать все результаты, даже если часть операций завершилась ошибкой.

Для связанных задач, которые должны завершиться или отмениться как одна группа, переходи к [`TaskGroup`](./taskgroup-i-oshibki.md).

<RelatedTopics
    :items="[
        { title: 'Asyncio: обзор', href: '/python/yazyk-python/asyncio-korutiny-i-taskgroup' },
        { title: 'Корутины и await', href: '/python/yazyk-python/asyncio-korutiny-i-taskgroup/korutiny-i-await' },
        { title: 'TaskGroup и ошибки', href: '/python/yazyk-python/asyncio-korutiny-i-taskgroup/taskgroup-i-oshibki' },
    ]"
/>
