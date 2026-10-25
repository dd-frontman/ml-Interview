---
title: "Property, super и переопределение"
description: "Четвертая часть урока о классах Python: вычисляемые свойства property, вызов родителя через super и расширение методов дочернего класса."
tags:
  - "python"
  - "core"
  - "classes"
  - "property"
updatedAt: "2026-09-02"
---
## Зачем нужен `super()` {#zachem-nuzhen-super}

При переопределении дочерний класс иногда должен дополнить родительское поведение, а не заменить его полностью. `super()` предоставляет доступ к следующему классу в порядке поиска методов.

```python
class Character:
    def attack(self) -> str:
        return "Basic attack"


class Elf(Character):
    def attack(self) -> str:
        base_message = super().attack()
        return f"{base_message} with a bow"
```

```python
elf = Elf()
print(elf.attack())
# Basic attack with a bow
```

`super().attack()` вызывает родительскую реализацию, а затем `Elf` дополняет результат.

## `super()` в `__init__` {#super-v-init}

Если дочерний класс объявляет собственный `__init__`, родительский конструктор автоматически не выполняется.

```python
class Character:
    def __init__(self, *, name: str) -> None:
        self.name = name


class Elf(Character):
    def __init__(self, *, name: str, arrows: int) -> None:
        super().__init__(name=name)
        self.arrows = arrows
```

```python
elf = Elf(name="Legolas", arrows=20)

print(elf.name)    # Legolas
print(elf.arrows)  # 20
```

Без `super().__init__(name=name)` атрибут `self.name` не был бы создан.

Не нужно передавать `self` вручную:

```python
super().__init__(name=name)        # правильно
super().__init__(self, name=name)  # ошибка
```

## Что такое `@property` {#chto-takoe-at-property}

`@property` превращает метод без дополнительных аргументов в вычисляемый атрибут.

```python
class Character:
    base_health_points = 100

    def __init__(self, *, level: int) -> None:
        self.level = level

    @property
    def max_health_points(self) -> int:
        return self.base_health_points * self.level
```

Свойство используется без круглых скобок:

```python
character = Character(level=2)

print(character.max_health_points)  # 200
```

`@property` не обязателен для самого вычисления. Без декоратора `max_health_points` останется обычным методом:

```python
class Character:
    base_health_points = 100

    def __init__(self, *, level: int) -> None:
        self.level = level

    def max_health_points(self) -> int:
        return self.base_health_points * self.level
```

Обычный метод нужно вызывать с круглыми скобками:

```python
character = Character(level=2)

print(character.max_health_points())  # 200
```

Если забыть скобки, получится объект метода, а не рассчитанное число:

```python
print(character.max_health_points)
# <bound method Character.max_health_points ...>

healing = character.max_health_points / 2
# TypeError: метод нельзя разделить на число
```

Таким образом, оба варианта умеют вычислять актуальное значение:

```python
character.max_health_points    # свойство с @property
character.max_health_points()  # обычный метод без @property
```

Декоратор меняет способ обращения к методу. Он полезен здесь потому, что максимальное здоровье воспринимается как характеристика персонажа, а не как действие:

```python
character.max_health_points  # характеристика
character.attack()           # действие
```

Есть и третий вариант - один раз сохранить число в `__init__`:

```python
self.max_health_points = self.base_health_points * self.level
```

Но такое значение само не обновится после изменения `level`. Обычный метод и свойство выполняют вычисление заново при каждом обращении.

Так писать нельзя:

```python
character.max_health_points()
# TypeError: 'int' object is not callable
```

Сначала свойство вернуло число, после чего код попытался вызвать это число как функцию.

## Вычисление из актуального состояния {#vychislenie-iz-aktualnogo-sostoyaniya}

Свойство выполняется при каждом обращении. Повторный расчет обеспечивает код метода, а `@property` позволяет обращаться к результату без круглых скобок.

```python
character = Character(level=2)
print(character.max_health_points)  # 200

character.level = 3
print(character.max_health_points)  # 300
```

Если бы максимальное здоровье один раз вычислялось в `__init__`, оно осталось бы равным `200`. Свойство подходит для зависимых характеристик, которые должны отражать текущее состояние.

## Свойство только для чтения {#svoystvo-tolko-dlya-chteniya}

Если объявлен только getter с `@property`, присвоить значение напрямую нельзя.

```python
character.max_health_points = 500
# AttributeError: property 'max_health_points' has no setter
```

Это полезно: пользователь класса не сможет записать значение, противоречащее уровню.

Если значение действительно должно изменяться присваиванием, можно добавить setter:

```python
class Temperature:
    def __init__(self, celsius: float) -> None:
        self._celsius = celsius

    @property
    def celsius(self) -> float:
        return self._celsius

    @celsius.setter
    def celsius(self, value: float) -> None:
        if value < -273.15:
            raise ValueError("Temperature is below absolute zero")

        self._celsius = value
```

Для вычисляемого максимального здоровья setter не нужен.

## Переопределение свойства {#pereopredelenie-svoystva}

Свойство переопределяется так же, как обычный метод.

