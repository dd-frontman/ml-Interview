---
title: "Индексы, срезы и поиск в строках"
description: "Обращение к символам строки по индексу, срезы, разворот и поиск подстрок через in, find, index и count."
tags:
  - "python"
  - "core"
  - "data-types"
  - "str"
  - "slices"
updatedAt: "2026-11-14"
---
## Зачем нужны индексы и поиск {#zachem-nuzhny-indeksy-i-poisk}

Строка является последовательностью символов. Поэтому можно получить отдельный символ, извлечь часть текста или проверить наличие подстроки.

```python
filename = "report.csv"

print(filename[0])          # r
print(filename[-3:])        # csv
print(".csv" in filename)   # True
```

## Индексы {#indeksy}

Индекс - это позиция символа. Нумерация начинается с `0`:

```python
word = "python"

print(word[0])  # p
print(word[1])  # y
```

Отрицательные индексы отсчитываются с конца:

```python
word = "python"

print(word[-1])  # n
print(word[-2])  # o
```

Если индекс выходит за границы строки, Python вызывает `IndexError`:

```python
word = "python"

# print(word[10])
# IndexError: string index out of range
```

## Срезы {#srezy}

Срез возвращает часть строки. Общая форма:

```python
text[start:stop:step]
```

- `start` - индекс начала;
- `stop` - граница, которая не включается;
- `step` - шаг движения.

```python
word = "python"

print(word[0:2])  # py
print(word[2:6])  # thon
```

Начальную или конечную границу можно пропустить:

```python
word = "python"

print(word[:2])   # py
print(word[2:])   # thon
print(word[:-1])  # pytho
```

В отличие от обычного индекса, выход границы среза за длину строки не вызывает ошибку:

```python
word = "python"

print(word[:100])  # python
```

## Шаг и разворот строки {#shag-i-razvorot-stroki}

Третий параметр среза задаёт шаг:

```python
word = "python"

print(word[::2])   # pto
print(word[::-1])  # nohtyp
```

Срез `[::-1]` начинает с конца и двигается с шагом `-1`, поэтому символы располагаются в обратном порядке.

## Вхождение строки в строку {#vkhozhdenie-stroki-v-stroku}

Оператор `in` проверяет, есть ли одна строка внутри другой, и возвращает `True` или `False`:

```python
email = "alice@example.com"

print("@" in email)      # True
print("admin" in email)  # False
```

Для отрицательной проверки используют `not in`:

```python
email = "alice.example.com"

if "@" not in email:
    print("invalid email")  # invalid email
```

Проверка чувствительна к регистру:

```python
text = "Python"

print("Py" in text)  # True
print("py" in text)  # False
```

Если регистр не важен, сначала приведи обе строки к одному регистру:

```python
text = "Python"
query = "py"

print(query.lower() in text.lower())  # True
```

## Поиск через `find()` {#poisk-cherez-find}

`find()` возвращает индекс первого вхождения или `-1`, если подстрока не найдена:

```python
text = "python,ml,sql"

print(text.find("ml"))      # 7
print(text.find("pandas"))  # -1
```

Для простой проверки наличия обычно понятнее использовать `in`. Значение `0`, возвращённое `find()` для начала строки, считается ложным в условии и может привести к ошибке:

```python
text = "python"

print(text.find("python"))  # 0
print("python" in text)     # True
```

## Поиск через `index()` {#poisk-cherez-index}

`index()` также возвращает позицию первого вхождения, но вызывает `ValueError`, если подстроки нет:

```python
text = "python,ml,sql"

print(text.index("ml"))  # 7

# print(text.index("pandas"))
# ValueError: substring not found
```

Используй `index()`, когда отсутствие подстроки действительно должно считаться ошибкой.

## Подсчёт через `count()` {#podschyot-cherez-count}

`count()` возвращает количество непересекающихся вхождений:

```python
text = "python python sql"

print(text.count("python"))  # 2
print("aaaa".count("aa"))    # 2
```

Метод чувствителен к регистру. Для поиска без учёта регистра сначала нормализуй строку:

```python
text = "Python python"

print(text.lower().count("python"))  # 2
```

## Что выбрать {#chto-vybrat}

| Задача | Инструмент |
| --- | --- |
| Получить один символ | `text[index]` |
| Получить часть строки | `text[start:stop]` |
| Проверить наличие | `substring in text` |
| Проверить отсутствие | `substring not in text` |
| Получить позицию или `-1` | `text.find(substring)` |
| Получить позицию или ошибку | `text.index(substring)` |
| Посчитать вхождения | `text.count(substring)` |

## Типичные ошибки {#tipichnye-oshibki}

1. Забывать, что индексы начинаются с `0`.
2. Считать правую границу среза включённой.
3. Обращаться к отсутствующему индексу без проверки длины.
4. Использовать `find()` как готовое логическое значение.
5. Забывать, что поиск чувствителен к регистру.

## Задачи для практики {#zadachi-dlya-praktiki}

1. Получи из строки `"machine learning"` слово `"learning"` с помощью среза.
2. Проверь, заканчивается ли имя файла строкой `".csv"`, сначала используя срез, а затем метод `endswith()`.
3. Посчитай количество вхождений слова `"python"` без учёта регистра.

<RelatedTopics
    :items="[
        { title: 'Создание и базовые операции', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/sozdanie-i-bazovye-operatsii' },
        { title: 'Методы строк', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/metody-strok' },
        { title: 'Задача: подсчёт смайликов', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/zadacha-podschet-smaylikov' },
    ]"
/>
