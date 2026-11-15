---
title: "LEGB и shadowing"
description: "Порядок поиска имен LEGB в Python, внешние функции, встроенные имена и проблема shadowing."
tags:
  - "python"
  - "core"
  - "scope"
  - "legb"
updatedAt: "2026-11-08"
---
## Задача поиска имени {#zadacha-poiska-imeni}

В программе одинаковое имя может встретиться на нескольких уровнях. Python должен определить, какое именно значение использовать.

```python
language = "глобальный Python"


def show_language():
    language = "локальный Python"
    print(language)  # локальный Python


show_language()
print(language)  # глобальный Python
```

Для выбора значения Python использует правило LEGB.

## Правило LEGB {#pravilo-legb}

Python ищет имя по четырем уровням:

| Уровень | Полное название | Где находится |
| --- | --- | --- |
| `L` | `Local` | Текущая функция |
| `E` | `Enclosing` | Внешние функции |
| `G` | `Global` | Текущий модуль |
| `B` | `Built-in` | Встроенные имена Python |

Поиск прекращается на первом найденном совпадении.

## Local {#local}

Сначала Python проверяет текущую функцию:

```python
value = "global"


def show():
    value = "local"
    print(value)  # local


show()
```

Глобальное значение не используется, потому что локальное имя найдено раньше.

## Enclosing {#enclosing}

Если локального имени нет, Python проверяет внешние функции:

```python
def outer():
    topic = "область внешней функции"

    def inner():
        print(topic)  # область внешней функции

    inner()


outer()
```

`topic` относится к уровню `Enclosing`. Для чтения переменной ключевое слово `nonlocal` не требуется.

## Global {#global}

Если имя не найдено в текущей и внешних функциях, проверяется уровень файла:

```python
topic = "область модуля"


def show_topic():
    print(topic)  # область модуля


show_topic()
```

## Built-in {#built-in}

Последними проверяются встроенные имена:

```python
numbers = [10, 20, 30]
print(len(numbers))  # 3
```

Функция `len()` найдена во встроенной области Python.

## Что такое shadowing {#chto-takoe-shadowing}

**Shadowing**, или затенение, возникает, когда имя из более близкой области скрывает такое же имя из дальней области.

```python
status = "глобальный статус"


def show_status():
    status = "локальный статус"
    print(status)  # локальный статус


show_status()
print(status)  # глобальный статус
```

Обе переменные существуют, но внутри функции первой находится локальная.

## Не скрывай встроенные имена {#ne-skryvay-vstroennye-imena}

Плохой пример:

```python
list = [1, 2, 3]
```

Теперь имя `list` указывает на обычный список, а не на встроенный класс:

```python
numbers = list("123")  # TypeError: 'list' object is not callable
```

Лучше выбрать предметное имя:

```python
numbers = [1, 2, 3]
digits = list("123")

print(digits)  # ['1', '2', '3']
```

Часто случайно скрывают имена `list`, `dict`, `set`, `str`, `sum`, `min`, `max` и `id`.

## Почему присваивание влияет на всю функцию {#pochemu-prisvaivanie-vliyaet-na-vsyu-funktsiyu}

Если внутри функции есть присваивание имени, Python считает это имя локальным во всей функции:

```python
count = 10


def increase():
    print(count)
    count = 11


increase()  # UnboundLocalError
```

Python не читает глобальный `count`, потому что видит последующее локальное присваивание `count = 11`. Способ решения зависит от задачи: передать значение параметром, вернуть результат, использовать `global` или изменить переменную внешней функции через `nonlocal`.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Создай переменную `message` на уровне файла и переменную с таким же именем внутри функции. Объясни оба результата `print()`.
2. Создай внешнюю и вложенную функции. Проверь, может ли вложенная функция прочитать переменную внешней без `nonlocal`.
3. Присвой переменной имя `sum`, а затем попробуй вызвать встроенную функцию `sum()`. Исправь название.

<RelatedTopics
    :items="[
        { title: 'Обзор области видимости', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh' },
        { title: 'Локальные и глобальные переменные', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/lokalnye-i-globalnye-peremennye' },
        { title: 'nonlocal и замыкания', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/nonlocal-i-zamykaniya' },
        { title: 'global и константы', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/global-i-konstanty' },
    ]"
/>
