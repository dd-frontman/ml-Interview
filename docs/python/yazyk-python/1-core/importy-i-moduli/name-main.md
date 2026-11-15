---
title: "if __name__ == __main__"
description: "Как переменная __name__ отличает прямой запуск Python-файла от импорта и где размещать точку входа программы."
tags:
  - "python"
  - "core"
  - "imports"
  - "main"
updatedAt: "2026-11-13"
---
## Проблема {#problema}

Код на верхнем уровне модуля выполняется при импорте. Иногда это нежелательно:

```python
# math_operations.py
def add(x, y):
    return x + y


print(add(2, 3))  # Выполнится даже при импорте модуля
```

Если другой файл выполнит `import math_operations`, демонстрационный `print()` тоже запустится.

## Переменная `__name__` {#peremennaya-name}

Python автоматически создаёт глобальную переменную `__name__` для каждого модуля.

Её значение зависит от способа запуска:

- при прямом запуске файла — `"__main__"`;
- при импорте — имя модуля.

```python
print(__name__)
```

Если файл запустить командой `python app.py`, вывод будет:

```text
__main__
```

Если импортировать файл `app.py` как модуль, значение будет `"app"`.

## Условие `if __name__ == "__main__"` {#uslovie-if-name-main}

```python
def add(x, y):
    return x + y


if __name__ == "__main__":
    print(add(2, 3))  # 5
```

При прямом запуске:

```bash
python math_operations.py
```

`__name__` равно `"__main__"`, условие истинно и пример выполняется.

При импорте:

```python
import math_operations
```

`__name__` равно `"math_operations"`, поэтому код внутри условия не запускается. Функция `add()` остаётся доступной:

```python
print(math_operations.add(10, 5))  # 15
```

## Функция `main()` {#funktsiya-main}

В более крупной программе точку входа часто выносят в функцию:

```python
def main() -> None:
    print("Приложение запущено")


if __name__ == "__main__":
    main()  # Приложение запущено
```

Так основной сценарий можно отдельно вызвать, протестировать или заменить.

## Что размещают под условием {#chto-razmeshchayut-pod-usloviem}

- демонстрационные вызовы;
- запуск CLI;
- точку входа приложения;
- чтение аргументов командной строки;
- код, который не должен выполняться при импорте.

Объявления функций и классов обычно оставляют вне условия, чтобы они создавались и были доступны при импорте.

## Типичная ошибка {#tipichnaya-oshibka}

Неправильное условие:

```python
if __name__ == "main":
    main()
```

Нужны двойные подчёркивания с обеих сторон:

```python
if __name__ == "__main__":
    main()
```

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Создай модуль с функцией и демонстрационным вызовом под условием `__main__`.
2. Запусти файл напрямую, затем импортируй его из другого файла и сравни вывод.
3. Вынеси запуск небольшой программы в функцию `main()`.

<RelatedTopics
    :items="[
        { title: 'Обзор импортов', href: '/python/yazyk-python/1-core/importy-i-moduli/' },
        { title: 'Как работает импорт', href: '/python/yazyk-python/1-core/importy-i-moduli/protsess-importa-i-bayt-kod' },
        { title: 'Абсолютные и относительные импорты', href: '/python/yazyk-python/1-core/importy-i-moduli/absolyutnye-i-otnositelnye-importy' },
    ]"
/>
