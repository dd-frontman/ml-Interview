---
title: "Функции в Python"
description: "Как писать функции в Python: параметры, return, type hints, edge-case проверки и типичные ошибки проектирования."
tags:
  - "python"
  - "core"
  - "functions"
updatedAt: "2026-06-18"
---
## Зачем нужны функции

Функция - это изолированный блок логики с входом и выходом. Она нужна, когда код должен быть:

- переиспользуемым;
- читаемым;
- тестируемым;
- понятным по контракту входных и выходных данных.

## Базовый пример

```python
def normalize_email(email: str) -> str:
    value = email.strip().lower()
    if "@" not in value:
        raise ValueError("Invalid email")
    return value
```

Что здесь происходит:

- `def` объявляет функцию;
- `email` - параметр;
- `email: str` - ожидаемый тип параметра;
- `-> str` - ожидаемый тип результата;
- `return` возвращает значение из функции;
- `raise ValueError` явно сообщает об ошибочном входе.

## Обязательны ли type hints

Нет, `: str` и `-> str` писать не обязательно. Python выполнит функцию и без аннотаций.

```python
def normalize_email(email):
    return email.strip().lower()
```

Но аннотации делают контракт функции явным:

```python
def normalize_email(email: str) -> str:
    return email.strip().lower()
```

В этой записи:

- `email: str` означает, что параметр `email` ожидается как строка;
- `-> str` означает, что функция должна вернуть строку;
- последнее `:` после скобок - обязательная часть синтаксиса функции.

Важно: type hints сами по себе не проверяют данные в runtime. Они помогают IDE, ревью кода и статическим анализаторам, но `str` не остановит неправильный вызов без отдельной проверки.

```python
def double(value: int) -> int:
    return value * 2

print(double("x"))  # xx
```

Практическое правило: в маленьких учебных примерах можно писать без типов. В коде проекта, API, ML-pipeline и переиспользуемых функциях типы лучше добавлять.

## Параметры и значения по умолчанию

Параметры по умолчанию удобны, когда у функции есть частый сценарий использования.

```python
def apply_threshold(score: float, threshold: float = 0.5) -> int:
    return int(score >= threshold)

print(apply_threshold(0.7))        # 1
print(apply_threshold(0.7, 0.8))   # 0
```

Для изменяемых значений не используй `[]` или `{}` как default.

```python
def add_event(event: str, bucket: list[str] | None = None) -> list[str]:
    if bucket is None:
        bucket = []
    bucket.append(event)
    return bucket
```

## Практический пример

Функция должна прятать повторяющуюся проверку и возвращать предсказуемый результат.

```python
def ensure_positive(value: int) -> int:
    if value <= 0:
        raise ValueError("Value must be > 0")
    return value


def user_label(user_id: int, name: str) -> str:
    safe_id = ensure_positive(user_id)
    clean_name = name.strip()
    if not clean_name:
        raise ValueError("Name must not be empty")
    return f"{safe_id}:{clean_name}"


print(user_label(1, "Alice"))
```

Что это дает:

- проверка id не размазана по коду;
- ошибка входных данных видна сразу;
- функцию проще переиспользовать в модуле, API или тесте.

## Типичные ошибки

1. Делать функцию слишком большой.
   Проблема: внутри смешиваются чтение данных, бизнес-логика и вывод результата.
   Решение: выносить отдельные шаги в маленькие функции.

2. Возвращать разные типы без необходимости.
   Проблема: вызывающий код становится хрупким.
   Решение: держать стабильный тип результата или явно описывать `T | None`.

3. Игнорировать edge cases.
   Проблема: пустая строка, `None` или отрицательное число ломают код позже.
   Решение: проверять вход рядом с началом функции.

4. Считать type hints runtime-валидацией.
   Проблема: аннотации сами не остановят неправильный тип.
   Решение: критичные данные валидировать кодом.

5. Использовать mutable default arguments.
   Проблема: данные "накапливаются" между вызовами.
   Решение: паттерн `None -> create new object`.

## Cheat-sheet

| Сценарий | Как писать |
| --- | --- |
| Простая функция | `def name(arg): ...` |
| Явный контракт | `def name(arg: str) -> str: ...` |
| Значение по умолчанию | `threshold: float = 0.5` |
| Ошибочный вход | `raise ValueError(...)` |
| Нет полезного результата | `-> None` |
| Mutable default | `arg: list[T] | None = None` |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python: Defining functions', href: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions' },
        { title: 'Python: Default argument values', href: 'https://docs.python.org/3/tutorial/controlflow.html#default-argument-values' },
        { title: 'Python: Function definitions', href: 'https://docs.python.org/3/reference/compound_stmts.html#function-definitions' },
        { title: 'Python typing', href: 'https://docs.python.org/3/library/typing.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Основы синтаксиса и переменные', href: '/python/yazyk-python/1-core/osnovy-sintaksisa-i-peremennye' },
        { title: 'Typing для Python и ML', href: '/python/yazyk-python/typing-dlya-python-i-ml' },
        { title: 'Исключения и файлы', href: '/python/yazyk-python/isklyucheniya-context-managers-i-fayly' },
        { title: 'Модули, venv и pip', href: '/python/yazyk-python/1-core/moduli-venv-i-pip' },
    ]"
/>
