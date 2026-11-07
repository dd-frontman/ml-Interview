---
title: "Roadmap Python для ML-инженера"
description: "Практический план изучения Python для ML-инженера на 24 недели: язык, инженерная практика, данные, классический ML, воспроизводимость и inference."
tags:
  - "python"
  - "ml"
  - "roadmap"
  - "learning"
updatedAt: "2026-10-16"
search: false
---
## Цель роадмапа {#tsel-roadmapa}

Цель - научиться использовать Python как инженерный инструмент для работы с данными и моделями, а не просто выучить синтаксис.

Основная траектория рассчитана на:

- 24 недели;
- 7-10 часов в неделю;
- человека с базовым опытом программирования;
- один сквозной проект, который постепенно развивается от простого скрипта до воспроизводимого ML-пайплайна.

После прохождения основной траектории должен получиться проект со следующим циклом:

```text
load data -> validate -> preprocess -> train -> evaluate -> save -> batch predict
```

Если программирование изучается с нуля, реалистичный срок - 32-36 недель. Не нужно ускорять обучение за счет пропуска практики.

## Что входит в обязательную часть {#chto-vkhodit-v-obyazatelnuyu-chast}

Обязательная часть заканчивается классическим ML и пакетным применением модели.

В нее входят:

- базовый и прикладной Python;
- структура проекта и зависимости;
- typing, тесты, логирование и CLI;
- NumPy, Pandas, SQL и EDA;
- scikit-learn, preprocessing и Pipeline;
- корректная валидация без утечки данных;
- воспроизводимость экспериментов;
- сохранение модели и batch inference.

PyTorch, HTTP API, Docker и распределенная обработка вынесены в дополнительные треки. Они полезны не для каждой первой позиции ML-инженера и заметно увеличивают срок обучения.

## Входная диагностика {#vkhodnaya-diagnostika}

Перед началом попробуй выполнить следующие задания без копирования готового решения:

1. Создать переменные нескольких типов и объяснить разницу между `list`, `tuple`, `dict` и `set`.
2. Отфильтровать список чисел и посчитать сумму подходящих элементов.
3. Написать функцию с обязательными и необязательными аргументами.
4. Обработать некорректный ввод через `try` и `except`.
5. Прочитать JSON-файл и получить значение по ключу.
6. Разнести функцию и ее вызов по двум модулям.
7. Создать виртуальное окружение и установить зависимость.
8. Объяснить, чем `==` отличается от `is` и почему нельзя использовать `items=[]` как значение параметра по умолчанию.

Оценка результата:

| Результат | Откуда начинать |
| --- | --- |
| Выполнено 0-2 задания | С первой недели |
| Выполнено 3-5 заданий | Быстро пройти недели 1-3 и продолжить с функций |
| Выполнено 6-8 заданий | Начать с этапа прикладного Python, возвращаясь к пробелам |

Диагностика нужна для выбора точки старта, а не для подтверждения уровня.

## Карта обучения {#karta-obucheniya}

| Этап | Недели | Результат |
| --- | --- | --- |
| 1. База языка | 1-6 | Небольшие программы без копирования готового кода |
| 2. Прикладной Python | 7-9 | Скрипт загрузки и преобразования данных |
| 3. Инженерное качество | 10-12 | Структурированный проект с типами, тестами и CLI |
| 4. Работа с данными | 13-16 | Воспроизводимый data pipeline и EDA |
| 5. Классический ML | 17-21 | Корректно оцененный scikit-learn Pipeline |
| 6. Артефакты и inference | 22-24 | Воспроизводимый цикл обучения и batch prediction |

Этап считается завершенным не после чтения страниц, а после самостоятельного создания проверяемого результата.

## Недельный ритм {#nedelnyy-ritm}

При нагрузке 7-10 часов распределяй время так:

| Работа | Доля времени |
| --- | --- |
| Теория и разбор примеров | 20% |
| Самостоятельное написание кода | 45% |
| Работа над проектом | 20% |
| Повторение и разбор ошибок | 15% |

Каждую неделю желательно выполнить:

- 3-5 небольших упражнений по новой теме;
- одну задачу без подсказки, какую тему применить;
- одну доработку сквозного проекта;
- повторение двух старых задач;
- запись ошибок и выводов в журнал обучения.

