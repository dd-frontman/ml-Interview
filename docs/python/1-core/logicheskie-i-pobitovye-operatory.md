---
title: "Логические и побитовые операторы: and, or, &, |"
description: "Разница между логическими и побитовыми операторами в Python: как они работают, где ошибаются чаще всего и как выбирать нужный оператор."
tags:
  - "python"
  - "core"
  - "operators"
  - "bool"
updatedAt: "2026-02-27"
---
## Что это за операторы

В Python есть две похожие на вид группы операторов:

- логические: `and`, `or`, `not`
- побитовые: `&`, `|`, `^`, `~`

Путают их часто, потому что на `bool` они иногда дают одинаковый результат:

```python
True and False  # False
True & False    # False
```

Но смысл у них разный.

## Простое объяснение

`and` и `or` отвечают на вопрос:

- "истинно ли это условие?"
- "нужно ли выполнять вторую часть?"

`&` и `|` работают с битами числа.

Если очень грубо:

- `and` / `or` -> логика условий
- `&` / `|` -> операции над двоичным представлением

## Как работают `and` и `or`

### `and`

Возвращает первый "ложный" операнд, а если все истинные - последний.

```python
True and False   # False
1 and 2          # 2
0 and 2          # 0
"a" and "b"      # "b"
```

### `or`

Возвращает первый "истинный" операнд.

```python
True or False    # True
1 or 2           # 1
0 or 2           # 2
"" or "fallback" # "fallback"
```

### Short-circuit

`and` и `or` могут не вычислять правую часть выражения.

```python
False and expensive_call()  # expensive_call не выполнится
True or expensive_call()    # expensive_call не выполнится
```

Это важно и для производительности, и для защиты от ошибок.

## Как работают `&` и `|`

Это побитовые операторы.

Пример:

```python
5 & 2
```

В двоичном виде:

- `5` -> `101`
- `2` -> `010`

Побитовое `&`:

- `101`
- `010`
- `000` -> `0`

Поэтому:

```python
5 & 2  # 0
5 | 2  # 7
```

Для `bool` они тоже работают:

```python
True & False  # False
True | False  # True
```

Но здесь это не логические операторы условий, а побитовые операции над значениями `True/False`.

## Главное различие

| Оператор | Тип задачи | Short-circuit | Что возвращает |
| --- | --- | --- | --- |
| `and` | Логика условий | Да | Один из операндов |
| `or` | Логика условий | Да | Один из операндов |
| `&` | Побитовые операции | Нет | Число или bool |
| `pipe` (побитовое ИЛИ) | Побитовые операции | Нет | Число или bool |

## Практический пример

### Проверка условий

Здесь нужны `and` и `or`:

```python
is_admin = True
is_active = True

if is_admin and is_active:
    print("access granted")
```

### Работа с флагами

Здесь уже можно встретить `&` и `|`, если используются битовые маски:

```python
READ = 0b001
WRITE = 0b010
EXECUTE = 0b100

permissions = READ | WRITE

can_write = permissions & WRITE
print(bool(can_write))  # True
```

## Типичные ошибки

1. Использовать `&` вместо `and` в `if`.
   Плохо: код работает по другой логике и всегда вычисляет обе части.

2. Ожидать, что `and` и `or` всегда возвращают `True/False`.
   Плохо: они часто возвращают сам операнд.

3. Путать работу на `bool` и на `int`.
   Плохо: `True & False` похоже на логику, но `5 & 2` уже битовая операция.

4. Не учитывать short-circuit.
   Плохо: можно получить лишние вычисления или исключение в правой части.

5. Использовать `|` и `&` для обычных условий "по привычке" из других контекстов.
   Плохо: код становится менее читаемым и более хрупким.

## Cheat-sheet

| Сценарий | Что использовать |
| --- | --- |
| Проверка двух условий | `and` |
| Проверка одного из условий | `or` |
| Инверсия булевого значения | `not` |
| Побитовое И | `&` |
| Побитовое ИЛИ | `pipe` |
| Проверка битовой маски | `value & FLAG` |

| Выражение | Результат |
| --- | --- |
| `True and False` | `False` |
| `True or False` | `True` |
| `1 and 2` | `2` |
| `0 or 2` | `2` |
| `5 & 2` | `0` |
| `bitwise_or(5, 2)` | `7` |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python: Boolean operations', href: 'https://docs.python.org/3/library/stdtypes.html#boolean-operations-and-or-not' },
        { title: 'Python: Truth value testing', href: 'https://docs.python.org/3/library/stdtypes.html#truth-value-testing' },
        { title: 'Python: Bitwise operations on integer types', href: 'https://docs.python.org/3/library/stdtypes.html#bitwise-operations-on-integer-types' },
        { title: 'Python language reference: operator precedence', href: 'https://docs.python.org/3/reference/expressions.html#operator-precedence' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Общая информация', href: '/python/1-core/tipy-dannykh/obshaya-informatsiya' },
        { title: 'Функции, классы, модули, venv и pip', href: '/python/1-core/python-core-funktsii-klassy-moduli-venv-i-pip' },
        { title: 'Введение в Python', href: '/python/vvedenie-v-python' },
    ]"
/>
