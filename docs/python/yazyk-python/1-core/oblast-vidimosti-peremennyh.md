---
title: "Область видимости переменных"
description: "Конспект по области видимости переменных в Python: локальные и глобальные переменные, переменная цикла, shadowing, global, константы и безопасная передача данных через параметры и return."
tags:
  - "python"
  - "core"
  - "scope"
  - "functions"
updatedAt: "2026-07-07"
---
## Что такое область видимости

Область видимости определяет, где переменная доступна в коде.

В Python важно различать:

- локальные переменные внутри функции;
- глобальные переменные на уровне файла;
- переменные циклов;
- константы на уровне модуля;
- изменение глобальных переменных через `global`.

## Локальная переменная

Переменная, созданная внутри функции, называется локальной.

```python
def my_function():
    local_var = "I'm a local variable"
    print(local_var)


my_function()
# I'm a local variable
```

`local_var` доступна внутри функции, но недоступна снаружи.

```python
print(local_var)  # NameError
```

Функция создает свою область видимости при каждом вызове.

## Переменная цикла

В Python переменная цикла остается доступной после завершения цикла.

```python
for i in range(3):
    print(i)

print(i)  # 2
```

Технически это работает, но в реальном коде лучше не опираться на такое поведение. После цикла переменную `i` легко перепутать с другой логикой.

Безопаснее использовать переменную цикла только внутри цикла.

## Глобальная переменная

Глобальная переменная объявлена на уровне файла.

```python
global_var = "I'm a global variable"
```

Её можно читать внутри функции.

```python
global_var = "I'm a global variable"


def my_function():
    print(global_var)


my_function()
print(global_var)
```

Функция найдет `global_var` во внешней области видимости, если внутри функции нет локальной переменной с таким именем.

## Shadowing

Если внутри функции создать переменную с тем же именем, она станет локальной и скроет глобальную переменную внутри функции.

```python
global_var = "I'm a global variable"


def my_function():
    global_var = "I'm a local variable"
    print(global_var)


my_function()
print(global_var)
```

Результат:

```text
I'm a local variable
I'm a global variable
```

Внутри функции печатается локальная переменная. Снаружи глобальная переменная не изменилась.

Такое совпадение имен называется shadowing. Его лучше избегать, потому что код становится сложнее читать.

## Константы на уровне модуля

Если значение должно быть общим для функций и не должно меняться, его часто записывают как константу.

```python
COMFORTABLE_TEMPERATURE = 25


def get_diff_from_comfortable_temperature(*, temperature: int) -> int:
    return COMFORTABLE_TEMPERATURE - temperature


print(get_diff_from_comfortable_temperature(temperature=20))  # 5
```

Имена констант обычно пишут в верхнем регистре: `COMFORTABLE_TEMPERATURE`.

Важно: Python не запрещает изменить такую переменную. Верхний регистр - это соглашение для разработчиков.

## `global`

Ключевое слово `global` позволяет изменить глобальную переменную внутри функции.

```python
global_var = "I'm a global variable"


def my_function():
    global global_var
    global_var = "I've defined inside the scope of my_function"


print(global_var)
my_function()
print(global_var)
```

Результат:

```text
I'm a global variable
I've defined inside the scope of my_function
```

Без `global` присваивание внутри функции создало бы локальную переменную. С `global` функция меняет переменную на уровне файла.

## Почему `global` лучше использовать редко

Глобальное изменение состояния делает код менее предсказуемым.

Проблемы:

- функция меняет данные не только через `return`;
- результат зависит от внешнего состояния;
- сложнее тестировать;
- сложнее понять, кто и когда изменил значение.

Чаще лучше передавать данные через параметры и возвращать результат.

```python
def update_name(*, current_name: str, new_name: str) -> str:
    return new_name if new_name else current_name
```

## Практический пример

Глобальную константу удобно использовать как настройку, а вычисления держать внутри функции.

