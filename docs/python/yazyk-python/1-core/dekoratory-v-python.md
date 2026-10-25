---
title: "Декораторы в Python"
description: "Декораторы в Python: func и wrapper, синтаксис @, порядок выполнения, args и kwargs, возврат результата, wraps и декораторы с параметрами."
tags:
  - "python"
  - "core"
  - "functions"
  - "decorators"
updatedAt: "2026-09-19"
---
## Для чего нужен декоратор {#dlya-chego-nuzhen-dekorator}

Представь, что перед вызовом нескольких функций нужно печатать сообщение, а после вызова сообщать о завершении. Эти действия можно повторить внутри каждой функции, но тогда при изменении сообщения придется исправлять все копии.

Декоратор позволяет описать такое поведение один раз и подключать его к разным функциям. В этом уроке декоратор принимает исходную функцию и возвращает функцию-обертку: она выполняет дополнительные действия и вызывает исходную функцию.

Так можно добавлять журналирование, измерение времени или повторные попытки. Пример повторных HTTP-запросов разобран в [практической части урока](../../ekosistema-python/dekorator-retry-i-api-pogody.md).

## Функцию можно передать как значение {#funktsiyu-mozhno-peredat-kak-znachenie}

Сначала важно различать саму функцию и ее вызов:

```python
def say_hello():
    print("Hello!")


func = say_hello
func()  # Hello!
```

В `func` хранится та же функция, что и в `say_hello`. Скобки вызывают ее.

```python
func = say_hello    # сохранить функцию
result = say_hello()  # вызвать и сохранить результат: None
```

Поэтому декоратору передают `say_hello`, а не результат `say_hello()`.

## Первый декоратор без `@` {#pervyy-dekorator-bez-at}

```python
def my_decorator(func):
    # wrapper - произвольное имя обертки, например run_with_messages.
    # При переименовании замени его и в return ниже.
    def wrapper():
        print("Before")
        func()
        print("After")

    return wrapper


def say_hello():
    print("Hello!")


decorated_hello = my_decorator(say_hello)
decorated_hello()
```

Результат:

```text
Before
Hello!
After
```

Разберем роли:

| Имя | Что хранит или делает |
| --- | --- |
| `my_decorator` | принимает функцию и создает обертку |
| `func` | параметр со ссылкой на исходную `say_hello` |
| `wrapper` | вложенная функция с дополнительными действиями |
| `decorated_hello` | ссылка на возвращенную обертку |

`wrapper` переводится как «обертка». Это обычное имя, а не специальное слово Python. Можно назвать функцию `run_with_messages`, но тогда ниже нужно написать `return run_with_messages`. Имя `func` тоже выбирает автор: оно обозначает параметр, принимающий исходную функцию.

### Порядок выполнения {#poryadok-vypolneniya}

1. `def my_decorator` создает декоратор, но пока не выполняет его тело.
2. `def say_hello` создает исходную функцию без вывода приветствия.
3. `my_decorator(say_hello)` создает и возвращает `wrapper`. Ее тело пока не выполняется.
4. `decorated_hello()` запускает обертку: `Before`, затем `func()` с приветствием, затем `After`.

Повторный `decorated_hello()` вызывает ту же обертку снова. Повторно применять декоратор не нужно.

## Почему вложенная функция помнит `func` {#pochemu-vlozhennaya-funktsiya-pomnit-func}

После завершения `my_decorator()` возвращенная `wrapper` по-прежнему имеет доступ к `func` из внешней функции. Такое поведение называется замыканием.

Поэтому `decorated_hello()` может вызвать исходную `say_hello()`, хотя выполнение самого декоратора уже закончилось. Каждое применение `my_decorator` создает свою обертку со ссылкой на переданную функцию.

## Почему `return wrapper`, а не `return wrapper()` {#pochemu-return-wrapper-a-ne-return-wrapper}

В конце декоратора нужно вернуть функцию, которую получится вызвать позже:

```python
return wrapper    # вернуть функцию
return wrapper()  # вызвать сейчас и вернуть результат
```

Это альтернативные строки внутри декоратора, а не две последовательные команды.

Во втором варианте приветствие напечатается уже при декорировании. В нашем примере `wrapper()` вернет `None`, поэтому следующий вызов `decorated_hello()` завершится `TypeError`.

