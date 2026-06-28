---
title: "Загрузка данных и форматы"
description: "Как ML-инженеру читать данные на Python: CSV, JSON, Parquet, пути, кодировки, schema-checks и безопасная загрузка датасетов."
tags:
  - "python"
  - "data"
  - "pandas"
  - "ml"
updatedAt: "2026-06-13"
---
## Big Picture

ML-пайплайн начинается не с модели, а с надежной загрузки данных.

На практике нужно уметь:

- понять, какой формат пришел;
- прочитать данные воспроизводимо;
- проверить схему, типы, пропуски и размер;
- не загрузить в обучение случайные служебные или будущие поля.

## Форматы

### CSV

CSV удобен для обмена и ручной проверки, но плохо хранит типы.

```python
import pandas as pd

df = pd.read_csv("data/events.csv")

print(df.shape)
print(df.dtypes)
```

Что проверять:

- разделитель: `,`, `;`, tab;
- кодировку;
- decimal separator;
- наличие header;
- не превратились ли id в числа с потерей точности.

### JSON и JSONL

JSON удобен для API-like payload. JSONL часто используют для логов: одна JSON-запись на строку.

```python
events = pd.read_json("data/events.jsonl", lines=True)
```

Риск: вложенные структуры. Их часто нужно нормализовать до плоской таблицы признаков.

### Parquet

Parquet обычно лучше для аналитических и ML-датасетов:

- хранит схему и типы;
- эффективно сжимается;
- быстрее читается для больших таблиц;
- хорошо подходит для feature tables.

```python
features = pd.read_parquet("data/features.parquet")
```

## Пути и структура

Для путей лучше использовать `pathlib`, а не склеивать строки.

```python
from pathlib import Path

project_root = Path(__file__).resolve().parents[1]
data_path = project_root / "data" / "features.parquet"

df = pd.read_parquet(data_path)
```

Это снижает риск, что скрипт работает только из одной конкретной директории.

## Минимальная проверка после загрузки

```python
required_columns = {"user_id", "sessions_7d", "avg_session_min", "converted"}
missing_columns = required_columns - set(df.columns)

if missing_columns:
    raise ValueError(f"Missing columns: {sorted(missing_columns)}")

if df.empty:
    raise ValueError("Dataset is empty")

print(df.shape)
print(df.isna().sum())
```

Для ML это важнее, чем сразу запускать обучение: плохой датасет даст правдоподобные, но бесполезные метрики.

## Большие файлы

Если файл не помещается в память, начинай с chunked reading.

```python
chunks = pd.read_csv("data/events.csv", chunksize=100_000)

for chunk in chunks:
    print(chunk.shape)
```

Для production-подхода лучше не доводить все до одного огромного CSV: использовать Parquet, SQL/warehouse или batch-выгрузки.

## Типичные ошибки

1. Читать CSV без проверки типов.
   Проблема: даты, id и категории могут стать неправильными типами.
   Решение: проверять `dtypes`, явно задавать `dtype` и парсить даты.

2. Использовать относительный путь от текущей директории запуска.
   Проблема: скрипт падает в CI или notebook.
   Решение: строить путь через `pathlib`.

3. Считать, что `read_csv` всегда прочитал все корректно.
   Проблема: разделитель, кодировка или header могут быть другими.
   Решение: проверять первые строки, shape и список колонок.

4. Смешивать сырые события и готовые признаки.
   Проблема: легко получить leakage или дубли.
   Решение: явно отделять raw data, feature table и labels.

5. Не фиксировать схему входа.
   Проблема: обучение зависит от случайного состояния файла.
   Решение: хранить required columns, типы и базовые checks рядом с кодом загрузки.

## Cheat-sheet

| Формат | Когда использовать | Что проверить |
| --- | --- | --- |
| CSV | обмен, маленькие датасеты, ручной просмотр | delimiter, encoding, `dtypes`, header |
| JSON/JSONL | API payload, логи, события | вложенность, `lines=True`, обязательные поля |
| Parquet | feature tables, большие таблицы | schema, совместимость движка, размер |
| SQL/warehouse | регулярные выгрузки | фильтр по времени, snapshot, повторяемость |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Pandas IO tools', href: 'https://pandas.pydata.org/docs/user_guide/io.html' },
        { title: 'Python csv module', href: 'https://docs.python.org/3/library/csv.html' },
        { title: 'Python json module', href: 'https://docs.python.org/3/library/json.html' },
        { title: 'Python pathlib', href: 'https://docs.python.org/3/library/pathlib.html' },
        { title: 'Apache Parquet format', href: 'https://parquet.apache.org/docs/' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'NumPy и Pandas для ML', href: '/python/ekosistema-python/numpy-i-pandas-dlya-ml' },
        { title: 'EDA и визуализация', href: '/python/ekosistema-python/eda-i-vizualizatsiya' },
        { title: 'Воспроизводимость ML-кода', href: '/python/ekosistema-python/vosproizvodimost-ml-koda' },
        { title: 'Функции, классы, модули, venv и pip', href: '/python/yazyk-python/1-core/python-core-funktsii-klassy-moduli-venv-i-pip' },
    ]"
/>