## Этап 1. База языка {#etap-1-baza-yazyka}

**Срок:** недели 1-6.

### Неделя 1. Синтаксис и значения {#nedelya-1-sintaksis-i-znacheniya}

Изучи:

- [введение в Python](./yazyk-python/vvedenie-v-python.md);
- [синтаксис и переменные](./yazyk-python/1-core/osnovy-sintaksisa-i-peremennye.md);
- [арифметические операторы](./yazyk-python/1-core/arifmeticheskie-operatory.md);
- основные встроенные функции и преобразование типов.

Практика: написать консольный калькулятор, который принимает данные, преобразует типы и обрабатывает несколько операций.

### Неделя 2. Коллекции и изменяемость {#nedelya-2-kollektsii-i-izmenyaemost}

Изучи строки, списки, кортежи, словари и множества. Обязательно разберись с индексами, срезами, ссылками на объекты, поверхностным копированием и изменяемостью.

Основные страницы:

- [типы данных](./yazyk-python/tipy-dannykh/tipy-glavnaya.md);
- [списки](./yazyk-python/tipy-dannykh/spiski-bazovye-operatsii.md);
- [словари](./yazyk-python/tipy-dannykh/slovari-dict.md);
- [множества](./yazyk-python/tipy-dannykh/mnozhestva-set.md);
- [индексы и срезы](./yazyk-python/tipy-dannykh/indeksy-i-srezy.md).

Практика: собрать статистику по списку записей и вернуть результат в виде словаря.

### Неделя 3. Условия и циклы {#nedelya-3-usloviya-i-tsikly}

Изучи:

- [операторы сравнения](./yazyk-python/1-core/operatory-sravneniya.md);
- [boolean и условия](./yazyk-python/1-core/boolean-i-usloviya.md);
- [for и range](./yazyk-python/1-core/tsikly-for-i-range/);
- [while](./yazyk-python/1-core/tsikl-while.md);
- `break`, `continue`, `enumerate()` и `zip()`.

Практика: обработать коллекцию записей, пропустить некорректные элементы и сформировать итоговый отчет.

### Неделя 4. Функции {#nedelya-4-funktsii}

Изучи:

- [обычные функции](./yazyk-python/1-core/funktsii-v-python.md);
- [args и kwargs](./yazyk-python/1-core/prodvinutye-funktsii-args-kwargs.md);
- [область видимости](./yazyk-python/1-core/oblast-vidimosti-peremennyh.md);
- параметры по умолчанию, keyword-only аргументы и `return`;
- разбиение большой задачи на маленькие функции.

Практика: переписать решение прошлой недели так, чтобы чтение, проверка, преобразование и вывод выполнялись отдельными функциями.

### Неделя 5. Ошибки, файлы и модули {#nedelya-5-oshibki-fayly-i-moduli}

Изучи:

- [try и except](./yazyk-python/1-core/obrabotka-isklyucheniy-try-except.md);
- [файлы и pathlib](./yazyk-python/1-core/fayly-v-python.md);
- [импорты и модули](./yazyk-python/1-core/importy-i-moduli.md);
- `with`, кодировки и собственные исключения.

Практика: прочитать данные из файла, проверить обязательные поля и записать понятный отчет об ошибках.

### Неделя 6. Comprehensions и базовые классы {#nedelya-6-comprehensions-i-bazovye-klassy}

Изучи:

- [comprehensions](./yazyk-python/1-core/comprehensions-v-python.md);
- [класс и экземпляр](./yazyk-python/klassy/klass-i-ekzemplyar.md);
- [инициализацию, self и методы](./yazyk-python/klassy/init-self-atributy-i-metody.md).

Глубокое наследование на этом этапе не требуется. Нужно уметь прочитать простой класс и создать объект с понятным состоянием.

**Контрольная точка:** без подсказки использовать коллекции, условия, циклы и функции; объяснить mutability, `is` и `==`; обработать ошибочный ввод и разнести код по модулям.

## Этап 2. Прикладной Python {#etap-2-prikladnoy-python}

**Срок:** недели 7-9.

