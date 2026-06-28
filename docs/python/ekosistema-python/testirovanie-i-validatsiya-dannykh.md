---
title: "Тестирование и валидация данных"
description: "Какие проверки нужны ML-коду на Python: schema-checks, shape-checks, edge cases, smoke-test pipeline и базовые pytest-подходы."
tags:
  - "python"
  - "testing"
  - "data-validation"
  - "ml"
updatedAt: "2026-06-13"
---
## Big Picture

В ML тестируют не только функции. Нужно проверять:

- входную схему данных;
- shape и порядок признаков;
- отсутствие критичных пропусков;
- устойчивость preprocessing;
- что pipeline вообще обучается и делает prediction;
- что inference не расходится с training contract.

Цель не в полном покрытии, а в раннем обнаружении ошибок, которые портят модель незаметно.

## Schema-checks

```python
REQUIRED_COLUMNS = {
    "user_id",
    "sessions_7d",
    "avg_session_min",
    "converted",
}

def validate_columns(columns: set[str]) -> None:
    missing = REQUIRED_COLUMNS - columns
    if missing:
        raise ValueError(f"Missing columns: {sorted(missing)}")
```

Такая проверка должна падать раньше, чем обучение модели.

## Shape-checks

```python
def validate_features(X, expected_features: int) -> None:
    if len(X.shape) != 2:
        raise ValueError("X must be a 2D matrix")
    if X.shape[1] != expected_features:
        raise ValueError(f"Expected {expected_features} features, got {X.shape[1]}")
```

Для ML shape - это часть контракта.

## Smoke-test pipeline

```python
def test_pipeline_smoke(model, train_df):
    X = train_df.loc[:, ["sessions_7d", "avg_session_min"]]
    y = train_df["converted"]

    model.fit(X, y)
    pred = model.predict(X.head(2))

    assert len(pred) == 2
```

Smoke-test не доказывает качество модели, но быстро ловит сломанные импорты, несовместимые типы и ошибки preprocessing.

## Edge cases

Что стоит проверять отдельно:

- пустой датасет;
- пропущенная обязательная колонка;
- неизвестная категория на inference;
- все значения в колонке пропущены;
- один класс в target;
- отрицательные значения там, где они невозможны;
- неверный порядок признаков.

## Data validation на уровне пайплайна

Минимальный подход без тяжелых фреймворков:

```python
def validate_training_frame(df) -> None:
    validate_columns(set(df.columns))

    if df.empty:
        raise ValueError("Training dataset is empty")

    if df["converted"].nunique() < 2:
        raise ValueError("Target must contain at least two classes")

    if (df["sessions_7d"] < 0).any():
        raise ValueError("sessions_7d must be non-negative")
```

Эти проверки лучше держать рядом с кодом загрузки и feature engineering.

## Типичные ошибки

1. Тестировать только happy path.
   Проблема: production падает на пустых или неполных данных.
   Решение: добавить edge cases.

2. Не проверять порядок признаков.
   Проблема: модель получает правильные числа в неправильных колонках.
   Решение: хранить и валидировать `feature_columns`.

3. Считать smoke-test проверкой качества.
   Проблема: pipeline запускается, но модель плохая.
   Решение: отдельно хранить quality gates по метрикам.

4. Не проверять неизвестные категории.
   Проблема: encoder падает на inference.
   Решение: `handle_unknown="ignore"` и тест на новую категорию.

5. Валидировать данные после обучения.
   Проблема: ошибка находится слишком поздно.
   Решение: schema/data checks до fit.

## Cheat-sheet

| Что проверять | Где |
| --- | --- |
| Обязательные колонки | сразу после загрузки |
| Типы и пропуски | до feature engineering |
| Shape признаков | перед `fit` и `predict` |
| Target | перед split и обучением |
| Pipeline smoke-test | в CI или локальной проверке |
| Inference payload | на границе сервиса |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'pytest assertions', href: 'https://docs.pytest.org/en/stable/how-to/assert.html' },
        { title: 'Pandas testing API', href: 'https://pandas.pydata.org/docs/reference/testing.html' },
        { title: 'Scikit-learn common pitfalls', href: 'https://scikit-learn.org/stable/common_pitfalls.html' },
        { title: 'Scikit-learn Pipeline', href: 'https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Загрузка данных и форматы', href: '/python/ekosistema-python/zagruzka-dannykh-i-formaty' },
        { title: 'Scikit-learn и pipeline', href: '/python/ekosistema-python/scikit-learn-i-pipeline' },
        { title: 'Артефакты модели и inference', href: '/python/ekosistema-python/artefakty-modeli-i-inference' },
        { title: 'Feature engineering и валидация', href: '/mlops/feature-engineering-i-validatsiya' },
    ]"
/>
