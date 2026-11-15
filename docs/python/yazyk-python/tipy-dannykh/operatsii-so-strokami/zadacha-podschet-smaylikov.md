---
title: "Задача: подсчет смайликов"
description: "Практическая задача на строки, индексы, условия и цикл for: подсчет смайликов с допустимыми глазами, носом и ртом."
tags:
  - "python"
  - "strings"
  - "loops"
  - "practice"
updatedAt: "2026-11-08"
---
## Постановка задачи {#postanovka-zadachi}

Напиши функцию `count_smileys(arr)`, которая принимает список строк и возвращает количество правильных улыбающихся лиц.

Правильный смайлик состоит из следующих частей:

- глаза: `:` или `;`;
- необязательный нос: `-` или `~`;
- рот: `)` или `D`.

Порядок символов всегда одинаковый: глаза, затем необязательный нос, затем рот. Других символов быть не должно.

Правильные смайлики:

```text
:)  :D  ;-D  :~)
```

Неправильные смайлики:

```text
;(  :>  :}  :]
```

Для пустого списка функция должна вернуть `0`.

## Примеры {#primery}

```python
print(count_smileys([":)", ";(", ";}", ":-D"]))  # 2
print(count_smileys([";D", ":-(", ":-)", ";~)"]))  # 3
print(count_smileys([]))  # 0
```

## Заготовка {#zagotovka}

```python
def count_smileys(arr):
    pass
```

## Темы задачи {#temy-zadachi}

Перед решением повтори следующие темы:

- [индексы строк](/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/indeksy-srezy-i-poisk#indeksy);
- [длина строки и `len()`](/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/sozdanie-i-bazovye-operatsii#dlina-stroki-len);
- [операторы `in` и `not in`](/python/yazyk-python/tipy-dannykh/operatsii-so-strokami/indeksy-srezy-i-poisk#vkhozhdenie-stroki-v-stroku);
- [условия и логический оператор `and`](/python/yazyk-python/1-core/boolean-i-usloviya);
- [цикл `for`](/python/yazyk-python/1-core/tsikly-for-i-range/);
- [функции и `return`](/python/yazyk-python/1-core/funktsii-v-python/).

## Подсказки {#podskazki}

1. Создай счетчик и перебирай все строки из списка.
2. Смайлик без носа содержит два символа, а с носом - три.
3. Для строки длиной `2` проверь глаза по индексу `0`, а рот - по индексу `1`.
4. Для строки длиной `3` нос находится по индексу `1`, а рот - по индексу `2`.
5. Увеличивай счетчик, только когда все проверки для текущей строки дают `True`.

Сначала попробуй написать решение самостоятельно. Открывай готовый вариант после того, как проверишь свою функцию хотя бы на трех примерах.

::: details Показать решение

```python
def count_smileys(arr: list[str]) -> int:
    count = 0
    eyes = ":;"
    noses = "-~"
    mouths = ")D"

    for face in arr:
        if len(face) == 2:
            if face[0] in eyes and face[1] in mouths:
                count += 1
        elif len(face) == 3:
            if (
                face[0] in eyes
                and face[1] in noses
                and face[2] in mouths
            ):
                count += 1

    return count
```

### Разбор решения {#razbor-resheniya}

Строки с допустимыми символами используются как небольшие наборы вариантов:

```python
eyes = ":;"
noses = "-~"
mouths = ")D"
```

Выражение `face[0] in eyes` проверяет, является ли первый символ строки двоеточием или точкой с запятой.

Для смайлика без носа известны две позиции:

```text
:)
|+- face[1]: рот
+-- face[0]: глаза
```

Для смайлика с носом проверяются три позиции:

```text
;~D
||+- face[2]: рот
|+-- face[1]: нос
+--- face[0]: глаза
```

Оператор `and` требует, чтобы правильными были сразу все части. Если хотя бы одна проверка вернет `False`, счетчик не увеличится.

Пустой список не требует отдельной проверки. Цикл не выполнится ни разу, и функция вернет начальное значение `count`, равное `0`.

:::

## Типичные ошибки {#tipichnye-oshibki}

### Проверять всю строку вместо одного символа {#proveryat-vsyu-stroku-vmesto-odnogo-simvola}

```python
if face in eyes:
    ...
```

Так Python проверяет, содержится ли вся строка `face`, например `":)"`, внутри строки `":;"`. Для глаз нужно проверять только первый символ: `face[0] in eyes`.

### Завершать функцию на первом неправильном лице {#zavershat-funktsiyu-na-pervom-nepravilnom-litse}

```python
else:
    return 0
```

Такой `return` остановит весь подсчет. Неправильную строку нужно пропустить и продолжить проверку остальных элементов списка.

### Обращаться к индексу до проверки длины {#obrashchatsya-k-indeksu-do-proverki-dliny}

Если сначала выполнить `face[2]`, а строка содержит только два символа, возникнет `IndexError`. Поэтому сначала проверяется `len(face)`, а затем используются допустимые для этой длины индексы.

## Краткое повторение {#kratkoe-povtorenie}

- длина определяет, есть ли у смайлика нос;
- индексы позволяют проверить каждую часть на известной позиции;
- оператор `in` проверяет принадлежность символа допустимому набору;
- оператор `and` объединяет несколько обязательных условий;
- счетчик увеличивается только для полностью правильного смайлика.

<RelatedTopics
    :items="[
        { title: 'Операции со строками', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami' },
        { title: 'Индексы и срезы', href: '/python/yazyk-python/tipy-dannykh/indeksy-i-srezy' },
        { title: 'Boolean и условия', href: '/python/yazyk-python/1-core/boolean-i-usloviya' },
        { title: 'Циклы for и range', href: '/python/yazyk-python/1-core/tsikly-for-i-range' },
    ]"
/>
