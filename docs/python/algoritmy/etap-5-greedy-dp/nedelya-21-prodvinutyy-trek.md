---
title: "Неделя 21. Продвинутый трек"
description: "Подробный продвинутый трек по алгоритмам на Python: topological sort, Union Find, Dijkstra, Trie, битовые операции и задачи."
tags:
  - "python"
  - "algorithms"
  - "union-find"
  - "dijkstra"
  - "trie"
updatedAt: "2026-10-19"
search: false
---
## Цель недели {#tsel-nedeli}

Познакомиться с несколькими независимыми алгоритмами и структурами, которые встречаются реже базовых паттернов, но важны для сильных алгоритмических секций.

После недели нужно уметь:

- получить порядок выполнения зависимых задач;
- объединять компоненты через Union Find;
- искать кратчайшие пути с неотрицательными весами;
- хранить и искать строки по префиксу через Trie;
- применять основные битовые операции;
- оценивать, нужна ли конкретная продвинутая тема для выбранной компании.

## Как проходить эту неделю {#kak-prokhodit-etu-nedelyu}

Темы недели слабо связаны между собой. Не нужно пытаться освоить их за один день.

Рекомендуемый порядок:

1. Повторить Topological Sort после недели графов.
2. Разобрать Union Find и компоненты.
3. Связать Dijkstra с priority queue.
4. Реализовать Trie как новую структуру данных.
5. Завершить битовыми операциями.

Если времени мало, приоритет обычно такой:

```text
Topological Sort -> Union Find -> Dijkstra -> Trie -> Bits
```

Но реальный приоритет зависит от формата собеседований конкретной компании.

## Часть 1. Topological Sort {#chast-1-topological-sort}

Топологическая сортировка строит порядок вершин ориентированного графа, в котором каждая зависимость идет раньше зависящей от нее вершины.

Например:

```text
установить зависимости -> собрать проект -> запустить тесты -> задеплоить
```

Топологический порядок существует только для DAG:

```text
Directed Acyclic Graph
Ориентированный ациклический граф
```

Если зависимости образуют цикл, корректного порядка нет.

## Indegree {#indegree}

`indegree[vertex]` — количество ребер, входящих в вершину.

Вершина с `indegree == 0` не зависит от необработанных вершин и может быть выполнена сейчас.

После ее обработки исходящие ребра мысленно удаляются, поэтому входящие степени соседей уменьшаются.

## Пример 1. Порядок зависимостей алгоритмом Кана {#primer-1-poryadok-zavisimostey-algoritmom-kana}

Пусть пара `(prerequisite, task)` означает, что prerequisite должен выполняться раньше task.

```python
from collections import deque


def build_order(
    tasks_count: int,
    dependencies: list[tuple[int, int]],
) -> list[int]:
    graph = [[] for _ in range(tasks_count)]
    indegree = [0] * tasks_count

    for prerequisite, task in dependencies:
        graph[prerequisite].append(task)
        indegree[task] += 1

    queue = deque(
        task
        for task, degree in enumerate(indegree)
        if degree == 0
    )
    order: list[int] = []

    while queue:
        task = queue.popleft()
        order.append(task)

        for dependent_task in graph[task]:
            indegree[dependent_task] -= 1

            if indegree[dependent_task] == 0:
                queue.append(dependent_task)

    if len(order) != tasks_count:
        # Необработанные вершины входят в цикл зависимостей.
        return []

    return order
```

### Почему длина показывает наличие цикла {#pochemu-dlina-pokazyvaet-nalichie-tsikla}

В цикле у каждой вершины остается хотя бы одно входящее ребро от другой вершины цикла. Ни одна из них не попадет в очередь.

Если очередь опустела раньше, чем обработаны все вершины, оставшаяся часть содержит цикл.

- Время: `O(V + E)`.
- Память: `O(V + E)`.

## Несколько правильных порядков {#neskolko-pravilnykh-poryadkov}

Если одновременно существует несколько вершин с `indegree == 0`, любую можно обработать первой. Поэтому у графа может быть несколько топологических порядков.

