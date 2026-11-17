---
title: "Практика по метаклассам"
description: "Задачи по метаклассам Python: добавление атрибутов, проверка классов, автоматический реестр и контроль создания экземпляров."
tags:
  - "python"
  - "classes"
  - "metaclasses"
  - "practice"
updatedAt: "2026-11-17"
---
## Как работать с задачами {#kak-rabotat-s-zadachami}

Перед практикой полезно повторить:

- [объекты, классы и метаклассы](./obekty-klassy-i-metaklassy.md);
- [аргументы `name`, `bases`, `namespace`](./sobstvennyy-metaklass-i-new.md);
- [валидацию и реестр классов](./validatsiya-i-reestr-klassov.md);
- [этапы создания класса](./prepare-init-call-i-etapy-sozdaniya.md).

Для каждой задачи:

1. сначала предскажи, в какой момент должен сработать код;
2. напиши решение без просмотра готового варианта;
3. проверь результат через `print()` или ожидаемое исключение;
4. объясни, почему задача относится к созданию класса или экземпляра;
5. только затем открой решение.

## Задача 1. Автоматический идентификатор класса {#zadacha-1-avtomaticheskiy-identifikator-klassa}

### Условие {#uslovie}

Создай метакласс `AddIdMeta`. Он должен добавлять каждому создаваемому классу атрибут `class_id`.

Значение строится из имени класса в нижнем регистре:

```python
class UserProfile(metaclass=AddIdMeta):
    pass


print(UserProfile.class_id)  # userprofile
```

Сам класс не должен вручную объявлять `class_id`.

### Подсказки {#podskazki}

1. Метакласс наследуется от `type`.
2. Имя будущего класса приходит в параметр `name` метода `__new__`.
3. Атрибуты будущего класса находятся в `namespace`.
4. После изменения словаря передай создание класса в `super().__new__()`.

::: details Показать решение

```python
class AddIdMeta(type):
    def __new__(mcls, name, bases, namespace):
        namespace["class_id"] = name.lower()
        return super().__new__(mcls, name, bases, namespace)


class UserProfile(metaclass=AddIdMeta):
    pass


print(UserProfile.class_id)  # userprofile
```

`namespace` изменяется до создания класса. Поэтому `class_id` становится обычным атрибутом готового `UserProfile`.

:::

## Задача 2. Обязательный метод `run` {#zadacha-2-obyazatelnyy-metod-run}

### Условие {#uslovie-2}

Создай метакласс `RunnableMeta`. Каждый класс с этим метаклассом должен объявлять собственный метод `run`.

Корректный вариант:

```python
class ImportTask(metaclass=RunnableMeta):
    def run(self):
        return "Импорт выполнен"


task = ImportTask()
print(task.run())  # Импорт выполнен
```

Некорректный вариант должен завершиться `TypeError` уже при объявлении класса:

```python
class EmptyTask(metaclass=RunnableMeta):
    pass


# TypeError: EmptyTask должен объявить метод run
```

### Подсказки {#podskazki-2}

1. Проверяй ключ `"run"` в `namespace`.
2. Проверка `hasattr` означает другое: она также найдёт унаследованный метод.
3. В текст ошибки добавь параметр `name`.
4. Ошибку нужно поднять до вызова `super().__new__()`.

::: details Показать решение

```python
class RunnableMeta(type):
    def __new__(mcls, name, bases, namespace):
        if "run" not in namespace:
            raise TypeError(f"{name} должен объявить метод run")

        return super().__new__(mcls, name, bases, namespace)


class ImportTask(metaclass=RunnableMeta):
    def run(self):
        return "Импорт выполнен"


task = ImportTask()
print(task.run())  # Импорт выполнен
```

Такое решение требует `run` даже у первого класса с метаклассом. Если нужен абстрактный базовый класс без реализации, его придётся явно исключить из проверки или использовать `abc.ABC`.

:::

## Задача 3. Базовый класс без проверки {#zadacha-3-bazovyy-klass-bez-proverki}

### Условие {#uslovie-3}

Усложни предыдущую задачу. Базовый класс `Task` может не иметь метода `run`, но каждый его конкретный потомок обязан объявить этот метод самостоятельно.

```python
class Task(metaclass=RunnableMeta):
    pass


class ExportTask(Task):
    def run(self):
        return "Экспорт выполнен"


print(ExportTask().run())  # Экспорт выполнен
```

