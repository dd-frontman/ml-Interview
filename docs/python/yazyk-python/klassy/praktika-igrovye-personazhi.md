---
title: "Практика ООП: игровые персонажи"
description: "Пятая часть урока о классах Python: цельный пример Character, Ork и Elf, расчет урона, свойства, бой и повышение уровня."
tags:
  - "python"
  - "core"
  - "classes"
  - "practice"
updatedAt: "2026-08-20"
---
## Условие задачи {#uslovie-zadachi}

Нужно реализовать модель боя персонажей.

Общие правила:

- у каждого персонажа есть уровень, здоровье, атака и защита;
- персонаж может атаковать другого персонажа;
- получаемый урон уменьшается защитой;
- бой продолжается, пока оба персонажа живы;
- победитель получает новый уровень;
- максимальный уровень равен `3`;
- при повышении уровня восстанавливается половина нового максимального здоровья.

Различия персонажей:

- орк имеет больше здоровья и усиливает защиту при низком здоровье;
- эльф имеет более сильную атаку и наносит дополнительный урон ослабленной цели.

## Проектирование базового класса {#proektirovanie-bazovogo-klassa}

В `Character` размещается поведение, общее для всех персонажей:

- проверка уровня;
- вычисление характеристик;
- обычная атака;
- получение урона;
- проверка жизни;
- повышение уровня;
- строковое представление.

Дочерние классы задают базовые характеристики и переопределяют только особое поведение.

## Реализация `Character` {#realizatsiya-character}

```python
from __future__ import annotations


class Character:
    max_level = 3
    character_name = "Character"
    base_health_points = 1
    base_attack_power = 1
    base_defence = 0

    def __init__(self, *, level: int) -> None:
        if not 1 <= level <= self.max_level:
            raise ValueError("Invalid character level")

        self.level = level
        self.health_points = self.max_health_points

    @property
    def max_health_points(self) -> int:
        return self.base_health_points * self.level

    @property
    def attack_power(self) -> int:
        return self.base_attack_power * self.level

    @property
    def defence(self) -> int:
        return min(self.base_defence * self.level, 90)

    @property
    def health_percent(self) -> float:
        return 100 * self.health_points / self.max_health_points

    def attack(self, *, target: Character) -> None:
        target.take_damage(damage=self.attack_power)

    def take_damage(self, *, damage: int) -> None:
        actual_damage = round(
            damage * (100 - self.defence) / 100
        )
        self.health_points -= actual_damage

    def is_alive(self) -> bool:
        return self.health_points > 0

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

    def __str__(self) -> str:
        return (
            f"{self.character_name} "
            f"(level: {self.level}, hp: {self.health_points})"
        )
```

## Почему характеристики сделаны свойствами {#pochemu-kharakteristiki-sdelany-svoystvami}

`max_health_points`, `attack_power` и `defence` зависят от уровня. Они пересчитываются при каждом обращении.

```python
character.level = 2
print(character.attack_power)
```

Если записать силу атаки только в `__init__`, после `level_up()` она останется старой. Свойство устраняет риск рассинхронизации.

Текущее `health_points` остается обычным атрибутом, потому что оно изменяется независимо при каждом ударе.

## Расчет получаемого урона {#raschet-poluchaemogo-urona}

Формула:

```python
actual_damage = damage * (100 - defence) / 100
```

При атаке `20` и защите `15`:

```text
20 * (100 - 15) / 100 = 17
```

`round()` превращает результат в целое число. Защита ограничена значением `90`, чтобы итоговый урон не стал отрицательным.

## Реализация орка {#realizatsiya-orka}

```python
class Ork(Character):
    character_name = "Ork"
    base_health_points = 100
    base_attack_power = 10
    base_defence = 15

    @property
    def defence(self) -> int:
        defence = super().defence

        if self.health_percent < 50:
            defence *= 3

        return min(defence, 90)
```

Орк получает базовую защиту из `Character` через `super().defence`. При здоровье ниже половины защита утраивается.

В условии используется процент, а не абсолютное значение `50`. Это сохраняет смысл правила на разных уровнях.

## Реализация эльфа {#realizatsiya-elfa}

```python
class Elf(Character):
    character_name = "Elf"
    base_health_points = 50
    base_attack_power = 15
    base_defence = 10

    def attack(self, *, target: Character) -> None:
        damage = self.attack_power

        if target.health_percent < 30:
            damage *= 2

        target.take_damage(damage=damage)
```

Эльф переопределяет `attack()`, но сохраняет ту же сигнатуру, что и `Character.attack()`. Поэтому функция боя может работать со всеми персонажами одинаково.

Множитель `2` соответствует правилу «бить в два раза сильнее». Если условие задачи требует тройной урон, достаточно заменить его на `damage *= 3`.

## Функция боя {#funktsiya-boya}

