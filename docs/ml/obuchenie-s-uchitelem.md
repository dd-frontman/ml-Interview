---
title: "Обучение с учителем"
description: "Как построить supervised ML pipeline: от постановки задачи до оценки качества и выбора порога в проде."
tags:
  - "ml"
  - "supervised-learning"
  - "classification"
updatedAt: "2026-02-27"
---
## Big Picture

`Supervised learning` - это подход, где у нас есть признаки `X` и правильные ответы `y`, и мы учим модель предсказывать `y` для новых объектов.

Типовые задачи:

- Классификация: `spam/not spam`, `fraud/not fraud`, `churn/not churn`.
- Регрессия: прогноз числа (например, выручки, времени доставки, LTV).

В проде модель - это часть цепочки: данные -> обучение -> inference -> мониторинг. Если хотя бы один этап сделан неправильно, качество в реальном трафике почти всегда хуже offline-метрик.

## Концепция простым языком

Аналогия с frontend:

- Признаки `X` - это как набор входных props/данных из API.
- Цель `y` - ожидаемое состояние UI или событие (например, "пользователь кликнул кнопку оплаты").
- Модель - это функция, которая по входам отдает вероятность события.

Почему это удобно:

- можно приоритизировать лиды;
- можно включать fallback-сценарии;
- можно объяснить продукту, как меняется precision/recall при другом пороге.

## Инженерная интерпретация

### Data flow

1. Собираем и чистим данные.
2. Формируем признаки.
3. Делаем split (`train/validation/test`) до любых `fit`-операций.
4. Собираем единый `Pipeline`, чтобы не получить leakage.

### Training flow

1. Фиксируем baseline и бизнес-метрику.
2. Обучаем простую модель (например, Logistic Regression).
3. Проверяем качество через cross-validation и hold-out.
4. Подбираем порог решения (threshold), если важны precision/recall tradeoff.

### Inference flow

1. Получаем новые данные.
2. Прогоняем через те же трансформации признаков.
3. Считаем `predict_proba`.
4. Применяем production threshold.
5. Логируем результат + версию модели.

## Минимальный пример кода

Ниже минимальный скелет binary classification на `scikit-learn`.

```python
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

data = load_breast_cancer(as_frame=True)
X, y = data.data, data.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

model = Pipeline(
    steps=[
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(max_iter=2000, random_state=42)),
    ]
)

model.fit(X_train, y_train)

proba = model.predict_proba(X_test)[:, 1]
pred = (proba >= 0.5).astype(int)

print("ROC-AUC:", round(roc_auc_score(y_test, proba), 3))
print(classification_report(y_test, pred, digits=3))
```

Что важно:

- `Pipeline` защищает от случайных утечек между preprocess и model.
- `stratify=y` сохраняет баланс классов при split.
- ROC-AUC хорошо показывает ранжирующую способность модели.

## Практический пример

Кейс: предсказать конверсию пользователя из `trial` в `paid` по продуктовой активности.

```python
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, precision_recall_curve
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

rng = np.random.default_rng(42)
n = 4000

df = pd.DataFrame(
    {
        "sessions_7d": rng.poisson(6, n),
        "avg_session_min": rng.gamma(2.0, 3.0, n),
        "country": rng.choice(["US", "DE", "BR", "IN"], n, p=[0.35, 0.2, 0.2, 0.25]),
        "device": rng.choice(["mobile", "desktop"], n, p=[0.7, 0.3]),
        "utm_source": rng.choice(["ads", "seo", "direct", "referral"], n),
    }
)

logit = (
    -2.2
    + 0.12 * df["sessions_7d"]
    + 0.08 * df["avg_session_min"]
    + 0.6 * (df["device"] == "desktop").astype(int)
    + 0.7 * (df["utm_source"] == "seo").astype(int)
)
p = 1 / (1 + np.exp(-logit))
df["converted"] = (rng.random(n) < p).astype(int)

X = df.drop(columns="converted")
y = df["converted"]

num_features = ["sessions_7d", "avg_session_min"]
cat_features = ["country", "device", "utm_source"]

preprocess = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), num_features),
        ("cat", OneHotEncoder(handle_unknown="ignore"), cat_features),
    ]
)

model = Pipeline(
    steps=[
        ("prep", preprocess),
        ("clf", LogisticRegression(max_iter=1000, class_weight="balanced")),
    ]
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

cv_pr_auc = cross_val_score(
    model, X_train, y_train, cv=5, scoring="average_precision"
).mean()

model.fit(X_train, y_train)
proba = model.predict_proba(X_test)[:, 1]
test_pr_auc = average_precision_score(y_test, proba)

# Пример выбора порога: хотим precision >= 0.75
precision, recall, thresholds = precision_recall_curve(y_test, proba)
threshold = next(
    (t for p_value, t in zip(precision[:-1], thresholds) if p_value >= 0.75),
    0.5,
)

print(f"CV PR-AUC: {cv_pr_auc:.3f}")
print(f"Test PR-AUC: {test_pr_auc:.3f}")
print(f"Chosen threshold: {threshold:.2f}")
```

