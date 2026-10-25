---
title: "Неделя 15. Graphs"
description: "Подробный разбор графов на Python: список смежности, DFS, BFS, компоненты связности, циклы, топологическая сортировка и сложность."
tags:
  - "python"
  - "algorithms"
  - "graphs"
  - "dfs"
  - "topological-sort"
updatedAt: "2026-10-19"
search: false
---
## Цель недели {#tsel-nedeli}

Научиться представлять произвольные связи между объектами и выбирать обход в зависимости от вопроса задачи.

После недели нужно уметь:

- различать ориентированный и неориентированный граф;
- строить список смежности из списка ребер;
- выполнять DFS и BFS;
- находить путь и компоненты связности;
- не зацикливаться на повторно посещенных вершинах;
- обнаруживать цикл в неориентированном графе;
- использовать три состояния для ориентированного графа;
- понимать идею топологической сортировки;
- объяснять сложность `O(V + E)`.

## Что такое граф {#chto-takoe-graf}

Граф состоит из:

- **вершин** — объектов;
- **ребер** — связей между объектами.

Примеры графов:

- пользователи и дружеские связи;
- города и дороги;
- учебные курсы и зависимости;
- веб-страницы и ссылки;
- серверы и сетевые соединения.

Граф не обязан иметь корень и не обязан быть связным. У вершины может быть любое количество соседей.

## Ориентированный и неориентированный граф {#orientirovannyy-i-neorientirovannyy-graf}

В неориентированном графе ребро можно пройти в обе стороны:

```text
A -- B
```

Если есть дорога `A -- B`, то `A` является соседом `B`, а `B` — соседом `A`.

В ориентированном графе направление важно:

```text
A -> B
```

Из `A` можно перейти в `B`, но обратный переход не подразумевается.

## Взвешенный граф {#vzveshennyy-graf}

У ребра может быть вес:

```text
A --5--> B
```

Вес может означать расстояние, стоимость или время. Обычный BFS находит кратчайший путь только тогда, когда все переходы имеют одинаковую стоимость.

Для разных неотрицательных весов обычно используется алгоритм Дейкстры, который изучается позже.

## Список смежности {#spisok-smezhnosti}

Список смежности хранит соседей каждой вершины:

```python
graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A"],
    "D": ["B"],
}
```

Память:

- `O(V)` для вершин;
- `O(E)` для ребер;
- всего `O(V + E)`.

В неориентированном графе каждое ребро хранится дважды, но константа `2` не меняет Big O.

## Матрица смежности {#matritsa-smezhnosti}

Матрица смежности содержит ячейку для каждой пары вершин:

```text
    A B C
A   0 1 1
B   1 0 0
C   1 0 0
```

Память равна `O(V²)` даже при малом количестве ребер.

Матрица удобна, когда:

- граф плотный;
- нужно за `O(1)` проверять существование конкретного ребра;
- вход уже дан матрицей.

Для большинства разреженных графов список смежности экономнее.

## Построение графа из ребер {#postroenie-grafa-iz-reber}

Для неориентированного графа каждое ребро добавляется в обе стороны:

```python
def build_undirected_graph(
    vertices_count: int,
    edges: list[tuple[int, int]],
) -> list[list[int]]:
    graph = [[] for _ in range(vertices_count)]

    for first, second in edges:
        graph[first].append(second)
        graph[second].append(first)

    return graph
```

Для ориентированного графа добавляется только указанное направление:

```python
def build_directed_graph(
    vertices_count: int,
    edges: list[tuple[int, int]],
) -> list[list[int]]:
    graph = [[] for _ in range(vertices_count)]

    for source, destination in edges:
        graph[source].append(destination)

    return graph
```

Сначала уточни смысл пары из условия. В задаче про prerequisites пара может означать `[course, prerequisite]`, то есть направление ребра не совпадает с порядком «из первого во второй».

