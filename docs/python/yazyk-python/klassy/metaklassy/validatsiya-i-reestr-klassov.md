---
title: "Валидация и реестр классов"
description: "Практическое применение метаклассов: проверка обязательных атрибутов при объявлении класса и автоматический реестр плагинов."
tags:
  - "python"
  - "classes"
  - "metaclasses"
  - "registry"
updatedAt: "2026-11-17"
---
## Задача: обязательное имя таблицы {#zadacha-obyazatelnoe-imya-tablitsy}

Допустим, приложение связывает классы с таблицами базы данных:

```python
class UserModel:
    table_name = "users"


class ProductModel:
    table_name = "products"
```

Если разработчик забудет `table_name`, проблема обнаружится поздно — например, при формировании SQL-запроса.

Хотим получить ошибку сразу при объявлении неправильного класса.

## Проверка внутри метакласса {#proverka-vnutri-metaklassa}

```python
class ModelMeta(type):
    def __new__(mcls, name, bases, namespace):
        is_abstract = namespace.get("__abstract__", False)

        if not is_abstract and "table_name" not in namespace:
            raise TypeError(f"{name} must define table_name")

        return super().__new__(mcls, name, bases, namespace)
```

Создадим базовый класс:

```python
class BaseModel(metaclass=ModelMeta):
    __abstract__ = True
```

`BaseModel` не связан с реальной таблицей, поэтому помечен как абстрактный. Метакласс пропускает проверку для такого класса.

Правильный наследник:

```python
class UserModel(BaseModel):
    table_name = "users"


print(UserModel.table_name)  # users
```

Неправильный наследник:

```python
class ProductModel(BaseModel):
    pass

# TypeError: ProductModel must define table_name
```

Ошибка появляется во время выполнения строки `class ProductModel`, потому что именно в этот момент метакласс создаёт и проверяет класс.

## Почему проверяем `namespace` {#pochemu-proveryaem-namespace}

Условие:

```python
"table_name" not in namespace
```

проверяет, что атрибут объявлен непосредственно в новом классе.

Если использовать `hasattr()` после создания класса, унаследованное значение тоже будет считаться найденным. Это может быть нежелательно:

```python
class Parent:
    table_name = "parent"


class Child(Parent):
    pass
```

У `Child` есть доступ к `Parent.table_name`, но собственной таблицы он не объявил. Проверка пространства имён позволяет различать эти случаи.

## Улучшение сообщения об ошибке {#uluchshenie-soobshcheniya-ob-oshibke}

Сообщение должно объяснять не только факт ошибки, но и способ исправления:

```python
class ModelMeta(type):
    def __new__(mcls, name, bases, namespace):
        is_abstract = namespace.get("__abstract__", False)

        if not is_abstract and "table_name" not in namespace:
            raise TypeError(
                f"{name} must define a string attribute table_name"
            )

        table_name = namespace.get("table_name")
        if table_name is not None and not isinstance(table_name, str):
            raise TypeError(f"{name}.table_name must be str")

        return super().__new__(mcls, name, bases, namespace)
```

Теперь метакласс проверяет наличие и тип значения.

## Задача: автоматическая регистрация плагинов {#zadacha-avtomaticheskaya-registratsiya-plaginov}

Программа поддерживает разные экспортёры:

```python
class CsvExporter:
    pass


class JsonExporter:
    pass
```

Хотим выбирать класс по имени формата:

```python
exporter_class = registry["json"]
exporter = exporter_class()
```

Чтобы не обновлять словарь вручную после каждого нового класса, регистрацию можно выполнить метаклассом.

## Реестр в метаклассе {#reestr-v-metaklasse}

```python
class PluginMeta(type):
    registry: dict[str, type] = {}

    def __new__(mcls, name, bases, namespace):
        cls = super().__new__(mcls, name, bases, namespace)

        plugin_name = namespace.get("plugin_name")
        if plugin_name is not None:
            mcls.registry[plugin_name] = cls

        return cls
```

Базовый класс не объявляет `plugin_name`, поэтому не попадёт в реестр:

```python
class Exporter(metaclass=PluginMeta):
    pass
```

Конкретные плагины:

```python
class CsvExporter(Exporter):
    plugin_name = "csv"


class JsonExporter(Exporter):
    plugin_name = "json"
```

