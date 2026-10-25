---
title: "Неделя 14. Матрицы и Grid Traversal"
description: "Подробный разбор обхода матриц на Python: координаты, границы, DFS, BFS, компоненты, Flood Fill, острова и multi-source BFS."
tags:
  - "python"
  - "algorithms"
  - "matrix"
  - "grid-traversal"
  - "bfs"
updatedAt: "2026-10-19"
search: false
---
## Цель недели {#tsel-nedeli}

Научиться рассматривать матрицу как граф и обходить связанные клетки через DFS или BFS.

После недели нужно уметь:

- правильно работать с координатами строки и столбца;
- проверять границы матрицы;
- описывать переходы через массив направлений;
- использовать `visited` или изменять матрицу на месте;
- находить компоненты связности;
- выбирать DFS для исследования области;
- выбирать BFS для кратчайшего пути;
- запускать multi-source BFS из нескольких источников.

## Матрица как граф {#matritsa-kak-graf}

Рассмотрим матрицу:

```text
1 1 0
0 1 0
1 0 1
```

Каждая клетка может считаться вершиной графа. Ребро существует, если из одной клетки разрешено перейти в соседнюю.

При движении в четырех направлениях у клетки могут быть соседи:

- сверху;
- снизу;
- слева;
- справа.

Явный объект графа создавать не нужно. Соседи вычисляются из координат.

## Строки и столбцы {#stroki-i-stolbtsy}

К клетке обращаются так:

```python
value = grid[row][column]
```

Количество строк:

```python
rows = len(grid)
```

Количество столбцов:

```python
columns = len(grid[0])
```

Это корректно только после проверки, что матрица не пустая.

```python
if not grid or not grid[0]:
    return начальный_результат
```

## Проверка границ {#proverka-granits}

Координаты допустимы, если:

```python
0 <= row < rows and 0 <= column < columns
```

Сначала нужно проверить границы, и только затем читать `grid[row][column]`.

Ошибочный порядок:

```python
if grid[row][column] == 1 and 0 <= row < rows:
    ...
```

Если `row` вышел за границу, ошибка возникнет еще до проверки второй части.

## Направления движения {#napravleniya-dvizheniya}

Вместо четырех почти одинаковых блоков удобно хранить смещения:

```python
DIRECTIONS = (
    (1, 0),   # Вниз.
    (-1, 0),  # Вверх.
    (0, 1),   # Вправо.
    (0, -1),  # Влево.
)
```

Сосед вычисляется сложением координат:

```python
for row_offset, column_offset in DIRECTIONS:
    next_row = row + row_offset
    next_column = column + column_offset
```

Если разрешены диагонали, нужно добавить еще четыре смещения. Нельзя молча использовать диагонали, если условие разрешает только четыре направления.

## Что хранить в visited {#chto-khranit-v-visited}

Координату удобно представлять кортежем:

```python
visited: set[tuple[int, int]] = set()
visited.add((row, column))
```

Кортеж неизменяемый и может быть ключом множества. Список `[row, column]` использовать нельзя, потому что список не хешируется.

`visited` нужен, чтобы:

- не обрабатывать клетку повторно;
- не ходить бесконечно между двумя соседями;
- отличать уже найденные клетки от новых.

## Пример 1. Flood Fill через DFS {#primer-1-flood-fill-cherez-dfs}

Нужно перекрасить стартовую клетку и все связанные клетки исходного цвета.

```python
def flood_fill(
    image: list[list[int]],
    start_row: int,
    start_column: int,
    new_color: int,
) -> list[list[int]]:
    original_color = image[start_row][start_column]

    if original_color == new_color:
        # Без этой проверки перекрашенная клетка будет снова
        # восприниматься как подходящая, и обход зациклится.
        return image

    rows = len(image)
    columns = len(image[0])
    directions = ((1, 0), (-1, 0), (0, 1), (0, -1))

    def dfs(row: int, column: int) -> None:
        if not (0 <= row < rows and 0 <= column < columns):
            return

        if image[row][column] != original_color:
            return

        # Изменение цвета одновременно помечает клетку посещенной.
        image[row][column] = new_color

        for row_offset, column_offset in directions:
            dfs(row + row_offset, column + column_offset)

    dfs(start_row, start_column)
    return image
```

### Почему отдельный visited не нужен {#pochemu-otdelnyy-visited-ne-nuzhen}

После посещения цвет клетки меняется. Условие:

```python
image[row][column] != original_color
```

не пропустит ее второй раз. Входная матрица сама хранит состояние обхода.

Это экономит отдельное множество, но изменяет исходные данные. Если по условию вход менять нельзя, потребуется копия или `visited`.

### Сложность {#slozhnost}

В худшем случае обходятся все клетки:

- время: `O(rows * columns)`;
- стек: до `O(rows * columns)` для большой связной области.

Глубокий рекурсивный DFS в Python может вызвать `RecursionError`. Итеративный DFS или BFS безопаснее для больших матриц.

## Компоненты связности {#komponenty-svyaznosti}