### Неделя 7. Окружение и структура проекта {#nedelya-7-okruzhenie-i-struktura-proekta}

Изучи [venv и pip](./yazyk-python/1-core/moduli-venv-i-pip.md), структуру каталогов проекта и разделение кода на модули.

На этом этапе проект должен:

- запускаться из чистого виртуального окружения;
- хранить зависимости в явном виде;
- не содержать секреты и локальные пути в коде;
- отделять исходный код, данные и результаты.

### Неделя 8. Форматы данных и время {#nedelya-8-formaty-dannykh-i-vremya}

Изучи:

- [JSON и сериализацию](./ekosistema-python/json-i-serializatsiya.md);
- [загрузку данных и форматы](./ekosistema-python/zagruzka-dannykh-i-formaty.md);
- [datetime и часовые пояса](./yazyk-python/datetime-i-timezone.md).

Практика: загрузить CSV или JSON, проверить структуру, привести дату к единому формату и сохранить обработанный результат.

### Неделя 9. HTTP и потоковая обработка {#nedelya-9-http-i-potokovaya-obrabotka}

Изучи:

- [requests](./ekosistema-python/http-zaprosy-requests.md);
- [исключения и context managers](./yazyk-python/isklyucheniya-context-managers-i-fayly.md);
- [итераторы и генераторы](./yazyk-python/iteratory-generatory-i-comprehensions.md).

Проект этапа: скрипт получает данные из файла или API, проверяет их, преобразует и сохраняет результат. Для сетевого запроса обязательны `timeout` и обработка ошибок.

**Контрольная точка:** создать окружение, установить зависимость, вызвать API, прочитать CSV/JSON, обработать ошибку и сохранить результат без ручного редактирования данных.

## Этап 3. Инженерное качество {#etap-3-inzhenernoe-kachestvo}

**Срок:** недели 10-12.

### Неделя 10. Типы и единый стиль {#nedelya-10-tipy-i-edinyy-stil}

Изучи [typing для Python и ML](./yazyk-python/typing-dlya-python-i-ml.md). Добавь аннотации к публичным функциям и основным структурам данных.

Также нужны:

- `pyproject.toml`;
- formatter и linter;
- статическая проверка типов;
- единые команды проверки проекта.

Не нужно типизировать каждую локальную переменную. Типы должны объяснять границы функций и форматы данных.

### Неделя 11. Тестирование {#nedelya-11-testirovanie}

Изучи [тестирование и валидацию данных](./ekosistema-python/testirovanie-i-validatsiya-dannykh.md).

Обязательный минимум `pytest`:

- обычный тест с `assert`;
- `pytest.raises()`;
- fixtures;
- `pytest.mark.parametrize()`;
- временные файлы через `tmp_path`;
- unit, integration и smoke tests.

### Неделя 12. CLI, конфигурация и логирование {#nedelya-12-cli-konfiguratsiya-i-logirovanie}

Изучи [logging и CLI](./ekosistema-python/logging-i-cli-dlya-ml-skriptov.md).

Параметры запуска должны передаваться через CLI, конфигурацию или переменные окружения. API-ключи и пароли нельзя хранить в исходном коде.

Проект этапа: превратить загрузчик данных в командный инструмент с типами, логами и 8-12 тестами.

**Контрольная точка:** проект запускается одной командой, проходит formatter, linter, type-check и тесты, а его параметры не зашиты в функции.

## Этап 4. Работа с данными {#etap-4-rabota-s-dannymi}

**Срок:** недели 13-16.

### Неделя 13. Jupyter и NumPy {#nedelya-13-jupyter-i-numpy}

Сначала изучи [правильный Jupyter workflow](./ekosistema-python/jupyter-workflow.md), затем переходи к [NumPy и Pandas](./ekosistema-python/numpy-i-pandas-dlya-ml.md).

Для NumPy обязательны массивы, `shape`, `dtype`, индексация, маски, broadcasting и векторные операции.

### Неделя 14. Pandas {#nedelya-14-pandas}

Отработай:

- чтение таблиц;
- выбор столбцов и строк;
- фильтрацию;
- пропуски и дубликаты;
- `groupby`, `merge` и агрегации;
- явное управление типами данных.

