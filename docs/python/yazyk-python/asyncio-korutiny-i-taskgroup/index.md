---
title: "Asyncio: обзор"
description: "Навигация по asyncio: корутины, await, задачи, gather, TaskGroup, таймауты и блокирующий код."
tags:
  - "python"
  - "core"
  - "asyncio"
  - "concurrency"
updatedAt: "2026-11-21"
---
## Зачем нужна асинхронность {#zachem-nuzhna-asinkhronnost}

Большую часть времени сетевой код ждёт ответа API, базы данных или очереди. `asyncio` позволяет одному потоку переключаться между такими операциями, пока они ждут ввод или вывод.

Простая аналогия: официант принимает заказ и не стоит у кухни, пока блюдо готовится. В это время он обслуживает другой стол. Официант один, но ожидание одного заказа не блокирует остальные.

`asyncio` подходит для:

- одновременных запросов к API или базе данных;
- веб-серверов, ботов и очередей;
- параллельного опроса нескольких внешних сервисов.

Для тяжёлых вычислений на процессоре, например обучения модели, `asyncio` само по себе не ускоряет работу. Для таких задач используют процессы или библиотеки, которые выполняют вычисления параллельно.

## Основные понятия {#osnovnye-ponyatiya}

| Понятие | Что это |
| --- | --- |
| `async def` | объявление асинхронной функции |
| Корутина | объект, который возвращает вызов `async def` функции |
| `await` | ожидание результата с передачей управления циклу событий |
| Цикл событий | диспетчер, который продвигает готовые задачи |
| `Task` | корутина, поставленная в цикл событий на выполнение |
| `asyncio.run(main())` | запуск главной корутины в новом цикле событий |

## Минимальный пример {#minimalnyy-primer}

```python
import asyncio


async def main() -> None:
    await asyncio.sleep(0.1)
    print("done")


asyncio.run(main())  # done
```

`asyncio.sleep()` приостанавливает `main()` и отдаёт управление циклу событий. Если есть другие задачи, они могут выполняться во время ожидания.

## Порядок изучения {#poryadok-izucheniya}

1. [Корутины и `await`](/python/yazyk-python/asyncio-korutiny-i-taskgroup/korutiny-i-await)
   Почему вызов `async def` ничего не запускает и почему последовательные `await` не дают одновременного выполнения.

2. [Задачи и `gather()`](/python/yazyk-python/asyncio-korutiny-i-taskgroup/zadachi-i-gather)
   `create_task()`, конкурентный запуск и сбор результатов.

3. [`TaskGroup` и ошибки](/python/yazyk-python/asyncio-korutiny-i-taskgroup/taskgroup-i-oshibki)
   Структурированная конкурентность, отмена задач, `ExceptionGroup` и `except*`.

4. [Таймауты и блокирующий код](/python/yazyk-python/asyncio-korutiny-i-taskgroup/taymauty-i-blokiruyushchiy-kod)
   `asyncio.timeout()`, асинхронные аналоги и `asyncio.to_thread()`.

5. [Сравнение и практика](/python/yazyk-python/asyncio-korutiny-i-taskgroup/sravnenie-i-praktika)
   Выбор инструмента, аналогии с JavaScript, типичные ошибки и задания.

<RelatedTopics
    :items="[
        { title: 'Генераторы как многозадачность', href: '/python/yazyk-python/iteratory-i-generatory/generatory-kak-mnogozadachnost' },
        { title: 'Управление генератором', href: '/python/yazyk-python/iteratory-i-generatory/upravlenie-generatorom-send-throw-close' },
        { title: 'Обработка исключений', href: '/python/yazyk-python/1-core/tipy-oshibok-i-isklyucheniy/obrabotka-isklyucheniy-try-except' },
    ]"
/>
