---
title: "Локальные и глобальные переменные"
description: "Объяснение локальных и глобальных переменных Python, областей функций и поведения переменной цикла."
tags:
  - "python"
  - "core"
  - "scope"
  - "variables"
updatedAt: "2026-11-08"
---
## Зачем различать области {#zachem-razlichat-oblasti}

Две функции могут использовать одинаковые имена и при этом работать с разными переменными. Чтобы понимать, какие данные читает и изменяет функция, нужно знать место создания имени.

## Локальная переменная {#lokalnaya-peremennaya}

Переменная, созданная внутри функции, называется локальной. Она принадлежит конкретному вызову функции.

```python
def calculate_total():
    total = 10 + 20
    print(total)  # 30


calculate_total()
```

За пределами функции имя `total` недоступно:

```python
print(total)  # NameError
```

При каждом вызове функция создает новую локальную область:

```python
def show_number(number):
    doubled = number * 2
    print(doubled)


show_number(3)  # 6
show_number(5)  # 10
```

Значение `doubled` из первого вызова не используется во втором.

## Глобальная переменная {#globalnaya-peremennaya}

Переменная, созданная на уровне файла, называется глобальной, или переменной модуля:

```python
course_name = "Python"
```

Функция может прочитать ее без дополнительного ключевого слова:

```python
course_name = "Python"


def show_course():
    print(course_name)  # Python


show_course()
print(course_name)  # Python
```

Чтение глобальной переменной не делает ее локальной. Но присваивание внутри функции подчиняется другим правилам, которые разобраны на странице [`global` и константы](./global-i-konstanty.md).

## Параметры тоже локальные {#parametry-tozhe-lokalnye}

Параметр существует внутри функции и относится к ее локальной области:

```python
def greet(name):
    message = f"Привет, {name}"
    return message


print(greet("Анна"))  # Привет, Анна
```

Здесь `name` и `message` локальны. Значение выходит из функции только благодаря `return`.

## Переменная цикла {#peremennaya-tsikla}

Обычный цикл `for` не создает отдельную область видимости. Поэтому его переменная остается доступной после цикла:

```python
for number in range(3):
    print(number)

print(number)  # 2
```

Это допустимое поведение Python, но лучше не строить на нем дальнейшую логику. После цикла имя легко использовать случайно.

Если цикл находится внутри функции, его переменная принадлежит области этой функции:

```python
def show_numbers():
    for number in range(3):
        print(number)

    print(number)  # 2


show_numbers()
print(number)  # NameError
```

## Безопасная передача данных {#bezopasnaya-peredacha-dannykh}

Предпочтительный путь передачи данных:

```text
аргументы -> параметры функции -> локальные вычисления -> return
```

```python
def add_experience(current: int, gained: int) -> int:
    updated = current + gained
    return updated


experience = add_experience(100, 25)
print(experience)  # 125
```

Функция не зависит от скрытого состояния и явно возвращает результат.

## Типичные ошибки {#tipichnye-oshibki}

1. Использовать локальную переменную снаружи функции. Это приводит к `NameError`.
2. Считать, что цикл `for` создает отдельную область. В Python переменная цикла остается в текущей области.
3. Ожидать, что локальная переменная сохранится между вызовами функции. Для сохранения состояния нужен объект или замыкание.
4. Передавать результат через глобальную переменную вместо `return`. Это усложняет проверку функции.

## Самостоятельная практика {#samostoyatelnaya-praktika}

Напиши функцию `calculate_discount(price, percent)`, которая создает локальную переменную со скидкой и возвращает итоговую цену. После вызова попробуй обратиться к локальной переменной снаружи и объясни полученную ошибку.

<RelatedTopics
    :items="[
        { title: 'Обзор области видимости', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh' },
        { title: 'LEGB и shadowing', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/legb-i-shadowing' },
        { title: 'global и константы', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/global-i-konstanty' },
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python/' },
    ]"
/>
