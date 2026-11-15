---
title: "Пространства имён и dir"
description: "Как импорты добавляют имена в пространство имён модуля, как работают globals, dir и встроенный модуль builtins."
tags:
  - "python"
  - "core"
  - "imports"
  - "namespaces"
updatedAt: "2026-11-13"
---
## Пространство имён {#prostranstvo-imyon}

**Пространство имён** связывает имена с объектами Python.

После запуска файла его переменные, функции и импортированные модули попадают в глобальное пространство имён этого модуля:

```python
my_number = 10

print("my_number" in globals())  # True
```

`globals()` возвращает словарь глобального пространства имён. Ключи этого словаря — имена, а значения — связанные с ними объекты.

## Что добавляет `import` {#chto-dobavlyaet-import}

После импорта появляется новое имя:

```python
import random

print("random" in globals())  # True
print(type(random))            # <class 'module'>
```

Имя `random` ссылается на объект модуля. Его атрибуты доступны через точку:

```python
print(random.randint(1, 1))  # 1
```

У каждого модуля собственное глобальное пространство имён. Переменная из одного файла не становится автоматически доступной в другом.

## Зачем нужны отдельные пространства имён {#zachem-nuzhny-otdelnye-prostranstva-imyon}

Разные модули могут содержать функции с одинаковым именем:

```python
import json
import pickle

json.dumps({"id": 1})
pickle.dumps({"id": 1})
```

Функции `json.dumps` и `pickle.dumps` не конфликтуют, потому что находятся в разных пространствах имён.

## Функция `dir()` {#funktsiya-dir}

`dir()` показывает имена атрибутов объекта:

```python
import random

names = dir(random)

print("choice" in names)   # True
print("randint" in names)  # True
```

`dir()` полезен для первичного знакомства с объектом, но не объясняет назначение каждого атрибута. Подробности лучше смотреть через `help()` или официальную документацию:

```python
help(random.choice)
```

## Встроенные имена {#vstroennye-imena}

Функции `print`, `len`, `range`, типы `list`, `dict` и другие базовые имена находятся в модуле `builtins`:

```python
import builtins

print("len" in dir(builtins))    # True
print("print" in dir(builtins))  # True
```

Python автоматически делает встроенные имена доступными. Для обычного вызова `len()` или `print()` писать `import builtins` не нужно.

## Конфликт имён {#konflikt-imyon}

Новое присваивание может скрыть импортированный объект:

```python
import random

random = "не модуль"

print(random)  # не модуль
```

После присваивания имя `random` больше не ссылается на модуль. Выбирай имена переменных так, чтобы они не перекрывали нужные импорты.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Импортируй `math` и проверь через `dir()`, существует ли имя `sqrt`.
2. Найди импортированный модуль среди ключей `globals()`.
3. Создай переменную с именем импортированного модуля и объясни, почему доступ к его функциям пропал.

<RelatedTopics
    :items="[
        { title: 'Обзор импортов', href: '/python/yazyk-python/1-core/importy-i-moduli/' },
        { title: 'Формы импорта', href: '/python/yazyk-python/1-core/importy-i-moduli/formy-importa' },
        { title: 'Область видимости', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/' },
    ]"
/>
