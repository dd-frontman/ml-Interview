---
title: "**kwargs: произвольные именованные аргументы"
description: "Как **kwargs собирает именованные аргументы в словарь, когда гибкий набор параметров полезен и когда лучше явная сигнатура."
tags:
  - "python"
  - "core"
  - "functions"
  - "kwargs"
updatedAt: "2026-11-15"
---
## Какую задачу решает `**kwargs` {#kakuyu-zadachu-reshaet-kwargs}

Представь функцию обновления профиля. В одном вызове меняется город, в другом возраст и должность. Набор полей заранее неизвестен.

`**kwargs` принимает произвольное количество именованных аргументов и собирает их в словарь.

## Минимальный пример {#minimalnyy-primer}

```python
def show_profile(**kwargs: object) -> None:
    print(kwargs)  # {'name': 'John', 'age': 30}


show_profile(name="John", age=30)
```

Внутри функции:

- имя аргумента становится ключом словаря;
- переданное значение становится значением словаря;
- порядок сохраняется в порядке передачи аргументов.

Имя `kwargs` является соглашением. Специальное поведение создают две звёздочки.

## Перебор `kwargs` {#perebor-kwargs}

Для одновременного получения ключа и значения используется `.items()`:

```python
def print_settings(**settings: object) -> None:
    for name, value in settings.items():
        print(f"{name}: {value}")


print_settings(theme="dark", language="ru")
# theme: dark
# language: ru
```

Цикл `for key in kwargs` получил бы только ключи. Значение тогда пришлось бы читать отдельно: `kwargs[key]`.

## Практический пример: обновление профиля {#prakticheskiy-primer-obnovlenie-profilya}

```python
def update_user(user: dict[str, object], **changes: object) -> dict[str, object]:
    for key, value in changes.items():
        user[key] = value

    return user


user = {"name": "John", "age": 30}

update_user(user, city="London")
print(user)  # {'name': 'John', 'age': 30, 'city': 'London'}

update_user(user, age=31, job="Engineer")
print(user)  # {'name': 'John', 'age': 31, 'city': 'London', 'job': 'Engineer'}
```

В первом вызове `changes` равен `{"city": "London"}`. Во втором вызове в нём находятся `age` и `job`.

Функция изменяет исходный словарь. Вариант без мутации разобран на странице [Возврат нескольких значений](./vozvrat-i-raspakovka-rezultata.md).

## Обычные параметры вместе с `**kwargs` {#obychnye-parametry-vmeste-s-kwargs}

Перед `**kwargs` можно объявить обязательные параметры:

```python
def create_event(title: str, **details: object) -> dict[str, object]:
    return {"title": title, **details}


event = create_event("Python meetup", city="Moscow", online=False)
print(event)  # {'title': 'Python meetup', 'city': 'Moscow', 'online': False}
```

Параметр `title` обязателен, а остальные поля гибкие.

`**kwargs` всегда должен находиться в конце списка параметров, потому что после него Python уже некуда распределять аргументы.

## Когда лучше не использовать `**kwargs` {#kogda-luchshe-ne-ispolzovat-kwargs}

Если допустимые параметры известны заранее, явная сигнатура понятнее:

```python
def create_user(*, name: str, age: int, city: str) -> dict[str, object]:
    return {"name": name, "age": age, "city": city}
```

Преимущества явных параметров:

- редактор показывает подсказки;
- проверка типов видит контракт функции;
- опечатка в имени аргумента быстрее обнаруживается;
- читатель сразу понимает обязательные данные.

Используй `**kwargs`, когда набор ключей действительно гибкий, а не только ради короткой сигнатуры.

## Фильтрация значений `None` {#filtratsiya-znacheniy-none}

При фильтрации важно проверять именно `None`, а не истинность значения:

```python
def without_none(**kwargs: object) -> dict[str, object]:
    return {
        key: value
        for key, value in kwargs.items()
        if value is not None
    }


result = without_none(name="John", age=None, score=0, active=False)
print(result)  # {'name': 'John', 'score': 0, 'active': False}
```

Условие `if value` ошибочно удалило бы полезные значения `0`, `False` и пустую строку.

## Пустой `kwargs` {#pustoy-kwargs}

Если именованные аргументы не переданы, функция получает пустой словарь:

```python
def options_count(**options: object) -> int:
    return len(options)


print(options_count())                 # 0
print(options_count(debug=True, port=8000))  # 2
```

## Типичные ошибки {#tipichnye-oshibki}

### Перебирать старые данные вместо новых {#perebirat-starye-dannye-vmesto-novykh}

Если изменения пришли через `**changes`, цикл должен идти по `changes.items()`, а не по исходному словарю.

### Ожидать проверку имён {#ozhidat-proverku-imyon}

`**kwargs` принимает любое имя:

```python
def configure(**options: object) -> dict[str, object]:
    return options


print(configure(them="dark"))  # {'them': 'dark'}
```

Python не знает, что вместо `them` предполагалось `theme`. Если набор ключей ограничен, его нужно проверять вручную или объявить явные параметры.

### Путать сбор и распаковку {#putat-sbor-i-raspakovku}

- `def func(**kwargs)` собирает именованные аргументы;
- `func(**payload)` распаковывает словарь при вызове.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Напиши `build_query(**filters)`, которая возвращает только фильтры со значением не `None`.
2. Напиши `format_user(**fields)`, которая превращает пары ключ-значение в список строк.
3. Добавь в `update_user()` запрет на неизвестные поля: разреши только `name`, `age` и `city`.

<RelatedTopics
    :items="[
        { title: '*args', href: '/python/yazyk-python/1-core/funktsii-v-python/args-proizvolnye-pozitsionnye-argumenty' },
        { title: 'Распаковка аргументов', href: '/python/yazyk-python/1-core/funktsii-v-python/raspakovka-argumentov' },
        { title: 'Порядок параметров', href: '/python/yazyk-python/1-core/funktsii-v-python/poryadok-parametrov-funktsii' },
        { title: 'Словари dict', href: '/python/yazyk-python/tipy-dannykh/slovari-dict' },
    ]"
/>
