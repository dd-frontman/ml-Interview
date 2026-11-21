---
title: "Модуль sys в Python"
description: "Практическое руководство по sys: аргументы командной строки, stdin, stdout, stderr, коды завершения и сведения об интерпретаторе."
tags:
  - "python"
  - "core"
  - "stdlib"
  - "sys"
  - "cli"
updatedAt: "2026-11-18"
---
## Зачем нужен `sys` {#zachem-nuzhen-sys}

Модуль `sys` связывает Python-программу с запущенным интерпретатором и окружением процесса. Через него можно получить аргументы командной строки, разделить обычный вывод и ошибки, завершить программу с понятным кодом и проверить версию Python.

Модуль входит в стандартную библиотеку, поэтому устанавливать зависимости не нужно:

```python
import sys
```

## Минимальный работающий пример {#minimalnyy-rabotayushchiy-primer}

Создадим скрипт `greet.py`, который ожидает имя пользователя:

```python
import sys


def main(arguments: list[str]) -> int:
    if len(arguments) != 2:
        print("Использование: python greet.py <имя>", file=sys.stderr)
        return 2

    name = arguments[1]
    print(f"Привет, {name}!")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
```

Успешный запуск:

```bash
python greet.py Анна
```

```text
Привет, Анна!
```

Запуск без имени:

```bash
python greet.py
```

```text
Использование: python greet.py <имя>
```

Функция `main()` получает аргументы явно и возвращает код завершения. Точка входа преобразует этот код в `SystemExit`, поэтому скрипт удобно запускать из терминала, CI или другого процесса.

## Аргументы командной строки: `sys.argv` {#argumenty-komandnoy-stroki-sys-argv}

`sys.argv` - список строк с аргументами запуска.

```python
import sys

print(sys.argv)  # Например: ['greet.py', 'Анна']
```

Элементы списка:

- `sys.argv[0]` - имя скрипта или другое значение, зависящее от способа запуска;
- `sys.argv[1:]` - аргументы, которые передал пользователь.

Нельзя без проверки обращаться к `sys.argv[1]`: если аргумент не передан, возникнет `IndexError`.

Для одного-двух простых позиционных аргументов `sys.argv` достаточно. Если нужны флаги, значения по умолчанию, проверка типов и автоматическая справка `--help`, используй `argparse`:

```python
import argparse


parser = argparse.ArgumentParser()
parser.add_argument("--input", required=True)
arguments = parser.parse_args()

print(arguments.input)  # Значение зависит от аргумента --input
```

## Стандартные потоки {#standartnye-potoki}

У процесса есть три стандартных текстовых потока:

| Поток | Назначение |
| --- | --- |
| `sys.stdin` | входные данные |
| `sys.stdout` | обычный результат программы |
| `sys.stderr` | ошибки и диагностические сообщения |

Обычный `print()` пишет в `sys.stdout`. Поток можно указать явно:

```python
import sys

print("Модель сохранена", file=sys.stdout)  # Модель сохранена
print("Не удалось прочитать данные", file=sys.stderr)  # Не удалось прочитать данные
```

Разделение важно при перенаправлении вывода:

```bash
python train.py > result.txt 2> errors.txt
```

Обычный результат попадёт в `result.txt`, а ошибки - в `errors.txt`.

Для прямого чтения и записи доступны методы файловых объектов:

```python
import sys

line = sys.stdin.readline().strip()
sys.stdout.write(f"Получено: {line}\n")
```

В прикладном коде `input()` и `print()` обычно понятнее. Прямой доступ полезен, когда нужно явно выбрать поток или обрабатывать конвейерные данные.

## Завершение программы: `sys.exit()` {#zavershenie-programmy-sys-exit}

`sys.exit()` создаёт исключение `SystemExit`. Если его не перехватить, интерпретатор завершает процесс.

```python
import sys


configuration_is_valid = False

if not configuration_is_valid:
    print("Некорректная конфигурация", file=sys.stderr)
    sys.exit(1)
```

Основные коды:

| Код | Смысл |
| --- | --- |
| `0` | успешное завершение |
| ненулевой код | программа завершилась с ошибкой |

Для ошибки синтаксиса командной строки часто используют код `2`, а для общей ошибки - `1`. Если проект задаёт собственные коды, их нужно документировать.

В небольшом скрипте допустим прямой `sys.exit()`. В коде, который нужно тестировать и переиспользовать, удобнее вернуть код из `main()`:

```python
import sys


def main() -> int:
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

Так бизнес-логика не завершает процесс неожиданно, а точка входа явно управляет результатом запуска.

## Сведения об интерпретаторе {#svedeniya-ob-interpretatore}

`sys` помогает понять, какой Python выполняет код:

```python
import sys

print(sys.version_info.major)  # 3
print(sys.executable)  # Путь зависит от окружения
print(sys.platform)  # Например: darwin, linux или win32
```

- `sys.version_info` хранит компоненты версии Python;
- `sys.executable` обычно содержит путь к запущенному интерпретатору;
- `sys.platform` обозначает платформу.

Для проверки минимальной версии удобно сравнивать `version_info` с кортежем:

```python
import sys


