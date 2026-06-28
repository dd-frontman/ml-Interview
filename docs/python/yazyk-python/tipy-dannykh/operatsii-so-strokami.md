---
title: "Операции со строками"
description: "Основные операции со строками в Python: создание, конкатенация, индексы, срезы, поиск подстроки, методы, f-строки, format, %-форматирование и типичные ошибки."
tags:
  - "python"
  - "core"
  - "data-types"
  - "str"
updatedAt: "2026-06-25"
search: false
---
## Что такое строка

`str` - это тип данных для текста.

```python
name = "Alice"
message = 'hello'

print(type(name))  # <class 'str'>
```

В коде `str` встречается в двух ролях:

- `str` как тип: строка, текстовое значение;
- `str()` как функция: преобразование значения в строку.

```python
name: str = "Alice"
age_text = str(20)

print(name)
print(age_text)
```

В аннотации `name: str` ничего не вызывается: это подсказка типа. В выражении `str(20)` функция реально выполняется и возвращает строку `"20"`.

Одинарные и двойные кавычки работают одинаково. Главное - закрыть строку такой же кавычкой, какой она была открыта.

```python
title = "Python"
same_title = 'Python'
```

Если внутри текста нужна кавычка, удобно выбрать другой внешний тип кавычек.

```python
text = "I'm learning Python"
quote = 'He said "hello"'
```

## Многострочные строки

Для многострочного текста используют тройные кавычки.

```python
text = """first line
second line
third line"""

print(text)
```

Такая строка сохраняет переносы строк.

## Конкатенация: `+`

`+` склеивает строки.

```python
first_name = "Alice"
last_name = "Smith"

full_name = first_name + " " + last_name

print(full_name)  # Alice Smith
```

Важно: складывать можно только строки со строками.

```python
age = 20

print("age: " + str(age))  # age: 20
```

Если не привести число к строке, будет `TypeError`.

## Повторение: `*`

`*` повторяет строку несколько раз.

```python
line = "-" * 10

print(line)  # ----------
```

Это удобно для простых разделителей и учебных примеров.

```python
print("ha" * 3)  # hahaha
```

## Длина строки: `len()`

`len()` возвращает количество символов в строке.

```python
name = "Alice"

print(len(name))  # 5
```

Пробелы тоже считаются символами.

```python
text = "ml engineer"

print(len(text))  # 11
```

## Индексы

Строка - это последовательность символов. К символам можно обращаться по индексу.

```python
word = "python"

print(word[0])  # p
print(word[1])  # y
```

Индексация начинается с `0`.

Отрицательные индексы идут с конца строки.

```python
word = "python"

print(word[-1])  # n
print(word[-2])  # o
```

Если индекс выходит за границы строки, будет `IndexError`.

## Срезы

Срез возвращает часть строки.

```python
word = "python"

print(word[0:2])  # py
print(word[2:6])  # thon
```

Правая граница не включается.

```python
word = "python"

print(word[:2])   # py
print(word[2:])   # thon
print(word[:-1])  # pytho
```

Можно указать шаг.

```python
word = "python"

print(word[::2])   # pto
print(word[::-1])  # nohtyp
```

`[::-1]` часто используют как простой способ развернуть строку.

## Вхождение строки в строку

Вхождение строки в строку - это проверка, есть ли одна строка внутри другой.

Для простой проверки используй `in`. Он возвращает `True` или `False`.

```python
email = "alice@example.com"

print("@" in email)      # True
print("admin" in email)  # False
```

Для отрицательной проверки используют `not in`.

```python
email = "alice.example.com"

if "@" not in email:
    print("invalid email")
```

Проверка чувствительна к регистру.

```python
text = "Python"

print("Py" in text)  # True
print("py" in text)  # False
```

Если регистр не важен, сначала приведи обе строки к одному регистру.

```python
text = "Python"
query = "py"

print(query.lower() in text.lower())  # True
```

Если нужно узнать позицию подстроки, используй `find()`.

```python
text = "python,ml,sql"

print(text.find("ml"))      # 7
print(text.find("pandas"))  # -1
```

`find()` возвращает индекс первого вхождения или `-1`, если подстрока не найдена.

Есть похожий метод `index()`, но он выбрасывает ошибку, если подстроки нет.

