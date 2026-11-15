---
title: "Union Find"
description: "Структура непересекающихся множеств: find, union, представители компонентов, path compression, union by size и поиск лишнего ребра."
tags:
  - "python"
  - "algorithms"
  - "graphs"
  - "union-find"
updatedAt: "2026-11-14"
---
## Какую проблему решаем {#kakuyu-problemu-reshaem}

Представь несколько компьютеров, которые постепенно соединяются кабелями. После каждого нового соединения нужно быстро отвечать:

- находятся ли два компьютера в одной сети;
- сколько отдельных сетей осталось;
- соединяет ли новый кабель уже связанные компьютеры.

**Union Find**, или **Disjoint Set Union**, поддерживает набор непересекающихся компонентов и две основные операции:

- `find(x)` - найти представителя компоненты элемента `x`;
- `union(a, b)` - объединить две компоненты.

## Представитель компоненты {#predstavitel-komponenty}

Каждая компонента хранится как дерево родителей:

```text
0 <- 1 <- 2
```

Корень является представителем и указывает сам на себя:

```text
parent[0] == 0
```

Два элемента принадлежат одной компоненте, если `find()` возвращает одинаковый корень.

В начале каждый элемент является отдельным корнем:

```python
parent = list(range(5))

print(parent)  # [0, 1, 2, 3, 4]
```

## Path Compression {#path-compression}

Без оптимизации цепочка родителей может стать длинной:

```text
3 -> 2 -> 1 -> 0
```

Path compression во время `find()` перенаправляет пройденные узлы сразу к корню:

```text
3 -> 0
2 -> 0
1 -> 0
```

Следующие поиски представителя становятся значительно быстрее.

```python
def find(self, node: int) -> int:
    if self.parent[node] != node:
        self.parent[node] = self.find(self.parent[node])

    return self.parent[node]
```

Строка с рекурсивным присваиванием сначала находит корень, а затем сохраняет его прямо в `parent[node]`.

## Union by Size {#union-by-size}

При объединении корень меньшего дерева присоединяется к корню большего. Это не даёт дереву быстро расти в высоту.

```python
if component_size[first_root] < component_size[second_root]:
    first_root, second_root = second_root, first_root

parent[second_root] = first_root
component_size[first_root] += component_size[second_root]
```

Вместо размера можно хранить приближённую высоту дерева - `rank`. Обе оптимизации решают одну задачу: не присоединять большое дерево к маленькому.

Path compression и union by size вместе дают амортизированное время, практически близкое к `O(1)` на операцию.

## Полная реализация {#polnaya-realizatsiya}

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

## Минимальный пример {#minimalnyy-primer}

Теперь создадим структуру для пяти элементов и объединим `0`, `1` и `2` в одну компоненту:

```python
union_find = UnionFind(5)

union_find.union(0, 1)
union_find.union(1, 2)

print(union_find.connected(0, 2))  # True
print(union_find.connected(0, 4))  # False
print(union_find.components_count)  # 3
```

Изначально существовало пять отдельных компонентов. После двух успешных объединений осталось три.

Возвращаемое значение `union()` сообщает:

- `True` - объединены две разные компоненты;
- `False` - элементы уже находились в одной компоненте.

Это удобно для поиска ребра, которое создаёт цикл.

## Пример: лишнее ребро {#primer-lishnee-rebro}

Изначально вершины не связаны. Рёбра добавляются по одному. Первое ребро между уже связанными вершинами создаёт цикл.

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


edges = [(0, 1), (1, 2), (2, 0)]

print(find_redundant_connection(3, edges))  # (2, 0)
```

Рёбра `(0, 1)` и `(1, 2)` объединяют вершины. Перед добавлением `(2, 0)` вершины `2` и `0` уже связаны, поэтому это ребро замыкает цикл.

## Union Find или DFS {#union-find-ili-dfs}

Оба подхода умеют находить компоненты, но отвечают на разные запросы.

Используй DFS или BFS, когда:

- граф уже построен;
- нужно обойти соседей;
- требуется восстановить путь;
- нужна информация о вершинах компоненты.

Используй Union Find, когда:

- рёбра добавляются постепенно;
- часто проверяется связность;
- важны только объединения компонентов;
- не требуется удалять рёбра и восстанавливать путь.

Union Find отвечает на вопрос о компонентах, но не хранит сам путь между вершинами.

## Сложность {#slozhnost}

С path compression и union by size:

- одна операция имеет амортизированную сложность `O(α(n))`;
- `α(n)` - обратная функция Аккермана, которая для практических размеров почти не растёт;
- память: `O(n)`.

На собеседовании обычно достаточно сказать: операции работают практически за постоянное амортизированное время.

## Типичные ошибки {#tipichnye-oshibki}

1. Присоединять сами узлы, а не их корни.
2. Уменьшать число компонентов при неуспешном `union()`.
3. Забывать path compression и union by size на больших входах.
4. Использовать Union Find, когда нужно восстановить путь.
5. Ожидать удобного удаления уже добавленных рёбер.

## Задачи для практики {#zadachi-dlya-praktiki}

1. Посчитай количество компонент после добавления всех рёбер.
2. Найди первое ребро, создающее цикл в неориентированном графе.
3. Объедини аккаунты, имеющие общий email.

<RelatedTopics
    :items="[
        { title: 'Обзор недели', href: '/python/algoritmy/etap-5-greedy-dp/nedelya-21-prodvinutyy-trek/' },
        { title: 'Topological Sort', href: '/python/algoritmy/etap-5-greedy-dp/nedelya-21-prodvinutyy-trek/topological-sort' },
        { title: 'Практика недели', href: '/python/algoritmy/etap-5-greedy-dp/nedelya-21-prodvinutyy-trek/praktika' },
    ]"
/>
