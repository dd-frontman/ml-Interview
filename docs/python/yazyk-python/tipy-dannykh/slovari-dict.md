---
title: "Словари dict"
description: "Конспект по словарям dict в Python: создание, запись и чтение по ключу, get, items, keys, values, сравнение, update, оператор | и задача со списком словарей."
tags:
  - "python"
  - "core"
  - "data-types"
  - "dict"
updatedAt: "2026-07-14"
---
## Что такое `dict`

`dict` - это словарь: изменяемая коллекция пар `ключ: значение`.

```python
person = {
    "name": "John",
    "age": 30,
    "city": "New York",
}

print(person)
# {"name": "John", "age": 30, "city": "New York"}
```

Словарь удобен, когда нужно хранить структурированные данные.

Например:

- данные пользователя;
- настройки;
- JSON-подобные объекты;
- строки таблицы;
- результаты вычислений по именованным полям.

## Ключи и значения

В словаре слева пишется ключ, справа - значение.

```python
person = {
    "name": "John",
    "age": 30,
    "city": "New York",
}
```

В этом примере:

- `"name"`, `"age"`, `"city"` - ключи;
- `"John"`, `30`, `"New York"` - значения.

Ключ обычно строка, но ключом может быть любой хешируемый объект: `str`, `int`, `tuple` без изменяемых элементов.

## Добавление значения

Новую пару можно добавить через квадратные скобки.

```python
person = {
    "name": "John",
    "age": 30,
    "city": "New York",
}

person["job"] = "Engineer"

print(person)
# {"name": "John", "age": 30, "city": "New York", "job": "Engineer"}
```

Если ключа не было, он добавится.

## Изменение значения

Если ключ уже есть, присваивание заменит старое значение.

```python
person = {
    "name": "John",
    "age": 30,
    "city": "New York",
}

person["age"] = 40

print(person)
# {"name": "John", "age": 40, "city": "New York"}
```

Словарь изменяемый, поэтому исходный объект меняется на месте.

## Создание пустого словаря

Пустой словарь можно создать через `{}`.

```python
person = {}

person["name"] = "John"
person["age"] = 30
person["city"] = "New York"

print(person)
# {"name": "John", "age": 30, "city": "New York"}
```

Можно также использовать `dict()`.

```python
person = dict()
```

На практике `{}` встречается чаще.

## Чтение по ключу

Значение можно получить по ключу.

```python
person = {
    "name": "John",
    "age": 30,
    "city": "New York",
}

print(person["name"])  # John
```

Если ключа нет, обращение через `[]` вызовет `KeyError`.

```python
print(person["country"])  # KeyError
```

## `.get()`

Метод `.get()` безопасно получает значение по ключу.

```python
person = {
    "name": "John",
    "age": 30,
    "city": "New York",
}

print(person.get("name"))     # John
print(person.get("country"))  # None
```

Если ключа нет, `.get()` вернет `None`.

Можно передать значение по умолчанию.

```python
print(person.get("country", "USA"))  # USA
print(person.get("name", "Jack"))    # John
```

Если ключ есть, вернется реальное значение. Значение по умолчанию используется только для отсутствующего ключа.

## `[]` или `.get()`

Используй `[]`, когда ключ точно должен быть в словаре.

```python
name = person["name"]
```

Используй `.get()`, когда отсутствие ключа - нормальная ситуация.

```python
country = person.get("country", "Unknown")
```

Так код явно показывает ожидание: ключ обязательный или необязательный.

## Перебор `.items()`

`.items()` возвращает пары ключ-значение.

```python
person = {
    "name": "John",
    "age": 30,
    "city": "New York",
}

for item in person.items():
    print(item)
    print(type(item))
```

При переборе каждый `item` - это кортеж из двух элементов.

```text
("name", "John")
<class 'tuple'>
```

Чаще пары сразу распаковывают.

```python
for key, value in person.items():
    print(key)
    print(value)
```

Так код читается лучше: отдельно видно ключ и значение.

## `.keys()` и `.values()`

`.keys()` позволяет пройти по ключам.

```python
for key in person.keys():
    print(key)
```

`.values()` позволяет пройти по значениям.

```python
for value in person.values():
    print(value)
```

В простом цикле по словарю Python и так перебирает ключи.

```python
for key in person:
    print(key)
```

Поэтому `person.keys()` часто можно не писать явно.

## Сравнение словарей

Словари сравниваются по ключам и значениям. Порядок записи ключей не влияет на равенство.

```python
person = {
    "name": "John",
    "age": 30,
    "city": "New York",
}

other_person = {
    "city": "New York",
    "age": 30,
    "name": "John",
}

print(person == other_person)  # True
```

Оба словаря равны, потому что в них одинаковые пары `ключ: значение`.

## Объединение через `update()`

Метод `update()` добавляет пары из одного словаря в другой.

```python
person = {
    "city": "New York",
    "age": 30,
    "name": "John",
}

additional_person_info = {
    "job": "Engineer",
    "married": True,
    "city": "London",
}

person.update(additional_person_info)

print(person)
# {"city": "London", "age": 30, "name": "John", "job": "Engineer", "married": True}
```

Если ключ уже был, значение перезаписывается.

В примере ключ `"city"` был в обоих словарях. После `update()` осталось значение `"London"`.

Важно: `update()` меняет исходный словарь.

## Объединение через `|`

Оператор `|` создает новый словарь из двух словарей.

