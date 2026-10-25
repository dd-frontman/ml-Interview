---
title: "Массивы и строки в алгоритмах"
description: "Индексы, проходы, изменение на месте, подмассивы, подпоследовательности, срезы, строки и матрицы в алгоритмических задачах на Python."
tags:
  - "python"
  - "algorithms"
  - "arrays"
  - "strings"
updatedAt: "2026-10-16"
---
## Массив в задачах и list в Python {#massiv-v-zadachakh-i-list-v-python}

В условиях алгоритмических задач часто используется слово «массив». В Python такой вход обычно представлен объектом `list`.

Список Python:

- хранит элементы в определенном порядке;
- допускает повторяющиеся значения;
- поддерживает доступ по индексу;
- является изменяемым;
- может хранить значения разных типов, хотя в алгоритмических задачах элементы обычно однотипные.

```python
numbers = [10, 20, 30, 40]

print(numbers[0])   # 10
print(numbers[-1])  # 40
```

Чтение элемента по известному индексу выполняется за `O(1)`.

## Индекс и значение {#indeks-i-znachenie}

В задаче важно различать:

- **индекс** - позицию элемента;
- **значение** - данные, находящиеся в этой позиции.

```python
numbers = [10, 20, 30]

for index, number in enumerate(numbers):
    print(index, number)  # 0 10, затем 1 20 и 2 30

# 0 10
# 1 20
# 2 30
```

Если для ответа нужна позиция, не теряй индекс при обходе.

## Основные способы обхода {#osnovnye-sposoby-obkhoda}

### Только значения {#tolko-znacheniya}

```python
for number in numbers:
    print(number)  # выводит очередное значение из numbers
```

Используй, когда позиция не нужна.

### Индекс и значение {#indeks-i-znachenie-2}

```python
for index, number in enumerate(numbers):
    print(index, number)  # выводит индекс и соответствующее значение
```

### Только индексы {#tolko-indeksy}

```python
for index in range(len(numbers)):
    numbers[index] *= 2
```

Такой вариант нужен, когда элемент изменяется на месте или требуется сравнение с соседями.

### Обратный обход {#obratnyy-obkhod}

```python
for index in range(len(numbers) - 1, -1, -1):
    print(numbers[index])  # выводит элементы от последнего к первому
```

Обратный проход полезен, когда изменение списка слева направо могло бы затронуть еще не обработанные элементы.

## Изменение на месте {#izmenenie-na-meste}

Изменить список на месте означает обновить переданный объект, не создавая отдельный список с полным результатом.

```python
def double_in_place(numbers: list[int]) -> None:
    for index in range(len(numbers)):
        numbers[index] *= 2


values = [1, 2, 3]
double_in_place(values)

print(values)  # [2, 4, 6]
```

- Время - `O(n)`.
- Дополнительная память - `O(1)`.

Важно заранее уточнить, разрешено ли менять входной список.

## Подмассив и подпоследовательность {#podmassiv-i-podposledovatelnost}

Эти понятия отличаются.

### Подмассив {#podmassiv}

Подмассив состоит из **непрерывного** участка массива.

Для списка `[1, 2, 3, 4]`:

- `[2, 3]` - подмассив;
- `[1, 4]` - не подмассив.

### Подпоследовательность {#podposledovatelnost}

Подпоследовательность сохраняет взаимный порядок элементов, но элементы не обязаны находиться рядом.

Для списка `[1, 2, 3, 4]`:

- `[1, 3, 4]` - подпоследовательность;
- `[3, 1]` - не подпоследовательность.

Если в условии написано `subarray`, чаще всего нужно работать с непрерывным диапазоном. Это важный сигнал для Sliding Window или Prefix Sum.

## Срезы создают копию {#srezy-sozdayut-kopiyu}

```python
numbers = [10, 20, 30, 40]
middle = numbers[1:3]

print(middle)  # [20, 30]
```

Срез из `k` элементов требует:

- `O(k)` времени;
- `O(k)` дополнительной памяти.

Это важно в рекурсии:

```python
def process(numbers: list[int]) -> None:
    if not numbers:
        return

    process(numbers[1:])
```

Каждый вызов создает новый список. Внешне короткий код выполняет дополнительное копирование. Часто лучше передавать индекс начала.

## Разворот последовательности {#razvorot-posledovatelnosti}

### Новый список {#novyy-spisok}

```python
numbers = [1, 2, 3]
reversed_numbers = numbers[::-1]

print(numbers)           # [1, 2, 3]
print(reversed_numbers)  # [3, 2, 1]
```

Срез создает новый список: время `O(n)`, память `O(n)`.

### Изменение списка на месте {#izmenenie-spiska-na-meste}

```python
numbers = [1, 2, 3]
numbers.reverse()

print(numbers)  # [3, 2, 1]
```

