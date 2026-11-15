---
title: "Распаковка аргументов через * и **"
description: "Как передавать элементы списка и кортежа как позиционные аргументы, а пары словаря как именованные аргументы функции."
tags:
  - "python"
  - "core"
  - "functions"
  - "unpacking"
updatedAt: "2026-11-15"
---
## Зачем нужна распаковка {#zachem-nuzhna-raspakovka}

Функция ожидает отдельные аргументы, но данные часто уже находятся в коллекции:

```python
def calculate_area(width: int, height: int) -> int:
    return width * height


size = [5, 3]
```

Вызов `calculate_area(size)` передаст один список вместо двух чисел. Звёздочка распакует элементы коллекции в отдельные позиционные аргументы.

## Распаковка через `*` {#raspakovka-cherez}

```python
size = [5, 3]

print(calculate_area(*size))  # 15
```

Этот вызов равносилен записи:

```python
print(calculate_area(5, 3))  # 15
```

Последовательность должна содержать столько элементов, сколько параметров нужно заполнить. Иначе возникнет `TypeError`.

## Список, кортеж и другие итерируемые объекты {#spisok-kortezh-i-drugie-iteriruemye-obekty}

Оператор `*` работает не только со списком:

```python
def show_point(x: int, y: int) -> str:
    return f"x={x}, y={y}"


coordinates = (10, 20)
print(show_point(*coordinates))  # x=10, y=20
```

Распаковать можно любой итерируемый объект, но число элементов всё равно должно соответствовать сигнатуре функции.

## Несколько распаковок в одном вызове {#neskolko-raspakovok-v-odnom-vyzove}

Обычные аргументы и несколько последовательностей можно объединять:

```python
def add_all(*numbers: int) -> int:
    return sum(numbers)


first = [1, 2]
second = (3, 4)

print(add_all(0, *first, *second, 5))  # 15
```

После распаковки функция фактически получает числа `0, 1, 2, 3, 4, 5`.

## Что произойдёт без `*` {#chto-proizoydyot-bez}

```python
values = [1, 2, 3]

add_all(values)  # TypeError
```

Без звёздочки `values` является одним аргументом. Внутри `add_all()` получится кортеж `([1, 2, 3],)`, и `sum()` попытается сложить число со списком.

## Распаковка словаря через `**` {#raspakovka-slovarya-cherez}

Две звёздочки превращают пары словаря в именованные аргументы:

```python
def introduce(name: str, age: int, city: str) -> str:
    return f"{name}, {age}, {city}"


person = {
    "name": "John",
    "age": 30,
    "city": "London",
}

print(introduce(**person))  # John, 30, London
```

Вызов равносилен записи:

```python
print(introduce(name="John", age=30, city="London"))  # John, 30, London
```

Ключи словаря должны быть строками и совпадать с именами параметров.

## Распаковка словаря в `**kwargs` {#raspakovka-slovarya-v-kwargs}

Функция с `**kwargs` принимает словарь с произвольными ключами:

```python
def collect_options(**options: object) -> dict[str, object]:
    return options


defaults = {"theme": "dark", "language": "ru"}

print(collect_options(**defaults))  # {'theme': 'dark', 'language': 'ru'}
```

Здесь происходят две противоположные операции:

1. `**defaults` распаковывает словарь при вызове.
2. `**options` собирает именованные аргументы внутри функции в новый словарь.

## Совместное использование `*` и `**` {#sovmestnoe-ispolzovanie-i}

```python
def describe_product(name: str, price: float, *, currency: str) -> str:
    return f"{name}: {price} {currency}"


main_data = ["Laptop", 999.99]
options = {"currency": "USD"}

print(describe_product(*main_data, **options))  # Laptop: 999.99 USD
```

Список заполняет позиционные параметры `name` и `price`, а словарь передаёт keyword-only параметр `currency`.

## Конфликт одинаковых аргументов {#konflikt-odinakovykh-argumentov}

Один параметр нельзя заполнить дважды:

```python
person = {"name": "John", "age": 30, "city": "London"}

introduce(name="Alex", **person)  # TypeError: multiple values for keyword argument 'name'
```

Значение `name` передано явно и одновременно пришло из словаря.

Похожая ошибка возможна при позиционной распаковке:

```python
def subtract(first: int, second: int) -> int:
    return first - second


subtract(*[10, 3], first=10)  # TypeError
```

Список уже заполнил `first` и `second`, поэтому повторное значение `first` создаёт конфликт.

## Сбор и распаковка: главное различие {#sbor-i-raspakovka-glavnoe-razlichie}

| Где используется | `*` | `**` |
| --- | --- | --- |
| В объявлении функции | Собирает позиционные аргументы в кортеж | Собирает именованные аргументы в словарь |
| При вызове функции | Распаковывает итерируемый объект | Распаковывает словарь |

Направление определяется контекстом: в сигнатуре данные собираются, в вызове — раскрываются.

## Типичные ошибки {#tipichnye-oshibki}

1. Передать коллекцию без звёздочки и ожидать, что Python распакует её автоматически.
2. Передать слишком много или слишком мало элементов для фиксированной сигнатуры.
3. Использовать `**` со списком: две звёздочки ожидают отображение с ключами.
4. Передать ключ, которого нет среди параметров функции без `**kwargs`.
5. Заполнить один параметр одновременно явным аргументом и распаковкой.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Создай список `[10, 20]` и передай его в функцию `add(first, second)` через распаковку.
2. Создай словарь для вызова `create_user(name, age, city)` и распакуй его через `**`.
3. Напиши функцию с двумя обычными параметрами и одним keyword-only параметром, затем вызови её с помощью `*data` и `**options`.

<RelatedTopics
    :items="[
        { title: '*args', href: '/python/yazyk-python/1-core/funktsii-v-python/args-proizvolnye-pozitsionnye-argumenty' },
        { title: '**kwargs', href: '/python/yazyk-python/1-core/funktsii-v-python/kwargs-proizvolnye-imenovannye-argumenty' },
        { title: 'Порядок параметров', href: '/python/yazyk-python/1-core/funktsii-v-python/poryadok-parametrov-funktsii' },
    ]"
/>
