---
title: "Python: язык и экосистема"
description: "Разделение Python-базы на сам язык и инструменты экосистемы, которые нужны для data и ML-задач."
tags:
  - "python"
  - "ml"
  - "navigation"
updatedAt: "2026-06-13"
---
## Зачем разделять

В ML-подготовке Python быстро смешивается с библиотеками. Это мешает учиться: ошибки языка, ошибки данных и ошибки ML-пайплайна выглядят одинаково, хотя лечатся по-разному.

В этом разделе две ветки:

- **Язык Python** - синтаксис, функции, классы, модули, типы данных, изменяемость, исключения, итераторы, typing и время.
- **Экосистема Python** - данные, SQL, NumPy, Pandas, scikit-learn, EDA, preprocessing, tracking, PyTorch, артефакты и проверки пайплайна.

## Как идти

1. Если есть пробелы в языке, начни с [Введения в Python](./yazyk-python/vvedenie-v-python.md).
2. Затем закрой [типы данных](./yazyk-python/tipy-dannykh/tipy-glavnaya.md): mutability, copy, `is`/`==`, методы коллекций.
3. Дальше добери язык для реального кода: [исключения и файлы](./yazyk-python/isklyucheniya-context-managers-i-fayly.md), [итераторы и генераторы](./yazyk-python/iteratory-generatory-i-comprehensions.md), [typing](./yazyk-python/typing-dlya-python-i-ml.md), [datetime](./yazyk-python/datetime-i-timezone.md).
4. После этого переходи к данным: [загрузка и форматы](./ekosistema-python/zagruzka-dannykh-i-formaty.md), [SQL из Python](./ekosistema-python/sql-iz-python.md), [NumPy и Pandas](./ekosistema-python/numpy-i-pandas-dlya-ml.md).
5. Для ML-практики дальше нужны [EDA](./ekosistema-python/eda-i-vizualizatsiya.md), [scikit-learn pipeline](./ekosistema-python/scikit-learn-i-pipeline.md), [preprocessing](./ekosistema-python/prodvinutyy-preprocessing.md), [experiment tracking](./ekosistema-python/experiment-tracking.md) и [PyTorch basics](./ekosistema-python/pytorch-basics.md).

## Практическое правило

Если тема объясняет, как работает сам Python, она лежит в `yazyk-python`.

Если тема объясняет, как на Python работать с данными, моделями, артефактами или проверками ML-процесса, она лежит в `ekosistema-python`.

## Cheat-sheet

| Ветка | Что внутри | Когда читать |
| --- | --- | --- |
| Язык Python | core, типы, исключения, итераторы, typing, datetime | Когда непонятно, что делает код |
| Экосистема Python | данные, SQL, NumPy, Pandas, EDA, scikit-learn, tracking, PyTorch, артефакты | Когда нужно собрать ML-пайплайн |

<RelatedTopics
    :items="[
        { title: 'Введение в Python', href: '/python/yazyk-python/vvedenie-v-python' },
        { title: 'Типы главная', href: '/python/yazyk-python/tipy-dannykh/tipy-glavnaya' },
        { title: 'Загрузка данных и форматы', href: '/python/ekosistema-python/zagruzka-dannykh-i-formaty' },
        { title: 'Scikit-learn и pipeline', href: '/python/ekosistema-python/scikit-learn-i-pipeline' },
        { title: 'PyTorch basics', href: '/python/ekosistema-python/pytorch-basics' },
    ]"
/>
