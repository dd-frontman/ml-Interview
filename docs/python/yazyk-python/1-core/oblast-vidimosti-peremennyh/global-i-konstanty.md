---
title: "global и константы"
description: "Глобальные константы, ключевое слово global, изменение состояния модуля и безопасные альтернативы через параметры и return."
tags:
  - "python"
  - "core"
  - "scope"
  - "global"
updatedAt: "2026-11-08"
---
## Когда нужны значения уровня модуля {#kogda-nuzhny-znacheniya-urovnya-modulya}

Некоторые значения должны быть общими для нескольких функций. Например, порог перехода на новый уровень:

```python
DEFAULT_LEVEL_EXPERIENCE = 200


def is_leveled_up(current: int, gained: int) -> bool:
    return current + gained >= DEFAULT_LEVEL_EXPERIENCE


print(is_leveled_up(150, 60))  # True
print(is_leveled_up(10, 60))   # False
```

Функция только читает глобальное значение, поэтому `global` не требуется.

## Константы на уровне модуля {#konstanty-na-urovne-modulya}

Имена значений, которые не планируется менять, записывают в верхнем регистре:

```python
MAX_ATTEMPTS = 3
API_TIMEOUT_SECONDS = 10
```

Это соглашение, а не запрет языка. Python технически позволяет выполнить `MAX_ATTEMPTS = 5`, но такое изменение противоречит смыслу имени.

Глобальные константы удобны для:

- неизменяемых настроек модуля;
- коэффициентов и порогов;
- строковых обозначений состояний;
- значений по умолчанию, общих для нескольких функций.

## Ключевое слово `global` {#klyuchevoe-slovo-global}

`global` позволяет функции переприсвоить переменную уровня модуля:

```python
status = "offline"


def connect():
    global status
    status = "online"


print(status)  # offline
connect()
print(status)  # online
```

Без строки `global status` присваивание создало бы отдельную локальную переменную.

## Почему `global` лучше использовать редко {#pochemu-global-luchshe-ispolzovat-redko}

Глобальное изменяемое состояние делает функцию менее предсказуемой:

- результат зависит не только от аргументов;
- функция незаметно меняет данные за своими пределами;
- сложнее понять порядок вызовов;
- сложнее проверять функцию отдельно.

Например, этот счетчик зависит от общего состояния:

```python
count = 0


def increment():
    global count
    count += 1
    return count
```

Любая часть модуля может изменить `count`, поэтому результат следующего вызова не всегда очевиден.

## Альтернатива через параметры и `return` {#alternativa-cherez-parametry-i-return}

Чаще состояние можно передать явно:

```python
def increment(current_count: int) -> int:
    return current_count + 1


count = 0
count = increment(count)
count = increment(count)

print(count)  # 2
```

Теперь функция получает все необходимые данные через параметр и возвращает новое значение.

## Когда `global` допустим {#kogda-global-dopustim}

`global` может быть оправдан в небольшом учебном скрипте или при работе с состоянием, которое намеренно принадлежит всему модулю. Даже в этом случае изменение должно быть редким и явно заметным.

В более крупной программе состояние обычно хранят:

- в экземпляре класса;
- в объекте конфигурации;
- в аргументах и возвращаемых значениях;
- в замыкании, если состояние относится к одной созданной функции.

## `global` и `nonlocal` {#global-i-nonlocal}

| Ключевое слово | Где ищется изменяемая переменная |
| --- | --- |
| `global` | На уровне модуля |
| `nonlocal` | Во внешней функции |

`global` не ищет переменную во внешней функции. Для этого предназначен `nonlocal`.

## Типичные ошибки {#tipichnye-oshibki}

1. Писать `global` только для чтения переменной. Для чтения он не нужен.
2. Считать имя в верхнем регистре настоящей неизменяемой константой. Это только соглашение.
3. Использовать `global` вместо возвращаемого значения. Сначала рассмотри параметры и `return`.
4. Изменять глобальную переменную из многих функций. Становится трудно определить источник текущего значения.

## Самостоятельная практика {#samostoyatelnaya-praktika}

Перепиши функцию, изменяющую глобальный баланс, так, чтобы она принимала текущий баланс и сумму операции, а затем возвращала новое значение без `global`.

<OfficialDocsLinks
    :links="[
        { title: 'Python Reference: global statement', href: 'https://docs.python.org/3/reference/simple_stmts.html#the-global-statement' },
        { title: 'Python Tutorial: Scopes and Namespaces', href: 'https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Обзор области видимости', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh' },
        { title: 'Локальные и глобальные переменные', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/lokalnye-i-globalnye-peremennye' },
        { title: 'nonlocal и замыкания', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/nonlocal-i-zamykaniya' },
        { title: 'LEGB и shadowing', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/legb-i-shadowing' },
    ]"
/>
