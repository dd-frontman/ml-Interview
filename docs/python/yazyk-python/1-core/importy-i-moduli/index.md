---
title: "Импорты и модули в Python"
description: "Карта раздела об импортах Python: модули и пакеты, пространства имён, формы импорта, sys.modules, байт-код pyc и поиск модулей."
tags:
  - "python"
  - "core"
  - "imports"
  - "modules"
updatedAt: "2026-11-13"
search: false
---
## Зачем нужны импорты {#zachem-nuzhny-importy}

Импорт позволяет использовать код из другого модуля и не копировать одинаковые функции между файлами.

С помощью импортов можно подключать:

- модули стандартной библиотеки;
- установленные сторонние пакеты;
- собственные модули проекта.

Например, функция `choice()` уже реализована в стандартном модуле `random`:

```python
import random

numbers = [1]
random_number = random.choice(numbers)

print(random_number)  # 1
```

После `import random` имя `random` ссылается на объект модуля. Его функции доступны через точку.

## Карта раздела {#karta-razdela}

| Тема | Что изучишь |
| --- | --- |
| [Модули, пакеты и библиотеки](./moduli-pakety-i-biblioteki.md) | Чем модуль отличается от пакета и откуда берётся импортируемый код |
| [Пространства имён и `dir()`](./prostranstva-imen-i-dir.md) | Где появляются импортированные имена и как исследовать объект модуля |
| [Формы импорта](./formy-importa.md) | `import`, `from ... import`, псевдонимы и проблемы `import *` |
| [Как работает импорт и `.pyc`](./protsess-importa-i-bayt-kod.md) | Загрузка модуля, `sys.modules`, байт-код и папка `__pycache__` |
| [`if __name__ == "__main__"`](./name-main.md) | Как отличить прямой запуск файла от импорта |
| [Абсолютные и относительные импорты](./absolyutnye-i-otnositelnye-importy.md) | Полные пути, точки в импортах и запуск через `python -m` |
| [Поиск модулей и ошибки](./poisk-modulya-i-oshibki.md) | `sys.path`, `ModuleNotFoundError`, конфликты имён и побочные эффекты |
| [Практика импортов](./praktika-importov.md) | Небольшая задача на создание собственного пакета |

Изучай страницы по порядку: сначала разберись с модулем и пространством имён, затем переходи к механизму импорта и структуре пакетов.

## Минимальный пример собственного модуля {#minimalnyy-primer-sobstvennogo-modulya}

Создадим два файла:

```text
project/
├── math_operations.py
└── main.py
```

В модуле `math_operations.py` находится функция:

```python
def add(a: int, b: int) -> int:
    return a + b
```

Файл `main.py` импортирует и вызывает её:

```python
from math_operations import add

print(add(2, 3))  # 5
```

Python находит файл `math_operations.py`, выполняет его код и связывает имя `add` с созданной функцией.

## Краткая шпаргалка {#kratkaya-shpargalka}

```python
# Импорт модуля
import random

# Импорт конкретного имени
from random import choice

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
3. Группируй стандартную библиотеку, сторонние пакеты и модули проекта.
4. Не выполняй тяжёлую работу на верхнем уровне импортируемого модуля.
5. Запускай вложенные модули через `python -m package.module`.
6. Не называй свои файлы именами стандартных модулей.

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python: Modules', href: 'https://docs.python.org/3/tutorial/modules.html' },
        { title: 'Python: The import system', href: 'https://docs.python.org/3/reference/import.html' },
        { title: 'Python: sys.path', href: 'https://docs.python.org/3/library/sys.html#sys.path' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Модули, venv и pip', href: '/python/yazyk-python/1-core/moduli-venv-i-pip' },
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python/' },
        { title: 'Область видимости', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/' },
        { title: 'JSON и сериализация', href: '/python/ekosistema-python/json-i-serializatsiya' },
    ]"
/>
