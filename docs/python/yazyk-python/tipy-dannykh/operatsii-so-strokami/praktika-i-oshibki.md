---
title: "Практика и ошибки при работе со строками"
description: "Практический пример обработки строки, типичные ошибки, задачи для самостоятельной работы и итоговая шпаргалка по str."
tags:
  - "python"
  - "core"
  - "data-types"
  - "str"
  - "practice"
updatedAt: "2026-11-14"
---
## Практический пример: нормализация email {#prakticheskiy-primer-normalizatsiya-email}

Перед сохранением email нужно убрать пробелы, привести символы к нижнему регистру и проверить наличие `@`.

```python
def normalize_email(email: str) -> str:
    clean = email.strip().lower()

    if "@" not in clean:
        raise ValueError("Invalid email")

    return clean


print(normalize_email("  ALICE@EXAMPLE.COM  "))  # alice@example.com
```

Разбор по шагам:

1. `strip()` создаёт строку без пробелов по краям;
2. `lower()` приводит символы к нижнему регистру;
3. `not in` проверяет отсутствие обязательного символа;
4. `raise` останавливает функцию для некорректного значения;
5. `return` возвращает нормализованную строку.

Эта проверка подходит только для учебного примера. Полная проверка адреса электронной почты сложнее, а окончательно подтвердить адрес можно только отправкой письма с кодом или ссылкой.

## Ошибка 1. Сложение строки и числа {#oshibka-1-slozhenie-stroki-i-chisla}

Строку нельзя сложить с числом напрямую:

```python
age = 20

# print("age: " + age)
# TypeError: can only concatenate str (not "int") to str
```

Преобразуй число или используй f-строку:

```python
age = 20

print("age: " + str(age))  # age: 20
print(f"age: {age}")       # age: 20
```

## Ошибка 2. Не сохранять результат метода {#oshibka-2-ne-sokhranyat-rezultat-metoda}

Методы строк не изменяют исходную строку:

```python
text = "  Python  "
text.strip()

print(repr(text))  # '  Python  '
```

Результат нужно присвоить имени:

```python
text = "  Python  "
text = text.strip()

print(repr(text))  # 'Python'
```

## Ошибка 3. Путать `split()` и `join()` {#oshibka-3-putat-split-i-join}

`split()` выполняется у строки и возвращает список:

```python
text = "python,ml,sql"

print(text.split(","))  # ['python', 'ml', 'sql']
```

`join()` выполняется у строки-разделителя и принимает коллекцию строк:

```python
items = ["python", "ml", "sql"]

print(",".join(items))  # python,ml,sql
```

## Ошибка 4. Неправильно проверять результат `find()` {#oshibka-4-nepravilno-proveryat-rezultat-find}

`find()` возвращает `0`, если совпадение находится в начале строки. В условии число `0` считается ложным:

```python
text = "python for ml"

print(text.find("python"))  # 0
```

Для проверки наличия используй `in`:

```python
text = "python for ml"

print("python" in text)  # True
```

## Ошибка 5. Выйти за границы строки {#oshibka-5-vyyti-za-granitsy-stroki}

Обычный индекс должен существовать:

```python
word = "cat"

# print(word[5])
# IndexError: string index out of range
```

Перед обращением к позиции можно проверить длину:

```python
word = "cat"
index = 5

if index < len(word):
    print(word[index])
else:
    print("index is out of range")  # index is out of range
```

## Ошибка 6. Путать `%` в разных выражениях {#oshibka-6-putat-v-raznykh-vyrazheniyakh}

С числами `%` вычисляет остаток, а со строкой слева запускает старое форматирование:

```python
print(7 % 2)             # 1
print("age=%d" % 20)    # age=20
```

Смотри на тип левого операнда: число или строка.

## Ошибка 7. Смешивать поля `format()` {#oshibka-7-smeshivat-polya-format}

Автоматические `{}` и пронумерованные `{0}` поля нельзя смешивать:

```python
# print("{} {0}".format(1))
# ValueError: cannot switch from automatic field numbering to manual field specification
```

Используй один стиль во всём шаблоне:

```python
print("{} {}".format(1, 2))     # 1 2
print("{0} {1}".format(1, 2))  # 1 2
```

## Самостоятельная практика {#samostoyatelnaya-praktika}

### Задача 1. Нормализация имени {#zadacha-1-normalizatsiya-imeni}

Дана строка `"  aLiCe  "`. Убери пробелы и получи результат `"Alice"`.

Подсказка: посмотри методы `strip()`, `lower()`, `upper()` и срезы.

### Задача 2. Имя файла {#zadacha-2-imya-fayla}

Проверь, что строка заканчивается на `.csv`, а её основная часть не пустая.

Примеры:

```text
"report.csv" -> True
".csv" -> False
"report.txt" -> False
```

### Задача 3. Подсчёт смайликов {#zadacha-3-podschyot-smaylikov}

Отдельная [задача про смайлики](./zadacha-podschet-smaylikov.md) объединяет длину строки, индексы, условия и оператор `in`.

## Итоговая шпаргалка {#itogovaya-shpargalka}

| Задача | Синтаксис |
| --- | --- |
| Создать строку | `text = "hello"` |
| Склеить строки | `a + b` |
| Повторить строку | `text * 3` |
| Получить длину | `len(text)` |
| Получить первый символ | `text[0]` |
| Получить последний символ | `text[-1]` |
| Получить срез | `text[start:stop]` |
| Развернуть строку | `text[::-1]` |
| Проверить подстроку | `substring in text` |
| Найти позицию | `text.find(substring)` |
| Посчитать вхождения | `text.count(substring)` |
| Убрать пробелы по краям | `text.strip()` |
| Изменить регистр | `text.lower()`, `text.upper()` |
| Заменить подстроку | `text.replace(old, new)` |
| Разбить строку | `text.split(separator)` |
| Склеить строки | `separator.join(items)` |
| Проверить цифры | `text.isdigit()` |
| Подставить значения | `f"{name}: {score}"` |

## Что повторить перед собеседованием {#chto-povtorit-pered-sobesedovaniem}

- почему строки неизменяемы;
- сложность создания новых строк при многократной конкатенации;
- разницу между индексом и срезом;
- разницу между `find()` и `index()`;
- направление работы `split()` и `join()`;
- способы форматирования строк.

<RelatedTopics
    :items="[
        { title: 'Создание и базовые операции', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/sozdanie-i-bazovye-operatsii' },
        { title: 'Индексы, срезы и поиск', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/indeksy-srezy-i-poisk' },
        { title: 'Методы строк', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/metody-strok' },
        { title: 'Форматирование и экранирование', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/formatirovanie-i-ekranirovanie' },
    ]"
/>
