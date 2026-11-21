---
title: "Ссылки, сравнение и копирование"
description: "Как Python связывает имена с объектами, чем отличаются is и ==, как работают поверхностные и глубокие копии."
tags:
  - "python"
  - "core"
  - "data-types"
  - "mutability"
  - "copy"
updatedAt: "2026-11-21"
---
## Зачем разбираться в ссылках {#zachem-razbiratsya-v-ssylkakh}

Два имени могут указывать на один изменяемый объект. Тогда изменение через одно имя будет видно через другое.

```python
first = [1, 2]
second = first

second.append(3)

print(first)  # [1, 2, 3]
```

Чтобы предсказать результат, нужно различать три действия:

- привязку имени к объекту;
- изменение существующего объекта;
- создание копии.

## Присваивание не копирует объект {#prisvaivanie-ne-kopiruet-obekt}

Оператор `=` связывает имя с объектом. В примере `first` и `second` ссылаются на один список:

```python
first = [1, 2]
second = first

print(first is second)  # True
```

Перепривязка одного имени не меняет другое:

```python
first = [1, 2]
second = first

second = [10, 20]

print(first)   # [1, 2]
print(second)  # [10, 20]
```

Строка `second = [10, 20]` создаёт новый список и связывает с ним только имя `second`.

## Изменение и создание нового объекта {#izmenenie-i-sozdanie-novogo-obekta}

Метод `list.append()` меняет список на месте:

```python
items = [1, 2]
same_items = items

items.append(3)

print(items is same_items)  # True
```

Строка неизменяемая, поэтому конкатенация создаёт другой объект:

```python
text = "py"
old_text = text

text += "thon"

print(text)  # python
print(text is old_text)  # False
```

Списки изменяемых и неизменяемых типов находятся на отдельных страницах: [изменяемые типы](./izmenyaemye-tipy.md) и [неизменяемые типы](./neizmenyaemye-tipy.md).

## `==` и `is` {#i-is}

`==` сравнивает значения, а `is` проверяет идентичность: являются ли операнды одним объектом.

```python
first = [1, 2]
second = [1, 2]

print(first == second)  # True
print(first is second)  # False
```

С `None` используют `is`, потому что в программе существует один объект `None`:

```python
result = None

if result is None:
    print("Результата нет")  # Результата нет
```

Не стоит применять `is` для сравнения строк и чисел. Интерпретатор может переиспользовать некоторые неизменяемые объекты, но это деталь реализации, на которую нельзя опираться.

## Поверхностная копия {#poverkhnostnaya-kopiya}

Поверхностная копия создаёт новый внешний контейнер, но оставляет ссылки на вложенные объекты.

```python
import copy

source = {"roles": ["admin"]}
clone = copy.copy(source)

clone["roles"].append("editor")

print(source["roles"])  # ['admin', 'editor']
print(source is clone)  # False
print(source["roles"] is clone["roles"])  # True
```

Для встроенных коллекций поверхностную копию часто получают через `list.copy()`, `dict.copy()` или срез списка `items[:]`.

## Глубокая копия {#glubokaya-kopiya}

`copy.deepcopy()` рекурсивно копирует вложенные объекты:

```python
import copy

source = {"roles": ["admin"]}
clone = copy.deepcopy(source)

clone["roles"].append("editor")

print(source["roles"])  # ['admin']
print(source["roles"] is clone["roles"])  # False
```

Глубокая копия нужна не всегда. Она требует дополнительной памяти, может быть дорогой для больших структур и иногда копирует больше данных, чем требуется. Если известна структура объекта, часто проще явно создать новый словарь или список только с нужными полями.

## Изменяемый аргумент по умолчанию {#izmenyaemyy-argument-po-umolchaniyu}

Значение параметра по умолчанию создаётся один раз при выполнении `def`, а не перед каждым вызовом:

```python
def add_event(event, bucket=[]):
    bucket.append(event)
    return bucket


print(add_event("login"))   # ['login']
print(add_event("logout"))  # ['login', 'logout']
```

Если состояние между вызовами не нужно, используй `None` как маркер:

```python
def add_event(event, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(event)
    return bucket
```

Параметры функций подробно разобраны на странице [значений по умолчанию](../1-core/funktsii-v-python/znacheniya-parametrov-po-umolchaniyu.md).

## Практический пример {#prakticheskiy-primer}

Нужно создать payload для пользователя и не изменить исходный шаблон:

```python
from copy import deepcopy

base_payload = {
    "source": "web",
    "meta": {"version": 1},
    "tags": ["trial"],
}


def build_payload(user_id: int, template: dict) -> dict:
    payload = deepcopy(template)
    payload["user_id"] = user_id
    payload["tags"].append("scored")
    return payload


payload = build_payload(101, base_payload)

print(payload["tags"])       # ['trial', 'scored']
print(base_payload["tags"])  # ['trial']
```

Здесь `deepcopy()` нужен из-за вложенного списка `tags` и словаря `meta`. Поверхностная копия оставила бы их общими с шаблоном.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Создай два имени для одного списка. Измени список и проверь `is` и `==`.
2. Скопируй словарь с вложенным списком через `dict.copy()`. Измени вложенный список и объясни результат.
3. Замени поверхностную копию на `deepcopy()` и сравни результат.

## Типичные ошибки {#tipichnye-oshibki}

1. Считать присваивание копированием. Оба имени продолжают ссылаться на один объект.
2. Использовать `is` для сравнения значений. Для значений нужен `==`, а `is` проверяет идентичность.
3. Ожидать полной независимости после `copy.copy()`. Вложенные объекты остаются общими.
4. Применять `deepcopy()` без необходимости. Иногда достаточно явно скопировать один изменяемый уровень.
5. Использовать изменяемый объект как значение параметра по умолчанию, когда состояние между вызовами не требуется.

## Шпаргалка {#shpargalka}

| Задача | Инструмент |
| --- | --- |
| Сравнить значения | `==` |
| Проверить, что это один объект | `is` |
| Скопировать внешний контейнер | `copy.copy()` или метод `.copy()` |
| Скопировать вложенную структуру | `copy.deepcopy()` |
| Создавать новый список для каждого вызова | `arg=None` и создание списка внутри функции |

<OfficialDocsLinks
    :links="[
        { title: 'Python Data Model', href: 'https://docs.python.org/3/reference/datamodel.html' },
        { title: 'copy module', href: 'https://docs.python.org/3/library/copy.html' },
        { title: 'Default Argument Values', href: 'https://docs.python.org/3/tutorial/controlflow.html#default-argument-values' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Типы данных', href: '/python/yazyk-python/tipy-dannykh/tipy-glavnaya' },
        { title: 'Изменяемые типы', href: '/python/yazyk-python/tipy-dannykh/izmenyaemye-tipy' },
        { title: 'Неизменяемые типы', href: '/python/yazyk-python/tipy-dannykh/neizmenyaemye-tipy' },
        { title: 'Значения по умолчанию', href: '/python/yazyk-python/1-core/funktsii-v-python/znacheniya-parametrov-po-umolchaniyu' },
    ]"
/>
