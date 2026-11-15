---
title: "Процесс импорта и байт-код pyc"
description: "Что Python делает при импорте, как работает sys.modules, зачем нужны байт-код, файлы pyc и папка __pycache__."
tags:
  - "python"
  - "core"
  - "imports"
  - "bytecode"
updatedAt: "2026-11-13"
---
## Что происходит при импорте {#chto-proiskhodit-pri-importe}

При первом импорте Python:

1. Ищет модуль.
2. Создаёт объект модуля.
3. Выполняет его код сверху вниз.
4. Сохраняет загруженный модуль в `sys.modules`.
5. Связывает нужное имя с объектом модуля или его атрибутом.

Поэтому код на верхнем уровне модуля выполняется при импорте.

```python
# notifications.py
print("Module is loaded")


def send_message():
    print("Message sent")
```

Другой файл импортирует модуль:

```python
import notifications
# Module is loaded
```

Тело `send_message()` при импорте не выполняется. Python только создаёт функцию. Её код запустится после вызова:

```python
notifications.send_message()  # Message sent
```

## Кэш модулей в `sys.modules` {#kesh-moduley-v-sys-modules}

В рамках одного запуска интерпретатора повторный обычный импорт берёт готовый объект модуля из `sys.modules`:

```python
import sys
import notifications

print("notifications" in sys.modules)  # True
```

Поэтому верхнеуровневый код модуля обычно не выполняется второй раз при повторном `import` в том же процессе.

`sys.modules` — это словарь. Ключом служит имя модуля, значением — загруженный объект модуля.

## Байт-код {#bayt-kod}

Перед выполнением Python преобразует исходный код из файла `.py` в более простую промежуточную форму — **байт-код**. Затем виртуальная машина Python выполняет инструкции байт-кода.

При импорте модуля CPython может сохранить скомпилированный байт-код в файле с расширением `.pyc`:

```text
project/
├── main.py
├── calculator.py
└── __pycache__/
    └── calculator.cpython-312.pyc
```

Здесь:

- `calculator.py` — исходный код модуля;
- `__pycache__` — папка с кэшем байт-кода;
- `calculator.cpython-312.pyc` — байт-код для CPython 3.12.

Расширение `.pyc` происходит от слов **Python compiled**. Если в распознанном тексте книги встречается `.рус`, это OCR-ошибка.

## Как `.pyc` ускоряет импорт {#kak-pyc-uskoryaet-import}

При следующем импорте в другом процессе Python проверяет сохранённый `.pyc`. Если кэш подходит текущей версии интерпретатора и исходный файл не изменился, Python может пропустить повторную компиляцию `.py` в байт-код.

Упрощённая схема:

```text
Первый импорт:      .py -> компиляция -> байт-код -> выполнение
Следующий импорт:  .pyc ------------------------> выполнение
```

`.pyc` экономит время на компиляции, но не отменяет выполнение кода модуля. При запуске новой программы верхнеуровневый код импортируемого модуля снова выполнится.

Внутри уже запущенной программы повторный импорт обычно быстрее по другой причине: готовый модуль берётся из `sys.modules`.

## Когда Python обновляет кэш {#kogda-python-obnovlyaet-kesh}

Python проверяет, соответствует ли `.pyc` исходному файлу и текущему интерпретатору. Если исходный код изменился или кэш создан несовместимой версией Python, байт-код компилируется заново.

Папку `__pycache__` и файлы `.pyc` можно удалить. Это кэш, а не исходный код. При необходимости Python создаст их снова.

Обычно их не добавляют в Git:

```text
__pycache__/
*.pyc
```

## Платформенная независимость и ограничения {#platformennaya-nezavisimost-i-ogranicheniya}

Байт-код CPython не привязан к конкретному процессору или операционной системе. Он не содержит машинный код только для macOS или Windows.

Однако байт-код не универсален для любых версий и реализаций Python:

- формат может изменяться между версиями CPython;
- другие реализации Python могут использовать другой формат;
- `.pyc` не предназначен для надёжного сокрытия исходного алгоритма.

Кратко: `.pyc` — автоматически управляемый кэш байт-кода, который может ускорить загрузку модуля, но не заменяет исходный файл при обычной разработке.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Импортируй собственный модуль и найди его имя в `sys.modules`.
2. Найди созданную папку `__pycache__` и расшифруй имя файла `.pyc`.
3. Объясни разницу между кэшем модуля в `sys.modules` и файлом `.pyc`.

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python: The import system', href: 'https://docs.python.org/3/reference/import.html' },
        { title: 'Python: Compiled Python files', href: 'https://docs.python.org/3/tutorial/modules.html#compiled-python-files' },
        { title: 'Python: sys.modules', href: 'https://docs.python.org/3/library/sys.html#sys.modules' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Обзор импортов', href: '/python/yazyk-python/1-core/importy-i-moduli/' },
        { title: 'Поиск модулей и ошибки', href: '/python/yazyk-python/1-core/importy-i-moduli/poisk-modulya-i-oshibki' },
        { title: 'if __name__ == __main__', href: '/python/yazyk-python/1-core/importy-i-moduli/name-main' },
    ]"
/>