Если требуется лексикографически минимальный порядок, вместо обычной очереди можно использовать min-heap. Тогда выбор следующей доступной вершины занимает `O(log V)`.

## DFS-вариант топологической сортировки {#dfs-variant-topologicheskoy-sortirovki}

В DFS вершина добавляется в ответ после всех зависимых вершин, а затем список разворачивается.

Нужны три состояния:

- `0` — не посещена;
- `1` — в текущем пути;
- `2` — полностью обработана.

Ребро в состояние `1` означает цикл.

Алгоритм Кана обычно проще, когда условие говорит о входящих степенях, доступных задачах или уровнях. DFS удобен, когда уже используется рекурсивный обход зависимостей.

## Часть 2. Union Find {#chast-2-union-find}

Union Find, или Disjoint Set Union, поддерживает набор непересекающихся компонентов.

Основные операции:

- `find(x)` — найти представителя компоненты `x`;
- `union(a, b)` — объединить компоненты;
- проверить, находятся ли элементы в одной компоненте.

Примеры задач:

- динамическое объединение сетей;
- обнаружение лишнего ребра;
- подсчет компонентов;
- объединение аккаунтов;
- алгоритм Краскала для минимального остовного дерева.

## Представитель компоненты {#predstavitel-komponenty}

Каждая компонента хранится как дерево родителей.

```text
0 <- 1 <- 2
```

Корень является представителем и указывает сам на себя:

```text
parent[0] == 0
```

Два элемента принадлежат одной компоненте, если `find()` возвращает одинаковый корень.

## Path Compression {#path-compression}

Без оптимизации цепочка родителей может стать длинной.

Path compression во время `find()` перенаправляет пройденные узлы сразу к корню:

```text
до:    3 -> 2 -> 1 -> 0
после: 3 -> 0, 2 -> 0, 1 -> 0
```

Следующие поиски становятся почти постоянными по времени.

## Union by Size {#union-by-size}

При объединении корень меньшего дерева присоединяется к корню большего. Это не дает дереву быстро расти в высоту.

Path compression и union by size вместе дают амортизированное время, практически близкое к `O(1)` на операцию.

## Пример 2. Реализация Union Find {#primer-2-realizatsiya-union-find}

```python
class UnionFind:
    def __init__(self, size: int) -> None:
        self.parent = list(range(size))
        self.component_size = [1] * size
        self.components_count = size

    def find(self, node: int) -> int:
        if self.parent[node] != node:
            # После рекурсивного поиска node указывает прямо на корень.
            self.parent[node] = self.find(self.parent[node])

        return self.parent[node]

    def union(self, first: int, second: int) -> bool:
        first_root = self.find(first)
        second_root = self.find(second)

        if first_root == second_root:
            # Компоненты уже объединены.
            return False

        if self.component_size[first_root] < self.component_size[second_root]:
            first_root, second_root = second_root, first_root

        # Меньшее дерево присоединяется к большему.
        self.parent[second_root] = first_root
        self.component_size[first_root] += self.component_size[second_root]
        self.components_count -= 1

        return True

    def connected(self, first: int, second: int) -> bool:
        return self.find(first) == self.find(second)
```

Возвращаемое значение `union()` сообщает:

- `True` — произошло объединение двух разных компонентов;
- `False` — вершины уже были связаны.

Это удобно для поиска ребра, которое создает цикл.

## Пример 3. Лишнее ребро {#primer-3-lishnee-rebro}

Изначально вершины не связаны. Ребра добавляются по одному. Первое ребро между уже связанными вершинами создает цикл.

```python
def find_redundant_connection(
    vertices_count: int,
    edges: list[tuple[int, int]],
) -> tuple[int, int] | None:
    union_find = UnionFind(vertices_count)

    for first, second in edges:
        if not union_find.union(first, second):
            return first, second

    return None
```

Union Find отвечает на вопрос о компонентах, но не хранит сам путь между вершинами. Если нужно восстановить путь, понадобится графовый обход или дополнительная структура.

## Union Find или DFS {#union-find-ili-dfs}

Оба подхода умеют находить компоненты.

