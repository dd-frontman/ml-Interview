---
title: "Продвинутые функции: args и kwargs"
description: "Конспект по продвинутым возможностям функций Python: *args, **kwargs, распаковка списков и словарей, порядок аргументов, возврат нескольких значений и флаг изменения."
tags:
  - "python"
  - "core"
  - "functions"
  - "args"
updatedAt: "2026-07-16"
---
## Что входит в тему

В этой теме разбираются продвинутые возможности функций:

- `*args` - любое количество позиционных аргументов;
- `**kwargs` - любое количество именованных аргументов;
- распаковка списка через `*`;
- распаковка словаря через `**`;
- порядок аргументов в функции;
- возврат нескольких значений;
- распаковка результата функции;
- флаг, который показывает, изменились ли данные.

## `*args`

`*args` собирает все лишние позиционные аргументы в кортеж.

```python
def add_all(*args):
    summary = 0

    for num in args:
        summary += num

    return summary
```

Теперь функцию можно вызвать с разным количеством чисел.

```python
print(add_all(1, 2, 3))        # 6
print(add_all(1, 2, 3, 4, 5))  # 15
```

Внутри функции `args` будет кортежем.

```python
def show_args(*args):
    print(args)
    print(type(args))


show_args(1, 2, 3)
# (1, 2, 3)
# <class 'tuple'>
```

## Когда нужен `*args`

`*args` полезен, когда функция должна принимать произвольное количество позиционных значений.

Примеры:

- сложить любое количество чисел;
- собрать несколько строк;
- передать аргументы дальше в другую функцию.

Если количество параметров фиксированное, лучше писать обычные параметры.

```python
def add_two_numbers(a: int, b: int) -> int:
    return a + b
```

Такой код проще читать, чем `*args`, если аргументов всегда два.

## Распаковка списка через `*`

Если значения уже лежат в списке, их можно распаковать в позиционные аргументы.

```python
values = [1, 2, 3, 4, 5]

print(add_all(*values))  # 15
```

Без `*` в функцию попадет один аргумент - сам список.

```python
print(add_all(values))  # TypeError
```

`add_all()` ожидает числа, а не список как один элемент.

Можно распаковать несколько списков.

```python
values = [1, 2, 3, 4, 5]
other_values = [6, 7, 8, 9, 10]

print(add_all(*values, *other_values))  # 55
```

## `**kwargs`

`**kwargs` собирает все лишние именованные аргументы в словарь.

```python
def introduce(**kwargs):
    for key, value in kwargs.items():
        print(key)
        print(value)
```

Вызов:

```python
introduce(name="John", age=30, city="New York")
```

Внутри функции `kwargs` будет словарем.

```python
{
    "name": "John",
    "age": 30,
    "city": "New York",
}
```

## Когда нужен `**kwargs`

`**kwargs` полезен, когда функция принимает гибкий набор именованных параметров.

Например:

- обновить словарь новыми полями;
- принять настройки;
- передать параметры дальше;
- обработать данные, где набор ключей может отличаться.

Пример: функция обновляет профиль пользователя, но заранее неизвестно, какие поля придут.

```python
def update_user(user: dict, **kwargs) -> dict:
    for key, value in kwargs.items():
        user[key] = value

    return user


user = {
    "name": "John",
    "age": 30,
}

update_user(user, city="New York")
print(user)
# {"name": "John", "age": 30, "city": "New York"}

update_user(user, age=31, job="Engineer")
print(user)
# {"name": "John", "age": 31, "city": "New York", "job": "Engineer"}
```

Здесь `**kwargs` нужен потому, что в одном вызове приходит `city`, а в другом - `age` и `job`.

Но если параметры известны заранее, лучше объявлять их явно.

```python
def create_user(*, name: str, age: int, city: str) -> dict:
    return {"name": name, "age": age, "city": city}
```

Такой контракт понятнее, чем полностью свободный `**kwargs`.

## Распаковка словаря через `**`

Если данные уже лежат в словаре, его можно распаковать в именованные аргументы.

```python
person = {
    "city": "New York",
    "age": 30,
    "name": "John",
}

introduce(**person)
```

Это равносильно такому вызову:

```python
introduce(city="New York", age=30, name="John")
```

Ключи словаря становятся именами аргументов.

## Порядок аргументов

В функции можно сочетать разные виды аргументов.

```python
def func_with_all_arguments(x: int, y: int, *args, value: int = 6, **kwargs):
    print(x, y)
    print(args)
    print(value)
    print(kwargs)
```

Порядок в объявлении:

1. Обычные позиционные параметры: `x`, `y`.
2. Дополнительные позиционные аргументы: `*args`.
3. Именованные параметры после `*args`: `value`.
4. Дополнительные именованные аргументы: `**kwargs`.

Корректный вызов:

```python
person = {
    "city": "New York",
    "age": 30,
    "name": "John",
}

func_with_all_arguments(
    1,
    2,
    3,
    4,
    5,
    value=10,
    **person,
)
```

Что попадет внутрь:

- `x = 1`;
- `y = 2`;
- `args = (3, 4, 5)`;
- `value = 10`;
- `kwargs = {"city": "New York", "age": 30, "name": "John"}`.

## Частая ошибка при смешивании `*` и именованных аргументов

Нельзя передать один и тот же параметр дважды.

```python
func_with_all_arguments(
    *[3, 4, 5, 6],
    x=1,
    y=2,
)
```

Такой вызов приведет к ошибке: список через `*` уже передал значения для `x` и `y`, а потом `x=1` и `y=2` пытаются передать их второй раз.

