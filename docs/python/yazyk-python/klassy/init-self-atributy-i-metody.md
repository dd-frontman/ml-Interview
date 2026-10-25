---
title: "__init__, self, атрибуты и методы"
description: "Вторая часть урока о классах Python: инициализация экземпляра, self, атрибуты объекта и класса, методы, __str__ и изменение состояния."
tags:
  - "python"
  - "core"
  - "classes"
  - "methods"
updatedAt: "2026-09-01"
---
## Инициализация объекта {#initsializatsiya-obekta}

Метод `__init__` вызывается после создания экземпляра и задает его начальное состояние.

```python
class Character:
    def __init__(self, name: str, level: int) -> None:
        self.name = name
        self.level = level


ork = Character("Ork", 2)

print(ork.name)   # Ork
print(ork.level)  # 2
```

При вызове `Character("Ork", 2)` Python:

1. создает новый экземпляр;
2. передает его в `__init__` как `self`;
3. передает остальные аргументы в `name` и `level`;
4. выполняет тело `__init__`;
5. возвращает готовый экземпляр.

`__init__` инициализирует уже созданный объект. За непосредственное создание отвечает другой специальный метод `__new__`, который в обычных классах переопределять не требуется.

## Что такое `self` {#chto-takoe-self}

`self` - ссылка на экземпляр, для которого выполняется метод.

```python
class Character:
    def __init__(self, name: str) -> None:
        self.name = name

    def introduce(self) -> str:
        return f"I am {self.name}"
```

При обычном вызове Python передает экземпляр автоматически:

```python
ork = Character("Ork")

print(ork.introduce())  # I am Ork
```

Этот вызов примерно эквивалентен записи:

```python
Character.introduce(ork)
```

Если вызвать метод через класс без объекта, `self` не будет передан:

```python
Character.introduce()
# TypeError: missing 1 required positional argument: 'self'
```

`self` не является ключевым словом Python, но это обязательное соглашение кодстайла.

## Атрибуты экземпляра {#atributy-ekzemplyara}

Запись `self.name = name` создает атрибут конкретного экземпляра.

```python
class Character:
    def __init__(self, name: str, health_points: int) -> None:
        self.name = name
        self.health_points = health_points


ork = Character("Ork", 100)
elf = Character("Elf", 50)

ork.health_points -= 20

print(ork.health_points)  # 80
print(elf.health_points)  # 50
```

Изменение одного экземпляра не затрагивает второй.

Параметр и атрибут могут иметь одинаковое имя, потому что это разные переменные:

```python
def __init__(self, level: int) -> None:
    self.level = level
```

- `level` - входной параметр метода;
- `self.level` - значение, сохраненное внутри объекта.

## Проверка данных в `__init__` {#proverka-dannykh-v-init}

Конструктор может запретить создание объекта в некорректном состоянии.

```python
class Character:
    def __init__(self, *, name: str, level: int) -> None:
        if not name.strip():
            raise ValueError("Name cannot be empty")

        if level < 1:
            raise ValueError("Level must be positive")

        self.name = name
        self.level = level
```

Теперь любой созданный `Character` гарантированно имеет имя и положительный уровень.

## Keyword-only параметры {#keyword-only-parametry}

Звездочка в сигнатуре запрещает передавать следующие аргументы позиционно.

```python
class Character:
    def __init__(self, *, name: str, level: int) -> None:
        self.name = name
        self.level = level
```

```python
Character(name="Ork", level=2)  # правильно
Character("Ork", 2)            # TypeError
```

Это полезно, если у конструктора несколько похожих параметров и их порядок легко перепутать.

## Атрибуты класса {#atributy-klassa}

Атрибут класса объявляется непосредственно в теле класса и принадлежит самому классу, а не отдельному объекту.

Атрибуты класса нужны для значений, которые:

- являются общими для всех экземпляров;
- описывают правило или настройку целого класса;
- должны быть доступны даже без создания объекта;
- могут переопределяться в дочерних классах.

Например, максимальный уровень - общее правило для всех персонажей. Нет необходимости записывать одинаковое значение в каждый объект.

```python
class Character:
    max_level = 3

    def __init__(self, *, name: str, level: int) -> None:
        self.name = name
        self.level = level
```

