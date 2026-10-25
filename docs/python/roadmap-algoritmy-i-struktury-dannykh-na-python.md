---
title: "Roadmap: алгоритмы и структуры данных на Python"
description: "План подготовки к алгоритмическим собеседованиям на Python на 24 недели: Big O, паттерны, структуры данных, деревья, графы, DP и mock interviews."
tags:
  - "python"
  - "algorithms"
  - "data-structures"
  - "interview"
  - "roadmap"
updatedAt: "2026-10-16"
search: false
---
## Цель роадмапа {#tsel-roadmapa}

Цель - научиться самостоятельно решать алгоритмические задачи уровня Easy и значительную часть Medium на Python, объяснять ход решения и оценивать его сложность.

Основная траектория рассчитана на:

- 24 недели;
- 7-10 часов в неделю;
- 100 качественно разобранных задач как основную цель;
- до 130 задач как расширенную цель;
- регулярное повторение и минимум 6 пробных интервью.

Количество закрытых задач не является главным показателем. Лучше самостоятельно решить и повторить 100 задач, чем один раз посмотреть 130 готовых решений.

## Предварительные знания {#predvaritelnye-znaniya}

Перед началом нужно уверенно использовать:

- переменные, условия и циклы;
- функции и `return`;
- строки, списки, кортежи, словари и множества;
- индексы и срезы;
- `enumerate()`, `zip()`, `min()`, `max()` и `sum()`;
- базовые аннотации типов.

Если эти темы вызывают сложности, сначала пройди первые шесть недель [роадмапа Python для ML-инженера](./roadmap-python-dlya-ml-inzhenera.md) или соответствующие уроки языка. ML-часть для алгоритмической подготовки проходить не требуется.

## Что должно получаться на собеседовании {#chto-dolzhno-poluchatsya-na-sobesedovanii}

Для каждой задачи используй один и тот же порядок:

1. Уточнить входные данные и ограничения.
2. Привести обычный и граничный пример.
3. Предложить простое решение, даже если оно медленное.
4. Найти повторяющуюся работу и подходящую структуру данных.
5. Объяснить инвариант оптимизированного решения.
6. Назвать временную и пространственную сложность.
7. Написать код.
8. Проверить решение на подготовленных примерах.

На интервью оценивается не только итоговый код. Важно показывать ход мысли, замечать ограничения и самостоятельно находить ошибки.

## Карта обучения {#karta-obucheniya}

| Этап | Недели | Результат |
| --- | --- | --- |
| [1. Big O и Python toolkit](./algoritmy/etap-1-osnovy/glavnaya.md) | 1-3 | Выбор подходящей встроенной структуры и оценка операций |
| [2. Основные паттерны](./algoritmy/etap-2-patterny/glavnaya.md) | 4-8 | Two Pointers, Sliding Window, Prefix Sum, Binary Search и Intervals |
| [3. Линейные структуры](./algoritmy/etap-3-lineynye-struktury/glavnaya.md) | 9-11 | Stack, Monotonic Stack, Queue, Deque и Linked List |
| [4. Рекурсия и обходы](./algoritmy/etap-4-rekursiya-derevya-grafy/glavnaya.md) | 12-17 | Trees, матрицы, Graphs, Backtracking и Heap |
| [5. Оптимизационные подходы](./algoritmy/etap-5-greedy-dp/glavnaya.md) | 18-21 | Greedy, Dynamic Programming и дополнительный графовый трек |
| [6. Интервью](./algoritmy/etap-6-praktika-intervyu/glavnaya.md) | 22-24 | Смешанные задачи, повторение и mock interviews |

Начиная с четвертой недели каждую неделю решай хотя бы одну задачу по старым темам без названия паттерна.

## Как распределять время {#kak-raspredelyat-vremya}

| Работа | Доля времени |
| --- | --- |
| Теория и разобранные примеры | 20% |
| Самостоятельное решение | 45% |
| Повторное решение | 15% |
| Разбор ошибок | 10% |
| Смешанные задачи и интервью | 10% |

Обычная неделя:

- 3-5 новых задач по текущей теме;
- одна смешанная задача по старым темам;
- повторение одной сложной задачи;
- разбор сложности каждого решения;
- запись ошибок и подсказок в журнал.

