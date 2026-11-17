---
title: "__prepare__, __init__, __call__ и этапы создания класса"
description: "Жизненный цикл класса простыми словами: подготовка пространства имён, создание и настройка класса, а также создание его экземпляров."
tags:
  - "python"
  - "classes"
  - "metaclasses"
  - "advanced"
updatedAt: "2026-11-17"
---
## Зачем разбирать порядок вызовов {#zachem-razbirat-poryadok-vyzovov}

У метакласса могут быть методы `__prepare__`, `__new__`, `__init__` и `__call__`. Их названия похожи на специальные методы обычного класса, поэтому легко перепутать, какой объект и в какой момент они обрабатывают.

Разберём два разных события:

1. Python встречает объявление `class User:` и создаёт **класс** `User`.
2. Код вызывает `User()` и создаёт **экземпляр** класса `User`.

```python
class User:
    pass


user = User()
```

При выполнении первой строки работает метакласс. При выполнении `User()` работает уже созданный класс, но вызов начинается с `__call__` его метакласса.

## Короткая схема {#korotkaya-skhema}

Для объявления класса:

```text
Meta.__prepare__()
        ↓
выполнение тела class
        ↓
Meta.__new__()
        ↓
Meta.__init__()
        ↓
готовый объект класса
```

Для создания экземпляра:

```text
User()
  ↓
Meta.__call__()
  ↓
User.__new__()
  ↓
User.__init__()
  ↓
готовый экземпляр User
```

Главное различие:

- методы метакласса создают или настраивают **класс**;
- методы обычного класса создают или настраивают **экземпляр**.

## Наблюдаем весь процесс {#nablyudaem-ves-protsess}

Сначала добавим печать в каждый важный метод:

```python
class TraceMeta(type):
    @classmethod
    def __prepare__(mcls, name, bases):
        print(f"1. prepare: {name}")
        return {}

    def __new__(mcls, name, bases, namespace):
        print(f"2. meta new: {name}")
        return super().__new__(mcls, name, bases, namespace)

    def __init__(cls, name, bases, namespace):
        print(f"3. meta init: {name}")
        super().__init__(name, bases, namespace)

    def __call__(cls, *args, **kwargs):
        print(f"4. meta call: {cls.__name__}")
        return super().__call__(*args, **kwargs)


class User(metaclass=TraceMeta):
    def __new__(cls, name):
        print("5. User new")
        return super().__new__(cls)

    def __init__(self, name):
        print("6. User init")
        self.name = name


user = User("Анна")
print(user.name)  # Анна
```

Вывод:

```text
1. prepare: User
2. meta new: User
3. meta init: User
4. meta call: User
5. User new
6. User init
Анна
```

Первые три сообщения появляются при выполнении объявления `class User`. Последние три — только после вызова `User("Анна")`.

## Шаг 1. `__prepare__` готовит пространство имён {#shag-1-prepare-gotovit-prostranstvo-imyon}

Перед выполнением тела класса Python должен решить, куда записывать его атрибуты и методы. Для этого вызывается `__prepare__` метакласса.

```python
class LoggingMeta(type):
    @classmethod
    def __prepare__(mcls, name, bases):
        print(f"Готовим словарь для {name}")
        return {}


class Product(metaclass=LoggingMeta):
    price = 100
```

Вывод:

```text
Готовим словарь для Product
```

После `return {}` Python выполняет тело `Product` и постепенно записывает в этот словарь:

- служебные значения `__module__` и `__qualname__`;
- атрибут `price`;
- все объявленные методы;
- аннотации и другие значения из тела класса.

Упрощённо результат будет похож на такой словарь:

```python
{
    "__module__": "__main__",
    "__qualname__": "Product",
    "price": 100,
}
```

Обычно переопределять `__prepare__` не нужно: `type` сам предоставляет подходящее пространство имён.

### Зачем возвращать не обычный словарь {#zachem-vozvrashchat-ne-obychnyy-slovar}

Собственная коллекция может наблюдать за записью атрибутов. Например, можно запретить повторное объявление одного имени в теле класса.

```python
class UniqueNamespace(dict):
    def __setitem__(self, key, value):
        if key in self:
            raise TypeError(f"Имя {key!r} объявлено повторно")
        super().__setitem__(key, value)


class UniqueMeta(type):
    @classmethod
    def __prepare__(mcls, name, bases):
        return UniqueNamespace()
```

Теперь ошибка будет обнаружена при выполнении тела класса:

```python
class Settings(metaclass=UniqueMeta):
    timeout = 10
    timeout = 20


# TypeError: Имя 'timeout' объявлено повторно
```

В обычном словаре второе значение просто заменило бы первое.

## Шаг 2. Выполняется тело класса {#shag-2-vypolnyaetsya-telo-klassa}

Тело класса — это исполняемый код. Python выполняет его сверху вниз так же, как код функции или модуля.

```python
print("До класса")  # До класса


class Report:
    print("Внутри класса")  # Внутри класса
    format_name = "PDF"


print("После класса")  # После класса
```

В этот момент самого класса `Report` ещё нет. Есть только имя будущего класса, его родители и подготовленное пространство имён.

Поэтому метакласс получает методы не как уже привязанные методы готового класса, а как значения внутри `namespace`.

## Шаг 3. `__new__` создаёт объект класса {#shag-3-new-sozdayot-obekt-klassa}

После выполнения тела класса Python передаёт собранное пространство имён в `__new__` метакласса.

```python
class AddLabelMeta(type):
    def __new__(mcls, name, bases, namespace):
        namespace["label"] = name.lower()
        return super().__new__(mcls, name, bases, namespace)


class Invoice(metaclass=AddLabelMeta):
    pass


print(Invoice.label)  # invoice
```

Именно `type.__new__()` выполняет основную работу по созданию класса. Поэтому собственный метакласс обычно заканчивает метод делегированием:

```python
return super().__new__(mcls, name, bases, namespace)
```

Если забыть `return`, вместо класса получится `None`, и объявление сломается.

### Не удаляйте служебные значения без необходимости {#ne-udalyayte-sluzhebnye-znacheniya-bez-neobkhodimosti}

Безопаснее изменять переданный `namespace` точечно и передавать его дальше. В нём могут находиться служебные данные Python, включая `__classcell__`, который нужен некоторым методам с `super()` и ссылкам на `__class__`.

```python
class SafeMeta(type):
    def __new__(mcls, name, bases, namespace):
        namespace["created_by_meta"] = True
        return super().__new__(mcls, name, bases, namespace)
```

Не стоит без причины собирать новый словарь только из знакомых вам ключей: так можно потерять служебные значения.

## Шаг 4. `__init__` настраивает готовый класс {#shag-4-init-nastraivaet-gotovyy-klass}

Метод `__new__` уже создал объект класса. Затем метакласс вызывает свой `__init__` для дополнительной настройки этого объекта.

```python
class DescriptionMeta(type):
    def __init__(cls, name, bases, namespace):
        super().__init__(name, bases, namespace)
        cls.description = f"Класс {name} готов"


class Order(metaclass=DescriptionMeta):
    pass


print(Order.description)  # Класс Order готов
```

Обрати внимание на первый параметр:

- в `Meta.__new__` обычно пишут `mcls`, потому что это объект метакласса;
- в `Meta.__init__` обычно пишут `cls`, потому что инициализируется уже созданный класс.

Названия параметров не обязательны для Python, но помогают человеку понимать код.

### `__new__` или `__init__` метакласса {#new-ili-init-metaklassa}

Практическое правило:

| Метод | Когда использовать |
| --- | --- |
| `Meta.__new__` | нужно изменить `namespace` до окончательного создания класса или повлиять на сам процесс создания |
| `Meta.__init__` | класс уже создан, и его нужно дополнительно настроить или зарегистрировать |

Большинство простых проверок можно выполнить в любом из них. В проекте лучше придерживаться уже выбранного подхода.

## Шаг 5. `__call__` реагирует на вызов класса {#shag-5-call-reagiruet-na-vyzov-klassa}

После создания класса код может вызвать его:

```python
user = User("Анна")
```

Такой вызов обрабатывает `__call__` метакласса класса `User`.

```python
class LogCallMeta(type):
    def __call__(cls, *args, **kwargs):
        print(f"Создаём экземпляр {cls.__name__}")
        return super().__call__(*args, **kwargs)


class User(metaclass=LogCallMeta):
    def __init__(self, name):
        self.name = name


user = User("Анна")
# Создаём экземпляр User

print(user.name)  # Анна
```

Стандартный `type.__call__()` внутри запускает обычные `User.__new__()` и `User.__init__()`.

Поэтому в собственном `__call__` важно вызвать `super().__call__()`. Иначе экземпляр может вообще не создаться.

## Реалистичный пример: подсчёт экземпляров {#realistichnyy-primer-podschyot-ekzemplyarov}

Метакласс может считать, сколько объектов создано у каждого класса.