Значение доступно через класс и его экземпляры:

```python
ork = Character(name="Ork", level=1)
elf = Character(name="Elf", level=2)

print(Character.max_level)  # 3
print(ork.max_level)        # 3
print(elf.max_level)        # 3
```

Здесь `max_level` относится ко всему классу `Character`, а `name` и `level` относятся к конкретным персонажам:

| Атрибут | Где хранится | Пример значения |
| --- | --- | --- |
| `Character.max_level` | в классе | общее ограничение `3` |
| `ork.name` | в экземпляре `ork` | `"Ork"` |
| `elf.name` | в экземпляре `elf` | `"Elf"` |
| `ork.level` | в экземпляре `ork` | текущий уровень `1` |

Обращаться к общему правилу понятнее через имя класса:

```python
if ork.level < Character.max_level:
    ork.level += 1
```

Атрибут класса также позволяет дочерним классам задавать разные настройки при сохранении общего алгоритма:

```python
from typing import ClassVar


class Character:
    base_health_points: ClassVar[int]

    def __init__(self, *, level: int) -> None:
        self.level = level
        self.health_points = self.base_health_points * level


class Ork(Character):
    base_health_points = 100


class Elf(Character):
    base_health_points = 50
```

Аннотация `ClassVar[int]` сообщает, что `Character.__init__()` ожидает целочисленную настройку класса. Само значение предоставляют наследники.

При вызове `Ork(level=2)` происходит следующее:

1. Python создает экземпляр `Ork`.
2. Унаследованный `Character.__init__()` получает этот объект в `self`.
3. Для `self.base_health_points` Python ищет значение в экземпляре, затем в классе `Ork` и находит `100`.
4. Выражение `100 * 2` записывается в атрибут экземпляра `self.health_points`.

```python
ork = Ork(level=2)

print(ork.base_health_points)  # 100, найдено в классе Ork
print(ork.health_points)       # 200, хранится в экземпляре ork
print(ork.__dict__)
# {'level': 2, 'health_points': 200}
```

`base_health_points` не передается в `__init__`, потому что это общая настройка вида персонажа. В `__init__` передается только индивидуальный уровень. Значение класса не копируется в экземпляр, но доступно через него благодаря правилам поиска атрибутов.

Не стоит использовать атрибут класса для индивидуального изменяемого состояния:

```python
class Character:
    health_points = 100  # Плохое место для текущего здоровья
```

Текущее здоровье каждого персонажа изменяется независимо, поэтому его нужно создавать через `self.health_points` в `__init__`.

Python сначала ищет атрибут в экземпляре, затем в классе.

```python
ork.max_level = 5

print(ork.max_level)        # 5
print(elf.max_level)        # 3
print(Character.max_level)  # 3
```

Присваивание создало у `ork` собственный атрибут, который скрыл значение класса.

## Опасность изменяемого атрибута класса {#opasnost-izmenyaemogo-atributa-klassa}

Список или словарь в атрибуте класса будет общим для всех экземпляров.

```python
class Team:
    members = []


first_team = Team()
second_team = Team()

first_team.members.append("Alice")

print(second_team.members)  # ['Alice']
```

Для независимого состояния коллекцию нужно создавать в `__init__`:

```python
class Team:
    def __init__(self) -> None:
        self.members: list[str] = []
```

## Методы экземпляра {#metody-ekzemplyara}

Метод - функция, объявленная внутри класса. Он может читать и изменять состояние объекта.

```python
class Character:
    def __init__(self, *, health_points: int) -> None:
        self.health_points = health_points

    def take_damage(self, *, damage: int) -> None:
        self.health_points -= damage

    def is_alive(self) -> bool:
        return self.health_points > 0
```

```python
character = Character(health_points=100)
character.take_damage(damage=30)

print(character.health_points)  # 70
print(character.is_alive())     # True
```

`take_damage()` изменяет объект и возвращает `None`. `is_alive()` не изменяет состояние и возвращает результат проверки.

## `return` и `print()` в методе {#return-i-print-v-metode}

Если значение нужно использовать снаружи, метод должен вернуть его через `return`.

