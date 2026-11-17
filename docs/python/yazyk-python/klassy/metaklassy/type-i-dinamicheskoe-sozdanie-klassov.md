---
title: "type и динамическое создание классов"
description: "Две формы type в Python, устройство пространства имён и пошаговое создание класса через type(name, bases, namespace)."
tags:
  - "python"
  - "classes"
  - "metaclasses"
  - "type"
updatedAt: "2026-11-17"
---
## Две формы `type()` {#dve-formy-type}

Обычно `type()` используют с одним аргументом:

```python
value = 42

print(type(value))  # <class 'int'>
```

Но у `type()` есть форма с тремя аргументами:

```python
type(name, bases, namespace)
```

Она не проверяет объект, а создаёт новый класс.

## Минимальный динамический класс {#minimalnyy-dinamicheskiy-klass}

Создадим пустой класс без инструкции `class`:

```python
User = type("User", (), {})

user = User()

print(User.__name__)         # User
print(type(User) is type)    # True
print(type(user) is User)    # True
```

Python создал объект класса и связал его с переменной `User`. После этого класс используется как обычный: его можно вызвать и получить экземпляр.

## Что означают три аргумента {#chto-oznachayut-tri-argumenta}

```python
User = type("User", (), {})
```

Разберём вызов:

| Аргумент | Значение | Результат |
| --- | --- | --- |
| `"User"` | имя класса | `User.__name__ == "User"` |
| `()` | родительские классы | без явного родителя используется `object` |
| `{}` | пространство имён | пока нет пользовательских атрибутов и методов |

Пространство имён — это словарь, из которого будут сформированы атрибуты класса.

## Добавление атрибута {#dobavlenie-atributa}

```python
User = type(
    "User",
    (),
    {
        "role": "reader",
    },
)

user = User()

print(User.role)  # reader
print(user.role)  # reader
```

Ключ `"role"` стал именем атрибута класса, а значение `"reader"` — его значением.

Обычное объявление выглядит понятнее:

```python
class User:
    role = "reader"
```

Оба варианта создают класс с атрибутом `role`.

## Добавление метода {#dobavlenie-metoda}

Сначала создадим обычную функцию:

```python
def greet(self) -> str:
    return f"Hello, {self.name}"
```

Затем положим функцию в пространство имён будущего класса:

```python
User = type(
    "User",
    (),
    {
        "greet": greet,
    },
)

user = User()
user.name = "Alex"

print(user.greet())  # Hello, Alex
```

После создания класса функция `greet` стала методом. При вызове `user.greet()` Python автоматически передал `user` в параметр `self`.

## Добавление `__init__` {#dobavlenie-init}

`__init__` добавляется таким же способом:

```python
def init_user(self, name: str) -> None:
    self.name = name


def greet(self) -> str:
    return f"Hello, {self.name}"


User = type(
    "User",
    (),
    {
        "__init__": init_user,
        "greet": greet,
    },
)

user = User("Alex")

print(user.name)     # Alex
print(user.greet())  # Hello, Alex
```

Имя функции `init_user` не обязано совпадать с именем атрибута. В словаре она записана под ключом `"__init__"`, поэтому класс воспринимает её как метод инициализации.

## Родительский класс в `bases` {#roditelskiy-klass-v-bases}

Второй аргумент содержит кортеж родителей:

```python
class Entity:
    category = "entity"


User = type(
    "User",
    (Entity,),
    {
        "role": "reader",
    },
)

user = User()

print(user.category)             # entity
print(user.role)                 # reader
print(isinstance(user, Entity))  # True
```

Запятая в `(Entity,)` обязательна: кортеж из одного элемента записывается с запятой.

## Сравнение с инструкцией `class` {#sravnenie-s-instruktsiey-class}

Эти объявления близки по результату:

```python
class User(Entity):
    role = "reader"
```

```python
User = type(
    "User",
    (Entity,),
    {"role": "reader"},
)
```

Инструкция `class` почти всегда удобнее: она читается проще, поддерживает обычное тело класса и автоматически участвует во всех этапах его создания.

Форма `type(name, bases, namespace)` полезна, когда имя, родители или атрибуты становятся известны только во время выполнения программы.

## Реалистичный пример {#realistichnyy-primer}

Допустим, программа получает список названий полей и строит простой класс конфигурации:

```python
def create_config_class(class_name: str, defaults: dict[str, object]):
    return type(class_name, (), defaults)


TrainingConfig = create_config_class(
    "TrainingConfig",
    {
        "batch_size": 32,
        "learning_rate": 0.001,
    },
)

config = TrainingConfig()

print(config.batch_size)     # 32
print(config.learning_rate)  # 0.001
```

Здесь структура класса формируется из данных. Для обычной статичной конфигурации такой подход был бы избыточным.

## Важное ограничение {#vazhnoe-ogranichenie}

Трёхаргументная форма `type()` создаёт класс напрямую, но не вызывает хук метакласса `__prepare__()`. Если требуется полный стандартный процесс динамического создания с выбором метакласса и подготовкой пространства имён, используется `types.new_class()`.

На начальном этапе достаточно знать: `type(name, bases, namespace)` показывает, что класс создаётся из имени, родителей и словаря атрибутов.

## Типичные ошибки {#tipichnye-oshibki}

1. Передать список родителей вместо кортежа.

```python
User = type("User", [Entity], {})  # TypeError
```

2. Забыть запятую в кортеже из одного родителя.

```python
(Entity)   # сам класс Entity
(Entity,)  # кортеж с классом Entity
```

3. Положить результат вызова функции вместо самой функции.

```python
{"greet": greet}    # функция станет методом
{"greet": greet()}  # функция вызывается слишком рано
```

4. Использовать динамическое создание для обычного класса с известной структурой.
   В таком случае инструкция `class` понятнее.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Создай через `type()` пустой класс `Book`.
2. Добавь атрибут класса `category = "education"`.
3. Добавь `__init__`, принимающий `title`.
4. Добавь метод `describe()`, возвращающий название и категорию книги.
5. Повтори тот же класс через обычную инструкцию `class` и сравни варианты.

## Краткое повторение {#kratkoe-povtorenie}

- `type(value)` возвращает класс значения.
- `type(name, bases, namespace)` создаёт класс.
- `bases` всегда является кортежем родительских классов.
- `namespace` содержит атрибуты и методы будущего класса.
- Для обычного кода инструкция `class` почти всегда понятнее.

<RelatedTopics
    :items="[
        { title: 'Обзор метаклассов', href: '/python/yazyk-python/klassy/metaklassy/' },
        { title: 'Объекты, классы и метаклассы', href: '/python/yazyk-python/klassy/metaklassy/obekty-klassy-i-metaklassy' },
        { title: 'Собственный метакласс', href: '/python/yazyk-python/klassy/metaklassy/sobstvennyy-metaklass-i-new' },
        { title: 'Класс и экземпляр', href: '/python/yazyk-python/klassy/klass-i-ekzemplyar' },
    ]"
/>
