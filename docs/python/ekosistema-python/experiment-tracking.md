---
title: "Experiment tracking"
description: "Как отслеживать ML-эксперименты на Python: параметры, метрики, артефакты, локальный JSON/CSV и переход к MLflow или W&B."
tags:
  - "python"
  - "ml"
  - "experiments"
  - "mlops"
updatedAt: "2026-06-13"
---
## Big Picture

Experiment tracking отвечает на вопросы:

- какие параметры были у запуска;
- какие данные использовались;
- какие метрики получились;
- где лежит модель;
- чем один эксперимент отличается от другого.

Начинать можно без тяжелой платформы: JSON/CSV логов достаточно для учебного проекта.

## Минимальный локальный tracking

```python
import json
from pathlib import Path


def save_run(path: Path, run: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(run, file, ensure_ascii=False, indent=2)
```

Пример run:

```python
run = {
    "run_id": "2026-06-13-logreg",
    "params": {"model": "logistic_regression", "threshold": 0.65},
    "metrics": {"precision": 0.81, "recall": 0.74},
    "artifacts": {"model": "models/churn_pipeline.joblib"},
}
```

## Что логировать

- model type;
- hyperparameters;
- feature columns;
- dataset snapshot;
- seed;
- train/test split strategy;
- metrics;
- artifact paths;
- git commit, если доступен.

## Когда нужен MLflow/W&B

Локального JSON хватает, пока экспериментов мало.

Tracking-платформа нужна, когда:

- запусков много;
- работает команда;
- нужно сравнивать графики и артефакты;
- нужно хранить model registry;
- нужно воспроизводить production-модель.

## Типичные ошибки

1. Логировать только метрику.
   Проблема: непонятно, чем был получен результат.
   Решение: логировать параметры, данные и артефакты.

2. Перезаписывать один файл результата.
   Проблема: история теряется.
   Решение: уникальный `run_id`.

3. Не хранить путь к модели.
   Проблема: метрика есть, модели нет.
   Решение: логировать artifact path.

4. Не логировать dataset snapshot.
   Проблема: результат невозможно повторить.
   Решение: сохранять версию данных.

## Cheat-sheet

| Что | Пример |
| --- | --- |
| Параметры | model, threshold, seed |
| Метрики | precision, recall, PR-AUC |
| Данные | snapshot date, dataset path |
| Артефакты | model path, metadata path |
| Идентификатор | `run_id` |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'MLflow tracking', href: 'https://mlflow.org/docs/latest/ml/tracking/' },
        { title: 'Weights & Biases experiments', href: 'https://docs.wandb.ai/guides/track/' },
        { title: 'Python json module', href: 'https://docs.python.org/3/library/json.html' },
        { title: 'Python csv module', href: 'https://docs.python.org/3/library/csv.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Воспроизводимость ML-кода', href: '/python/ekosistema-python/vosproizvodimost-ml-koda' },
        { title: 'Артефакты модели и inference', href: '/python/ekosistema-python/artefakty-modeli-i-inference' },
        { title: 'Deploy и мониторинг', href: '/mlops/deploy-i-monitoring' },
    ]"
/>