## DFS графа {#dfs-grafa}

```python
def dfs_traversal(
    graph: dict[str, list[str]],
    start: str,
) -> list[str]:
    visited: set[str] = set()
    order: list[str] = []

    def dfs(vertex: str) -> None:
        # Вершина отмечается до обхода соседей.
        visited.add(vertex)
        order.append(vertex)

        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                dfs(neighbor)

    dfs(start)
    return order
```

Порядок DFS зависит от порядка соседей в списке смежности. Обычно задача не должна требовать единственного порядка, если соседи заранее не отсортированы.

## Итеративный DFS {#iterativnyy-dfs}

```python
def dfs_iterative(
    graph: dict[str, list[str]],
    start: str,
) -> list[str]:
    visited: set[str] = set()
    order: list[str] = []
    stack = [start]

    while stack:
        vertex = stack.pop()

        if vertex in visited:
            continue

        visited.add(vertex)
        order.append(vertex)

        # reversed сохраняет тот же порядок, что и рекурсивный DFS,
        # потому что стек извлекает последний добавленный элемент.
        for neighbor in reversed(graph.get(vertex, [])):
            if neighbor not in visited:
                stack.append(neighbor)

    return order
```

В этом варианте вершина отмечается при извлечении. Поэтому одна вершина теоретически может несколько раз попасть в стек, но обработана будет один раз.

Можно отмечать при добавлении и не допускать дубликатов. Важно выбрать один подход и соблюдать его последовательно.

## BFS графа {#bfs-grafa}

```python
from collections import deque


def bfs_traversal(
    graph: dict[str, list[str]],
    start: str,
) -> list[str]:
    visited = {start}
    queue = deque([start])
    order: list[str] = []

    while queue:
        vertex = queue.popleft()
        order.append(vertex)

        for neighbor in graph.get(vertex, []):
            if neighbor in visited:
                continue

            visited.add(neighbor)
            queue.append(neighbor)

    return order
```

BFS обрабатывает вершины слоями по расстоянию от `start`.

## Пример 1. Существует ли путь {#primer-1-sushchestvuet-li-put}

Для самого факта достижимости подходит и DFS, и BFS.

```python
def path_exists(
    graph: list[list[int]],
    start: int,
    target: int,
) -> bool:
    stack = [start]
    visited = {start}

    while stack:
        vertex = stack.pop()

        if vertex == target:
            return True

        for neighbor in graph[vertex]:
            if neighbor in visited:
                continue

            visited.add(neighbor)
            stack.append(neighbor)

    return False
```

Если путь не найден в компоненте `start`, функция возвращает `False`. Посещать вершины других компонентов не нужно, потому что до них все равно нельзя добраться из `start`.

## Сложность обхода {#slozhnost-obkhoda}

Каждая достижимая вершина обрабатывается один раз. Каждый список соседей просматривается один раз.

- время: `O(V + E)`;
- память `visited`: `O(V)`;
- стек или очередь: до `O(V)`.

Запись только `O(V)` ошибочна: граф может содержать много ребер, и алгоритм их проверяет.

## Несвязный граф {#nesvyaznyy-graf}

Один запуск DFS посещает только компоненту стартовой вершины.

```text
0 -- 1     2 -- 3     4
```

Здесь три компоненты:

- `{0, 1}`;
- `{2, 3}`;
- `{4}`.

Чтобы обработать весь граф, нужен внешний цикл по всем вершинам.

## Пример 2. Количество компонентов {#primer-2-kolichestvo-komponentov}

```python
def count_components(graph: list[list[int]]) -> int:
    visited: set[int] = set()
    components = 0

    def dfs(start: int) -> None:
        stack = [start]
        visited.add(start)

        while stack:
            vertex = stack.pop()

            for neighbor in graph[vertex]:
                if neighbor in visited:
                    continue

                visited.add(neighbor)
                stack.append(neighbor)

    for vertex in range(len(graph)):
        if vertex in visited:
            continue

        # Каждая непосещенная вершина начинает новую компоненту.
        components += 1
        dfs(vertex)

    return components
```

