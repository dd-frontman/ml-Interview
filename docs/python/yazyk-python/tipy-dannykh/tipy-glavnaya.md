---
title: "Типы данных Python"
description: "Карта основных встроенных типов Python, их группировка, изменяемость и рекомендуемый порядок изучения."
tags:
  - "python"
  - "core"
  - "data-types"
  - "mutability"
updatedAt: "2026-11-21"
---
## Зачем нужна карта типов {#zachem-nuzhna-karta-tipov}

Тип определяет, какие значения хранит объект и какие операции с ним доступны. Список можно изменить через любую ссылку на него. Переменную со строкой можно связать с новой строкой, но сам существующий объект `str` изменить нельзя:

```python
items = ["python"]
same_items = items
items.append("ml")

text = "python"
same_text = text
text += "!"

print(same_items)  # ['python', 'ml']
print(text)        # python!
print(same_text)   # python
```

`items.append()` изменил существующий список. Выражение `text += "!"` создало другую строку и перепривязало к ней имя `text`; объект, на который указывает `same_text`, остался прежним.

Эта страница помогает выбрать нужную тему. Подробные правила и примеры находятся на отдельных страницах.

## Карта основных типов {#karta-osnovnykh-tipov}

В учебной карте `15` встроенных типов:

| Группа | Количество | Типы |
| --- | ---: | --- |
| Специальные значения | `2` | `bool`, `NoneType` |
| Числа | `3` | `int`, `float`, `complex` |
| Текст | `1` | `str` |
| Последовательности | `3` | `list`, `tuple`, `range` |
| Словари (отображения) | `1` | `dict` |
| Уникальные элементы | `2` | `set`, `frozenset` |
| Бинарные данные | `3` | `bytes`, `bytearray`, `memoryview` |

Это не закрытый список всех типов Python. Свои классы, стандартная библиотека и сторонние библиотеки создают дополнительные типы.

В документации Python `dict` относится к категории *mapping types*, по-русски «отображения». «Отображение» описывает общий принцип «ключ → значение», а «словарь» — привычное название конкретного встроенного типа `dict`.

## Изменяемость {#izmenyaemost}

В этой карте типы распределяются так:

| Категория | Количество | Типы |
| --- | ---: | --- |
| Неизменяемые | `10` | `int`, `float`, `complex`, `bool`, `str`, `tuple`, `range`, `frozenset`, `bytes`, `NoneType` |
| Изменяемые | `4` | `list`, `dict`, `set`, `bytearray` |
| Зависит от буфера и режима представления | `1` | `memoryview` |

Подробности:

- [неизменяемые типы](./neizmenyaemye-tipy.md);
- [изменяемые типы](./izmenyaemye-tipy.md);
- [ссылки, сравнение и копирование](./ssylki-sravnenie-i-kopirovanie.md).

## Как запомнить типы {#kak-zapomnit-tipy}

Сокращение `СЧТПКУБ` помогает восстановить семь групп:

> **С**аша **Ч**асто **Т**ренирует **П**амять, **К**огда **У**чит **Б**азу.

```text
С — специальные: bool, NoneType
Ч — числа: int, float, complex
Т — текст: str
П — последовательности: list, tuple, range
К — ключ → значение: dict (словарь)
У — уникальные элементы: set, frozenset
Б — бинарные данные: bytes, bytearray, memoryview
```

Проверка количества:

```text
2 + 3 + 1 + 3 + 1 + 2 + 3 = 15
```

Четыре изменяемых типа можно запомнить словом `ЛИДИСЕБАЙТ`:

- **ЛИ** — `list`;
- **ДИ** — `dict`;
- **СЕ** — `set`;
- **БАЙТ** — `bytearray`.

Остальные десять типов неизменяемые. `memoryview` стоит отдельно, потому что возможность записи зависит от буфера и режима представления.

## Порядок изучения {#poryadok-izucheniya}

1. [Неизменяемые типы](./neizmenyaemye-tipy.md)
   Числа, `bool`, строки, кортежи, `range`, `frozenset`, `bytes` и `NoneType`.

2. Основные коллекции
   [Списки](./spiski-bazovye-operatsii.md), [кортежи](./kortezhi-tuple.md), [словари](./slovari-dict.md) и [множества](./mnozhestva-set.md).

3. [Операции со строками](./operatsii-so-strokami/)
   Создание, индексы, поиск, методы и форматирование строк.

4. [Бинарные типы](./binarnye-tipy-bytes-bytearray-memoryview.md)
   Различия между `bytes`, `bytearray` и `memoryview`.

5. [Изменяемые типы](./izmenyaemye-tipy.md)
   Какие операции меняют объект на месте и где возникают побочные эффекты.

6. [Ссылки, сравнение и копирование](./ssylki-sravnenie-i-kopirovanie.md)
   Присваивание, `is`, `==`, поверхностные и глубокие копии.

7. [Методы типов данных](./metody-tipov-dannykh.md)
   Повторение частых операций после изучения отдельных типов.

## Куда перейти по задаче {#kuda-pereyti-po-zadache}

| Задача | Страница |
| --- | --- |
| Обработать текст | [Операции со строками](./operatsii-so-strokami/) |
| Хранить упорядоченные элементы | [Списки](./spiski-bazovye-operatsii.md) и [кортежи](./kortezhi-tuple.md) |
| Хранить пары ключ → значение | [Словари](./slovari-dict.md) |
| Убрать дубликаты или сравнить наборы | [Множества](./mnozhestva-set.md) |
| Работать с файлами и сетевыми буферами | [Бинарные типы](./binarnye-tipy-bytes-bytearray-memoryview.md) |
| Понять неожиданное изменение данных | [Ссылки и копирование](./ssylki-sravnenie-i-kopirovanie.md) |
| Найти метод конкретного типа | [Методы типов данных](./metody-tipov-dannykh.md) |

<OfficialDocsLinks
    :links="[
        { title: 'Built-in Types', href: 'https://docs.python.org/3/library/stdtypes.html' },
        { title: 'Python Data Model', href: 'https://docs.python.org/3/reference/datamodel.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Неизменяемые типы', href: '/python/yazyk-python/tipy-dannykh/neizmenyaemye-tipy' },
        { title: 'Изменяемые типы', href: '/python/yazyk-python/tipy-dannykh/izmenyaemye-tipy' },
        { title: 'Ссылки и копирование', href: '/python/yazyk-python/tipy-dannykh/ssylki-sravnenie-i-kopirovanie' },
        { title: 'Бинарные типы', href: '/python/yazyk-python/tipy-dannykh/binarnye-tipy-bytes-bytearray-memoryview' },
        { title: 'Базовый Python', href: '/python/yazyk-python/1-core/python-core-funktsii-klassy-moduli-venv-i-pip' },
    ]"
/>
