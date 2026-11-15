---
title: "Создание строк и базовые операции"
description: "Тип str в Python, одинарные, двойные и тройные кавычки, конкатенация, повторение, длина и неизменяемость строк."
tags:
  - "python"
  - "core"
  - "data-types"
  - "str"
updatedAt: "2026-11-14"
---
## Что такое строка {#chto-takoe-stroka}

`str` - это тип данных для текста.

```python
name = "Alice"
message = 'hello'

print(type(name))  # <class 'str'>
print(message)     # hello
```

В коде `str` встречается в двух ролях:

- `str` как тип: строка, текстовое значение;
- `str()` как функция: преобразование значения в строку.

```python
name: str = "Alice"
age_text = str(20)

print(name)      # Alice
print(age_text)  # 20
```

В аннотации `name: str` ничего не вызывается: это подсказка типа. В выражении `str(20)` функция реально выполняется и возвращает строку `"20"`.

## Одинарные и двойные кавычки {#odinarnye-i-dvoynye-kavychki}

Одинарные и двойные кавычки работают одинаково. Главное - закрыть строку такой же кавычкой, какой она была открыта.

```python
title = "Python"
same_title = 'Python'

print(title == same_title)  # True
```

Если внутри текста нужна кавычка, удобно выбрать другой внешний тип кавычек:

```python
text = "I'm learning Python"
quote = 'He said "hello"'

print(text)   # I'm learning Python
print(quote)  # He said "hello"
```

## Многострочные строки {#mnogostrochnye-stroki}

Для многострочного текста используют три двойные `"""` или три одинарные `'''` кавычки. Оба варианта создают обычную строку типа `str`.

```python
double_quoted = """Первая строка
Вторая строка
Третья строка"""

single_quoted = '''Один
Два
Три'''

print(double_quoted)
# Первая строка
# Вторая строка
# Третья строка

print(single_quoted)
# Один
# Два
# Три
```

Такая строка сохраняет переносы строк и пробелы между открывающими и закрывающими кавычками. Тройные кавычки удобны для длинного текста, шаблонов и строк документации.

Открывающие и закрывающие кавычки должны совпадать: строку, начатую через `"""`, нужно завершить через `"""`, а начатую через `'''` - через `'''`.

## Конкатенация через `+` {#konkatenatsiya-cherez-plus}

`+` склеивает строки:

```python
first_name = "Alice"
last_name = "Smith"
full_name = first_name + " " + last_name

print(full_name)  # Alice Smith
```

Складывать можно только строки со строками. Число сначала нужно преобразовать через `str()`:

```python
age = 20

print("age: " + str(age))  # age: 20
```

Без преобразования выражение `"age: " + age` вызовет `TypeError`.

## Повторение через `*` {#povtorenie-cherez}

`*` повторяет строку указанное количество раз:

```python
line = "-" * 10

print(line)      # ----------
print("ha" * 3)  # hahaha
```

Это удобно для простых разделителей, отступов и учебных задач с текстовыми фигурами.

## Длина строки: `len()` {#dlina-stroki-len}

`len()` возвращает количество символов в строке:

```python
name = "Alice"

print(len(name))  # 5
```

Пробелы, знаки препинания и переносы тоже считаются символами:

```python
text = "ml engineer"

print(len(text))  # 11
```

## Строки неизменяемы {#stroki-neizmenyaemy}

Строку нельзя изменить на месте:

```python
word = "python"

# word[0] = "P"
# TypeError: 'str' object does not support item assignment
```

Вместо изменения создают новую строку:

```python
word = "python"
updated = "P" + word[1:]

print(word)     # python
print(updated)  # Python
```

Методы строк также возвращают новое значение:

```python
text = " Python "
clean = text.strip()

print(text)   #  Python
print(clean)  # Python
```

## Типичные ошибки {#tipichnye-oshibki}

1. Складывать строку и число без `str()` или форматирования.
2. Ожидать, что метод изменит исходную строку.
3. Использовать разные открывающие и закрывающие кавычки.
4. Забывать, что `len()` учитывает пробелы и другие видимые символы.

## Краткое повторение {#kratkoe-povtorenie}

- одинарные и двойные кавычки создают одинаковый тип `str`;
- тройные кавычки позволяют записывать многострочный текст;
- `+` склеивает строки;
- `*` повторяет строку;
- `len()` возвращает количество символов;
- строка неизменяема, поэтому результат операции нужно сохранить.

<RelatedTopics
    :items="[
        { title: 'Индексы, срезы и поиск', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/indeksy-srezy-i-poisk' },
        { title: 'Методы строк', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/metody-strok' },
        { title: 'Неизменяемые типы', href: '/python/yazyk-python/tipy-dannykh/neizmenyaemye-tipy' },
    ]"
/>