Время - `O(n)`, дополнительная память - `O(1)`.

### Два указателя {#dva-ukazatelya}

```python
def reverse_in_place(numbers: list[int]) -> None:
    left = 0
    right = len(numbers) - 1

    while left < right:
        numbers[left], numbers[right] = numbers[right], numbers[left]
        left += 1
        right -= 1
```

Эта реализация полезна для понимания паттерна Two Pointers.

## Удаление элементов на месте {#udalenie-elementov-na-meste}

Удалять элементы из середины списка во время прямого обхода опасно: индексы сдвигаются.

Для задачи «переместить нули в конец» можно сохранять позицию следующего ненулевого элемента:

```python
def move_zeroes(numbers: list[int]) -> None:
    insert_position = 0

    for number in numbers:
        if number != 0:
            numbers[insert_position] = number
            insert_position += 1

    while insert_position < len(numbers):
        numbers[insert_position] = 0
        insert_position += 1


values = [0, 1, 0, 3, 12]
move_zeroes(values)

print(values)  # [1, 3, 12, 0, 0]
```

- Время - `O(n)`.
- Дополнительная память - `O(1)`.

## Строки неизменяемы {#stroki-neizmenyaemy}

Нельзя заменить отдельный символ строки:

```python
text = "cat"
# text[0] = "b"  # TypeError
```

Каждая новая строка создается как отдельный объект.

Для большого количества изменений удобно преобразовать строку в список символов:

```python
characters = list("cat")
characters[0] = "b"
text = "".join(characters)

print(text)  # bat
```

## Палиндром и два указателя {#palindrom-i-dva-ukazatelya}

Палиндром одинаково читается слева направо и справа налево.

```python
def is_palindrome(text: str) -> bool:
    left = 0
    right = len(text) - 1

    while left < right:
        if text[left] != text[right]:
            return False

        left += 1
        right -= 1

    return True
```

- Время - `O(n)`.
- Дополнительная память - `O(1)`.

Решение через `text == text[::-1]` короче, но срез создает новую строку и требует `O(n)` памяти.

## Матрица как список списков {#matritsa-kak-spisok-spiskov}

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
]

print(matrix[0][1])  # 2
```

Первый индекс выбирает строку, второй - столбец.

Обход всех элементов матрицы размером `rows * columns`:

```python
for row in range(len(matrix)):
    for column in range(len(matrix[row])):
        print(matrix[row][column])  # 1, 2, 3, 4, 5 и 6 на отдельных строках
```

Время - `O(rows * columns)`.

## Ошибка со связанными строками матрицы {#oshibka-so-svyazannymi-strokami-matritsy}

Так делать не нужно:

```python
matrix = [[0] * 3] * 2
matrix[0][0] = 1

print(matrix)  # [[1, 0, 0], [1, 0, 0]]
```

Обе позиции внешнего списка ссылаются на одну внутреннюю строку.

Правильный вариант:

```python
matrix = [[0] * 3 for _ in range(2)]
matrix[0][0] = 1

print(matrix)  # [[1, 0, 0], [0, 0, 0]]
```

Теперь каждая строка создается отдельно.

## Граничные случаи {#granichnye-sluchai}

Перед отправкой решения проверь:

- пустой список или пустую строку;
- один элемент;
- два элемента;
- все элементы одинаковые;
- ответ находится в начале или конце;
- отрицательные числа;
- повторяющиеся значения;
- уже отсортированный вход;
- матрицу из одной строки или одного столбца.

## Практика {#praktika}

1. Разверни список на месте без `reverse()` и среза.
2. Проверь, является ли строка палиндромом.
3. Перемести все нули в конец списка, сохранив порядок остальных элементов.
4. Объедини два отсортированных списка.
5. Найди максимальное значение и его индекс за один проход.
6. Посчитай сумму главной диагонали квадратной матрицы.
7. Объясни разницу между подмассивом и подпоследовательностью на собственном примере.

## Критерий готовности {#kriteriy-gotovnosti}

Тема освоена, если ты можешь:

- выбрать подходящий способ обхода;
- изменить список на месте;
- оценить стоимость среза;
- объяснить неизменяемость строки;
- различить подмассив и подпоследовательность;
- безопасно создать матрицу;
- назвать время и память каждого решения.

<RelatedTopics
    :items="[
        { title: 'Big O', href: '/python/algoritmy/etap-1-osnovy/big-o-i-analiz-slozhnosti' },
        { title: 'Сложность операций Python', href: '/python/algoritmy/etap-1-osnovy/slozhnost-operatsiy-python' },
        { title: 'Хеширование и сортировка', href: '/python/algoritmy/etap-1-osnovy/heshirovanie-i-sortirovka' },
        { title: 'Индексы и срезы', href: '/python/yazyk-python/tipy-dannykh/indeksy-i-srezy' },
    ]"
/>
