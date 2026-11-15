---
title: "Формы импорта в Python"
description: "Разница между import module, from module import name, псевдонимами as и импортом через звёздочку."
tags:
  - "python"
  - "core"
  - "imports"
updatedAt: "2026-11-13"
---
## `import module` {#import-module}

Импорт всего модуля сохраняет его имя в текущем пространстве имён:

```python
from calculator import math_operations

result = math_operations.add(1, 2)
print(result)  # 3
```

Преимущество этой формы — по обращению `math_operations.add` сразу видно, откуда пришла функция.

Она особенно удобна, если модуль содержит много связанных функций или в проекте возможны одинаковые имена.

## `from module import name` {#from-module-import-name}

Можно импортировать конкретные имена:

```python
from calculator.math_operations import add, subtract

print(add(1, 2))       # 3
print(subtract(2, 1))  # 1
```

Теперь к функциям обращаются без имени модуля.

Важно: эта запись не означает, что Python читает только две функции. Сначала модуль загружается целиком, после чего выбранные имена добавляются в текущее пространство имён.

Используй эту форму, когда импортируемых имён немного и их происхождение понятно из контекста.

## Псевдоним через `as` {#psevdonim-cherez-as}

Импортированному объекту можно дать другое имя:

```python
from calculator.math_operations import add as addition

print(addition(4, 5))  # 9
```

Общепринятые псевдонимы библиотек:

```python
import numpy as np
import pandas as pd
```

Псевдоним полезен, если имя длинное или в экосистеме уже существует понятное соглашение. Не придумывай неочевидные сокращения: они усложняют чтение кода.

## Почему не стоит использовать `import *` {#pochemu-ne-stoit-ispolzovat-import}

Звёздочка импортирует в текущее пространство имён множество доступных имён:

```python
from calculator.math_operations import *
```

Такая запись нежелательна, потому что:

- непонятно, откуда появилась функция;
- импорт может заменить уже существующее имя;
- IDE и статическому анализатору сложнее проверять код;
- изменение модуля может неожиданно изменить импортирующий файл.

Лучше перечислить нужные имена явно:

```python
from calculator.math_operations import add, subtract
```

## Как выбрать форму {#kak-vybrat-formu}

| Ситуация | Подход |
| --- | --- |
| Нужно несколько связанных функций | `import module` |
| Нужны одно-два понятных имени | `from module import name` |
| У модуля длинное общепринятое имя | `import module as alias` |
| Хочется импортировать всё | Лучше перечислить нужные имена |

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Импортируй модуль `math` и вызови `math.sqrt(16)`.
2. Импортируй только `sqrt` и сравни синтаксис вызова.
3. Придумай пример конфликта двух функций с одинаковым именем и реши его с помощью `as`.

<RelatedTopics
    :items="[
        { title: 'Обзор импортов', href: '/python/yazyk-python/1-core/importy-i-moduli/' },
        { title: 'Пространства имён', href: '/python/yazyk-python/1-core/importy-i-moduli/prostranstva-imen-i-dir' },
        { title: 'Абсолютные и относительные импорты', href: '/python/yazyk-python/1-core/importy-i-moduli/absolyutnye-i-otnositelnye-importy' },
    ]"
/>
