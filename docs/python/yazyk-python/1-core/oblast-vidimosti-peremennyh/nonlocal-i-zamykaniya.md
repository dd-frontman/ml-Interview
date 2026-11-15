---
title: "nonlocal и замыкания"
description: "Подробное объяснение nonlocal, вложенных функций, UnboundLocalError и сохранения состояния с помощью замыканий Python."
tags:
  - "python"
  - "core"
  - "scope"
  - "closures"
updatedAt: "2026-11-08"
---
## Задача: сохранить счетчик {#zadacha-sokhranit-schetchik}

Нужно создать функцию-счетчик. Каждый вызов должен увеличивать сохраненное значение:

```python
counter = create_counter()

print(counter())  # 1
print(counter())  # 2
print(counter())  # 3
```

Для этого внешняя функция создаст состояние, а вложенная будет его изменять.

## Почему вариант без `nonlocal` не работает {#pochemu-variant-bez-nonlocal-ne-rabotaet}

```python
def create_counter():
    count = 0

    def increment():
        count += 1
        return count

    return increment


counter = create_counter()
print(counter())  # UnboundLocalError
```

Операция:

```python
count += 1
```

приблизительно означает:

```python
count = count + 1
```

Из-за присваивания Python считает `count` локальной переменной функции `increment()`. Но перед присваиванием нужно прочитать старое локальное значение, которого еще нет. Поэтому возникает `UnboundLocalError`.

## Решение с `nonlocal` {#reshenie-s-nonlocal}

`nonlocal` сообщает Python, что имя нужно взять из ближайшей подходящей внешней функции:

```python
def create_counter():
    count = 0

    def increment():
        nonlocal count
        count += 1
        return count

    return increment


counter = create_counter()

print(counter())  # 1
print(counter())  # 2
print(counter())  # 3
```

При каждом вызове `counter()`:

1. Python находит `count` во внешней функции `create_counter()`.
2. `nonlocal count` разрешает переприсвоить эту переменную.
3. Новое значение сохраняется до следующего вызова.

## Что такое замыкание {#chto-takoe-zamykanie}

После выполнения `create_counter()` ее обычный вызов завершен. Но возвращенная функция `increment()` продолжает хранить доступ к переменной `count`.

Функция вместе с сохраненными переменными внешнего окружения называется **замыканием**.

Каждый созданный счетчик получает независимое состояние:

```python
first_counter = create_counter()
second_counter = create_counter()

print(first_counter())   # 1
print(first_counter())   # 2
print(second_counter())  # 1
```

`first_counter` и `second_counter` были созданы разными вызовами `create_counter()`, поэтому их переменные `count` не связаны.

## Что именно делает `nonlocal` {#chto-imenno-delaet-nonlocal}

`nonlocal` не создает новую переменную. Он требует, чтобы имя уже существовало во внешней функции:

```python
def outer():
    message = "старое значение"

    def inner():
        nonlocal message
        message = "новое значение"

    inner()
    return message


print(outer())  # новое значение
```

Без `nonlocal` присваивание создало бы отдельную локальную переменную `message` внутри `inner()`.

Если подходящего имени нет, программа не запустится:

```python
def outer():
    def inner():
        nonlocal missing_value  # SyntaxError: no binding for nonlocal
```

## Когда `nonlocal` не нужен {#kogda-nonlocal-ne-nuzhen}

Для чтения внешнего значения `nonlocal` не требуется:

```python
def outer():
    message = "Python"

    def inner():
        print(message)  # Python

    inner()
```

Он также не нужен, если функция изменяет содержимое существующего изменяемого объекта, но не переприсваивает само имя:

```python
def create_collector():
    values = []

    def add(value):
        values.append(value)
        return values.copy()

    return add


collect = create_collector()

print(collect(10))  # [10]
print(collect(20))  # [10, 20]
```

Метод `append()` меняет список. Присваивания `values = ...` внутри `add()` нет, поэтому `nonlocal values` не требуется.

Если же присвоить имени новый список, понадобится `nonlocal`:

```python
def create_collector():
    values = []

    def reset():
        nonlocal values
        values = []
        return values

    return reset
```

## `nonlocal` и `global` {#nonlocal-i-global}

| Ключевое слово | Какую переменную изменяет |
| --- | --- |
| `nonlocal` | Переменную ближайшей подходящей внешней функции |
| `global` | Переменную на уровне модуля |

Используй `nonlocal`, когда состояние принадлежит конкретному замыканию. Для общего состояния модуля существует `global`, но его лучше применять редко.

## Типичные ошибки {#tipichnye-oshibki}

1. Изменять внешнюю переменную без `nonlocal`. Возможен `UnboundLocalError`.
2. Объявлять через `nonlocal` несуществующее имя. Возникнет `SyntaxError`.
3. Использовать `nonlocal` только для чтения. Для чтения внешнего имени он не нужен.
4. Добавлять `nonlocal` при вызове `append()`. Изменение содержимого списка не является переприсваиванием имени.
5. Ожидать общее состояние у двух отдельно созданных замыканий. Каждый вызов внешней функции создает свое окружение.

## Самостоятельная практика {#samostoyatelnaya-praktika}

### Задача 1. Сумма очков {#zadacha-1-summa-ochkov}

Напиши `create_score()`, которая возвращает функцию добавления очков:

```python
add_score = create_score()

print(add_score(5))   # 5
print(add_score(10))  # 15
print(add_score(3))   # 18
```

### Задача 2. Переключатель {#zadacha-2-pereklyuchatel}

Создай функцию, возвращающую переключатель. Каждый вызов должен менять сохраненное значение с `False` на `True` и обратно.

Подсказка: внутри вложенной функции понадобится переприсваивание логической переменной.

<OfficialDocsLinks
    :links="[
        { title: 'Python Reference: nonlocal statement', href: 'https://docs.python.org/3/reference/simple_stmts.html#the-nonlocal-statement' },
        { title: 'Python Tutorial: Scopes and Namespaces', href: 'https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Обзор области видимости', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh' },
        { title: 'LEGB и shadowing', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/legb-i-shadowing' },
        { title: 'global и константы', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/global-i-konstanty' },
        { title: 'Декораторы', href: '/python/yazyk-python/1-core/dekoratory-v-python' },
    ]"
/>