Изолированная вершина с пустым списком соседей тоже является отдельной компонентой.

## Цикл в неориентированном графе {#tsikl-v-neorientirovannom-grafe}

Во время DFS сосед может быть уже посещен по двум причинам:

1. Это родитель, из которого мы пришли.
2. Это другая посещенная вершина, значит найден цикл.

Ребро назад к родителю не является циклом. Поэтому вместе с вершиной нужно передавать `parent`.

## Пример 3. Поиск цикла в неориентированном графе {#primer-3-poisk-tsikla-v-neorientirovannom-grafe}

```python
def has_undirected_cycle(graph: list[list[int]]) -> bool:
    visited: set[int] = set()

    def dfs(vertex: int, parent: int) -> bool:
        visited.add(vertex)

        for neighbor in graph[vertex]:
            if neighbor == parent:
                continue

            if neighbor in visited:
                # Посещенный сосед не является родителем.
                return True

            if dfs(neighbor, vertex):
                return True

        return False

    for vertex in range(len(graph)):
        if vertex not in visited and dfs(vertex, -1):
            return True

    return False
```

Внешний цикл нужен, потому что цикл может находиться не в первой компоненте.

## Почему этот способ не подходит ориентированному графу {#pochemu-etot-sposob-ne-podkhodit-orientirovannomu-grafu}

В ориентированном графе ребро в уже полностью обработанную вершину не обязательно образует цикл.

```text
A -> B
|    ^
v    |
C ---
```

Вершина `B` может быть посещена из `A`, а затем встречена из `C`. Это не означает путь обратно к `A`.

Нужно различать вершины:

- еще не посещенные;
- находящиеся в текущем рекурсивном пути;
- полностью обработанные.

## Три состояния вершины {#tri-sostoyaniya-vershiny}

Удобные значения:

```text
0 — unvisited
1 — visiting
2 — visited
```

Ребро в вершину `visiting` означает возврат в текущий путь и наличие цикла.

Ребро в `visited` безопасно: эта ветвь уже полностью проверена.

## Пример 4. Course Schedule {#primer-4-course-schedule}

Нужно определить, можно ли закончить все курсы с учетом prerequisites.

Ребро `prerequisite -> course` означает, что сначала изучается prerequisite.

```python
def can_finish(
    courses_count: int,
    prerequisites: list[tuple[int, int]],
) -> bool:
    graph = [[] for _ in range(courses_count)]

    for course, prerequisite in prerequisites:
        graph[prerequisite].append(course)

    state = [0] * courses_count

    def has_cycle(course: int) -> bool:
        if state[course] == 1:
            # Вернулись в вершину текущего пути.
            return True

        if state[course] == 2:
            # Эта ветвь уже полностью проверена.
            return False

        state[course] = 1

        for next_course in graph[course]:
            if has_cycle(next_course):
                return True

        # Убираем вершину из текущего пути и помечаем завершенной.
        state[course] = 2
        return False

    for course in range(courses_count):
        if has_cycle(course):
            return False

    return True
```

Если цикл существует, курсы внутри него требуют друг друга, поэтому завершить все невозможно.

## Топологическая сортировка {#topologicheskaya-sortirovka}

Топологический порядок — такой порядок вершин ориентированного графа, в котором каждое требование идет раньше зависимой вершины.

Он существует только для DAG:

```text
Directed Acyclic Graph
Ориентированный ациклический граф
```

Примеры применения:

- порядок курсов;
- порядок сборки модулей;
- запуск задач с зависимостями;
- последовательность миграций.

## Алгоритм Кана {#algoritm-kana}

Для каждой вершины считается `indegree` — количество входящих ребер.

