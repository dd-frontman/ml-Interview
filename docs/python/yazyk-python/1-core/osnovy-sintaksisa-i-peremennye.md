---
title: "Основы синтаксиса и переменные"
description: "Базовый синтаксис Python: типы данных, присваивание переменных, стиль именования и распаковка значений через запятую."
tags:
  - "python"
  - "core"
  - "syntax"
  - "variables"
updatedAt: "2026-06-20"
---
## Зачем это знать

Базовый синтаксис нужен, чтобы читать любой Python-код без догадок:

- что делает `=`;
- чем `=` отличается от `==`;
- как называть переменные, функции, классы и константы;
- почему `x, y = y, x` работает;
- как присваивание связано со ссылками на объекты.

## Типы данных с примерами

Базовые типы:

- `int` `42`
- `float` `3.14`
- `bool` `True`
- `str` `"alice"`
- `None` `None`

Контейнерные типы:

- `list[int]` `[10, 20, 30]`
- `tuple[float, float]` `(55.75, 37.62)`
- `dict[str, str]` `{"id": "42", "role": "admin"}`
- `set[str]` `{"python", "backend", "ml"}`

Комбинированные и nullable-типы:

```python
from typing import Optional

payload: dict[str, list[int]] = {"values": [1, 2, 3]}
email: Optional[str] = None  # str | None
```

Практическое правило:

- если значение может отсутствовать, используй `T | None` (`Optional[T]`);
- в проектном коде для публичных функций и методов ставь type hints на вход и выход.

## Присваивание переменных

В Python переменная - это имя, которое привязано к объекту. Оператор `=` не сравнивает значения, а связывает имя слева со значением справа.

```python
name = "Alice"
score = 0.91
is_active = True

print(name)
print(score)
print(is_active)
```

Переменную можно переиспользовать и привязать к новому объекту.

```python
score = 0.91
score = 0.87

print(score)  # 0.87
```

Python не запрещает поменять тип значения в той же переменной.

```python
value = 42
value = "42"
```

Но в рабочем коде так лучше не делать без причины: имя переменной должно сохранять понятный смысл.

`=` и `==` - разные операции:

```python
score = 10       # присваивание
print(score == 10)  # сравнение, True
```

Если переменная указывает на изменяемый объект, важно отличать перепривязку имени от изменения объекта.

```python
items = [1, 2]
same_items = items

items.append(3)

print(items)       # [1, 2, 3]
print(same_items)  # [1, 2, 3]
```

Здесь оба имени смотрят на один список. Подробно это разбирается в разделе [Типы данных](../tipy-dannykh/tipy-glavnaya.md).

Сокращенные операторы присваивания обновляют значение через операцию:

```python
count = 1
count += 1

print(count)  # 2
```

## Имена и стиль именования

В Python имена должны помогать понять роль объекта в коде. Для разных сущностей приняты разные стили.

| Стиль | Для чего используется | Пример |
| --- | --- | --- |
| `snake_case` | переменные, функции, методы, модули | `user_score`, `load_data()`, `model.fit()` |
| `CamelCase` | классы | `UserProfile`, `TrainingConfig` |
| `UPPER_CASE` | константы | `DEFAULT_THRESHOLD`, `MAX_RETRIES` |
| `kebab-case` | имена устанавливаемых пакетов | `yet-another-package` |

`snake_case` - основной стиль для обычного Python-кода.

```python
model_version = "churn-v1"
user_score = 0.91

def normalize_email(email: str) -> str:
    return email.strip().lower()
```

Классы пишут в `CamelCase`, потому что класс описывает тип объекта.

```python
class UserProfile:
    pass
```

Константы по соглашению пишут в `UPPER_CASE`, хотя Python технически не запрещает их изменить.

```python
DEFAULT_THRESHOLD = 0.5
MAX_RETRIES = 3
```

Для package names есть важная деталь: имя пакета в PyPI или `pip install` часто пишут через дефис, но имя для `import` обычно не содержит дефис.

```bash
pip install scikit-learn
```

```python
import sklearn
```

