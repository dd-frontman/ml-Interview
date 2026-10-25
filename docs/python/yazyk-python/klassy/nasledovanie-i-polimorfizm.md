---
title: "Наследование и полиморфизм"
description: "Третья часть урока о классах Python: базовые и дочерние классы, наследование атрибутов и методов, переопределение и полиморфизм."
tags:
  - "python"
  - "core"
  - "classes"
  - "inheritance"
updatedAt: "2026-08-20"
---
## Зачем нужно наследование {#zachem-nuzhno-nasledovanie}

Наследование позволяет вынести общие данные и поведение нескольких классов в базовый класс.

Допустим, орк и эльф должны хранить уровень и здоровье, атаковать, получать урон и проверять, живы ли они. Независимые реализации будут повторять один код.

```python
class Ork:
    def is_alive(self) -> bool:
        return self.health_points > 0


class Elf:
    def is_alive(self) -> bool:
        return self.health_points > 0
```

Общую логику лучше перенести в `Character`.

```python
class Character:
    def is_alive(self) -> bool:
        return self.health_points > 0


class Ork(Character):
    pass


class Elf(Character):
    pass
```

В скобках после имени дочернего класса указывается родитель.

## Что наследует дочерний класс {#chto-nasleduet-docherniy-klass}

Дочерний класс получает доступ к:

- методам родительского класса;
- атрибутам класса;
- `__init__`, если не объявляет собственный;
- специальным методам, например `__str__`.

```python
class Character:
    max_level = 3

    def __init__(self, *, level: int) -> None:
        self.level = level

    def __str__(self) -> str:
        return f"level: {self.level}"


class Ork(Character):
    pass
```

```python
ork = Ork(level=1)

print(ork.max_level)  # 3
print(ork)            # level: 1
```

Хотя объект создается через `Ork(...)`, Python использует унаследованный `Character.__init__`.

## Общий алгоритм и разные настройки {#obshchiy-algoritm-i-raznye-nastroyki}

Родитель может содержать алгоритм, а наследники - отличающиеся настройки в атрибутах класса.

```python
class Character:
    def __init__(self, *, level: int) -> None:
        self.level = level
        self.health_points = self.base_health_points * level
        self.attack_power = self.base_attack_power * level


class Ork(Character):
    character_name = "Ork"
    base_health_points = 100
    base_attack_power = 10


class Elf(Character):
    character_name = "Elf"
    base_health_points = 50
    base_attack_power = 15
```

При создании `Ork` параметр `self` внутри `Character.__init__` ссылается на фактический объект `Ork`. Поэтому `self.base_health_points` находится в классе `Ork`.

```python
ork = Ork(level=2)
elf = Elf(level=2)

print(ork.health_points)  # 200
print(elf.health_points)  # 100
```

Базовый класс предполагает, что наследники зададут необходимые характеристики. Если их нет, обращение вызовет `AttributeError`.

## Переопределение метода {#pereopredelenie-metoda}

Дочерний класс может объявить метод с тем же именем и заменить родительскую реализацию.

```python
class Character:
    def attack(self) -> str:
        return "Character attacks"


class Elf(Character):
    def attack(self) -> str:
        return "Elf shoots an arrow"
```

```python
character = Character()
elf = Elf()

print(character.attack())  # Character attacks
print(elf.attack())        # Elf shoots an arrow
```

Python выбирает метод по фактическому классу объекта.

## Совместимость сигнатур {#sovmestimost-signatur}

Переопределенный метод должен принимать совместимые аргументы и возвращать ожидаемый результат.

```python
class Character:
    def attack(self, *, target: "Character") -> None:
        target.health_points -= 10


class Elf(Character):
    def attack(self, *, target: "Character") -> None:
        target.health_points -= 20
```

Если `Elf.attack()` внезапно потребует другой обязательный аргумент, общий код перестанет работать с эльфом.

## Полиморфизм {#polimorfizm}

Полиморфизм - возможность работать с объектами разных классов через общий интерфейс.

```python
class Character:
    def __init__(self, *, health_points: int) -> None:
        self.health_points = health_points

    def is_alive(self) -> bool:
        return self.health_points > 0


class Ork(Character):
    pass


class Elf(Character):
    pass
```

Одна функция принимает любого наследника `Character`:

```python
def print_status(character: Character) -> None:
    print(character.health_points)
    print(character.is_alive())


print_status(Ork(health_points=100))
print_status(Elf(health_points=50))
```

