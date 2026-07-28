---
title: "Импорты и модули в Python"
description: "Конспект по импортам в Python: стандартная библиотека, собственные модули, пространства имен, варианты import, абсолютные и относительные импорты."
tags:
  - "python"
  - "core"
  - "imports"
  - "modules"
updatedAt: "2026-07-21"
---
## Зачем нужны импорты

Импорт позволяет использовать код из другого модуля и не копировать одни и те же функции между файлами.

С помощью импортов можно подключать:

- встроенные модули стандартной библиотеки;
- установленные сторонние пакеты;
- собственные модули проекта.

Например, функция `choice()` уже реализована в стандартном модуле `random`.

```python
import random

numbers = [1, 2, 3, 4, 5]
random_number = random.choice(numbers)

print(random_number)
```

После `import random` имя `random` ссылается на объект модуля. Его функции доступны через точку.

## Модуль и пакет

Модуль - это файл с расширением `.py`.

```text
math_operations.py
```

Внутри модуля можно объявлять функции, классы и переменные.

```python
# math_operations.py

def add(x, y):
    return x + y


def subtract(x, y):
    return x - y
```

Пакет - это директория, объединяющая несколько модулей.

```text
calculator/
  __init__.py
  math_operations.py
  validators.py
main.py
```

Файл `__init__.py` обозначает пакет и может содержать код его инициализации.

## Откуда берутся модули

### Стандартная библиотека

Стандартная библиотека устанавливается вместе с Python. Ее не нужно загружать через `pip`.

Примеры:

- `random` - случайный выбор и генерация чисел;
- `json` - работа с JSON;
- `datetime` - дата и время;
- `pathlib` - работа с путями;
- `csv` - чтение и запись CSV.

```python
import random
import json
import datetime
```

### Сторонние пакеты

Сторонние библиотеки устанавливаются отдельно.

```bash
pip install requests
```

После установки пакет можно импортировать.

```python
import requests
```

Если пакет не установлен в активном окружении, Python вызовет `ModuleNotFoundError`.

### Собственные модули

Функции из собственного файла импортируются так же, как функции библиотек.

```python
from calculator.math_operations import add, subtract

print(add(10, 5))       # 15
print(subtract(10, 5))  # 5
```

## Пространство имён

Пространство имён связывает имена с объектами.

После запуска файла его переменные, функции и импортированные модули попадают в глобальное пространство имён этого модуля.

```python
my_number = 10

print(globals().keys())
```

`globals()` возвращает словарь глобального пространства имён. Среди его ключей можно найти `my_number`.

После импорта появляется новое глобальное имя.

```python
import random

print("random" in globals())  # True
```

У каждого модуля собственное глобальное пространство имён. Переменная из одного файла не становится автоматически доступной в другом.

## `dir()`

Функция `dir()` показывает имена атрибутов объекта.

```python
import random

print(dir(random))
```

В результате можно найти `choice`, `randint`, `shuffle` и другие имена модуля `random`.

`dir()` полезен для знакомства с объектом, но назначение функций лучше проверять по документации.

## Встроенные имена

Функции `print`, `len`, `range`, типы `list`, `dict` и другие базовые имена находятся в модуле `builtins`.

```python
import builtins

print("len" in dir(builtins))    # True
print("print" in dir(builtins))  # True
```

Python автоматически делает эти имена доступными, поэтому писать `import builtins` для обычного использования не требуется.

## `import module`

Импорт всего модуля сохраняет его имя в текущем пространстве имён.

```python
from calculator import math_operations

result = math_operations.add(1, 2)
print(result)  # 3
```

Преимущество этой формы - по обращению `math_operations.add` сразу видно, откуда пришла функция.

Она особенно удобна, если модуль содержит много связанных функций или в проекте возможны одинаковые имена.

## `from module import name`

Можно импортировать конкретные имена.

```python
from calculator.math_operations import add, subtract

print(add(1, 2))       # 3
print(subtract(2, 1))  # 1
```

Теперь к функциям обращаются без имени модуля.

Важно: эта запись не означает, что Python читает только две функции. Сначала модуль загружается целиком, после чего выбранные имена добавляются в текущее пространство имён.

Используй эту форму, когда импортируемых имен немного и их происхождение понятно из контекста.

## Псевдоним через `as`

Импортированному объекту можно дать другое имя.

```python
from calculator.math_operations import add as addition

print(addition(4, 5))  # 9
```

```python
import numpy as np
import pandas as pd
```

Не стоит придумывать неочевидные сокращения: они усложняют чтение кода.

## Почему не стоит использовать `import *`

Звездочка импортирует в текущее пространство имён множество доступных имен.

```python
from calculator.math_operations import *
```

Такая запись нежелательна, потому что:

- непонятно, откуда появилась функция;
- импорт может заменить уже существующее имя;
- IDE и статическому анализатору сложнее проверять код;
- изменение модуля может неожиданно изменить импортирующий файл.

Лучше перечислить нужные имена явно.

```python
from calculator.math_operations import add, subtract
```

## Что происходит при импорте

При первом импорте Python:

1. Ищет модуль.
2. Создает объект модуля.
3. Выполняет его код сверху вниз.
4. Сохраняет загруженный модуль в `sys.modules`.
5. Связывает нужное имя с объектом модуля или его атрибутом.

Поэтому код на верхнем уровне модуля выполняется при импорте.

```python
# notifications.py
print("Module is loaded")


def send_message():
    print("Message sent")
```

```python
import notifications
# Module is loaded
```

Тело `send_message()` при импорте не выполняется. Python только создает функцию. Ее код запустится после вызова.

```python
notifications.send_message()
# Message sent
```

