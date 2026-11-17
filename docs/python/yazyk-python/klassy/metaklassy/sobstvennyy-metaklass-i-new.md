---
title: "Собственный метакласс и __new__"
description: "Как создать метакласс через class Meta(type), подключить его через metaclass и разобрать аргументы __new__ по шагам."
tags:
  - "python"
  - "classes"
  - "metaclasses"
  - "new"
updatedAt: "2026-11-17"
---
## Что хотим изменить {#chto-khotim-izmenit}

Создадим правило: каждый новый класс-сущность автоматически получает атрибут `category = "entity"`.

Без метакласса атрибут пришлось бы повторять:

```python
class User:
    category = "entity"


class Product:
    category = "entity"
```

Метакласс может добавлять его во время создания каждого класса.

## Минимальный метакласс {#minimalnyy-metaklass}

```python
class EntityMeta(type):
    pass
```

`EntityMeta` является обычным классом с точки зрения синтаксиса, но наследуется от `type`. Поэтому он умеет создавать другие классы.

Проверка:

```python
print(issubclass(EntityMeta, type))  # True
print(type(EntityMeta) is type)      # True
```

Первая строка показывает, что `EntityMeta` расширяет поведение `type`. Вторая — что сам `EntityMeta` тоже создан стандартным метаклассом `type`.

## Подключение через `metaclass=` {#podklyuchenie-cherez-metaclass}

```python
class Entity(metaclass=EntityMeta):
    pass
```

Параметр `metaclass=EntityMeta` означает: «класс `Entity` должен быть создан объектом `EntityMeta`».

```python
entity = Entity()

print(type(Entity) is EntityMeta)  # True
print(type(entity) is Entity)      # True
```

Здесь есть две разные операции:

1. `EntityMeta` создаёт класс `Entity`;
2. класс `Entity` создаёт экземпляр `entity`.

## Добавление поведения через `__new__` {#dobavlenie-povedeniya-cherez-new}

Чтобы изменить создаваемый класс, переопределим `__new__` метакласса:

```python
class EntityMeta(type):
    def __new__(
        mcls,
        name: str,
        bases: tuple[type, ...],
        namespace: dict[str, object],
    ) -> type:
        namespace["category"] = "entity"
        return super().__new__(mcls, name, bases, namespace)
```

Используем его:

```python
class User(metaclass=EntityMeta):
    pass


class Product(metaclass=EntityMeta):
    pass


print(User.category)     # entity
print(Product.category)  # entity
```

Атрибута `category` не было в телах `User` и `Product`. Его добавил `EntityMeta` до окончательного создания классов.

## Построчный разбор {#postrochnyy-razbor}

### `class EntityMeta(type)` {#class-entitymeta-type}

```python
class EntityMeta(type):
```

Мы создаём не обычный класс предметной области, а новый вид создателя классов. Наследование от `type` предоставляет стандартный механизм создания класса.

### Параметр `mcls` {#parametr-mcls}

```python
def __new__(mcls, name, bases, namespace):
```

`mcls` указывает на метакласс, который сейчас работает. Имя не является специальным словом, но принято использовать `mcls` по аналогии с `self` и `cls`:

- `self` — текущий экземпляр;
- `cls` — текущий обычный класс;
- `mcls` — текущий метакласс.

При создании `User` значение `mcls` равно `EntityMeta`.

### Параметр `name` {#parametr-name}

`name` содержит имя создаваемого класса:

```python
class DebugMeta(type):
    def __new__(mcls, name, bases, namespace):
        print(name)  # User
        return super().__new__(mcls, name, bases, namespace)


class User(metaclass=DebugMeta):
    pass
```

### Параметр `bases` {#parametr-bases}

`bases` — кортеж прямых родителей:

```python
class Entity:
    pass


class DebugMeta(type):
    def __new__(mcls, name, bases, namespace):
        print(bases)  # (<class '__main__.Entity'>,)
        return super().__new__(mcls, name, bases, namespace)


class User(Entity, metaclass=DebugMeta):
    pass
```

Точное текстовое представление класса зависит от модуля, но в кортеже будет `Entity`.

### Параметр `namespace` {#parametr-namespace}

`namespace` — словарь, сформированный после выполнения тела класса:

```python
class DebugMeta(type):
    def __new__(mcls, name, bases, namespace):
        print("role" in namespace)   # True
        print("greet" in namespace)  # True
        return super().__new__(mcls, name, bases, namespace)


class User(metaclass=DebugMeta):
    role = "reader"

    def greet(self) -> str:
        return "Hello"
```

В словаре также присутствуют служебные имена, например `__module__` и `__qualname__`. Поэтому не следует без необходимости полностью заменять `namespace` новым словарём.

### Вызов `super().__new__` {#vyzov-super-new}

```python
return super().__new__(mcls, name, bases, namespace)
```

Наш метакласс подготовил данные, а затем передал их стандартному механизму `type.__new__`. Результатом является готовый объект класса.

Если забыть `return`, имя класса получит `None` или создание завершится некорректно:

```python
class BrokenMeta(type):
    def __new__(mcls, name, bases, namespace):
        super().__new__(mcls, name, bases, namespace)
        # Нет return
```

Метод `__new__` обязан вернуть созданный класс.

## `__new__` обычного класса и метакласса {#new-obychnogo-klassa-i-metaklassa}

Названия совпадают, но создаются разные объекты.

```text
User.__new__         → создаёт экземпляр User
EntityMeta.__new__   → создаёт сам класс User
```

Пример обычного `__new__`:

```python
class User:
    def __new__(cls, *args, **kwargs):
        instance = super().__new__(cls)
        return instance
```

Пример `__new__` метакласса:

```python
class EntityMeta(type):
    def __new__(mcls, name, bases, namespace):
        return super().__new__(mcls, name, bases, namespace)
```

В первом случае результат — объект `User()`. Во втором — объект класса `User`.

## Метакласс наследуется вместе с базовым классом {#metaklass-nasleduetsya-vmeste-s-bazovym-klassom}

Не нужно писать `metaclass=EntityMeta` у каждого наследника:

```python
class Entity(metaclass=EntityMeta):
    pass


class User(Entity):
    pass


class Product(Entity):
    pass


print(type(User) is EntityMeta)     # True
print(type(Product) is EntityMeta)  # True
```

При создании наследников Python учитывает метакласс родительского класса.

## Когда выполняется метакласс {#kogda-vypolnyaetsya-metaklass}

Метакласс работает при выполнении инструкции `class`, обычно во время импорта модуля:

```python
print("Before class")


class DebugMeta(type):
    def __new__(mcls, name, bases, namespace):
        print(f"Creating class {name}")
        return super().__new__(mcls, name, bases, namespace)


class User(metaclass=DebugMeta):
    pass


print("After class")
```

Вывод:

```text
Before class
Creating class User
After class
```

Создавать экземпляр `User()` для запуска метакласса не требуется: класс уже был создан раньше.

## Типичные ошибки {#tipichnye-oshibki}

1. Не наследовать метакласс от `type`.
2. Путать `mcls` с экземпляром будущего класса.
3. Забывать вернуть `super().__new__(...)`.
4. Полностью заменять `namespace` и терять служебные значения.
5. Ожидать, что метакласс выполняется только при вызове `User()`.
6. Повторять `metaclass=` у всех наследников без необходимости.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Создай `LabelMeta`, добавляющий классу `label`, равный имени класса в нижнем регистре.
2. Проверь `type(YourClass)` и `type(YourClass())`.
3. Выведи `name`, `bases` и отсортированные ключи `namespace` внутри метакласса.
4. Создай наследника и проверь, что он автоматически использует тот же метакласс.

## Краткое повторение {#kratkoe-povtorenie}

- Пользовательский метакласс обычно наследуется от `type`.
- Он подключается через `metaclass=...`.
- `__new__` метакласса создаёт объект класса.
- `name`, `bases` и `namespace` описывают будущий класс.
- В конце обычно вызывается и возвращается `super().__new__()`.

<RelatedTopics
    :items="[
        { title: 'Обзор метаклассов', href: '/python/yazyk-python/klassy/metaklassy/' },
        { title: 'type и создание классов', href: '/python/yazyk-python/klassy/metaklassy/type-i-dinamicheskoe-sozdanie-klassov' },
        { title: 'Валидация и реестр', href: '/python/yazyk-python/klassy/metaklassy/validatsiya-i-reestr-klassov' },
        { title: 'Наследование', href: '/python/yazyk-python/klassy/nasledovanie-i-polimorfizm' },
    ]"
/>
