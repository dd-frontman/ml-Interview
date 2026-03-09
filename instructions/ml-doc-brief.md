# ML Doc Brief

## Цель

Обновить страницу `docs/python/vvedenie-v-python.md` до уровня инженерного onboarding-документа для ML: дать понятную картину роли Python, показать data/training/inference flow, добавить воспроизводимые примеры, типичные ошибки, cheat-sheet и официальные источники.

## Аудитория

- Мидл frontend-разработчик.
- Хорошо понимает HTTP/REST/CI/CD и архитектурные паттерны.
- Начинает путь в ML и нуждается в практичном переходе от web-инженерии к data/ML workflow.

## Scope

- Только обновление существующей страницы `/python/vvedenie-v-python`.
- Без изменения URL и позиции в sidebar.
- Без создания новых верхнеуровневых разделов.
- Сфокусироваться на Python как «клее» между данными, обучением модели и inference в проде.

## Как документ встраивается в текущую структуру

- Раздел: `Python` -> `Введение в Python`.
- Документ становится entry-point в Python-ветку перед углублением в `1-core` и `NumPy/Pandas`.

## Связанные документы

- `docs/python/1-core/python-core-funktsii-klassy-moduli-venv-i-pip.md`
- `docs/python/1-core/tipy-dannykh/obshaya-informatsiya.md`
- `docs/python/numpy-i-pandas-dlya-ml.md`
- `docs/ml/obuchenie-s-uchitelem.md`

## Оглавление обновляемого документа

1. Big Picture
2. Концепция простым языком
3. Инженерная интерпретация
4. Минимальный пример кода
5. Практический пример
6. Типичные ошибки
7. Cheat-sheet
8. Official docs

## Definition of Done

- Сохранен текущий route: `/python/vvedenie-v-python`.
- Добавлены обязательные секции (включая «Типичные ошибки», cheat-sheet, official docs).
- Есть минимум один «быстрый» и один «практический» Python-пример.
- Добавлены релевантные внутренние связи через `<RelatedTopics />`.
- Проходят проверки:
  - `yarn validate-content`
  - `yarn validate-links`
  - `yarn validate-routes`