Компонента связности — группа клеток, между которыми можно пройти по допустимым направлениям.

В задаче про острова:

- земля обозначена `"1"`;
- вода обозначена `"0"`;
- один остров — одна компонента клеток земли.

Идея подсчета:

1. Пройти все клетки матрицы.
2. Когда найдена непосещенная земля, увеличить счетчик.
3. Одним DFS отметить весь остров.
4. Продолжить общий проход.

## Пример 2. Количество островов {#primer-2-kolichestvo-ostrovov}

```python
def count_islands(grid: list[list[str]]) -> int:
    if not grid or not grid[0]:
        return 0

    rows = len(grid)
    columns = len(grid[0])
    islands = 0

    def sink_island(row: int, column: int) -> None:
        if not (0 <= row < rows and 0 <= column < columns):
            return

        if grid[row][column] != "1":
            return

        # Превращаем землю в воду, то есть помечаем посещенной.
        grid[row][column] = "0"

        sink_island(row + 1, column)
        sink_island(row - 1, column)
        sink_island(row, column + 1)
        sink_island(row, column - 1)

    for row in range(rows):
        for column in range(columns):
            if grid[row][column] != "1":
                continue

            # Новая непосещенная земля начинает новый остров.
            islands += 1
            sink_island(row, column)

    return islands
```

### Пошаговый разбор {#poshagovyy-razbor}

Для матрицы:

```text
1 1 0 0
1 0 0 1
0 0 1 1
```

Проход найдет:

1. Землю в `(0, 0)`, увеличит счетчик до `1` и затопит клетки `(0, 0)`, `(0, 1)`, `(1, 0)`.
2. Землю в `(1, 3)`, увеличит счетчик до `2` и затопит клетки `(1, 3)`, `(2, 3)`, `(2, 2)`.
3. Другой земли не останется.

Ответ равен `2`.

Каждая клетка проверяется постоянное количество раз:

- время: `O(rows * columns)`;
- память стека: до `O(rows * columns)`.

## Изменять вход или использовать visited {#izmenyat-vkhod-ili-ispolzovat-visited}

Изменение входа удобно, если:

- условие это разрешает;
- старое значение после обхода не нужно;
- новое значение однозначно означает «посещено».

Используй `visited`, если:

- матрица должна остаться прежней;
- значение клетки нельзя безопасно заменить;
- один вход участвует в нескольких независимых обходах.

Перед решением явно зафиксируй выбранный подход.

## DFS и BFS в матрице {#dfs-i-bfs-v-matritse}

DFS подходит для:

- покраски области;
- подсчета компонентов;
- вычисления площади компоненты;
- проверки достижимости.

BFS подходит для:

- минимального числа шагов;
- расстояний до ближайшего источника;
- распространения процесса по минутам или уровням;
- одновременного движения от нескольких источников.

Если каждый переход имеет одинаковую стоимость, первый приход BFS в клетку дает кратчайшее расстояние.

## Пример 3. Кратчайший путь в лабиринте {#primer-3-kratchayshiy-put-v-labirinte}

В матрице `0` означает свободную клетку, а `1` — стену.

```python
from collections import deque


def shortest_path(
    grid: list[list[int]],
    start: tuple[int, int],
    target: tuple[int, int],
) -> int:
    if not grid or not grid[0]:
        return -1

    rows = len(grid)
    columns = len(grid[0])
    directions = ((1, 0), (-1, 0), (0, 1), (0, -1))

    if start == target:
        return 0

    queue = deque([(start[0], start[1], 0)])
    visited = {start}

    while queue:
        row, column, distance = queue.popleft()

        for row_offset, column_offset in directions:
            next_row = row + row_offset
            next_column = column + column_offset
            next_position = (next_row, next_column)

            if not (0 <= next_row < rows and 0 <= next_column < columns):
                continue

            if grid[next_row][next_column] == 1:
                continue

            if next_position in visited:
                continue

            if next_position == target:
                return distance + 1

            # Отмечаем при добавлении, чтобы одна клетка
            # не попала в очередь несколько раз.
            visited.add(next_position)
            queue.append((next_row, next_column, distance + 1))

    return -1
```

### Почему visited обновляется при добавлении {#pochemu-visited-obnovlyaetsya-pri-dobavlenii}

К одной клетке могут вести несколько соседей текущего уровня. Если пометить ее только после извлечения, все эти соседи успеют добавить одинаковую клетку в очередь.

Отметка при добавлении гарантирует, что клетка попадет в очередь один раз.

## Multi-source BFS {#multi-source-bfs}

Иногда процесс одновременно начинается в нескольких клетках:

- огонь распространяется из нескольких очагов;
- нужно найти расстояние до ближайшего нуля;
- несколько гнилых апельсинов заражают соседние свежие.

Не нужно запускать отдельный BFS от каждого источника. Все источники добавляются в одну очередь с расстоянием `0`, после чего BFS распространяется общими слоями.

## Пример 4. Гниющие апельсины {#primer-4-gniyushchie-apelsiny}

