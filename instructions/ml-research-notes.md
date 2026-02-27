# ML Research Notes

## Тип ML-задачи

- Основной сценарий: supervised learning.
- Конкретная постановка в документе: binary classification.
- Почему так:
  - проще связать с реальными продуктами (fraud/churn/conversion);
  - легче объяснить выбор метрик и порога решения.

## Data flow

1. Источник данных -> таблица признаков (`X`) и целевая переменная (`y`).
2. Разделение на `train/validation/test` до обучения любых трансформаций.
3. Препроцессинг:
   - числовые признаки -> scaling/импутация;
   - категориальные признаки -> one-hot/редкие категории.
4. Сборка единого `Pipeline`, чтобы избежать leakage.
5. Оценка на hold-out и/или cross-validation.

## Training flow

1. Зафиксировать baseline и бизнес-метрику.
2. Обучить первую интерпретируемую модель (например, Logistic Regression).
3. Сравнить с более сильным baseline при необходимости.
4. Подобрать threshold под business cost (например, precision-recall tradeoff).
5. Зафиксировать артефакты: модель, параметры, версию признаков.

## Inference flow

1. Получить данные запроса/батча.
2. Применить тот же pipeline трансформаций.
3. Рассчитать `predict_proba`.
4. Применить production threshold.
5. Вернуть:
   - класс/скоринг;
   - служебные поля для логирования (версия модели, latency).

## Используемые библиотеки

- `numpy`
- `pandas`
- `scikit-learn`:
  - `Pipeline`
  - `ColumnTransformer`
  - `StandardScaler`
  - `OneHotEncoder`
  - `LogisticRegression`
  - `train_test_split`, `cross_val_score`
  - `classification_report`, `roc_auc_score`, `average_precision_score`

## Потенциальные риски

- Data leakage (fit препроцессора до split).
- Неверная метрика под бизнес-цель (например, accuracy при сильном дисбалансе).
- Игнорирование baseline, из-за чего сложно доказать пользу сложной модели.
- Нестабильность метрик из-за маленькой/смещенной выборки.
- Train-serving skew: различия между offline и online преобразованиями признаков.
- Drift после релиза модели (изменение входных распределений/поведения пользователей).