```python
text = "python,ml,sql"

print(text.index("ml"))  # 7

# ValueError: substring not found
# print(text.index("pandas"))
```

Если нужно посчитать количество вхождений, используй `count()`.

```python
text = "python python sql"

print(text.count("python"))  # 2
```

Практическое правило:

- для проверки "есть или нет" используй `in`;
- для проверки "нет ли строки" используй `not in`;
- для позиции используй `find()`;
- для количества используй `count()`;
- `index()` используй только когда отсутствие подстроки действительно должно быть ошибкой.

## Основные методы строк

Методы строк возвращают новую строку или новое значение. Исходная строка не меняется, потому что `str` - неизменяемый тип.

```python
text = "  Python,ML,SQL  "

clean = text.strip()
lower = clean.lower()
parts = lower.split(",")

print(clean)  # Python,ML,SQL
print(lower)  # python,ml,sql
print(parts)  # ['python', 'ml', 'sql']
```

Частые методы:

| Метод | Что делает |
| --- | --- |
| `strip()` | Убирает пробелы и переносы по краям |
| `lower()` | Переводит строку в нижний регистр |
| `upper()` | Переводит строку в верхний регистр |
| `replace(old, new)` | Заменяет подстроку |
| `count(substring)` | Считает количество вхождений |
| `isdigit()` | Проверяет, состоит ли строка из цифр |
| `split(separator)` | Разбивает строку на список |
| `separator.join(items)` | Склеивает список строк |
| `startswith(prefix)` | Проверяет начало строки |
| `endswith(suffix)` | Проверяет конец строки |
| `find(substring)` | Возвращает индекс подстроки или `-1` |
| `index(substring)` | Возвращает индекс подстроки или ошибку |

```python
text = "python,ml,sql"
parts = text.split(",")

print(parts)  # ['python', 'ml', 'sql']
print(" / ".join(parts))  # python / ml / sql
print(text.replace("sql", "pandas"))  # python,ml,pandas
print(text.startswith("python"))  # True
print(text.endswith("sql"))  # True
print(text.find("ml"))  # 7
print(text.count("python"))  # 1
```

## `upper()` и `lower()`

`upper()` возвращает новую строку в верхнем регистре.

```python
text = "Python"

print(text.upper())  # PYTHON
```

`lower()` возвращает новую строку в нижнем регистре.

```python
text = "Python"

print(text.lower())  # python
```

Эти методы часто используют для нормализации перед сравнением.

```python
role = "Admin"

if role.lower() == "admin":
    print("access granted")
```

Исходная строка не меняется.

```python
text = "Python"
lower_text = text.lower()

print(text)        # Python
print(lower_text)  # python
```

## `strip()`

`strip()` убирает пробелы, табы и переносы строк по краям строки.

```python
name = "  Alice\n"

print(name.strip())  # Alice
```

Середину строки `strip()` не трогает.

```python
text = "  ml engineer  "

print(text.strip())  # ml engineer
```

Можно убрать только левый или правый край.

```python
text = "  Python  "

print(repr(text.lstrip()))  # 'Python  '
print(repr(text.rstrip()))  # '  Python'
```

В `strip(chars)` передается набор символов, а не точная подстрока.

```python
text = "...Python..."

print(text.strip("."))  # Python
```

## `replace()`

`replace(old, new)` заменяет одну подстроку на другую.

```python
text = "python,ml,sql"

print(text.replace("sql", "pandas"))  # python,ml,pandas
```

Можно ограничить количество замен третьим аргументом.

```python
text = "one one one"

print(text.replace("one", "two", 1))  # two one one
```

Если подстроки нет, вернется строка с тем же содержимым.

```python
text = "python"

print(text.replace("java", "go"))  # python
```

## `count()`

`count(substring)` считает, сколько раз подстрока встречается в строке.

```python
text = "python python sql"

print(text.count("python"))  # 2
```

`count()` чувствителен к регистру.

```python
text = "Python python"

print(text.count("python"))  # 1
```

Если нужно считать без учета регистра, сначала приведи строку к одному регистру.

```python
text = "Python python"

print(text.lower().count("python"))  # 2
```

Важная деталь: `count()` считает непересекающиеся вхождения.

```python
text = "aaaa"

print(text.count("aa"))  # 2
```

## `isdigit()`

`isdigit()` проверяет, состоит ли строка только из цифр.

