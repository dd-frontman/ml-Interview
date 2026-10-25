---
title: "Неделя 20. Dynamic Programming II"
description: "Подробный разбор двумерного DP на Python: Grid DP, LCS, 0/1 Knapsack, Partition Equal Subset Sum, LIS и оптимизация памяти."
tags:
  - "python"
  - "algorithms"
  - "dynamic-programming"
  - "knapsack"
  - "lcs"
updatedAt: "2026-10-19"
search: false
---
## Цель недели {#tsel-nedeli}

Научиться строить состояния с двумя параметрами, правильно выбирать порядок заполнения таблицы и сокращать память только после получения понятного решения.

После недели нужно уметь:

- объяснить смысл `dp[row][column]`;
- задавать границы таблицы дополнительной строкой или столбцом;
- решать Grid DP;
- применять выбор «взять или пропустить»;
- понимать паттерн 0/1 Knapsack;
- находить Longest Common Subsequence;
- восстанавливать один вариант ответа из таблицы;
- сжимать таблицу до двух или одной строки;
- объяснять, почему направление обновления влияет на результат.

## Когда нужно двумерное состояние {#kogda-nuzhno-dvumernoe-sostoyanie}

Одного индекса недостаточно, если подзадача определяется двумя независимыми параметрами:

- координатами `row` и `column`;
- позициями в двух строках;
- количеством рассмотренных предметов и доступной вместимостью;
- левой и правой границей;
- индексом и текущей суммой.

Пример точного определения:

```text
dp[row][column] — минимальная стоимость пути
от начала до клетки (row, column)
```

Оба индекса должны быть частью смысла, а не просто размерами массива.

## Сначала полная таблица {#snachala-polnaya-tablitsa}

Полная таблица полезна, потому что в ней видно:

- какие состояния существуют;
- откуда приходит переход;
- какие границы нужно заполнить;
- где находится ответ;
- какие значения можно использовать для восстановления пути.

Оптимизация памяти до одной строки скрывает часть зависимостей. Ее нужно делать после того, как полная версия работает и понятна.

## Пример 1. Unique Paths {#primer-1-unique-paths}

Робот начинает в левом верхнем углу и может двигаться только вправо или вниз. Нужно посчитать пути до правого нижнего угла.

Состояние:

```text
dp[row][column] — количество путей до этой клетки
```

В клетку можно прийти:

- сверху;
- слева.

Переход:

```text
dp[row][column] = dp[row - 1][column] + dp[row][column - 1]
```

```python
def unique_paths(rows: int, columns: int) -> int:
    if rows <= 0 or columns <= 0:
        return 0

    dp = [
        [0] * columns
        for _ in range(rows)
    ]

    # До любой клетки верхней строки ведет один путь: только вправо.
    for column in range(columns):
        dp[0][column] = 1

    # До любой клетки первого столбца ведет один путь: только вниз.
    for row in range(rows):
        dp[row][0] = 1

    for row in range(1, rows):
        for column in range(1, columns):
            from_top = dp[row - 1][column]
            from_left = dp[row][column - 1]
            dp[row][column] = from_top + from_left

    return dp[-1][-1]
```

### Таблица для 3 x 4 {#tablitsa-dlya-3-x-4}

```text
1  1  1  1
1  2  3  4
1  3  6 10
```

Ответ равен `10`.

- Время: `O(rows * columns)`.
- Память: `O(rows * columns)`.

## Оптимизация Unique Paths до одной строки {#optimizatsiya-unique-paths-do-odnoy-stroki}

Текущая клетка зависит только от:

- старого значения в этом столбце — пути сверху;
- уже обновленного значения слева — пути слева.

```python
def unique_paths_optimized(rows: int, columns: int) -> int:
    if rows <= 0 or columns <= 0:
        return 0

    paths = [1] * columns

    for _ in range(1, rows):
        for column in range(1, columns):
            paths[column] += paths[column - 1]

    return paths[-1]
```

Память стала `O(columns)`.

Чтобы использовать меньшую размерность, можно при необходимости поменять местами `rows` и `columns`, добившись памяти `O(min(rows, columns))`.

