---
title: "EDA и визуализация"
description: "Практический EDA для ML на Python: shape, типы, пропуски, распределения, выбросы, leakage-checks и базовые графики."
tags:
  - "python"
  - "eda"
  - "pandas"
  - "ml"
updatedAt: "2026-06-13"
---
## Big Picture

EDA нужен не для красивых графиков, а для инженерного понимания датасета до обучения модели.

Минимальная цель:

- понять размер и типы данных;
- найти пропуски, дубли и выбросы;
- проверить распределение target;
- увидеть признаки, которые подозрительно похожи на leakage;
- сформулировать baseline preprocessing.

## Базовая проверка

```python
print(df.shape)
print(df.dtypes)
print(df.head())
print(df.isna().sum().sort_values(ascending=False))
print(df.duplicated().sum())
```

Если эти проверки не сделаны, метрики модели рано считать надежными.

## Target и дисбаланс

```python
target_rate = df["converted"].value_counts(normalize=True)
print(target_rate)
```

Если положительный класс редкий, `accuracy` может быть бесполезной. Для классификации дальше нужно смотреть precision, recall, PR-AUC и confusion matrix.

## Распределения признаков

```python
import matplotlib.pyplot as plt

df["sessions_7d"].hist(bins=30)
plt.title("sessions_7d distribution")
plt.show()
```

Что искать:

- длинные хвосты;
- нули там, где их не должно быть;
- отрицательные значения для строго положительных признаков;
- подозрительные пики из-за default values.

## Сравнение по target

```python
import seaborn as sns

sns.boxplot(data=df, x="converted", y="sessions_7d")
plt.show()
```

Это помогает быстро понять, есть ли сигнал в признаке и не выглядит ли он слишком хорошим.

## Leakage-checks

Подозрительные признаки:

- timestamps после момента предсказания;
- поля с итоговым статусом пользователя;
- признаки, рассчитанные по полному периоду вместо окна до события;
- id, hash или surrogate key, которые напрямую кодируют target;
- агрегаты, посчитанные до train/test split на всем датасете.

EDA должен явно отвечать: какие колонки нельзя отдавать модели.

## Практический минимум

1. Проверить `shape`, `dtypes`, `head`.
2. Проверить пропуски и дубли.
3. Проверить распределение target.
4. Построить 2-3 графика по самым важным признакам.
5. Выписать признаки, которые удалить из-за leakage или служебного смысла.
6. Зафиксировать список `feature_columns`.

## Типичные ошибки

1. Сразу обучать модель без EDA.
   Проблема: модель маскирует проблемы датасета.
   Решение: сначала базовый EDA и schema-checks.

2. Смотреть только среднее.
   Проблема: хвосты и выбросы остаются незамеченными.
   Решение: смотреть quantiles, histogram, boxplot.

3. Не анализировать target.
   Проблема: можно выбрать неверную метрику.
   Решение: проверять баланс классов до обучения.

4. Игнорировать временную природу данных.
   Проблема: train/test split может заглянуть в будущее.
   Решение: для временных задач использовать time-based split.

5. Оставлять служебные колонки в признаках.
   Проблема: модель учит id или status вместо закономерностей.
   Решение: явно разделять `feature_columns`, `target_column`, `id_columns`.

## Cheat-sheet

| Проверка | Команда | Зачем |
| --- | --- | --- |
| Размер | `df.shape` | понять объем |
| Типы | `df.dtypes` | найти неправильный parsing |
| Пропуски | `df.isna().sum()` | выбрать imputation |
| Дубли | `df.duplicated().sum()` | убрать повторные строки |
| Target | `value_counts(normalize=True)` | выбрать метрики |
| Распределения | `hist`, `boxplot` | найти хвосты и выбросы |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Pandas descriptive statistics', href: 'https://pandas.pydata.org/docs/user_guide/basics.html#descriptive-statistics' },
        { title: 'Pandas visualization', href: 'https://pandas.pydata.org/docs/user_guide/visualization.html' },
        { title: 'Matplotlib user guide', href: 'https://matplotlib.org/stable/users/index' },
        { title: 'Seaborn tutorial', href: 'https://seaborn.pydata.org/tutorial.html' },
        { title: 'Scikit-learn model evaluation', href: 'https://scikit-learn.org/stable/modules/model_evaluation.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Загрузка данных и форматы', href: '/python/ekosistema-python/zagruzka-dannykh-i-formaty' },
        { title: 'NumPy и Pandas для ML', href: '/python/ekosistema-python/numpy-i-pandas-dlya-ml' },
        { title: 'Scikit-learn и pipeline', href: '/python/ekosistema-python/scikit-learn-i-pipeline' },
        { title: 'Обучение с учителем', href: '/ml/obuchenie-s-uchitelem' },
    ]"
/>
