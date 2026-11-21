---
title: "Локальные переменные и ошибки функций"
description: "Локальные переменные функций Python и разбор частых ошибок при объявлении и вызове функций."
tags:
  - "python"
  - "core"
  - "functions"
  - "scope"
updatedAt: "2026-11-09"
---
## Локальные переменные {#lokalnye-peremennye}

Переменная, созданная внутри функции, называется локальной:

```python
def my_function() -> str:
    local_var = "Local variable"
    return local_var


print(my_function())  # Local variable
```

`local_var` существует в локальной области функции. Обратиться к ней напрямую снаружи нельзя:

```python
def my_function() -> str:
    local_var = "Local variable"
    return local_var


print(local_var)  # NameError
```

Чтобы передать значение наружу, функция возвращает его через `return`.

## Параметры тоже локальны {#parametry-tozhe-lokalny}

Параметр существует внутри конкретного вызова функции:

```python
name = "Внешнее имя"


def greet(name: str) -> str:
    return f"Привет, {name}!"


print(greet("Анна"))  # Привет, Анна!
print(name)            # Внешнее имя
```

Параметр `name` внутри `greet()` не изменяет внешнюю переменную с тем же именем.

Подробно области видимости разобраны в отдельном разделе: [«Область видимости переменных»](../oblast-vidimosti-peremennyh/index.md).

## Частые ошибки {#chastye-oshibki}

### Забыть вызвать функцию {#zabyt-vyzvat-funktsiyu}

`find_average` — объект функции, а `find_average(...)` — её вызов:

```python
def find_average(numbers):
    return sum(numbers) / len(numbers)


print(find_average)           # <function find_average at ...>
print(find_average([1, 2]))   # 1.5
```

### Печатать вместо возврата {#pechatat-vmesto-vozvrata}

`print()` не возвращает значение для дальнейших вычислений:

```python
def add(a, b):
    print(a + b)


result = add(2, 3)  # 5
print(result)       # None
```

Если результат нужен дальше, используй `return`.

### Ожидать значение от функции без `return` {#ozhidat-znachenie-ot-funktsii-bez-return}

```python
def do_nothing():
    pass


print(do_nothing())  # None
```

### Перепутать позиционные аргументы {#pereputat-pozitsionnye-argumenty}

```python
def format_date(day, month):
    return f"{day} {month}"


print(format_date("October", 15))  # October 15
```

Код выполняется, но значения могут оказаться не на своих местах. Именованные аргументы делают вызов понятнее:

```python
print(format_date(day=15, month="October"))  # 15 October
```

### Считать аннотации runtime-проверкой {#schitat-annotatsii-runtime-proverkoy}

Аннотация не останавливает выполнение сама:

```python
def double(value: int) -> int:
    return value * 2


print(double("a"))  # aa
```

### Использовать локальную переменную снаружи {#ispolzovat-lokalnuyu-peremennuyu-snaruzhi}

Локальная переменная доступна только во время выполнения функции. Верни нужное значение через `return`.

### Не обработать пустой список {#ne-obrabotat-pustoy-spisok}

```python
def find_average(numbers):
    return sum(numbers) / len(numbers)


find_average([])  # ZeroDivisionError
```

Пограничный случай нужно обработать явно:

```python
def find_average(numbers):
    if len(numbers) == 0:
        return 0

    return sum(numbers) / len(numbers)


print(find_average([]))        # 0
print(find_average([1, 2, 3])) # 2.0
```

В реальном проекте вместо `0` функция может выбрасывать исключение. Выбор зависит от её контракта.

## Как проверять функцию {#kak-proveryat-funktsiyu}

Проверь минимум три категории входных данных:

1. Обычный случай.
2. Граничный случай: пустая коллекция, ноль или минимальное значение.
3. Некорректный случай, если функция должна его обрабатывать.

```python
print(find_average([2, 4, 6]))  # 4.0
print(find_average([]))         # 0
```

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Объясни, почему переменная внутри функции недоступна после её завершения.
2. Исправь функцию, которая печатает сумму вместо её возврата.
3. Добавь обработку пустого списка в функцию поиска максимального значения.

<RelatedTopics
    :items="[
        { title: 'Обзор функций', href: '/python/yazyk-python/1-core/funktsii-v-python/' },
        { title: 'Область видимости переменных', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/' },
        { title: 'Обработка исключений', href: '/python/yazyk-python/1-core/tipy-oshibok-i-isklyucheniy/obrabotka-isklyucheniy-try-except' },
    ]"
/>