```python
print("123".isdigit())  # True
print("12a".isdigit())  # False
```

Пустая строка не считается числом.

```python
print("".isdigit())  # False
```

`isdigit()` не подходит для отрицательных чисел и дробей.

```python
print("-123".isdigit())  # False
print("3.14".isdigit())  # False
```

Для простого пользовательского ввода целого положительного числа это удобно.

```python
age_raw = "20"

if age_raw.isdigit():
    age = int(age_raw)
    print(age + 1)
```

Если нужно принимать отрицательные числа, дроби или сложные форматы, лучше использовать `try/except` с `int()` или `float()`.

## Форматирование строк

Самый частый способ подставлять значения в строку - f-string.

```python
name = "Alice"
score = 0.91

message = f"{name}: {score}"

print(message)  # Alice: 0.91
```

Внутри `{}` можно писать выражения.

```python
price = 100
discount = 0.2

print(f"final price: {price * (1 - discount)}")  # final price: 80.0
```

Можно управлять количеством знаков после запятой.

```python
score = 0.91234

print(f"score: {score:.2f}")  # score: 0.91
```

## Метод строк `format()`

`format()` - это метод строки, который подставляет значения в `{}`.

```python
name = "Alice"
score = 0.91

message = "{}: {}".format(name, score)

print(message)  # Alice: 0.91
```

Значения подставляются по порядку.

```python
template = "{} learns {}"

print(template.format("Alice", "Python"))  # Alice learns Python
```

Можно указывать номера позиций.

```python
template = "{1} after {0}"

print(template.format("first", "second"))  # second after first
```

Можно использовать имена.

```python
template = "{name}: {score}"

print(template.format(name="Alice", score=0.91))  # Alice: 0.91
```

Форматирование чисел работает похоже на f-строки.

```python
score = 0.91234

print("score: {:.2f}".format(score))  # score: 0.91
```

Если в строке нужны обычные фигурные скобки, их нужно удвоить.

```python
print("{{value}} = {}".format(42))  # {value} = 42
```

Практическое правило: в новом коде чаще выбирают f-строки, потому что они короче и читаются проще. `format()` полезно знать для старого кода, шаблонов и случаев, когда строка-шаблон хранится отдельно от значений.

## Форматирование через `%`

`%` - старый способ форматирования строк. Он похож на `printf` из других языков.

```python
name = "Alice"
score = 0.91

message = "%s: %.2f" % (name, score)

print(message)  # Alice: 0.91
```

Частые плейсхолдеры:

| Плейсхолдер | Значение |
| --- | --- |
| `%s` | строковое представление значения |
| `%d` | целое число |
| `%f` | число с плавающей точкой |
| `%.2f` | `float` с двумя знаками после точки |

```python
name = "Alice"
age = 20
score = 0.91234

print("name=%s age=%d score=%.2f" % (name, age, score))
# name=Alice age=20 score=0.91
```

Если значение одно, скобки не обязательны.

```python
print("Hello, %s" % "Alice")  # Hello, Alice
```

Если значений несколько, справа нужен tuple.

```python
print("%s scored %.1f" % ("Alice", 0.9))  # Alice scored 0.9
```

Чтобы вывести сам символ `%`, нужно написать `%%`.

```python
progress = 80

print("progress: %d%%" % progress)  # progress: 80%
```

Практическое правило: `%`-форматирование нужно уметь читать, потому что оно встречается в старом коде и логировании. Для нового обычного кода чаще используй f-строки.

## Экранирование

Некоторые символы записываются через `\`.

| Запись | Значение |
| --- | --- |
| `\n` | перенос строки |
| `\t` | табуляция |
| `\"` | двойная кавычка внутри строки |
| `\'` | одинарная кавычка внутри строки |
| `\\` | сам символ обратного слеша |

```python
text = "first line\nsecond line"

print(text)
```

Для путей и регулярных выражений часто используют raw-string.

```python
path = r"C:\Users\Alice\data.csv"

print(path)
```

## Строки неизменяемые

Строку нельзя изменить "на месте".

```python
word = "python"

# TypeError: 'str' object does not support item assignment
# word[0] = "P"
```

Нужно создать новую строку.

```python
word = "python"
updated = "P" + word[1:]

print(updated)  # Python
```

