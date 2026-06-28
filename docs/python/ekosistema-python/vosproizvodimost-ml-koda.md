---
title: "Воспроизводимость ML-кода"
description: "Как делать ML-код на Python воспроизводимым: окружение, зависимости, seed, конфиги, структура проекта и контроль артефактов."
tags:
  - "python"
  - "ml"
  - "reproducibility"
  - "mlops"
updatedAt: "2026-06-13"
---
## Big Picture

В ML недостаточно получить хорошую метрику один раз. Нужно уметь повторить результат:

- на другой машине;
- в CI;
- через неделю;
- после изменения данных или зависимостей.

Воспроизводимость держится на четырех вещах: окружение, данные, код, параметры запуска.

## Окружение и зависимости

Минимальный уровень:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Для командной работы лучше иметь lock-файл или другой механизм фиксации транзитивных зависимостей.

Что фиксировать:

- версию Python;
- версии библиотек;
- способ установки;
- команды запуска;
- системные зависимости, если они есть.

## Seed и случайность

```python
import random

import numpy as np

random.seed(42)
np.random.seed(42)
```

В scikit-learn также нужно передавать `random_state=42` в split и модели, если параметр поддерживается.

Важно: seed снижает случайность, но не гарантирует полную бинарную идентичность во всех библиотеках и окружениях.

## Конфиги вместо магических констант

Плохо:

```python
threshold = 0.73
```

Лучше хранить параметры явно:

```python
config = {
    "model_version": "churn-logreg-2026-06-13",
    "threshold": 0.73,
    "random_state": 42,
    "feature_columns": ["sessions_7d", "avg_session_min", "support_count"],
}
```

Так проще понять, какой запуск дал конкретный результат.

## Структура проекта

Минимальная структура для учебного ML-проекта:

```text
project/
  data/
    raw/
    processed/
  models/
  src/
    data.py
    features.py
    train.py
    predict.py
  requirements.txt
  README.md
```

Главная идея: код подготовки данных, обучения и inference не должен жить только в notebook.

## Что логировать

- путь или версию датасета;
- список признаков;
- параметры preprocessing;
- параметры модели;
- seed;
- метрики;
- путь к сохраненному артефакту;
- git commit, если проект под git.

## Типичные ошибки

1. Обучать модель из notebook без переносимого скрипта.
   Проблема: результат сложно повторить.
   Решение: вынести ядро в функции и `src/train.py`.

2. Не фиксировать зависимости.
   Проблема: новая версия библиотеки меняет поведение.
   Решение: фиксировать версии и документировать установку.

3. Не хранить список признаков.
   Проблема: модель получает другой порядок колонок.
   Решение: сохранять `feature_columns` рядом с артефактом.

4. Не фиксировать seed.
   Проблема: метрики плавают без понятной причины.
   Решение: задавать seed и `random_state`.

5. Перезаписывать артефакты без версии.
   Проблема: нельзя понять, какая модель была оценена.
   Решение: версионировать имена и metadata.

## Cheat-sheet

| Что фиксировать | Где |
| --- | --- |
| Python и зависимости | `requirements.txt`, `pyproject.toml`, lock-файл |
| Данные | snapshot, путь, версия выгрузки |
| Признаки | `feature_columns`, schema |
| Случайность | seed, `random_state` |
| Параметры | config-файл или metadata |
| Результат | metrics report, model artifact |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python venv', href: 'https://docs.python.org/3/library/venv.html' },
        { title: 'pip User Guide', href: 'https://pip.pypa.io/en/stable/user_guide/' },
        { title: 'Writing pyproject.toml', href: 'https://packaging.python.org/en/latest/guides/writing-pyproject-toml/' },
        { title: 'NumPy random generator', href: 'https://numpy.org/doc/stable/reference/random/generator.html' },
        { title: 'Scikit-learn common pitfalls', href: 'https://scikit-learn.org/stable/common_pitfalls.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Загрузка данных и форматы', href: '/python/ekosistema-python/zagruzka-dannykh-i-formaty' },
        { title: 'Scikit-learn и pipeline', href: '/python/ekosistema-python/scikit-learn-i-pipeline' },
        { title: 'Артефакты модели и inference', href: '/python/ekosistema-python/artefakty-modeli-i-inference' },
        { title: 'Deploy и мониторинг', href: '/mlops/deploy-i-monitoring' },
    ]"
/>
