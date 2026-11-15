---
title: "Методы строк в Python"
description: "Основные методы str: lower, upper, strip, replace, count, isdigit, split, join, startswith, endswith, find и index."
tags:
  - "python"
  - "core"
  - "data-types"
  - "str"
  - "methods"
updatedAt: "2026-11-14"
---
## Что такое метод строки {#chto-takoe-metod-stroki}

Метод - это функция, связанная с объектом. Метод строки вызывают через точку:

```python
text = "Python"
lower_text = text.lower()

print(lower_text)  # python
```

Строки неизменяемы, поэтому метод не изменяет исходное значение, а возвращает новый объект или результат проверки.

```python
text = "  Python,ML,SQL  "

clean = text.strip()
lower = clean.lower()
parts = lower.split(",")

print(text)   #   Python,ML,SQL
print(clean)  # Python,ML,SQL
print(lower)  # python,ml,sql
print(parts)  # ['python', 'ml', 'sql']
```

## Таблица основных методов {#tablitsa-osnovnykh-metodov}

| Метод | Что делает |
| --- | --- |
| `strip()` | убирает пробельные символы по краям |
| `lower()` | переводит строку в нижний регистр |
| `upper()` | переводит строку в верхний регистр |
| `replace(old, new)` | заменяет подстроку |
| `count(substring)` | считает количество вхождений |
| `isdigit()` | проверяет, состоит ли строка из цифр |
| `split(separator)` | разбивает строку на список |
| `separator.join(items)` | склеивает строки из коллекции |
| `startswith(prefix)` | проверяет начало строки |
| `endswith(suffix)` | проверяет конец строки |
| `find(substring)` | возвращает индекс подстроки или `-1` |
| `index(substring)` | возвращает индекс подстроки или вызывает ошибку |

## `upper()` и `lower()` {#upper-i-lower}

`upper()` возвращает строку в верхнем регистре, а `lower()` - в нижнем:

```python
text = "Python"

print(text.upper())  # PYTHON
print(text.lower())  # python
```

Методы часто используют для нормализации перед сравнением:

```python
role = "Admin"

if role.lower() == "admin":
    print("access granted")  # access granted
```

Исходная строка не меняется:

```python
text = "Python"
lower_text = text.lower()

print(text)        # Python
print(lower_text)  # python
```

## `strip()`, `lstrip()` и `rstrip()` {#strip-lstrip-i-rstrip}

`strip()` убирает пробелы, табы и переносы строк по краям:

```python
name = "  Alice\n"

print(name.strip())  # Alice
```

Середину строки `strip()` не изменяет:

```python
text = "  ml engineer  "

print(text.strip())  # ml engineer
```

`lstrip()` обрабатывает левый край, а `rstrip()` - правый:

```python
text = "  Python  "

print(repr(text.lstrip()))  # 'Python  '
print(repr(text.rstrip()))  # '  Python'
```

В `strip(chars)` передаётся набор удаляемых символов, а не точная подстрока:

```python
text = "...Python..."

print(text.strip("."))  # Python
```

## `replace()` {#replace}

`replace(old, new)` заменяет одну подстроку на другую:

```python
text = "python,ml,sql"

print(text.replace("sql", "pandas"))  # python,ml,pandas
```

Третий аргумент ограничивает количество замен:

```python
text = "one one one"

print(text.replace("one", "two", 1))  # two one one
```

Если искомой подстроки нет, метод вернёт строку с тем же содержимым:

```python
text = "python"

print(text.replace("java", "go"))  # python
```

## `split()` {#split}

`split()` разбивает строку и возвращает список строк:

```python
text = "python,ml,sql"
parts = text.split(",")

print(parts)  # ['python', 'ml', 'sql']
```

Если разделитель не указан, строка разбивается по пробельным символам. Несколько пробелов подряд не создают пустые элементы:

```python
text = "Python   for ML"

print(text.split())  # ['Python', 'for', 'ML']
```

## `join()` {#join}

`join()` выполняет обратную задачу: склеивает строки из коллекции через выбранный разделитель.

```python
words = ["Python", "for", "ML"]
text = " ".join(words)

print(text)  # Python for ML
```

Разделителем является строка перед точкой:

```python
technologies = ["python", "ml", "sql"]

print(" / ".join(technologies))  # python / ml / sql
```

Все элементы должны быть строками. Список чисел сначала нужно преобразовать:

```python
numbers = [1, 2, 3]
text_numbers = [str(number) for number in numbers]

print(", ".join(text_numbers))  # 1, 2, 3
```

## `startswith()` и `endswith()` {#startswith-i-endswith}

Эти методы возвращают `True` или `False`:

```python
filename = "report.csv"

print(filename.startswith("report"))  # True
print(filename.endswith(".csv"))      # True
```

Они читаются понятнее, чем ручное сравнение срезов.

## `isdigit()` {#isdigit}

`isdigit()` проверяет, состоит ли непустая строка только из цифр:

```python
print("123".isdigit())  # True
print("12a".isdigit())  # False
print("".isdigit())     # False
```

Метод не подходит для отрицательных и дробных чисел:

```python
print("-123".isdigit())  # False
print("3.14".isdigit())  # False
```

Для простого ввода положительного целого числа это удобно:

```python
age_raw = "20"

if age_raw.isdigit():
    age = int(age_raw)
    print(age + 1)  # 21
```

Если нужно принимать отрицательные числа, дроби или сложные форматы, используй `try/except` с `int()` или `float()`.

## Цепочка методов {#tsepochka-metodov}

Если каждый метод возвращает строку, вызовы можно объединить:

```python
raw_value = "  PYTHON,ML  "
values = raw_value.strip().lower().split(",")

print(values)  # ['python', 'ml']
```

Выполнение идёт слева направо:

1. `strip()` возвращает `"PYTHON,ML"`;
2. `lower()` возвращает `"python,ml"`;
3. `split(",")` возвращает список `['python', 'ml']`.

## Типичные ошибки {#tipichnye-oshibki}

1. Не сохранять значение, возвращённое методом.
2. Путать направление `split()` и `join()`.
3. Передавать числа напрямую в `join()`.
4. Ожидать, что `strip(".csv")` удалит точный суффикс `.csv`: аргумент рассматривается как набор символов.
5. Использовать `isdigit()` для отрицательных или дробных чисел.

## Задачи для практики {#zadachi-dlya-praktiki}

1. Преобразуй строку `"  Alice,BOB,Charlie  "` в список имён в нижнем регистре.
2. Замени только первое слово `"cat"` на `"dog"` в строке `"cat cat cat"`.
3. Собери список `['2026', '11', '14']` в строку даты `"2026-11-14"`.

<RelatedTopics
    :items="[
        { title: 'Индексы, срезы и поиск', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/indeksy-srezy-i-poisk' },
        { title: 'Форматирование и экранирование', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/formatirovanie-i-ekranirovanie' },
        { title: 'Практика и ошибки', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/praktika-i-oshibki' },
    ]"
/>
