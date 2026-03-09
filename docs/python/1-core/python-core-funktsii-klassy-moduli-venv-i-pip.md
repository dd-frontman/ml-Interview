---
title: "Функции, классы, модули, venv и pip"
description: "Что нужно знать в базовом Python: функции, классы, модули, изоляция окружения и управление зависимостями."
tags:
  - "python"
  - "core"
  - "functions"
  - "classes"
  - "modules"
updatedAt: "2026-02-27"
---
## Что входит в блок Core

Первый практический блок Python-разработчика:

- функции для переиспользуемой логики;
- классы для модели предметной области;
- модули для структуры проекта;
- `venv` и `pip` для воспроизводимой среды.

Если эти части не настроены, проект быстро превращается в набор скриптов с конфликтами зависимостей.

## Концепция простым языком

- Функция: изолированный блок логики с входом и выходом.
- Класс: шаблон объекта с состоянием и поведением.
- Модуль: файл, который группирует код по ответственности.
- `venv`: локальная "песочница" с отдельными версиями пакетов.
- `pip`: менеджер, который ставит и фиксирует зависимости.

## Инженерная интерпретация

### Типы данных с примерами

Базовые типы:

- `int` `42`
- `float` `3.14`
- `bool` `True`
- `str` `"alice"`
- `None` `None`

Контейнерные типы:

- `list[int]` `[10, 20, 30]`
- `tuple[float, float]` `(55.75, 37.62)`
- `dict[str, str]` `{"id": "42", "role": "admin"}`
- `set[str]` `{"python", "backend", "ml"}`

Комбинированные и nullable-типы:

```python
from typing import Optional

payload: dict[str, list[int]] = {"values": [1, 2, 3]}
email: Optional[str] = None  # str | None
```

Практическое правило:

- если значение может отсутствовать, используй `T | None` (`Optional[T]`);
- для публичных функций и методов всегда ставь type hints на вход и выход.

### Функции

- Должны делать одну вещь и иметь понятный контракт.
- На рабочем уровне важно писать функции с type hints и явными edge-case проверками.

```python
def normalize_email(email: str) -> str:
    value = email.strip().lower()
    if "@" not in value:
        raise ValueError("Invalid email")
    return value
```

### Классы

- Нужны, когда есть состояние и инварианты.
- Для "DTO-подобных" структур чаще удобен `dataclass`.

```python
from dataclasses import dataclass

@dataclass
class User:
    id: int
    email: str
    is_active: bool = True
```

### Модули

- Один модуль = одна зона ответственности.
- Избегай "god-module", где смешаны HTTP, DB, бизнес-логика и утилиты.

Пример структуры:

```text
app/
  __init__.py
  users.py
  validators.py
main.py
```

### `venv` и `pip`

- Создаем и активируем изолированное окружение:

```bash
python -m venv .venv
source .venv/bin/activate
```

- Ставим зависимости:

```bash
pip install fastapi uvicorn
```

- Фиксируем версии:

```bash
pip freeze > requirements.txt
pip install -r requirements.txt
```

## Практический пример

Минимальный пример с функцией, классом и модульной структурой.

```python
# app/validators.py
def ensure_positive(value: int) -> int:
    if value <= 0:
        raise ValueError("Value must be > 0")
    return value
```

```python
# app/users.py
from dataclasses import dataclass
from .validators import ensure_positive

@dataclass
class User:
    id: int
    name: str

    def __post_init__(self) -> None:
        self.id = ensure_positive(self.id)
```

```python
# main.py
from app.users import User

user = User(id=1, name="Alice")
print(user)
```

Что это дает:

- валидация не размазана по проекту;
- структура кода расширяется без хаоса;
- окружение и пакеты воспроизводятся в CI и у всех разработчиков.

## Типичные ошибки

1. Писать всю логику в `main.py`.
   Проблема: код сложно тестировать и переиспользовать.
   Решение: выносить ответственность в модули.

2. Не использовать `venv`.
   Проблема: конфликты версий между проектами.
   Решение: отдельное окружение на каждый проект.

3. Не фиксировать зависимости.
   Проблема: "у меня работает, у тебя нет".
   Решение: `requirements.txt` или `pyproject.toml` + lock-файл.

4. Класс там, где достаточно функции.
   Проблема: избыточная сложность.
   Решение: сначала функция, класс только при необходимости состояния.

5. Игнорировать type hints.
   Проблема: больше скрытых ошибок в интеграции модулей.
   Решение: добавлять аннотации хотя бы на публичные функции и методы.

## Cheat-sheet

| Тема | Что знать | Практический минимум |
| --- | --- | --- |
| Функции | Контракт вход/выход, исключения, type hints | Небольшие, предсказуемые, тестируемые функции |
| Классы | Состояние, инварианты, `dataclass` | Классы только там, где есть поведение/состояние |
| Модули | Декомпозиция по ответственности | Ясная структура импортов и зависимостей |
| `venv` | Изоляция окружения | Каждый проект в своем окружении |
| `pip` | Установка и фиксация зависимостей | Воспроизводимая установка через файл зависимостей |

| Команда | Назначение |
| --- | --- |
| `python -m venv .venv` | Создать виртуальное окружение |
| `source .venv/bin/activate` | Активировать окружение |
| `pip install <package>` | Установить пакет |
| `pip freeze > requirements.txt` | Зафиксировать версии |
| `pip install -r requirements.txt` | Установить фиксированный набор |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial', href: 'https://docs.python.org/3/tutorial/' },
        { title: 'Python: Classes', href: 'https://docs.python.org/3/tutorial/classes.html' },
        { title: 'Python: Modules', href: 'https://docs.python.org/3/tutorial/modules.html' },
        { title: 'Python: venv', href: 'https://docs.python.org/3/library/venv.html' },
        { title: 'pip User Guide', href: 'https://pip.pypa.io/en/stable/user_guide/' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Введение в Python', href: '/python/vvedenie-v-python' },
        { title: 'NumPy и Pandas для ML', href: '/python/numpy-i-pandas-dlya-ml' },
        { title: 'Обучение с учителем', href: '/ml/obuchenie-s-uchitelem' },
    ]"
/>
