---
title: "Неделя 6. Prefix Sum"
description: "Подробный разбор префиксных сумм, запросов диапазона, Prefix Sum с Hash Map и prefix/suffix products."
tags:
  - "python"
  - "algorithms"
  - "prefix-sum"
  - "patterns"
updatedAt: "2026-10-19"
---
## Цель недели {#tsel-nedeli}

Научиться один раз подготовить накопленные данные, чтобы быстро отвечать на запросы о диапазонах.

После недели нужно уметь:

- строить массив префиксных сумм;
- получать сумму любого диапазона за `O(1)`;
- понимать дополнительный ноль в начале префикса;
- находить количество подмассивов с заданной суммой;
- использовать накопления слева и справа;
- отличать Prefix Sum от Sliding Window.

## Главная идея {#glavnaya-ideya}

Пусть дан список:

```text
numbers = [3, 1, 4, 2]
```

Префиксная сумма хранит сумму всех элементов **до текущей границы**:

```text
prefix = [0, 3, 4, 8, 10]
```

Значения означают:

- `prefix[0] = 0` - взяли ноль элементов;
- `prefix[1] = 3` - сумма первого элемента;
- `prefix[2] = 4` - сумма первых двух элементов;
- `prefix[4] = 10` - сумма всего списка.

Длина `prefix` равна `len(numbers) + 1`.

## Зачем нужен ноль в начале {#zachem-nuzhen-nol-v-nachale}

Он позволяет использовать одну формулу для любого диапазона, включая диапазон с индекса `0`.

Сумма элементов от `left` до `right` включительно:

```text
prefix[right + 1] - prefix[left]
```

Почему это работает:

- `prefix[right + 1]` содержит все элементы до `right` включительно;
- `prefix[left]` содержит элементы до `left`, которые нужно убрать.

## Пример 1. Построение префикса {#primer-1-postroenie-prefiksa}

```python
def build_prefix_sum(numbers: list[int]) -> list[int]:
    prefix = [0]  # Сумма пустого начала списка.

    for number in numbers:
        # Последняя накопленная сумма плюс новый элемент.
        next_sum = prefix[-1] + number
        prefix.append(next_sum)

    return prefix
```

Для `[3, 1, 4, 2]` функция вернет `[0, 3, 4, 8, 10]`.

- Время построения: `O(n)`.
- Дополнительная память: `O(n)`.

## Пример 2. Сумма диапазона {#primer-2-summa-diapazona}

```python
class RangeSum:
    def __init__(self, numbers: list[int]) -> None:
        self.prefix = [0]

        for number in numbers:
            self.prefix.append(self.prefix[-1] + number)

    def sum_range(self, left: int, right: int) -> int:
        # right + 1 нужен, потому что prefix хранит границы между элементами.
        return self.prefix[right + 1] - self.prefix[left]
```

Для диапазона индексов `[1, 3]` списка `[3, 1, 4, 2]`:

```text
prefix[4] - prefix[1] = 10 - 3 = 7
```

Это сумма `1 + 4 + 2`.

- Подготовка: `O(n)`.
- Один запрос: `O(1)`.
- Память: `O(n)`.

Если запрос только один, обычный проход может быть проще. Prefix Sum особенно полезен при множестве запросов.

## Пример 3. Центральный индекс {#primer-3-tsentralnyy-indeks}

Нужно найти индекс, слева и справа от которого суммы равны.

Можно построить два массива сумм, но достаточно знать общую сумму и сумму слева.

```python
def find_pivot_index(numbers: list[int]) -> int:
    total_sum = sum(numbers)
    left_sum = 0

    for index, number in enumerate(numbers):
        # Из общей суммы убираем левую часть и текущий элемент.
        right_sum = total_sum - left_sum - number

        if left_sum == right_sum:
            return index

        # После проверки текущий элемент становится частью левой суммы.
        left_sum += number

    return -1
```

Для `[1, 7, 3, 6, 5, 6]` ответ равен `3`:

```text
слева:  1 + 7 + 3 = 11
справа: 5 + 6 = 11
```

## Prefix Sum вместе с Hash Map {#prefix-sum-vmeste-s-hash-map}

Сложная, но важная идея: если текущая префиксная сумма равна `current_sum`, а раньше встречалась сумма `current_sum - target`, то элементы между этими границами дают `target`.

```text
current_sum - previous_sum = target
previous_sum = current_sum - target
```

## Пример 4. Количество подмассивов с суммой target {#primer-4-kolichestvo-podmassivov-s-summoy-target}