А этот класс должен вызвать ошибку:

```python
class EmptyTask(Task):
    pass


# TypeError: EmptyTask должен объявить метод run
```

### Подсказки {#podskazki-3}

1. Во время создания `Task` кортеж `bases` будет пустым.
2. У дочернего класса в `bases` уже будет родитель `Task`.
3. Объедини две проверки: класс имеет родителей и в его `namespace` отсутствует `run`.

::: details Показать решение

```python
class RunnableMeta(type):
    def __new__(mcls, name, bases, namespace):
        is_child_class = bool(bases)

        if is_child_class and "run" not in namespace:
            raise TypeError(f"{name} должен объявить метод run")

        return super().__new__(mcls, name, bases, namespace)


class Task(metaclass=RunnableMeta):
    pass


class ExportTask(Task):
    def run(self):
        return "Экспорт выполнен"


print(ExportTask().run())  # Экспорт выполнен
```

Проверка `bool(bases)` подходит для этого небольшого примера. В реальном проекте базовый класс лучше отмечать явно, например атрибутом `abstract = True`, или использовать модуль `abc`.

:::

## Задача 4. Реестр команд {#zadacha-4-reestr-komand}

### Условие {#uslovie-4}

Создай метакласс `CommandMeta` с общим словарём `registry`. Каждый дочерний класс с непустым `command_name` должен автоматически попадать в реестр.

```python
class Command(metaclass=CommandMeta):
    command_name = None


class StartCommand(Command):
    command_name = "start"


class StopCommand(Command):
    command_name = "stop"


print(CommandMeta.registry["start"] is StartCommand)  # True
print(CommandMeta.registry["stop"] is StopCommand)  # True
```

Сам базовый `Command` регистрировать не нужно.

### Подсказки {#podskazki-4}

1. Реестр можно объявить атрибутом метакласса.
2. Сначала создай класс через `super().__new__()` и сохрани результат в переменную.
3. Прочитай `command_name` у готового класса.
4. Если имя не равно `None`, добавь в словарь сам класс, а не его экземпляр.

::: details Показать решение

```python
class CommandMeta(type):
    registry = {}

    def __new__(mcls, name, bases, namespace):
        cls = super().__new__(mcls, name, bases, namespace)

        if cls.command_name is not None:
            mcls.registry[cls.command_name] = cls

        return cls


class Command(metaclass=CommandMeta):
    command_name = None


class StartCommand(Command):
    command_name = "start"


class StopCommand(Command):
    command_name = "stop"


print(CommandMeta.registry["start"] is StartCommand)  # True
print(CommandMeta.registry["stop"] is StopCommand)  # True
```

Метакласс хранит классы. Позже нужный класс можно достать по строковому ключу и создать его экземпляр.

:::

## Задача 5. Создание команды по имени {#zadacha-5-sozdanie-komandy-po-imeni}

### Условие {#uslovie-5}

Используй реестр из предыдущей задачи. Напиши функцию `create_command(name)`, которая:

- находит класс команды в `CommandMeta.registry`;
- создаёт и возвращает его экземпляр;
- вызывает понятную ошибку для неизвестного имени.

```python
command = create_command("start")

print(type(command) is StartCommand)  # True
```

### Подсказки {#podskazki-5}

1. Значение в реестре — класс, поэтому его можно вызвать.
2. Для неизвестного ключа можно перехватить `KeyError` или сначала проверить `name in registry`.
3. Выбери `ValueError`, если переданная строка имеет недопустимое значение.

::: details Показать решение

```python
def create_command(name):
    command_class = CommandMeta.registry.get(name)

    if command_class is None:
        raise ValueError(f"Неизвестная команда: {name}")

    return command_class()


command = create_command("start")
print(type(command) is StartCommand)  # True
```

Функция отделяет поиск команды от логики метакласса. Метакласс наполняет реестр только во время создания классов.

:::

## Задача 6. Подсчёт созданных экземпляров {#zadacha-6-podschyot-sozdannykh-ekzemplyarov}

### Условие {#uslovie-6}

Создай метакласс `CounterMeta`. Каждый класс с этим метаклассом должен иметь собственный счётчик `instances_created`. После успешного создания объекта счётчик увеличивается на единицу.

