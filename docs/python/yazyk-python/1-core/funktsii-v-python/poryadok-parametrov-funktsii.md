---
title: "Порядок параметров функции"
description: "Позиционные, positional-only, обычные, *args, keyword-only и **kwargs параметры в одной сигнатуре Python."
tags:
  - "python"
  - "core"
  - "functions"
  - "parameters"
updatedAt: "2026-11-15"
---
## Зачем знать порядок параметров {#zachem-znat-poryadok-parametrov}

Python поддерживает несколько видов параметров. Их нельзя размещать в произвольном порядке: синтаксис показывает, какие аргументы разрешено передавать позиционно, какие только по имени и куда попадут дополнительные значения.

## Общая схема {#obshchaya-skhema}

Полная последовательность выглядит так:

```python
def function(
    positional_only,
    /,
    positional_or_keyword,
    *args,
    keyword_only,
    **kwargs,
):
    ...
```

Необязательно использовать все категории. В реальном коде сигнатура обычно короче.

## Обычные параметры {#obychnye-parametry}

Обычный параметр можно передать по позиции или по имени:

```python
def greet(name: str) -> str:
    return f"Hello, {name}!"


print(greet("Alex"))       # Hello, Alex!
print(greet(name="Alex"))  # Hello, Alex!
```

## Positional-only параметры и `/` {#positional-only-parametry-i}

Параметры перед `/` разрешено передавать только по позиции:

```python
def divide(dividend: float, divisor: float, /) -> float:
    return dividend / divisor


print(divide(10, 2))  # 5.0
```

Именованный вызов завершится ошибкой:

```python
divide(dividend=10, divisor=2)  # TypeError
```

Такой синтаксис полезен, если имена параметров являются внутренней деталью и не должны становиться частью публичного контракта.

## `*args` {#args}

Параметр со звёздочкой собирает оставшиеся позиционные аргументы:

```python
def total(initial: int, *numbers: int) -> int:
    return initial + sum(numbers)


print(total(10, 1, 2, 3))  # 16
```

`initial` получает `10`, а `numbers` — кортеж `(1, 2, 3)`.

## Keyword-only параметры после `*` {#keyword-only-parametry-posle}

Все параметры после `*args` можно передавать только по имени:

```python
def total(initial: int, *numbers: int, extra: int) -> int:
    return initial + sum(numbers) + extra


print(total(10, 1, 2, 3, extra=50))  # 66
```

У `extra` нет значения по умолчанию, поэтому аргумент обязателен:

```python
total(10, 1, 2, 3)  # TypeError: missing required keyword-only argument
```

Если собирать дополнительные позиционные аргументы не нужно, используется одиночная звёздочка:

```python
def connect(host: str, *, timeout: float = 5.0) -> str:
    return f"{host}: timeout={timeout}"


print(connect("example.com"))                # example.com: timeout=5.0
print(connect("example.com", timeout=2.5))   # example.com: timeout=2.5
```

Вызов `connect("example.com", 2.5)` приведёт к `TypeError`, потому что `timeout` является keyword-only параметром.

## `**kwargs` в конце {#kwargs-v-kontse}

`**kwargs` собирает все дополнительные именованные аргументы, поэтому после него нельзя объявлять другие параметры:

```python
def configure(name: str, **options: object) -> dict[str, object]:
    return {"name": name, **options}


result = configure("service", debug=True, retries=3)
print(result)  # {'name': 'service', 'debug': True, 'retries': 3}
```

## Полный пример {#polnyy-primer}

```python
def inspect_arguments(
    identifier: int,
    /,
    name: str,
    *scores: int,
    active: bool = True,
    **metadata: object,
) -> None:
    print(identifier)  # 101
    print(name)        # Alex
    print(scores)      # (80, 90)
    print(active)      # False
    print(metadata)    # {'city': 'Moscow'}


inspect_arguments(
    101,
    "Alex",
    80,
    90,
    active=False,
    city="Moscow",
)
```

Аргументы распределяются последовательно:

1. `101` попадает в positional-only параметр `identifier`.
2. `"Alex"` попадает в обычный параметр `name`.
3. `80` и `90` собираются в `scores`.
4. `active=False` заполняет keyword-only параметр.
5. `city="Moscow"` собирается в словарь `metadata`.

## Значения по умолчанию и порядок {#znacheniya-po-umolchaniyu-i-poryadok}

В одной группе параметр без значения по умолчанию не может следовать за параметром со значением по умолчанию:

```python
def broken(first=1, second):  # SyntaxError
    ...
```

Корректный вариант:

```python
def valid(first, second=1):
    return first + second
```

Но keyword-only параметры образуют отдельную группу, поэтому обязательный параметр может находиться после необязательного обычного параметра:

```python
def request(url: str = "/", *, method: str) -> str:
    return f"{method} {url}"


print(request(method="GET"))  # GET /
```

## Повторная передача одного параметра {#povtornaya-peredacha-odnogo-parametra}

```python
def example(x: int, y: int, *args: int) -> tuple[int, int, tuple[int, ...]]:
    return x, y, args


example(*[3, 4, 5], x=1)  # TypeError: multiple values for argument 'x'
```

Распакованный список уже передал `3` в `x`, а именованный аргумент пытается заполнить `x` ещё раз.

Безопасный вызов:

```python
print(example(1, 2, *[3, 4, 5]))  # (1, 2, (3, 4, 5))
```

## Типичные ошибки {#tipichnye-oshibki}

1. Ставить обычный параметр после `**kwargs`.
2. Передавать keyword-only параметр позиционно.
3. Забывать обязательный параметр после `*args`.
4. Передавать positional-only параметр по имени.
5. Заполнять один параметр дважды через разные способы передачи.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Создай функцию, где первый параметр positional-only, а последний keyword-only.
2. Напиши функцию `report(title, *values, precision=2, **metadata)` и выведи, что попало в каждый параметр.
3. Придумай три некорректных вызова функции из второго задания и объясни возникающие ошибки.

<RelatedTopics
    :items="[
        { title: 'Параметры и аргументы', href: '/python/yazyk-python/1-core/funktsii-v-python/parametry-i-argumenty' },
        { title: '*args', href: '/python/yazyk-python/1-core/funktsii-v-python/args-proizvolnye-pozitsionnye-argumenty' },
        { title: '**kwargs', href: '/python/yazyk-python/1-core/funktsii-v-python/kwargs-proizvolnye-imenovannye-argumenty' },
        { title: 'Значения по умолчанию', href: '/python/yazyk-python/1-core/funktsii-v-python/znacheniya-parametrov-po-umolchaniyu' },
    ]"
/>
