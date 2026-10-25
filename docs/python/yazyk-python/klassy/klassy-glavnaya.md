---
title: "Классы в Python: обзор"
description: "Навигация по разделу о классах Python: экземпляры, __init__, self, атрибуты, методы, наследование, property, super и практика ООП."
tags:
  - "python"
  - "core"
  - "classes"
  - "oop"
updatedAt: "2026-08-20"
---
## Что изучаем {#chto-izuchaem}

Класс объединяет состояние объекта и действия, которые с этим состоянием связаны.

```python
class Character:
    def __init__(self, *, name: str, health_points: int) -> None:
        self.name = name
        self.health_points = health_points

    def is_alive(self) -> bool:
        return self.health_points > 0
```

Здесь объект персонажа хранит имя и здоровье, а метод `is_alive()` проверяет его текущее состояние.

## Порядок изучения {#poryadok-izucheniya}

1. [Класс и экземпляр](./klass-i-ekzemplyar.md)
   Разница между описанием типа и конкретным объектом, `class`, `pass`, `type()` и `isinstance()`.

2. [`__init__`, `self`, атрибуты и методы](./init-self-atributy-i-metody.md)
   Инициализация объекта, состояние экземпляра, атрибуты класса, методы и `__str__`.

3. [Наследование и полиморфизм](./nasledovanie-i-polimorfizm.md)
   Базовые и дочерние классы, наследование поведения, переопределение и общий интерфейс.

4. [`property`, `super()` и переопределение](./property-super-i-pereopredelenie.md)
   Вычисляемые свойства, вызов родительской реализации и безопасное изменение связанного состояния.

5. [Практика: игровые персонажи](./praktika-igrovye-personazhi.md)
   Цельная модель `Character`, `Ork`, `Elf`, получение урона, бой и повышение уровня.

## Основные термины {#osnovnye-terminy}

| Термин | Значение |
| --- | --- |
| Класс | описание структуры и поведения объектов |
| Экземпляр | конкретный объект, созданный из класса |
| Атрибут | значение, связанное с объектом или классом |
| Метод | функция, объявленная внутри класса |
| `self` | ссылка на текущий экземпляр |
| Наследование | получение поведения родительского класса |
| Переопределение | замена родительского метода в дочернем классе |
| Полиморфизм | работа с разными классами через общий интерфейс |
| Свойство | метод с `@property`, доступный как атрибут |

## Когда класс подходит {#kogda-klass-podkhodit}

Используй класс, если:

- несколько значений описывают одну сущность;
- состояние должно сохраняться между вызовами;
- действия тесно связаны с этим состоянием;
- нужно создавать несколько независимых объектов;
- существуют правила изменения состояния.

Примеры подходящих сущностей:

- пользователь;
- банковский счет;
- игровой персонаж;
- заказ;
- конфигурация модели;
- результат ML-предсказания.

## Когда достаточно функции {#kogda-dostatochno-funktsii}

Если состояние хранить не нужно, класс часто добавляет лишнюю сложность.

```python
def normalize_email(email: str) -> str:
    return email.strip().lower()
```

Функция получает значение и сразу возвращает результат. Отдельный объект здесь не дает полезного поведения.

## Общий принцип {#obshchiy-printsip}

Класс должен описывать одну понятную сущность и защищать правила ее состояния. Не нужно создавать класс только ради объединения несвязанных функций.

```python
class BankAccount:
    def __init__(self, *, balance: float = 0) -> None:
        if balance < 0:
            raise ValueError("Balance cannot be negative")

        self.balance = balance

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Amount must be positive")

        self.balance += amount
```

Объект счета не только хранит баланс, но и контролирует допустимые изменения.

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Classes', href: 'https://docs.python.org/3/tutorial/classes.html' },
        { title: 'Python Data model', href: 'https://docs.python.org/3/reference/datamodel.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python' },
        { title: 'Обработка исключений', href: '/python/yazyk-python/1-core/obrabotka-isklyucheniy-try-except' },
        { title: 'Изменяемые типы', href: '/python/yazyk-python/tipy-dannykh/izmenyaemye-tipy' },
        { title: 'Typing для Python и ML', href: '/python/yazyk-python/typing-dlya-python-i-ml' },
    ]"
/>
