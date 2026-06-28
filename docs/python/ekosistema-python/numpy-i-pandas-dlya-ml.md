---
title: "NumPy и Pandas для ML"
description: "Практический минимум NumPy и Pandas для ML: массивы, таблицы, фильтрация, агрегации, пропуски и подготовка признаков."
tags:
  - "ml"
  - "python"
  - "numpy"
  - "pandas"
updatedAt: "2026-06-13"
---
## Big Picture

`NumPy` и `Pandas` - это не часть языка Python. Это инструменты экосистемы:

- `NumPy` дает быстрые однородные массивы и операции над ними;
- `Pandas` дает табличную модель данных для чтения, очистки, агрегации и подготовки признаков;
- вместе они закрывают путь от сырого датасета до матрицы признаков для модели.

Для ML-инженера важно не знать все методы, а уверенно читать датасет, проверять shape/types, собирать признаки и не ломать train/test split.

## NumPy

### `ndarray`, shape и dtype

Главная структура NumPy - `ndarray`: N-мерный массив с элементами одного типа.

```python
import numpy as np

x = np.array([[1.0, 2.0], [3.0, 4.0]])

print(x.shape)  # (2, 2)
print(x.dtype)  # float64
print(x.ndim)   # 2
```

В ML shape обычно читается так:

- `(n_samples, n_features)` - таблица признаков;
- `(n_samples,)` - целевая переменная;
- `(batch_size, height, width, channels)` - батч изображений.

### Векторизация

Вместо Python-циклов чаще используют операции над массивом целиком.

```python
scores = np.array([0.12, 0.73, 0.44, 0.91])
labels = (scores >= 0.5).astype(int)

print(labels)  # [0 1 0 1]
```

Это короче и обычно быстрее, потому что тяжелая работа выполняется внутри NumPy.

### Broadcasting

Broadcasting позволяет применять операцию к массивам разных, но совместимых shape.

```python
features = np.array([
    [10.0, 2.0],
    [20.0, 4.0],
    [30.0, 6.0],
])

mean = features.mean(axis=0)
std = features.std(axis=0)

scaled = (features - mean) / std
print(scaled.round(2))
```

Практическое правило: перед операциями всегда проверяй `shape`, иначе легко получить корректный с точки зрения NumPy, но неправильный для ML результат.

### Маски и индексация

Boolean masks нужны для фильтрации данных.

```python
prices = np.array([10, 20, 30, 40])
mask = prices >= 25

print(prices[mask])  # [30 40]
```

В ML это часто используется для отбора строк, проверки выбросов и анализа ошибок модели.

## Pandas

### `DataFrame` и `Series`

`DataFrame` - таблица, `Series` - один столбец.

```python
import pandas as pd

df = pd.DataFrame(
    {
        "user_id": [1, 2, 3],
        "sessions_7d": [5, 0, 12],
        "converted": [1, 0, 1],
    }
)

print(df.shape)
print(df.dtypes)
```

### Выбор столбцов и фильтрация

```python
active = df[df["sessions_7d"] > 0]
features = active.loc[:, ["sessions_7d"]]
target = active["converted"]
```

Для ML лучше явно разделять:

- `X` - признаки;
- `y` - целевая переменная;
- `id`, timestamp и служебные поля - отдельно, чтобы не утащить leakage в модель.

### Пропуски и типы

```python
df["sessions_7d"] = df["sessions_7d"].fillna(0).astype("int64")
```

Типичные решения:

- числовые пропуски - `fillna(0)`, медиана или отдельный флаг пропуска;
- категориальные пропуски - отдельная категория вроде `"unknown"`;
- даты - явный `pd.to_datetime(...)`;
- перед обучением - проверка `df.isna().sum()`.

### `groupby`, `merge`, `pivot_table`

Агрегации превращают события в признаки.

```python
events = pd.DataFrame(
    {
        "user_id": [1, 1, 2, 2, 2],
        "event": ["visit", "buy", "visit", "visit", "support"],
        "duration_min": [3.0, 1.0, 2.5, 4.0, 6.0],
    }
)

features = (
    events.groupby("user_id")
    .agg(
        events_count=("event", "size"),
        avg_duration_min=("duration_min", "mean"),
        support_count=("event", lambda values: (values == "support").sum()),
    )
    .reset_index()
)

print(features)
```

`merge` нужен, когда признаки собираются из разных таблиц.

```python
labels = pd.DataFrame({"user_id": [1, 2], "converted": [1, 0]})
dataset = features.merge(labels, on="user_id", how="inner")
```

Главный риск: не присоединить к обучению данные из будущего.

## Практический минимум

1. Уметь читать данные через `pd.read_csv`, `pd.read_parquet`, `pd.read_json`.
2. Проверять `shape`, `dtypes`, пропуски и дубликаты.
3. Делать фильтрацию, агрегации и join без leakage.
4. Превращать таблицу в `X` и `y`.
5. Понимать, где нужен `NumPy`, а где удобнее `Pandas`.

```python
feature_columns = ["events_count", "avg_duration_min", "support_count"]

X = dataset[feature_columns].to_numpy()
y = dataset["converted"].to_numpy()

print(X.shape, y.shape)
```

## Типичные ошибки

1. Делать `fit` preprocessing на всем датасете до train/test split.
   Проблема: leakage из теста в обучение.
   Решение: сначала split, потом обучаемые трансформации только на train.

2. Не проверять `shape`.
   Проблема: модель получает не те признаки или не тот порядок столбцов.
   Решение: явно хранить `feature_columns` и проверять `X.shape`.

3. Путать copy и view в NumPy.
   Проблема: изменение среза может изменить исходный массив.
   Решение: если нужна независимая копия, использовать `.copy()`.

4. Использовать `df.fillna(...)` без понимания смысла пропусков.
   Проблема: можно стереть важный сигнал.
   Решение: отдельно решать стратегию для числовых, категориальных и временных признаков.

5. Делать `merge` без проверки количества строк.
   Проблема: дубли могут размножить датасет.
   Решение: сравнивать `shape` до/после и проверять уникальность ключей.

## Cheat-sheet

| Задача | Инструмент | Проверка |
| --- | --- | --- |
| Быстрая математика над массивами | `NumPy` | `shape`, `dtype`, отсутствие лишних циклов |
| Табличная обработка | `Pandas` | `shape`, `dtypes`, `isna().sum()` |
| Агрегация событий | `groupby().agg()` | нет данных из будущего |
| Соединение таблиц | `merge()` | не выросло ли число строк неожиданно |
| Передача в модель | `to_numpy()` или DataFrame | порядок признаков зафиксирован |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'NumPy absolute basics', href: 'https://numpy.org/doc/stable/user/absolute_beginners.html' },
        { title: 'NumPy broadcasting', href: 'https://numpy.org/doc/stable/user/basics.broadcasting.html' },
        { title: 'Pandas user guide', href: 'https://pandas.pydata.org/docs/user_guide/index.html' },
        { title: 'Pandas IO tools', href: 'https://pandas.pydata.org/docs/user_guide/io.html' },
        { title: 'Pandas missing data', href: 'https://pandas.pydata.org/docs/user_guide/missing_data.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Загрузка данных и форматы', href: '/python/ekosistema-python/zagruzka-dannykh-i-formaty' },
        { title: 'EDA и визуализация', href: '/python/ekosistema-python/eda-i-vizualizatsiya' },
        { title: 'Scikit-learn и pipeline', href: '/python/ekosistema-python/scikit-learn-i-pipeline' },
        { title: 'Типы главная', href: '/python/yazyk-python/tipy-dannykh/tipy-glavnaya' },
    ]"
/>
