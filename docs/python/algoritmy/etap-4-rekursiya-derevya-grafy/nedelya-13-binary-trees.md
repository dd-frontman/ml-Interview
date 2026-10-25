---
title: "Неделя 13. Binary Trees"
description: "Подробный разбор бинарных деревьев на Python: DFS, BFS, глубина, диаметр, инвертирование, BST, сложность и задачи."
tags:
  - "python"
  - "algorithms"
  - "binary-tree"
  - "dfs"
  - "bfs"
updatedAt: "2026-10-19"
search: false
---
## Цель недели {#tsel-nedeli}

Научиться решать задачу для дерева через результаты левого и правого поддеревьев, а также выбирать подходящий порядок обхода.

После недели нужно уметь:

- описать узел, корень, лист, глубину и высоту;
- выполнять preorder, inorder и postorder DFS;
- обходить дерево по уровням через BFS;
- находить максимальную глубину;
- инвертировать и сравнивать деревья;
- вычислять диаметр без повторных обходов;
- проверять свойства Binary Search Tree;
- оценивать время `O(n)` и память `O(h)`.

## Что такое бинарное дерево {#chto-takoe-binarnoe-derevo}

Бинарное дерево состоит из узлов. У каждого узла может быть не более двух потомков:

- левый потомок;
- правый потомок.

```text
        8
      /   \
     3     10
    / \      \
   1   6      14
```

Основные термины:

- **root** — корень, верхний узел;
- **parent** — родитель;
- **child** — потомок;
- **leaf** — лист без потомков;
- **subtree** — узел вместе со всеми потомками;
- **depth** — расстояние от корня до узла;
- **height** — длина самого длинного пути вниз.

## Класс узла {#klass-uzla}

```python
class TreeNode:
    def __init__(
        self,
        value: int,
        left: "TreeNode | None" = None,
        right: "TreeNode | None" = None,
    ) -> None:
        self.value = value
        self.left = left
        self.right = right
```

Создадим небольшое дерево:

```text
    2
   / \
  1   3
```

```python
root = TreeNode(
    2,
    left=TreeNode(1),
    right=TreeNode(3),
)
```

В отличие от массива дерево не хранит детей по вычисляемым индексам. Переход выполняется по ссылкам `left` и `right`.

## Рекурсивная модель дерева {#rekursivnaya-model-dereva}

Каждое поддерево само является деревом:

```text
дерево = корень + левое поддерево + правое поддерево
```

Поэтому типичная функция выглядит так:

```python
def solve(node: TreeNode | None):
    if node is None:
        return базовый_результат

    left_result = solve(node.left)
    right_result = solve(node.right)

    return объединение_результатов
```

Главный вопрос: **что должен вернуть вызов для одного поддерева, чтобы родитель мог построить свой ответ?**

## Три порядка DFS {#tri-poryadka-dfs}

DFS означает **Depth-First Search**, или поиск в глубину. Алгоритм полностью исследует одну ветвь, а затем возвращается к другим.

Порядок определяется моментом обработки текущего узла.

### Preorder {#preorder}

```text
узел -> левое поддерево -> правое поддерево
```

```python
def preorder(root: TreeNode | None) -> list[int]:
    if root is None:
        return []

    return [root.value] + preorder(root.left) + preorder(root.right)
```

Подходит, когда родитель должен обрабатываться раньше детей: копирование дерева, сериализация, построение структуры.

### Inorder {#inorder}

```text
левое поддерево -> узел -> правое поддерево
```

```python
def inorder(root: TreeNode | None) -> list[int]:
    if root is None:
        return []

    return inorder(root.left) + [root.value] + inorder(root.right)
```

Для корректного Binary Search Tree inorder возвращает значения по возрастанию.

### Postorder {#postorder}

```text
левое поддерево -> правое поддерево -> узел
```

```python
def postorder(root: TreeNode | None) -> list[int]:
    if root is None:
        return []

    return postorder(root.left) + postorder(root.right) + [root.value]
```

Подходит, когда результат родителя зависит от уже вычисленных результатов детей: высота, размер, удаление дерева.

## Пошаговый порядок обходов {#poshagovyy-poryadok-obkhodov}

Для дерева:

```text
      4
     / \
    2   6
   / \
  1   3
```

Получатся последовательности:

| Обход | Результат |
| --- | --- |
| Preorder | `4, 2, 1, 3, 6` |
| Inorder | `1, 2, 3, 4, 6` |
| Postorder | `1, 3, 2, 6, 4` |

Не нужно заучивать последовательности. Смотри, где относительно двух рекурсивных вызовов обрабатывается `root.value`.

## Почему сложение списков может быть дорогим {#pochemu-slozhenie-spiskov-mozhet-byt-dorogim}

Выражения вида:

```python
left_values + [root.value] + right_values
```

создают новые списки и копируют элементы. Для сильно вытянутого дерева это может ухудшить время до `O(n²)`.

Для эффективного обхода лучше изменять один результирующий список:

```python
def inorder_efficient(root: TreeNode | None) -> list[int]:
    result: list[int] = []

    def dfs(node: TreeNode | None) -> None:
        if node is None:
            return

        dfs(node.left)
        result.append(node.value)
        dfs(node.right)

    dfs(root)
    return result
```

Теперь каждый узел добавляется один раз:

- время: `O(n)`;
- память результата: `O(n)`;
- память стека: `O(h)`.

## Пример 1. Максимальная глубина {#primer-1-maksimalnaya-glubina}

Определим глубину как количество узлов на самом длинном пути от корня до листа.

```python
def max_depth(root: TreeNode | None) -> int:
    if root is None:
        # Пустое дерево не содержит уровней.
        return 0

    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)

    # Текущий узел добавляет один уровень.
    return 1 + max(left_depth, right_depth)
```

Для листа оба рекурсивных вызова вернут `0`, поэтому глубина листа будет `1`.

### Пошаговый разбор {#poshagovyy-razbor}

```text
    5
   / \
  2   8
     /
    7
```

| Узел | Глубина слева | Глубина справа | Результат |
| --- | --- | --- | --- |
| `2` | `0` | `0` | `1` |
| `7` | `0` | `0` | `1` |
| `8` | `1` | `0` | `2` |
| `5` | `1` | `2` | `3` |

Каждый узел посещается один раз:

- время: `O(n)`;
- стек: `O(h)`.

Для сбалансированного дерева `h = O(log n)`, для цепочки `h = O(n)`.

## Пример 2. Инвертирование дерева {#primer-2-invertirovanie-dereva}

Нужно поменять местами левого и правого потомка у каждого узла.

```python
def invert_tree(root: TreeNode | None) -> TreeNode | None:
    if root is None:
        return None

    # Сначала рекурсивно инвертируем оба поддерева.
    inverted_left = invert_tree(root.left)
    inverted_right = invert_tree(root.right)

    # Правое поддерево становится левым, а левое — правым.
    root.left = inverted_right
    root.right = inverted_left

    return root
```

Функция изменяет исходные узлы. Если вызывающий код должен сохранить оригинальное дерево, нужно создавать новые узлы вместо перестановки ссылок.

- Время: `O(n)`.
- Память стека: `O(h)`.

## Пример 3. Одинаковые деревья {#primer-3-odinakovye-derevya}

Два дерева одинаковы, если:

1. Значения текущих узлов равны.
2. Левые поддеревья одинаковы.
3. Правые поддеревья одинаковы.

```python
def is_same_tree(
    first: TreeNode | None,
    second: TreeNode | None,
) -> bool:
    if first is None and second is None:
        return True

    if first is None or second is None:
        return False

    if first.value != second.value:
        return False

    return (
        is_same_tree(first.left, second.left)
        and is_same_tree(first.right, second.right)
    )
```

Порядок проверок важен: обращаться к `.value` можно только после того, как исключен `None`.

## Пример 4. Диаметр дерева {#primer-4-diametr-dereva}

Диаметр — максимальное количество ребер на пути между любыми двумя узлами. Путь не обязан проходить через корень всего дерева.

Для каждого узла путь через него равен:

```text
высота левого поддерева + высота правого поддерева
```

```python
def diameter_of_binary_tree(root: TreeNode | None) -> int:
    diameter = 0

    def height(node: TreeNode | None) -> int:
        nonlocal diameter

        if node is None:
            return 0

        left_height = height(node.left)
        right_height = height(node.right)

        # Высоты считаются в узлах, а их сумма дает число ребер
        # между самым глубоким левым и правым потомками.
        diameter = max(diameter, left_height + right_height)

        # Родителю нужна только высота текущего поддерева.
        return 1 + max(left_height, right_height)

    height(root)
    return diameter
```

Внутренняя функция возвращает высоту поддерева, а параллельно обновляет общий диаметр.

### Почему не нужно отдельно считать высоту каждого узла {#pochemu-ne-nuzhno-otdelno-schitat-vysotu-kazhdogo-uzla}

Если для каждого узла запускать новую функцию высоты, одни и те же поддеревья будут обходиться много раз. В худшем случае получится `O(n²)`.

В приведенном решении высота каждого узла вычисляется один раз:

- время: `O(n)`;
- стек: `O(h)`.

## BFS по уровням {#bfs-po-urovnyam}

DFS идет в глубину, а BFS сначала обрабатывает все узлы текущего уровня.

```python
from collections import deque


def level_order(root: TreeNode | None) -> list[list[int]]:
    if root is None:
        return []

    queue = deque([root])
    levels: list[list[int]] = []

    while queue:
        current_level: list[int] = []
        level_size = len(queue)

        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.value)

            if node.left is not None:
                queue.append(node.left)

            if node.right is not None:
                queue.append(node.right)

        levels.append(current_level)

    return levels
```

`level_size` фиксирует количество узлов текущего уровня. Добавленные дети останутся в очереди для следующей итерации `while`.

## Итеративный DFS {#iterativnyy-dfs}

