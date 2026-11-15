---
title: "Абсолютные и относительные импорты"
description: "Полные и относительные пути импорта в пакетах Python, значение точек и правильный запуск вложенных модулей через python -m."
tags:
  - "python"
  - "core"
  - "imports"
  - "packages"
updatedAt: "2026-11-13"
---
## Структура примера {#struktura-primera}

Рассмотрим пакет:

```text
project/
├── main.py
└── calculator/
    ├── __init__.py
    ├── math_operations.py
    ├── validators.py
    └── reports/
        ├── __init__.py
        └── summary.py
```

Файл `summary.py` должен использовать функцию `add()` из `math_operations.py`.

## Абсолютные импорты {#absolyutnye-importy}

Абсолютный импорт указывает полный путь от корневого пакета проекта:

```python
from calculator.math_operations import add
```

Путь читается одинаково из разных модулей проекта и явно показывает происхождение объекта.

Преимущества:

- импорт легко найти поиском;
- путь понятен без знания расположения текущего файла;
- перемещение текущего модуля реже ломает импорт.

Недостаток — длинные пути в больших проектах.

## Относительные импорты {#otnositelnye-importy}

Относительный импорт задаёт путь от текущего пакета:

```python
from ..math_operations import add
from ..validators import ensure_positive
```

Обозначения:

- `.` — текущий пакет;
- `..` — родительский пакет;
- `...` — пакет ещё на один уровень выше.

В файле `calculator/reports/summary.py` запись `..math_operations` означает: подняться из пакета `reports` в пакет `calculator` и найти модуль `math_operations`.

## Когда относительный импорт работает {#kogda-otnositelnyy-import-rabotaet}

Относительный импорт работает, когда Python знает, к какому пакету принадлежит модуль.

Прямой запуск вложенного файла может завершиться ошибкой:

```bash
python calculator/reports/summary.py
```

В таком режиме Python воспринимает `summary.py` как отдельный скрипт и может не определить родительский пакет.

Запускай модуль от корня проекта через `-m`:

```bash
python -m calculator.reports.summary
```

Тогда Python понимает полное имя модуля и корректно обрабатывает относительные импорты.

## Что выбрать {#chto-vybrat}

Для небольшого проекта чаще проще использовать абсолютные импорты:

```python
from calculator.math_operations import add
```

Относительные импорты полезны внутри тесно связанного пакета:

```python
from .validators import ensure_positive
```

Главное — следовать одному подходу внутри проекта и не смешивать стили без причины.

## Типичные ошибки {#tipichnye-oshibki}

1. Запускать вложенный модуль как обычный файл, хотя в нём есть относительные импорты.
2. Указывать неверное количество точек.
3. Путать корень файловой системы с корневым пакетом проекта.
4. Использовать длинную цепочку `....module`, которая делает структуру трудно читаемой.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Запиши абсолютный и относительный импорт для двух модулей одного пакета.
2. Запусти вложенный модуль через `python -m`.
3. Объясни, почему `from .module import name` нельзя надёжно использовать в произвольном одиночном скрипте.

<RelatedTopics
    :items="[
        { title: 'Обзор импортов', href: '/python/yazyk-python/1-core/importy-i-moduli/' },
        { title: 'Модули и пакеты', href: '/python/yazyk-python/1-core/importy-i-moduli/moduli-pakety-i-biblioteki' },
        { title: 'Поиск модулей и ошибки', href: '/python/yazyk-python/1-core/importy-i-moduli/poisk-modulya-i-oshibki' },
    ]"
/>
