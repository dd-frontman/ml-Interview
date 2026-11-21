---
title: "Корутины и await"
description: "Почему вызов async def создаёт ленивую корутину и как последовательный await влияет на выполнение программы."
tags:
  - "python"
  - "asyncio"
  - "coroutines"
  - "await"
updatedAt: "2026-11-21"
---
## Корутина не запускается при вызове {#korutina-ne-zapuskaetsya-pri-vyzove}

Вызов функции, объявленной через `async def`, создаёт объект корутины, но не выполняет её тело.

```python
import asyncio


async def say_hello() -> None:
    print("hello")


async def main() -> None:
    coroutine = say_hello()
    print(type(coroutine))  # <class 'coroutine'>
    await coroutine        # hello


asyncio.run(main())
```

Строка `say_hello()` только создаёт корутину. Код внутри `say_hello()` выполняется на строке `await coroutine`.

Если создать корутину и не дождаться её, Python выведет предупреждение:

```text
RuntimeWarning: coroutine 'say_hello' was never awaited
```

Корутина похожа на генератор, который ещё не начали продвигать через `next()`. Связь с генераторами разобрана в материале [«Управление генератором»](/python/yazyk-python/iteratory-i-generatory/upravlenie-generatorom-send-throw-close#svyaz-s-korutinami-i-asyncio).

## Последовательный await {#posledovatelnyy-await}

Создание нескольких корутин ещё не делает их задачами.

```python
import asyncio


async def print_first() -> None:
    print(1)


async def print_second() -> None:
    await asyncio.sleep(1)
    print(2)


async def print_third() -> None:
    print(3)


async def main() -> None:
    first = print_first()
    second = print_second()
    third = print_third()

    await first
    await second
    await third


asyncio.run(main())
```

Результат:

```text
1
(пауза 1 секунда)
2
3
```

Выполнение идёт по шагам:

1. Три вызова создают корутины, но не запускают их.
2. `await first` выполняет первую корутину.
3. `await second` запускает вторую и ждёт её завершения.
4. Третья корутина запускается только после завершения второй.

Во время `asyncio.sleep()` цикл событий мог бы выполнять другую задачу, но третья корутина ещё не поставлена в цикл событий как задача.

## Практическое правило {#prakticheskoe-pravilo}

Используй обычный `await`, когда следующий шаг зависит от результата предыдущего. Если независимые операции должны ожидаться одновременно, создай задачи через `TaskGroup`, `create_task()` или `gather()`.

<RelatedTopics
    :items="[
        { title: 'Asyncio: обзор', href: '/python/yazyk-python/asyncio-korutiny-i-taskgroup' },
        { title: 'Задачи и gather', href: '/python/yazyk-python/asyncio-korutiny-i-taskgroup/zadachi-i-gather' },
        { title: 'Генераторы и yield', href: '/python/yazyk-python/iteratory-i-generatory/generatory-i-yield' },
    ]"
/>