```python
class Character:
    base_defence = 10

    def __init__(self, *, level: int, health_points: int) -> None:
        self.level = level
        self.health_points = health_points

    @property
    def defence(self) -> int:
        return self.base_defence * self.level


class Ork(Character):
    @property
    def defence(self) -> int:
        defence = super().defence

        if self.health_points < 50:
            defence *= 3

        return min(defence, 90)
```

У родительского свойства значение читается без круглых скобок:

```python
super().defence  # правильно
super().defence()  # TypeError, потому что defence уже вернул int
```

## Почему защита ограничена {#pochemu-zashchita-ogranichena}

Допустим, урон рассчитывается так:

```python
actual_damage = damage * (100 - defence) / 100
```

При `defence = 120` получится отрицательный урон:

```text
damage * (100 - 120) / 100
damage * -0.2
```

Вычитание отрицательного урона увеличит здоровье. Поэтому значение ограничивается, например, до `90`:

```python
return min(defence, 90)
```

Ограничение относится к правилам конкретной игры, а не к механике Python.

## Обычный метод или свойство {#obychnyy-metod-ili-svoystvo}

Используй `@property`, если значение воспринимается как характеристика объекта:

```python
character.max_health_points
character.health_percent
character.defence
```

Используй метод, если выполняется действие:

```python
character.attack(target=enemy)
character.take_damage(damage=20)
character.level_up()
```

Свойство не должно выполнять тяжелую операцию, сетевой запрос или неожиданно менять объект. Внешне оно выглядит как обычное чтение атрибута.

## Изменение нескольких связанных значений {#izmenenie-neskolkikh-svyazannykh-znacheniy}

Метод подходит, когда одно действие должно согласованно обновить несколько атрибутов.

```python
class Character:
    max_level = 3
    base_health_points = 100

    def __init__(self, *, level: int) -> None:
        self.level = level
        self.health_points = self.max_health_points

    @property
    def max_health_points(self) -> int:
        return self.base_health_points * self.level

    def level_up(self) -> bool:
        if self.level >= self.max_level:
            return False

        self.level += 1
        healing = self.max_health_points // 2
        self.health_points = min(
            self.health_points + healing,
            self.max_health_points,
        )

        return True
```

Порядок важен:

1. проверить ограничение;
2. увеличить уровень;
3. вычислить новое максимальное здоровье;
4. восстановить половину нового максимума;
5. не превысить максимум.

## Порядок поиска методов {#poryadok-poiska-metodov}

`super()` не обязательно означает «прямой родитель». Он продолжает поиск по MRO - порядку разрешения методов.

Для простой цепочки:

```python
class Character:
    pass


class Ork(Character):
    pass
```

порядок можно посмотреть так:

```python
print(Ork.mro())
# [<class '__main__.Ork'>, <class '__main__.Character'>, <class 'object'>]
```

В одиночном наследовании `super()` обычно приводит к ожидаемому родителю. MRO становится особенно важен при множественном наследовании.

## Частые ошибки {#chastye-oshibki}

1. Объявить дочерний `__init__` и забыть вызвать родительский.
2. Передавать `self` в `super()` вручную.
3. Вызывать свойство с круглыми скобками.
4. Выполнять внутри свойства действие с побочными эффектами.
5. Хранить вычисляемое значение и забывать обновлять его.
6. Допускать недопустимые значения вычисляемой характеристики.
7. Дублировать родительский код вместо вызова `super()`.

## Практические задачи {#prakticheskie-zadachi}

### Задача 1 {#zadacha-1}

Добавь персонажу свойства `max_health_points` и `health_percent`, вычисляемые из уровня и текущего здоровья.

### Задача 2 {#zadacha-2}

Переопредели свойство защиты орка: при здоровье ниже половины оно должно утраиваться, но не превышать `90`.

### Задача 3 {#zadacha-3}

Реализуй `level_up()`, который ограничивает уровень значением `3` и восстанавливает половину нового максимального здоровья.

## Краткая шпаргалка {#kratkaya-shpargalka}

```python
class Parent:
    def __init__(self, value: int) -> None:
        self.value = value

    @property
    def doubled(self) -> int:
        return self.value * 2


class Child(Parent):
    def __init__(self, value: int, name: str) -> None:
        super().__init__(value)
        self.name = name

    @property
    def doubled(self) -> int:
        return super().doubled + 1
```

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python: super()', href: 'https://docs.python.org/3/library/functions.html#super' },
        { title: 'Python: property()', href: 'https://docs.python.org/3/library/functions.html#property' },
        { title: 'Python Tutorial: Method objects', href: 'https://docs.python.org/3/tutorial/classes.html#method-objects' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Наследование и полиморфизм', href: '/python/yazyk-python/klassy/nasledovanie-i-polimorfizm' },
        { title: 'Практика: игровые персонажи', href: '/python/yazyk-python/klassy/praktika-igrovye-personazhi' },
        { title: 'Обработка исключений', href: '/python/yazyk-python/1-core/obrabotka-isklyucheniy-try-except' },
        { title: 'Изменяемые типы', href: '/python/yazyk-python/tipy-dannykh/izmenyaemye-tipy' },
    ]"
/>