Все методы вроде `strip()`, `lower()`, `replace()` тоже возвращают новое значение.

```python
text = " Python "
clean = text.strip()

print(text)   #  Python
print(clean)  # Python
```

## Практический пример

```python
def normalize_email(email: str) -> str:
    clean = email.strip().lower()

    if "@" not in clean:
        raise ValueError("Invalid email")

    return clean


print(normalize_email("  ALICE@EXAMPLE.COM  "))
```

Здесь используются сразу несколько операций:

- `strip()` убирает лишние пробелы;
- `lower()` приводит email к нижнему регистру;
- `in` проверяет наличие `@`;
- `return` возвращает нормализованную строку.

## Типичные ошибки

1. Складывать строку и число без преобразования.
   Проблема: `"age: " + 20` вызовет `TypeError`.
   Решение: использовать `str(20)` или f-string.

2. Ожидать, что метод изменит строку на месте.
   Проблема: `text.strip()` возвращает новую строку.
   Решение: сохранить результат: `text = text.strip()`.

3. Забывать, что индексы начинаются с `0`.
   Проблема: первый символ - это `text[0]`, а не `text[1]`.
   Решение: проверять индексы на маленьких примерах.

4. Путать `split()` и `join()`.
   Проблема: `split()` делает список из строки, `join()` делает строку из списка.
   Решение: помнить направление операции.

5. Проверять подстроку через `find()` без сравнения с `-1`.
   Проблема: `find()` возвращает `0`, если подстрока найдена в начале, а `0` в условии считается `False`.
   Решение: для простых проверок использовать `in`.

6. Путать `%` как остаток от деления и `%` как форматирование строки.
   Проблема: `7 % 2` работает с числами, а `"age=%d" % 20` форматирует строку.
   Решение: смотреть на левый операнд: число или строка.

7. Передать в `format()` меньше значений, чем плейсхолдеров.
   Проблема: `"{} {}".format("Alice")` вызовет `IndexError`.
   Решение: проверять, что каждому `{}` соответствует значение.

## Cheat-sheet

| Задача | Синтаксис |
| --- | --- |
| Создать строку | `text = "hello"` |
| Склеить строки | `a + b` |
| Повторить строку | `text * 3` |
| Длина строки | `len(text)` |
| Первый символ | `text[0]` |
| Последний символ | `text[-1]` |
| Срез | `text[start:end]` |
| Разворот строки | `text[::-1]` |
| Проверить подстроку | `"@" in email` |
| Проверить отсутствие подстроки | `"@" not in email` |
| Найти позицию подстроки | `text.find("ml")` |
| Посчитать вхождения | `text.count("python")` |
| Убрать пробелы по краям | `text.strip()` |
| Нижний регистр | `text.lower()` |
| Верхний регистр | `text.upper()` |
| Заменить подстроку | `text.replace("sql", "pandas")` |
| Проверить, что строка из цифр | `text.isdigit()` |
| Разбить строку | `text.split(",")` |
| Склеить список строк | `", ".join(items)` |
| Подставить значения | `f"{name}: {score}"` |
| Подставить через `format()` | `"{}: {}".format(name, score)` |
| Старое форматирование | `"%s: %.2f" % (name, score)` |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python: Text Sequence Type str', href: 'https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str' },
        { title: 'Python: String methods', href: 'https://docs.python.org/3/library/stdtypes.html#string-methods' },
        { title: 'Python: Formatted string literals', href: 'https://docs.python.org/3/reference/lexical_analysis.html#f-strings' },
        { title: 'Python: Format string syntax', href: 'https://docs.python.org/3/library/string.html#format-string-syntax' },
        { title: 'Python: printf-style string formatting', href: 'https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting' },
        { title: 'Python: Escape sequences', href: 'https://docs.python.org/3/reference/lexical_analysis.html#escape-sequences' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Неизменяемые типы', href: '/python/yazyk-python/tipy-dannykh/neizmenyaemye-tipy' },
        { title: 'Методы типов данных', href: '/python/yazyk-python/tipy-dannykh/metody-tipov-dannykh' },
        { title: 'Основные функции', href: '/python/yazyk-python/1-core/osnovnye-funktsii' },
        { title: 'Операторы сравнения', href: '/python/yazyk-python/1-core/operatory-sravneniya' },
    ]"
/>
