---
title: "Методы типов данных"
description: "Шпаргалка по самым используемым методам built-in типов Python: числа, строки, списки, словари, множества и бинарные данные."
tags:
  - "python"
  - "core"
  - "data-types"
  - "methods"
updatedAt: "2026-06-24"
---
## Как пользоваться страницей

- Ниже собраны методы built-in типов, которые уже есть в этом разделе по Python.
- Не у каждого типа есть `5-10` реально полезных методов. У `tuple` и `bool` набор заметно меньше, поэтому там показан почти весь практический минимум.
- Для чисел часто важнее встроенные функции `abs()`, `round()`, `sum()`, `min()`, `max()`, а не методы объектов.
- Пользовательские объекты классов здесь не разбираем: их набор методов зависит от того, как написан сам класс.

## `str`

Подробный разбор строк есть на отдельной странице: [Операции со строками](./operatsii-so-strokami.md).

Чаще всего используют:

- `strip()`
- `lower()`
- `upper()`
- `split()`
- `join()`
- `replace()`
- `find()`
- `count()`
- `isdigit()`
- `startswith()`
- `endswith()`

```python
text = "  ml,python,sql  "
clean = text.strip()
parts = clean.split(",")

print(clean)  # ml,python,sql
print(parts)  # ['ml', 'python', 'sql']
print(" / ".join(parts))  # ml / python / sql
print(clean.replace("sql", "statistics"))  # ml,python,statistics
print(clean.upper())  # ML,PYTHON,SQL
print(clean.lower())  # ml,python,sql
print(clean.find("python"))  # 3
print(clean.count("python"))  # 1
print("123".isdigit())  # True
print(clean.startswith("ml"))  # True
print(clean.endswith("sql"))  # True
```

## `list`

Чаще всего используют:

- `append()`
- `extend()`
- `insert()`
- `remove()`
- `pop()`
- `sort()`
- `copy()`
- `count()`
- `index()`

```python
items = ["python", "sql"]

items.append("ml")
items.extend(["stats", "ml"])
items.insert(1, "numpy")

print(items)  # ['python', 'numpy', 'sql', 'ml', 'stats', 'ml']
print(items.count("ml"))  # 2
print(items.index("sql"))  # 2

snapshot = items.copy()
items.remove("stats")
last_item = items.pop()
items.sort()

print(items)  # ['ml', 'numpy', 'python', 'sql']
print(last_item)  # 'ml'
print(snapshot)  # ['python', 'numpy', 'sql', 'ml', 'stats', 'ml']
```

## `dict`

Чаще всего используют:

- `get()`
- `setdefault()`
- `update()`
- `keys()`
- `values()`
- `items()`
- `pop()`
- `copy()`

```python
user = {"id": 1, "name": "Alice"}

print(user.get("role", "guest"))  # guest

user.setdefault("active", True)
user.update({"role": "admin", "name": "Bob"})

print(list(user.keys()))  # ['id', 'name', 'active', 'role']
print(list(user.values()))  # [1, 'Bob', True, 'admin']
print(list(user.items()))
# [('id', 1), ('name', 'Bob'), ('active', True), ('role', 'admin')]

snapshot = user.copy()
role = user.pop("role")

print(role)  # admin
print(snapshot["role"])  # admin
print(user)  # {'id': 1, 'name': 'Bob', 'active': True}
```

## `set`

Чаще всего используют:

- `add()`
- `update()`
- `intersection()`
- `union()`
- `difference()`
- `discard()`
- `remove()`

```python
skills = {"python", "sql"}

skills.add("ml")
skills.update({"pandas", "sql"})

print(sorted(skills))  # ['ml', 'pandas', 'python', 'sql']
print(sorted(skills.intersection({"ml", "java", "sql"})))  # ['ml', 'sql']
print(sorted(skills.union({"docker"})))  # ['docker', 'ml', 'pandas', 'python', 'sql']
print(sorted(skills.difference({"sql"})))  # ['ml', 'pandas', 'python']

skills.discard("java")
skills.remove("pandas")

print(sorted(skills))  # ['ml', 'python', 'sql']
```

## `tuple`

У `tuple` методов мало. В повседневном коде почти всегда нужны только:

- `count()`
- `index()`

```python
point = (10, 20, 10, 30)

print(point.count(10))  # 2
print(point.index(20))  # 1
```

## `frozenset`

Чаще всего используют:

- `union()`
- `intersection()`
- `difference()`
- `symmetric_difference()`
- `issubset()`
- `issuperset()`
- `isdisjoint()`

