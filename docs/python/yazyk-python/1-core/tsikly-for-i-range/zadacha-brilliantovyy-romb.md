---
title: "Задача: бриллиантовый ромб"
description: "Практическая задача на построение ромба из звездочек с помощью циклов, range, условий, строк и функции abs."
tags:
  - "python"
  - "core"
  - "loops"
  - "practice"
updatedAt: "2026-11-07"
---
## Постановка задачи {#postanovka-zadachi}

Напиши функцию `diamond(n)`, которая возвращает строку с ромбом из символов `*`.

Требования:

- размер ромба задается числом `n`;
- `n` должно быть положительным нечетным числом;
- при четном или отрицательном `n` функция должна вернуть `None`;
- перед звездочками могут находиться ведущие пробелы;
- после звездочек пробелов быть не должно;
- каждая строка, включая последнюю, должна заканчиваться символом `\n`.

## Примеры {#primery}

Для `n = 3` функция должна построить:

```text
 *
***
 *
```

И вернуть строку:

```python
" *\n***\n *\n"
```

Для `n = 5`:

```text
  *
 ***
*****
 ***
  *
```

Функция должна вернуть:

```python
"  *\n ***\n*****\n ***\n  *\n"
```

Проверки некорректного размера:

```python
print(diamond(4))   # None
print(diamond(0))   # None
print(diamond(-3))  # None
```

## Заготовка {#zagotovka}

```python
def diamond(n):
    pass
```

## Темы задачи {#temy-zadachi}

Перед решением повтори следующие темы:

- [условия и логические выражения](/python/yazyk-python/1-core/boolean-i-usloviya);
- [циклы `for` и функция `range()`](/python/yazyk-python/1-core/tsikly-for-i-range/);
- [арифметические операторы `%` и `//`](/python/yazyk-python/1-core/arifmeticheskie-operatory);
- [функция `abs()`](/python/yazyk-python/1-core/osnovnye-funktsii#abs-modul-chisla);
- [умножение и объединение строк](/python/yazyk-python/tipy-dannykh/operatsii-so-strokami);
- [списки и метод `append()`](/python/yazyk-python/tipy-dannykh/spiski-bazovye-operatsii);
- [функции и `return`](/python/yazyk-python/1-core/funktsii-v-python).

Сначала попробуй решить задачу самостоятельно. Открывай решение только после того, как составишь свой алгоритм и напишешь хотя бы одну рабочую версию.

::: details Показать решение

```python
def diamond(n: int) -> str | None:
    if n <= 0 or n % 2 == 0:
        return None

    middle = n // 2
    lines = []

    for row in range(n):
        distance = abs(middle - row)
        spaces_count = distance
        stars_count = n - distance * 2

        line = " " * spaces_count + "*" * stars_count + "\n"
        lines.append(line)

    return "".join(lines)
```

### Разбор решения {#razbor-resheniya}

Сначала функция проверяет размер:

```python
if n <= 0 or n % 2 == 0:
    return None
```

Ромб можно построить только для положительного нечетного числа.

Индекс средней строки вычисляется через целочисленное деление:

```python
middle = n // 2
```

Для `n = 5` средняя строка имеет индекс `2`.

На каждой итерации вычисляется расстояние от текущей строки до середины:

```python
distance = abs(middle - row)
```

Для пяти строк получаются значения `2, 1, 0, 1, 2`. Это расстояние одновременно определяет количество пробелов перед звездочками.

При удалении от середины на одну строку количество звездочек уменьшается на две:

```python
stars_count = n - distance * 2
```

Для `n = 5` получаются `1, 3, 5, 3, 1` звездочек.

Готовые строки сохраняются в список, а после цикла объединяются:

```python
lines.append(line)
return "".join(lines)
```

`return` находится после цикла, поэтому функция сначала создает все строки ромба.

:::

## Что проверить после решения {#chto-proverit-posle-resheniya}

Проверь как минимум следующие случаи:

```python
print(diamond(1))
# *

print(diamond(3))
#  *
# ***
#  *

print(diamond(4))   # None
print(diamond(-1))  # None
```

Обрати внимание, что `print()` добавляет собственный перенос строки после уже сформированной строки. Поэтому после ромба в консоли может появиться дополнительная пустая строка.

<RelatedTopics
    :items="[
        { title: 'Документация: циклы for и range', href: '/python/yazyk-python/1-core/tsikly-for-i-range' },
        { title: 'Основные функции: abs', href: '/python/yazyk-python/1-core/osnovnye-funktsii#abs-modul-chisla' },
        { title: 'Операции со строками', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami' },
        { title: 'Boolean и условия', href: '/python/yazyk-python/1-core/boolean-i-usloviya' },
    ]"
/>
