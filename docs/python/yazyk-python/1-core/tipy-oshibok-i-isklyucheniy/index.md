---
title: "Типы ошибок и исключений: обзор"
description: "Обзор ошибок Python: отличие синтаксических ошибок от исключений, устройство traceback, иерархия классов и порядок изучения раздела."
tags:
  - "python"
  - "exceptions"
  - "errors"
  - "debugging"
updatedAt: "2026-11-17"
---
## Что изучаем {#chto-izuchaem}

Ошибка означает, что Python не смог продолжить выполнение программы так, как ожидалось.

Полезно различать две большие группы:

1. **Синтаксические ошибки** — Python не может разобрать исходный код.
2. **Исключения** — код записан по правилам языка, но при выполнении возникла проблема.

Синтаксическая ошибка:

```python
if age >= 18
    print("Доступ разрешён")


# SyntaxError: expected ':'
```

Исключение во время выполнения:

```python
number = int("Python")


# ValueError: invalid literal for int() with base 10: 'Python'
```

Во втором случае Python понимает инструкцию, но не может преобразовать строку `"Python"` в целое число.

## Как читать traceback {#kak-chitat-traceback}

Traceback — отчёт о последовательности вызовов, которая привела к необработанному исключению.

```text
Traceback (most recent call last):
  File "app.py", line 4, in <module>
    print(numbers[5])
IndexError: list index out of range
```

Начинайте чтение с последней строки:

1. `IndexError` — класс исключения.
2. `list index out of range` — сообщение с причиной.
3. `print(numbers[5])` — инструкция, на которой обнаружена проблема.
4. `app.py`, строка 4 — файл и номер строки.

Если traceback содержит несколько функций, поднимайтесь снизу вверх и смотрите, как программа пришла к проблемной строке.

## Исключения являются объектами {#isklyucheniya-yavlyayutsya-obektami}

Исключение — это объект определённого класса.

```python
try:
    int("Python")
except ValueError as error:
    print(type(error))  # <class 'ValueError'>
    print(str(error))  # invalid literal for int() with base 10: 'Python'
```

Переменная `error` хранит объект исключения. У него есть тип, сообщение и traceback.

## Иерархия исключений {#ierarkhiya-isklyucheniy}

Все исключения наследуются от `BaseException`.

```text
BaseException
├── KeyboardInterrupt
├── SystemExit
├── GeneratorExit
└── Exception
    ├── TypeError
    ├── ValueError
    ├── LookupError
    │   ├── IndexError
    │   └── KeyError
    ├── OSError
    │   ├── FileNotFoundError
    │   └── PermissionError
    └── другие обычные исключения
```

Большинство ошибок прикладного кода наследуется от `Exception`.

Обработчик родительского класса также перехватывает его дочерние исключения:

```python
try:
    numbers = [1, 2]
    print(numbers[5])
except LookupError as error:
    print(type(error).__name__)  # IndexError
```

Но безопаснее выбирать наиболее конкретный класс, который вы действительно можете обработать.

## Порядок изучения {#poryadok-izucheniya}

1. [Обработка исключений](./obrabotka-isklyucheniy-try-except.md)
   `try`, `except`, `else`, `finally` и `raise`.

2. [Синтаксис и отступы](./sintaksis-i-otstupy.md)
   `SyntaxError`, `IndentationError` и `TabError`.

3. [Типы, значения, имена и атрибуты](./tipy-znacheniya-imena-i-atributy.md)
   `TypeError`, `ValueError`, `NameError`, `UnboundLocalError` и `AttributeError`.

4. [Коллекции и вычисления](./kollektsii-i-vychisleniya.md)
   `IndexError`, `KeyError`, `ZeroDivisionError` и `OverflowError`.

5. [Файлы, импорты и кодировки](./fayly-importy-i-kodirovki.md)
   Семейство `OSError`, ошибки импорта и Unicode.

6. [Ресурсы, выполнение и сеть](./resursy-vypolnenie-i-set.md)
   Рекурсия, память, проверки, незавершённые методы и сетевые проблемы.

7. [Системные и пользовательские исключения](./sistemnye-i-polzovatelskie-isklyucheniya.md)
   Завершение программы и собственные классы исключений.

8. [Выбор исключения и практика](./vybor-isklyucheniya-i-praktika.md)
   Что перехватывать, что исправлять и какой класс выбрать.

## Главный принцип {#glavnyy-printsip}

Не каждую ошибку нужно помещать в `try/except`.

- Ошибку программирования обычно нужно исправить.
- Ожидаемую внешнюю проблему можно обработать.
- Неожиданное исключение лучше не скрывать.

Например, опечатка в имени переменной — баг. А неправильный пользовательский ввод — ожидаемая ситуация, для которой можно показать понятное сообщение.

## Краткое повторение {#kratkoe-povtorenie}

- Синтаксическая ошибка мешает Python разобрать код.
- Исключение возникает во время выполнения.
- Последняя строка traceback содержит тип и сообщение.
- Обычные прикладные исключения наследуются от `Exception`.
- Выбирайте конкретный обработчик и не скрывайте неизвестные ошибки.

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: Errors and Exceptions', href: 'https://docs.python.org/3/tutorial/errors.html' },
        { title: 'Python: Built-in Exceptions', href: 'https://docs.python.org/3/library/exceptions.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Обработка исключений', href: '/python/yazyk-python/1-core/tipy-oshibok-i-isklyucheniy/obrabotka-isklyucheniy-try-except' },
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python/' },
        { title: 'Область видимости', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/' },
    ]"
/>
