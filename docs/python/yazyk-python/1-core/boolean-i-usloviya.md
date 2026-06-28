---
title: "Boolean и условия"
description: "Булевый тип bool и условия в Python: True, False, if, elif, else, truthy/falsy значения, not, and, or и типичные ошибки."
tags:
  - "python"
  - "core"
  - "bool"
  - "conditions"
updatedAt: "2026-06-21"
---
## Что такое `bool`

`bool` - это булевый тип данных. У него только два значения:

- `True` - истина;
- `False` - ложь.

```python
is_active = True
is_blocked = False

print(is_active)
print(is_blocked)
print(type(is_active))  # <class 'bool'>
```

Булевые значения чаще всего появляются после сравнения.

```python
age = 20

is_adult = age >= 18

print(is_adult)  # True
```

## `if`

`if` выполняет блок кода, только если условие истинное.

```python
age = 20

if age >= 18:
    print("adult")
```

В Python блок кода определяется отступом. Обычно используют `4` пробела.

```python
if age >= 18:
    print("inside if")

print("outside if")
```

Строка с отступом относится к `if`. Строка без отступа выполнится в любом случае.

## `else`

`else` выполняется, если условие в `if` ложное.

```python
age = 16

if age >= 18:
    print("adult")
else:
    print("minor")
```

`else` не принимает отдельное условие. Он означает "во всех остальных случаях".

## `elif`

`elif` нужен, когда вариантов больше двух.

```python
score = 0.72

if score >= 0.9:
    print("excellent")
elif score >= 0.7:
    print("good")
elif score >= 0.5:
    print("ok")
else:
    print("bad")
```

Python проверяет условия сверху вниз и выполняет первый подходящий блок.

Если `score = 0.72`, выполнится блок `score >= 0.7`, а до следующих проверок Python уже не пойдет.

## Truthy и falsy значения

В `if` можно писать не только готовый `bool`. Python сам приводит значение к логическому смыслу.

Falsy-значения считаются ложными:

- `False`
- `None`
- `0`
- `0.0`
- `""`
- `[]`
- `{}`
- `set()`

```python
name = ""

if name:
    print("name exists")
else:
    print("name is empty")
```

Пустая строка `""` считается `False`, поэтому выполнится `else`.

Непустые значения обычно считаются истинными.

```python
items = [10, 20]

if items:
    print("list is not empty")
```

## `not`

`not` переворачивает логическое значение.

```python
print(not True)   # False
print(not False)  # True
```

Частый сценарий - проверить, что значение пустое.

```python
name = ""

if not name:
    print("name is empty")
```

Это читается как "если имени нет".

С `None` обычно пишут явно:

```python
value = None

if value is not None:
    print("value exists")
```

## `and` и `or`

`and` требует, чтобы оба условия были истинными.

```python
age = 20
has_ticket = True

if age >= 18 and has_ticket:
    print("can enter")
```

`or` требует, чтобы истинным было хотя бы одно условие.

```python
is_admin = False
is_owner = True

if is_admin or is_owner:
    print("can edit")
```

Для длинных условий лучше использовать скобки и переносы.

```python
if (
    age >= 18
    and has_ticket
    and not is_blocked
):
    print("can enter")
```

## Вложенные условия

Условия можно вкладывать друг в друга.

```python
age = 20
has_ticket = True

if age >= 18:
    if has_ticket:
        print("can enter")
```

Но глубокая вложенность быстро ухудшает читаемость. Часто лучше объединить условия.

```python
if age >= 18 and has_ticket:
    print("can enter")
```

## Тернарное выражение

Если нужно выбрать одно из двух значений, можно использовать короткую форму:

```python
age = 20

status = "adult" if age >= 18 else "minor"

print(status)
```

Это выражение удобно для простых случаев. Если логика сложная, лучше писать обычный `if / else`.

## Практический пример

```python
def get_access_message(age: int, has_ticket: bool, is_blocked: bool) -> str:
    if is_blocked:
        return "access denied"

    if age < 18:
        return "too young"

    if not has_ticket:
        return "ticket required"

    return "access granted"
```

Здесь условия идут от запрещающих случаев к успешному результату. Такой код часто проще читать, чем один большой `if`.

## Типичные ошибки

1. Забыть двоеточие после `if`, `elif` или `else`.
   Проблема: Python не поймет, где начинается блок.
   Решение: писать `if condition:`.

2. Путать `=` и `==`.
   Проблема: `=` - присваивание, `==` - сравнение.
   Решение: в условиях для сравнения использовать `==`.

3. Писать слишком сложное условие в одну строку.
   Проблема: условие трудно читать и проверять.
   Решение: разбить на переменные или перенести через скобки.

4. Злоупотреблять вложенными `if`.
   Проблема: код уходит вправо и становится хрупким.
   Решение: объединять условия или использовать ранний `return`.

5. Проверять `None` через `==`.
   Проблема: для `None` принято использовать проверку идентичности.
   Решение: писать `value is None` или `value is not None`.

## Cheat-sheet

| Задача | Синтаксис |
| --- | --- |
| Булево значение | `is_active = True` |
| Простое условие | `if condition:` |
| Альтернативная ветка | `else:` |
| Дополнительная проверка | `elif condition:` |
| Инверсия условия | `not condition` |
| Оба условия истинны | `a and b` |
| Хотя бы одно условие истинно | `a or b` |
| Значение не пустое | `if value:` |
| Значение пустое | `if not value:` |
| Проверка на `None` | `value is None` |
| Выбор значения в одну строку | `x if condition else y` |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python: Boolean type', href: 'https://docs.python.org/3/library/stdtypes.html#boolean-type-bool' },
        { title: 'Python: Truth value testing', href: 'https://docs.python.org/3/library/stdtypes.html#truth-value-testing' },
        { title: 'Python: Boolean operations', href: 'https://docs.python.org/3/library/stdtypes.html#boolean-operations-and-or-not' },
        { title: 'Python: if statement', href: 'https://docs.python.org/3/reference/compound_stmts.html#if' },
        { title: 'Python: conditional expressions', href: 'https://docs.python.org/3/reference/expressions.html#conditional-expressions' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Операторы сравнения', href: '/python/yazyk-python/1-core/operatory-sravneniya' },
        { title: 'Логические и побитовые операторы', href: '/python/yazyk-python/1-core/logicheskie-i-pobitovye-operatory' },
        { title: 'Основы синтаксиса и переменные', href: '/python/yazyk-python/1-core/osnovy-sintaksisa-i-peremennye' },
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python' },
    ]"
/>
