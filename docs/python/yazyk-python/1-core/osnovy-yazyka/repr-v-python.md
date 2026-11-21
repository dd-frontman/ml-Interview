---
title: "repr() в Python"
description: "Как repr() показывает однозначное строковое представление объекта, чем отличается от str() и как связан с __repr__."
tags:
  - "python"
  - "core"
  - "builtins"
  - "repr"
updatedAt: "2026-11-21"
---
## Зачем нужен `repr()` {#zachem-nuzhen-repr}

В строке могут находиться пробелы, переносы и другие невидимые символы. Обычный `print()` показывает результат для чтения, поэтому причину ошибки не всегда видно.

```python
text = "Python\nML"

print(text)
```

Результат:

```text
Python
ML
```

`repr()` возвращает строку, в которой видны кавычки и управляющие последовательности:

```python
text = "Python\nML"

print(repr(text))  # 'Python\nML'
```

Теперь видно, что между словами находится символ переноса строки `\n`. Поэтому `repr()` часто используют при отладке: результат старается быть однозначным и содержать информацию, которая помогает понять значение и тип объекта.

## Что возвращает `repr()` {#chto-vozvrashchaet-repr}

`repr(object)` принимает объект и возвращает `str`. Функция сама ничего не печатает.

```python
result = repr("Python")

print(result)        # 'Python'
print(type(result))  # <class 'str'>
```

Кавычки в результате помогают отличить строку от числа:

```python
print(repr("42"))  # '42'
print(repr(42))    # 42
```

Для многих встроенных типов результат похож на выражение Python, с помощью которого можно получить равное значение:

```python
value = [1, 2, 3]
text = repr(value)

print(text)  # [1, 2, 3]
```

Это не общий контракт для всех объектов. `repr()` не является форматом сериализации и не гарантирует, что результат можно передать в `eval()`. Для хранения и обмена данными используй подходящий формат, например JSON, а не связку `repr()` и `eval()`.

## Чем `repr()` отличается от `str()` {#chem-repr-otlichaetsya-ot-str}

`str()` формирует удобный текст для пользователя, а `repr()` предназначен прежде всего для разработчика и отладки.

```python
text = "  Python\n"

print(str(text))
print(repr(text))  # '  Python\n'
```

Первый `print()` выведет пробелы и настоящий перенос строки. Второй покажет структуру значения в одной строке.

Для чисел результаты часто совпадают:

```python
print(str(3.14))   # 3.14
print(repr(3.14))  # 3.14
```

Одинаковый вывод не означает, что функции взаимозаменяемы. Разница становится заметна у строк и у классов, которые по-разному определяют `__str__()` и `__repr__()`.

## Метод `__repr__()` в своём классе {#metod-repr-v-svoyom-klasse}

Когда выполняется `repr(object)`, Python вызывает метод `object.__repr__()`. Свой класс может определить этот метод и вернуть полезное представление экземпляра.

```python
class User:
    def __init__(self, *, name: str, age: int) -> None:
        self.name = name
        self.age = age

    def __repr__(self) -> str:
        return f"User(name={self.name!r}, age={self.age!r})"


user = User(name="Alice", age=30)

print(repr(user))  # User(name='Alice', age=30)
```

Конверсия `!r` внутри f-строки применяет `repr()` к значению. Благодаря этому строковое имя остаётся в кавычках, а специальные символы не теряются.

```python
name = "Alice\nAdmin"

print(f"name={name!r}")  # name='Alice\nAdmin'
```

`__repr__()` обязан вернуть строку. Если вернуть объект другого типа, вызов `repr()` завершится с `TypeError`.

Если класс не определяет `__repr__()`, используется реализация базового класса `object`. Обычно она показывает имя класса и служебную информацию об экземпляре, но не раскрывает значения его атрибутов.

Если определить `__repr__()`, но не определить `__str__()`, Python использует результат `__repr__()` и для `str(object)`, и для `print(object)`.

## Где встречается `repr()` {#gde-vstrechaetsya-repr}

- интерактивный интерпретатор Python показывает результат выражения через `repr()`;
- контейнеры используют представления элементов, поэтому строки в списке видны с кавычками;
- в f-строке запись `{value!r}` явно запрашивает `repr(value)`;
- при отладке `repr()` помогает увидеть пробелы, `\n`, `\t` и другие скрытые символы.

```python
items = ["Python", "ML\nEngineer"]

print(items)  # ['Python', 'ML\nEngineer']
```

## Типичные ошибки {#tipichnye-oshibki}

1. Ожидать, что `repr()` напечатает значение. Функция возвращает строку, поэтому для вывода нужен `print(repr(value))`.
2. Считать результат безопасным форматом хранения. Для JSON используй `json.dumps()` и `json.loads()`.
3. Вызывать `eval(repr(value))` для данных из внешнего источника. `eval()` выполняет код и не подходит для недоверенных данных.
4. Возвращать из `__repr__()` не строку. Метод должен вернуть объект типа `str`.

## Самостоятельная практика {#samostoyatelnaya-praktika}

Темы: `repr()`, `str()`, управляющие последовательности и `__repr__()`.

1. Создай строку с пробелами по краям, табуляцией `\t` и переносом `\n`. Сравни вывод `print(text)` и `print(repr(text))`.
2. Создай класс `Book` с атрибутами `title` и `year`. Реализуй `__repr__()`, чтобы результат выглядел как `Book(title='Python', year=2026)`.

Подсказка для второй задачи: внутри f-строки примени `!r` к обоим атрибутам.

## Шпаргалка {#shpargalka}

| Синтаксис | Что происходит |
| --- | --- |
| `repr(value)` | Возвращает представление объекта для разработчика |
| `str(value)` | Возвращает текст для пользователя |
| `f"{value!r}"` | Вызывает `repr(value)` внутри f-строки |
| `object.__repr__()` | Настраивает результат `repr(object)` для своего класса |

<OfficialDocsLinks
    :links="[
        { title: 'Python: repr()', href: 'https://docs.python.org/3/library/functions.html#repr' },
        { title: 'Python: object.__repr__()', href: 'https://docs.python.org/3/reference/datamodel.html#object.__repr__' },
        { title: 'Python: f-strings', href: 'https://docs.python.org/3/reference/lexical_analysis.html#f-strings' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Основные функции', href: '/python/yazyk-python/1-core/osnovnye-funktsii' },
        { title: 'Операции со строками', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami' },
        { title: 'Классы в Python', href: '/python/yazyk-python/klassy/klassy-glavnaya' },
        { title: 'JSON и сериализация', href: '/python/ekosistema-python/json-i-serializatsiya' },
    ]"
/>