Ошибка будет похожа на:

```text
TypeError: got multiple values for argument 'x'
```

Безопаснее писать явно:

```python
func_with_all_arguments(1, 2, *[3, 4, 5, 6])
```

## Возврат нескольких значений

Функция может вернуть несколько значений через запятую.

```python
def modify_dict(old_dict: dict, **kwargs) -> tuple[dict, bool]:
    is_modified = False

    for key, value in kwargs.items():
        if old_dict.get(key) != value:
            old_dict[key] = value
            is_modified = True

    return old_dict, is_modified
```

Фактически Python возвращает кортеж.

```python
product = {"id": 1, "name": "Laptop", "price": 999.99}

structure = modify_dict(old_dict=product, in_stock=True)

print(type(structure))  # <class 'tuple'>
print(structure)
```

## Распаковка результата

Результат из нескольких значений обычно сразу распаковывают.

```python
product = {"id": 1, "name": "Laptop", "price": 999.99}

product, was_modified = modify_dict(old_dict=product, in_stock=True)

print(product)
# {"id": 1, "name": "Laptop", "price": 999.99, "in_stock": True}

print(was_modified)  # True
```

В этой записи:

- `product` получает обновленный словарь;
- `was_modified` получает `True` или `False`.

## Флаг изменения

Флаг `is_modified` нужен, чтобы понять, поменяла ли функция данные.

```python
product, was_modified = modify_dict(old_dict=product, id=1, name="Laptop")

print(product)
print(was_modified)  # False
```

Если новые значения совпадают со старыми, словарь не меняется, а `was_modified` остается `False`.

Если хотя бы одно значение отличается, функция меняет словарь и возвращает `True`.

## Важная деталь: функция меняет словарь

В примере `modify_dict()` изменяет исходный словарь.

```python
old_dict[key] = value
```

Это значит, что объект, переданный в функцию, меняется на месте.

```python
product = {"id": 1}

updated_product, was_modified = modify_dict(old_dict=product, name="Laptop")

print(product)
# {"id": 1, "name": "Laptop"}
```

Если нужно не менять исходный словарь, сначала сделай копию.

```python
def modify_dict_copy(old_dict: dict, **kwargs) -> tuple[dict, bool]:
    new_dict = old_dict.copy()
    is_modified = False

    for key, value in kwargs.items():
        if new_dict.get(key) != value:
            new_dict[key] = value
            is_modified = True

    return new_dict, is_modified
```

## Что именно нужно перебирать

Если функция должна применить новые значения из `**kwargs`, перебирать нужно `kwargs.items()`.

```python
for key, value in kwargs.items():
    ...
```

Если случайно перебирать старый словарь, новые значения из `kwargs` вообще не будут обработаны.

```python
for key, value in old_dict.items():
    ...
```

Это логическая ошибка: цикл проходит по старым данным, а не по данным, которые пользователь передал в функцию.

## Частые ошибки

1. Использовать `*args`, когда количество аргументов фиксированное.
   Проблема: функция становится менее понятной.
   Решение: для фиксированного контракта писать обычные параметры.

2. Передавать список без распаковки.
   Проблема: функция получает список как один аргумент.
   Решение: использовать `add_all(*values)`.

3. Передавать один параметр дважды.
   Проблема: `*[3, 4]` уже заполняет `x` и `y`, поэтому `x=1` даст конфликт.
   Решение: не смешивать два способа передачи одного и того же параметра.

4. Перебирать `old_dict.items()` вместо `kwargs.items()`.
   Проблема: новые значения не применяются.
   Решение: если обновления пришли в `**kwargs`, цикл должен идти по `kwargs.items()`.

5. Забывать, что `return a, b` возвращает кортеж.
   Проблема: вызывающий код может ожидать один объект.
   Решение: распаковывать результат: `value, flag = func()`.

6. Не учитывать мутацию словаря.
   Проблема: исходный словарь меняется внутри функции.
   Решение: если мутация не нужна, работать с `old_dict.copy()`.

## Cheat-sheet

| Синтаксис | Что делает |
| --- | --- |
| `def func(*args):` | Собирает позиционные аргументы в tuple |
| `func(*values)` | Распаковывает список/кортеж в позиционные аргументы |
| `def func(**kwargs):` | Собирает именованные аргументы в dict |
| `func(**payload)` | Распаковывает словарь в именованные аргументы |
| `def func(x, y, *args, value=6, **kwargs):` | Комбинирует разные типы аргументов |
| `return a, b` | Возвращает кортеж из двух значений |
| `a, b = func()` | Распаковывает результат функции |
| `old_dict.copy()` | Делает поверхностную копию словаря |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Arbitrary Argument Lists', href: 'https://docs.python.org/3/tutorial/controlflow.html#arbitrary-argument-lists' },
        { title: 'Python Tutorial: Unpacking Argument Lists', href: 'https://docs.python.org/3/tutorial/controlflow.html#unpacking-argument-lists' },
        { title: 'Python Tutorial: Keyword Arguments', href: 'https://docs.python.org/3/tutorial/controlflow.html#keyword-arguments' },
        { title: 'Python Tutorial: Tuples and Sequences', href: 'https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python' },
        { title: 'Словари dict', href: '/python/yazyk-python/tipy-dannykh/slovari-dict' },
        { title: 'Кортежи tuple', href: '/python/yazyk-python/tipy-dannykh/kortezhi-tuple' },
        { title: 'Область видимости переменных', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh' },
    ]"
/>