Как читать результат:

- `CV PR-AUC` показывает стабильность на train-folds.
- `Test PR-AUC` - реальная проверка на отложенной выборке.
- Порог `0.5` не обязателен: его подбирают под стоимость ошибок для бизнеса.

## Типичные ошибки

1. Фитить scaler/encoder до split.
   Почему плохо: leakage, завышенные метрики.
   Как правильно: все трансформации внутри `Pipeline`.

2. Сравнивать модели только по accuracy при дисбалансе.
   Почему плохо: можно "набрать" accuracy, не находя редкий класс.
   Как правильно: смотреть `PR-AUC`, `recall`, `precision` и cost ошибок.

3. Игнорировать baseline.
   Почему плохо: сложно доказать, что новая модель действительно лучше.
   Как правильно: всегда держать простой baseline и единый протокол оценки.

4. Подбирать гиперпараметры на `test`.
   Почему плохо: теряется честная оценка обобщения.
   Как правильно: tuning на train/validation, test только финальная проверка.

5. Путать offline качество и прод-результат.
   Почему плохо: в проде может быть другой поток данных (train-serving skew).
   Как правильно: логировать признаки/скоринг и мониторить drift после релиза.

## Cheat-sheet

| Этап | Что делаем | Инструменты | Артефакт | Контрольный вопрос |
| --- | --- | --- | --- | --- |
| Постановка задачи | Формулируем target и тип задачи | Product metrics, data contract | Четкая цель `y` | Что именно предсказываем и зачем бизнесу? |
| Split | Делим данные на train/val/test | `train_test_split` | Наборы для обучения и проверки | Нет ли пересечения объектов между выборками? |
| Препроцессинг | Кодируем/масштабируем признаки | `ColumnTransformer`, `Pipeline` | Воспроизводимый preprocessing graph | Есть ли leakage в трансформациях? |
| Обучение baseline | Тренируем первую простую модель | `LogisticRegression` | Базовая метрика | Почему эта модель - хороший старт? |
| Валидация | Проверяем стабильность | `cross_val_score` | Распределение метрик по фолдам | Насколько метрика плавает? |
| Тест | Финально проверяем на hold-out | `average_precision_score`, `roc_auc_score` | Честная offline оценка | Мы не использовали test в tuning? |
| Thresholding | Выбираем рабочий порог | `precision_recall_curve` | Порог для прод-решения | Какой тип ошибки дороже бизнесу? |
| Прод и мониторинг | Логируем качество после релиза | MLOps monitoring | Дашборд метрик и drift alerts | Когда модель надо переобучать? |

## Official docs

<OfficialDocsLinks
	:links="[
		{ title: 'Scikit-learn: Supervised learning', href: 'https://scikit-learn.org/stable/supervised_learning.html' },
		{ title: 'Scikit-learn: Pipelines and composite estimators', href: 'https://scikit-learn.org/stable/modules/compose.html' },
		{ title: 'Scikit-learn: Cross-validation', href: 'https://scikit-learn.org/stable/modules/cross_validation.html' },
		{ title: 'Scikit-learn: Model evaluation', href: 'https://scikit-learn.org/stable/modules/model_evaluation.html' },
		{ title: 'Pandas: User guide', href: 'https://pandas.pydata.org/docs/user_guide/index.html' },
	]"
/>

<RelatedTopics
	:items="[
		{ title: 'Обучение без учителя', href: '/ml/obuchenie-bez-uchitelya' },
		{ title: 'Feature engineering и валидация', href: '/mlops/feature-engineering-i-validatsiya' },
		{ title: 'Вероятность и статистика для ML', href: '/math/veroyatnost-i-statistika-dlya-ml' },
	]"
/>