## Этап 1. Big O и Python toolkit {#etap-1-big-o-i-python-toolkit}

Подробные материалы первого этапа вынесены в отдельный раздел:

1. [Big O и анализ сложности](./algoritmy/etap-1-osnovy/big-o-i-analiz-slozhnosti.md).
2. [Сложность операций Python](./algoritmy/etap-1-osnovy/slozhnost-operatsiy-python.md).
3. [Массивы и строки](./algoritmy/etap-1-osnovy/massivy-i-stroki.md).
4. [Хеширование и сортировка](./algoritmy/etap-1-osnovy/heshirovanie-i-sortirovka.md).

Ниже остается краткий план этапа по неделям. Объяснения, примеры и упражнения находятся на отдельных страницах.

### Неделя 1. Анализ сложности {#nedelya-1-analiz-slozhnosti}

Изучи:

- Big O, Big Omega и Big Theta;
- `O(1)`, `O(log n)`, `O(n)`, `O(n log n)`, `O(n²)` и экспоненциальный рост;
- сложность последовательных и вложенных циклов;
- временную и пространственную сложность;
- амортизированную стоимость;
- time-space tradeoff;
- влияние рекурсии на память.

Практика: определить сложность 15 фрагментов Python-кода и объяснить, откуда берется каждый множитель.

### Стоимость операций Python {#stoimost-operatsiy-python}

| Операция | Обычная сложность |
| --- | --- |
| `items[index]` | `O(1)` |
| `items.append(value)` | амортизированно `O(1)` |
| `items.pop()` | `O(1)` |
| `items.insert(0, value)` | `O(n)` |
| `items.pop(0)` | `O(n)` |
| `value in items` | `O(n)` |
| `items[start:stop]` | `O(k)` времени и памяти |
| `key in mapping` | в среднем `O(1)` |
| `value in values_set` | в среднем `O(1)` |
| `sorted(items)` | `O(n log n)` |
| `deque.append()` и `deque.popleft()` | приблизительно `O(1)` |
| `heappush()` и `heappop()` | `O(log n)` |

Для `dict` и `set` значение `O(1)` является средней, а не гарантированной худшей сложностью.

### Неделя 2. Arrays и Strings {#nedelya-2-arrays-i-strings}

Изучи:

- индексы и проход по последовательности;
- изменение массива на месте;
- подмассив и подпоследовательность;
- срезы и их стоимость;
- неизменяемость строк;
- разворот последовательности;
- матрицу как список списков.

Python-ловушка:

```python
matrix = [[0] * columns] * rows
```

Так создаются ссылки на одну внутреннюю строку. Безопасный вариант:

```python
matrix = [[0] * columns for _ in range(rows)]
```

Рекомендуемые задачи: `Reverse String`, `Valid Palindrome`, `Merge Sorted Array`, `Move Zeroes`, `Longest Common Prefix`.

### Неделя 3. Hashing и сортировка {#nedelya-3-hashing-i-sortirovka}

Изучи:

- `dict`, `set`, hashability и tuple-ключи;
- частотный словарь;
- `collections.Counter`;
- `collections.defaultdict`;
- `sorted()` и `.sort()`;
- `key`, `reverse` и стабильность сортировки;
- лексикографическое сравнение кортежей.

Сначала реализуй частотный словарь обычным `dict`, затем используй `Counter` там, где он делает решение понятнее.

Рекомендуемые задачи: `Two Sum`, `Contains Duplicate`, `Valid Anagram`, `Group Anagrams`, `Majority Element`, `Top K Frequent Elements`.

**Контрольная точка:** выбрать между `list`, `dict`, `set`, `tuple` и `deque`; назвать сложность основных операций; заметить скрытое копирование среза.

## Этап 2. Основные паттерны {#etap-2-osnovnye-patterny}

### Неделя 4. Two Pointers {#nedelya-4-two-pointers}

Изучи:

- указатели навстречу друг другу;
- указатели в одном направлении;
- работу с отсортированными массивами;
- удаление дубликатов;
- поиск пары;
- Fast and Slow Pointers как отдельную разновидность.

Задачи: `Valid Palindrome`, `Two Sum II`, `Remove Duplicates from Sorted Array`, `Container With Most Water`, `3Sum`.