```python
person = {
    "city": "New York",
    "age": 30,
    "name": "John",
}

additional_person_info = {
    "job": "Engineer",
    "married": True,
    "city": "London",
}

person = person | additional_person_info

print(person)
# {"city": "London", "age": 30, "name": "John", "job": "Engineer", "married": True}
```

Если ключи совпадают, побеждает значение из правого словаря.

```python
result = left | right
```

Значения из `right` перезапишут значения из `left` для одинаковых ключей.

## `update()` или `|`

`update()` меняет существующий словарь.

```python
person.update(additional_person_info)
```

`|` возвращает новый словарь.

```python
person = person | additional_person_info
```

Практическое правило:

- если нужно изменить текущий словарь - `update()`;
- если нужно получить новый объединенный словарь - `|`.

## Задача: лучшие студенты

Есть список словарей со студентами. У каждого студента есть имя, фамилия и список оценок.

```python
students = [
    {"name": "John", "surname": "Doe", "grades": [5, 5, 4, 4]},
    {"name": "Jane", "surname": "Doe", "grades": [4, 3, 4, 3, 5]},
    {"name": "Bill", "surname": "Gates", "grades": [5, 5, 5, 3]},
    {"name": "Steve", "surname": "Jobs", "grades": [3, 5, 4, 3, 3, 5]},
    {"name": "Guido", "surname": "Van Rossum", "grades": [5, 3, 5, 4, 5, 5, 3, 5]},
    {"name": "Elon", "surname": "Musk", "grades": None},
]
```

Нужно написать функцию, которая возвращает список студентов с максимальным средним баллом.

Если `grades` равно `None`, средний балл считаем равным `0`.

## Решение задачи

```python
def get_best_students(*, students: list[dict]) -> list[dict]:
    best_students = []
    best_average_grade = 0

    for student in students:
        grades = student["grades"]

        if grades is None:
            average_grade = 0
        else:
            average_grade = sum(grades) / len(grades)

        if average_grade > best_average_grade:
            best_average_grade = average_grade
            best_students = [student]
        elif average_grade == best_average_grade:
            best_students.append(student)

    return best_students
```

Что здесь происходит:

- `best_students` хранит студентов с лучшим средним баллом;
- `best_average_grade` хранит текущий лучший средний балл;
- цикл проходит по каждому словарю студента;
- `student["grades"]` получает список оценок;
- если оценок нет, средний балл равен `0`;
- если найден лучший средний балл, список лучших студентов заменяется;
- если найден такой же средний балл, студент добавляется к лучшим.

## Почему результат - список

Лучших студентов может быть несколько.

Например, если два студента имеют одинаковый максимальный средний балл, функция должна вернуть обоих.

```python
best_students = get_best_students(students=students)

print(best_students)
```

Поэтому результат имеет тип `list[dict]`, а не один `dict`.

## Частые ошибки

1. Использовать `person["country"]`, когда ключ может отсутствовать.
   Проблема: будет `KeyError`.
   Решение: использовать `person.get("country")` или `person.get("country", default)`.

2. Думать, что `.get()` всегда возвращает значение по умолчанию.
   Проблема: default используется только если ключа нет.
   Решение: если ключ есть, вернется значение из словаря.

3. Забывать, что `update()` меняет исходный словарь.
   Проблема: старое значение словаря теряется.
   Решение: если нужен новый словарь, использовать `person | other`.

4. Ожидать, что порядок ключей влияет на сравнение.
   Проблема: словари с одинаковыми парами равны, даже если ключи записаны в разном порядке.
   Решение: сравнение идет по содержимому, а не по порядку.

5. Не обработать `None` в поле `grades`.
   Проблема: `sum(None)` вызовет ошибку.
   Решение: проверять `if grades is None`.

6. Делить на длину пустого списка.
   Проблема: `sum(grades) / len(grades)` упадет с `ZeroDivisionError`, если список пустой.
   Решение: отдельно обработать `None` и пустой список, если он возможен.

## Cheat-sheet

| Синтаксис | Что делает |
| --- | --- |
| `{}` | Пустой словарь |
| `{"name": "John"}` | Словарь с одной парой |
| `person["name"]` | Получить значение по ключу |
| `person["job"] = "Engineer"` | Добавить или изменить значение |
| `person.get("country")` | Безопасно получить значение или `None` |
| `person.get("country", "USA")` | Получить значение или default |
| `person.items()` | Пары ключ-значение |
| `person.keys()` | Ключи |
| `person.values()` | Значения |
| `person.update(other)` | Изменить словарь данными из `other` |
| `person \| other` | Создать объединенный словарь |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Dictionaries', href: 'https://docs.python.org/3/tutorial/datastructures.html#dictionaries' },
        { title: 'Python Built-in Types: Mapping Types dict', href: 'https://docs.python.org/3/library/stdtypes.html#mapping-types-dict' },
        { title: 'Python Tutorial: Data Structures', href: 'https://docs.python.org/3/tutorial/datastructures.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Изменяемые типы', href: '/python/yazyk-python/tipy-dannykh/izmenyaemye-tipy' },
        { title: 'Методы типов данных', href: '/python/yazyk-python/tipy-dannykh/metody-tipov-dannykh' },
        { title: 'Списки: базовые операции', href: '/python/yazyk-python/tipy-dannykh/spiski-bazovye-operatsii' },
        { title: 'Кортежи tuple', href: '/python/yazyk-python/tipy-dannykh/kortezhi-tuple' },
    ]"
/>