```python
class InstanceCounterMeta(type):
    def __new__(mcls, name, bases, namespace):
        namespace["instances_created"] = 0
        return super().__new__(mcls, name, bases, namespace)

    def __call__(cls, *args, **kwargs):
        instance = super().__call__(*args, **kwargs)
        cls.instances_created += 1
        return instance


class Task(metaclass=InstanceCounterMeta):
    def __init__(self, title):
        self.title = title


first = Task("Документация")
second = Task("Проверка")

print(Task.instances_created)  # 2
```

Счётчик увеличивается после успешного создания экземпляра. Если `Task.__init__()` завершится ошибкой, строка после `super().__call__()` не выполнится и счётчик останется корректным.

## Что ещё происходит при создании класса {#chto-eshchyo-proiskhodit-pri-sozdanii-klassa}

Полный внутренний процесс сложнее короткой схемы. Python также:

- определяет базовые классы;
- выбирает подходящий метакласс;
- вызывает `__set_name__()` у дескрипторов;
- вызывает `__init_subclass__()` у родительского класса;
- применяет декораторы класса после создания класса.

Пример порядка для `__init_subclass__` и декоратора:

```python
def mark(cls):
    print(f"Декоратор: {cls.__name__}")
    return cls


class Base:
    def __init_subclass__(cls):
        print(f"Родитель: {cls.__name__}")


@mark
class Child(Base):
    pass
```

Вывод:

```text
Родитель: Child
Декоратор: Child
```

Сначала класс создаётся и родитель узнаёт о новом подклассе. Затем декоратор получает уже готовый класс.

## Не путайте два `__call__` {#ne-putayte-dva-call}

Обычный класс тоже может определять `__call__`, но этот метод делает вызываемым **экземпляр**.

```python
class Multiplier:
    def __init__(self, factor):
        self.factor = factor

    def __call__(self, value):
        return value * self.factor


double = Multiplier(2)
print(double(5))  # 10
```

Здесь:

- `Multiplier(2)` обрабатывается `type.__call__`, потому что вызывается класс;
- `double(5)` обрабатывается `Multiplier.__call__`, потому что вызывается экземпляр.

## Типичные ошибки {#tipichnye-oshibki}

1. Считать, что `Meta.__call__` выполняется при объявлении класса. Он выполняется при вызове уже созданного класса.
2. Не вернуть пространство имён из `__prepare__`.
3. Не вернуть класс из `Meta.__new__`.
4. Забыть делегировать работу через `super()`.
5. Удалить служебные значения из `namespace`.
6. Путать `Meta.__new__` с `User.__new__`: первый создаёт класс, второй — экземпляр.
7. Использовать метакласс только ради действия, которое проще выполнить декоратором класса.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Добавь печать в каждый метод примера `TraceMeta` и проверь, какие сообщения появляются до вызова `User()`.
2. Создай метакласс, который записывает в каждый класс атрибут `class_name` с именем класса.
3. Измени `InstanceCounterMeta`, чтобы он отдельно считал экземпляры двух разных классов.

## Краткое повторение {#kratkoe-povtorenie}

- `__prepare__` создаёт коллекцию для атрибутов будущего класса.
- Тело класса выполняется до появления готового объекта класса.
- `Meta.__new__` создаёт класс.
- `Meta.__init__` настраивает уже созданный класс.
- `Meta.__call__` обрабатывает вызов класса и обычно запускает создание экземпляра.
- `User.__new__` и `User.__init__` относятся уже к экземпляру `User`.

<OfficialDocsLinks
    :links="[
        { title: 'Python Data model: Customizing class creation', href: 'https://docs.python.org/3/reference/datamodel.html#customizing-class-creation' },
        { title: 'Python Data model: Creating the class object', href: 'https://docs.python.org/3/reference/datamodel.html#creating-the-class-object' },
        { title: 'Python Data model: Basic customization', href: 'https://docs.python.org/3/reference/datamodel.html#basic-customization' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Обзор метаклассов', href: '/python/yazyk-python/klassy/metaklassy/' },
        { title: 'Собственный метакласс', href: '/python/yazyk-python/klassy/metaklassy/sobstvennyy-metaklass-i-new' },
        { title: 'Валидация и реестр', href: '/python/yazyk-python/klassy/metaklassy/validatsiya-i-reestr-klassov' },
        { title: 'Наследование и альтернативы', href: '/python/yazyk-python/klassy/metaklassy/nasledovanie-konflikty-i-alternativy' },
    ]"
/>
