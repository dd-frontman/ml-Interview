---
title: "Введение в Python"
description: "Python как инженерная база для ML: от базовых принципов языка до воспроизводимого цикла данных, обучения и применения модели."
tags:
  - "python"
  - "ml"
  - "basics"
updatedAt: "2026-03-08"
search: false
---
## Big Picture

Python в ML-проектах работает как «системный клей»:

- собирает и готовит данные;
- запускает обучение модели;
- обслуживает применение модели в API и пакетных процессах;
- связывает код, окружение и CI/CD в воспроизводимый процесс.

Для мидл фронтенд-разработчика это удобно: вход в ML похож на привычный инженерный контур «контракт данных -> обработка -> проверка -> релиз».

## Концепция простым языком

Аналогия с фронтендом:

- схема признаков в ML - это как API-контракт между бэкендом и UI;
- обучение - как этап сборки, где создается артефакт (модель);
- применение модели - как этап выполнения, где на каждый запрос считается ответ;
- версия модели - как версия фронтового бандла: важно знать, что сейчас в проде.

Почему Python обычно выбирают первым:

- низкий порог входа в язык;
- сильная стандартная библиотека;
- развитый ML-экосистемный стек (`NumPy`, `Pandas`, `scikit-learn`, `PyTorch`).

## Инженерная интерпретация

### Поток данных

1. События продукта собираются в сырые таблицы/логи.
2. На Python строятся агрегаты признаков (`sessions_7d`, `avg_session_min`, и т.д.).
3. До обучения фиксируется контракт признаков: имена, типы, диапазоны.
4. Данные делятся на обучающую и тестовую выборки до любых обучаемых операций.

### Поток обучения

1. Формулируем целевую переменную `y` и бизнес-метрику.
2. Обучаем базовую модель.
3. Валидируем метрики и выбираем рабочий порог.
4. Сохраняем артефакты: веса/модель, порог, версию признаков, версию окружения.

### Поток применения модели

1. Приходят входные данные пользователя.
2. Применяется тот же контракт признаков, что и на обучении.
3. Считается вероятность (`score/proba`) и класс по порогу.
4. Логируются результат, версия модели и задержка.

## Минимальный пример кода

Минимальный скелет применения модели на чистом Python (без внешних библиотек):

```python
# Импортируем готовый "декоратор", который автоматически создаёт __init__ и другие методы класса.
from dataclasses import dataclass
# exp(x) нужен для формулы сигмоиды (переводит число в вероятность от 0 до 1).
from math import exp


# @dataclass(frozen=True) значит:
# 1) Python сам создаст конструктор класса;
# 2) frozen=True делает объект "только для чтения" после создания.
@dataclass(frozen=True)
class UserFeatures:
    # Ниже описание полей и их типов (float = число с плавающей точкой).
    sessions_7d: float
    avg_session_min: float
    support_tickets_30d: float


@dataclass(frozen=True)
class LogisticModel:
    # "bias" и "w_*" — параметры модели (веса).
    bias: float
    w_sessions: float
    w_avg_min: float
    w_tickets: float

    # def — объявление функции (здесь это метод класса).
    # x: UserFeatures — ожидаем объект UserFeatures.
    # -> float — функция возвращает число.
    def predict_proba(self, x: UserFeatures) -> float:
        # Считаем линейную комбинацию признаков.
        z = (
            self.bias
            + self.w_sessions * x.sessions_7d
            + self.w_avg_min * x.avg_session_min
            + self.w_tickets * x.support_tickets_30d
        )
        # Преобразуем z в вероятность через сигмоиду.
        return 1 / (1 + exp(-z))


def predict_label(model: LogisticModel, x: UserFeatures, threshold: float = 0.5) -> int:
    # int(True) == 1, int(False) == 0.
    # Если вероятность >= threshold, получаем класс 1, иначе 0.
    return int(model.predict_proba(x) >= threshold)


# Создаём объект модели с заранее заданными весами.
model = LogisticModel(bias=-1.8, w_sessions=0.22, w_avg_min=0.05, w_tickets=-0.6)
# Создаём объект с признаками конкретного пользователя.
user = UserFeatures(sessions_7d=8, avg_session_min=11.5, support_tickets_30d=0)

# round(..., 3) округляет число до 3 знаков после запятой.
print("Вероятность:", round(model.predict_proba(user), 3))
print("Класс:", predict_label(model, user, threshold=0.65))
```

