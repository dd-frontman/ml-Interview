---
title: "Алгоритм Дейкстры"
description: "Кратчайшие пути в графе с неотрицательными весами: релаксация, priority queue, устаревшие записи и восстановление пути."
tags:
  - "python"
  - "algorithms"
  - "graphs"
  - "dijkstra"
  - "heap"
updatedAt: "2026-11-14"
---
## Какую проблему решаем {#kakuyu-problemu-reshaem}

Алгоритм Дейкстры находит кратчайшие расстояния от одной стартовой вершины до остальных вершин графа с **неотрицательными весами**.

Примеры:

- минимальное время доставки сигнала;
- самый быстрый маршрут по дорогам;
- минимальная стоимость переходов между состояниями;
- задержка передачи данных по сети.

## Почему BFS недостаточно {#pochemu-bfs-nedostatochno}

BFS минимизирует количество рёбер, а не их суммарный вес.

```text
A -> B имеет вес 100
A -> C имеет вес 1
C -> B имеет вес 1
```

Путь `A -> B` содержит одно ребро, но стоит `100`. Путь `A -> C -> B` содержит два ребра, но стоит `2`.

Дейкстра выбирает путь по суммарному весу.

## Основная идея {#osnovnaya-ideya}

1. Расстояние до стартовой вершины равно `0`.
2. Остальные расстояния изначально равны бесконечности.
3. Priority queue выбирает вершину с минимальным известным расстоянием.
4. Алгоритм пробует улучшить расстояния до соседей.
5. Улучшенные расстояния добавляются в кучу.

Процесс улучшения расстояния называется **релаксацией ребра**.

```python
new_distance = current_distance + weight

if new_distance < distances[neighbor]:
    distances[neighbor] = new_distance
```

## Минимальный пример {#minimalnyy-primer}

Список смежности хранит пары `(neighbor, weight)`:

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

        for neighbor, weight in graph[vertex]:
            new_distance = current_distance + weight

            if new_distance >= distances[neighbor]:
                continue

            distances[neighbor] = new_distance
            heapq.heappush(heap, (new_distance, neighbor))

    return distances


graph = {
    "A": [("B", 100), ("C", 1)],
    "B": [],
    "C": [("B", 1)],
}

print(dijkstra(graph, "A"))  # {'A': 0, 'B': 2, 'C': 1}
```

В примере все вершины присутствуют среди ключей словаря, даже если у них нет исходящих рёбер.

## Как работает куча {#kak-rabotaet-kucha}

В `heapq` наименьший кортеж извлекается первым. Поэтому расстояние хранится первым элементом:

```python
heapq.heappush(heap, (new_distance, neighbor))
```

Куча позволяет получать следующую ближайшую вершину за `O(log V)`, а не просматривать все вершины каждый раз.

## Почему появляются дубликаты {#pochemu-poyavlyayutsya-dublikaty}

`heapq` не предоставляет простой операции уменьшения приоритета существующего элемента.

Когда расстояние улучшается, в кучу добавляется новая пара. Старая запись остаётся внутри и позже определяется как устаревшая:

```python
if current_distance > distances[vertex]:
    continue
```

Например, сначала для вершины `B` может быть найдено расстояние `100`, а затем `2`. В куче временно будут обе записи, но обработается только актуальная.

## Почему веса должны быть неотрицательными {#pochemu-vesa-dolzhny-byt-neotritsatelnymi}

Дейкстра предполагает: если из очереди извлечена вершина с минимальным расстоянием, более короткий путь к ней позже уже не появится.

Отрицательное ребро нарушает это предположение. Оно может позднее уменьшить расстояние до уже выбранной вершины.

Для графов с отрицательными весами используют другие алгоритмы, например Bellman-Ford.

## Сложность {#slozhnost}

При списке смежности и бинарной куче:

- время: `O((V + E) log V)`;
- для связного графа часто пишут `O(E log V)`;
- память: `O(V + E)` с учётом графа, расстояний и кучи.

## Восстановление кратчайшего пути {#vosstanovlenie-kratchayshego-puti}

Словарь расстояний не хранит сам маршрут. При каждом улучшении нужно запоминать предыдущую вершину:

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


previous = {"C": "A", "B": "C"}

print(restore_path(previous, "A", "B"))  # ['A', 'C', 'B']
```

Пустой список означает, что до цели нельзя добраться из стартовой вершины.

## Когда нужен другой алгоритм {#kogda-nuzhen-drugoy-algoritm}

| Условие | Подход |
| --- | --- |
| Все рёбра имеют одинаковый вес | BFS |
| Веса равны только `0` или `1` | 0-1 BFS |
| Есть отрицательные веса | Bellman-Ford |
| Нужны расстояния между всеми парами | Floyd-Warshall или несколько запусков другого алгоритма |
| Граф является DAG | порядок вершин и динамическое программирование по DAG |

## Типичные ошибки {#tipichnye-oshibki}

1. Использовать Дейкстру для отрицательных весов.
2. Не пропускать устаревшие записи в куче.
3. Поместить вершину перед расстоянием в кортеже кучи.
4. Забыть добавить вершины без исходящих рёбер в словарь графа.
5. Путать кратчайшее расстояние и количество рёбер.
6. Не сохранить `previous`, когда по условию требуется сам путь.

## Задачи для практики {#zadachi-dlya-praktiki}

1. Найди время распространения сигнала до всех вершин сети.
2. Верни не только длину, но и вершины кратчайшего пути.
3. Измени решение для графа, в котором веса равны только `0` или `1`.

<RelatedTopics
    :items="[
        { title: 'Обзор недели', href: '/python/algoritmy/etap-5-greedy-dp/nedelya-21-prodvinutyy-trek/' },
        { title: 'Неделя 17. Heap', href: '/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-17-heap-i-priority-queue' },
        { title: 'Практика недели', href: '/python/algoritmy/etap-5-greedy-dp/nedelya-21-prodvinutyy-trek/praktika' },
    ]"
/>
