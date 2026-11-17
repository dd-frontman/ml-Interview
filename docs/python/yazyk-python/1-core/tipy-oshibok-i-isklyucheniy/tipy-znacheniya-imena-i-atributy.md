---
title: "Ошибки типов, значений, имён и атрибутов"
description: "Простое объяснение TypeError, ValueError, NameError, UnboundLocalError и AttributeError с примерами и способами диагностики."
tags:
  - "python"
  - "exceptions"
  - "types"
  - "scope"
updatedAt: "2026-11-17"
---
## Главное различие {#glavnoe-razlichie}

Эти исключения часто похожи, но описывают разные проблемы:

- `TypeError` — объект имеет неподходящий тип;
- `ValueError` — тип подходит, но значение недопустимо;
- `NameError` — имя не найдено;
- `UnboundLocalError` — локальное имя используется до присваивания;
- `AttributeError` — у объекта нет атрибута.

## `TypeError` {#typeerror}

Операция получила несовместимый тип.

```python
result = "Возраст: " + 30


# TypeError: can only concatenate str (not "int") to str
```

Строку можно складывать со строкой, но не с целым числом.

```python
result = "Возраст: " + str(30)
print(result)  # Возраст: 30
```

Другие причины:

- функция получила неправильное количество аргументов;
- вызван объект, который не является функцией;
- индекс списка имеет неподходящий тип;
- операция не поддерживает комбинацию переданных типов.

```python
numbers = [10, 20]
print(numbers["0"])


# TypeError: list indices must be integers or slices, not str
```

## `ValueError` {#valueerror}

Тип аргумента допустим, но конкретное значение обработать нельзя.

```python
number = int("12.5")


# ValueError: invalid literal for int() with base 10: '12.5'
```

`int()` принимает строку, но `"12.5"` не является записью целого числа.

Ожидаемый пользовательский ввод можно обработать:

```python
try:
    age = int("unknown")
except ValueError:
    print("Возраст должен быть целым числом")


# Возраст должен быть целым числом
```

### `TypeError` или `ValueError` {#typeerror-ili-valueerror}

```python
int([1, 2])  # TypeError: объект неподходящего типа
int("abc")  # ValueError: строка допустима, содержимое нет
```

Этот принцип полезен и при создании собственных проверок аргументов.

## `NameError` {#nameerror}

Python не нашёл локальное или глобальное имя.

```python
print(user_name)


# NameError: name 'user_name' is not defined
```

Проверьте:

- опечатку;
- было ли выполнено присваивание;
- область видимости;
- правильность импорта функции или переменной.

## `UnboundLocalError` {#unboundlocalerror}

Это дочерний класс `NameError`. Он возникает, когда функция считает имя локальным, но обращается к нему до присваивания.

```python
count = 10


def increase():
    count += 1
    return count


increase()
# UnboundLocalError: cannot access local variable 'count'
```

Из-за присваивания `count += 1` имя считается локальным для `increase()`. Но первоначального локального значения ещё нет.

Предпочтительное решение — передавать значение явно:

```python
def increase(count):
    return count + 1


print(increase(10))  # 11
```

`global` и `nonlocal` применяют только тогда, когда функция действительно должна изменять внешнее состояние.

## `AttributeError` {#attributeerror}

У объекта нет указанного атрибута или метода.

```python
name = "Alex"
name.append("!")


# AttributeError: 'str' object has no attribute 'append'
```

`append()` существует у списка, но не у строки.

Проверьте тип и доступные атрибуты:

```python
print(type(name))  # <class 'str'>
print(hasattr(name, "append"))  # False
```

Частые причины:

- перепутан тип объекта;
- опечатка в имени метода;
- атрибут не создан в `__init__`;
- переменная неожиданно содержит `None`.

## Что исправлять, а что обрабатывать {#chto-ispravlyat-a-chto-obrabatyvat}

| Ситуация | Действие |
| --- | --- |
| перепутаны типы в собственном коде | исправить код |
| опечатка в имени | исправить код |
| вызван несуществующий метод | исправить код |
| пользователь ввёл неверное число | обработать `ValueError` |
| публичная функция получила неправильный тип | создать понятный `TypeError` или проверить входные данные |

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Предскажите исключения для `len(10)`, `float("abc")` и `unknown_name`.
2. Исправьте функцию с `UnboundLocalError`, передав начальное значение аргументом.
3. Напишите функцию, которая создаёт `ValueError` для отрицательного возраста.

## Краткое повторение {#kratkoe-povtorenie}

- `TypeError` относится к неподходящему типу.
- `ValueError` относится к недопустимому значению подходящего типа.
- `NameError` означает, что имя не найдено.
- `UnboundLocalError` связан с локальной областью видимости.
- `AttributeError` означает отсутствие атрибута у объекта.

<RelatedTopics
    :items="[
        { title: 'Обзор типов ошибок', href: '/python/yazyk-python/1-core/tipy-oshibok-i-isklyucheniy/' },
        { title: 'Область видимости', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/' },
        { title: 'Типы данных', href: '/python/yazyk-python/tipy-dannykh/tipy-glavnaya' },
    ]"
/>