Дефис нельзя использовать в имени Python-модуля, потому что `-` читается как оператор вычитания. Поэтому для файлов и импортируемых модулей используй lower-case или `snake_case`: `data_loader.py`, `feature_store.py`.

Практическое правило: выбирай имя по смыслу данных, не переиспользуй одну переменную для разных сущностей и помни, что присваивание не всегда означает копирование.

## Присваивание через запятую

Запятая в присваивании чаще всего означает распаковку значений по нескольким именам.

```python
name, score = "Alice", 0.91

print(name)
print(score)
```

Слева должно быть столько имен, сколько значений справа.

```python
x, y = 10, 20
x, y = y, x

print(x, y)  # 20 10
```

Такая запись часто используется для обмена значений без временной переменной.

Если справа список или tuple, Python тоже распакует его по позициям.

```python
point = (55.75, 37.62)
lat, lon = point

print(lat)
print(lon)
```

Если часть значений нужна одним списком, используется `*`.

```python
first, *middle, last = [10, 20, 30, 40]

print(first)   # 10
print(middle)  # [20, 30]
print(last)    # 40
```

Важная деталь: tuple создает запятая, а не скобки.

```python
coords = 55.75, 37.62
single = 42,

print(coords)  # (55.75, 37.62)
print(single)  # (42,)
```

Типичная ошибка - не совпадает количество имен и значений.

```python
# ValueError: too many values to unpack
name, score = "Alice", 0.91, "extra"
```

Практическое правило: используй присваивание через запятую для короткой и очевидной распаковки. Если строка становится длинной или непонятной, лучше разнести шаги явно.

## Типичные ошибки

1. Путать `=` и `==`.
   Проблема: `=` присваивает, `==` сравнивает.
   Решение: читать выражение вслух: "присвоить" или "сравнить".

2. Считать, что присваивание копирует список или словарь.
   Проблема: два имени могут ссылаться на один mutable-объект.
   Решение: для копий использовать `copy()` или `deepcopy`.

3. Делать слишком длинную распаковку через запятую.
   Проблема: код сложно читать и легко ошибиться с порядком.
   Решение: распаковывать только короткие очевидные структуры.

4. Использовать стиль не по назначению.
   Проблема: `userProfile`, `User_profile` или `default-threshold` выглядят чужеродно для Python.
   Решение: переменные и функции писать в `snake_case`, классы - в `CamelCase`, константы - в `UPPER_CASE`.

## Cheat-sheet

| Синтаксис | Смысл |
| --- | --- |
| `name = value` | Привязать имя к объекту |
| `a == b` | Сравнить значения |
| `a, b = 1, 2` | Распаковать значения |
| `a, b = b, a` | Поменять значения местами |
| `first, *rest = items` | Забрать первый элемент и остаток |
| `user_score` | Имя переменной в `snake_case` |
| `UserProfile` | Имя класса в `CamelCase` |
| `DEFAULT_THRESHOLD` | Константа в `UPPER_CASE` |
| `yet-another-package` | Имя устанавливаемого пакета |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python: Assignment statements', href: 'https://docs.python.org/3/reference/simple_stmts.html#assignment-statements' },
        { title: 'Python: Built-in types', href: 'https://docs.python.org/3/library/stdtypes.html' },
        { title: 'Python: Tuples and sequences', href: 'https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences' },
        { title: 'PEP 8: Naming Conventions', href: 'https://peps.python.org/pep-0008/#naming-conventions' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Основные функции', href: '/python/yazyk-python/1-core/osnovnye-funktsii' },
        { title: 'Арифметические операторы', href: '/python/yazyk-python/1-core/arifmeticheskie-operatory' },
        { title: 'Операторы сравнения', href: '/python/yazyk-python/1-core/operatory-sravneniya' },
        { title: 'Типы главная', href: '/python/yazyk-python/tipy-dannykh/tipy-glavnaya' },
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python' },
        { title: 'Логические и побитовые операторы', href: '/python/yazyk-python/1-core/logicheskie-i-pobitovye-operatory' },
    ]"
/>