```python
class User(metaclass=CounterMeta):
    pass


class Product(metaclass=CounterMeta):
    pass


first_user = User()
second_user = User()
product = Product()

print(User.instances_created)  # 2
print(Product.instances_created)  # 1
```

### Подсказки {#podskazki-6}

1. Начальное значение можно добавить в `namespace` внутри `__new__` метакласса.
2. Вызов класса обрабатывает `__call__` метакласса.
3. Сначала создай экземпляр через `super().__call__()`.
4. Увеличивай счётчик у параметра `cls`, а затем возвращай экземпляр.

::: details Показать решение

```python
class CounterMeta(type):
    def __new__(mcls, name, bases, namespace):
        namespace["instances_created"] = 0
        return super().__new__(mcls, name, bases, namespace)

    def __call__(cls, *args, **kwargs):
        instance = super().__call__(*args, **kwargs)
        cls.instances_created += 1
        return instance


class User(metaclass=CounterMeta):
    pass


class Product(metaclass=CounterMeta):
    pass


first_user = User()
second_user = User()
product = Product()

print(User.instances_created)  # 2
print(Product.instances_created)  # 1
```

Счётчик записывается в пространство имён каждого нового класса. Поэтому у `User` и `Product` разные значения.

:::

## Задача 7. Решить без метакласса {#zadacha-7-reshit-bez-metaklassa}

### Условие {#uslovie-7}

Повтори реестр команд из задачи 4, но используй `__init_subclass__()` обычного базового класса. Сравни объём кода и понятность двух вариантов.

### Подсказки {#podskazki-7}

1. Словарь `registry` может принадлежать базовому классу `Command`.
2. Python вызовет `Command.__init_subclass__()` после создания каждого потомка.
3. Параметр `cls` будет указывать на новый дочерний класс.

::: details Показать решение

```python
class Command:
    registry = {}
    command_name = None

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)

        if cls.command_name is not None:
            Command.registry[cls.command_name] = cls


class StartCommand(Command):
    command_name = "start"


print(Command.registry["start"] is StartCommand)  # True
```

Для такой задачи `__init_subclass__()` обычно проще. Он показывает важный инженерный вывод: умение работать с метаклассами включает умение вовремя от них отказаться.

:::

## Типичные ошибки при решении {#tipichnye-oshibki-pri-reshenii}

1. Записывать в реестр экземпляр `cls()`, хотя нужен сам класс `cls`.
2. Проверять обязательный атрибут после возврата из `__new__`: этот код уже не выполнится.
3. Не возвращать результат `super().__new__()` или `super().__call__()`.
4. Использовать `hasattr`, когда класс обязан объявить значение именно в своём теле.
5. Давать всем классам один общий счётчик вместо отдельного атрибута каждого класса.
6. Пытаться вызвать метакласс вручную там, где Python сам делает это при объявлении `class`.

## Что нужно уметь объяснить {#chto-nuzhno-umet-obyasnit}

После задач ответь своими словами:

1. Что создаёт `Meta.__new__()`?
2. Что создаёт `User.__new__()`?
3. Чем проверка `"run" in namespace` отличается от `hasattr(cls, "run")`?
4. Почему в реестре обычно хранят класс, а не экземпляр?
5. Почему реестр подклассов часто проще сделать через `__init_subclass__()`?

## Краткое повторение {#kratkoe-povtorenie}

- Изменяйте `namespace`, если атрибут должен появиться во время создания класса.
- Проверяйте `namespace`, если значение обязано быть объявлено прямо в теле класса.
- Реестр связывает строковый ключ с объектом класса.
- `Meta.__call__()` подходит для общей логики создания экземпляров.
- После решения всегда проверяйте, нельзя ли заменить метакласс более простым механизмом.

<RelatedTopics
    :items="[
        { title: 'Обзор метаклассов', href: '/python/yazyk-python/klassy/metaklassy/' },
        { title: 'Собственный метакласс', href: '/python/yazyk-python/klassy/metaklassy/sobstvennyy-metaklass-i-new' },
        { title: 'Валидация и реестр', href: '/python/yazyk-python/klassy/metaklassy/validatsiya-i-reestr-klassov' },
        { title: 'Наследование и альтернативы', href: '/python/yazyk-python/klassy/metaklassy/nasledovanie-konflikty-i-alternativy' },
    ]"
/>
