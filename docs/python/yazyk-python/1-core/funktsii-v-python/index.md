---
title: "Функции в Python"
description: "Карта раздела о функциях Python: объявление, параметры, return, аннотации, *args, **kwargs, распаковка аргументов и практика."
tags:
  - "python"
  - "core"
  - "functions"
updatedAt: "2026-11-09"
search: false
---
## Что такое функция {#chto-takoe-funktsiya}

Функция — это именованный блок кода, который можно вызывать много раз.

Она помогает:

- не повторять один и тот же код;
- давать логике понятное имя;
- принимать входные данные через параметры;
- возвращать результат через `return`;
- разбивать программу на небольшие понятные части.

## Минимальный пример {#minimalnyy-primer}

Допустим, нужно несколько раз вычислять среднее значение списка. Формулу лучше вынести в функцию:

```python
def find_average(numbers: list[int]) -> float:
    return sum(numbers) / len(numbers)


print(find_average([1, 2, 3, 4, 5]))  # 3.0
print(find_average([6, 7, 8, 9, 10]))  # 8.0
```

В этом примере:

- `def` объявляет функцию;
- `find_average` — имя функции;
- `numbers` — параметр;
- списки при вызове — аргументы;
- `return` передаёт результат вызывающему коду;
- `-> float` описывает ожидаемый тип результата.

## Карта раздела {#karta-razdela}

| Тема | Что изучишь |
| --- | --- |
| [Объявление и вызов функции](./obyavlenie-i-vyzov-funktsii.md) | Зачем нужен `def`, как объявить и вызвать функцию |
| [Параметры и аргументы](./parametry-i-argumenty.md) | Чем параметр отличается от аргумента, позиционные, именованные и keyword-only аргументы |
| [`return`, `print()` и `pass`](./return-print-i-pass.md) | Как вернуть результат, почему функция может вернуть `None` и зачем нужен `pass` |
| [Значения параметров по умолчанию](./znacheniya-parametrov-po-umolchaniyu.md) | Порядок параметров и проблема изменяемых значений по умолчанию |
| [Аннотации типов](./annotatsii-tipov.md) | Как описывать типы параметров и возвращаемого значения |
| [Docstring: строки документации](./docstring-stroki-dokumentatsii.md) | Как документировать функцию и получать описание через `__doc__` и `help()` |
| [Локальные переменные и частые ошибки](./lokalnye-peremennye-i-oshibki.md) | Где живут переменные функции и какие ошибки чаще всего встречаются |
| [`*args`: произвольные позиционные аргументы](./args-proizvolnye-pozitsionnye-argumenty.md) | Как принять переменное количество позиционных значений |
| [`**kwargs`: произвольные именованные аргументы](./kwargs-proizvolnye-imenovannye-argumenty.md) | Как принять гибкий набор именованных значений |
| [Распаковка аргументов через `*` и `**`](./raspakovka-argumentov.md) | Как передать элементы коллекции как отдельные аргументы |
| [Порядок параметров функции](./poryadok-parametrov-funktsii.md) | Как сочетать positional-only, обычные, `*args`, keyword-only и `**kwargs` параметры |
| [Возврат и распаковка нескольких значений](./vozvrat-i-raspakovka-rezultata.md) | Как вернуть кортеж результатов и сообщить об изменении данных |
| [Практика: `*args` и `**kwargs`](./praktika-args-kwargs.md) | Задачи с подсказками и скрытыми решениями |

Сначала пройди базовые страницы до локальных переменных, затем переходи к `*args`, `**kwargs` и распаковке.

## Как выполняется вызов {#kak-vypolnyaetsya-vyzov}

```python
def greet(name: str) -> str:
    message = f"Привет, {name}!"
    return message


result = greet("Анна")
print(result)  # Привет, Анна!
```

При вызове `greet("Анна")` Python:

1. Передаёт строку `"Анна"` в параметр `name`.
2. Выполняет тело функции с отступом.
3. Создаёт локальную переменную `message`.
4. Возвращает строку через `return`.
5. Сохраняет возвращённое значение в `result`.

## Краткая шпаргалка {#kratkaya-shpargalka}

| Синтаксис | Что делает |
| --- | --- |
| `def name():` | Объявляет функцию |
| `def name(value):` | Объявляет функцию с параметром |
| `name(10)` | Вызывает функцию с аргументом |
| `return value` | Возвращает результат |
| `pass` | Оставляет пустое тело функции |
| `None` | Обозначает отсутствие полезного результата |
| `func(day=15)` | Передаёт именованный аргумент |
| `def func(*, arg):` | Делает параметр keyword-only |
| `def func(*args):` | Собирает позиционные аргументы в кортеж |
| `def func(**kwargs):` | Собирает именованные аргументы в словарь |
| `func(*values)` | Распаковывает коллекцию в позиционные аргументы |
| `func(**options)` | Распаковывает словарь в именованные аргументы |
| `arg="default"` | Задаёт значение по умолчанию |
| `arg: str` | Аннотирует тип параметра |
| `-> str` | Аннотирует тип результата |

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Defining functions', href: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions' },
        { title: 'Python Tutorial: Default argument values', href: 'https://docs.python.org/3/tutorial/controlflow.html#default-argument-values' },
        { title: 'Python Tutorial: Keyword arguments', href: 'https://docs.python.org/3/tutorial/controlflow.html#keyword-arguments' },
        { title: 'Python Reference: Function definitions', href: 'https://docs.python.org/3/reference/compound_stmts.html#function-definitions' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: '*args', href: '/python/yazyk-python/1-core/funktsii-v-python/args-proizvolnye-pozitsionnye-argumenty' },
        { title: '**kwargs', href: '/python/yazyk-python/1-core/funktsii-v-python/kwargs-proizvolnye-imenovannye-argumenty' },
        { title: 'Область видимости переменных', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/' },
        { title: 'Основные встроенные функции', href: '/python/yazyk-python/1-core/osnovnye-funktsii' },
        { title: 'Циклы for и range', href: '/python/yazyk-python/1-core/tsikly-for-i-range/' },
    ]"
/>
