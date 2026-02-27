---
title: "Типы данных, изменяемость и ссылки на объекты"
description: "Подробный разбор Python-типов, mutability и модели ссылок на объекты: что происходит в памяти и как избежать частых багов."
tags:
  - "python"
  - "core"
  - "data-types"
  - "mutability"
updatedAt: "2026-02-27"
---
## Зачем это знать Python-разработчику

Большая часть "странных" багов в Python связана не с синтаксисом, а с моделью объектов:

- переменная хранит не само значение, а ссылку на объект;
- часть типов изменяемые (`mutable`), часть нет (`immutable`);
- одни операции создают новый объект, другие меняют текущий.

Если это понимать, становится предсказуемо:

- когда данные неожиданно меняются "в другом месте";
- почему `copy()` иногда не спасает;
- откуда берется эффект с изменяемыми аргументами по умолчанию.

## Базовые типы и изменяемость

### Неизменяемые типы (`immutable`)

- `int` `42`
- `float` `3.14`
- `bool` `True`
- `str` `"python"`
- `tuple` (если внутри нет изменяемых объектов) `(1, "ml", 2.5)`
- `frozenset` `frozenset({"python", "ml"})`
- `bytes` `b"hello"`

Смысл: после создания объект нельзя изменить "на месте". Любая модификация = новый объект.

```python
s = "ml"
old_id = id(s)
s += "-python"
new_id = id(s)

print(old_id == new_id)  # False
```

### Изменяемые типы (`mutable`)

- `list`
- `dict`
- `set`
- `bytearray`
- пользовательские объекты классов (обычно)

Смысл: объект можно менять без создания нового.

```python
items = [1, 2]
old_id = id(items)
items.append(3)
new_id = id(items)

print(old_id == new_id)  # True
```

## Ссылки на объекты: как мыслить правильно

В Python присваивание не "копирует" объект, а привязывает имя к объекту.

```python
a = [1, 2, 3]
b = a

b.append(4)
print(a)  # [1, 2, 3, 4]
```

`a` и `b` ссылаются на один и тот же список.

### `is` и `==`

- `==` сравнивает значения.
- `is` проверяет, один и тот же объект или нет.

```python
x = [1, 2]
y = [1, 2]

print(x == y)  # True
print(x is y)  # False
```

Для `None` всегда использовать `is`:

```python
if value is None:
    ...
```

## Копирование: поверхностное и глубокое

### Поверхностная копия (`shallow copy`)

Копируется только верхний уровень контейнера.

```python
import copy

src = {"user": {"name": "Alice"}, "roles": ["admin"]}
clone = copy.copy(src)

clone["roles"].append("editor")
print(src["roles"])  # ['admin', 'editor'] -> общий вложенный список
```

### Глубокая копия (`deep copy`)

Копируются и вложенные объекты.

```python
import copy

src = {"user": {"name": "Alice"}, "roles": ["admin"]}
clone = copy.deepcopy(src)

clone["roles"].append("editor")
print(src["roles"])  # ['admin']
```

## Типичный источник багов: аргументы по умолчанию

Плохо:

```python
def add_event(event, bucket=[]):
    bucket.append(event)
    return bucket
```

`bucket` создается один раз при объявлении функции, а не на каждый вызов.

Правильно:

```python
def add_event(event, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(event)
    return bucket
```

## Практический пример

Ниже пример, который часто встречается в сервисном коде: сбор payload и защита от случайной мутации.

```python
from copy import deepcopy

base_payload = {
    "source": "web",
    "meta": {"version": 1},
    "tags": ["trial"],
}

def build_payload(user_id: int, template: dict) -> dict:
    # Важно: берем deep copy, чтобы не менять template "по ссылке"
    payload = deepcopy(template)
    payload["user_id"] = user_id
    payload["tags"].append("scored")
    return payload

p1 = build_payload(101, base_payload)
p2 = build_payload(202, base_payload)

print(p1)
print(p2)
print(base_payload)  # template не изменился
```

## Типичные ошибки

1. Путать присваивание и копирование.
   Симптом: изменение в одной переменной "внезапно" влияет на другую.
   Решение: явно использовать `copy()`/`deepcopy()` в нужных местах.

2. Использовать `is` для сравнения строк, чисел, списков.
   Симптом: нестабильные проверки.
   Решение: для значений использовать `==`, `is` только для identity (`None`, singleton-паттерны).

3. Считать, что `tuple` всегда полностью неизменяемый.
   Симптом: внутри `tuple` меняются вложенные `list/dict`.
   Решение: помнить, что неизменяемость `tuple` не "замораживает" вложенные mutable-объекты.

4. Делать только `copy.copy` для сложной вложенной структуры.
   Симптом: вложенные поля все еще общие.
   Решение: использовать `deepcopy` или проектировать data model без shared mutable state.

5. Использовать mutable default arguments.
   Симптом: данные "накапливаются" между вызовами функции.
   Решение: паттерн `None -> create new object`.

## Cheat-sheet

| Тип | Mutable | Пример операции | Создает новый объект |
| --- | --- | --- | --- |
| `int` | Нет | `x += 1` | Да |
| `str` | Нет | `s += "a"` | Да |
| `tuple` | Нет (контейнер) | `t + (1,)` | Да |
| `list` | Да | `lst.append(1)` | Нет |
| `dict` | Да | `d["k"] = 1` | Нет |
| `set` | Да | `s.add(1)` | Нет |

| Сценарий | Что использовать |
| --- | --- |
| Проверка равенства значений | `==` |
| Проверка identity (`None`) | `is` |
| Копия 1-го уровня | `copy.copy(obj)` / `obj.copy()` |
| Копия всей вложенной структуры | `copy.deepcopy(obj)` |
| Безопасный default-параметр | `arg=None` + создание внутри функции |

## Official docs

<OfficialDocsLinks
	:links="[
		{ title: 'Python Data Model', href: 'https://docs.python.org/3/reference/datamodel.html' },
		{ title: 'Built-in Types', href: 'https://docs.python.org/3/library/stdtypes.html' },
		{ title: 'copy module', href: 'https://docs.python.org/3/library/copy.html' },
		{ title: 'Functions and default arguments', href: 'https://docs.python.org/3/tutorial/controlflow.html#default-argument-values' },
	]"
/>

<RelatedTopics
	:items="[
		{ title: 'Python Core: функции, классы, модули, venv и pip', href: '/python/1-core/python-core-funktsii-klassy-moduli-venv-i-pip' },
		{ title: 'Введение в Python', href: '/python/vvedenie-v-python' },
		{ title: 'NumPy и Pandas для ML', href: '/python/numpy-i-pandas-dlya-ml' },
	]"
/>
