---
title: "Базовый Python: обзор"
description: "Порядок изучения базового Python: синтаксис, операторы, циклы, функции, область видимости, модули, файлы и исключения."
tags:
  - "python"
  - "core"
  - "functions"
  - "classes"
  - "modules"
updatedAt: "2026-11-21"
---
## Что входит в базовый Python {#chto-vkhodit-v-bazovyy-python}

В этом разделе собраны механизмы самого языка, которые нужны для небольшого рабочего скрипта:

- переменные и встроенные функции;
- вычисления, сравнения и условия;
- циклы и comprehensions;
- функции и область видимости;
- импорты, модули и окружение;
- файлы и обработка ошибок.

```python
def select_positive(values: list[int]) -> list[int]:
    return [value for value in values if value > 0]


print(select_positive([-2, 0, 3, 5]))  # [3, 5]
```

Этот пример объединяет типы данных, функцию, параметры, условие и comprehension. Разделы ниже последовательно объясняют каждую часть.

## Как идти по материалам {#kak-idti-po-materialam}

1. [Основы языка](./osnovy-yazyka/)
   Синтаксис, переменные, встроенные функции, `repr()` и `del`.

2. [Операторы и условия](./operatory-i-usloviya/)
   Арифметика, сравнения, `bool`, логические выражения и ветвление.

3. [Циклы и comprehensions](./iteratsiya/)
   `for`, `range()`, `while`, `break`, `continue`, `enumerate()`, `zip()` и comprehensions.

4. [Функции](./funktsii-v-python/)
   Объявление, параметры, `return`, аннотации, `*args`, `**kwargs` и дополнительные инструменты.

5. [Область видимости](./oblast-vidimosti-peremennyh/)
   Правило LEGB, локальные и глобальные имена, `global`, `nonlocal` и замыкания.

6. [Импорты и модули](./importy-i-moduli/)
   Пакеты, формы импорта, `__name__`, `venv`, `pip` и модуль `sys`.

7. [Типы ошибок и исключений](./tipy-oshibok-i-isklyucheniy/)
   Чтение traceback, `try`/`except`, выбор исключения и собственные ошибки.

8. [Файлы](./fayly-v-python.md)
   Контекстный менеджер `with`, режимы чтения и записи, пути, JSON и CSV.

## Карта раздела {#karta-razdela}

| Группа | Что внутри | Результат |
| --- | --- | --- |
| [Основы языка](./osnovy-yazyka/) | синтаксис и встроенные функции | Прочитать и запустить простой скрипт |
| [Операторы и условия](./operatory-i-usloviya/) | вычисления, сравнения и ветвление | Записать правило принятия решения |
| [Итерация](./iteratsiya/) | циклы и comprehensions | Обработать коллекцию значений |
| [Функции](./funktsii-v-python/) | контракт входа и выхода | Разделить задачу на небольшие операции |
| [Область видимости](./oblast-vidimosti-peremennyh/) | поиск и изменение имён | Объяснить, откуда взялось значение переменной |
| [Импорты и модули](./importy-i-moduli/) | структура кода и окружение | Разнести программу по файлам |
| [Типы ошибок](./tipy-oshibok-i-isklyucheniy/) | исключения и обработка сбоев | Обработать ожидаемую ошибку |
| [Файлы](./fayly-v-python.md) | чтение и запись данных | Безопасно обработать локальный файл |

## Практическое правило {#prakticheskoe-pravilo}

Сначала собери небольшой работающий скрипт. Повторяющуюся логику выноси в функции, разные части программы разделяй по модулям, а ожидаемые сбои обрабатывай через исключения. После этого переходи к [классам](../klassy/klassy-glavnaya.md), итераторам и асинхронности.

<RelatedTopics
    :items="[
        { title: 'Основы языка', href: '/python/yazyk-python/1-core/osnovy-yazyka/' },
        { title: 'Операторы и условия', href: '/python/yazyk-python/1-core/operatory-i-usloviya/' },
        { title: 'Циклы и comprehensions', href: '/python/yazyk-python/1-core/iteratsiya/' },
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python/' },
        { title: 'Область видимости', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/' },
        { title: 'Импорты и модули', href: '/python/yazyk-python/1-core/importy-i-moduli/' },
        { title: 'Типы ошибок', href: '/python/yazyk-python/1-core/tipy-oshibok-i-isklyucheniy/' },
        { title: 'Классы в Python', href: '/python/yazyk-python/klassy/klassy-glavnaya' },
    ]"
/>