Проверим реестр:

```python
print(sorted(PluginMeta.registry))  # ['csv', 'json']
print(PluginMeta.registry["json"] is JsonExporter)  # True
```

Класс был зарегистрирован в момент выполнения его объявления.

## Создание объекта через реестр {#sozdanie-obekta-cherez-reestr}

Добавим поведение экспортёрам:

```python
class CsvExporter(Exporter):
    plugin_name = "csv"

    def export(self) -> str:
        return "CSV data"


class JsonExporter(Exporter):
    plugin_name = "json"

    def export(self) -> str:
        return "JSON data"
```

Фабрика выбирает класс из реестра:

```python
def create_exporter(format_name: str) -> Exporter:
    exporter_class = PluginMeta.registry[format_name]
    return exporter_class()


exporter = create_exporter("json")

print(type(exporter) is JsonExporter)  # True
print(exporter.export())               # JSON data
```

Метакласс отвечает только за регистрацию. Создание выбранного экземпляра остаётся обычной логикой функции.

## Проверка повторяющихся имён {#proverka-povtoryayushchikhsya-imyon}

Два класса не должны незаметно использовать один ключ:

```python
class PluginMeta(type):
    registry: dict[str, type] = {}

    def __new__(mcls, name, bases, namespace):
        cls = super().__new__(mcls, name, bases, namespace)
        plugin_name = namespace.get("plugin_name")

        if plugin_name is None:
            return cls

        if plugin_name in mcls.registry:
            raise TypeError(f"Duplicate plugin name: {plugin_name}")

        mcls.registry[plugin_name] = cls
        return cls
```

Теперь повторное имя вызывает понятную ошибку при объявлении класса.

## Почему изменяемый атрибут здесь допустим {#pochemu-izmenyaemyy-atribut-zdes-dopustim}

Обычно изменяемая коллекция в атрибуте класса опасна, если разработчик ожидает отдельную копию для каждого экземпляра.

В реестре нужна противоположная семантика: все создаваемые классы должны записываться в один общий словарь. Поэтому `registry` намеренно является атрибутом метакласса.

## Ограничения подхода {#ogranicheniya-podkhoda}

- регистрация происходит при импорте модуля;
- класс не появится в реестре, пока его модуль не импортирован;
- глобальный изменяемый реестр нужно очищать или изолировать в тестах;
- тяжёлая логика в метаклассе замедляет импорт;
- скрытая автоматическая регистрация может затруднить чтение кода.

Метакласс должен выполнять короткое и предсказуемое действие.

## Типичные ошибки {#tipichnye-oshibki}

1. Проверять атрибут после первого запроса вместо объявления класса.
2. Регистрировать базовый абстрактный класс как обычный плагин.
3. Перезаписывать существующий ключ реестра без ошибки.
4. Ожидать классы из модулей, которые ещё не импортированы.
5. Выполнять сетевые запросы или подключение к базе внутри метакласса.
6. Хранить экземпляры в реестре, когда нужны сами классы.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Добавь проверку, что `plugin_name` является непустой строкой.
2. Создай реестр обработчиков команд `start`, `stop` и `status`.
3. Напиши функцию `create_handler(command)`, создающую нужный обработчик.
4. Подумай, как очищать реестр между автоматическими тестами.

## Краткое повторение {#kratkoe-povtorenie}

- Метакласс может остановить создание неправильного класса.
- `namespace` позволяет проверить атрибуты, объявленные именно в новом классе.
- Реестр хранит классы, чтобы позже выбирать и создавать их динамически.
- Регистрация происходит во время объявления класса и импорта модуля.
- Автоматизация должна оставаться короткой и понятной.

<RelatedTopics
    :items="[
        { title: 'Обзор метаклассов', href: '/python/yazyk-python/klassy/metaklassy/' },
        { title: 'Собственный метакласс', href: '/python/yazyk-python/klassy/metaklassy/sobstvennyy-metaklass-i-new' },
        { title: 'Этапы создания класса', href: '/python/yazyk-python/klassy/metaklassy/prepare-init-call-i-etapy-sozdaniya' },
        { title: 'Практика по метаклассам', href: '/python/yazyk-python/klassy/metaklassy/praktika-metaklassov' },
    ]"
/>
