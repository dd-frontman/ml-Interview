---
title: "Операции со строками"
description: "Карта раздела о строках Python: создание, базовые операции, индексы, срезы, поиск, методы, форматирование, экранирование и практика."
tags:
  - "python"
  - "core"
  - "data-types"
  - "str"
updatedAt: "2026-11-14"
search: false
---
## Зачем нужен этот раздел {#zachem-nuzhen-etot-razdel}

Строки встречаются почти в любой программе: в именах пользователей, путях к файлам, ответах API, логах и текстовых признаках для ML. Чтобы уверенно работать со строками, нужно уметь не только склеивать текст, но и находить подстроки, очищать данные и безопасно подставлять значения.

Минимальный пример:

```python
raw_email = "  ALICE@EXAMPLE.COM  "
email = raw_email.strip().lower()

print(email)  # alice@example.com
```

Здесь `strip()` удаляет пробелы по краям, а `lower()` приводит символы к нижнему регистру. Исходная строка не меняется: методы возвращают новое значение.

## Карта раздела {#karta-razdela}

| Страница | Что изучаем |
| --- | --- |
| [Создание и базовые операции](./sozdanie-i-bazovye-operatsii.md) | Тип `str`, кавычки, многострочные строки, `+`, `*`, `len()` и неизменяемость |
| [Индексы, срезы и поиск](./indeksy-srezy-i-poisk.md) | Получение символов, срезы, `in`, `find()`, `index()` и `count()` |
| [Методы строк](./metody-strok.md) | `strip()`, `lower()`, `upper()`, `replace()`, `split()`, `join()` и проверки |
| [Форматирование и экранирование](./formatirovanie-i-ekranirovanie.md) | f-строки, `format()`, старое `%`-форматирование, специальные символы и raw-строки |
| [Практика и типичные ошибки](./praktika-i-oshibki.md) | Нормализация email, распространённые ошибки и итоговая шпаргалка |
| [Задача: подсчёт смайликов](./zadacha-podschet-smaylikov.md) | Практика на длину строки, индексы, условия и проверку вхождения |

## Рекомендуемый порядок {#rekomenduemyy-poryadok}

1. Начни с создания строк и базовых операций.
2. Разбери индексы и срезы, чтобы получать части строки.
3. Изучи методы для очистки и преобразования текста.
4. Перейди к форматированию строк.
5. Закрепи материал на задаче про смайлики.

## Короткая шпаргалка {#korotkaya-shpargalka}

```python
text = "  Python,ML  "

print(text.strip())              # Python,ML
print(text.strip().lower())      # python,ml
print(text.strip().split(","))   # ['Python', 'ML']
print("Python"[0])               # P
print("Python"[1:4])             # yth
print("Py" in "Python")         # True
print(f"Language: {'Python'}")   # Language: Python
```

## Что важно запомнить {#chto-vazhno-zapomnit}

- `str` хранит текст;
- строки являются последовательностями, поэтому поддерживают индексы и срезы;
- строки неизменяемы: операции и методы создают новое значение;
- `in` подходит для простой проверки наличия подстроки;
- `split()` разбивает строку, а `join()` собирает строку;
- для нового кода обычно используют f-строки.

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python: Text Sequence Type str', href: 'https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str' },
        { title: 'Python: String methods', href: 'https://docs.python.org/3/library/stdtypes.html#string-methods' },
        { title: 'Python: Formatted string literals', href: 'https://docs.python.org/3/reference/lexical_analysis.html#f-strings' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Неизменяемые типы', href: '/python/yazyk-python/tipy-dannykh/neizmenyaemye-tipy' },
        { title: 'Индексы и срезы', href: '/python/yazyk-python/tipy-dannykh/indeksy-i-srezy' },
        { title: 'Методы типов данных', href: '/python/yazyk-python/tipy-dannykh/metody-tipov-dannykh' },
        { title: 'Основные функции', href: '/python/yazyk-python/1-core/osnovnye-funktsii' },
    ]"
/>
