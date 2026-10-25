---
title: "Файлы в Python"
description: "Урок 28: пути через pathlib, открытие и закрытие файлов, режимы чтения и записи, encoding, with, JSON и CSV."
tags:
  - "python"
  - "core"
  - "files"
  - "json"
  - "csv"
updatedAt: "2026-10-06"
---
## Что такое файл {#chto-takoe-fayl}

Файл хранит данные после завершения программы. Python может читать существующие файлы и создавать новые: текст, JSON, CSV, изображения и другие форматы.

При работе с файлом программа проходит три шага:

1. Определяет путь к файлу.
2. Открывает файл в подходящем режиме.
3. Читает или записывает данные и закрывает файл.

Для текстовых файлов почти всегда явно указывай `encoding="utf-8"`.

## Открытие файла через with {#otkrytie-fayla-cherez-with}

```python
from pathlib import Path


file_path = Path("notes.txt")

with file_path.open("w", encoding="utf-8") as file:
    file.write("Первая строка\nВторая строка")
```

`open()` возвращает файловый объект. Переменная `file` существует и после блока, но сам файл уже закрыт и работать с ним нельзя.

`with` автоматически закрывает файл при выходе из блока, даже если во время работы возникнет исключение. Поэтому эта конструкция безопаснее ручных `open()` и `close()`.

## Режимы открытия {#rezhimy-otkrytiya}

| Режим | Назначение | Если файла нет | Если файл существует |
| --- | --- | --- | --- |
| `"r"` | чтение | `FileNotFoundError` | содержимое сохраняется |
| `"w"` | запись | создается | прежнее содержимое удаляется |
| `"a"` | добавление в конец | создается | прежнее содержимое сохраняется |
| `"x"` | создание нового файла | создается | `FileExistsError` |
| `"b"` | бинарный режим | зависит от основного режима | работает с `bytes` |

Режимы можно объединять: `"rb"` читает байты, `"wb"` записывает байты, а `"r+"` разрешает чтение и запись.

## Запись текста {#zapis-teksta}

Метод `write()` записывает одну строку и возвращает количество записанных символов. Перенос строки нужно добавить самостоятельно через `\n`.

```python
from pathlib import Path


file_path = Path("notes.txt")

with file_path.open("w", encoding="utf-8") as file:
    written = file.write("Python\nФайлы")

print(written)  # 12
```

`writelines()` принимает последовательность строк, но тоже не добавляет переносы автоматически:

```python
from pathlib import Path


lines = ["Первая строка\n", "Вторая строка\n"]

with Path("notes.txt").open("w", encoding="utf-8") as file:
    file.writelines(lines)
```

## Чтение текста {#chtenie-teksta}

```python
from pathlib import Path


file_path = Path("notes.txt")
file_path.write_text("Первая строка\nВторая строка", encoding="utf-8")

with file_path.open("r", encoding="utf-8") as file:
    content = file.read()

print(content)  # Первая строка\nВторая строка
```

Основные способы чтения:

| Способ | Результат |
| --- | --- |
| `file.read()` | весь файл одной строкой |
| `file.readline()` | следующая строка |
| `file.readlines()` | список всех строк |
| `for line in file` | чтение по одной строке без загрузки всего файла |

Для больших файлов используй цикл:

```python
from pathlib import Path


with Path("notes.txt").open("r", encoding="utf-8") as file:
    for line in file:
        print(line.rstrip())  # Первая строка; затем Вторая строка
```

`rstrip()` убирает перевод строки в конце. Сам цикл читает файл постепенно.

## Относительный и абсолютный путь {#otnositelnyy-i-absolyutnyy-put}

Путь `Path("files/data.json")` считается от текущей рабочей директории. Она может отличаться от папки, где находится скрипт. Из-за этого возникает `FileNotFoundError`, хотя файл виден в редакторе.

Чтобы построить путь рядом со скриптом:

```python
from pathlib import Path


script_directory = Path(__file__).resolve().parent
files_directory = script_directory / "files"
files_directory.mkdir(exist_ok=True)
file_path = files_directory / "data.json"

print(file_path.name)  # data.json
print(file_path.parent.name)  # files
```

- `__file__` хранит путь к текущему `.py`-файлу;
- `resolve()` приводит путь к абсолютному виду;
- `parent` получает родительскую папку;
- оператор `/` соединяет части пути;
- `mkdir(exist_ok=True)` создает папку и не падает, если она уже существует.

