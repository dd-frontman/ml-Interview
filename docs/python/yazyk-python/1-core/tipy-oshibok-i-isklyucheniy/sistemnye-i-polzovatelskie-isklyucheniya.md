---
title: "Системные и пользовательские исключения"
description: "Чем KeyboardInterrupt, SystemExit и GeneratorExit отличаются от обычных ошибок и как создавать собственные классы исключений."
tags:
  - "python"
  - "exceptions"
  - "baseexception"
  - "custom-errors"
updatedAt: "2026-11-17"
---
## Почему не все исключения означают ошибку {#pochemu-ne-vse-isklyucheniya-oznachayut-oshibku}

Некоторые исключения используются для управления завершением программы или объекта. Они наследуются непосредственно от `BaseException`, а не от `Exception`.

```text
BaseException
├── KeyboardInterrupt
├── SystemExit
├── GeneratorExit
└── Exception
    └── обычные ошибки программы
```

Благодаря этому обработчик `except Exception` не мешает пользователю остановить программу и не перехватывает штатное завершение через `sys.exit()`.

## `KeyboardInterrupt` {#keyboardinterrupt}

Возникает, когда пользователь прерывает программу, обычно через `Ctrl+C` в терминале.

```python
while True:
    print("Программа работает")


# Нажатие Ctrl+C вызывает KeyboardInterrupt
```

Обычно исключение нужно пропустить, чтобы программа завершилась. Иногда перед выходом требуется освободить ресурс:

```python
try:
    run_application()
except KeyboardInterrupt:
    print("Программа остановлена пользователем")
```

Такой обработчик не должен бесконечно продолжать работу против желания пользователя.

## `SystemExit` {#systemexit}

Функция `sys.exit()` создаёт исключение `SystemExit`.

```python
import sys

print("До завершения")  # До завершения
sys.exit(0)
print("После завершения")  # Эта строка не выполнится
```

Код `0` обычно означает успешное завершение, а ненулевой код — ошибку.

Так как `SystemExit` является исключением, блоки `finally` и контекстные менеджеры успевают освободить ресурсы.

## `GeneratorExit` {#generatorexit}

Возникает внутри генератора при его закрытии.

```python
def numbers():
    try:
        yield 1
        yield 2
    finally:
        print("Генератор закрыт")


generator = numbers()
print(next(generator))  # 1
generator.close()  # Генератор закрыт
```

`GeneratorExit` обычно не нужно перехватывать. Генератор должен завершить очистку и закрыться.

## Почему опасен пустой `except` {#pochemu-opasen-pustoy-except}

```python
try:
    run_application()
except:
    pass
```

Пустой обработчик ловит почти всё, включая `KeyboardInterrupt` и `SystemExit`. В результате программа может игнорировать остановку и скрывать критические проблемы.

Лучше назвать ожидаемое исключение:

```python
try:
    read_settings()
except FileNotFoundError:
    use_default_settings()
```

## Зачем нужны собственные исключения {#zachem-nuzhny-sobstvennye-isklyucheniya}

Стандартный `ValueError` сообщает, что значение неверно. Но он не всегда объясняет предметную причину.

Допустим, банковская операция не может снять больше денег, чем есть на счёте. Для этого можно создать отдельный класс:

```python
class InsufficientFundsError(Exception):
    pass
```

Теперь функция явно сообщает бизнес-проблему:

```python
def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError("Недостаточно средств")

    return balance - amount
```

Вызов:

```python
try:
    withdraw(100, 150)
except InsufficientFundsError as error:
    print(error)  # Недостаточно средств
```

Вызывающий код отличает недостаток средств от ошибки типа или программного бага.

## От какого класса наследоваться {#ot-kakogo-klassa-nasledovatsya}

Обычно собственное исключение наследуется от `Exception`:

```python
class ApplicationError(Exception):
    pass
```

Можно создать иерархию ошибок приложения:

```python
class ApplicationError(Exception):
    pass


class ValidationError(ApplicationError):
    pass


class AuthenticationError(ApplicationError):
    pass
```

Тогда вызывающий код может перехватить конкретную ошибку или все известные ошибки приложения:

```python
try:
    authenticate_user()
except AuthenticationError:
    print("Неверные данные входа")
except ApplicationError:
    print("Ошибка приложения")
```

Не наследуйте пользовательские ошибки напрямую от `BaseException`: они начнут вести себя как системные сигналы завершения.

## Данные внутри собственного исключения {#dannye-vnutri-sobstvennogo-isklyucheniya}

Исключение может хранить дополнительные данные.

```python
class InvalidAgeError(ValueError):
    def __init__(self, age):
        self.age = age
        super().__init__(f"Недопустимый возраст: {age}")


try:
    raise InvalidAgeError(-5)
except InvalidAgeError as error:
    print(error.age)  # -5
    print(error)  # Недопустимый возраст: -5
```

Наследование от `ValueError` показывает, что проблема по-прежнему относится к значению, но имеет более конкретный смысл.

## Именование {#imenovanie}

Названия собственных исключений обычно заканчиваются на `Error`:

- `InvalidAgeError`;
- `PaymentError`;
- `ConfigurationError`.

Название должно описывать проблему, а не место, где она произошла.

## Типичные ошибки {#tipichnye-oshibki}

1. Перехватывать `BaseException` без системной причины.
2. Использовать пустой `except:` и ничего не делать.
3. Наследовать прикладное исключение от `BaseException`.
4. Создавать новый класс для каждой мелкой проверки без практической пользы.
5. Перехватывать собственное исключение сразу в той же функции, не позволяя вызывающему коду выбрать реакцию.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Создайте `InvalidPriceError` для отрицательной цены.
2. Добавьте в исключение атрибут с неправильным значением.
3. Создайте базовый `ShopError` и два дочерних класса ошибок магазина.
4. Объясните, почему `except Exception` не ловит `KeyboardInterrupt`.

## Краткое повторение {#kratkoe-povtorenie}

- `KeyboardInterrupt`, `SystemExit` и `GeneratorExit` наследуются от `BaseException` напрямую.
- Их не нужно случайно перехватывать пустым `except:`.
- Пользовательские исключения обычно наследуются от `Exception`.
- Собственный класс помогает точно описать ошибку предметной области.
- Исключение может хранить дополнительные данные.

<RelatedTopics
    :items="[
        { title: 'Обзор типов ошибок', href: '/python/yazyk-python/1-core/tipy-oshibok-i-isklyucheniy/' },
        { title: 'Обработка исключений', href: '/python/yazyk-python/1-core/obrabotka-isklyucheniy-try-except' },
        { title: 'Генераторы', href: '/python/yazyk-python/iteratory-i-generatory/generatory-i-yield' },
    ]"
/>