Что это показывает:

- как Python описывает входные данные через типы;
- как выглядят продакшен-артефакты модели (веса + порог);
- где именно происходит решение при применении модели.

## Практический пример

Ниже мини-пайплайн на чистом Python: разделение на обучающую и тестовую выборки, «обучение» простой базовой модели по центроидам классов и оценка precision/recall.

```python
# dataclass — для удобных структур данных, как "типизированный объект".
from dataclasses import dataclass
# sqrt — квадратный корень (нужен для расстояния между точками).
from math import sqrt
# fmean — среднее значение по набору чисел.
from statistics import fmean
# Iterable — "любой объект, по которому можно пройтись циклом for".
from typing import Iterable


@dataclass(frozen=True)
class Sample:
    # Один объект Sample = одна строка датасета.
    sessions_7d: float
    avg_session_min: float
    support_tickets_30d: float
    # converted: 1 — пользователь конвертировался, 0 — нет.
    converted: int


def split_train_test(rows: Iterable[Sample]) -> tuple[list[Sample], list[Sample]]:
    # train и test — два списка, сначала пустые.
    train, test = [], []
    # enumerate(rows) даёт пары: (индекс, элемент).
    for index, row in enumerate(rows):
        # Каждую 4-ю запись отправляем в test, остальные в train.
        # Это простой детерминированный split для примера.
        (test if index % 4 == 0 else train).append(row)
    return train, test


def fit_centroids(rows: list[Sample]) -> dict[int, tuple[float, float, float]]:
    # Группируем записи по классу: 0 и 1.
    by_class: dict[int, list[Sample]] = {0: [], 1: []}
    for row in rows:
        by_class[row.converted].append(row)

    def centroid(group: list[Sample]) -> tuple[float, float, float]:
        # Для каждой группы считаем среднее по каждому признаку.
        return (
            fmean(item.sessions_7d for item in group),
            fmean(item.avg_session_min for item in group),
            fmean(item.support_tickets_30d for item in group),
        )

    # Возвращаем словарь вида:
    # {0: (средние признаки класса 0), 1: (средние признаки класса 1)}
    return {label: centroid(group) for label, group in by_class.items()}


def proba(row: Sample, centroids: dict[int, tuple[float, float, float]]) -> float:
    # Преобразуем объект row в кортеж чисел, чтобы удобно считать расстояния.
    point = (row.sessions_7d, row.avg_session_min, row.support_tickets_30d)
    # Евклидово расстояние до центроида класса 0.
    d0 = sqrt(sum((a - b) ** 2 for a, b in zip(point, centroids[0]))) + 1e-9
    # Евклидово расстояние до центроида класса 1.
    d1 = sqrt(sum((a - b) ** 2 for a, b in zip(point, centroids[1]))) + 1e-9
    # Чем ближе к классу 1, тем больше итоговая "вероятность" класса 1.
    return d0 / (d0 + d1)


def precision_recall(
    rows: list[Sample], threshold: float, centroids: dict[int, tuple[float, float, float]]
) -> tuple[float, float]:
    # tp: true positive, fp: false positive, fn: false negative.
    tp = fp = fn = 0
    for row in rows:
        # Получаем предсказанный класс по выбранному порогу.
        pred = int(proba(row, centroids) >= threshold)
        if pred == 1 and row.converted == 1:
            tp += 1
        elif pred == 1 and row.converted == 0:
            fp += 1
        elif pred == 0 and row.converted == 1:
            fn += 1

    # Защита от деления на ноль: если знаменатель 0, возвращаем 0.0.
    precision = tp / (tp + fp) if tp + fp else 0.0
    recall = tp / (tp + fn) if tp + fn else 0.0
    return precision, recall


# Небольшой учебный датасет прямо в коде.
samples = [
    Sample(2, 2.1, 3, 0),
    Sample(3, 3.4, 2, 0),
    Sample(4, 4.0, 2, 0),
    Sample(6, 5.5, 1, 0),
    Sample(7, 8.8, 1, 1),
    Sample(8, 9.2, 0, 1),
    Sample(9, 10.1, 0, 1),
    Sample(5, 6.0, 1, 0),
    Sample(10, 11.0, 0, 1),
    Sample(3, 2.8, 2, 0),
    Sample(11, 12.3, 0, 1),
    Sample(8, 8.0, 1, 1),
    Sample(12, 13.4, 0, 1),
    Sample(4, 3.1, 2, 0),
    Sample(6, 7.0, 1, 1),
    Sample(2, 2.4, 3, 0),
]

# 1) Делим данные на обучающую и тестовую выборки.
train, test = split_train_test(samples)
# 2) "Обучаем" центроиды на обучающей выборке.
centroids = fit_centroids(train)
# 3) Считаем метрики на тестовой выборке.
precision, recall = precision_recall(test, threshold=0.7, centroids=centroids)

# Выводим итоговую оценку качества.
print("Точность (precision):", round(precision, 3))
print("Полнота (recall):", round(recall, 3))
```

