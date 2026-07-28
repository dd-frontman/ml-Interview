---
title: "JSON и сериализация в Python"
description: "Конспект по JSON в Python: отличие JSON от dict, сериализация через dumps, десериализация через loads, соответствие типов и частые ошибки."
tags:
  - "python"
  - "json"
  - "serialization"
  - "data"
updatedAt: "2026-07-19"
---
## Что такое JSON

JSON (JavaScript Object Notation) - текстовый формат для хранения и передачи структурированных данных.

Его часто используют:

- в ответах и запросах API;
- в конфигурационных файлах;
- для обмена данными между программами;
- при сохранении простых структур в файл.

JSON не является отдельным типом Python. После сериализации мы получаем строку `str`, а после десериализации - обычные объекты Python: словари, списки, строки и числа.

## JSON и словарь Python

Словарь Python и JSON-объект выглядят похоже, но это разные вещи.

```python
book = {
    "title": "1984",
    "author": "George Orwell",
}

print(type(book))  # <class 'dict'>
```

Здесь `book` - объект Python типа `dict`. Он уже находится в памяти программы и с ним можно работать через методы словаря.

JSON представляет те же данные текстом:

```json
{
  "title": "1984",
  "author": "George Orwell"
}
```

В JSON имена полей и строки должны быть записаны в двойных кавычках. Одинарные кавычки, допустимые в Python, не соответствуют стандарту JSON.

## Подключение модуля `json`

Для преобразования данных используется модуль `json` из стандартной библиотеки Python.

```python
import json
```

Устанавливать его через `pip` не нужно.

## Сериализация через `json.dumps()`

Сериализация - преобразование объекта Python в формат, который можно сохранить или передать.

`json.dumps()` принимает объект Python и возвращает JSON-строку.

```python
import json

book = {
    "title": "1984",
    "author": "George Orwell",
    "isbn": "978-0451524935",
}

json_string = json.dumps(book)

print(type(book))         # <class 'dict'>
print(type(json_string))  # <class 'str'>
print(json_string)
```

Результат:

```text
{"title": "1984", "author": "George Orwell", "isbn": "978-0451524935"}
```

Важно: `json.dumps()` не изменяет исходный словарь. Он создает и возвращает новую строку.

Название `dumps` можно запомнить как dump string - сериализация в строку.

## Десериализация через `json.loads()`

Десериализация - обратное преобразование: из JSON-строки в объекты Python.

```python
import json

json_string = '{"title": "1984", "author": "George Orwell"}'
book = json.loads(json_string)

print(type(json_string))  # <class 'str'>
print(type(book))         # <class 'dict'>
print(book["title"])     # 1984
```

После `json.loads()` результат является обычным словарем. К его значениям можно обращаться по ключам.

Название `loads` можно запомнить как load string - чтение JSON из строки.

## Соответствие типов

При преобразовании модуль `json` сопоставляет типы JSON и Python.

| JSON | Python | Пример |
| --- | --- | --- |
| object | `dict` | `{"name": "Alex"}` |
| array | `list` | `[1, 2, 3]` |
| string | `str` | `"Python"` |
| number без дробной части | `int` | `30` |
| number с дробной частью | `float` | `3.14` |
| true | `True` | `true` |
| false | `False` | `false` |
| null | `None` | `null` |

Пример с разными типами:

```python
import json

book = {
    "title": "1984",
    "count": 30,
    "rating": 4.8,
    "genres": ["dystopia", "fiction"],
    "available": True,
    "discount": None,
}

json_string = json.dumps(book)
print(json_string)
```

Результат содержит JSON-значения `true` и `null`, а не Python-значения `True` и `None`.

```json
{
  "title": "1984",
  "count": 30,
  "rating": 4.8,
  "genres": ["dystopia", "fiction"],
  "available": true,
  "discount": null
}
```

## Форматирование JSON

По умолчанию `json.dumps()` создает компактную строку. Для чтения человеком можно добавить отступы.

```python
json_string = json.dumps(book, indent=2)
print(json_string)
```

Для сохранения кириллицы используют `ensure_ascii=False`.

```python
person = {
    "name": "Алексей",
    "city": "Москва",
}

json_string = json.dumps(person, ensure_ascii=False, indent=2)
print(json_string)
```

Без `ensure_ascii=False` кириллические символы могут быть представлены escape-последовательностями вида `\u0410`.

