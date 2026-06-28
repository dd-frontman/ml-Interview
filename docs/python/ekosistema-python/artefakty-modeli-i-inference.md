---
title: "Артефакты модели и inference"
description: "Как сохранять и применять ML-модели на Python: артефакты модели, метаданные, схема признаков, threshold, joblib, риски pickle и inference-контракт."
tags:
  - "python"
  - "ml"
  - "inference"
  - "artifacts"
updatedAt: "2026-06-13"
---
## Big Picture

После обучения важна не только модель, а полный inference-контракт:

- как называются признаки;
- в каком порядке они идут;
- какие preprocessing-шаги применяются;
- какой threshold используется;
- какая версия модели отвечает в проде;
- какие метаданные логируются.

Если сохранить только веса модели, production-результат легко разъедется с offline-оценкой.

## Что считать артефактом

Минимальный набор:

- обученный `Pipeline` или модель + preprocessing;
- `feature_columns`;
- threshold для классификации;
- версия модели;
- версия данных или дата snapshot;
- метрики на test/hold-out;
- версия окружения.

## Сохранение pipeline

```python
import joblib

joblib.dump(model, "models/churn_pipeline.joblib")
```

Загрузка:

```python
model = joblib.load("models/churn_pipeline.joblib")
```

Для scikit-learn удобнее сохранять весь `Pipeline`, а не отдельно encoder/scaler/model.

## Metadata рядом с моделью

```python
import json

metadata = {
    "model_version": "churn-logreg-2026-06-13",
    "feature_columns": ["sessions_7d", "avg_session_min", "support_count"],
    "threshold": 0.65,
    "metrics": {"precision": 0.81, "recall": 0.74},
}

with open("models/churn_metadata.json", "w", encoding="utf-8") as file:
    json.dump(metadata, file, ensure_ascii=False, indent=2)
```

Метаданные нужны, чтобы понять, что именно было обучено и как применять модель.

## Inference-функция

```python
import pandas as pd


def predict_user(model, metadata: dict, payload: dict) -> dict:
    feature_columns = metadata["feature_columns"]
    threshold = metadata["threshold"]

    row = {column: payload[column] for column in feature_columns}
    frame = pd.DataFrame([row], columns=feature_columns)
    proba = model.predict_proba(frame)[0, 1]
    label = int(proba >= threshold)

    return {
        "model_version": metadata["model_version"],
        "score": float(proba),
        "label": label,
        "threshold": threshold,
    }
```

Главное: inference принимает понятный payload, применяет тот же pipeline и возвращает score вместе с версией модели.

## Риск `pickle`

`joblib` для scikit-learn использует pickle-подходы под капотом. Это удобно, но важно правило безопасности: не загружать pickle/joblib-артефакты из недоверенного источника.

Для продакшена артефакты должны приходить только из контролируемого model registry или build pipeline.

## Типичные ошибки

1. Сохранять только estimator без preprocessing.
   Проблема: на inference признаки готовятся иначе.
   Решение: сохранять весь `Pipeline`.

2. Не сохранять threshold.
   Проблема: offline-метрики не совпадают с production-решениями.
   Решение: хранить threshold в metadata.

3. Не сохранять список признаков.
   Проблема: меняется порядок или набор колонок.
   Решение: хранить `feature_columns`.

4. Загружать артефакт из недоверенного места.
   Проблема: pickle/joblib может выполнить вредный код при загрузке.
   Решение: доверенный registry и контроль подписи/доступа.

5. Не логировать версию модели.
   Проблема: невозможно расследовать деградацию.
   Решение: возвращать и логировать `model_version`.

## Cheat-sheet

| Объект | Зачем нужен |
| --- | --- |
| `model.joblib` | обученный pipeline |
| `metadata.json` | версия, признаки, threshold, метрики |
| `requirements.txt` / lock | воспроизводимое окружение |
| inference-функция | единый контракт применения |
| prediction log | расследование качества и drift |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Scikit-learn model persistence', href: 'https://scikit-learn.org/stable/model_persistence.html' },
        { title: 'Joblib persistence', href: 'https://joblib.readthedocs.io/en/stable/persistence.html' },
        { title: 'Python pickle', href: 'https://docs.python.org/3/library/pickle.html' },
        { title: 'Python json module', href: 'https://docs.python.org/3/library/json.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Scikit-learn и pipeline', href: '/python/ekosistema-python/scikit-learn-i-pipeline' },
        { title: 'Воспроизводимость ML-кода', href: '/python/ekosistema-python/vosproizvodimost-ml-koda' },
        { title: 'Тестирование и валидация данных', href: '/python/ekosistema-python/testirovanie-i-validatsiya-dannykh' },
        { title: 'Deploy и мониторинг', href: '/mlops/deploy-i-monitoring' },
    ]"
/>
