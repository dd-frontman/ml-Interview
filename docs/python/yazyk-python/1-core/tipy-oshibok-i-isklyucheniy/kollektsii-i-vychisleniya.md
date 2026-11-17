---
title: "Ошибки коллекций и вычислений"
description: "Почему возникают IndexError, KeyError, ZeroDivisionError и OverflowError, как их диагностировать и когда использовать проверки."
tags:
  - "python"
  - "exceptions"
  - "collections"
  - "arithmetic"
updatedAt: "2026-11-17"
---
## Ошибки поиска элементов {#oshibki-poiska-elementov}

`IndexError` и `KeyError` наследуются от общего класса `LookupError`.

```text
LookupError
├── IndexError
└── KeyError
```

Оба исключения означают, что программа попыталась найти отсутствующий элемент, но способ поиска различается.

## `IndexError` {#indexerror}

Индекс находится за границами последовательности.

```python
numbers = [10, 20]
print(numbers[2])


# IndexError: list index out of range
```

У списка два элемента:

```text
значения: 10  20
индексы:   0   1
```

Индекс `2` отсутствует.

### Безопасная проверка индекса {#bezopasnaya-proverka-indeksa}

```python
index = 2

if 0 <= index < len(numbers):
    print(numbers[index])
else:
    print("Индекс вне диапазона")


# Индекс вне диапазона
```

Если неправильный индекс означает баг алгоритма, не скрывайте исключение: исправьте расчёт индекса.

## `KeyError` {#keyerror}

В словаре нет запрошенного ключа.

```python
user = {"name": "Alex"}
print(user["age"])


# KeyError: 'age'
```

Если ключ обязателен, `user["age"]` полезен: исключение сразу показывает повреждённую структуру данных.

Если ключ необязателен, применяйте `get()`:

```python
age = user.get("age")
print(age)  # None
```

Можно задать значение по умолчанию:

```python
age = user.get("age", 0)
print(age)  # 0
```

Не используйте `get()` автоматически для каждого обращения: он может скрыть ошибку в обязательном ключе.

## `ZeroDivisionError` {#zerodivisionerror}

Деление или остаток от деления выполняется на ноль.

```python
result = 10 / 0


# ZeroDivisionError: division by zero
```

Ошибка возникает и при целочисленном делении или `%`:

```python
10 // 0  # ZeroDivisionError
10 % 0  # ZeroDivisionError
```

Если нулевой делитель является допустимым входным значением, проверьте его явно:

```python
def divide(left, right):
    if right == 0:
        raise ValueError("Делитель не должен быть равен нулю")

    return left / right
```

## `OverflowError` {#overflowerror}

Результат слишком велик для конкретной операции или ограниченного числового представления.

Целые числа `int` могут увеличиваться, пока хватает памяти:

```python
large_number = 10**1000
print(len(str(large_number)))  # 1001
```

Но некоторые функции работают с ограниченным форматом:

```python
import math

math.exp(1000)
# OverflowError: math range error
```

## Почему нельзя перехватывать общий `LookupError` без причины {#pochemu-nelzya-perekhvatyvat-obshchiy-lookuperror-bez-prichiny}

```python
try:
    value = data[key]
except LookupError:
    value = None
```

Такой обработчик может скрыть и отсутствующий ключ, и неправильный индекс во вложенном коде. Если ожидается только отсутствие ключа, ловите `KeyError`.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Напишите функцию получения элемента списка, которая возвращает `None` при неправильном индексе.
2. Объясните, когда `dictionary[key]` полезнее `dictionary.get(key)`.
3. Реализуйте деление с понятной проверкой нулевого делителя.

## Краткое повторение {#kratkoe-povtorenie}

- `IndexError` означает отсутствующий индекс последовательности.
- `KeyError` означает отсутствующий ключ отображения.
- Оба класса наследуются от `LookupError`.
- `ZeroDivisionError` возникает при делении на ноль.
- `OverflowError` относится к числу, слишком большому для конкретной операции.

<RelatedTopics
    :items="[
        { title: 'Обзор типов ошибок', href: '/python/yazyk-python/1-core/tipy-oshibok-i-isklyucheniy/' },
        { title: 'Списки', href: '/python/yazyk-python/tipy-dannykh/spiski-bazovye-operatsii' },
        { title: 'Словари', href: '/python/yazyk-python/tipy-dannykh/slovari-dict' },
    ]"
/>
