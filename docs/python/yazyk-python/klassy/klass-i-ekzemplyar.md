---
title: "Класс и экземпляр"
description: "Первая часть урока о классах Python: объявление class, создание экземпляров, pass, type, isinstance и различия между классом и объектом."
tags:
  - "python"
  - "core"
  - "classes"
  - "objects"
updatedAt: "2026-08-20"
---
## Что такое класс {#chto-takoe-klass}

Класс - описание объектов одного типа. Он определяет, какие данные могут хранить объекты и какие действия они умеют выполнять.

Минимальный класс:

```python
class Character:
    pass
```

Что здесь происходит:

- `class` начинает объявление класса;
- `Character` - имя класса;
- `:` начинает тело класса;
- `pass` обозначает пустой блок.

Имена классов принято записывать в `PascalCase`:

```python
class UserProfile:
    pass


class BankAccount:
    pass
```

## Зачем нужен `pass` {#zachem-nuzhen-pass}

После `class` Python ожидает хотя бы одну инструкцию с отступом. Если реализация еще не написана, используется `pass`.

```python
class EmptyClass:
    pass
```

`pass` ничего не делает. Он нужен только для синтаксически корректного пустого блока.

Пустое тело вызовет ошибку:

```python
# SyntaxError
class EmptyClass:
```

## Что такое экземпляр {#chto-takoe-ekzemplyar}

Экземпляр - конкретный объект, созданный на основе класса.

```python
class Character:
    pass


ork = Character()
elf = Character()
```

`Character` - класс, а `ork` и `elf` - два его экземпляра.

```python
print(ork is elf)  # False
```

Объекты относятся к одному типу, но занимают независимые места в памяти.

## Класс тоже является объектом {#klass-tozhe-yavlyaetsya-obektom}

В Python сам класс создается во время выполнения программы.

```python
class Character:
    pass


print(type(Character))
# <class 'type'>
```

`Character` является экземпляром метакласса `type`. На начальном этапе достаточно запомнить: класс можно хранить в переменной, передавать в функцию и вызывать для создания объектов.

```python
selected_class = Character
character = selected_class()

print(type(character))
# <class '__main__.Character'>
```

## В Python все значения являются объектами {#v-python-vse-znacheniya-yavlyayutsya-obektami}

Строки, числа, списки и функции также являются объектами соответствующих классов.

```python
message = "Hello"
number = 42
items = [1, 2, 3]

print(type(message))  # <class 'str'>
print(type(number))   # <class 'int'>
print(type(items))    # <class 'list'>
```

`str`, `int` и `list` - классы:

```python
print(type(str))   # <class 'type'>
print(type(int))   # <class 'type'>
print(type(list))  # <class 'type'>
```

Методы `.upper()`, `.bit_length()` и `.append()` определены соответствующими классами.

## Проверка через `type()` {#proverka-cherez-type}

`type()` возвращает фактический класс объекта.

```python
class Character:
    pass


character = Character()

print(type(character) is Character)  # True
```

Такая проверка требует точного совпадения класса и не учитывает наследование.

## Проверка через `isinstance()` {#proverka-cherez-isinstance}

`isinstance()` проверяет, является ли объект экземпляром указанного класса или его наследника.

```python
class Character:
    pass


character = Character()

print(isinstance(character, Character))  # True
print(isinstance(character, str))        # False
```

Для прикладных проверок `isinstance()` обычно полезнее, чем сравнение через `type(...) is ...`.

## Независимость экземпляров {#nezavisimost-ekzemplyarov}

Каждый экземпляр может хранить собственное состояние.

```python
class Character:
    pass


ork = Character()
elf = Character()

ork.name = "Ork"
elf.name = "Elf"

print(ork.name)  # Ork
print(elf.name)  # Elf
```

В Python атрибут можно добавить объекту после создания, но обычно начальное состояние задают централизованно через `__init__`. Это предотвращает появление частично заполненных объектов.

## Обращение к отсутствующему атрибуту {#obrashchenie-k-otsutstvuyushchemu-atributu}

Если атрибут не был создан, Python вызовет `AttributeError`.

```python
class Character:
    pass


character = Character()
print(character.name)

# AttributeError: 'Character' object has no attribute 'name'
```

Поэтому обязательные атрибуты нужно создавать при инициализации экземпляра.

## Класс как фабрика объектов {#klass-kak-fabrika-obektov}

Вызов класса создает новый экземпляр:

```python
first = Character()
second = Character()
third = Character()
```

Каждый вызов `Character()` возвращает новый объект. В следующей части конструктор будет принимать параметры и создавать экземпляры с разным начальным состоянием.

## Частые ошибки {#chastye-oshibki}

1. Путать класс и экземпляр.
   `Character` - класс, `Character()` - новый объект.

2. Забыть круглые скобки при создании объекта.

```python
character_class = Character
character_object = Character()
```

3. Ожидать, что два вызова класса вернут один объект.
   Каждый вызов создает новый экземпляр.

4. Проверять точный тип через `type()`, когда нужно учитывать наследников.
   Используй `isinstance()`.

5. Обращаться к атрибуту до его создания.
   Обязательное состояние задавай через `__init__`.

## Практические задачи {#prakticheskie-zadachi}

### Задача 1 {#zadacha-1}

Создай пустой класс `Book`, затем два его экземпляра. Проверь их тип и убедись, что это разные объекты.

### Задача 2 {#zadacha-2}

Проверь с помощью `isinstance()`, являются ли строка, список и созданный `Book` экземплярами ожидаемых классов.

### Задача 3 {#zadacha-3}

Сохрани класс `Book` в другую переменную и создай экземпляр через эту переменную.

## Краткая шпаргалка {#kratkaya-shpargalka}

```python
class Character:
    pass


character = Character()

type(Character)                   # type
type(character)                   # Character
isinstance(character, Character)  # True
character is Character()          # False
```

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Classes', href: 'https://docs.python.org/3/tutorial/classes.html' },
        { title: 'Python: type()', href: 'https://docs.python.org/3/library/functions.html#type' },
        { title: 'Python: isinstance()', href: 'https://docs.python.org/3/library/functions.html#isinstance' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Обзор классов', href: '/python/yazyk-python/klassy/klassy-glavnaya' },
        { title: 'Инициализация и методы', href: '/python/yazyk-python/klassy/init-self-atributy-i-metody' },
        { title: 'Основы синтаксиса', href: '/python/yazyk-python/1-core/osnovy-sintaksisa-i-peremennye' },
        { title: 'Основные функции', href: '/python/yazyk-python/1-core/osnovnye-funktsii' },
    ]"
/>