Функции не нужно проверять `type(character)`. Ей важно наличие ожидаемого состояния и методов.

## Полиморфный вызов метода {#polimorfnyy-vyzov-metoda}

Один и тот же вызов может приводить к разному поведению.

```python
class Character:
    def attack(self) -> str:
        return "Basic attack"


class Ork(Character):
    def attack(self) -> str:
        return "Ork attacks with an axe"


class Elf(Character):
    def attack(self) -> str:
        return "Elf shoots an arrow"


characters: list[Character] = [Ork(), Elf()]

for character in characters:
    print(character.attack())
```

Для орка Python вызовет `Ork.attack()`, а для эльфа - `Elf.attack()`, если методы переопределены. Иначе будет использована реализация `Character.attack()`.

## Проверка наследования {#proverka-nasledovaniya}

`isinstance()` учитывает родительские классы.

```python
class Character:
    pass


class Ork(Character):
    pass


ork = Ork()

print(isinstance(ork, Ork))        # True
print(isinstance(ork, Character))  # True
```

`issubclass()` проверяет отношение между классами:

```python
print(issubclass(Ork, Character))  # True
print(issubclass(Elf, Character))  # True
```

## Ссылки вперед в аннотациях {#ssylki-vpered-v-annotatsiyakh}

Метод класса может принимать другой объект того же класса. Пока тело класса не завершено, имя еще не готово для обычной аннотации в старых версиях Python.

```python
class Character:
    def attack(self, *, target: "Character") -> None:
        target.health_points -= 10
```

`"Character"` - строковая ссылка вперед.

Можно включить отложенную обработку аннотаций:

```python
from __future__ import annotations


class Character:
    def attack(self, *, target: Character) -> None:
        target.health_points -= 10
```

## Когда наследование подходит {#kogda-nasledovanie-podkhodit}

Наследование полезно, если дочерний класс действительно является частным случаем родительского:

- `Ork` является `Character`;
- `AdminUser` является `User`;
- `CsvExporter` является `Exporter`.

Если отношение звучит как «содержит» или «использует», чаще нужна композиция:

```python
class Character:
    def __init__(self, weapon: Weapon) -> None:
        self.weapon = weapon
```

Персонаж использует оружие, но не является оружием.

## Частые ошибки {#chastye-oshibki}

1. Использовать наследование только ради повторного использования одной функции.
2. Полностью копировать родительский код в дочерний класс.
3. Менять сигнатуру переопределенного метода несовместимым образом.
4. Проверять каждый дочерний тип через цепочку `if type(...)`.
5. Создавать глубокую иерархию, в которой сложно найти реализацию метода.
6. Путать отношение «является» с отношением «содержит».

## Практические задачи {#prakticheskie-zadachi}

### Задача 1 {#zadacha-1}

Создай базовый класс `Animal` с методом `speak()`. Переопредели его в классах `Dog` и `Cat`.

### Задача 2 {#zadacha-2}

Создай список разных животных и вызови `speak()` в одном цикле без проверки их типа.

### Задача 3 {#zadacha-3}

Добавь базовый класс `Character` и наследников `Ork`, `Elf`, которые задают разные базовые характеристики через атрибуты класса.

## Краткая шпаргалка {#kratkaya-shpargalka}

```python
class Parent:
    def method(self) -> str:
        return "parent"


class Child(Parent):
    def method(self) -> str:
        return "child"


child = Child()

isinstance(child, Child)    # True
isinstance(child, Parent)   # True
issubclass(Child, Parent)   # True
```

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Inheritance', href: 'https://docs.python.org/3/tutorial/classes.html#inheritance' },
        { title: 'Python: isinstance()', href: 'https://docs.python.org/3/library/functions.html#isinstance' },
        { title: 'Python: issubclass()', href: 'https://docs.python.org/3/library/functions.html#issubclass' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Инициализация и методы', href: '/python/yazyk-python/klassy/init-self-atributy-i-metody' },
        { title: 'Property и super', href: '/python/yazyk-python/klassy/property-super-i-pereopredelenie' },
        { title: 'Практика: игровые персонажи', href: '/python/yazyk-python/klassy/praktika-igrovye-personazhi' },
        { title: 'Typing для Python и ML', href: '/python/yazyk-python/typing-dlya-python-i-ml' },
    ]"
/>
