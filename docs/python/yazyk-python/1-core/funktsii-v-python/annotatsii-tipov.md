---
title: "Аннотации типов в Python"
description: "Аннотации переменных, параметров, возвращаемых значений и коллекций, объединения типов, None и ограничения type hints в Python."
tags:
  - "python"
  - "core"
  - "functions"
  - "typing"
updatedAt: "2026-11-10"
---
## Зачем нужны аннотации типов {#zachem-nuzhny-annotatsii-tipov}

Аннотации типов, или type hints, показывают, какие значения функция ожидает получить и вернуть:

```python
def custom_greeting(*, name: str, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}"


print(custom_greeting(name="John"))  # Hello, John
```

В этой записи:

- `name: str` означает, что `name` ожидается строкой;
- `greeting: str = "Hello"` объединяет аннотацию и значение по умолчанию;
- `-> str` означает, что функция должна вернуть строку.

Аннотации делают контракт функции понятнее человеку, IDE и статическому анализатору.

Они помогают:

- понимать, какие данные ожидает код;
- получать подсказки и предупреждения Pylance;
- находить несоответствия через `mypy` или `pyright`;
- быстрее разбираться в чужих функциях;
- безопаснее менять существующий код.

## Аннотации переменных {#annotatsii-peremennykh}

Тип можно указать при создании переменной:

```python
name: str = "Анна"
age: int = 25
height: float = 1.7
is_active: bool = True

print(name)       # Анна
print(age)        # 25
print(height)     # 1.7
print(is_active)  # True
```

Аннотацию разрешено записать до присваивания значения:

```python
result: int
result = 10

print(result)  # 10
```

Запись `result: int` не создаёт автоматическое значение `0`. До присваивания читать такую локальную переменную нельзя.

## Аннотации основных типов {#annotatsii-osnovnykh-tipov}

```python
def calculate_total(price: float, quantity: int) -> float:
    return price * quantity


print(calculate_total(19.5, 3))  # 58.5
```

Для коллекций можно указать тип элементов:

```python
def find_average(numbers: list[int]) -> float:
    return sum(numbers) / len(numbers)


print(find_average([2, 4, 6]))  # 4.0
```

`list[int]` означает список целых чисел. Это описание ожидаемых данных, а не преобразование списка.

## Аннотации коллекций {#annotatsii-kollektsiy}

В квадратных скобках указывают тип содержимого коллекции:

```python
numbers: list[int] = [1, 2, 3]
names: list[str] = ["Анна", "Иван"]
ages: dict[str, int] = {"Анна": 25, "Иван": 30}
point: tuple[int, int] = (10, 20)
unique_numbers: set[int] = {1, 2, 3}
```

Разберём словарь `dict[str, int]`:

- `str` — тип ключей;
- `int` — тип значений.

Кортеж `tuple[int, int]` в примере содержит ровно два целых числа. Для кортежа произвольной длины из целых чисел используют `tuple[int, ...]`:

```python
coordinates: tuple[int, ...] = (10, 20, 30, 40)
```

## Если функция ничего полезного не возвращает {#esli-funktsiya-nichego-poleznogo-ne-vozvrashchaet}

Возвращаемый тип такой функции обозначают как `None`:

```python
def show_message(message: str) -> None:
    print(message)


show_message("Готово")  # Готово
```

## Несколько возможных типов {#neskolko-vozmozhnykh-tipov}

Оператор `|` означает, что допустим один из нескольких типов:

```python
def double(value: int | float) -> int | float:
    return value * 2


print(double(5))    # 10
print(double(2.5))  # 5.0
```

Функция принимает и возвращает целое число или число с плавающей точкой.

### Значение или `None` {#znachenie-ili-none}

Если функция иногда не находит результат, это отражают в аннотации:

```python
def find_user(user_id: int) -> str | None:
    if user_id == 1:
        return "Анна"

    return None


print(find_user(1))  # Анна
print(find_user(2))  # None
```

Здесь функция возвращает строку, если пользователь найден, или `None`.

