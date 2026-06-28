---
title: "SQL из Python"
description: "Практический минимум работы с SQL из Python для ML: read_sql, параметры запросов, срезы данных и безопасная выгрузка признаков."
tags:
  - "python"
  - "sql"
  - "pandas"
  - "data"
updatedAt: "2026-06-13"
---
## Big Picture

Во многих ML-задачах данные лежат не в CSV, а в базе или warehouse. Python-код должен уметь получить срез данных и превратить его в feature table.

Минимальная цель:

- выполнить SQL-запрос;
- не склеивать SQL с пользовательскими строками;
- зафиксировать временной срез;
- проверить shape и схему результата.

## `read_sql`

```python
import pandas as pd
from sqlalchemy import text

query = text("""
select user_id, sessions_7d, avg_session_min, converted
from analytics.training_snapshot
where snapshot_date = :snapshot_date
""")

df = pd.read_sql(query, con=connection, params={"snapshot_date": "2026-06-13"})
```

Параметры запроса лучше передавать через `params`, а не собирать строку вручную.

## Срез данных

Для обучения важно понимать, на какой момент выгружены данные.

Плохо:

```sql
select * from features
```

Лучше:

```sql
select *
from features
where snapshot_date = :snapshot_date
```

Так можно повторить обучение на том же срезе.

## Что проверять после SQL

```python
required_columns = {"user_id", "sessions_7d", "avg_session_min", "converted"}

if required_columns - set(df.columns):
    raise ValueError("Training query returned invalid schema")

if df.empty:
    raise ValueError("Training query returned no rows")
```

## Типичные ошибки

1. Делать `select *`.
   Проблема: схема меняется незаметно.
   Решение: перечислять нужные колонки.

2. Склеивать SQL через f-string с внешними значениями.
   Проблема: риск SQL injection и ошибок escaping.
   Решение: использовать query parameters.

3. Не фиксировать дату среза.
   Проблема: обучение не повторяется.
   Решение: передавать дату среза как параметр.

4. Делать join без контроля кратности.
   Проблема: строки размножаются.
   Решение: проверять уникальность ключей и row count.

## Cheat-sheet

| Задача | Подход |
| --- | --- |
| Прочитать таблицу | `pd.read_sql(...)` |
| Передать дату | `params` |
| Повторить выгрузку | дата среза / `snapshot_date` |
| Контроль схемы | required columns |
| Защита от лишних колонок | явный `select column...` |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Pandas read_sql', href: 'https://pandas.pydata.org/docs/reference/api/pandas.read_sql.html' },
        { title: 'Python sqlite3', href: 'https://docs.python.org/3/library/sqlite3.html' },
        { title: 'SQLAlchemy documentation', href: 'https://docs.sqlalchemy.org/en/20/' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Загрузка данных и форматы', href: '/python/ekosistema-python/zagruzka-dannykh-i-formaty' },
        { title: 'NumPy и Pandas для ML', href: '/python/ekosistema-python/numpy-i-pandas-dlya-ml' },
        { title: 'Тестирование и валидация данных', href: '/python/ekosistema-python/testirovanie-i-validatsiya-dannykh' },
    ]"
/>
