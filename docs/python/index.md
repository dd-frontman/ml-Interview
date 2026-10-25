---
title: "Python: язык и экосистема"
description: "Разделение Python-базы на сам язык и инструменты экосистемы, которые нужны для data и ML-задач."
tags:
  - "python"
  - "ml"
  - "navigation"
updatedAt: "2026-06-13"
---
## Зачем разделять {#zachem-razdelyat}

В ML-подготовке Python быстро смешивается с библиотеками. Это мешает учиться: ошибки языка, ошибки данных и ошибки ML-пайплайна выглядят одинаково, хотя лечатся по-разному.

В этом разделе две ветки:

- **Язык Python** - синтаксис, функции, классы, модули, типы данных, изменяемость, исключения, итераторы, typing и время.
- **Экосистема Python** - данные, SQL, NumPy, Pandas, scikit-learn, EDA, preprocessing, tracking, PyTorch, артефакты и проверки пайплайна.

## Выбери траекторию {#vyberi-traektoriyu}

- [Python для ML-инженера](./roadmap-python-dlya-ml-inzhenera.md) - путь от языка до воспроизводимого обучения и batch inference.
- [Алгоритмы и структуры данных на Python](./roadmap-algoritmy-i-struktury-dannykh-na-python.md) - подготовка к алгоритмическим собеседованиям уровня Easy и Medium.

## Как идти {#kak-idti}

1. Начни с [роадмапа Python для ML-инженера](./roadmap-python-dlya-ml-inzhenera.md): пройди входную диагностику и выбери точку старта.
2. Если есть пробелы в языке, переходи к [Введению в Python](./yazyk-python/vvedenie-v-python.md).
3. Затем закрой [типы данных](./yazyk-python/tipy-dannykh/tipy-glavnaya.md): mutability, copy, `is`/`==`, методы коллекций.
4. Дальше добери язык для реального кода: [исключения и файлы](./yazyk-python/isklyucheniya-context-managers-i-fayly.md), [итераторы и генераторы](./yazyk-python/iteratory-i-generatory/iteratory-i-generatory-glavnaya.md), [typing](./yazyk-python/typing-dlya-python-i-ml.md), [datetime](./yazyk-python/datetime-i-timezone.md).
5. После этого переходи к данным: [загрузка и форматы](./ekosistema-python/zagruzka-dannykh-i-formaty.md), [SQL из Python](./ekosistema-python/sql-iz-python.md), [NumPy и Pandas](./ekosistema-python/numpy-i-pandas-dlya-ml.md).
6. Для ML-практики дальше нужны [EDA](./ekosistema-python/eda-i-vizualizatsiya.md), [scikit-learn pipeline](./ekosistema-python/scikit-learn-i-pipeline.md), [preprocessing](./ekosistema-python/prodvinutyy-preprocessing.md), [experiment tracking](./ekosistema-python/experiment-tracking.md) и [артефакты модели](./ekosistema-python/artefakty-modeli-i-inference.md).

## Практическое правило {#prakticheskoe-pravilo}

Если тема объясняет, как работает сам Python, она лежит в `yazyk-python`.

Если тема объясняет, как на Python работать с данными, моделями, артефактами или проверками ML-процесса, она лежит в `ekosistema-python`.

## Cheat-sheet {#cheat-sheet}

| Ветка | Что внутри | Когда читать |
| --- | --- | --- |
| Язык Python | core, типы, исключения, итераторы, typing, datetime | Когда непонятно, что делает код |
| Экосистема Python | данные, SQL, NumPy, Pandas, EDA, scikit-learn, tracking, PyTorch, артефакты | Когда нужно собрать ML-пайплайн |

<RelatedTopics
    :items="[
        { title: 'Roadmap Python для ML-инженера', href: '/python/roadmap-python-dlya-ml-inzhenera' },
        { title: 'Алгоритмы и структуры данных на Python', href: '/python/roadmap-algoritmy-i-struktury-dannykh-na-python' },
        { title: 'Введение в Python', href: '/python/yazyk-python/vvedenie-v-python' },
        { title: 'Типы главная', href: '/python/yazyk-python/tipy-dannykh/tipy-glavnaya' },
        { title: 'Загрузка данных и форматы', href: '/python/ekosistema-python/zagruzka-dannykh-i-formaty' },
        { title: 'Scikit-learn и pipeline', href: '/python/ekosistema-python/scikit-learn-i-pipeline' },
        { title: 'PyTorch basics', href: '/python/ekosistema-python/pytorch-basics' },
    ]"
/>
