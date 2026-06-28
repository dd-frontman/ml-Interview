---
title: "Typing для Python и ML"
description: "Практический typing в Python для ML-кода: type hints, TypedDict, Literal, TypeAlias, Sequence, Mapping и Protocol."
tags:
  - "python"
  - "typing"
  - "core"
  - "ml"
updatedAt: "2026-06-13"
---
## Big Picture

Type hints в ML нужны не для академичности, а для контрактов:

- какие признаки ожидает функция;
- что может быть `None`;
- какие значения допустимы для режима запуска;
- как выглядит payload inference;
- что возвращает preprocessing или модель.

## Базовые аннотации

```python
def apply_threshold(score: float, threshold: float) -> int:
    return int(score >= threshold)
```

Для публичных функций полезно типизировать вход и выход. Внутри маленькой функции можно не аннотировать каждую переменную.

## `TypeAlias` и `Literal`

```python
from typing import Literal, TypeAlias

Stage: TypeAlias = Literal["train", "validation", "test"]


def dataset_path(stage: Stage) -> str:
    return f"data/{stage}.parquet"
```

`Literal` полезен, когда строка должна быть из фиксированного набора.

## `TypedDict`

```python
from typing import TypedDict


class PredictionPayload(TypedDict):
    sessions_7d: float
    avg_session_min: float
    support_count: int


def validate_payload(payload: PredictionPayload) -> None:
    if payload["sessions_7d"] < 0:
        raise ValueError("sessions_7d must be non-negative")
```

Это удобный минимальный контракт для JSON-like словарей.

## `Sequence` и `Mapping`

```python
from collections.abc import Mapping, Sequence


def average(values: Sequence[float]) -> float:
    return sum(values) / len(values)


def get_score(row: Mapping[str, float]) -> float:
    return row["score"]
```

`Sequence` шире, чем `list`: подойдет список, tuple и другие последовательности. `Mapping` шире, чем `dict`.

## `Protocol`

```python
from typing import Protocol


class SupportsPredictProba(Protocol):
    def predict_proba(self, X): ...


def predict_positive_proba(model: SupportsPredictProba, X) -> list[float]:
    return [float(row[1]) for row in model.predict_proba(X)]
```

`Protocol` полезен, когда важен не конкретный класс, а наличие метода.

## Типичные ошибки

1. Ставить `dict` вместо конкретного контракта.
   Проблема: непонятно, какие ключи ожидаются.
   Решение: `TypedDict` или dataclass.

2. Использовать `list` там, где подойдет любой sequence.
   Проблема: функция слишком жестко ограничена.
   Решение: `Sequence[T]` для чтения.

3. Типизировать `Any` без необходимости.
   Проблема: проверка типов отключается.
   Решение: сужать тип до реального контракта.

4. Считать typing runtime-валидацией.
   Проблема: type hints сами не проверяют данные в рантайме.
   Решение: критичные данные валидировать кодом.

## Cheat-sheet

| Задача | Что использовать |
| --- | --- |
| JSON-like payload | `TypedDict` |
| Фиксированный набор строк | `Literal` |
| Переиспользуемое имя типа | `TypeAlias` |
| Только чтение последовательности | `Sequence[T]` |
| Только чтение словаря | `Mapping[K, V]` |
| Объект с нужным методом | `Protocol` |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python typing', href: 'https://docs.python.org/3/library/typing.html' },
        { title: 'TypedDict', href: 'https://docs.python.org/3/library/typing.html#typing.TypedDict' },
        { title: 'Protocols', href: 'https://docs.python.org/3/library/typing.html#typing.Protocol' },
        { title: 'collections.abc', href: 'https://docs.python.org/3/library/collections.abc.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Функции, классы, модули, venv и pip', href: '/python/yazyk-python/1-core/python-core-funktsii-klassy-moduli-venv-i-pip' },
        { title: 'Артефакты модели и inference', href: '/python/ekosistema-python/artefakty-modeli-i-inference' },
        { title: 'Тестирование и валидация данных', href: '/python/ekosistema-python/testirovanie-i-validatsiya-dannykh' },
    ]"
/>
