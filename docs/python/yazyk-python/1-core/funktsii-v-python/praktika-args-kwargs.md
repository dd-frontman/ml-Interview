---
title: "Практика: *args и **kwargs"
description: "Задачи на произвольные аргументы, распаковку, порядок параметров и возврат нескольких значений с подсказками и скрытыми решениями."
tags:
  - "python"
  - "core"
  - "functions"
  - "practice"
updatedAt: "2026-11-15"
---
## Как работать с задачами {#kak-rabotat-s-zadachami}

Перед каждой задачей:

1. Определи, какие аргументы являются обязательными.
2. Реши, нужны ли дополнительные позиционные значения, именованные значения или оба вида.
3. Запиши ожидаемый тип результата.
4. Проверь пустой ввод и другие пограничные случаи.
5. Только после своей попытки открывай решение.

## Задача 1. Среднее произвольного количества чисел {#zadacha-1-srednee-proizvolnogo-kolichestva-chisel}

Напиши функцию `average()`, которая принимает любое количество чисел и возвращает среднее значение. Если числа не переданы, функция должна выбросить `ValueError`.

```python
print(average(2, 4, 6))  # 4.0
```

### Подсказка {#podskazka}

Дополнительные позиционные аргументы собираются в кортеж. Пустой кортеж является ложным значением.

<details>
<summary>Решение</summary>

```python
def average(*numbers: float) -> float:
    if not numbers:
        raise ValueError("Нужно передать хотя бы одно число")

    return sum(numbers) / len(numbers)


print(average(2, 4, 6))  # 4.0
```

</details>

## Задача 2. Удаление значений `None` {#zadacha-2-udalenie-znacheniy-none}

Напиши функцию `filter_none()`, которая принимает именованные аргументы и возвращает новый словарь без значений `None`. Значения `0`, `False` и `""` нужно сохранить.

```python
result = filter_none(name="John", age=None, score=0, active=False)
print(result)  # {'name': 'John', 'score': 0, 'active': False}
```

### Подсказка {#podskazka-2}

Проверяй `value is not None`, а не просто `if value`.

<details>
<summary>Решение</summary>

```python
def filter_none(**kwargs: object) -> dict[str, object]:
    result = {}

    for key, value in kwargs.items():
        if value is not None:
            result[key] = value

    return result


filtered = filter_none(name="John", age=None, score=0, active=False)
print(filtered)  # {'name': 'John', 'score': 0, 'active': False}
```

</details>

## Задача 3. Форматирование отчёта {#zadacha-3-formatirovanie-otchyota}

Напиши функцию со следующими правилами:

- первый параметр `title` обязателен;
- после него можно передать любое количество чисел;
- параметр `precision` передаётся только по имени и по умолчанию равен `2`;
- дополнительные именованные аргументы сохраняются как метаданные.

Функция должна вернуть словарь с заголовком, округлёнными значениями и метаданными.

```python
report = build_report(
    "Metrics",
    0.8123,
    0.9345,
    precision=2,
    model="baseline",
)

print(report)
# {'title': 'Metrics', 'values': [0.81, 0.93], 'metadata': {'model': 'baseline'}}
```

### Подсказка {#podskazka-3}

Сигнатура начинается так: `def build_report(title, *values, precision=2, **metadata)`.

<details>
<summary>Решение</summary>

```python
def build_report(
    title: str,
    *values: float,
    precision: int = 2,
    **metadata: object,
) -> dict[str, object]:
    rounded_values = [round(value, precision) for value in values]

    return {
        "title": title,
        "values": rounded_values,
        "metadata": metadata,
    }
```

</details>

## Задача 4. Вызов функции из коллекций {#zadacha-4-vyzov-funktsii-iz-kollektsiy}

Дана функция:

```python
def create_product(name: str, price: float, *, currency: str) -> str:
    return f"{name}: {price} {currency}"
```

Вызови её, используя только переменные `product_data` и `options`:

```python
product_data = ["Laptop", 999.99]
options = {"currency": "USD"}
```

### Подсказка {#podskazka-4}

Для списка нужна одна звёздочка, для словаря — две.

<details>
<summary>Решение</summary>

```python
product_data = ["Laptop", 999.99]
options = {"currency": "USD"}

print(create_product(*product_data, **options))  # Laptop: 999.99 USD
```

</details>

## Задача 5. Обновление без мутации {#zadacha-5-obnovlenie-bez-mutatsii}

Напиши функцию `update_copy()`, которая:

- принимает исходный словарь;
- принимает изменения через `**kwargs`;
- не меняет исходный словарь;
- возвращает новый словарь и флаг изменения.

```python
original = {"name": "John", "age": 30}
updated, changed = update_copy(original, age=31)

print(original)  # {'name': 'John', 'age': 30}
print(updated)   # {'name': 'John', 'age': 31}
print(changed)   # True
```

### Подсказка {#podskazka-5}

Начни с `new_dict = original.copy()`. Флаг переключай только тогда, когда старое и новое значения отличаются.

<details>
<summary>Решение</summary>

```python
def update_copy(
    original: dict[str, object],
    **changes: object,
) -> tuple[dict[str, object], bool]:
    new_dict = original.copy()
    changed = False

    for key, value in changes.items():
        if key not in new_dict or new_dict[key] != value:
            new_dict[key] = value
            changed = True

    return new_dict, changed
```

</details>

## Самопроверка {#samoproverka}

После решения объясни своими словами:

1. Какой тип создаёт `*args`?
2. Какой тип создаёт `**kwargs`?
3. Чем `def func(*args)` отличается от `func(*values)`?
4. Почему параметр после `*args` передаётся только по имени?
5. Что фактически возвращает `return first, second`?
6. Как проверить, что функция не изменила исходный словарь?

<RelatedTopics
    :items="[
        { title: '*args', href: '/python/yazyk-python/1-core/funktsii-v-python/args-proizvolnye-pozitsionnye-argumenty' },
        { title: '**kwargs', href: '/python/yazyk-python/1-core/funktsii-v-python/kwargs-proizvolnye-imenovannye-argumenty' },
        { title: 'Распаковка аргументов', href: '/python/yazyk-python/1-core/funktsii-v-python/raspakovka-argumentov' },
        { title: 'Возврат нескольких значений', href: '/python/yazyk-python/1-core/funktsii-v-python/vozvrat-i-raspakovka-rezultata' },
    ]"
/>