Запись из урока:

```python
my_decorator(say_hello)()
```

объединяет два шага: `my_decorator(say_hello)` возвращает обертку, а последние `()` сразу вызывают ее.

## Что делает символ `@` {#chto-delaet-simvol-at}

С уже объявленным `my_decorator` можно написать:

```python
@my_decorator
def say_hello():
    print("Hello!")


say_hello()
```

Для этого примера запись означает:

```python
def say_hello():
    print("Hello!")


say_hello = my_decorator(say_hello)
```

Имя `say_hello` теперь указывает на обертку. Исходная функция остается доступна внутри нее через `func`, поэтому вызов `func()` не запускает обертку заново.

Декорирование происходит при выполнении объявления функции, в том числе при импорте модуля. В показанном декораторе тело обертки выполняется позже, при `say_hello()`. Такое применение `@` описано в [справочнике Python](https://docs.python.org/3/reference/compound_stmts.html#function-definitions).

## Передача аргументов через `*args` и `**kwargs` {#peredacha-argumentov-cherez-args-i-kwargs}

Первая обертка не принимает аргументы. Чтобы поддержать функции с параметрами, нужно принять аргументы и передать их дальше.

```python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Before")
        result = func(*args, **kwargs)
        print("After")
        return result

    return wrapper


@my_decorator
def say_hello(*, name: str) -> None:
    print(f"Hello, {name}!")


say_hello(name="Sasha")
```

При этом вызове внутри обертки:

```python
args == ()
kwargs == {"name": "Sasha"}
```

В объявлении `wrapper` звездочки собирают аргументы, а в `func(*args, **kwargs)` распаковывают их обратно. Исходная функция получает `name="Sasha"`, как при обычном вызове.

## Зачем два `return` {#zachem-dva-return}

Предыдущий декоратор подходит и для функции, которая возвращает число:

```python
@my_decorator
def add_numbers(*, a: int, b: int) -> int:
    return a + b


result = add_numbers(a=10, b=5)
print(result)
```

Вывод:

```text
Before
After
15
```

Здесь два разных возврата:

| Строка | Когда выполняется | Что возвращает |
| --- | --- | --- |
| `return wrapper` | при декорировании | функцию для будущих вызовов |
| `return result` | при вызове обертки | результат исходной функции, здесь `15` |

Если забыть `return result`, сложение выполнится, но вызывающий код получит `None`. Именно обертка теперь отвечает за передачу результата наружу.

## Сохранение имени через `functools.wraps` {#sokhranenie-imeni-cherez-functools-wraps}

Без дополнительной настройки имя декорированной функции будет именем обертки:

```python
print(add_numbers.__name__)  # wrapper
```

`wraps` переносит на обертку имя и документационную строку исходной функции, а также сохраняет ссылку на нее в `__wrapped__`. Это помогает отладке и инструментам просмотра функций. См. [документацию wraps](https://docs.python.org/3/library/functools.html#functools.wraps).

Полный вариант:

```python
from functools import wraps


def my_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("Before")
        result = func(*args, **kwargs)
        print("After")
        return result

    return wrapper


@my_decorator
def add_numbers(*, a: int, b: int) -> int:
    """Return the sum of two numbers."""
    return a + b


print(add_numbers(a=10, b=5))  # Before, After, затем 15
print(add_numbers.__name__)   # add_numbers
print(add_numbers.__doc__)    # Return the sum of two numbers.
```

`wraps` не передает аргументы и результат автоматически: строки `func(*args, **kwargs)` и `return result` по-прежнему нужны.

## Декоратор с параметрами {#dekorator-s-parametrami}

Иногда нужно настроить сам декоратор, например выбрать сообщение перед вызовом:

```python
from functools import wraps


def announce(message: str):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            print(message)
            return func(*args, **kwargs)

        return wrapper

    return decorator


@announce("Starting")
def greet(name: str) -> str:
    return f"Hello, {name}!"


print(greet("Sasha"))
```

Вывод:

```text
Starting
Hello, Sasha!
```

Здесь три уровня:

| Вызов | Что получает | Что возвращает |
| --- | --- | --- |
| `announce("Starting")` | настройку сообщения | декоратор `decorator` |
| `decorator(func)` | исходную функцию | обертку `wrapper` |
| `wrapper("Sasha")` | аргумент исходной функции | приветствие |

`announce` называют фабрикой декораторов: она создает настроенный декоратор. Сообщение запоминается через замыкание. Первые два уровня выполняются при декорировании, третий при вызове `greet`.

Строка `"Starting"` предназначена декоратору, а `"Sasha"` передается в `greet`. Это разные параметры.

## Несколько декораторов {#neskolko-dekoratorov}

Используем `announce` из предыдущего раздела:

```python
@announce("Outer")
@announce("Inner")
def say_hello():
    print("Hello!")


say_hello()
```

Вывод:

```text
Outer
Inner
Hello!
```

К функции сначала применяется нижний декоратор, затем верхний оборачивает полученный результат. При вызове первой запускается внешняя обертка.

Эквивалент после обычного объявления `say_hello` без `@`:

```python
say_hello = announce("Outer")(announce("Inner")(say_hello))
```

Не добавляй это присваивание к уже декорированной функции: иначе обернешь ее повторно. Порядок декораторов важен: например, измерение времени снаружи `retry` включает все попытки и паузы, а внутри измеряет отдельные вызовы.

## Что произойдет при исключении {#chto-proizoydet-pri-isklyuchenii}

Если `func(...)` выбросит исключение, строки после вызова, включая `print("After")`, не выполнятся. Ошибка пойдет в вызывающий код.

Если сообщение нужно вывести и при успехе, и при ошибке, используй `finally`:

```python
from functools import wraps


def report_completion(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        finally:
            print("Call finished")

    return wrapper
```

Такой декоратор сообщает о завершении попытки, но не скрывает исключение. Не помещай `return` в `finally`: он может заменить результат или подавить ошибку.

## Связь с `@property` {#svyaz-s-at-property}

Уже знакомое `@property` использует тот же синтаксис применения декоратора. Но результатом `property` становится специальное свойство класса, тогда как `my_decorator` возвращает обычную функцию. Декораторы не обязаны всегда возвращать именно `wrapper`.

## Частые ошибки {#chastye-oshibki}

| Ошибка | Последствие | Исправление |
| --- | --- | --- |
| `my_decorator(say_hello())` | передается результат вызова | `my_decorator(say_hello)` |
| `return wrapper()` | обертка запускается слишком рано | `return wrapper` |
| нет внешнего `return` | имя функции получает `None` | вернуть обертку |
| нет `return result` | теряется результат исходной функции | вернуть результат из обертки |
| `func(args, kwargs)` | передаются кортеж и словарь целиком | `func(*args, **kwargs)` |
| `@announce` вместо `@announce("Starting")` | функция попадает в параметр сообщения | сначала настроить декоратор |
| ожидать `After` при ошибке | выполнение прерывается раньше | использовать `try`/`finally` |

## Задачи {#zadachi}

### Задача 1 {#zadacha-1}

Создай декоратор `announce`, который печатает имя функции перед вызовом. Проверь его на функции без аргументов и на функции с именованным параметром.

### Задача 2 {#zadacha-2}

Напиши декоратор `double_result`, который удваивает возвращенное число. Проверь, что декорированная функция продолжает возвращать значение, а не `None`.

### Задача 3 {#zadacha-3}

Добавь `wraps` и проверь `__name__`. Затем вызови функцию, которая выбрасывает `ValueError`, и проследи, какие сообщения успеют напечататься.

### Задача 4 {#zadacha-4}

Примени два `announce` к одной функции. Предскажи вывод, затем поменяй декораторы местами и сравни результат.

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python: Function definitions', href: 'https://docs.python.org/3/reference/compound_stmts.html#function-definitions' },
        { title: 'Python: functools.wraps', href: 'https://docs.python.org/3/library/functools.html#functools.wraps' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Практика: retry и API погоды', href: '/python/ekosistema-python/dekorator-retry-i-api-pogody' },
        { title: 'Args и kwargs', href: '/python/yazyk-python/1-core/prodvinutye-funktsii-args-kwargs' },
        { title: 'Область видимости', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh' },
        { title: 'Property и super', href: '/python/yazyk-python/klassy/property-super-i-pereopredelenie' },
    ]"
/>
