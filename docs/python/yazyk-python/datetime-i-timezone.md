---
title: "Дата и время в Python"
description: "Модуль datetime: создание дат, атрибуты, ISO-формат, strftime и strptime, timedelta, UTC, часовые пояса и окна признаков для ML."
tags:
  - "python"
  - "datetime"
  - "core"
  - "ml"
updatedAt: "2026-09-30"
---
## Для чего нужен datetime {#dlya-chego-nuzhen-datetime}

`datetime` - модуль стандартной библиотеки Python для работы с датами и временем. Устанавливать его через `pip` не нужно. Название пишется строчными буквами: `datetime`, а не `dateTime`.

Он помогает получить текущую дату, разобрать дату из API, вычислить срок или вывести время в нужном формате. Строка `"30.09.2026"` хранит текст, а объект даты позволяет работать с годом, месяцем и днем отдельно.

## Почему datetime.datetime {#pochemu-datetime-datetime}

```python
import datetime

now = datetime.datetime.now()
print(type(now))  # <class 'datetime.datetime'>
```

Первое `datetime` - модуль, второе - класс внутри него, `now()` - метод класса, возвращающий текущие дату и время.

При импорте `from datetime import datetime` имя `datetime` обозначает уже класс, поэтому вызов будет `datetime.now()`. Основные примеры ниже используют импорт модуля: `import datetime`.

Не называй собственный файл `datetime.py`: он может перекрыть стандартный модуль.

## Основные типы {#osnovnye-tipy}

| Тип | Что представляет |
| --- | --- |
| `datetime.date` | дату без времени |
| `datetime.time` | время суток без даты |
| `datetime.datetime` | дату и время вместе |
| `datetime.timedelta` | продолжительность, например два часа |
| `datetime.timezone` | часовой пояс с фиксированным смещением от UTC |

`datetime.time` не является модулем `time`: у него нет `sleep()`.

## Текущая дата и время {#tekushchaya-data-i-vremya}

```python
import datetime

local_now = datetime.datetime.now()
utc_now = datetime.datetime.now(datetime.timezone.utc)
today = datetime.date.today()

print(local_now)  # Например: 2026-09-30 12:30:15.123456
print(utc_now)    # Например: 2026-09-30 09:30:15.123500+00:00
print(today)      # Например: 2026-09-30
```

Это примеры вывода: реальные значения зависят от момента запуска и локального часового пояса компьютера.

`now()` без аргумента и `date.today()` используют локальное время компьютера. У `local_now` нет информации о часовом поясе, у `utc_now` она есть. UTC служит общей точкой отсчета для времени в разных зонах.

В уроке встречается `datetime.UTC`: это другое имя для `datetime.timezone.utc`, доступное начиная с Python 3.11. В примерах используется более совместимая запись.

## Создание даты и ее атрибуты {#sozdanie-daty-i-ee-atributy}

```python
import datetime

meeting = datetime.datetime(
    year=2026, month=9, day=30,
    hour=12, minute=30, second=15, microsecond=123456,
)

print(meeting)              # 2026-09-30 12:30:15.123456
print(meeting.year)         # 2026
print(meeting.month)        # 9
print(meeting.day)          # 30
print(meeting.hour)         # 12
print(meeting.minute)       # 30
print(meeting.second)       # 15
print(meeting.microsecond)  # 123456
print(meeting.date())       # 2026-09-30
print(meeting.time())       # 12:30:15.123456

day = datetime.date(2026, 9, 30)
clock = datetime.time(12, 30)
print(datetime.datetime.combine(day, clock))  # 2026-09-30 12:30:00
```

`year`, `month` и остальные компоненты - целые числа, а не строки. Поэтому `month` равен `9`, а не `"09"`. Микросекунда - миллионная доля секунды; допустимы значения от `0` до `999999`.

Несуществующая дата, например `datetime.date(2026, 2, 30)`, вызовет `ValueError`.

## Изменение даты через replace {#izmenenie-daty-cherez-replace}

Объекты даты и времени неизменяемы. Метод `replace()` возвращает новый объект:

```python
import datetime

meeting = datetime.datetime(2026, 9, 30, 12, 30)
later = meeting.replace(hour=15)

print(meeting)  # 2026-09-30 12:30:00
print(later)    # 2026-09-30 15:30:00
```

`replace(hour=15)` устанавливает час, а не прибавляет 15 часов.