Рекурсивный DFS использует системный стек. Его можно заменить собственным стеком:

```python
def preorder_iterative(root: TreeNode | None) -> list[int]:
    if root is None:
        return []

    result: list[int] = []
    stack = [root]

    while stack:
        node = stack.pop()
        result.append(node.value)

        # Стек работает по LIFO, поэтому правый узел добавляется первым.
        # Левый окажется сверху и будет обработан раньше.
        if node.right is not None:
            stack.append(node.right)

        if node.left is not None:
            stack.append(node.left)

    return result
```

Если добавить левого ребенка первым, правый окажется сверху и порядок станет `root -> right -> left`.

## Что такое Binary Search Tree {#chto-takoe-binary-search-tree}

Binary Search Tree, или BST, поддерживает правило:

- все значения левого поддерева меньше значения узла;
- все значения правого поддерева больше значения узла;
- правило выполняется для каждого поддерева.

Важно: недостаточно сравнить узел только с непосредственными детьми.

Дерево ниже нарушает BST:

```text
      10
     /  \
    5    15
        /  \
       6    20
```

Узел `6` меньше своего родителя `15`, но находится в правом поддереве `10`, где все значения должны быть больше `10`.

## Пример 5. Проверка BST через границы {#primer-5-proverka-bst-cherez-granitsy}

```python
def is_valid_bst(root: TreeNode | None) -> bool:
    def validate(
        node: TreeNode | None,
        lower: float,
        upper: float,
    ) -> bool:
        if node is None:
            return True

        if not lower < node.value < upper:
            return False

        return (
            validate(node.left, lower, node.value)
            and validate(node.right, node.value, upper)
        )

    return validate(root, float("-inf"), float("inf"))
```

Границы передают ограничения всех предков:

- при движении влево уменьшается верхняя граница;
- при движении вправо увеличивается нижняя граница.

В этом варианте дубликаты не допускаются. Если условие задачи разрешает равные значения, правила границ нужно определить отдельно.

## Как выбрать DFS или BFS {#kak-vybrat-dfs-ili-bfs}

Используй DFS, когда:

- ответ естественно строится из поддеревьев;
- нужно обработать всю ветвь;
- требуется preorder, inorder или postorder;
- ищется высота, диаметр или свойство поддерева.

Используй BFS, когда:

- важны уровни;
- нужен ближайший узел;
- требуется минимальная глубина;
- нужно обработать дерево слой за слоем.

Оба обхода обычно работают за `O(n)`. Отличается порядок и максимальная дополнительная память.

## Частые ошибки {#chastye-oshibki}

1. Не обработать `root is None`.
2. Обратиться к полю узла до проверки `None`.
3. Перепутать высоту в узлах и высоту в ребрах.
4. Повторно вычислять высоту поддерева и получить `O(n²)`.
5. Проверять BST только относительно родителя.
6. Забыть, что рекурсивный DFS использует `O(h)` памяти.
7. Неверно добавить детей в стек итеративного preorder.
8. Изменить исходное дерево, когда требовалась копия.
9. Считать дерево сбалансированным без проверки всех поддеревьев.

## План занятий {#plan-zanyatiy}

1. Нарисуй дерево из семи узлов.
2. Запиши три порядка DFS вручную.
3. Реализуй обходы с одним результирующим списком.
4. Реши максимальную глубину и инвертирование.
5. Реализуй сравнение деревьев.
6. Разбери, что возвращает функция высоты в задаче про диаметр.
7. Повтори BFS по уровням.
8. Проверь BST через диапазоны предков.

## Задачи для самостоятельного решения {#zadachi-dlya-samostoyatelnogo-resheniya}

### Задача 1. Сбалансированное бинарное дерево {#zadacha-1-sbalansirovannoe-binarnoe-derevo}

Дерево считается сбалансированным, если для каждого узла высоты левого и правого поддеревьев отличаются не более чем на `1`.

Требования:

- пройти каждый узел не более одного раза;
- не запускать отдельное полное вычисление высоты для каждого узла;
- вернуть результат за `O(n)`.

Подсказка: внутренняя функция может вернуть высоту либо специальное значение, означающее, что поддерево уже несбалансированно.

### Задача 2. Наименьший общий предок в BST {#zadacha-2-naimenshiy-obshchiy-predok-v-bst}

Даны корень BST и два существующих узла `first` и `second`. Найди их самого нижнего общего предка.

Подумай:

- что означает ситуация, когда оба значения меньше текущего;
- что означает ситуация, когда оба значения больше текущего;
- в какой момент пути к узлам расходятся;
- можно ли решить задачу без рекурсии.

<RelatedTopics
    :items="[
        { title: 'Неделя 12. Recursion', href: '/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-12-recursion' },
        { title: 'Неделя 14. Grid', href: '/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-14-matritsy-i-grid-traversal' },
        { title: 'Неделя 10. Queue', href: '/python/algoritmy/etap-3-lineynye-struktury/nedelya-10-queue-i-deque' },
    ]"
/>