## Пример 2. Minimum Path Sum {#primer-2-minimum-path-sum}

В каждой клетке находится стоимость. Разрешено двигаться вправо или вниз. Нужно минимизировать общую сумму.

Состояние:

```text
dp[row][column] — минимальная стоимость дойти до клетки
```

```python
def min_path_sum(grid: list[list[int]]) -> int:
    if not grid or not grid[0]:
        return 0

    rows = len(grid)
    columns = len(grid[0])
    dp = [
        [0] * columns
        for _ in range(rows)
    ]

    dp[0][0] = grid[0][0]

    for column in range(1, columns):
        dp[0][column] = dp[0][column - 1] + grid[0][column]

    for row in range(1, rows):
        dp[row][0] = dp[row - 1][0] + grid[row][0]

    for row in range(1, rows):
        for column in range(1, columns):
            dp[row][column] = grid[row][column] + min(
                dp[row - 1][column],
                dp[row][column - 1],
            )

    return dp[-1][-1]
```

В отличие от Unique Paths, границы не заполняются единицами. Их значение зависит от сумм исходной матрицы.

## Дополнительная нулевая граница {#dopolnitelnaya-nulevaya-granitsa}

Иногда таблицу удобно сделать на одну строку и столбец больше. Это убирает часть проверок внутри перехода.

Но нейтральное значение нужно выбирать осторожно:

- для суммы путей границей может быть `0`;
- для минимума неверный `0` будет выглядеть как бесплатный путь;
- для недостижимого минимума часто требуется `inf`.

Дополнительная граница упрощает код только при правильно выбранной семантике.

## Пример 3. Longest Common Subsequence {#primer-3-longest-common-subsequence}

Подпоследовательность сохраняет порядок символов, но не обязана быть непрерывной.

Для строк `"abcde"` и `"ace"` общая подпоследовательность `"ace"` имеет длину `3`.

Состояние:

```text
dp[i][j] — длина LCS для первых i символов first
и первых j символов second
```

Если последние символы совпадают, они продолжают общий ответ:

```text
dp[i][j] = dp[i - 1][j - 1] + 1
```

Если не совпадают, один из них нужно пропустить:

```text
dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
```

```python
def longest_common_subsequence(first: str, second: str) -> int:
    rows = len(first) + 1
    columns = len(second) + 1
    dp = [
        [0] * columns
        for _ in range(rows)
    ]

    for first_length in range(1, rows):
        for second_length in range(1, columns):
            first_character = first[first_length - 1]
            second_character = second[second_length - 1]

            if first_character == second_character:
                dp[first_length][second_length] = (
                    dp[first_length - 1][second_length - 1] + 1
                )
            else:
                dp[first_length][second_length] = max(
                    dp[first_length - 1][second_length],
                    dp[first_length][second_length - 1],
                )

    return dp[-1][-1]
```

### Почему таблица больше строк {#pochemu-tablitsa-bolshe-strok}

Строка `0` означает пустой префикс `first`, столбец `0` — пустой префикс `second`.

Общая подпоследовательность с пустой строкой имеет длину `0`. Благодаря дополнительной границе переход не требует отдельных проверок `i - 1` и `j - 1`.

### Сложность {#slozhnost}

Если длины строк `n` и `m`:

- время: `O(n * m)`;
- память: `O(n * m)`.

## Восстановление LCS {#vosstanovlenie-lcs}

Таблица хранит не только длину. По ней можно восстановить одну подпоследовательность.

```python
def restore_lcs(
    first: str,
    second: str,
    dp: list[list[int]],
) -> str:
    first_length = len(first)
    second_length = len(second)
    characters: list[str] = []

    while first_length > 0 and second_length > 0:
        if first[first_length - 1] == second[second_length - 1]:
            characters.append(first[first_length - 1])
            first_length -= 1
            second_length -= 1
        elif dp[first_length - 1][second_length] >= dp[first_length][second_length - 1]:
            first_length -= 1
        else:
            second_length -= 1

    characters.reverse()
    return "".join(characters)
```