## ISO-формат и преобразование строк {#iso-format-i-preobrazovanie-strok}

`isoformat()` превращает объект в строку, а `fromisoformat()` разбирает строку обратно:

```python
import datetime

text = "2023-08-07T20:15:30.384294"
moment = datetime.datetime.fromisoformat(text)

print(type(moment))       # <class 'datetime.datetime'>
print(moment)            # 2023-08-07 20:15:30.384294
print(moment.isoformat()) # 2023-08-07T20:15:30.384294

event = datetime.datetime.fromisoformat("2026-09-30T10:30:00+00:00")
print(event.tzinfo)       # UTC
```

`T` разделяет дату и время, цифры после точки обозначают доли секунды. `+00:00` задает нулевое смещение от UTC. В первой строке смещения нет, поэтому `moment` не содержит часового пояса.

## Форматирование strftime и разбор strptime {#formatirovanie-strftime-i-razbor-strptime}

```python
import datetime

moment = datetime.datetime(2026, 9, 30, 14, 5)
text = moment.strftime("%d.%m.%Y %H:%M")
restored = datetime.datetime.strptime(text, "%d.%m.%Y %H:%M")

print(text)      # 30.09.2026 14:05
print(restored)  # 2026-09-30 14:05:00
```

`strftime`: объект → строка. `strptime`: строка → объект по указанному шаблону. Несовпадение строки и шаблона вызывает `ValueError`.

| Код | Значение | Пример |
| --- | --- | --- |
| `%Y` | год полностью | `2026` |
| `%m` | месяц | `09` |
| `%d` | день | `30` |
| `%H` | часы, 24-часовой формат | `14` |
| `%M` | минуты | `05` |
| `%S` | секунды | `00` |
| `%f` | микросекунды | `123456` |
| `%z` | смещение от UTC | `+0300` |
| `%A`, `%B` | название дня недели, месяца | зависит от локали |

Регистр важен: `%m` - месяц, `%M` - минуты. `strftime("%A, %d %B %Y")` не гарантирует русские названия: используется локаль процесса. Формат без секунд или часового пояса теряет эту информацию при преобразовании в строку.

## Интервалы timedelta {#intervaly-timedelta}

```python
import datetime

start = datetime.datetime(2026, 9, 30, 12)
end = start + datetime.timedelta(days=1, hours=2)
duration = end - start

print(end)                               # 2026-10-01 14:00:00
print(start - datetime.timedelta(days=1)) # 2026-09-29 12:00:00
print(duration.days)                     # 1
print(duration.seconds)                  # 7200
print(duration.total_seconds())          # 93600.0
```

Вычитание двух `datetime` возвращает `timedelta`. `seconds` - секундная часть после выделения полных дней, а `total_seconds()` учитывает весь интервал.

`timedelta` принимает недели, дни, часы, минуты, секунды и доли секунды. Параметров `months` и `years` нет: месяцы и годы имеют разную длину. Прибавить 30 дней не всегда означает прибавить календарный месяц.

## `datetime` и timezone {#datetime-i-timezone}

- **Naive**: нет достаточной информации о часовом поясе. Например, просто «12:00» неизвестно в какой зоне.
- **Aware**: часовой пояс определяет смещение от UTC для этой даты.

Вычитание naive и aware объектов, а также сравнения порядка (`<`, `>`) между ними вызывают `TypeError`. Проверка `==` не вызывает эту ошибку: такие объекты не равны.

```python
import datetime
from zoneinfo import ZoneInfo

utc_time = datetime.datetime(2026, 9, 30, 10, tzinfo=datetime.timezone.utc)
moscow_time = utc_time.astimezone(ZoneInfo("Europe/Moscow"))

print(utc_time)               # 2026-09-30 10:00:00+00:00
print(moscow_time)            # 2026-09-30 13:00:00+03:00
print(utc_time == moscow_time) # True
```

Это один момент, отображенный в двух зонах. `astimezone()` пересчитывает часы, а `replace(tzinfo=...)` лишь меняет информацию о зоне без пересчета. Назначать UTC через `replace` допустимо только если известно, что исходные часы уже обозначают UTC.

