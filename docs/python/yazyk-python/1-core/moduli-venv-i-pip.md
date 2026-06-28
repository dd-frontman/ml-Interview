---
title: "Модули, venv и pip"
description: "Как раскладывать Python-код по модулям, изолировать окружение через venv и фиксировать зависимости через pip."
tags:
  - "python"
  - "core"
  - "modules"
  - "venv"
  - "pip"
updatedAt: "2026-06-18"
---
## Зачем это нужно

Модули, `venv` и `pip` отвечают за инженерную часть Python-проекта:

- где лежит код;
- как он импортируется;
- в каком окружении запускается;
- какие версии зависимостей установлены.

Без этого проект быстро превращается в набор скриптов, которые работают только на одной машине.

## Модули

Модуль - это обычный `.py` файл. Один модуль должен отвечать за одну зону ответственности.

Пример структуры:

```text
app/
  __init__.py
  users.py
  validators.py
main.py
```

Валидацию можно вынести отдельно:

```python
# app/validators.py
def ensure_positive(value: int) -> int:
    if value <= 0:
        raise ValueError("Value must be > 0")
    return value
```

А доменную сущность держать в своем модуле:

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

Точка входа остается короткой:

```python
# main.py
from app.users import User

user = User(id=1, name="Alice")
print(user)
```

Что это дает:

- валидация не размазана по проекту;
- структура кода расширяется без хаоса;
- импорты показывают зависимости между частями проекта.

## `venv`

`venv` создает локальное виртуальное окружение для проекта.

```bash
python -m venv .venv
source .venv/bin/activate
```

После активации пакеты ставятся в `.venv`, а не в глобальный Python.

Практическое правило: один проект - одно окружение.

## `pip`

`pip` устанавливает Python-пакеты.

```bash
pip install fastapi uvicorn
```

Чтобы другой разработчик или CI получил те же зависимости, версии нужно фиксировать.

```bash
pip freeze > requirements.txt
pip install -r requirements.txt
```

В более зрелых проектах вместо `requirements.txt` часто используют `pyproject.toml` и lock-файл, но базовая идея та же: зависимости должны быть воспроизводимыми.

## Типичные ошибки

1. Писать всю логику в `main.py`.
   Проблема: код сложно тестировать и переиспользовать.
   Решение: выносить ответственность в модули.

2. Делать один большой `utils.py`.
   Проблема: ответственности снова смешиваются.
   Решение: называть модуль по смыслу: `validators.py`, `features.py`, `inference.py`.

3. Не использовать `venv`.
   Проблема: конфликты версий между проектами.
   Решение: отдельное окружение на каждый проект.

4. Не фиксировать зависимости.
   Проблема: "у меня работает, у тебя нет".
   Решение: `requirements.txt` или `pyproject.toml` + lock-файл.

5. Импортировать модуль с побочными эффектами.
   Проблема: при импорте внезапно запускается обучение, чтение файлов или сетевой запрос.
   Решение: тяжелый запуск держать под `if __name__ == "__main__":`.

## Cheat-sheet

| Тема | Практический минимум |
| --- | --- |
| Модуль | Один `.py` файл на одну ответственность |
| Пакет | Папка с Python-модулями |
| Импорт | Показывает зависимость между модулями |
| `venv` | Изолирует зависимости проекта |
| `pip` | Устанавливает пакеты |
| `requirements.txt` | Фиксирует набор зависимостей |

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
        { title: 'Python: Modules', href: 'https://docs.python.org/3/tutorial/modules.html' },
        { title: 'Python: venv', href: 'https://docs.python.org/3/library/venv.html' },
        { title: 'pip User Guide', href: 'https://pip.pypa.io/en/stable/user_guide/' },
        { title: 'Python packaging guide', href: 'https://packaging.python.org/en/latest/' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python' },
        { title: 'Классы в Python', href: '/python/yazyk-python/1-core/klassy-v-python' },
        { title: 'Воспроизводимость ML-кода', href: '/python/ekosistema-python/vosproizvodimost-ml-koda' },
        { title: 'Logging и CLI', href: '/python/ekosistema-python/logging-i-cli-dlya-ml-skriptov' },
    ]"
/>