Движение начинается от ответа и идет к базовому состоянию. Символы находятся в обратном порядке, поэтому в конце список разворачивается.

При равных вариантах может существовать несколько правильных LCS. Условие `>=` выбирает один из них.

## Оптимизация LCS до двух строк {#optimizatsiya-lcs-do-dvukh-strok}

Текущая строка зависит только от предыдущей и уже заполненной части текущей.

```python
def lcs_optimized(first: str, second: str) -> int:
    if len(second) > len(first):
        first, second = second, first

    previous = [0] * (len(second) + 1)

    for first_character in first:
        current = [0] * (len(second) + 1)

        for second_index, second_character in enumerate(second, start=1):
            if first_character == second_character:
                current[second_index] = previous[second_index - 1] + 1
            else:
                current[second_index] = max(
                    previous[second_index],
                    current[second_index - 1],
                )

        previous = current

    return previous[-1]
```

- Время остается `O(n * m)`.
- Память становится `O(min(n, m))`.

Цена оптимизации: по двум строкам уже нельзя напрямую восстановить подпоследовательность. Если нужен сам путь, полная таблица может быть оправдана.

## Паттерн 0/1 Knapsack {#pattern-0-1-knapsack}

Есть предметы, каждый можно:

- взять один раз;
- пропустить.

Состояние часто содержит:

- сколько предметов рассмотрено;
- какая вместимость или сумма доступна.

Название `0/1` означает, что предмет берется `0` или `1` раз.

## Пример 4. Partition Equal Subset Sum {#primer-4-partition-equal-subset-sum}

Нужно определить, можно ли разделить список положительных чисел на две части с одинаковой суммой.

Если общая сумма нечетная, решение невозможно.

Иначе нужно набрать подмножество с суммой:

```text
target = total_sum // 2
```

Состояние:

```text
dp[current_sum] — можно ли получить эту сумму
из уже рассмотренных чисел
```

```python
def can_partition(numbers: list[int]) -> bool:
    total = sum(numbers)

    if total % 2 != 0:
        return False

    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True

    for number in numbers:
        # Идем справа налево, чтобы number не использовался
        # повторно в рамках одной итерации.
        for current_sum in range(target, number - 1, -1):
            dp[current_sum] = (
                dp[current_sum]
                or dp[current_sum - number]
            )

    return dp[target]
```

## Почему сумма обновляется справа налево {#pochemu-summa-obnovlyaetsya-sprava-nalevo}

Пусть обрабатывается число `3`.

Если идти слева направо, после обновления `dp[3]` эта же итерация сможет использовать новое значение для `dp[6]`. Получится, будто число `3` доступно дважды.

Движение справа налево читает состояния предыдущей итерации до их изменения текущим числом.

Это критическая часть корректности 0/1 Knapsack.

## 0/1 и неограниченный Knapsack {#0-1-i-neogranichennyy-knapsack}

| Условие | Направление одномерного обновления |
| --- | --- |
| Предмет можно взять один раз | Справа налево |
| Предмет можно брать многократно | Слева направо |

Направление определяет, разрешено ли использовать только что обновленное состояние повторно.

## Пример 5. Longest Increasing Subsequence {#primer-5-longest-increasing-subsequence}

Нужно найти длину самой длинной строго возрастающей подпоследовательности.

Состояние:

```text
dp[i] — длина лучшей возрастающей подпоследовательности,
которая обязана заканчиваться на индексе i
```

```python
def longest_increasing_subsequence(numbers: list[int]) -> int:
    if not numbers:
        return 0

    dp = [1] * len(numbers)

    for right in range(len(numbers)):
        for left in range(right):
            if numbers[left] < numbers[right]:
                dp[right] = max(
                    dp[right],
                    dp[left] + 1,
                )

    return max(dp)
```

### Почему возвращается max(dp) {#pochemu-vozvrashchaetsya-max-dp}

`dp[i]` обязан заканчиваться на `i`. Лучшая подпоследовательность не обязана заканчиваться на последнем элементе массива.

