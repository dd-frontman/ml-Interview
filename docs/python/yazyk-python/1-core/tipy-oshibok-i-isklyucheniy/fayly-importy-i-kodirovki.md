---
title: "Ошибки файлов, импортов и кодировок"
description: "Разбор OSError, FileNotFoundError, PermissionError, ImportError, ModuleNotFoundError и ошибок Unicode при работе с внешними данными."
tags:
  - "python"
  - "exceptions"
  - "files"
  - "imports"
updatedAt: "2026-11-17"
---
## Почему внешние ресурсы требуют обработки {#pochemu-vneshnie-resursy-trebuyut-obrabotki}

Даже правильный код может столкнуться с внешней проблемой:

- файл удалён;
- у процесса нет прав;
- путь указывает не на тот тип объекта;
- пакет не установлен в выбранном окружении;
- байты имеют другую кодировку.

Такие ситуации часто можно предусмотреть и обработать.

## Семейство `OSError` {#semeystvo-oserror}

`OSError` — базовый класс для многих ошибок операционной системы и ввода-вывода.

```text
OSError
├── FileNotFoundError
├── PermissionError
├── IsADirectoryError
├── NotADirectoryError
├── FileExistsError
├── ConnectionError
└── TimeoutError
```

Конкретный подкласс точнее сообщает причину, поэтому обычно его и нужно перехватывать.

## `FileNotFoundError` {#filenotfounderror}

Файл или директория не найдены по указанному пути.

```python
with open("missing.txt", "r", encoding="utf-8") as file:
    content = file.read()


# FileNotFoundError: [Errno 2] No such file or directory
```

Проверьте:

- текущую рабочую директорию;
- абсолютный или относительный путь;
- опечатки и регистр символов;
- существование родительской директории.

Если отсутствие файла допустимо, можно обработать исключение:

```python
try:
    with open("settings.json", "r", encoding="utf-8") as file:
        settings = file.read()
except FileNotFoundError:
    settings = "{}"

print(settings)  # {}
```

## `PermissionError` {#permissionerror}

Операционная система запретила чтение, запись или изменение ресурса.

Причины:

- у пользователя нет нужных прав;
- файл защищён;
- директория недоступна приложению;
- программа пытается записать данные в системную область.

Не нужно автоматически повышать права программы. Сначала проверьте выбранный путь и ожидаемые разрешения.

## `IsADirectoryError` и `NotADirectoryError` {#isadirectoryerror-i-notadirectoryerror}

`IsADirectoryError` возникает, когда директорию пытаются использовать как обычный файл.

```python
with open("docs", "r", encoding="utf-8") as file:
    content = file.read()


# IsADirectoryError
```

`NotADirectoryError` означает, что часть пути должна быть директорией, но ей не является.

Для диагностики удобно использовать `pathlib.Path`:

```python
from pathlib import Path

path = Path("docs")

print(path.exists())  # True или False
print(path.is_file())  # True или False
print(path.is_dir())  # True или False
```

## `FileExistsError` {#fileexistserror}

Код пытается создать объект, который уже существует, хотя операция запрещает замену.

Например, это возможно при `mkdir(exist_ok=False)`.

```python
from pathlib import Path

Path("data").mkdir()
Path("data").mkdir()


# FileExistsError
```

Если существующая директория допустима:

```python
Path("data").mkdir(exist_ok=True)
```

## `ModuleNotFoundError` {#modulenotfounderror}

Python не нашёл импортируемый модуль.

```python
import unknown_package


# ModuleNotFoundError: No module named 'unknown_package'
```

Проверьте:

1. правильность имени;
2. установлен ли пакет;
3. выбран ли нужный интерпретатор;
4. активировано ли виртуальное окружение;
5. входит ли локальный модуль в путь поиска.

## `ImportError` {#importerror}

Модуль найден, но запрошенное имя импортировать нельзя.

```python
from math import unknown_function


# ImportError: cannot import name 'unknown_function' from 'math'
```

Возможные причины:

- функции нет в модуле;
- имя изменилось в новой версии библиотеки;
- возник циклический импорт;
- объект ещё не создан к моменту импорта.

`ModuleNotFoundError` является подклассом `ImportError`.

## `UnicodeDecodeError` {#unicodedecodeerror}

Байты невозможно преобразовать в текст с выбранной кодировкой.

```python
data = b"\xff"
text = data.decode("utf-8")


# UnicodeDecodeError
```

Проблема не в самом тексте, а в несовпадении реальной и указанной кодировок.

## `UnicodeEncodeError` {#unicodeencodeerror}

Строку невозможно преобразовать в выбранную последовательность байтов.

```python
text = "Привет"
data = text.encode("ascii")


# UnicodeEncodeError
```

ASCII не содержит кириллических символов. UTF-8 подходит:

```python
data = text.encode("utf-8")
print(data)  # b'\xd0\x9f\xd1\x80\xd0\xb8\xd0\xb2\xd0\xb5\xd1\x82'
```

## Не скрывайте повреждение данных {#ne-skryvayte-povrezhdenie-dannykh}

Параметр `errors="ignore"` может удалить символы без предупреждения:

```python
text = data.decode("utf-8", errors="ignore")
```

Используйте его только при осознанном требовании. Обычно лучше определить правильную кодировку или явно сообщить об ошибке.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Напишите чтение необязательного файла с обработкой `FileNotFoundError`.
2. Проверьте путь через `Path.is_file()` перед чтением.
3. Объясните различие между `ModuleNotFoundError` и `ImportError`.
4. Преобразуйте кириллическую строку в UTF-8 и обратно.

## Краткое повторение {#kratkoe-povtorenie}

- Файловые ошибки обычно наследуются от `OSError`.
- Перехватывайте конкретный подкласс, который можете обработать.
- `ModuleNotFoundError` означает отсутствие модуля.
- `ImportError` может означать отсутствие имени внутри найденного модуля.
- Ошибки Unicode связаны с несовпадением текста, байтов и кодировки.

<RelatedTopics
    :items="[
        { title: 'Обзор типов ошибок', href: '/python/yazyk-python/1-core/tipy-oshibok-i-isklyucheniy/' },
        { title: 'Файлы в Python', href: '/python/yazyk-python/1-core/fayly-v-python' },
        { title: 'Импорты и модули', href: '/python/yazyk-python/1-core/importy-i-moduli/' },
        { title: 'Байты', href: '/python/yazyk-python/tipy-dannykh/bayty-bytes' },
    ]"
/>
