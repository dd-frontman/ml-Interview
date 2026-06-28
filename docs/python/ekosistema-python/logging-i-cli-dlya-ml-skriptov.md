---
title: "Logging и CLI для ML-скриптов"
description: "Как запускать ML-скрипты на Python с параметрами, логированием и понятным train/predict workflow."
tags:
  - "python"
  - "logging"
  - "cli"
  - "ml"
updatedAt: "2026-06-13"
---
## Big Picture

ML-скрипт должен запускаться воспроизводимо и оставлять понятный след:

- с какими параметрами он был запущен;
- какой датасет прочитал;
- куда сохранил модель;
- какие метрики получил;
- на каком шаге упал.

Для этого достаточно `argparse` и `logging` из стандартной библиотеки.

## CLI через `argparse`

```python
import argparse


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-path", required=True)
    parser.add_argument("--model-path", required=True)
    parser.add_argument("--threshold", type=float, default=0.5)
    return parser.parse_args()
```

Такой скрипт можно запускать из терминала, CI или cron-like процесса.

## Logging

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

logger = logging.getLogger(__name__)

logger.info("Training started")
```

В ML-коде лучше не использовать `print` для рабочих событий. `logging` позволяет управлять уровнем детализации.

## Практический скелет

```python
import argparse
import logging

logger = logging.getLogger(__name__)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-path", required=True)
    parser.add_argument("--model-path", required=True)
    return parser.parse_args()


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    args = parse_args()

    logger.info("Read data from %s", args.data_path)
    logger.info("Save model to %s", args.model_path)


if __name__ == "__main__":
    main()
```

## `python -m`

Для модульного запуска структура может быть такой:

```text
src/
  ml_project/
    __init__.py
    train.py
    predict.py
```

Запуск:

```bash
python -m ml_project.train --data-path data/train.parquet --model-path models/model.joblib
```

## Типичные ошибки

1. Хардкодить пути внутри скрипта.
   Проблема: скрипт нельзя переиспользовать.
   Решение: передавать пути через CLI.

2. Использовать `print` вместо `logging`.
   Проблема: сложно фильтровать и собирать логи.
   Решение: `logger.info`, `logger.warning`, `logger.exception`.

3. Не логировать параметры запуска.
   Проблема: нельзя повторить эксперимент.
   Решение: логировать входные пути, seed, threshold и output path.

4. Выполнять код на уровне импорта.
   Проблема: модуль нельзя безопасно импортировать.
   Решение: использовать `main()` и `if __name__ == "__main__"`.

## Cheat-sheet

| Задача | Инструмент |
| --- | --- |
| CLI-параметры | `argparse` |
| Рабочие события | `logging.info` |
| Предупреждения | `logging.warning` |
| Ошибка со stack trace | `logging.exception` |
| Запуск модуля | `python -m package.module` |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python argparse', href: 'https://docs.python.org/3/library/argparse.html' },
        { title: 'Python logging', href: 'https://docs.python.org/3/library/logging.html' },
        { title: 'Python modules as scripts', href: 'https://docs.python.org/3/using/cmdline.html#cmdoption-m' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Воспроизводимость ML-кода', href: '/python/ekosistema-python/vosproizvodimost-ml-koda' },
        { title: 'Загрузка данных и форматы', href: '/python/ekosistema-python/zagruzka-dannykh-i-formaty' },
        { title: 'Исключения, context managers и файлы', href: '/python/yazyk-python/isklyucheniya-context-managers-i-fayly' },
    ]"
/>
