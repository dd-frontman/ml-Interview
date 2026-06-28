---
title: "Итераторы, генераторы и comprehensions"
description: "Как в Python работают iterable, iterator, генераторы, yield, enumerate, zip и comprehensions на практических data-примерах."
tags:
  - "python"
  - "core"
  - "iterators"
  - "generators"
updatedAt: "2026-06-13"
---
## Big Picture

ML-код часто обрабатывает последовательности: строки файла, batch-данные, события пользователя, признаки, предсказания.

Чтобы писать такой код коротко и без лишней памяти, нужно понимать:

- `iterable` - объект, по которому можно пройтись циклом;
- `iterator` - объект, который выдает элементы по одному;
- generator - ленивый iterator, часто через `yield`;
- comprehension - компактная сборка коллекции.

## Comprehensions

```python
scores = [0.12, 0.73, 0.44, 0.91]
labels = [int(score >= 0.5) for score in scores]

print(labels)  # [0, 1, 0, 1]
```

Словарь:

```python
raw_features = {"sessions_7d": "8", "avg_session_min": "11.5"}
features = {name: float(value) for name, value in raw_features.items()}
```

Практическое правило: comprehension хорош для простой трансформации. Если условий много, обычный `for` читается лучше.

## `enumerate` и `zip`

```python
feature_names = ["sessions_7d", "avg_session_min"]
feature_values = [8, 11.5]

row = dict(zip(feature_names, feature_values))
print(row)
```

```python
for index, score in enumerate(scores):
    print(index, score)
```

`zip` полезен, когда нужно связать имена признаков и значения. `enumerate` - когда нужен индекс без ручного счетчика.

## Генераторы

```python
def positive_scores(scores: list[float]):
    for score in scores:
        if score >= 0.5:
            yield score


for score in positive_scores([0.1, 0.8, 0.3, 0.9]):
    print(score)
```

Генератор не строит весь результат заранее. Это удобно для больших файлов и потоков событий.

## Практический пример

```python
def iter_batches(rows: list[dict], batch_size: int):
    for start in range(0, len(rows), batch_size):
        yield rows[start : start + batch_size]


for batch in iter_batches(rows=[{"id": 1}, {"id": 2}, {"id": 3}], batch_size=2):
    print(batch)
```

Это базовый паттерн batch processing.

## Типичные ошибки

1. Делать огромный `list(...)`, когда достаточно итерации.
   Проблема: лишняя память.
   Решение: использовать generator или обрабатывать по batch.

2. Переиспользовать iterator второй раз.
   Проблема: iterator уже исчерпан.
   Решение: создать новый iterator или сохранить данные, если они реально нужны повторно.

3. Делать слишком сложный comprehension.
   Проблема: код становится нечитаемым.
   Решение: заменить на обычный цикл.

4. Использовать `zip` для списков разной длины без проверки.
   Проблема: лишние элементы silently отбрасываются.
   Решение: заранее проверять длины, если это важно.

## Cheat-sheet

| Инструмент | Когда использовать |
| --- | --- |
| `for item in items` | обычная итерация |
| `enumerate(items)` | нужен индекс |
| `zip(a, b)` | связать две последовательности |
| `[f(x) for x in xs]` | простая трансформация в список |
| `{k: v for ...}` | сборка словаря |
| `yield` | ленивый поток значений |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python Data Structures', href: 'https://docs.python.org/3/tutorial/datastructures.html' },
        { title: 'Python iterators', href: 'https://docs.python.org/3/tutorial/classes.html#iterators' },
        { title: 'Python generators', href: 'https://docs.python.org/3/tutorial/classes.html#generators' },
        { title: 'Built-in functions', href: 'https://docs.python.org/3/library/functions.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Изменяемые типы', href: '/python/yazyk-python/tipy-dannykh/izmenyaemye-tipy' },
        { title: 'Методы типов данных', href: '/python/yazyk-python/tipy-dannykh/metody-tipov-dannykh' },
        { title: 'Загрузка данных и форматы', href: '/python/ekosistema-python/zagruzka-dannykh-i-formaty' },
    ]"
/>
