---
title: "Jupyter workflow"
description: "Как использовать Jupyter Notebook для EDA и экспериментов, не превращая ML-проект в невоспроизводимый набор ячеек."
tags:
  - "python"
  - "jupyter"
  - "notebook"
  - "ml"
updatedAt: "2026-06-13"
---
## Big Picture

Notebook удобен для исследования, но плох как единственный источник production-логики.

Нормальный workflow:

- в notebook исследовать данные и гипотезы;
- стабильные функции переносить в `.py`;
- обучение запускать скриптом;
- notebook оставлять как отчет или черновик.

## Что держать в notebook

- EDA;
- графики;
- сравнение гипотез;
- быстрые эксперименты;
- комментарии к выводам.

## Что выносить в `.py`

- загрузку данных;
- feature engineering;
- validation checks;
- обучение модели;
- inference-функцию;
- сохранение артефактов.

## Практический цикл

1. В notebook понять датасет.
2. Написать черновую функцию.
3. Перенести функцию в `src/features.py`.
4. Импортировать функцию обратно в notebook.
5. Запустить обучение через `python -m ...`.

```python
from ml_project.features import build_features

features = build_features(events)
```

## Типичные ошибки

1. Обучать финальную модель только из notebook.
   Проблема: трудно повторить запуск.
   Решение: вынести training code в скрипт.

2. Менять ячейки не по порядку.
   Проблема: состояние notebook не соответствует коду.
   Решение: периодически restart kernel и run all.

3. Хранить важные параметры только в ячейке.
   Проблема: эксперимент нельзя воспроизвести.
   Решение: параметры в config или CLI.

4. Смешивать EDA и production inference.
   Проблема: inference зависит от notebook-состояния.
   Решение: inference только в `.py`-коде.

## Cheat-sheet

| Где | Что держать |
| --- | --- |
| Notebook | EDA, графики, гипотезы, отчет |
| `.py` | функции, pipeline, train, predict |
| Config/CLI | параметры запуска |
| README | команды воспроизведения |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Jupyter Notebook documentation', href: 'https://jupyter-notebook.readthedocs.io/en/stable/' },
        { title: 'IPython documentation', href: 'https://ipython.readthedocs.io/en/stable/' },
        { title: 'Python modules', href: 'https://docs.python.org/3/tutorial/modules.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'EDA и визуализация', href: '/python/ekosistema-python/eda-i-vizualizatsiya' },
        { title: 'Воспроизводимость ML-кода', href: '/python/ekosistema-python/vosproizvodimost-ml-koda' },
        { title: 'Logging и CLI для ML-скриптов', href: '/python/ekosistema-python/logging-i-cli-dlya-ml-skriptov' },
    ]"
/>
