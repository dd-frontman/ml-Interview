---
title: "Область видимости переменных"
description: "Карта раздела об областях видимости Python: локальные и глобальные переменные, LEGB, shadowing, global, nonlocal и замыкания."
tags:
  - "python"
  - "core"
  - "scope"
  - "functions"
updatedAt: "2026-11-08"
search: false
---
## Что такое область видимости {#chto-takoe-oblast-vidimosti}

Область видимости определяет, в какой части программы доступно имя переменной.

Например, переменная, созданная внутри функции, обычно недоступна за ее пределами:

```python
def greet():
    message = "Привет"
    print(message)  # Привет


greet()
print(message)  # NameError
```

Чтобы понимать такое поведение, нужно различать локальную область функции, внешние функции, уровень модуля и встроенные имена Python.

## Карта раздела {#karta-razdela}

| Тема | Что изучишь |
| --- | --- |
| [Локальные и глобальные переменные](./lokalnye-i-globalnye-peremennye.md) | Где создаются переменные, как функции читают внешние значения и почему переменная цикла видна после цикла |
| [LEGB и shadowing](./legb-i-shadowing.md) | В каком порядке Python ищет имя и как локальная переменная может скрыть внешнюю |
| [`global` и константы](./global-i-konstanty.md) | Как изменить переменную модуля и почему обычно лучше вернуть новое значение |
| [`nonlocal` и замыкания](./nonlocal-i-zamykaniya.md) | Как вложенная функция изменяет переменную внешней функции и сохраняет состояние |

Рекомендуемый порядок изучения совпадает с порядком страниц в таблице.

## Быстрое сравнение областей {#bystroe-sravnenie-oblastey}

```python
module_value = "global"


def outer():
    outer_value = "enclosing"

    def inner():
        local_value = "local"
        print(local_value)   # local
        print(outer_value)   # enclosing
        print(module_value)  # global

    inner()


outer()
```

В примере представлены три пользовательские области:

- `local_value` принадлежит функции `inner()`;
- `outer_value` принадлежит внешней функции `outer()`;
- `module_value` находится на уровне файла.

Четвертый уровень образуют встроенные имена Python, например `len`, `print` и `sum`.

## Правило поиска имени {#pravilo-poiska-imeni}

Python ищет имена по правилу **LEGB**:

1. `Local` — текущая функция.
2. `Enclosing` — внешние функции.
3. `Global` — уровень модуля.
4. `Built-in` — встроенные имена Python.

Подробный разбор: [LEGB и shadowing](./legb-i-shadowing.md).

## `global` {#global}

`global` указывает, что присваивание внутри функции должно изменить переменную уровня модуля, а не создать локальную переменную.

```python
status = "offline"


def connect():
    global status
    status = "online"


connect()
print(status)  # online
```

Подробный разбор и более безопасные альтернативы: [`global` и константы](./global-i-konstanty.md).

## `nonlocal`: изменение переменной внешней функции {#nonlocal-izmenenie-peremennoy-vneshney-funktsii}

`nonlocal` позволяет вложенной функции переприсвоить переменную ближайшей подходящей внешней функции.

```python
def create_counter():
    count = 0

    def increment():
        nonlocal count
        count += 1
        return count

    return increment
```

Подробный разбор счетчика, `UnboundLocalError` и замыканий: [`nonlocal` и замыкания](./nonlocal-i-zamykaniya.md).

## Краткая шпаргалка {#kratkaya-shpargalka}

| Синтаксис | Что означает |
| --- | --- |
| `value = ...` внутри функции | Создать локальную переменную |
| `GLOBAL_VALUE = ...` на уровне файла | Обозначить константу по соглашению |
| `global value` | Изменять переменную уровня модуля |
| `nonlocal value` | Изменять переменную внешней функции |
| `return value` | Передать результат вызывающему коду |

Практическое правило: сначала попробуй передать данные через параметры и `return`. Используй `global` и `nonlocal` только тогда, когда изменение внешнего состояния действительно является частью задачи.

<RelatedTopics
    :items="[
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python/' },
        { title: 'Продвинутые функции', href: '/python/yazyk-python/1-core/funktsii-v-python/args-proizvolnye-pozitsionnye-argumenty' },
        { title: 'Декораторы', href: '/python/yazyk-python/1-core/dekoratory-v-python' },
        { title: 'Основы синтаксиса и переменные', href: '/python/yazyk-python/1-core/osnovy-sintaksisa-i-peremennye' },
    ]"
/>