```python
DEFAULT_LEVEL_EXPERIENCE = 200


def is_leveled_up(*, current_experience: int, gained_experience: int) -> bool:
    total_experience = current_experience + gained_experience
    level_up = False

    if total_experience >= DEFAULT_LEVEL_EXPERIENCE:
        level_up = True

    return level_up


print(is_leveled_up(current_experience=150, gained_experience=60))  # True
print(is_leveled_up(current_experience=10, gained_experience=60))   # False
```

Что здесь происходит:

- `DEFAULT_LEVEL_EXPERIENCE` - глобальная константа;
- `current_experience` и `gained_experience` - параметры функции;
- `total_experience` и `level_up` - локальные переменные;
- функция не меняет глобальное состояние, а возвращает результат через `return`.

Можно записать короче:

```python
DEFAULT_LEVEL_EXPERIENCE = 200


def is_leveled_up(*, current_experience: int, gained_experience: int) -> bool:
    total_experience = current_experience + gained_experience
    return total_experience >= DEFAULT_LEVEL_EXPERIENCE
```

Такой вариант проще, потому что выражение сравнения уже возвращает `True` или `False`.

## Правило поиска имени

Когда Python встречает имя переменной внутри функции, он ищет его примерно так:

1. В локальной области функции.
2. Во внешних функциях, если они есть.
3. В глобальной области файла.
4. Во встроенных именах Python.

Для этого часто используют аббревиатуру LEGB:

| Уровень | Что означает |
| --- | --- |
| `Local` | Локальная область функции |
| `Enclosing` | Внешняя функция |
| `Global` | Уровень файла |
| `Built-in` | Встроенные имена Python |

В этом уроке главное понять локальную и глобальную области.

## Частые ошибки

1. Пытаться использовать локальную переменную вне функции.
   Проблема: переменная существует только внутри функции.
   Решение: вернуть значение через `return`.

2. Думать, что присваивание внутри функции меняет глобальную переменную.
   Проблема: без `global` создается локальная переменная.
   Решение: обычно возвращать новое значение, а не менять global.

3. Использовать переменную цикла после цикла.
   Проблема: код работает, но становится хрупким и неочевидным.
   Решение: использовать переменную цикла только внутри цикла.

4. Называть локальную переменную так же, как глобальную.
   Проблема: появляется shadowing, смысл кода хуже читается.
   Решение: выбирать разные понятные имена.

5. Часто использовать `global`.
   Проблема: функция начинает менять внешнее состояние.
   Решение: передавать вход через параметры и возвращать результат через `return`.

## Cheat-sheet

| Синтаксис | Что означает |
| --- | --- |
| `local_var = ...` внутри функции | Локальная переменная |
| `GLOBAL_VALUE = ...` на уровне файла | Константа по соглашению |
| `print(global_var)` внутри функции | Чтение глобальной переменной |
| `global global_var` | Разрешить изменение глобальной переменной |
| `return value` | Передать результат наружу |
| `for i in range(3):` | `i` остается доступной после цикла, но лучше так не использовать |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Scopes and Namespaces', href: 'https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces' },
        { title: 'Python Reference: Naming and binding', href: 'https://docs.python.org/3/reference/executionmodel.html#naming-and-binding' },
        { title: 'Python Reference: global statement', href: 'https://docs.python.org/3/reference/simple_stmts.html#the-global-statement' },
        { title: 'Python Reference: function definitions', href: 'https://docs.python.org/3/reference/compound_stmts.html#function-definitions' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python' },
        { title: 'Основы синтаксиса и переменные', href: '/python/yazyk-python/1-core/osnovy-sintaksisa-i-peremennye' },
        { title: 'Циклы for и range', href: '/python/yazyk-python/1-core/tsikly-for-i-range' },
        { title: 'Boolean и условия', href: '/python/yazyk-python/1-core/boolean-i-usloviya' },
    ]"
/>