Обозначения:

- `0` — пустая клетка;
- `1` — свежий апельсин;
- `2` — гнилой апельсин.

За одну минуту гниль переходит в соседние клетки.

```python
from collections import deque


def oranges_rotting(grid: list[list[int]]) -> int:
    if not grid or not grid[0]:
        return 0

    rows = len(grid)
    columns = len(grid[0])
    queue: deque[tuple[int, int]] = deque()
    fresh = 0

    for row in range(rows):
        for column in range(columns):
            if grid[row][column] == 2:
                # Все источники начинают распространяться одновременно.
                queue.append((row, column))
            elif grid[row][column] == 1:
                fresh += 1

    minutes = 0
    directions = ((1, 0), (-1, 0), (0, 1), (0, -1))

    while queue and fresh > 0:
        # В очереди сейчас находятся источники одной минуты.
        for _ in range(len(queue)):
            row, column = queue.popleft()

            for row_offset, column_offset in directions:
                next_row = row + row_offset
                next_column = column + column_offset

                if not (
                    0 <= next_row < rows
                    and 0 <= next_column < columns
                ):
                    continue

                if grid[next_row][next_column] != 1:
                    continue

                grid[next_row][next_column] = 2
                fresh -= 1
                queue.append((next_row, next_column))

        minutes += 1

    if fresh > 0:
        return -1

    return minutes
```

Счетчик `fresh` позволяет в конце понять, остались ли недостижимые апельсины. Без него пустая очередь не отличалась бы от успешного завершения.

- Время: `O(rows * columns)`.
- Память очереди: `O(rows * columns)` в худшем случае.

## Как хранить расстояние {#kak-khranit-rasstoyanie}

Есть два распространенных способа:

1. Класть расстояние вместе с координатой: `(row, column, distance)`.
2. Обрабатывать очередь по уровням и увеличивать общий счетчик после уровня.

Первый способ удобен для расстояния до конкретной точки. Второй — когда весь слой означает одну минуту или один шаг.

## Прямоугольные и квадратные матрицы {#pryamougolnye-i-kvadratnye-matritsy}

Нельзя предполагать, что количество строк равно количеству столбцов:

```python
rows = len(grid)
columns = len(grid[0])
```

Циклы должны использовать свои границы:

```python
for row in range(rows):
    for column in range(columns):
        ...
```

Ошибка `range(rows)` для обоих циклов останется незаметной на квадратных примерах и проявится на прямоугольной матрице.

## Частые ошибки {#chastye-oshibki}

1. Перепутать `row` и `column`.
2. Считать матрицу квадратной.
3. Прочитать клетку до проверки границ.
4. Забыть `visited` и получить цикл.
5. Пометить клетку посещенной только после извлечения из очереди.
6. Использовать DFS для кратчайшего пути без перебора всех вариантов.
7. Случайно изменить входную матрицу.
8. Учесть диагонали, когда они запрещены.
9. Запустить отдельный BFS от каждого источника вместо multi-source BFS.
10. Не проверить пустую матрицу перед `grid[0]`.

## План занятий {#plan-zanyatiy}

1. Выпиши координаты соседей центральной и угловой клетки.
2. Реализуй функцию проверки границ.
3. Разбери Flood Fill через DFS.
4. Посчитай острова с изменением матрицы.
5. Перепиши острова с отдельным `visited`.
6. Найди кратчайший путь через BFS.
7. Нарисуй уровни multi-source BFS.
8. Реализуй распространение процесса по минутам.

## Задачи для самостоятельного решения {#zadachi-dlya-samostoyatelnogo-resheniya}

### Задача 1. Максимальная площадь острова {#zadacha-1-maksimalnaya-ploshchad-ostrova}

Дана матрица из `0` и `1`. Верни максимальное количество клеток в одной связной компоненте единиц.

Требования:

- переходить только в четырех направлениях;
- не считать клетку дважды;
- вернуть `0`, если земли нет;
- объяснить сложность через общее количество клеток.

Подсказка: DFS может возвращать площадь компоненты как `1 +` площади доступных соседей.

### Задача 2. Pacific Atlantic Water Flow {#zadacha-2-pacific-atlantic-water-flow}

Дана матрица высот. Вода может течь из клетки в соседнюю клетку равной или меньшей высоты. Найди клетки, из которых вода может попасть к обоим океанам по краям матрицы.

Не запускай отдельный поиск из каждой клетки. Подумай о движении в обратную сторону:

- начни обход от границ каждого океана;
- двигайся к клеткам равной или большей высоты;
- найди пересечение двух множеств достижимости.

<RelatedTopics
    :items="[
        { title: 'Неделя 13. Binary Trees', href: '/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-13-binary-trees' },
        { title: 'Неделя 15. Graphs', href: '/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-15-graphs' },
        { title: 'Неделя 10. Queue', href: '/python/algoritmy/etap-3-lineynye-struktury/nedelya-10-queue-i-deque' },
    ]"
/>
