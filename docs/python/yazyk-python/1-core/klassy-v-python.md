---
title: "Классы в Python"
description: "Когда использовать классы в Python: состояние, методы, dataclass, __post_init__, инварианты и типичные ошибки."
tags:
  - "python"
  - "core"
  - "classes"
updatedAt: "2026-06-18"
---
## Зачем нужны классы

Класс нужен, когда у сущности есть состояние и поведение. Если нужно только преобразовать вход в выход, чаще достаточно функции.

Пример удачного сценария для класса:

- есть пользователь, заказ, модель, конфиг или артефакт;
- у объекта есть поля;
- с этими полями связаны методы;
- нужно удерживать инварианты.

## Базовый пример

```python
class User:
    def __init__(self, user_id: int, email: str) -> None:
        self.user_id = user_id
        self.email = email

    def label(self) -> str:
        return f"{self.user_id}:{self.email}"


user = User(1, "alice@example.com")
print(user.label())
```

Что здесь происходит:

- `class User` объявляет класс;
- `__init__` вызывается при создании объекта;
- `self` - текущий объект;
- `self.user_id` и `self.email` - состояние объекта;
- `label()` - метод, который использует состояние.

## `dataclass`

Для DTO-подобных структур чаще удобен `dataclass`: Python сам создает конструктор и человекочитаемое представление объекта.

```python
from dataclasses import dataclass


@dataclass
class User:
    id: int
    email: str
    is_active: bool = True


user = User(id=1, email="alice@example.com")
print(user)
```

Если нужно проверить данные после создания объекта, используй `__post_init__`.

```python
from dataclasses import dataclass


@dataclass
class User:
    id: int
    name: str

    def __post_init__(self) -> None:
        if self.id <= 0:
            raise ValueError("id must be > 0")
        if not self.name.strip():
            raise ValueError("name must not be empty")
```

## Когда класс не нужен

Если состояние не хранится, класс часто добавляет лишнюю сложность.

```python
def normalize_email(email: str) -> str:
    return email.strip().lower()
```

Такой код проще, чем класс с одним методом и без состояния.

## Практический пример

Класс удобно использовать для конфигурации inference-порога.

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class ThresholdConfig:
    model_version: str
    threshold: float

    def label(self, score: float) -> int:
        return int(score >= self.threshold)


config = ThresholdConfig(model_version="churn-v1", threshold=0.65)

print(config.label(0.7))  # 1
print(config.label(0.4))  # 0
```

`frozen=True` запрещает менять поля после создания объекта. Это полезно для конфигов и простых value object.

## Типичные ошибки

1. Создавать класс там, где достаточно функции.
   Проблема: код становится длиннее без пользы.
   Решение: начинать с функции и добавлять класс только при появлении состояния.

2. Хранить в классе несвязанные данные.
   Проблема: объект превращается в "мешок" полей.
   Решение: держать одну понятную ответственность.

3. Забывать про инварианты.
   Проблема: объект создается в некорректном состоянии.
   Решение: проверять данные в `__init__` или `__post_init__`.

4. Мутировать конфиг там, где он должен быть стабильным.
   Проблема: поведение меняется неожиданно.
   Решение: использовать `@dataclass(frozen=True)` для неизменяемых конфигов.

## Cheat-sheet

| Сценарий | Что использовать |
| --- | --- |
| Только преобразовать данные | Функция |
| Данные + поведение | Класс |
| Простая структура данных | `@dataclass` |
| Проверка после создания | `__post_init__` |
| Неизменяемый конфиг | `@dataclass(frozen=True)` |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python: Classes', href: 'https://docs.python.org/3/tutorial/classes.html' },
        { title: 'Python: dataclasses', href: 'https://docs.python.org/3/library/dataclasses.html' },
        { title: 'Python data model', href: 'https://docs.python.org/3/reference/datamodel.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python' },
        { title: 'Изменяемые типы', href: '/python/yazyk-python/tipy-dannykh/izmenyaemye-tipy' },
        { title: 'Typing для Python и ML', href: '/python/yazyk-python/typing-dlya-python-i-ml' },
    ]"
/>
