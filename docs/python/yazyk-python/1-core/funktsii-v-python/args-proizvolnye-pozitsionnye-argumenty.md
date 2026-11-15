---
title: "*args: произвольные позиционные аргументы"
description: "Как *args собирает позиционные аргументы в кортеж, когда он нужен и как безопасно работать с переменным числом значений."
tags:
  - "python"
  - "core"
  - "functions"
  - "args"
updatedAt: "2026-11-15"
---
## Какую задачу решает `*args` {#kakuyu-zadachu-reshaet-args}

Иногда количество значений заранее неизвестно. Например, функция должна сложить два, пять или десять чисел. Создавать отдельный параметр для каждого числа неудобно:

```python
def add_three(first: int, second: int, third: int) -> int:
    return first + second + third
```

Такая функция работает только с тремя аргументами. Параметр со звёздочкой позволяет принять любое количество дополнительных позиционных аргументов.

## Минимальный пример {#minimalnyy-primer}

```python
def add_all(*numbers: int) -> int:
    return sum(numbers)


print(add_all(1, 2, 3))        # 6
print(add_all(1, 2, 3, 4, 5))  # 15
print(add_all())               # 0
```

Запись `*numbers` означает: «собери все переданные позиционные аргументы в один кортеж с именем `numbers`».

## Что находится внутри `args` {#chto-nakhoditsya-vnutri-args}

Имя `args` является соглашением, а не специальным словом Python. Важна звёздочка перед именем.

```python
def show_arguments(*args: object) -> None:
    print(args)        # (1, 'Python', True)
    print(type(args))  # <class 'tuple'>


show_arguments(1, "Python", True)
```

Можно выбрать другое имя:

```python
def multiply(*numbers: int) -> int:
    result = 1

    for number in numbers:
        result *= number

    return result


print(multiply(2, 3, 4))  # 24
```

Название `args` используют потому, что другие программисты сразу узнают этот приём. Содержательное имя вроде `numbers` иногда делает функцию понятнее.

## Обычные параметры вместе с `*args` {#obychnye-parametry-vmeste-s-args}

Перед `*args` можно объявить обязательные параметры:

```python
def join_words(separator: str, *words: str) -> str:
    return separator.join(words)


print(join_words(", ", "Python", "SQL", "ML"))  # Python, SQL, ML
```

Аргументы распределяются слева направо:

- `separator` получает `", "`;
- `words` получает кортеж `("Python", "SQL", "ML")`.

Параметры после `*args` становятся keyword-only: их нужно передавать по имени.

```python
def calculate_total(*prices: float, discount: float = 0) -> float:
    return sum(prices) * (1 - discount)


print(calculate_total(100, 50, discount=0.1))  # 135.0
```

Подробнее порядок всех видов параметров разобран на странице [Порядок параметров функции](./poryadok-parametrov-funktsii.md).

## Когда `*args` действительно нужен {#kogda-args-deystvitelno-nuzhen}

`*args` подходит, когда функция:

- принимает переменное количество однотипных значений;
- объединяет несколько последовательностей;
- передаёт полученные аргументы другой функции;
- используется как универсальная обёртка, например в декораторе.

Если количество параметров фиксировано и у каждого своё назначение, лучше объявить их явно:

```python
def create_rectangle(width: float, height: float) -> float:
    return width * height
```

Вариант `create_rectangle(*args)` скрыл бы смысл первого и второго значения и усложнил бы проверку типов.

## Пустой `args` {#pustoy-args}

Если дополнительных аргументов нет, Python создаёт пустой кортеж:

```python
def count_arguments(*args: object) -> int:
    return len(args)


print(count_arguments())        # 0
print(count_arguments(1, 2, 3))  # 3
```

Поэтому функция должна заранее решить, допустим ли вызов без значений. Например, среднее пустой последовательности вычислить нельзя:

```python
def average(*numbers: float) -> float:
    if not numbers:
        raise ValueError("Нужно передать хотя бы одно число")

    return sum(numbers) / len(numbers)


print(average(2, 4, 6))  # 4.0
```

## Типичные ошибки {#tipichnye-oshibki}

### Ожидать список {#ozhidat-spisok}

`*args` всегда создаёт кортеж. Метод `append()` у него отсутствует:

```python
def broken(*args: int) -> None:
    args.append(10)  # AttributeError
```

Если нужна изменяемая коллекция, создай список: `values = list(args)`.

### Использовать `*args` для фиксированного контракта {#ispolzovat-args-dlya-fiksirovannogo-kontrakta}

```python
def divide(*args: float) -> float:
    return args[0] / args[1]
```

Из сигнатуры непонятно, что функция ожидает ровно два значения. Параметры `dividend` и `divisor` описали бы контракт точнее.

### Путать объявление и вызов {#putat-obyavlenie-i-vyzov}

- `def func(*args)` собирает аргументы внутри функции;
- `func(*values)` распаковывает коллекцию при вызове.

Распаковка при вызове подробно разобрана [на отдельной странице](./raspakovka-argumentov.md).

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Напиши `find_max(*numbers)`, которая возвращает наибольшее число и выдаёт понятную ошибку при пустом вызове.
2. Напиши `make_sentence(*words, ending=".")`, которая соединяет слова пробелами и добавляет окончание.
3. Напиши `product(*numbers)`, которая перемножает все переданные числа.

<RelatedTopics
    :items="[
        { title: 'Обзор функций', href: '/python/yazyk-python/1-core/funktsii-v-python/' },
        { title: '**kwargs', href: '/python/yazyk-python/1-core/funktsii-v-python/kwargs-proizvolnye-imenovannye-argumenty' },
        { title: 'Распаковка аргументов', href: '/python/yazyk-python/1-core/funktsii-v-python/raspakovka-argumentov' },
        { title: 'Практика args и kwargs', href: '/python/yazyk-python/1-core/funktsii-v-python/praktika-args-kwargs' },
    ]"
/>
