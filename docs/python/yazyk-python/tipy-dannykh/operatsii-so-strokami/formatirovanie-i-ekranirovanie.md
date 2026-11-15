---
title: "Форматирование и экранирование строк"
description: "Подстановка значений через f-строки, format и процентное форматирование, спецификаторы формата, экранирование и raw-строки."
tags:
  - "python"
  - "core"
  - "data-types"
  - "str"
  - "formatting"
updatedAt: "2026-11-14"
---
## Зачем форматировать строки {#zachem-formatirovat-stroki}

Форматирование позволяет собрать текст из постоянной части и значений переменных:

```python
name = "Alice"
score = 0.91
message = f"{name}: {score}"

print(message)  # Alice: 0.91
```

В Python встречаются три основных способа:

1. f-строки - основной вариант для нового кода;
2. метод `format()` - часто встречается в существующем коде и шаблонах;
3. `%`-форматирование - старый синтаксис, который всё ещё используется в некоторых проектах.

## F-строки {#f-stroki}

Перед открывающей кавычкой ставится буква `f`, а значения записываются внутри `{}`:

```python
name = "Alice"
score = 0.91

print(f"{name}: {score}")  # Alice: 0.91
```

Внутри фигурных скобок можно писать выражения:

```python
price = 100
discount = 0.2

print(f"final price: {price * (1 - discount)}")  # final price: 80.0
```

F-строка вычисляется в момент выполнения. Если значение переменной изменится, нужно создать строку заново:

```python
name = "Alice"
message = f"Hello, {name}"
name = "Bob"

print(message)  # Hello, Alice
```

## Спецификаторы формата {#spetsifikatory-formata}

После двоеточия внутри `{}` можно управлять отображением значения. Например, `.2f` оставляет два знака после точки:

```python
score = 0.91234

print(f"score: {score:.2f}")  # score: 0.91
```

Несколько распространённых вариантов:

```python
value = 1234.567
ratio = 0.875

print(f"{value:.1f}")   # 1234.6
print(f"{ratio:.1%}")   # 87.5%
print(f"{42:05d}")      # 00042
```

Форматирование меняет только представление. Значения `value`, `ratio` и `42` остаются числами.

## Метод `format()` {#metod-format}

Метод `format()` подставляет значения в фигурные скобки:

```python
name = "Alice"
score = 0.91
message = "{}: {}".format(name, score)

print(message)  # Alice: 0.91
```

Значения можно подставлять по порядку:

```python
template = "{} learns {}"

print(template.format("Alice", "Python"))  # Alice learns Python
```

Можно явно указывать номера позиций:

```python
template = "{1} after {0}"

print(template.format("first", "second"))  # second after first
```

`{0}` означает первый аргумент `format()`, а `{1}` - второй. Один номер разрешено использовать несколько раз:

```python
print("{0} + {0} = {1}".format(2, 4))  # 2 + 2 = 4
```

Можно использовать именованные значения:

```python
template = "{name}: {score}"

print(template.format(name="Alice", score=0.91))  # Alice: 0.91
```

Спецификаторы чисел работают так же, как в f-строках:

```python
score = 0.91234

print("score: {:.2f}".format(score))  # score: 0.91
```

## Ошибки при использовании `format()` {#oshibki-pri-ispolzovanii-format}

Нельзя смешивать автоматическую и ручную нумерацию:

```python
# print("{} + {0}".format(2))
# ValueError: cannot switch from automatic field numbering to manual field specification
```

Если значений меньше, чем полей, возникнет `IndexError`:

```python
# print("{} {}".format("Alice"))
# IndexError: Replacement index 1 out of range
```

Для вывода обычных фигурных скобок их удваивают:

```python
print("{{value}} = {}".format(42))  # {value} = 42
```

Практическое правило: используй f-строки в новом коде. Метод `format()` полезно знать для чтения существующего кода и работы с отдельно хранящимися шаблонами.

## Форматирование через `%` {#formatirovanie-cherez}

`%` - старый способ форматирования, похожий на `printf` из других языков:

```python
name = "Alice"
score = 0.91
message = "%s: %.2f" % (name, score)

print(message)  # Alice: 0.91
```

Частые плейсхолдеры:

| Плейсхолдер | Значение |
| --- | --- |
| `%s` | строковое представление |
| `%d` | целое число |
| `%f` | число с плавающей точкой |
| `%.2f` | число с двумя знаками после точки |

```python
name = "Alice"
age = 20
score = 0.91234

print("name=%s age=%d score=%.2f" % (name, age, score))
# name=Alice age=20 score=0.91
```

Для одного значения скобки не обязательны:

```python
print("Hello, %s" % "Alice")  # Hello, Alice
```

Для нескольких значений справа нужен кортеж:

```python
print("%s scored %.1f" % ("Alice", 0.9))  # Alice scored 0.9
```

Чтобы вывести сам знак `%`, напиши `%%`:

```python
progress = 80

print("progress: %d%%" % progress)  # progress: 80%
```

`%`-форматирование нужно уметь читать, но для нового обычного кода лучше выбирать f-строки.

## Экранирование {#ekranirovanie}

Обратный слеш `\` начинает специальную последовательность:

| Запись | Значение |
| --- | --- |
| `\n` | перенос строки |
| `\t` | табуляция |
| `\"` | двойная кавычка внутри строки |
| `\'` | одинарная кавычка внутри строки |
| `\\` | обратный слеш |

```python
text = "first line\nsecond line"

print(text)
# first line
# second line
```

```python
text = "name:\tAlice"

print(text)  # name:   Alice
```

## Raw-строки {#raw-stroki}

Префикс `r` отключает обычную обработку большинства escape-последовательностей. Это удобно для Windows-путей и регулярных выражений:

```python
path = r"C:\Users\Alice\data.csv"

print(path)  # C:\Users\Alice\data.csv
```

Raw-строка не может заканчиваться одиночным обратным слешем, потому что он экранирует закрывающую кавычку.

## Что выбрать {#chto-vybrat}

| Ситуация | Подход |
| --- | --- |
| Новый прикладной код | f-строка |
| Шаблон хранится отдельно | `format()` |
| Чтение старого кода или специальное логирование | `%`-форматирование |
| Путь или регулярное выражение с обратными слешами | raw-строка |

## Задачи для практики {#zadachi-dlya-praktiki}

1. Выведи цену `1234.567` с двумя знаками после точки через f-строку.
2. Создай шаблон `"{name} изучает {language}"` и подставь значения через `format()`.
3. Запиши строку из двух строк текста, разделённых `\n`, и проверь результат через `print()`.

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python: Formatted string literals', href: 'https://docs.python.org/3/reference/lexical_analysis.html#f-strings' },
        { title: 'Python: Format string syntax', href: 'https://docs.python.org/3/library/string.html#format-string-syntax' },
        { title: 'Python: printf-style string formatting', href: 'https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting' },
        { title: 'Python: Escape sequences', href: 'https://docs.python.org/3/reference/lexical_analysis.html#escape-sequences' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Создание и базовые операции', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/sozdanie-i-bazovye-operatsii' },
        { title: 'Методы строк', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/metody-strok' },
        { title: 'Практика и ошибки', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/praktika-i-oshibki' },
    ]"
/>
