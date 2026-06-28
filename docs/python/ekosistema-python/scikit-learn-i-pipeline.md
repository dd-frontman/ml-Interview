---
title: "Scikit-learn и pipeline"
description: "Практический минимум scikit-learn для ML-инженера: split, fit/predict, preprocessing, Pipeline, ColumnTransformer, метрики и cross-validation."
tags:
  - "python"
  - "scikit-learn"
  - "ml"
  - "pipeline"
updatedAt: "2026-06-13"
---
## Big Picture

`scikit-learn` закрывает классический ML-пайплайн:

- разделить данные на train/test;
- обучить preprocessing только на train;
- обучить модель;
- получить предсказания;
- оценить метрики;
- сохранить весь pipeline как один артефакт.

Главная идея: preprocessing и модель должны быть связаны в один `Pipeline`, чтобы на inference применялись те же шаги, что и на обучении.

## API моделей

У большинства объектов scikit-learn один стиль:

- `fit(X_train, y_train)` - обучить;
- `predict(X)` - получить класс или значение;
- `predict_proba(X)` - получить вероятности, если модель поддерживает;
- `transform(X)` - преобразовать признаки;
- `fit_transform(X)` - обучить преобразование и применить.

## Train/test split

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)
```

`stratify=y` полезен для классификации, чтобы сохранить долю классов в train/test.

## Pipeline и ColumnTransformer

```python
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

numeric_features = ["sessions_7d", "avg_session_min"]
categorical_features = ["country"]

X = df[numeric_features + categorical_features]
y = df["converted"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

numeric_pipeline = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ]
)

categorical_pipeline = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore")),
    ]
)

preprocess = ColumnTransformer(
    transformers=[
        ("num", numeric_pipeline, numeric_features),
        ("cat", categorical_pipeline, categorical_features),
    ]
)

model = Pipeline(
    steps=[
        ("preprocess", preprocess),
        ("classifier", LogisticRegression(max_iter=1000)),
    ]
)

model.fit(X_train, y_train)
pred = model.predict(X_test)

print(classification_report(y_test, pred))
```

Что это дает:

- imputation/scaling/encoding обучаются только на train;
- порядок признаков фиксируется в pipeline;
- на inference можно вызвать один `model.predict(...)`;
- меньше риска train-serving skew.

## Cross-validation

```python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(model, X, y, cv=5, scoring="f1")
print(scores.mean(), scores.std())
```

Cross-validation помогает оценить устойчивость метрик, но не заменяет финальный hold-out/test.

## Метрики

Для классификации:

- `accuracy` - только если классы сбалансированы и цена ошибок похожая;
- `precision` - насколько точны положительные предсказания;
- `recall` - сколько реальных положительных найдено;
- `f1` - компромисс precision/recall;
- `roc_auc`, `average_precision` - качество ранжирования по score.

Для регрессии:

- `MAE` - средняя абсолютная ошибка;
- `RMSE` - сильнее штрафует крупные ошибки;
- `R2` - доля объясненной вариации, но не бизнес-метрика.

## Типичные ошибки

1. Делать `fit_transform` на всем датасете до split.
   Проблема: leakage.
   Решение: preprocessing внутри `Pipeline`.

2. Кодировать категории отдельно на train и test.
   Проблема: разные наборы колонок.
   Решение: `OneHotEncoder(handle_unknown="ignore")` внутри pipeline.

3. Оценивать только `accuracy`.
   Проблема: дисбаланс классов скрывает плохую модель.
   Решение: смотреть precision/recall/F1/PR-AUC.

4. Не фиксировать `random_state`.
   Проблема: метрики плавают между запусками.
   Решение: фиксировать seed для split и моделей, где это применимо.

5. Сохранять только модель без preprocessing.
   Проблема: на inference признаки готовятся иначе.
   Решение: сохранять весь `Pipeline`.

## Cheat-sheet

| Шаг | Инструмент | Главное правило |
| --- | --- | --- |
| Split | `train_test_split` | до обучаемых трансформаций |
| Preprocessing | `Pipeline`, `ColumnTransformer` | fit только на train |
| Модель | estimator с `fit/predict` | хранить параметры и seed |
| Оценка | `metrics`, `classification_report` | метрика под задачу |
| Устойчивость | `cross_val_score` | смотреть mean и std |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Scikit-learn user guide', href: 'https://scikit-learn.org/stable/user_guide.html' },
        { title: 'Pipelines and composite estimators', href: 'https://scikit-learn.org/stable/modules/compose.html' },
        { title: 'train_test_split', href: 'https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html' },
        { title: 'Cross-validation', href: 'https://scikit-learn.org/stable/modules/cross_validation.html' },
        { title: 'Model evaluation', href: 'https://scikit-learn.org/stable/modules/model_evaluation.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'NumPy и Pandas для ML', href: '/python/ekosistema-python/numpy-i-pandas-dlya-ml' },
        { title: 'EDA и визуализация', href: '/python/ekosistema-python/eda-i-vizualizatsiya' },
        { title: 'Артефакты модели и inference', href: '/python/ekosistema-python/artefakty-modeli-i-inference' },
        { title: 'Обучение с учителем', href: '/ml/obuchenie-s-uchitelem' },
    ]"
/>
