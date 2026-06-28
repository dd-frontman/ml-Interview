---
title: "Исключения, context managers и файлы"
description: "Практический минимум Python по исключениям, with/context managers и безопасной работе с файлами для ML-кода."
tags:
  - "python"
  - "core"
  - "exceptions"
  - "files"
updatedAt: "2026-06-13"
---
## Big Picture

В ML-коде ошибки часто возникают на границе с внешним миром: файл не найден, данные пустые, формат изменился, модельный артефакт поврежден.

Поэтому нужно уметь:

- явно падать на неправильных данных;
- не глотать исключения молча;
- закрывать файлы и ресурсы через `with`;
- оставлять понятное сообщение для отладки.

## Исключения

```python
def read_threshold(value: str) -> float:
    try:
        threshold = float(value)
    except ValueError as error:
        raise ValueError(f"Invalid threshold: {value}") from error

    if not 0 <= threshold <= 1:
        raise ValueError("Threshold must be between 0 and 1")

    return threshold
```

Практическое правило: ловить только те ошибки, которые ты умеешь обработать или обогатить контекстом.

## `try`, `except`, `else`, `finally`

```python
try:
    result = train_model()
except ValueError as error:
    print(f"Bad training data: {error}")
else:
    print("Training finished:", result)
finally:
    print("Cleanup step")
```

- `except` - обработка ошибки;
- `else` - код без ошибки;
- `finally` - код, который выполняется всегда.

## `with` и context manager

`with` гарантирует закрытие ресурса.

```python
from pathlib import Path

path = Path("models/metadata.json")

with path.open("r", encoding="utf-8") as file:
    content = file.read()
```

Для файлов, сетевых соединений, временных директорий и lock-файлов это безопаснее ручного `open`/`close`.

## Практический пример

```python
import json
from pathlib import Path


def load_metadata(path: Path) -> dict:
    if not path.exists():
        raise FileNotFoundError(f"Metadata file not found: {path}")

    with path.open("r", encoding="utf-8") as file:
        metadata = json.load(file)

    required = {"model_version", "feature_columns", "threshold"}
    missing = required - set(metadata)
    if missing:
        raise ValueError(f"Missing metadata fields: {sorted(missing)}")

    return metadata
```

Такой код падает рано и понятно, а не дает модели работать с неполным контрактом.

## Типичные ошибки

1. Ловить `Exception` и ничего не делать.
   Проблема: настоящая ошибка скрывается.
   Решение: ловить конкретный тип или пробрасывать ошибку дальше.

2. Открывать файлы без `with`.
   Проблема: ресурс может остаться открытым.
   Решение: использовать context manager.

3. Писать `except:`.
   Проблема: ловятся даже системные исключения.
   Решение: указывать конкретный класс ошибки.

4. Терять исходную ошибку.
   Проблема: стек становится менее полезным.
   Решение: использовать `raise NewError(...) from error`.

## Cheat-sheet

| Задача | Инструмент |
| --- | --- |
| Проверить входные данные | `raise ValueError(...)` |
| Ошибка отсутствующего файла | `FileNotFoundError` |
| Обогатить ошибку контекстом | `raise ... from error` |
| Безопасно открыть файл | `with path.open(...) as file` |
| Выполнить cleanup | `finally` или context manager |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python Errors and Exceptions', href: 'https://docs.python.org/3/tutorial/errors.html' },
        { title: 'Python with statement', href: 'https://docs.python.org/3/reference/compound_stmts.html#the-with-statement' },
        { title: 'Python pathlib', href: 'https://docs.python.org/3/library/pathlib.html' },
        { title: 'Python json module', href: 'https://docs.python.org/3/library/json.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Функции, классы, модули, venv и pip', href: '/python/yazyk-python/1-core/python-core-funktsii-klassy-moduli-venv-i-pip' },
        { title: 'Загрузка данных и форматы', href: '/python/ekosistema-python/zagruzka-dannykh-i-formaty' },
        { title: 'Артефакты модели и inference', href: '/python/ekosistema-python/artefakty-modeli-i-inference' },
    ]"
/>