Почему пример полезен:

- показывает инженерную механику от начала до конца без магии библиотек;
- дает прозрачную базовую модель, от которой легко перейти к `scikit-learn`;
- демонстрирует, что порог влияет на компромисс между precision и recall.

## Типичные ошибки

1. Запускать ML-скрипты в глобальном Python-окружении.
   Проблема: версии пакетов «плывут», результат не воспроизводится.
   Решение: всегда `venv` + фиксированный список зависимостей.

2. Смешивать подготовку признаков для обучения и применения модели.
   Проблема: рассинхронизация между обучением и продом (train-serving skew) и падение качества.
   Решение: единый контракт признаков и переиспользуемые функции трансформаций.

3. Оценивать модель только по одному числу (`accuracy`).
   Проблема: скрываются ошибки на важных классах.
   Решение: смотреть precision/recall/PR-AUC и стоимость ошибок для бизнеса.

4. Игнорировать изменяемость объектов Python.
   Проблема: трудноуловимые баги в data pipeline из-за shared mutable state.
   Решение: аккуратная работа с копиями, неизменяемыми структурами и чистыми функциями.

5. Хранить «магические» константы прямо в коде inference.
   Проблема: нельзя понять, откуда взяты веса/порог и как их обновлять.
   Решение: версионировать модельные артефакты и явно логировать `model_version`.

## Cheat-sheet

| Этап | Что делаем | Инструменты Python | Артефакт | Проверка готовности |
| --- | --- | --- | --- | --- |
| Окружение | Изолируем окружение | `venv`, `pip` | Повторяемая установка | Проект поднимается на чистой машине? |
| Контракт данных | Фиксируем признаки и типы | `dataclass`, `typing` | Схема признаков | Все входы типизированы и валидируются? |
| Подготовка признаков | Готовим признаки из событий | `json`, `csv`, `pathlib` | Таблица/структура `X` | Нет ли расхождений между обучением и применением? |
| Обучение | Обучаем базовую модель | `scikit-learn` или базовая модель на чистом Python | Модель + параметры | Есть метрики на обучающей/валидационной/тестовой выборках? |
| Применение модели | Считаем score и применяем порог | Выполнение Python-кода, обработчик API | Предсказание | Логируются `score`, `threshold`, `model_version`? |
| Качество | Проверяем метрики и регрессии | `pytest`, проверки CI | Отчет качества | Можно ли воспроизвести результат по коммиту? |

## Official docs

<OfficialDocsLinks
	:links="[
		{ title: 'Python Tutorial', href: 'https://docs.python.org/3/tutorial/' },
		{ title: 'Python: dataclasses', href: 'https://docs.python.org/3/library/dataclasses.html' },
		{ title: 'Python: typing', href: 'https://docs.python.org/3/library/typing.html' },
		{ title: 'Python: venv', href: 'https://docs.python.org/3/library/venv.html' },
		{ title: 'pip User Guide', href: 'https://pip.pypa.io/en/stable/user_guide/' },
		{ title: 'Scikit-learn User Guide', href: 'https://scikit-learn.org/stable/user_guide.html' },
		{ title: 'Pandas User Guide', href: 'https://pandas.pydata.org/docs/user_guide/index.html' },
	]"
/>

<RelatedTopics
	:items="[
		{ title: 'Функции, классы, модули, venv и pip', href: '/python/1-core/python-core-funktsii-klassy-moduli-venv-i-pip' },
		{ title: 'Общая информация по типам данных', href: '/python/1-core/tipy-dannykh/obshaya-informatsiya' },
		{ title: 'NumPy и Pandas для ML', href: '/python/numpy-i-pandas-dlya-ml' },
		{ title: 'Обучение с учителем', href: '/ml/obuchenie-s-uchitelem' },
	]"
/>