### Неделя 5. Sliding Window {#nedelya-5-sliding-window}

Изучи фиксированное и динамическое окно, расширение правой границы, сжатие левой границы и состояние окна через словарь.

Задачи: `Maximum Average Subarray I`, `Best Time to Buy and Sell Stock`, `Longest Substring Without Repeating Characters`, `Permutation in String`, `Minimum Size Subarray Sum`.

### Неделя 6. Prefix Sum и Prefix/Suffix {#nedelya-6-prefix-sum-i-prefix-suffix}

Изучи:

- префиксные суммы;
- быстрый ответ на запрос суммы диапазона;
- Prefix Sum вместе с Hash Map;
- prefix/suffix products;
- difference array как дополнительную тему.

Задачи: `Running Sum of 1d Array`, `Find Pivot Index`, `Range Sum Query`, `Product of Array Except Self`, `Subarray Sum Equals K`.

### Неделя 7. Binary Search и bisect {#nedelya-7-binary-search-i-bisect}

Изучи:

- классический бинарный поиск;
- инвариант границ;
- поиск первой подходящей позиции;
- lower bound и upper bound;
- поиск в повернутом массиве;
- Binary Search on Answer.

Сначала напиши бинарный поиск и границы вручную. После этого изучи `bisect_left()` и `bisect_right()`.

Важно: `bisect` находит позицию за `O(log n)`, но вставка через `insort()` остается `O(n)` из-за сдвига элементов списка.

Задачи: `Binary Search`, `Search Insert Position`, `First Bad Version`, `Search in Rotated Sorted Array`, `Find Minimum in Rotated Sorted Array`, `Koko Eating Bananas`.

### Неделя 8. Sorting и Intervals {#nedelya-8-sorting-i-intervals}

Изучи:

- сортировку по одному и нескольким ключам;
- merge sort и quicksort на уровне принципа;
- пересечение и объединение интервалов;
- сортировку интервалов по началу;
- текущую правую границу;
- sweep line как дополнительный подход.

Задачи: `Sort Colors`, `Merge Intervals`, `Insert Interval`, `Non-overlapping Intervals`, `Meeting Rooms`.

В конце недели проведи первое диагностическое интервью с задачей, для которой заранее не указан паттерн.

**Контрольная точка:** распознать Two Pointers, Sliding Window, Prefix Sum и Binary Search; объяснить переход от `O(n²)` к `O(n)` или `O(n log n)`; решить несколько смешанных задач.

## Этап 3. Линейные структуры данных {#etap-3-lineynye-struktury-dannykh}

### Неделя 9. Stack и Monotonic Stack {#nedelya-9-stack-i-monotonic-stack}

Обычный стек в Python удобно реализуется через `list` с `append()` и `pop()`.

Изучи:

- LIFO;
- проверку скобочных последовательностей;
- хранение индексов в стеке;
- монотонно возрастающий и убывающий стек;
- Next Greater Element.

Задачи: `Valid Parentheses`, `Min Stack`, `Evaluate Reverse Polish Notation`, `Daily Temperatures`, `Next Greater Element`, `Largest Rectangle in Histogram`.

### Неделя 10. Queue и deque {#nedelya-10-queue-i-deque}

Для очереди используй `collections.deque`, а не `list.pop(0)`.

Изучи:

- FIFO;
- `append()`, `appendleft()`, `pop()` и `popleft()`;
- очередь с индексом `head`;
- bounded deque;
- монотонную очередь как дополнительную тему.

Нужно понимать, что быстрые операции `deque` находятся по краям. Произвольный доступ к середине не является сильной стороной этой структуры.

### Неделя 11. Linked List {#nedelya-11-linked-list}

Изучи:

- узел и ссылку `next`;
- singly и doubly linked list;
- dummy node;
- разворот списка;
- Fast and Slow Pointers;
- обнаружение цикла.

Задачи: `Reverse Linked List`, `Merge Two Sorted Lists`, `Linked List Cycle`, `Middle of the Linked List`, `Remove Nth Node From End of List`.

**Контрольная точка:** выбрать stack, queue, deque или linked list по требуемым операциям; реализовать очередь и односвязный список без библиотеки.