### Неделя 15. SQL и форматы {#nedelya-15-sql-i-formaty}

Изучи [SQL из Python](./ekosistema-python/sql-iz-python.md) и повтори CSV, JSON и Parquet.

Практика: получить одинаковый набор признаков из файла и SQL-запроса, затем сравнить схему и количество строк.

### Неделя 16. EDA и data pipeline {#nedelya-16-eda-i-data-pipeline}

Изучи [EDA и визуализацию](./ekosistema-python/eda-i-vizualizatsiya.md).

Проект этапа должен выполнять путь `raw -> validate -> clean -> processed` и отдельно формировать EDA-отчет. Стабильная логика остается в `.py`, notebook используется для исследования и графиков.

**Контрольная точка:** проверить форму данных, типы, пропуски и дубликаты; выполнить `groupby` и `merge`; объяснить результаты EDA; повторить обработку из исходных данных одной командой.

## Этап 5. Классический ML {#etap-5-klassicheskiy-ml}

**Срок:** недели 17-21.

### Неделя 17. Постановка задачи и baseline {#nedelya-17-postanovka-zadachi-i-baseline}

Определи:

- объект предсказания;
- target;
- признаки, доступные на момент предсказания;
- подходящую метрику;
- простой baseline;
- правило разделения train, validation и test.

Математику и теорию моделей изучай параллельно в разделах [математики](/math/lineynaya-algebra-dlya-ml) и [Machine Learning](/ml/obuchenie-s-uchitelem).

### Неделя 18. Обучение и метрики {#nedelya-18-obuchenie-i-metriki}

Изучи [scikit-learn и Pipeline](./ekosistema-python/scikit-learn-i-pipeline.md). Научись сравнивать baseline минимум с двумя моделями по одному протоколу.

### Неделя 19. Preprocessing без leakage {#nedelya-19-preprocessing-bez-leakage}

Изучи [продвинутый preprocessing](./ekosistema-python/prodvinutyy-preprocessing.md).

Все обучаемые преобразования должны находиться внутри `Pipeline` и вызываться через `fit()` только на обучающих данных.

### Неделя 20. Cross-validation и подбор параметров {#nedelya-20-cross-validation-i-podbor-parametrov}

Разберись, почему обычный случайный split подходит не всегда:

- для связанных объектов нужны групповые разбиения;
- для временных данных нужна проверка на будущем периоде;
- подбор параметров выполняется внутри cross-validation;
- test не используется для выбора модели и порога.

### Неделя 21. Анализ ошибок {#nedelya-21-analiz-oshibok}

Сравни модели, проверь качество на важных срезах, изучи ошибки и зафиксируй ограничения решения.

Проект этапа: scikit-learn Pipeline с baseline, корректным split, preprocessing, cross-validation, метриками и анализом ошибок.

**Контрольная точка:** сформулировать задачу и метрику, построить baseline, сравнить модели, объяснить split, исключить leakage и не использовать test во время настройки.

## Этап 6. Воспроизводимость и inference {#etap-6-vosproizvodimost-i-inference}

**Срок:** недели 22-24.

### Неделя 22. Воспроизводимый эксперимент {#nedelya-22-vosproizvodimyy-eksperiment}

Изучи:

- [воспроизводимость ML-кода](./ekosistema-python/vosproizvodimost-ml-koda.md);
- [experiment tracking](./ekosistema-python/experiment-tracking.md).

Для каждого запуска сохраняй версию данных, параметры, seed, метрики и путь к артефактам.

### Неделя 23. Артефакты и batch inference {#nedelya-23-artefakty-i-batch-inference}

Изучи [артефакты модели и inference](./ekosistema-python/artefakty-modeli-i-inference.md).

Вместе с моделью сохраняй:

- порядок и названия признаков;
- версию кода и библиотек;
- параметры preprocessing;
- threshold;
- метрики и дату обучения;
- схему входных данных.

### Неделя 24. Итоговая проверка {#nedelya-24-itogovaya-proverka}

Разверни проект в чистом окружении и выполни полный цикл по инструкции из README.

Итоговый проект должен:

- одной командой подготовить данные;
- одной командой обучить и оценить модель;
- сохранить Pipeline и метаданные;
- выполнить batch prediction на новых данных;
- отклонить вход с неправильной схемой;
- пройти тесты;
- воспроизвести метрику в заданном допуске.

**Контрольная точка:** другой разработчик может получить проект, создать окружение, повторить обучение и применить модель без ручного исправления кода.

## Дополнительные треки {#dopolnitelnye-treki}

Дополнительные темы выбираются после основной траектории под требования вакансии.

### Deep Learning {#deep-learning}

Начни с [PyTorch basics](./ekosistema-python/pytorch-basics.md), затем добавь validation loop, `model.train()`, `model.eval()`, `torch.inference_mode()`, checkpoint и возобновление обучения.

### HTTP inference и deploy {#http-inference-i-deploy}

Изучи валидацию запросов, загрузку модели один раз при старте, healthcheck, тест API, Docker, latency и мониторинг. Продолжить можно в разделе [deploy и мониторинг](/mlops/deploy-i-monitoring).

### Производительность и большие данные {#proizvoditelnost-i-bolshie-dannye}

После появления реальной проблемы изучай профилирование, multiprocessing, Polars, Dask или Spark. Не начинай с них, если данные помещаются в память и обычного Pandas достаточно.

### Продвинутый Python {#prodvinutyy-python}

Asyncio, дескрипторы, метаклассы, сложные декораторы и внутреннее устройство CPython полезны для отдельных задач, но не должны задерживать первый ML-проект.

## Система повторения {#sistema-povtoreniya}

Повторяй сложную тему:

- через один день;
- через одну неделю;
- через три недели;
- в новом контексте внутри проекта.

При повторении не копируй старый код. Сначала объясни идею, затем напиши решение заново и только после этого сравни с предыдущей версией.

Журнал обучения может содержать:

| Поле | Пример |
| --- | --- |
| Тема | Изменяемые аргументы по умолчанию |
| Задача | Безопасно добавить элемент в список |
| Решено самостоятельно | Да |
| Ошибка | Использовал `items=[]` |
| Что исправил | Использовал `None` и создал список внутри функции |
| Дата повторения | Через 7 дней |

## Критерий завершения {#kriteriy-zaversheniya}

Роадмап пройден, если ты можешь:

1. Написать и отладить Python-модуль без копирования готового решения.
2. Объяснить типы, изменяемость, ссылки, исключения и область видимости.
3. Создать воспроизводимое окружение и установить зависимости.
4. Получить данные из файла, SQL или API и проверить их схему.
5. Написать тесты для преобразования данных и inference.
6. Собрать leakage-safe Pipeline и выбрать подходящую схему валидации.
7. Сравнить модель с baseline и объяснить выбранную метрику.
8. Сохранить модель вместе с признаками, threshold и метаданными.
9. Повторить обучение в чистом окружении.
10. Применить модель к новым данным и корректно обработать неправильный вход.

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial', href: 'https://docs.python.org/3/tutorial/' },
        { title: 'Python Packaging User Guide', href: 'https://packaging.python.org/en/latest/' },
        { title: 'pytest documentation', href: 'https://docs.pytest.org/en/stable/' },
        { title: 'Ruff documentation', href: 'https://docs.astral.sh/ruff/' },
        { title: 'scikit-learn: Common pitfalls', href: 'https://scikit-learn.org/stable/common_pitfalls.html' },
        { title: 'scikit-learn: Cross-validation', href: 'https://scikit-learn.org/stable/modules/cross_validation.html' },
        { title: 'PyTorch: Learn the Basics', href: 'https://docs.pytorch.org/tutorials/beginner/basics/' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Python: язык и экосистема', href: '/python' },
        { title: 'Введение в Python', href: '/python/yazyk-python/vvedenie-v-python' },
        { title: 'Scikit-learn и pipeline', href: '/python/ekosistema-python/scikit-learn-i-pipeline' },
        { title: 'Воспроизводимость ML-кода', href: '/python/ekosistema-python/vosproizvodimost-ml-koda' },
        { title: 'Артефакты модели и inference', href: '/python/ekosistema-python/artefakty-modeli-i-inference' },
    ]"
/>