```python
class Character:
    def attack_message(self) -> str:
        return "Character attacks"


character = Character()
message = character.attack_message()
print(message)
```

Метод, который только печатает значение, возвращает `None`:

```python
class Character:
    def attack(self) -> None:
        print("Character attacks")


character = Character()
print(character.attack())
```

Результат:

```text
Character attacks
None
```

Первая строка выводится внутри метода, вторая появляется потому, что внешний `print()` получил `None`.

## Строковое представление `__str__` {#strokovoe-predstavlenie-str}

`__str__` определяет текст для `print(object)` и `str(object)`.

```python
class Character:
    def __init__(self, *, name: str, level: int, health_points: int) -> None:
        self.name = name
        self.level = level
        self.health_points = health_points

    def __str__(self) -> str:
        return f"{self.name} (level: {self.level}, hp: {self.health_points})"
```

```python
ork = Character(name="Ork", level=2, health_points=200)

print(ork)
# Ork (level: 2, hp: 200)
```

`__str__` обязан возвращать строку. `print()` внутри него не заменяет `return`.

## Связанные характеристики не обновляются сами {#svyazannye-kharakteristiki-ne-obnovlyayutsya-sami}

Значения, вычисленные в `__init__`, не пересчитываются при изменении исходного атрибута.

```python
class Character:
    def __init__(self, *, level: int) -> None:
        self.level = level
        self.health_points = 100 * level


ork = Character(level=2)
ork.level += 1

print(ork.level)          # 3
print(ork.health_points)  # 200, а не 300
```

Python не знает о связи уровня и здоровья. Для таких значений нужен отдельный метод обновления или вычисляемое свойство `@property`.

## Частые ошибки {#chastye-oshibki}

1. Забыть `self` в сигнатуре метода.

```python
class User:
    def show_name():          # неправильно
        print("Alice")

    def show_age(self):       # правильно
        print(25)
```

2. Обращаться к атрибуту без `self`.

```python
class User:
    def __init__(self, name: str) -> None:
        self.name = name

    def show_name_wrong(self) -> None:
        print(name)  # NameError

    def show_name(self) -> None:
        print(self.name)  # правильно
```

3. Вызывать метод через класс без экземпляра.

```python
user = User("Alice")

User.show_name()   # TypeError: не передан self
user.show_name()   # правильно
```

4. Возвращать результат `print()` вместо значения.

```python
def get_name_wrong(self) -> str:
    return print(self.name)  # возвращает None


def get_name(self) -> str:
    return self.name         # правильно
```

5. Хранить изменяемую коллекцию в атрибуте класса.

```python
class TeamWrong:
    members = []  # один список для всех объектов


class Team:
    def __init__(self) -> None:
        self.members = []  # отдельный список у каждого объекта
```

6. Ожидать автоматического пересчета связанных характеристик.

```python
class Character:
    def __init__(self, level: int) -> None:
        self.level = level
        self.health_points = 100 * level


character = Character(level=1)
character.level = 2
print(character.health_points)  # старое значение

# Пересчет нужно реализовать методом или @property.
```

7. Возвращать значение из `__init__`: он должен возвращать `None`.

```python
class Character:
    def __init__(self, name: str) -> None:
        self.name = name
        return self


Character("Ork")  # TypeError

# Правильно: ничего не возвращать явно.
```

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Class objects', href: 'https://docs.python.org/3/tutorial/classes.html#class-objects' },
        { title: 'Python Tutorial: Instance objects', href: 'https://docs.python.org/3/tutorial/classes.html#instance-objects' },
        { title: 'Python Data model: object.__init__', href: 'https://docs.python.org/3/reference/datamodel.html#object.__init__' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Класс и экземпляр', href: '/python/yazyk-python/klassy/klass-i-ekzemplyar' },
        { title: 'Наследование и полиморфизм', href: '/python/yazyk-python/klassy/nasledovanie-i-polimorfizm' },
        { title: 'Property и super', href: '/python/yazyk-python/klassy/property-super-i-pereopredelenie' },
        { title: 'Изменяемые типы', href: '/python/yazyk-python/tipy-dannykh/izmenyaemye-tipy' },
    ]"
/>