if sys.version_info < (3, 11):
    raise RuntimeError("Требуется Python 3.11 или новее")
```

Версию проекта обычно фиксируют ещё и в `pyproject.toml`, CI или документации. Проверка во время выполнения не заменяет настройку окружения.

## Размер объекта: `sys.getsizeof()` {#razmer-obekta-sys-getsizeof}

`sys.getsizeof()` возвращает размер самого объекта в байтах:

```python
import sys

numbers = [1, 2, 3]
print(sys.getsizeof(numbers))  # Значение зависит от реализации Python
```

Для контейнера результат не включает полную память всех объектов, на которые он ссылается. Поэтому `getsizeof()` подходит для простых сравнений, но не является полноценным профилировщиком памяти.

## `sys.path` и `sys.modules` {#sys-path-i-sys-modules}

Модуль также предоставляет структуры, связанные с импортами:

- `sys.path` - список директорий поиска модулей;
- `sys.modules` - словарь уже загруженных модулей.

Они подробно разобраны в разделах [Поиск модулей и ошибки](./importy-i-moduli/poisk-modulya-i-oshibki.md) и [Как работает импорт и `.pyc`](./importy-i-moduli/protsess-importa-i-bayt-kod.md).

Не исправляй структуру проекта случайным `sys.path.append(...)`: такое решение зависит от конкретной машины и скрывает проблему с пакетами или способом запуска.

## Типичные ошибки {#tipichnye-oshibki}

1. Обращаться к `sys.argv[1]` без проверки длины списка.
   Результат: `IndexError` при запуске без аргумента.

2. Писать сообщения об ошибках в `stdout`.
   Результат: обычный результат и диагностику сложно разделить в конвейере.

3. Вызывать `sys.exit()` глубоко в бизнес-логике.
   Результат: функцию сложно переиспользовать и тестировать.

4. Считать `sys.getsizeof()` полным размером дерева объектов.
   Результат: оценка памяти получается заниженной.

5. Добавлять абсолютные пути через `sys.path.append()`.
   Результат: код работает только в одном окружении.

## Самостоятельная практика {#samostoyatelnaya-praktika}

### Задача 1. Проверка аргумента {#zadacha-1-proverka-argumenta}

Темы: `sys.argv`, `stderr`, код завершения.

Напиши скрипт, который принимает путь к файлу. Если путь не передан, выведи инструкцию в `stderr` и заверши программу с кодом `2`.

::: details Показать решение

```python
import sys


def main(arguments: list[str]) -> int:
    if len(arguments) != 2:
        print("Использование: python app.py <путь>", file=sys.stderr)
        return 2

    print(arguments[1])  # Путь, переданный пользователем
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
```

:::

### Задача 2. Разделение потоков {#zadacha-2-razdelenie-potokov}

Темы: `stdout`, `stderr`.

Выведи успешный результат в `stdout`, а предупреждение - в `stderr`. Затем перенаправь потоки в разные файлы из терминала.

::: details Показать решение

```python
import sys

print("result=42", file=sys.stdout)  # result=42
print("Используются тестовые данные", file=sys.stderr)  # Используются тестовые данные
```

```bash
python app.py > result.txt 2> warnings.txt
```

:::

### Задача 3. Проверка версии {#zadacha-3-proverka-versii}

Темы: `sys.version_info`, исключения.

Создай функцию, которая выбрасывает `RuntimeError`, если версия Python ниже заданной.

::: details Показать решение

```python
import sys


def require_python(major: int, minor: int) -> None:
    if sys.version_info < (major, minor):
        raise RuntimeError(f"Требуется Python {major}.{minor} или новее")


require_python(3, 11)
```

:::

## Краткая шпаргалка {#kratkaya-shpargalka}

| Задача | Инструмент |
| --- | --- |
| получить аргументы запуска | `sys.argv` |
| прочитать стандартный ввод | `sys.stdin` |
| вывести обычный результат | `sys.stdout` |
| вывести ошибку | `sys.stderr` |
| завершить процесс | `sys.exit()` или `raise SystemExit(...)` |
| проверить версию Python | `sys.version_info` |
| узнать путь к интерпретатору | `sys.executable` |
| узнать платформу | `sys.platform` |
| оценить размер самого объекта | `sys.getsizeof()` |

<OfficialDocsLinks
    :links="[
        { title: 'Python: sys', href: 'https://docs.python.org/3/library/sys.html' },
        { title: 'Python: argparse', href: 'https://docs.python.org/3/library/argparse.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Импорты и модули', href: '/python/yazyk-python/1-core/importy-i-moduli/' },
        { title: 'Системные исключения', href: '/python/yazyk-python/1-core/tipy-oshibok-i-isklyucheniy/sistemnye-i-polzovatelskie-isklyucheniya' },
        { title: 'Logging и CLI', href: '/python/ekosistema-python/logging-i-cli-dlya-ml-skriptov' },
    ]"
/>
