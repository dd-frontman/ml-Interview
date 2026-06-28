---
title: "Основные функции"
description: "Основные встроенные функции Python: print, input, str, int, float, type и isinstance."
tags:
  - "python"
  - "core"
  - "builtins"
  - "functions"
updatedAt: "2026-06-23"
---
## Зачем это знать

`print()`, `input()` и `type()` - встроенные функции Python. Они часто встречаются в первых скриптах и помогают понять, что делает программа:

- `print()` выводит значения;
- `input()` читает строку из консоли;
- `str()` преобразует значение в строку;
- `int()` и `float()` преобразуют значения в числа;
- `type()` показывает фактический тип объекта.

В production-коде они используются ограниченно, но для обучения, отладки и CLI-прототипов это базовый минимум.

## `print()`: вывод значений

`print()` выводит одно или несколько значений.

```python
print("Hello")
print("model", "v1", "ready")
```

Если передать несколько значений, Python по умолчанию разделит их пробелом.

```python
print("model", "v1", "ready")
# model v1 ready
```

## `sep` и `end`

`sep` и `end` - именованные параметры функции `print()`.

- `sep` задает разделитель между несколькими значениями. По умолчанию это пробел `" "`.
- `end` задает, что добавить в конец вывода. По умолчанию это перенос строки `"\n"`.

```python
print("model", "v1", "ready", sep=":")
# model:v1:ready

print("train", end=" -> ")
print("done")
# train -> done
```

Практическое правило: `sep` нужен, когда один `print()` выводит несколько значений, а `end` - когда нужно управлять завершением строки.

## `input()`: чтение строки из консоли

`input()` читает строку из стандартного ввода и возвращает `str`.

```python
name = input("Name: ")
print("Hello", name)
```

Важная деталь: `input()` не угадывает тип данных. Даже если пользователь ввел число, результат будет строкой.

```python
age_raw = input("Age: ")
age = int(age_raw)

print(age + 1)
```

Если нужен `float`, `bool` или более сложная структура, значение нужно явно распарсить и обработать ошибку.

```python
try:
    threshold = float(input("Threshold: "))
except ValueError:
    threshold = 0.5

print("Threshold:", threshold)
```

Практическое правило: `input()` годится для учебных скриптов и CLI-прототипов. В production-коде входные данные обычно приходят из аргументов CLI, файлов, API-запросов или переменных окружения.

## `str()`: преобразование в строку

`str()` преобразует значение в строковое представление.

```python
age = 20
score = 0.91
is_active = True

print(str(age))        # 20
print(str(score))      # 0.91
print(str(is_active))  # True
```

Это часто нужно, когда строку собирают через `+`.

```python
age = 20

message = "Age: " + str(age)

print(message)  # Age: 20
```

Без `str()` будет ошибка, потому что Python не складывает строку и число через `+`.

```python
# TypeError: can only concatenate str, not "int" to str
# message = "Age: " + 20
```

С f-строками `str()` обычно писать не нужно: Python сам подставит строковое представление значения.

```python
age = 20

message = f"Age: {age}"

print(message)  # Age: 20
```

`str()` можно вызвать почти от любого объекта.

```python
print(str(None))        # None
print(str([1, 2, 3]))   # [1, 2, 3]
print(str({"id": 1}))   # {'id': 1}
```

Но важная деталь: `str()` делает текст для человека, а не надежный формат хранения данных. Если нужно сохранить структуру как JSON, используй `json.dumps()`.

```python
import json

payload = {"id": 1, "active": True}

print(json.dumps(payload))  # {"id": 1, "active": true}
```

Практическое правило: `str()` используй для вывода, сообщений и простой склейки строк. Для парсинга, сериализации и обмена данными нужны отдельные форматы и парсеры.

## `int()` и `float()`: преобразование в числа

`int()` преобразует значение в целое число, а `float()` - в число с плавающей точкой.

```python
age = int("42")
score = float("0.91")

print(age)    # 42
print(score)  # 0.91
```

`float(int_value)` превращает целое число в дробное представление.

```python
count = 10
ratio = float(count)

print(ratio)  # 10.0
```

`int(float_value)` превращает `float` в `int`, но не округляет математически, а отбрасывает дробную часть в сторону нуля.

```python
print(int(3.9))    # 3
print(int(-3.9))   # -3
```

Если нужно именно округление, используй `round()`.

```python
print(round(3.9))  # 4
```

Преобразование строки с неподходящим форматом вызовет `ValueError`.

```python
try:
    value = int("42x")
except ValueError:
    value = 0

print(value)
```

Еще одна частая ошибка: `int("3.14")` не работает, потому что строка не выглядит как целое число.

```python
print(float("3.14"))  # 3.14
print(int(float("3.14")))  # 3
```

Практическое правило: после `input()` явно приводи строку к нужному типу и обрабатывай `ValueError`, если ввод может быть некорректным.

