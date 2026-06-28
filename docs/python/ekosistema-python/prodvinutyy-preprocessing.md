---
title: "Продвинутый preprocessing"
description: "Что нужно знать про preprocessing в ML на Python: imputation, encoding, scaling, leakage-safe feature engineering и порядок трансформаций."
tags:
  - "python"
  - "preprocessing"
  - "scikit-learn"
  - "ml"
updatedAt: "2026-06-13"
---
## Big Picture

Preprocessing - это не косметика перед моделью. Это часть обучаемого пайплайна:

- как заполняются пропуски;
- как кодируются категории;
- как масштабируются числа;
- какие признаки удаляются;
- какие статистики считаются только на train.

Главное правило: все обучаемые трансформации должны быть внутри `Pipeline`.

## Imputation

```python
from sklearn.impute import SimpleImputer

imputer = SimpleImputer(strategy="median")
```

Числовые пропуски часто заполняют медианой, категориальные - самым частым значением или отдельной категорией.

## Encoding

```python
from sklearn.preprocessing import OneHotEncoder

encoder = OneHotEncoder(handle_unknown="ignore")
```

`handle_unknown="ignore"` защищает inference от новой категории, которой не было на train.

## Scaling

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
```

Scaling особенно важен для линейных моделей, SVM, KNN и методов, чувствительных к масштабу.

## Leakage-safe порядок

Правильный порядок:

1. Разделить данные на train/test.
2. Обучить imputer/encoder/scaler на train.
3. Применить их к train/test.
4. Обучить модель на transformed train.
5. Оценить на transformed test.

В scikit-learn это удобнее делать через `Pipeline` и `ColumnTransformer`.

## Типичные ошибки

1. Считать медиану на всем датасете до split.
   Проблема: leakage.
   Решение: imputer внутри pipeline.

2. Кодировать категории отдельно на train и test.
   Проблема: разные колонки.
   Решение: общий encoder внутри pipeline.

3. Масштабировать target вместе с признаками.
   Проблема: ломается смысл задачи.
   Решение: отдельно обрабатывать `X` и `y`.

4. Удалять выбросы без сохранения правила.
   Проблема: inference не повторяет training.
   Решение: фиксировать правило или делать transformer.

## Cheat-sheet

| Проблема | Инструмент |
| --- | --- |
| Числовые пропуски | `SimpleImputer(strategy="median")` |
| Категории | `OneHotEncoder(handle_unknown="ignore")` |
| Масштаб чисел | `StandardScaler` |
| Разные типы колонок | `ColumnTransformer` |
| Связать шаги | `Pipeline` |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Scikit-learn preprocessing', href: 'https://scikit-learn.org/stable/modules/preprocessing.html' },
        { title: 'Imputation of missing values', href: 'https://scikit-learn.org/stable/modules/impute.html' },
        { title: 'ColumnTransformer', href: 'https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.html' },
        { title: 'Scikit-learn common pitfalls', href: 'https://scikit-learn.org/stable/common_pitfalls.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Scikit-learn и pipeline', href: '/python/ekosistema-python/scikit-learn-i-pipeline' },
        { title: 'EDA и визуализация', href: '/python/ekosistema-python/eda-i-vizualizatsiya' },
        { title: 'Feature engineering и валидация', href: '/mlops/feature-engineering-i-validatsiya' },
    ]"
/>
