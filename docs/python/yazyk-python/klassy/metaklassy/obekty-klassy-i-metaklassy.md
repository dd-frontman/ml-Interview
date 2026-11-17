---
title: "Объекты, классы и метаклассы"
description: "Простое объяснение трёх уровней Python: экземпляр создаётся классом, а класс создаётся метаклассом type."
tags:
  - "python"
  - "classes"
  - "metaclasses"
  - "objects"
updatedAt: "2026-11-17"
---
## Начнём с обычного объекта {#nachnyom-s-obychnogo-obekta}

Класс описывает, какие данные и действия будут у его экземпляров:

```python
class User:
    def __init__(self, name: str) -> None:
        self.name = name

    def greet(self) -> str:
        return f"Hello, {self.name}"


user = User("Alex")

print(user.name)     # Alex
print(user.greet())  # Hello, Alex
```

При вызове `User("Alex")` класс создаёт новый объект `user` и инициализирует его состояние.

Проверим связь:

```python
print(type(user) is User)       # True
print(isinstance(user, User))   # True
```

`user` является экземпляром `User`.

## Класс тоже существует во время выполнения {#klass-tozhe-sushchestvuet-vo-vremya-vypolneniya}

После выполнения инструкции `class User` имя `User` указывает на объект. Этот объект можно:

- сохранить в другой переменной;
- передать в функцию;
- положить в список;
- вернуть из функции;
- вызвать для создания экземпляра.

```python
SelectedClass = User
another_user = SelectedClass("Kate")

print(another_user.name)  # Kate
```

Переменная `SelectedClass` и имя `User` указывают на один объект класса:

```python
print(SelectedClass is User)  # True
```

Это важное отличие от представления о классе как о простом фрагменте исходного кода. Исходный код выполняется, после чего Python создаёт объект класса.

## Кто создал объект класса {#kto-sozdal-obekt-klassa}

Раз `User` является объектом, у него тоже есть тип:

```python
print(type(User))          # <class 'type'>
print(type(User) is type)  # True
```

`type` здесь является не типом экземпляра `user`, а типом самого класса `User`.

Поэтому говорят:

- `user` — экземпляр класса `User`;
- `User` — экземпляр метакласса `type`.

## Простая аналогия {#prostaya-analogiya}

Представим производство:

```text
чертёж станка → станок → готовая деталь
```

В Python похожая цепочка выглядит так:

```text
метакласс type → класс User → объект user
```

Аналогия помогает увидеть уровни, но не описывает все детали Python. Метакласс — не просто текстовый шаблон: это настоящий объект, который участвует в создании класса.

## Три проверки через `type()` {#tri-proverki-cherez-type}

```python
class Character:
    pass


character = Character()

print(type(character) is Character)  # True
print(type(Character) is type)       # True
print(type(type) is type)            # True
```

Разберём каждую строку.

### `type(character)` {#type-character}

Возвращает `Character`, потому что объект создан вызовом `Character()`.

### `type(Character)` {#type-character-2}

Возвращает `type`, потому что класс `Character` создан стандартным метаклассом.

### `type(type)` {#type-type}

Возвращает сам `type`. Это особенность базовой объектной модели Python: стандартный метакласс является экземпляром самого себя.

Для практического понимания достаточно первых двух уровней. Третья проверка показывает, где цепочка замыкается.

## Встроенные классы устроены так же {#vstroennye-klassy-ustroeny-tak-zhe}

`str`, `int`, `list` и `dict` — классы. Они тоже созданы метаклассом `type`:

```python
print(type(str) is type)   # True
print(type(int) is type)   # True
print(type(list) is type)  # True
print(type(dict) is type)  # True
```

А созданные ими значения являются экземплярами этих классов:

```python
print(type("Python") is str)  # True
print(type(10) is int)        # True
print(type([]) is list)       # True
print(type({}) is dict)       # True
```

## Класс можно передать в функцию {#klass-mozhno-peredat-v-funktsiyu}

Раз класс является объектом, функция может принять его как аргумент:

```python
def create_default(model_class):
    return model_class()


class User:
    def __init__(self) -> None:
        self.role = "reader"


user = create_default(User)

print(type(user) is User)  # True
print(user.role)           # reader
```

Функция получает объект класса `User`, вызывает его и возвращает новый экземпляр.

## Где здесь метакласс {#gde-zdes-metaklass}

В обычной программе мы не пишем `metaclass=type`, потому что Python выбирает `type` автоматически:

```python
class User:
    pass
```

По смыслу метакласс всё равно присутствует:

```python
class User(metaclass=type):
    pass
```

Оба объявления создают обычный класс `User`. Явно указывать `type` не нужно.

Пользовательский метакласс понадобится только тогда, когда стандартный процесс создания класса нужно изменить.

## Типичные ошибки {#tipichnye-oshibki}

1. Называть `User` экземпляром `User`.
   `User` — класс, а `User()` — экземпляр.

2. Считать, что метакласс создаёт обычные экземпляры напрямую.
   Метакласс создаёт класс, а уже класс создаёт экземпляры.

3. Путать `type(user)` и `type(User)`.
   Первый вызов возвращает обычный класс, второй — его метакласс.

4. Искать метакласс в каждом простом классе.
   По умолчанию Python уже использует `type`, поэтому дополнительный код не нужен.

## Самостоятельная проверка {#samostoyatelnaya-proverka}

1. Создай класс `Book` и экземпляр `book`.
2. До запуска предскажи результаты `type(book)` и `type(Book)`.
3. Сохрани `Book` в переменную `SelectedBook` и создай через неё новый объект.
4. Проверь, что `SelectedBook is Book` возвращает `True`.

## Краткое повторение {#kratkoe-povtorenie}

- Экземпляр создаётся классом.
- Класс в Python тоже является объектом.
- Обычный класс создаётся метаклассом `type`.
- `type(instance)` возвращает класс экземпляра.
- `type(Class)` возвращает метакласс.

<RelatedTopics
    :items="[
        { title: 'Обзор метаклассов', href: '/python/yazyk-python/klassy/metaklassy/' },
        { title: 'type и создание классов', href: '/python/yazyk-python/klassy/metaklassy/type-i-dinamicheskoe-sozdanie-klassov' },
        { title: 'Класс и экземпляр', href: '/python/yazyk-python/klassy/klass-i-ekzemplyar' },
        { title: 'Инициализация и методы', href: '/python/yazyk-python/klassy/init-self-atributy-i-metody' },
    ]"
/>