Если нужно создать несколько отсутствующих уровней папок, используй `mkdir(parents=True, exist_ok=True)`.

## Запись и чтение JSON {#zapis-i-chtenie-json}

JSON подходит для словарей, списков, строк, чисел, логических значений и `None`.

```python
import json
from pathlib import Path


data = {"name": "Анна", "age": 30, "city": "Москва"}
file_path = Path("data.json")

with file_path.open("w", encoding="utf-8") as file:
    json.dump(data, file, ensure_ascii=False, indent=4)

with file_path.open("r", encoding="utf-8") as file:
    loaded_data = json.load(file)

print(loaded_data)  # {'name': 'Анна', 'age': 30, 'city': 'Москва'}
print(type(loaded_data))  # <class 'dict'>
```

`json.dump()` записывает Python-объект в файл, а `json.load()` читает его обратно. `indent=4` делает файл удобным для человека, `ensure_ascii=False` сохраняет кириллицу без последовательностей `\u....`.

Не путай функции:

| Функция | Работает с |
| --- | --- |
| `json.dump()` / `json.load()` | файлом |
| `json.dumps()` / `json.loads()` | строкой |

Подробнее: [JSON и сериализация](../../ekosistema-python/json-i-serializatsiya.md).

## Запись и чтение CSV {#zapis-i-chtenie-csv}

CSV хранит таблицу в виде строк и столбцов. Для него используется встроенный модуль `csv`.

```python
import csv
from pathlib import Path


file_path = Path("persons.csv")
persons = [
    {"name": "John", "age": 28, "occupation": "Engineer"},
    {"name": "Marie", "age": 22, "occupation": "Designer"},
]
fields = ["name", "age", "occupation"]

with file_path.open("w", encoding="utf-8", newline="") as file:
    writer = csv.DictWriter(file, fieldnames=fields)
    writer.writeheader()
    writer.writerows(persons)

with file_path.open("r", encoding="utf-8", newline="") as file:
    loaded_persons = list(csv.DictReader(file))

print(loaded_persons)  # [{'name': 'John', 'age': '28', 'occupation': 'Engineer'}, {'name': 'Marie', 'age': '22', 'occupation': 'Designer'}]
```

`DictWriter` сопоставляет ключи словаря с колонками из `fieldnames`. `writeheader()` записывает заголовок. `DictReader` использует первую строку как имена ключей.

После чтения все значения CSV являются строками: возраст получился `"28"`, а не `28`. Если требуется число, преобразуй его через `int()`.

Параметр `newline=""` передает обработку переводов строк модулю `csv` и предотвращает появление лишних пустых строк на некоторых системах.

## Частые ошибки {#chastye-oshibki}

| Ошибка | Причина и исправление |
| --- | --- |
| `FileNotFoundError` при чтении | путь неверен или файла нет; проверь рабочую директорию и путь |
| `FileNotFoundError` при записи | режим `w` создает файл, но не родительские папки; вызови `mkdir()` |
| данные пропали после запуска | режим `w` перезаписал файл; для добавления нужен `a` |
| `ValueError: I/O operation on closed file` | обращение к файлу после блока `with` |
| нечитаемая кириллица | явно укажи `encoding="utf-8"` |
| лишние строки в CSV | открывай CSV с `newline=""` |

## Задачи {#zadachi}

1. Запиши три строки в `notes.txt`, затем прочитай их циклом.
2. Создай папку `files` рядом со скриптом и сохрани туда JSON со сведениями о пользователе.
3. Прочитай JSON обратно и выведи имя пользователя. Рядом с `print()` укажи ожидаемый вывод.
4. Запиши список товаров в CSV, прочитай его через `DictReader` и преобразуй цену из строки в `float`.

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python: Reading and Writing Files', href: 'https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files' },
        { title: 'Python pathlib', href: 'https://docs.python.org/3/library/pathlib.html' },
        { title: 'Python json', href: 'https://docs.python.org/3/library/json.html' },
        { title: 'Python csv', href: 'https://docs.python.org/3/library/csv.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Исключения, context managers и файлы', href: '/python/yazyk-python/isklyucheniya-context-managers-i-fayly' },
        { title: 'JSON и сериализация', href: '/python/ekosistema-python/json-i-serializatsiya' },
        { title: 'Загрузка данных и форматы', href: '/python/ekosistema-python/zagruzka-dannykh-i-formaty' },
        { title: 'Байты bytes', href: '/python/yazyk-python/tipy-dannykh/bayty-bytes' },
    ]"
/>