## Этап 4. Рекурсия, деревья и графы {#etap-4-rekursiya-derevya-i-grafy}

### Неделя 12. Recursion {#nedelya-12-recursion}

Изучи базовый случай, рекурсивный переход, стек вызовов, возврат результата, divide and conquer и memoization.

В Python нельзя рассчитывать на оптимизацию хвостовой рекурсии. Для очень глубоких деревьев и графов может понадобиться итеративный обход с собственным стеком.

Практика: `Factorial`, `Pow(x, n)`, рекурсивный Binary Search, Merge Sort и Fibonacci с ручной мемоизацией.

### Неделя 13. Binary Trees {#nedelya-13-binary-trees}

Изучи:

- Binary Tree и Binary Search Tree;
- preorder, inorder и postorder;
- рекурсивный и итеративный DFS;
- BFS и level-order traversal;
- высоту, глубину и диаметр;
- проверку свойств BST.

Задачи: `Maximum Depth of Binary Tree`, `Invert Binary Tree`, `Same Tree`, `Diameter of Binary Tree`, `Binary Tree Level Order Traversal`, `Validate Binary Search Tree`.

### Неделя 14. Матрицы и Grid Traversal {#nedelya-14-matritsy-i-grid-traversal}

Изучи:

- координаты `(row, column)`;
- проверку границ;
- четыре направления движения;
- множество `visited`;
- DFS и BFS по сетке;
- изменение матрицы на месте.

Кортеж `(row, column)` можно хранить в `set`, потому что он неизменяемый и хешируемый.

Задачи: `Flood Fill`, `Number of Islands`, `Max Area of Island`, `Rotting Oranges`, `Pacific Atlantic Water Flow`.

### Неделя 15. Graphs {#nedelya-15-graphs}

Изучи:

- directed и undirected graph;
- adjacency list и adjacency matrix;
- DFS, BFS и connected components;
- множество `visited`;
- обнаружение циклов;
- сложность `O(V + E)`.

Задачи: `Find if Path Exists in Graph`, `Clone Graph`, `Number of Provinces`, `Course Schedule`.

### Неделя 16. Backtracking {#nedelya-16-backtracking}

Рассматривай backtracking как DFS по дереву решений:

```text
choose -> explore -> unchoose
```

Изучи комбинации, перестановки, pruning и восстановление состояния.

Задачи: `Subsets`, `Permutations`, `Combination Sum`, `Letter Combinations of a Phone Number`, `Generate Parentheses`.

Не заменяй первую реализацию backtracking вызовом `itertools.permutations()`.

### Неделя 17. Heap и Priority Queue {#nedelya-17-heap-i-priority-queue}

Изучи min-heap, heap invariant, `heapify()`, `heappush()`, `heappop()` и задачи Top K.

Модуль `heapq` исторически предоставляет min-heap. Публичный max-heap API появился в Python 3.14, но версия Python на платформе собеседования может быть старше. Для совместимости max-heap часто моделируют отрицательным числовым приоритетом.

Если в куче лежат кортежи с одинаковым приоритетом, Python сравнивает следующие элементы. Для несравнимых объектов добавляй уникальный счетчик:

```python
(priority, order, value)
```

Задачи: `Last Stone Weight`, `Kth Largest Element in an Array`, `K Closest Points to Origin`, `Task Scheduler`, `Merge K Sorted Lists`.

После недели проведи второе диагностическое интервью.

**Контрольная точка:** написать DFS и BFS, выполнить level-order traversal, решить задачу на сетку, использовать `visited`, объяснить сложность через вершины и ребра.

## Этап 5. Greedy, DP и продвинутый трек {#etap-5-greedy-dp-i-prodvinutyy-trek}

### Неделя 18. Greedy {#nedelya-18-greedy}

Изучи локально оптимальный выбор, доказательство корректности, связь greedy с сортировкой и ситуации, когда жадный подход не работает.

Задачи: `Maximum Subarray`, `Jump Game`, `Jump Game II`, `Gas Station`, `Partition Labels`.

### Неделя 19. Dynamic Programming I {#nedelya-19-dynamic-programming-i}

Для каждой DP-задачи явно формулируй:

1. Состояние.
2. Переход.
3. Базовые случаи.
4. Порядок вычисления.
5. Место хранения результата.

Изучи memoization, tabulation, top-down и bottom-up.

Задачи: `Climbing Stairs`, `Min Cost Climbing Stairs`, `House Robber`, `Coin Change`, `Decode Ways`.

Сначала напиши мемоизацию обычным словарем, затем используй `functools.cache`.

### Неделя 20. Dynamic Programming II {#nedelya-20-dynamic-programming-ii}

Изучи двумерное состояние, Grid DP, Knapsack, оптимизацию памяти и восстановление решения.

Задачи: `Unique Paths`, `Minimum Path Sum`, `Longest Common Subsequence`, `Partition Equal Subset Sum`, `Longest Increasing Subsequence`.

Базовое двумерное DP входит в основной план. Сложные оптимизации и специализированные задачи можно отложить.

### Неделя 21. Продвинутый трек {#nedelya-21-prodvinutyy-trek}

Эта неделя обязательна только для компаний с сильной алгоритмической секцией.

Темы:

- Topological Sort и алгоритм Кана;
- Union Find, path compression и union by rank;
- Dijkstra;
- Trie;
- Bit Manipulation.

Если эти темы не встречаются в требованиях компании, используй неделю для повторения базовых паттернов и смешанных Medium-задач.

**Контрольная точка:** самостоятельно сформулировать состояние DP и переход, а не воспроизвести запомнившуюся формулу.

## Этап 6. Смешанная практика и интервью {#etap-6-smeshannaya-praktika-i-intervyu}

### Неделя 22. Mixed Problems {#nedelya-22-mixed-problems}

Убери названия паттернов и решай задачи в случайном порядке.

Для каждой задачи:

1. Проговори ограничения.
2. Предложи brute-force решение.
3. Найди узкое место.
4. Выбери структуру данных или паттерн.
5. Напиши решение без подсказки.
6. Проверь граничные случаи.
7. Назови Time и Space Complexity.

Цель недели: 8-10 смешанных задач и одно пробное интервью.

### Неделя 23. Mock Interviews {#nedelya-23-mock-interviews}

Проведи два полноценных интервью по 45-60 минут. После каждого отдельно оцени:

- понимание условия;
- качество вопросов;
- выбор подхода;
- корректность кода;
- анализ сложности;
- проверку примеров;
- коммуникацию;
- самостоятельное исправление ошибок.

### Неделя 24. Финальная диагностика {#nedelya-24-finalnaya-diagnostika}

Проведи еще два или три интервью, повтори слабые паттерны и пройди чек-лист Python-ошибок.

Всего за курс должно быть не меньше шести пробных интервью: после недель 8 и 17, одно на неделе 22 и минимум три на неделях 23-24.

## Python-чек-лист перед интервью {#python-chek-list-pered-intervyu}

- `list.pop(0)` работает за `O(n)`; для очереди нужен `deque`.
- Срез создает новый объект и требует дополнительную память.
- `[[0] * columns] * rows` создает связанные строки матрицы.
- `.sort()` изменяет список и возвращает `None`.
- `is` обычно используется для `None`, значения сравниваются через `==`.
- Изменяемое значение параметра по умолчанию сохраняется между вызовами.
- `list`, `dict` и `set` нельзя использовать как ключи словаря.
- Кортеж является ключом только тогда, когда все его элементы хешируемы.
- `set` не нужно использовать как упорядоченную коллекцию.
- `dict` сохраняет порядок добавления, но не сортирует ключи.
- `//` округляет вниз, что важно для отрицательных чисел.
- Генератор исчерпывается после полного обхода.
- Не называй переменные `list`, `dict`, `set`, `str` или `sum`.
- Учитывай ограничение глубины рекурсии.
- Проверяй версию Python перед использованием нового max-heap API.

## Что можно использовать и что нужно реализовать {#chto-mozhno-ispolzovat-i-chto-nuzhno-realizovat}

Обычно на интервью разрешено использовать стандартные структуры и модули Python:

- `list`, `dict`, `set`, `tuple`;
- `Counter`, `defaultdict`, `deque`;
- `heapq` и `bisect`;
- `sorted()` и `.sort(key=...)`;
- `enumerate()`, `zip()`, `min()`, `max()`, `sum()`, `any()` и `all()`;
- `functools.cache` после понимания ручной мемоизации.

Хотя бы один раз самостоятельно реализуй:

- частотный словарь;
- очередь;
- односвязный список;
- бинарный поиск, lower bound и upper bound;
- merge sort и quicksort;
- min-heap;
- обходы дерева;
- DFS и BFS;
- backtracking;
- memoization;
- Union Find, Topological Sort и Dijkstra, если выбран продвинутый трек.

Не заменяй проверяемый алгоритм готовой функцией. Например, первая задача на бинарный поиск должна быть решена без `bisect`, а первая задача на перестановки - без `itertools.permutations()`.

## Система повторения {#sistema-povtoreniya}

Повторяй сложную задачу:

- через один день;
- через одну неделю;
- через три недели.

При повторении сначала назови паттерн и инвариант, затем напиши код с чистого листа. Если воспроизводится только запомнившийся код, выбери новую задачу на тот же паттерн.

Журнал задач:

| Поле | Пример |
| --- | --- |
| Задача | Longest Substring Without Repeating Characters |
| Паттерн | Sliding Window |
| Решено самостоятельно | Частично |
| Время | 34 минуты |
| Time Complexity | `O(n)` |
| Space Complexity | `O(k)` |
| Подсказка | Понадобилась идея с левой границей |
| Ошибка | Не удалил символ из состояния окна |
| Дата повторения | Через 7 дней |

## Критерий готовности {#kriteriy-gotovnosti}

Подготовку можно считать успешной, когда кандидат:

1. Решает не менее 80% новых Easy-задач за 15-20 минут.
2. Решает около 50-60% новых Medium-задач за 30-40 минут в рамках изученных тем.
3. Сначала объясняет подход, а затем пишет код.
4. Правильно определяет временную и пространственную сложность.
5. Самостоятельно составляет тестовые примеры и замечает граничные случаи.
6. Может перейти от brute force к оптимизированному решению.
7. Решает смешанные задачи без названия паттерна.
8. Повторно решает сложную задачу через 7-21 день.
9. Проходит несколько mock interviews без критических подсказок.

Это учебные ориентиры, а не гарантия прохождения конкретного собеседования.

## Что изучать после основной программы {#chto-izuchat-posle-osnovnoy-programmy}

Для компаний с особенно сильным алгоритмическим отбором можно добавить:

- Segment Tree и Fenwick Tree;
- Bellman-Ford и Floyd-Warshall;
- сложные строковые алгоритмы;
- расширенный Trie;
- сложное двумерное и интервальное DP;
- competitive programming techniques.

Не переходи к ним, пока основные паттерны не решаются без подсказок.

<OfficialDocsLinks
    :links="[
        { title: 'Python: Data Structures', href: 'https://docs.python.org/3/tutorial/datastructures.html' },
        { title: 'Python: collections and deque', href: 'https://docs.python.org/3/library/collections.html' },
        { title: 'Python: Sorting Techniques', href: 'https://docs.python.org/3/howto/sorting.html' },
        { title: 'Python: bisect', href: 'https://docs.python.org/3/library/bisect.html' },
        { title: 'Python: heapq', href: 'https://docs.python.org/3/library/heapq.html' },
        { title: 'Python: functools cache', href: 'https://docs.python.org/3/library/functools.html' },
        { title: 'Python: itertools', href: 'https://docs.python.org/3/library/itertools.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Roadmap Python для ML-инженера', href: '/python/roadmap-python-dlya-ml-inzhenera' },
        { title: 'Типы данных', href: '/python/yazyk-python/tipy-dannykh/tipy-glavnaya' },
        { title: 'Списки: базовые операции', href: '/python/yazyk-python/tipy-dannykh/spiski-bazovye-operatsii' },
        { title: 'Словари dict', href: '/python/yazyk-python/tipy-dannykh/slovari-dict' },
        { title: 'Множества set', href: '/python/yazyk-python/tipy-dannykh/mnozhestva-set' },
        { title: 'Sorted и filter', href: '/python/yazyk-python/1-core/sorted-i-filter' },
    ]"
/>
