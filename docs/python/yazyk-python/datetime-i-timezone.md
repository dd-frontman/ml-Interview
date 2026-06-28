---
title: "Datetime и timezone"
description: "Как работать с датами и временем в Python для ML: datetime, timezone-aware значения, UTC, окна признаков и типичные ошибки."
tags:
  - "python"
  - "datetime"
  - "core"
  - "ml"
updatedAt: "2026-06-13"
---
## Big Picture

Во многих ML-задачах признаки считаются по времени: события за 7 дней, активность за 30 дней, время с последней покупки.

Ошибка с датами часто превращается в leakage:

- признак захватывает будущие события;
- локальное время смешивается с UTC;
- train/test split делается без учета времени;
- окно признаков считается относительно неправильной даты.

## `datetime` и timezone

```python
from datetime import datetime, timezone

created_at = datetime.fromisoformat("2026-06-13T10:30:00+00:00")
now = datetime.now(timezone.utc)

print(created_at.tzinfo)
print(now)
```

Для production-кода безопаснее хранить время в UTC и явно конвертировать для отображения.

## Окна признаков

```python
from datetime import datetime, timedelta, timezone

prediction_time = datetime(2026, 6, 13, tzinfo=timezone.utc)
window_start = prediction_time - timedelta(days=7)

print(window_start)
```

Признак `sessions_7d` должен считаться только по событиям между `window_start` и `prediction_time`.

## Практический пример

```python
from datetime import datetime, timezone


def parse_event_time(value: str) -> datetime:
    event_time = datetime.fromisoformat(value)
    if event_time.tzinfo is None or event_time.utcoffset() is None:
        raise ValueError("Event time must include timezone")
    return event_time.astimezone(timezone.utc)
```

Такой parser не дает незаметно смешивать naive и timezone-aware даты.

## Типичные ошибки

1. Использовать naive `datetime` без timezone.
   Проблема: непонятно, в каком часовом поясе время.
   Решение: хранить UTC-aware значения.

2. Считать признаки по событиям после `prediction_time`.
   Проблема: leakage.
   Решение: явно фильтровать события по окну.

3. Делать случайный split для временной задачи.
   Проблема: train получает информацию из будущего.
   Решение: использовать time-based split.

4. Парсить даты как строки и сортировать лексикографически.
   Проблема: нестабильная логика.
   Решение: парсить в `datetime`.

## Cheat-sheet

| Задача | Инструмент |
| --- | --- |
| Текущее UTC-время | `datetime.now(timezone.utc)` |
| Разница во времени | `timedelta` |
| ISO parsing | `datetime.fromisoformat(...)` |
| Конвертация в UTC | `.astimezone(timezone.utc)` |
| Проверка timezone | `dt.tzinfo is not None and dt.utcoffset() is not None` |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python datetime', href: 'https://docs.python.org/3/library/datetime.html' },
        { title: 'Pandas time series', href: 'https://pandas.pydata.org/docs/user_guide/timeseries.html' },
        { title: 'Scikit-learn cross-validation for time series', href: 'https://scikit-learn.org/stable/modules/cross_validation.html#time-series-split' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Feature engineering и валидация', href: '/mlops/feature-engineering-i-validatsiya' },
        { title: 'EDA и визуализация', href: '/python/ekosistema-python/eda-i-vizualizatsiya' },
        { title: 'Scikit-learn и pipeline', href: '/python/ekosistema-python/scikit-learn-i-pipeline' },
    ]"
/>