## `type()`: узнать тип объекта

`type()` возвращает тип объекта. В Python тип объекта обычно совпадает с его классом.

```python
value = 42
name = "Alice"
scores = [0.7, 0.9]

print(type(value))   # <class 'int'>
print(type(name))    # <class 'str'>
print(type(scores))  # <class 'list'>
```

Для своих классов работает так же:

```python
class User:
    pass


user = User()

print(type(user))  # <class '__main__.User'>
```

`type()` полезен для отладки и обучения: быстро посмотреть, с каким объектом работает код.

## `isinstance()`: проверка типа в условии

Для проверок в рабочем коде чаще используют `isinstance()`.

```python
value = 42

print(isinstance(value, int))  # True
print(isinstance(value, str))  # False
```

Почему `isinstance()` часто лучше:

- учитывает наследование классов;
- читабельнее показывает намерение "проверить, является ли объект таким типом";
- удобнее для нескольких допустимых типов.

```python
value = 42

print(isinstance(value, (int, float)))  # True
```

## `type()` и type hints

Не путай `type()` и type hints:

```python
score: float = 0.91

print(type(score))  # <class 'float'>
```

`score: float` - это аннотация для человека и инструментов. `type(score)` - runtime-проверка фактического объекта.

Практическое правило: для просмотра типа используй `type()`, для условий и валидации - `isinstance()`, а для контракта функции или переменной - type hints.

## Типичные ошибки

1. Ожидать от `input()` число.
   Проблема: `input()` всегда возвращает строку.
   Решение: явно приводить тип через `int()`, `float()` или свой парсер.

2. Считать `int(float_value)` округлением.
   Проблема: `int(3.9) == 3`, а не `4`.
   Решение: для округления использовать `round()`.

3. Вызывать `int()` или `float()` на строке без проверки.
   Проблема: некорректный ввод даст `ValueError`.
   Решение: обрабатывать ошибку через `try/except`.

4. Думать, что `str()` делает JSON.
   Проблема: `str({"id": 1})` похож на структуру, но это не JSON.
   Решение: для JSON использовать `json.dumps()`.

5. Путать `type()` и type hints.
   Проблема: аннотация не проверяет данные в runtime.
   Решение: для фактического типа использовать `type()` или `isinstance()`.

6. Использовать `print()` как постоянное логирование.
   Проблема: в реальном сервисе сложно управлять уровнем логов и контекстом.
   Решение: для production-кода использовать `logging`.

7. Проверять тип через `type(value) == SomeClass` без необходимости.
   Проблема: такая проверка не учитывает наследование.
   Решение: чаще использовать `isinstance(value, SomeClass)`.

## Cheat-sheet

| Синтаксис | Смысл |
| --- | --- |
| `print(value)` | Вывести значение |
| `print(a, b, sep=",")` | Задать разделитель вывода |
| `print(value, end="")` | Управлять концом строки |
| `input("Prompt: ")` | Прочитать строку из консоли |
| `str(20)` | Преобразовать значение в строку |
| `f"Age: {age}"` | Подставить значение в строку |
| `int(input())` | Прочитать строку и преобразовать в число |
| `float("0.91")` | Преобразовать строку в `float` |
| `float(10)` | Преобразовать `int` в `float` |
| `int(3.9)` | Отбросить дробную часть |
| `round(3.9)` | Округлить число |
| `type(value)` | Посмотреть фактический тип объекта |
| `isinstance(value, int)` | Проверить тип в условии |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python: print()', href: 'https://docs.python.org/3/library/functions.html#print' },
        { title: 'Python: input()', href: 'https://docs.python.org/3/library/functions.html#input' },
        { title: 'Python: str()', href: 'https://docs.python.org/3/library/stdtypes.html#str' },
        { title: 'Python: int()', href: 'https://docs.python.org/3/library/functions.html#int' },
        { title: 'Python: float()', href: 'https://docs.python.org/3/library/functions.html#float' },
        { title: 'Python: round()', href: 'https://docs.python.org/3/library/functions.html#round' },
        { title: 'Python: type()', href: 'https://docs.python.org/3/library/functions.html#type' },
        { title: 'Python: isinstance()', href: 'https://docs.python.org/3/library/functions.html#isinstance' },
        { title: 'Python: Built-in functions', href: 'https://docs.python.org/3/library/functions.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Операции со строками', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami' },
        { title: 'Основы синтаксиса и переменные', href: '/python/yazyk-python/1-core/osnovy-sintaksisa-i-peremennye' },
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python' },
        { title: 'Классы в Python', href: '/python/yazyk-python/1-core/klassy-v-python' },
        { title: 'Logging и CLI', href: '/python/ekosistema-python/logging-i-cli-dlya-ml-skriptov' },
    ]"
/>