## Аннотация и значение по умолчанию {#annotatsiya-i-znachenie-po-umolchaniyu}

Аннотация записывается перед значением по умолчанию:

```python
def greet(name: str, greeting: str = "Привет") -> str:
    return f"{greeting}, {name}!"


print(greet("Анна"))                 # Привет, Анна!
print(greet("Анна", "Добрый день"))  # Добрый день, Анна!
```

Если значение по умолчанию равно `None`, этот вариант нужно указать в типе:

```python
def add_item(
    item: int,
    items: list[int] | None = None,
) -> list[int]:
    if items is None:
        items = []

    items.append(item)
    return items


print(add_item(1))          # [1]
print(add_item(2, [10]))    # [10, 2]
```

Аннотация `list[int] | None` совпадает с реальным состоянием параметра: до создания нового списка там может находиться `None`.

## Статическая проверка {#staticheskaya-proverka}

Pylance, `mypy` и `pyright` анализируют код без его обычного выполнения. Например, они могут подсветить такой вызов:

```python
def calculate_total(price: float, quantity: int) -> float:
    return price * quantity


calculate_total("дорого", 3)  # Статический анализатор предупредит о типе str
```

Предупреждение появляется в редакторе или при запуске анализатора. Сам интерпретатор Python всё равно попытается выполнить код.

## Python не проверяет аннотации автоматически {#python-ne-proveryaet-annotatsii-avtomaticheski}

Type hints сами по себе не запрещают передать значение другого типа:

```python
def double(value: int) -> int:
    return value * 2


print(double("x"))  # xx
```

Код выполнился, хотя аннотация ожидала `int`. Аннотации помогают IDE и инструментам статической проверки, но критичные входные данные всё равно нужно проверять кодом.

```python
def double(value: int) -> int:
    if not isinstance(value, int):
        raise TypeError("value должен быть int")

    return value * 2
```

Runtime-проверку стоит добавлять на границах программы: для пользовательского ввода, данных API или файлов. Не нужно автоматически проверять каждый внутренний вызов.

## Типичные ошибки {#tipichnye-oshibki}

1. Считать аннотацию автоматической проверкой типа.
2. Указывать `-> float`, хотя одна из веток не содержит `return` и возвращает `None`.
3. Писать слишком общий тип `list`, когда полезно указать `list[int]` или `list[str]`.
4. Указывать тип, который не соответствует реальному результату функции.
5. Писать `items: list[int] = None` и не добавлять `None` в аннотацию.
6. Ожидать, что аннотация преобразует строку `"10"` в число `10`.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Добавь аннотации к функции `def add(a, b): return a + b`.
2. Опиши функцию, которая принимает список строк и возвращает целое число.
3. Создай функцию, которая возвращает `str | None`, и объясни обе ветки результата.

## Краткая шпаргалка {#kratkaya-shpargalka}

| Аннотация | Значение |
| --- | --- |
| `age: int` | Целое число |
| `price: float` | Число с плавающей точкой |
| `name: str` | Строка |
| `items: list[int]` | Список целых чисел |
| `ages: dict[str, int]` | Словарь со строковыми ключами и целыми значениями |
| `value: int | float` | Целое число или число с плавающей точкой |
| `name: str | None` | Строка или `None` |
| `-> None` | Функция не возвращает полезного значения |

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python: typing — Support for type hints', href: 'https://docs.python.org/3/library/typing.html' },
        { title: 'Python: Annotations best practices', href: 'https://docs.python.org/3/howto/annotations.html' },
        { title: 'PEP 484: Type Hints', href: 'https://peps.python.org/pep-0484/' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Обзор функций', href: '/python/yazyk-python/1-core/funktsii-v-python/' },
        { title: 'return, print и pass', href: '/python/yazyk-python/1-core/funktsii-v-python/return-print-i-pass' },
        { title: 'Значения параметров по умолчанию', href: '/python/yazyk-python/1-core/funktsii-v-python/znacheniya-parametrov-po-umolchaniyu' },
    ]"
/>