Поэтому ответ — максимум среди всех состояний, а не `dp[-1]`.

- Время: `O(n²)`.
- Память: `O(n)`.

Существует решение `O(n log n)` через бинарный поиск, но сначала важно понять DP-состояние.

## Подстрока и подпоследовательность {#podstroka-i-podposledovatelnost}

**Подстрока** или подмассив непрерывны.

**Подпоследовательность** сохраняет порядок, но разрешает пропуски.

LCS и LIS работают с подпоследовательностями. Ошибка в этом определении полностью меняет переход.

## Порядок заполнения таблицы {#poryadok-zapolneniya-tablitsy}

Определи зависимости до выбора циклов.

Если `dp[row][column]` зависит от:

- верхней клетки — строки идут сверху вниз;
- левой клетки — столбцы идут слева направо;
- правой нижней части — циклы могут идти в обратном порядке;
- предыдущего слоя предметов — нужно не перезаписать его слишком рано.

Правильный порядок гарантирует, что все зависимости уже вычислены и относятся к нужной итерации.

## Как оптимизировать память {#kak-optimizirovat-pamyat}

Проверь последовательно:

1. От каких строк зависит текущая строка?
2. Нужна ли вся предыдущая строка?
3. Можно ли обновлять одну строку на месте?
4. В каком направлении ее обновлять?
5. Не требуется ли потом восстановить путь?

Оптимизация меняет не только размер массива, но иногда и семантику чтения старых и новых значений.

## Частые ошибки {#chastye-oshibki}

1. Не определить оба параметра состояния.
2. Перепутать индексы строки и длины префикса.
3. Неверно заполнить первую строку или столбец.
4. Использовать ноль как недостижимый минимум.
5. Обновлять 0/1 Knapsack слева направо.
6. Вернуть `dp[-1]` в LIS вместо `max(dp)`.
7. Перепутать подстроку и подпоследовательность.
8. Оптимизировать память до проверки полной таблицы.
9. Удалить таблицу, хотя требуется восстановление ответа.
10. Считать двумерное DP автоматически `O(n²)`, не называя обе размерности.

## План занятий {#plan-zanyatiy}

1. Нарисуй таблицу Unique Paths размером `3 x 4`.
2. Оптимизируй ее до одной строки и подпиши старые значения.
3. Заполни границы Minimum Path Sum.
4. Построй таблицу LCS для двух коротких строк.
5. Восстанови одну подпоследовательность обратным проходом.
6. Реши Partition Equal Subset Sum полной таблицей.
7. Сожми ее до одной строки справа налево.
8. Проследи LIS и объясни смысл каждой ячейки.

## Задачи для самостоятельного решения {#zadachi-dlya-samostoyatelnogo-resheniya}

### Задача 1. Edit Distance {#zadacha-1-edit-distance}

Даны строки `first` и `second`. За одну операцию можно:

- вставить символ;
- удалить символ;
- заменить символ.

Найди минимальное число операций для превращения первой строки во вторую.

Определи:

```text
dp[i][j] — минимальное число операций
для первых i и j символов
```

Отдельно разбери переходы для совпадающих и несовпадающих последних символов.

### Задача 2. Coin Change II {#zadacha-2-coin-change-ii}

Даны номиналы монет и сумма. Нужно посчитать количество комбинаций, а не перестановок. Каждую монету можно использовать многократно.

Подумай:

- почему внешний цикл должен идти по монетам;
- почему сумма обновляется слева направо;
- почему `[1, 2]` и `[2, 1]` не должны считаться разными ответами;
- чему равен `dp[0]`.

<RelatedTopics
    :items="[
        { title: 'Неделя 19. DP I', href: '/python/algoritmy/etap-5-greedy-dp/nedelya-19-dynamic-programming-i' },
        { title: 'Неделя 14. Grid', href: '/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-14-matritsy-i-grid-traversal' },
        { title: 'Неделя 21. Advanced', href: '/python/algoritmy/etap-5-greedy-dp/nedelya-21-prodvinutyy-trek' },
    ]"
/>