Используй DFS/BFS, когда:

- граф уже построен;
- нужно обойти соседей;
- требуется путь или информация о вершинах компоненты.

Используй Union Find, когда:

- ребра добавляются постепенно;
- часто проверяется связность;
- важны только объединения компонентов;
- не требуется удалять ребра и восстанавливать путь.

## Часть 3. Dijkstra {#chast-3-dijkstra}

Алгоритм Дейкстры находит кратчайшие расстояния от одной стартовой вершины в графе с **неотрицательными весами**.

Идея:

1. Расстояние до старта равно `0`.
2. Priority queue выбирает вершину с минимальным известным расстоянием.
3. Алгоритм пробует улучшить расстояния до соседей.
4. Улучшенные расстояния добавляются в кучу.

Процесс улучшения называется **relaxation**, или релаксация ребра.

## Почему BFS недостаточно {#pochemu-bfs-nedostatochno}

BFS минимизирует количество ребер.

```text
A -> B имеет вес 100
A -> C имеет вес 1
C -> B имеет вес 1
```

Путь `A -> B` содержит одно ребро, но стоит `100`. Путь `A -> C -> B` содержит два ребра, но стоит `2`.

Dijkstra выбирает путь по суммарному весу, а не по количеству переходов.

## Пример 4. Кратчайшие расстояния {#primer-4-kratchayshie-rasstoyaniya}

Список смежности хранит пары `(neighbor, weight)`.

```python
import heapq


def dijkstra(
    graph: dict[str, list[tuple[str, int]]],
    start: str,
) -> dict[str, float]:
    distances = {
        vertex: float("inf")
        for vertex in graph
    }
    distances[start] = 0

    heap: list[tuple[float, str]] = [(0, start)]

    while heap:
        current_distance, vertex = heapq.heappop(heap)

        if current_distance > distances[vertex]:
            # В куче осталась устаревшая, более длинная запись.
            continue

        for neighbor, weight in graph.get(vertex, []):
            new_distance = current_distance + weight

            if new_distance >= distances[neighbor]:
                continue

            distances[neighbor] = new_distance
            heapq.heappush(heap, (new_distance, neighbor))

    return distances
```

## Почему в куче появляются дубликаты {#pochemu-v-kuche-poyavlyayutsya-dublikaty}

`heapq` не предоставляет простой операции уменьшения приоритета существующего элемента.

Когда расстояние улучшается, в кучу добавляется новая пара. Старая остается внутри и позже определяется как устаревшая:

```python
if current_distance > distances[vertex]:
    continue
```

Это стандартный и простой подход.

## Почему нельзя использовать отрицательные веса {#pochemu-nelzya-ispolzovat-otritsatelnye-vesa}

Дейкстра считает выбранную минимальную вершину окончательно обработанной. Отрицательное ребро может позже создать более короткий путь к уже выбранной вершине и нарушить доказательство алгоритма.

Для графов с отрицательными весами требуются другие алгоритмы, например Bellman–Ford.

## Сложность Dijkstra {#slozhnost-dijkstra}

При списке смежности и бинарной куче:

- время: `O((V + E) log V)`, часто записывают `O(E log V)` для связного графа;
- память: `O(V + E)` для графа, расстояний и кучи.

## Восстановление кратчайшего пути {#vosstanovlenie-kratchayshego-puti}

Одних расстояний недостаточно. При улучшении нужно сохранять предыдущую вершину:

```python
previous[neighbor] = vertex
```

После завершения путь строится от цели к старту:

```python
def restore_path(
    previous: dict[str, str],
    start: str,
    target: str,
) -> list[str]:
    path = [target]
    current = target

    while current != start:
        if current not in previous:
            return []

        current = previous[current]
        path.append(current)

    path.reverse()
    return path
```

## Часть 4. Trie {#chast-4-trie}

Trie, или префиксное дерево, хранит строки по символам.

Для слов `cat`, `car`, `dog` общие префиксы используют общие узлы:

```text
root
├── c
│   └── a
│       ├── t*
│       └── r*
└── d
    └── o
        └── g*
```

