---
title: "Функции в Python"
description: "Конспект по функциям в Python: def, параметры, return, None, pass, позиционные и именованные аргументы, keyword-only параметры, значения по умолчанию и локальные переменные."
tags:
  - "python"
  - "core"
  - "functions"
updatedAt: "2026-07-06"
---
## Зачем нужны функции

Функция - это именованный блок кода, который можно вызывать много раз.

Она нужна, чтобы:

- не повторять один и тот же код;
- давать логике понятное имя;
- передавать входные данные через параметры;
- возвращать результат через `return`;
- разбивать программу на маленькие понятные части.

## Проблема повторения кода

Без функции одинаковая логика копируется.

```python
numbers_1 = [1, 2, 3, 4, 5]
average_1 = sum(numbers_1) / len(numbers_1)
print(average_1)  # 3.0

numbers_2 = [6, 7, 8, 9, 10]
average_2 = sum(numbers_2) / len(numbers_2)
print(average_2)  # 8.0
```

Формула одна и та же:

```python
sum(numbers) / len(numbers)
```

Лучше вынести её в функцию.

## `def`

Функция объявляется через `def`.

```python
def find_average(numbers):
    average = sum(numbers) / len(numbers)
    return average
```

Что здесь происходит:

- `def` объявляет функцию;
- `find_average` - имя функции;
- `numbers` - параметр;
- тело функции пишется с отступом;
- `return average` возвращает результат.

Функцию можно вызвать несколько раз с разными списками.

```python
numbers_1 = [1, 2, 3, 4, 5]
numbers_2 = [6, 7, 8, 9, 10]

average_1 = find_average(numbers_1)
average_2 = find_average(numbers_2)

print(average_1, average_2)  # 3.0 8.0
```

## Параметры

Параметр - это переменная, которую функция получает при вызове.

```python
def count_vowels(string):
    vowels = "aeiouyAEIOUY"
    count = 0

    for char in string:
        if char in vowels:
            count += 1

    return count
```

Здесь `string` - параметр. При вызове функции в него попадает конкретная строка.

```python
print(count_vowels("Hello, World!"))  # 3
print(count_vowels("Python is a very powerful language."))  # 13
```

## `return`

`return` возвращает значение из функции и завершает её выполнение.

```python
def find_average(numbers):
    return sum(numbers) / len(numbers)
```

Результат можно сохранить в переменную.

```python
average = find_average([1, 2, 3])
print(average)  # 2.0
```

Если функция должна что-то посчитать и отдать наружу, нужен `return`.

## Функция без `return`

Если в функции нет `return`, она возвращает `None`.

```python
def nothing():
    print("This function does nothing.")


result = nothing()
print(result)  # None
```

`print()` внутри функции просто выводит текст в консоль. Это не то же самое, что вернуть значение.

## `pass`

`pass` используется как пустое тело функции.

```python
def nothing():
    pass
```

Такая функция ничего не делает и тоже возвращает `None`.

```python
my_variable = nothing()

print(my_variable)  # None
print(nothing())    # None
```

`pass` полезен как временная заглушка, когда функция уже нужна по структуре, но логика ещё не написана.

## Позиционные аргументы

Аргументы можно передавать по позиции.

```python
def format_date(day, month):
    return f"The date is {day} of {month}."


print(format_date(15, "October"))
# The date is 15 of October.
```

Порядок важен.

```python
print(format_date("January", 1))
# The date is January of 1.
```

Python не понимает смысл аргументов, если они переданы позиционно. Он просто кладет первый аргумент в `day`, второй - в `month`.

## Именованные аргументы

Чтобы явно указать, какой аргумент куда идет, можно использовать имена параметров.

```python
print(format_date(day=15, month="October"))
# The date is 15 of October.
```

Такой вызов читается понятнее и снижает риск перепутать порядок.

## Keyword-only параметры

Можно запретить позиционные аргументы и заставить вызывать функцию только по именам.

```python
def format_date(*, day: int, month: str) -> str:
    return f"The date is {day} of {month}."


print(format_date(day=15, month="October"))
```

Звездочка `*` означает: все параметры после неё нужно передавать только по имени.

Такой вызов будет ошибкой:

```python
format_date(15, "October")  # TypeError
```

Это полезно, когда порядок аргументов легко перепутать.

## Значения по умолчанию

У параметра может быть значение по умолчанию.

```python
def custom_greeting(*, name: str, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}"
```

Если `greeting` не передать, Python возьмет `"Hello"`.

```python
print(custom_greeting(name="John"))
# Hello, John
```

Если передать `greeting`, значение по умолчанию заменится.