`ZoneInfo` доступен с Python 3.9 и использует базу часовых поясов IANA. При отсутствии базы может понадобиться пакет `tzdata`; иначе возможен `ZoneInfoNotFoundError`. См. [документацию zoneinfo](https://docs.python.org/3/library/zoneinfo.html).

Для хранения моментов событий удобно использовать UTC. Чтобы посчитать фактически прошедшее время через переход на летнее время, сначала переведи оба момента в UTC: разница местных часов может отличаться от реальной длительности.

## Unix timestamp {#unix-timestamp}

Это число секунд с `1970-01-01 00:00:00 UTC`, а не строка даты:

```python
import datetime

moment = datetime.datetime(1970, 1, 1, 0, 1, 30, tzinfo=datetime.timezone.utc)
stamp = moment.timestamp()
restored = datetime.datetime.fromtimestamp(stamp, tz=datetime.timezone.utc)

print(stamp)     # 90.0
print(restored)  # 1970-01-01 00:01:30+00:00
```

`fromtimestamp()` без `tz` использует локальную зону и возвращает naive-объект. Если API передает миллисекунды, раздели их на `1000`.

## Окна признаков {#okna-priznakov}

В ML дата задает границу доступной информации: нельзя использовать события из будущего для предсказания прошлого.

```python
from datetime import datetime, timedelta, timezone

prediction_time = datetime(2026, 9, 30, tzinfo=timezone.utc)
window_start = prediction_time - timedelta(days=7)
event_time = datetime(2026, 9, 29, tzinfo=timezone.utc)

print(window_start)  # 2026-09-23 00:00:00+00:00
print(window_start <= event_time < prediction_time)  # True
```

Здесь окно включает начало, но исключает момент предсказания. События после него создадут утечку данных. Для временных задач разделяй обучающую и проверочную выборки по времени, учитывая момент фактической доступности признаков.

## Практический пример {#prakticheskiy-primer}

Функция принимает строку события, требует указания часового пояса и возвращает время в UTC:

```python
from datetime import datetime, timezone


def parse_event_time(value: str) -> datetime:
    event_time = datetime.fromisoformat(value)
    if event_time.tzinfo is None or event_time.utcoffset() is None:
        raise ValueError("Event time must include timezone")
    return event_time.astimezone(timezone.utc)


print(parse_event_time("2026-09-30T13:00:00+03:00"))  # 2026-09-30 10:00:00+00:00
```

Строка без смещения будет отклонена, а не молча принята за местное время.

## Типичные ошибки {#tipichnye-oshibki}

| Ошибка | Как исправить |
| --- | --- |
| `import datetime` и затем `datetime.now()` | обратиться к классу: `datetime.datetime.now()` |
| `meeting.hour = 15` | сохранить результат `meeting.replace(hour=15)` |
| считать `duration.seconds` полной длительностью | вызвать `duration.total_seconds()` |
| сортировать строки `DD.MM.YYYY` | сначала разобрать их через `strptime()` |
| использовать `replace(tzinfo=...)` для перевода часов | вызвать `astimezone()` |
| ожидать часовой пояс после разбора строки без смещения | проверить `tzinfo` и договориться о зоне входных данных |

## Задачи {#zadachi}

1. Создай дату встречи и выведи ее как `30.09.2026 14:05`.
2. Разбери строку `"07.08.2023 20:15"` и прибавь два часа.
3. Найди полную длительность интервала в один день и 90 минут в секундах.
4. Переведи `"2026-09-30T13:00:00+03:00"` в UTC. Проверь, что исходный и новый объекты обозначают один момент.

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python datetime', href: 'https://docs.python.org/3/library/datetime.html' },
        { title: 'Python: strftime и strptime', href: 'https://docs.python.org/3/library/datetime.html#strftime-and-strptime-behavior' },
        { title: 'Python zoneinfo', href: 'https://docs.python.org/3/library/zoneinfo.html' },
        { title: 'Pandas time series', href: 'https://pandas.pydata.org/docs/user_guide/timeseries.html' },
        { title: 'Scikit-learn cross-validation for time series', href: 'https://scikit-learn.org/stable/modules/cross_validation.html#time-series-split' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Импорты и модули', href: '/python/yazyk-python/1-core/importy-i-moduli' },
        { title: 'JSON и сериализация', href: '/python/ekosistema-python/json-i-serializatsiya' },
        { title: 'Feature engineering и валидация', href: '/mlops/feature-engineering-i-validatsiya' },
        { title: 'EDA и визуализация', href: '/python/ekosistema-python/eda-i-vizualizatsiya' },
        { title: 'Scikit-learn и pipeline', href: '/python/ekosistema-python/scikit-learn-i-pipeline' },
    ]"
/>