1. В очередь кладутся вершины с `indegree == 0`.
2. Вершина извлекается и добавляется в порядок.
3. Ее исходящие ребра удаляются: `indegree` соседей уменьшается.
4. Новый нулевой `indegree` добавляет вершину в очередь.

```python
from collections import deque


def topological_sort(graph: list[list[int]]) -> list[int]:
    indegree = [0] * len(graph)

    for neighbors in graph:
        for neighbor in neighbors:
            indegree[neighbor] += 1

    queue = deque(
        vertex
        for vertex, degree in enumerate(indegree)
        if degree == 0
    )
    order: list[int] = []

    while queue:
        vertex = queue.popleft()
        order.append(vertex)

        for neighbor in graph[vertex]:
            indegree[neighbor] -= 1

            if indegree[neighbor] == 0:
                queue.append(neighbor)

    if len(order) != len(graph):
        # Остались вершины, входящие в цикл.
        return []

    return order
```

У одного DAG может быть несколько корректных топологических порядков.

## DFS или BFS {#dfs-ili-bfs}

| Задача | Подход |
| --- | --- |
| Проверить достижимость | DFS или BFS |
| Найти кратчайший путь без весов | BFS |
| Найти компоненты | DFS или BFS + внешний цикл |
| Обнаружить цикл | DFS со специальным состоянием |
| Получить зависимости по уровням | BFS / алгоритм Кана |
| Исследовать всю ветвь | DFS |

Сначала определяй требуемый результат, а затем выбирай обход.

## Частые ошибки {#chastye-oshibki}

1. Добавить неориентированное ребро только в одну сторону.
2. Добавить обратное ребро в ориентированном графе.
3. Забыть про изолированные вершины.
4. Запустить обход только из вершины `0` для несвязного графа.
5. Пометить вершину посещенной слишком поздно.
6. Назвать сложность `O(V)`, забыв про ребра.
7. Считать любое ребро в `visited` циклом ориентированного графа.
8. Не отличать родителя от цикла в неориентированном графе.
9. Перепутать направление prerequisite.
10. Ожидать единственный топологический порядок.

## План занятий {#plan-zanyatiy}

1. Построй список смежности вручную.
2. Реализуй DFS рекурсивно и через стек.
3. Реализуй BFS и расстояния.
4. Добавь несвязную компоненту и внешний цикл.
5. Найди цикл в неориентированном графе.
6. Нарисуй состояния `unvisited`, `visiting`, `visited`.
7. Реши Course Schedule через DFS.
8. Реализуй алгоритм Кана.

## Задачи для самостоятельного решения {#zadachi-dlya-samostoyatelnogo-resheniya}

### Задача 1. Клонирование графа {#zadacha-1-klonirovanie-grafa}

Дана ссылка на узел связного неориентированного графа. Каждый узел хранит значение и список соседей. Создай глубокую копию всей достижимой компоненты.

Подумай:

- почему нельзя создавать новую копию при каждой встрече узла;
- какой словарь свяжет старый узел с его копией;
- когда нужно записать копию в словарь;
- как избежать бесконечного обхода цикла.

### Задача 2. Все возможные пути {#zadacha-2-vse-vozmozhnye-puti}

Дан ориентированный ациклический граф. Верни все пути из вершины `0` в вершину `n - 1`.

Требования:

- хранить текущий путь;
- добавлять в ответ копию пути;
- откатывать путь после возврата;
- объяснить, почему время зависит от количества возможных путей.

Эта задача одновременно закрепляет графы и подготавливает к backtracking.

<RelatedTopics
    :items="[
        { title: 'Неделя 14. Grid', href: '/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-14-matritsy-i-grid-traversal' },
        { title: 'Неделя 16. Backtracking', href: '/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-16-backtracking' },
        { title: 'Неделя 10. Queue', href: '/python/algoritmy/etap-3-lineynye-struktury/nedelya-10-queue-i-deque' },
    ]"
/>