## `dump` и `load` для файлов

Методы без буквы `s` работают с файловыми объектами.

```python
import json

book = {
    "title": "1984",
    "author": "George Orwell",
}

with open("book.json", "w", encoding="utf-8") as file:
    json.dump(book, file, ensure_ascii=False, indent=2)
```

Чтение из файла:

```python
with open("book.json", "r", encoding="utf-8") as file:
    loaded_book = json.load(file)

print(loaded_book)
```

Разница функций:

| Функция | Что принимает | Что делает |
| --- | --- | --- |
| `json.dumps()` | объект Python | возвращает JSON-строку |
| `json.loads()` | JSON-строку | возвращает объект Python |
| `json.dump()` | объект Python и файл | записывает JSON в файл |
| `json.load()` | файл | читает JSON из файла |

## Какие объекты нельзя сериализовать напрямую

Модуль `json` умеет работать не со всеми объектами Python.

Например, множество `set` нельзя напрямую преобразовать в JSON:

```python
import json

numbers = {1, 2, 3}
json.dumps(numbers)  # TypeError: Object of type set is not JSON serializable
```

Сначала объект нужно привести к поддерживаемому типу.

```python
json_string = json.dumps(list(numbers))
```

То же относится к `datetime`, пользовательским классам и другим специальным объектам. Нужно заранее определить, как представить их стандартными типами JSON.

## Частые ошибки

### Передать словарь в `json.loads()`

`loads()` ожидает строку, байты или массив байтов, а не готовый словарь.

```python
data = {"name": "Alex"}

json.loads(data)  # TypeError
```

Если данные уже находятся в словаре, десериализация не нужна.

### Использовать одинарные кавычки в JSON

```python
json_string = "{'name': 'Alex'}"
json.loads(json_string)  # json.JSONDecodeError
```

Корректный JSON:

```python
json_string = '{"name": "Alex"}'
```

### Перепутать `dump` и `dumps`

`dump()` записывает в файл и требует файловый объект. `dumps()` возвращает строку.

### Сериализовать JSON повторно

```python
data = {"name": "Alex"}

json_string = json.dumps(data)
double_json = json.dumps(json_string)

print(double_json)  # "{\"name\": \"Alex\"}"
```

Повторная сериализация превращает уже готовую JSON-строку в строковое значение внутри другого JSON.

## Практическая задача

Дан словарь с информацией о книге:

```python
book = {
    "title": "Мастер и Маргарита",
    "author": "Михаил Булгаков",
    "year": 1967,
    "genres": ["роман", "фантастика"],
    "available": True,
}
```

Нужно:

1. Преобразовать словарь в JSON-строку с отступом в два пробела.
2. Сохранить кириллицу без `\u`-последовательностей.
3. Напечатать тип полученной строки.
4. Преобразовать строку обратно в словарь.
5. Вывести название книги и первый жанр.

Решение:

```python
import json

json_string = json.dumps(book, ensure_ascii=False, indent=2)
print(type(json_string))

loaded_book = json.loads(json_string)
print(loaded_book["title"])
print(loaded_book["genres"][0])
```

## Краткая шпаргалка

```python
import json

# Python -> JSON-строка
json_string = json.dumps(data, ensure_ascii=False, indent=2)

# JSON-строка -> Python
data = json.loads(json_string)

# Python -> JSON-файл
with open("data.json", "w", encoding="utf-8") as file:
    json.dump(data, file, ensure_ascii=False, indent=2)

# JSON-файл -> Python
with open("data.json", "r", encoding="utf-8") as file:
    data = json.load(file)
```

Главная последовательность:

```text
объект Python -> json.dumps() -> строка JSON
строка JSON -> json.loads() -> объект Python
```

## Официальная документация

<OfficialDocsLinks
    :links="[
        { title: 'Модуль json в Python', href: 'https://docs.python.org/3/library/json.html' },
        { title: 'Описание формата JSON', href: 'https://www.json.org/json-en.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Словари dict', href: '/python/yazyk-python/tipy-dannykh/slovari-dict' },
        { title: 'Загрузка данных и форматы', href: '/python/ekosistema-python/zagruzka-dannykh-i-formaty' },
        { title: 'Исключения и файлы', href: '/python/yazyk-python/isklyucheniya-context-managers-i-fayly' },
    ]"
/>