```python
def count_subarrays(numbers: list[int], target: int) -> int:
    # До начала списка сумма 0 встретилась один раз.
    frequency_by_sum = {0: 1}
    current_sum = 0
    result = 0

    for number in numbers:
        current_sum += number

        required_sum = current_sum - target

        # Каждая предыдущая граница с required_sum образует подходящий
        # подмассив, заканчивающийся на текущей позиции.
        result += frequency_by_sum.get(required_sum, 0)

        # Текущая сумма станет доступна следующим элементам.
        frequency_by_sum[current_sum] = (
            frequency_by_sum.get(current_sum, 0) + 1
        )

    return result
```

### Почему хранится частота, а не только наличие {#pochemu-khranitsya-chastota-a-ne-tolko-nalichie}

Одна префиксная сумма может встретиться несколько раз. Каждое ее появление задает отдельную левую границу и отдельный подмассив.

Пример:

```text
numbers = [1, -1, 1]
target = 1
```

Подходящих подмассивов три:

- первый `[1]`;
- весь `[1, -1, 1]`;
- последний `[1]`.

- Время: `O(n)` в среднем.
- Память: `O(n)`.

Этот подход работает и с отрицательными числами, в отличие от многих решений Sliding Window для суммы.

## Prefix и Suffix {#prefix-i-suffix}

Иногда нужно знать накопленный результат слева и справа от каждого элемента.

Классический пример: произведение всех элементов, кроме текущего.

```python
def product_except_self(numbers: list[int]) -> list[int]:
    result = [1] * len(numbers)

    left_product = 1

    for index in range(len(numbers)):
        # В result[index] записываем произведение строго слева.
        result[index] = left_product
        left_product *= numbers[index]

    right_product = 1

    for index in range(len(numbers) - 1, -1, -1):
        # Умножаем левое произведение на произведение строго справа.
        result[index] *= right_product
        right_product *= numbers[index]

    return result
```

Для `[1, 2, 3, 4]` результат `[24, 12, 8, 6]`.

- Время: `O(n)`.
- Дополнительная память без учета результата: `O(1)`.

## Prefix Sum или Sliding Window {#prefix-sum-ili-sliding-window}

| Ситуация | Подход |
| --- | --- |
| Много запросов суммы диапазона | Prefix Sum |
| Нужно посчитать подмассивы с точной суммой и есть отрицательные числа | Prefix Sum + Hash Map |
| Нужен самый длинный допустимый участок положительных чисел | Sliding Window |
| Окно должно расширяться и сжиматься | Sliding Window |
| Нужны накопления слева и справа для каждой позиции | Prefix/Suffix |

## Частые ошибки {#chastye-oshibki}

1. Создать `prefix` длины `n`, а затем запутаться в границах.
2. Забыть `right + 1` в формуле диапазона.
3. Вычесть `prefix[left - 1]` и отдельно обрабатывать `left == 0` без необходимости.
4. Записать текущую сумму в словарь до подсчета ответа и случайно учесть пустой подмассив.
5. Хранить только множество префиксов, когда нужно количество подмассивов.
6. Использовать Prefix Sum там, где данные меняются после каждого запроса.

## План занятий {#plan-zanyatiy}

1. Построй префикс вручную для нескольких списков.
2. Реализуй запросы суммы диапазона.
3. Реши задачу на центральный индекс.
4. Разбери равенство `current_sum - previous_sum = target`.
5. Реализуй задачу с Hash Map сначала на бумаге, затем в коде.
6. Повтори prefix/suffix products без подсказки.

## Задачи для самостоятельного решения {#zadachi-dlya-samostoyatelnogo-resheniya}

### Задача 1. Количество диапазонов с суммой, кратной k {#zadacha-1-kolichestvo-diapazonov-s-summoy-kratnoy-k}

Дан список целых чисел и положительное число `k`. Посчитай количество непрерывных подмассивов, сумма которых делится на `k`.

```text
numbers = [4, 5, 0, -2, -3, 1]
k = 5
result = 7
```

Подсказка: если две префиксные суммы имеют одинаковый остаток от деления на `k`, разность между ними делится на `k`.

### Задача 2. Сумма прямоугольника {#zadacha-2-summa-pryamougolnika}

Дана матрица и много запросов вида `(row1, column1, row2, column2)`. Каждый запрос должен вернуть сумму прямоугольника за `O(1)` после предварительной подготовки.

Построй двумерный префикс. Продумай, какие области нужно сложить и вычесть по принципу включения-исключения.

<RelatedTopics
    :items="[
        { title: 'Неделя 5. Sliding Window', href: '/python/algoritmy/etap-2-patterny/nedelya-5-sliding-window' },
        { title: 'Неделя 7. Binary Search', href: '/python/algoritmy/etap-2-patterny/nedelya-7-binary-search' },
        { title: 'Обзор этапа 2', href: '/python/algoritmy/etap-2-patterny/glavnaya' },
    ]"
/>