```python
def fight(
    *,
    first: Character,
    second: Character,
) -> Character:
    if not first.is_alive() or not second.is_alive():
        raise ValueError("Both characters must be alive")

    while first.is_alive() and second.is_alive():
        first.attack(target=second)

        if second.is_alive():
            second.attack(target=first)

    winner = first if first.is_alive() else second
    winner.level_up()

    return winner
```

Порядок боя:

1. проверить начальное состояние персонажей;
2. первый персонаж атакует второго;
3. второй отвечает только в том случае, если выжил;
4. цикл завершается после смерти одного персонажа;
5. определяется победитель;
6. победитель повышает уровень;
7. функция возвращает объект победителя.

Проверка `if second.is_alive()` важна: мертвый персонаж не должен наносить ответный удар.

## Запуск боя {#zapusk-boya}

```python
ork = Ork(level=1)
elf = Elf(level=1)

winner = fight(first=ork, second=elf)

print(f"Winner: {winner}")
print(f"Ork is {'alive' if ork.is_alive() else 'dead'}: {ork}")
print(f"Elf is {'alive' if elf.is_alive() else 'dead'}: {elf}")
```

Тернарное выражение выбирает строку `alive` или `dead`:

```python
"alive" if ork.is_alive() else "dead"
```

Оно подходит для короткого выбора значения. Более сложную логику лучше записывать обычным `if`.

## Как работает `level_up()` {#kak-rabotaet-level-up}

```python
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

Сначала уровень увеличивается. Поэтому `self.max_health_points` уже возвращает максимум для нового уровня.

`min(...)` не позволяет лечению поднять здоровье выше нового максимума.

Возвращаемое логическое значение сообщает вызывающему коду, произошло ли повышение:

```python
if winner.level_up():
    print("New level received")
else:
    print("Maximum level reached")
```

В текущем `fight()` результат не используется, но контракт метода остается явным.

## Полиморфизм в примере {#polimorfizm-v-primere}

Типы параметров `first` и `second` указаны как `Character`:

```python
def fight(*, first: Character, second: Character) -> Character:
```

При этом можно передавать `Ork`, `Elf` и будущих наследников. `fight()` использует общий интерфейс:

- `is_alive()`;
- `attack()`;
- `level_up()`.

Особые правила находятся внутри дочерних классов, поэтому в `fight()` нет цепочки `if isinstance(character, Ork)`.

## Возможные улучшения модели {#vozmozhnye-uluchsheniya-modeli}

По мере развития задачи можно добавить:

- случайный порядок первого хода;
- счетчик раундов;
- ничью или ограничение количества раундов;
- отдельные объекты оружия;
- эффекты лечения и усиления;
- журнал событий вместо `print()` внутри модели;
- абстрактный базовый класс, запрещающий создавать обычный `Character`.

Добавляй эти возможности только при появлении соответствующих требований.

## Частые ошибки {#chastye-oshibki}

1. Дублировать общие методы в `Ork` и `Elf`.
2. Не проверять, жив ли второй персонаж перед ответной атакой.
3. Повышать уровень проигравшего из-за неверного условия.
4. Сначала вычислять лечение, а затем увеличивать уровень.
5. Не ограничивать максимальный уровень.
6. Хранить атаку как старое значение после изменения уровня.
7. Допускать защиту выше 100 процентов.
8. Смешивать вывод в консоль с основной логикой каждого метода.

## Практические задачи {#prakticheskie-zadachi}

### Задача 1 {#zadacha-1}

Добавь `Mage`, который наносит двойной урон персонажам с защитой выше `30`.

### Задача 2 {#zadacha-2}

Измени `fight()`, чтобы она возвращала кортеж из победителя и количества раундов.

### Задача 3 {#zadacha-3}

Запрети бой персонажа с самим собой.

### Задача 4 {#zadacha-4}

Добавь ничью после 100 раундов, чтобы функция гарантированно завершалась при слишком высокой защите обоих персонажей.

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Classes', href: 'https://docs.python.org/3/tutorial/classes.html' },
        { title: 'Python Tutorial: Inheritance', href: 'https://docs.python.org/3/tutorial/classes.html#inheritance' },
        { title: 'Python: property()', href: 'https://docs.python.org/3/library/functions.html#property' },
        { title: 'Python: super()', href: 'https://docs.python.org/3/library/functions.html#super' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Обзор классов', href: '/python/yazyk-python/klassy/klassy-glavnaya' },
        { title: 'Наследование и полиморфизм', href: '/python/yazyk-python/klassy/nasledovanie-i-polimorfizm' },
        { title: 'Property и super', href: '/python/yazyk-python/klassy/property-super-i-pereopredelenie' },
        { title: 'Обработка исключений', href: '/python/yazyk-python/1-core/obrabotka-isklyucheniy-try-except' },
    ]"
/>