```python
base = frozenset({"python", "sql", "ml"})
backend = frozenset({"python", "sql", "fastapi"})

print(sorted(base.union(backend)))  # ['fastapi', 'ml', 'python', 'sql']
print(sorted(base.intersection(backend)))  # ['python', 'sql']
print(sorted(base.difference({"sql"})))  # ['ml', 'python']
print(sorted(base.symmetric_difference({"sql", "docker"})))  # ['docker', 'ml', 'python']
print(frozenset({"python", "sql"}).issubset(base))  # True
print(base.issuperset({"python"}))  # True
print(base.isdisjoint({"java", "go"}))  # True
```

## `bytes`

Чаще всего используют:

- `strip()`
- `split()`
- `replace()`
- `find()`
- `startswith()`
- `endswith()`
- `decode()`

```python
payload = b" user=alice;role=admin \n"
clean = payload.strip()

print(clean)  # b'user=alice;role=admin'
print(clean.split(b";"))  # [b'user=alice', b'role=admin']
print(clean.replace(b"alice", b"bob"))  # b'user=bob;role=admin'
print(clean.find(b"role"))  # 11
print(clean.startswith(b"user"))  # True
print(clean.endswith(b"admin"))  # True
print(clean.decode("utf-8"))  # user=alice;role=admin
```

## `bytearray`

Чаще всего используют:

- `append()`
- `extend()`
- `find()`
- `pop()`
- `remove()`
- `reverse()`
- `decode()`

```python
buffer = bytearray(b"abc")

buffer.append(ord("d"))
buffer.extend(b"ef")

print(buffer)  # bytearray(b'abcdef')
print(buffer.find(b"cd"))  # 2

last_byte = buffer.pop()
buffer.remove(ord("b"))
buffer.reverse()

print(last_byte)  # 102
print(buffer)  # bytearray(b'edca')
print(buffer.decode("utf-8"))  # edca
```

## `int`

У чисел методов немного, но эти встречаются чаще остальных:

- `bit_length()`
- `bit_count()`
- `to_bytes()`
- `int.from_bytes()`
- `as_integer_ratio()`

```python
n = 42

print(n.bit_length())  # 6
print(n.bit_count())  # 3
print(n.to_bytes(2, "big"))  # b'\x00*'
print(int.from_bytes(b"\x00*", "big"))  # 42
print(n.as_integer_ratio())  # (42, 1)
```

## `float`

У `float` методов тоже немного:

- `as_integer_ratio()`
- `is_integer()`
- `hex()`
- `float.fromhex()`
- `conjugate()`

```python
x = 12.5
hex_value = x.hex()

print(x.as_integer_ratio())  # (25, 2)
print(x.is_integer())  # False
print((10.0).is_integer())  # True
print(hex_value)  # 0x1.9000000000000p+3
print(float.fromhex(hex_value))  # 12.5
print(x.conjugate())  # 12.5
```

## `bool`

У `bool` почти нет отдельного прикладного API. На практике это скорее логический тип, а не объект, у которого часто вызывают методы. Но он наследует часть методов от `int`:

- `bit_length()`
- `bit_count()`
- `to_bytes()`
- `as_integer_ratio()`
- `conjugate()`

```python
flag = True

print(flag.bit_length())  # 1
print(flag.bit_count())  # 1
print(flag.to_bytes(1, "big"))  # b'\x01'
print(flag.as_integer_ratio())  # (1, 1)
print(flag.conjugate())  # 1
```

## Практический вывод

- Для текстов чаще всего нужны методы `str`.
- Для коллекций в everyday-коде почти всегда доминируют `list`, `dict`, `set`.
- Для бинарных данных полезно сразу различать `bytes` и `bytearray`: первый тип immutable, второй mutable.
- Для `tuple`, `int`, `float`, `bool` методов меньше, и это нормально: там большая часть работы делается не методом объекта, а операторами и built-in функциями.

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Built-in Types', href: 'https://docs.python.org/3/library/stdtypes.html' },
        { title: 'Python Tutorial: Data Structures', href: 'https://docs.python.org/3/tutorial/datastructures.html' },
        { title: 'Text Sequence Type str', href: 'https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str' },
        { title: 'Binary Sequence Types', href: 'https://docs.python.org/3/library/stdtypes.html#binary-sequence-types-bytes-bytearray-memoryview' },
        { title: 'Numeric Types', href: 'https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Операции со строками', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami' },
        { title: 'Типы главная', href: '/python/yazyk-python/tipy-dannykh/tipy-glavnaya' },
        { title: 'Изменяемые типы', href: '/python/yazyk-python/tipy-dannykh/izmenyaemye-tipy' },
        { title: 'Неизменяемые типы', href: '/python/yazyk-python/tipy-dannykh/neizmenyaemye-tipy' },
        { title: 'Логические и побитовые операторы: and, or, &, |', href: '/python/yazyk-python/1-core/logicheskie-i-pobitovye-operatory' },
    ]"
/>
