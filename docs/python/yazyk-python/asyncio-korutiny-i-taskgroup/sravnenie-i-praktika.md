---
title: "Asyncio: сравнение и практика"
description: "Сравнение await, create_task, gather и TaskGroup, аналогии с JavaScript, типичные ошибки и практические задачи."
tags:
  - "python"
  - "asyncio"
  - "practice"
  - "concurrency"
updatedAt: "2026-11-21"
---
## Сравнение подходов {#sravnenie-podkhodov}

| Подход | Конкурентное выполнение | Ожидание всех задач | Ошибка одной задачи |
| --- | --- | --- | --- |
| Последовательные `await` | нет | по очереди | следующие операции не запускаются |
| `create_task()` и `await` | да | только при явном ожидании | остальные задачи продолжают работу |
| `gather()` | да | да | первая ошибка передаётся вызывающему коду |
| `gather(..., return_exceptions=True)` | да | да | ошибки возвращаются как значения |
| `TaskGroup` | да | да | остальные задачи отменяются, формируется `ExceptionGroup` |

Для нового кода на Python 3.11+ используй `TaskGroup`, когда задачи образуют одну операцию. `gather(return_exceptions=True)` подходит, когда нужно получить результат каждой независимой операции, даже если часть из них завершилась ошибкой.

## Аналогия с JavaScript {#analogiya-s-javascript}

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function show(value, delay) {
  await sleep(delay);
  console.log(value);
}

await Promise.all([show(1, 0), show(2, 1000), show(3, 0)]);
```

В JavaScript вызов `async`-функции сразу начинает её выполнение и возвращает `Promise`. В Python вызов `async def` функции только создаёт корутину. Для запуска в цикле событий нужны `await`, `create_task()`, `gather()` или `TaskGroup`.

| Python | JavaScript |
| --- | --- |
| вызов `async def` создаёт корутину | вызов `async`-функции возвращает запущенный `Promise` |
| `asyncio.create_task(f())` | `f()` |
| `asyncio.gather(a(), b())` | `Promise.all([a(), b()])` |
| `gather(..., return_exceptions=True)` | `Promise.allSettled([...])` |
| `asyncio.timeout(5)` | `AbortSignal.timeout(5000)` |
| `ExceptionGroup` | `AggregateError` |

## Типичные ошибки {#tipichnye-oshibki}

1. Вызвать корутину без `await`. Код не выполнится, а Python предупредит, что корутину никто не ожидал.
2. Писать последовательные `await` и ожидать конкурентного выполнения. Для независимых операций нужны задачи.
3. Вызывать `time.sleep()` или синхронный HTTP-клиент внутри `async def`. Такой код блокирует цикл событий.
4. Ловить ошибки `TaskGroup` только через обычный `except ValueError`. Для `ExceptionGroup` нужен `except*`.
5. Создать задачу через `create_task()` и не сохранить ссылку или не дождаться результата.
6. Вызвать `asyncio.run()` внутри Jupyter, где цикл событий уже запущен. В ячейке можно использовать `await main()`.
7. Использовать `TaskGroup` или `asyncio.timeout()` на Python ниже 3.11.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Запусти три операции сначала через последовательные `await`, затем через `TaskGroup`. Замерь время с помощью `time.monotonic()` и объясни разницу.
2. Напиши корутину `fetch(name, delay)`, запусти пять вызовов через `TaskGroup` и выведи результаты в порядке создания.
3. Добавь задачу, которая завершается с `ValueError`, и медленную задачу. Обработай ошибку через `except*` и проверь, что медленная задача была отменена.

## Шпаргалка {#shpargalka}

```python
import asyncio


async def main() -> None:
    async with asyncio.TaskGroup() as group:
        task = group.create_task(work())

    print(task.result())

    results = await asyncio.gather(first(), second())

    async with asyncio.timeout(5):
        await work()

    await asyncio.to_thread(blocking_function)
```

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
        { title: 'Asyncio: обзор', href: '/python/yazyk-python/asyncio-korutiny-i-taskgroup' },
        { title: 'TaskGroup и ошибки', href: '/python/yazyk-python/asyncio-korutiny-i-taskgroup/taskgroup-i-oshibki' },
        { title: 'Таймауты и блокирующий код', href: '/python/yazyk-python/asyncio-korutiny-i-taskgroup/taymauty-i-blokiruyushchiy-kod' },
    ]"
/>