Звездочка обозначает конец полного слова.

## Почему флага конца недостаточно заменить листьями {#pochemu-flaga-kontsa-nedostatochno-zamenit-listyami}

Слово может быть префиксом другого слова:

```text
app
apple
```

Узел второй `p` имеет потомка, но одновременно завершает слово `app`. Поэтому нужен отдельный флаг `is_word`.

## Пример 5. Реализация Trie {#primer-5-realizatsiya-trie}

```python
class TrieNode:
    def __init__(self) -> None:
        self.children: dict[str, TrieNode] = {}
        self.is_word = False


class Trie:
    def __init__(self) -> None:
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        current = self.root

        for character in word:
            if character not in current.children:
                current.children[character] = TrieNode()

            current = current.children[character]

        current.is_word = True

    def search(self, word: str) -> bool:
        node = self._find_node(word)
        return node is not None and node.is_word

    def starts_with(self, prefix: str) -> bool:
        return self._find_node(prefix) is not None

    def _find_node(self, text: str) -> TrieNode | None:
        current = self.root

        for character in text:
            if character not in current.children:
                return None

            current = current.children[character]

        return current
```

Для строки длины `L`:

- вставка: `O(L)`;
- поиск слова: `O(L)`;
- поиск префикса: `O(L)`.

Память зависит от количества уникальных префиксов. Trie может использовать больше памяти, чем множество строк, из-за множества объектов и словарей.

## Trie или set {#trie-ili-set}

Используй `set`, если нужно только проверять полное слово:

```python
word in words
```

Используй Trie, если нужны:

- запросы по префиксу;
- автодополнение;
- одновременный поиск многих слов в тексте или матрице;
- обход слов с общими началами.

Не добавляй Trie, если обычное множество полностью решает задачу.

## Часть 5. Битовые операции {#chast-5-bitovye-operatsii}

Целое число хранится в двоичном виде. Битовые операции работают с отдельными позициями.

Основные операторы Python:

| Оператор | Название | Смысл |
| --- | --- | --- |
| `a & b` | AND | `1`, если оба бита равны `1` |
| `a \| b` | OR | `1`, если хотя бы один бит равен `1` |
| `a ^ b` | XOR | `1`, если биты различаются |
| `~a` | NOT | Инверсия битов |
| `a << k` | Сдвиг влево | Сдвинуть на `k` позиций |
| `a >> k` | Сдвиг вправо | Сдвинуть на `k` позиций |

## Таблица для одного бита {#tablitsa-dlya-odnogo-bita}

| `a` | `b` | `a & b` | `a \| b` | `a ^ b` |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 |

В Markdown символ `|` экранирован, чтобы не разрушать таблицу.

## Полезные свойства XOR {#poleznye-svoystva-xor}

```text
x ^ x = 0
x ^ 0 = x
a ^ b = b ^ a
```

Одинаковые значения взаимно уничтожаются.

## Пример 6. Единственное число {#primer-6-edinstvennoe-chislo}

Все числа встречаются дважды, кроме одного.

```python
def single_number(numbers: list[int]) -> int:
    result = 0

    for number in numbers:
        result ^= number

    return result
```

Для `[4, 1, 2, 1, 2]` пары `1` и `2` дадут ноль, останется `4`.

- Время: `O(n)`.
- Память: `O(1)`.

Словарь частот был бы понятнее для общего случая, но использовал бы `O(n)` памяти.

## Проверка и изменение бита {#proverka-i-izmenenie-bita}

Маска для позиции `position`:

```python
mask = 1 << position
```

Проверить бит:

```python
is_set = bool(number & mask)
```

Установить бит:

```python
number = number | mask
```

Сбросить бит:

```python
number = number & ~mask
```

Переключить бит:

```python
number = number ^ mask
```

## Битовая маска как множество {#bitovaya-maska-kak-mnozhestvo}

Для небольшого количества элементов целое число может хранить выбранные позиции.

Если бит `i` равен `1`, элемент `i` включен.

Все подмножества `n` элементов соответствуют маскам от `0` до `2ⁿ - 1`:

```python
def subsets_with_bits(numbers: list[int]) -> list[list[int]]:
    result: list[list[int]] = []

    for mask in range(1 << len(numbers)):
        current: list[int] = []

        for index, number in enumerate(numbers):
            if mask & (1 << index):
                current.append(number)

        result.append(current)

    return result
```

- Количество масок: `2ⁿ`.
- Проверка элементов одной маски: `O(n)`.
- Общее время: `O(n * 2ⁿ)`.

Битовая запись не меняет экспоненциальную природу задачи.

## Особенность оператора ~ в Python {#osobennost-operatora-v-python}

Целые числа Python не ограничены фиксированными 32 битами. Поэтому:

```text
~x = -x - 1
```

Если задача требует поведение беззнакового 32-битного числа, результат нужно ограничивать маской:

```python
MASK_32 = (1 << 32) - 1
result = (~number) & MASK_32
```

## Когда какая структура нужна {#kogda-kakaya-struktura-nuzhna}

| Сигнал в условии | Инструмент |
| --- | --- |
| Зависимости и порядок | Topological Sort |
| Динамическое объединение компонентов | Union Find |
| Неотрицательные веса и кратчайший путь | Dijkstra |
| Поиск по префиксу | Trie |
| Флаги, XOR, компактные подмножества | Bit Manipulation |

Не выбирай инструмент только по одному слову. Например, кратчайший путь без весов проще найти BFS, а полное слово — через `set`, а не Trie.

## Частые ошибки {#chastye-oshibki}

1. Строить топологический порядок для неориентированного графа.
2. Не проверить, что обработаны все вершины.
3. Перепутать направление зависимости.
4. Выполнить `union()` для самих узлов вместо их корней.
5. Не применять path compression и union by size на больших входах.
6. Использовать Union Find, когда нужно восстановить путь.
7. Применять Dijkstra к отрицательным весам.
8. Не пропускать устаревшие записи в куче.
9. Считать BFS достаточным для разных весов.
10. Не хранить `is_word` в Trie.
11. Использовать Trie вместо простого множества без необходимости.
12. Неверно понимать `~` для целых Python.

## План занятий {#plan-zanyatiy}

1. Повтори алгоритм Кана и входящие степени.
2. Реализуй Union Find без оптимизаций.
3. Добавь path compression и union by size.
4. Найди лишнее ребро через результат `union()`.
5. Проследи релаксацию Dijkstra на четырех вершинах.
6. Добавь восстановление кратчайшего пути.
7. Реализуй `insert`, `search` и `starts_with` для Trie.
8. Проверь свойства XOR на нескольких числах.
9. Сгенерируй подмножества битовыми масками.

## Задачи для самостоятельного решения {#zadachi-dlya-samostoyatelnogo-resheniya}

### Задача 1. Accounts Merge {#zadacha-1-accounts-merge}

Каждый аккаунт содержит имя и список email. Аккаунты с общим email принадлежат одному человеку. Объедини связанные аккаунты.

Подумай:

- что будет элементом Union Find;
- как связать email с первым увиденным аккаунтом;
- как после объединений сгруппировать email по корневому представителю;
- где взять имя группы;
- зачем отсортировать email в финальном ответе.

### Задача 2. Network Delay Time {#zadacha-2-network-delay-time}

Дан ориентированный граф времен передачи сигнала. Сигнал начинается в одной вершине. Найди время, за которое он достигнет всех вершин, или верни `-1`.

Используй Dijkstra и объясни:

- почему веса должны быть неотрицательными;
- почему ответ является максимумом среди кратчайших расстояний;
- как обнаружить недостижимую вершину;
- зачем пропускать устаревшие записи priority queue.

<RelatedTopics
    :items="[
        { title: 'Неделя 15. Graphs', href: '/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-15-graphs' },
        { title: 'Неделя 17. Heap', href: '/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-17-heap-i-priority-queue' },
        { title: 'Следующий этап', href: '/python/algoritmy/etap-6-praktika-intervyu/glavnaya' },
    ]"
/>
