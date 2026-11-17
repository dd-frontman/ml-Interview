---
title: "Ошибки синтаксиса и отступов"
description: "Как находить и исправлять SyntaxError, IndentationError и TabError: пропущенные символы, незакрытые скобки и неправильные отступы."
tags:
  - "python"
  - "exceptions"
  - "syntax"
  - "indentation"
updatedAt: "2026-11-17"
---
## Почему программа не запускается {#pochemu-programma-ne-zapuskaetsya}

Перед выполнением Python разбирает исходный код и проверяет его структуру. Если код не соответствует грамматике языка, возникает синтаксическая ошибка.

```python
if age >= 18
    print("Доступ разрешён")


# SyntaxError: expected ':'
```

Python не может построить инструкцию `if`, потому что после условия отсутствует двоеточие.

Такие ошибки обычно нельзя обработать через `try/except`: сначала нужно сделать код синтаксически корректным.

## `SyntaxError` {#syntaxerror}

`SyntaxError` означает, что Python не смог разобрать инструкцию.

Частые причины:

- пропущено двоеточие;
- не закрыта скобка;
- не закрыта строка;
- оператор находится в неправильном месте;
- используется недопустимая конструкция.

### Пропущено двоеточие {#propushcheno-dvoetochie}

```python
for number in range(3)
    print(number)


# SyntaxError: expected ':'
```

Исправление:

```python
for number in range(3):
    print(number)


# 0
# 1
# 2
```

### Не закрыта скобка {#ne-zakryta-skobka}

```python
print("Hello"


# SyntaxError: '(' was never closed
```

Место, на которое указывает Python, может находиться после настоящей причины. Если ошибка кажется странной, проверьте предыдущую строку и парность скобок.

### Не закрыта строка {#ne-zakryta-stroka}

```python
message = "Hello


# SyntaxError: unterminated string literal
```

У начальной кавычки должна быть парная закрывающая кавычка того же вида.

## `IndentationError` {#indentationerror}

Отступы являются частью синтаксиса Python. После инструкции с двоеточием должен начинаться вложенный блок.

```python
if True:
print("Hello")


# IndentationError: expected an indented block
```

Исправление:

```python
if True:
    print("Hello")  # Hello
```

Ошибка также возникает, если строка имеет лишний или неожиданный отступ:

```python
name = "Alex"
    print(name)


# IndentationError: unexpected indent
```

## `TabError` {#taberror}

`TabError` возникает, если в отступах несовместимо смешаны символы табуляции и пробелы.

Визуально строки могут выглядеть одинаково, но редактор и Python видят разные символы.

Рекомендуемая настройка:

- один уровень — четыре пробела;
- Tab в редакторе вставляет пробелы;
- включено отображение невидимых символов при диагностике.

Автоформаттер также помогает привести отступы к одному стилю.

## Как искать синтаксическую ошибку {#kak-iskat-sintaksicheskuyu-oshibku}

1. Прочитайте последнюю строку сообщения.
2. Посмотрите на строку и указатель `^`.
3. Проверьте предыдущую строку.
4. Проверьте двоеточия после `if`, `for`, `while`, `def`, `class`, `try`.
5. Проверьте парность `()`, `[]`, `{}` и кавычек.
6. Проверьте отступы всего блока.

## Типичная ошибка мышления {#tipichnaya-oshibka-myshleniya}

Не нужно писать обработчик такого вида:

```python
try:
    if True
        print("Hello")
except SyntaxError:
    print("Ошибка")
```

Файл не начнёт выполняться, потому что Python обнаружит проблему раньше выполнения `try`.

## Самостоятельная практика {#samostoyatelnaya-praktika}

Найдите и исправьте ошибки:

```python
def greet(name)
print(f"Hello, {name}")
```

Проверьте двоеточие, отступ и закрывающие символы.

## Краткое повторение {#kratkoe-povtorenie}

- `SyntaxError` означает неправильную грамматику кода.
- `IndentationError` связан со структурой отступов.
- `TabError` указывает на смешивание табуляции и пробелов.
- Сначала проверяйте указанную и предыдущую строки.
- Эти ошибки нужно исправлять, а не скрывать через `try/except`.

<RelatedTopics
    :items="[
        { title: 'Обзор типов ошибок', href: '/python/yazyk-python/1-core/tipy-oshibok-i-isklyucheniy/' },
        { title: 'Обработка исключений', href: '/python/yazyk-python/1-core/obrabotka-isklyucheniy-try-except' },
    ]"
/>