В рамках одного запуска интерпретатора повторный обычный импорт берет модуль из `sys.modules`, поэтому верхнеуровневый код обычно не выполняется второй раз.

## `if __name__ == "__main__"`

Переменная `__name__` помогает отличить прямой запуск файла от импорта.

```python
def add(x, y):
    return x + y


if __name__ == "__main__":
    print(add(2, 3))
```

При прямом запуске:

```bash
python math_operations.py
```

значение `__name__` равно `"__main__"`, и пример выполнится.

При импорте:

```python
import math_operations
```

`__name__` будет равно имени модуля, поэтому код внутри условия не запустится.

Под этим условием обычно размещают:

- демонстрационные вызовы;
- CLI-точку входа;
- запуск приложения;
- код, который не должен выполняться при импорте.

## Абсолютные импорты

Абсолютный импорт указывает полный путь от корневого пакета проекта.

```python
from calculator.math_operations import add
```

Такие импорты обычно легче читать: путь не зависит от положения текущего модуля внутри пакета.

Пример структуры:

```text
project/
  calculator/
    __init__.py
    math_operations.py
  main.py
```

Если команда запускается из `project`, импорт `calculator.math_operations` будет найден.

## Относительные импорты

Относительный импорт задает путь от текущего пакета.

```python
from .math_operations import add
from ..validators import ensure_positive
```

Обозначения:

- `.` - текущий пакет;
- `..` - родительский пакет.

Относительные импорты работают, когда модуль запускается в контексте пакета. При прямом запуске вложенного файла Python может не знать его родительский пакет.

Например, вместо:

```bash
python calculator/report.py
```

обычно используют запуск модуля от корня проекта:

```bash
python -m calculator.report
```

Для небольшого проекта чаще проще придерживаться абсолютных импортов.

## Как Python ищет модуль

Пути поиска находятся в `sys.path`.

```python
import sys

for path in sys.path:
    print(path)
```

Обычно Python проверяет:

- директорию запуска или расположение запускаемого скрипта;
- пути из переменной окружения `PYTHONPATH`;
- стандартную библиотеку;
- директории установленных пакетов `site-packages`.

Если корень проекта отсутствует в путях поиска, импорт собственного пакета завершится `ModuleNotFoundError`.

Не стоит исправлять структуру проекта случайными вызовами `sys.path.append(...)` внутри модулей. Надежнее запускать код от корня проекта, использовать `python -m` и корректно оформлять пакет.

## Частые ошибки

### `ModuleNotFoundError`

```text
ModuleNotFoundError: No module named 'calculator'
```

Что проверить:

1. Правильно ли написано имя модуля.
2. Из какой директории запущена команда.
3. Активировано ли нужное виртуальное окружение.
4. Установлен ли сторонний пакет.
5. Находится ли корень проекта в `sys.path`.

### Конфликт с именем стандартного модуля

Если назвать собственный файл `random.py`, то `import random` может загрузить этот файл вместо стандартного модуля.

Не используй для своих файлов имена популярных модулей и пакетов:

```text
random.py
json.py
requests.py
datetime.py
```

### Импорт с побочными эффектами

Не запускай на верхнем уровне модуля долгие вычисления, запросы к API или бесконечные циклы. Они выполнятся сразу при импорте.

```python
def main():
    run_application()


if __name__ == "__main__":
    main()
```

## Практическая задача

Создай пакет со следующей структурой:

```text
shop/
  __init__.py
  prices.py
main.py
```

В `prices.py` создай две функции:

```python
def apply_discount(price: float, discount: float) -> float:
    return price * (1 - discount / 100)


def add_tax(price: float, tax: float) -> float:
    return price * (1 + tax / 100)
```

В `main.py`:

1. Импортируй обе функции явным импортом.
2. Рассчитай цену товара после скидки 10 процентов.
3. Добавь к полученной цене налог 20 процентов.
4. Округли результат до двух знаков.

Один из вариантов решения:

```python
from shop.prices import add_tax, apply_discount

price = 1000
discounted_price = apply_discount(price, 10)
final_price = add_tax(discounted_price, 20)

print(round(final_price, 2))  # 1080.0
```

## Краткая шпаргалка

```python
# Импорт модуля
import random
random.choice([1, 2, 3])

# Импорт конкретного имени
from random import choice
choice([1, 2, 3])

# Импорт с псевдонимом
import pandas as pd

# Импорт собственного модуля
from calculator.math_operations import add

# Относительный импорт внутри пакета
from .math_operations import add
```

Практические правила:

1. Используй явные импорты вместо `import *`.
2. Обычно размещай импорты в начале файла.
3. Сначала стандартная библиотека, затем сторонние пакеты, затем модули проекта.
4. Не выполняй тяжелую работу на верхнем уровне импортируемого модуля.
5. Запускай вложенные модули через `python -m package.module`.
6. Не называй свои файлы именами стандартных модулей.

## Официальная документация

<OfficialDocsLinks
    :links="[
        { title: 'Python: Modules', href: 'https://docs.python.org/3/tutorial/modules.html' },
        { title: 'Python: The import system', href: 'https://docs.python.org/3/reference/import.html' },
        { title: 'Python: Built-in functions', href: 'https://docs.python.org/3/library/functions.html' },
        { title: 'Python: sys.path', href: 'https://docs.python.org/3/library/sys.html#sys.path' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Модули, venv и pip', href: '/python/yazyk-python/1-core/moduli-venv-i-pip' },
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python' },
        { title: 'Область видимости', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh' },
        { title: 'JSON и сериализация', href: '/python/ekosistema-python/json-i-serializatsiya' },
    ]"
/>