```python
print(custom_greeting(name="John", greeting="Good morning"))
# Good morning, John
```

## Type hints

Аннотации типов показывают ожидаемые типы параметров и результата.

```python
def custom_greeting(*, name: str, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}"
```

В этой записи:

- `name: str` означает, что `name` ожидается строкой;
- `greeting: str = "Hello"` означает строковый параметр со значением по умолчанию;
- `-> str` означает, что функция должна вернуть строку.

Важно: type hints сами по себе не проверяют типы во время выполнения.

```python
def double(value: int) -> int:
    return value * 2


print(double("x"))  # xx
```

Аннотации помогают IDE, чтению кода и статическим анализаторам, но критичные входные данные всё равно нужно проверять кодом.

## Локальные переменные

Переменная, созданная внутри функции, называется локальной.

```python
def my_function() -> str:
    local_var = "Local variable"
    return local_var


print(my_function())
```

`local_var` существует внутри функции. Снаружи она недоступна напрямую.

```python
def my_function() -> str:
    local_var = "Local variable"
    return local_var


print(local_var)  # NameError
```

Чтобы получить значение наружу, его нужно вернуть через `return`.

## `print()` или `return`

`print()` выводит значение в консоль.

```python
def show_average(numbers):
    print(sum(numbers) / len(numbers))
```

`return` отдает значение вызывающему коду.

```python
def find_average(numbers):
    return sum(numbers) / len(numbers)
```

Если результат нужно дальше использовать в программе, обычно нужен `return`.

```python
average = find_average([1, 2, 3])
print(average + 10)
```

Если нужно только показать значение человеку, можно использовать `print()`.

## Частые ошибки

1. Забыть вызвать функцию.
   Проблема: `find_average` - это сама функция, а `find_average(...)` - её вызов.
   Решение: писать скобки при вызове.

2. Печатать значение вместо возврата.
   Проблема: `print()` не возвращает результат для дальнейших вычислений.
   Решение: если результат нужен дальше, использовать `return`.

3. Ожидать результат от функции без `return`.
   Проблема: такая функция возвращает `None`.
   Решение: явно писать `return value`.

4. Путать порядок позиционных аргументов.
   Проблема: `format_date("January", 1)` работает синтаксически, но смысл неверный.
   Решение: использовать именованные аргументы или keyword-only параметры.

5. Считать type hints runtime-проверкой.
   Проблема: аннотации не остановят неправильный тип сами.
   Решение: проверять критичные данные кодом.

6. Пытаться использовать локальную переменную снаружи функции.
   Проблема: локальная переменная живет только внутри функции.
   Решение: возвращать значение через `return`.

7. Не обрабатывать пустой список при среднем значении.
   Проблема: `sum(numbers) / len(numbers)` упадет с `ZeroDivisionError`, если список пустой.
   Решение: заранее проверить вход.

```python
def find_average(numbers):
    if len(numbers) == 0:
        return 0

    return sum(numbers) / len(numbers)
```

## Cheat-sheet

| Синтаксис | Что делает |
| --- | --- |
| `def name():` | Объявляет функцию |
| `def name(value):` | Функция с параметром |
| `name(10)` | Вызов функции |
| `return value` | Вернуть результат |
| `pass` | Пустое тело функции |
| `None` | Отсутствие полезного результата |
| `func(a, b)` | Позиционные аргументы |
| `func(day=15, month="October")` | Именованные аргументы |
| `def func(*, arg):` | Keyword-only параметр |
| `arg="default"` | Значение по умолчанию |
| `arg: str` | Аннотация типа параметра |
| `-> str` | Аннотация типа результата |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Defining functions', href: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions' },
        { title: 'Python Tutorial: Default argument values', href: 'https://docs.python.org/3/tutorial/controlflow.html#default-argument-values' },
        { title: 'Python Tutorial: Keyword arguments', href: 'https://docs.python.org/3/tutorial/controlflow.html#keyword-arguments' },
        { title: 'Python Reference: Function definitions', href: 'https://docs.python.org/3/reference/compound_stmts.html#function-definitions' },
        { title: 'Python Built-in constants: None', href: 'https://docs.python.org/3/library/constants.html#None' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Основные функции', href: '/python/yazyk-python/1-core/osnovnye-funktsii' },
        { title: 'Циклы for и range', href: '/python/yazyk-python/1-core/tsikly-for-i-range' },
        { title: 'Списки: базовые операции', href: '/python/yazyk-python/tipy-dannykh/spiski-bazovye-operatsii' },
        { title: 'Операции со строками', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami' },
    ]"
/>
