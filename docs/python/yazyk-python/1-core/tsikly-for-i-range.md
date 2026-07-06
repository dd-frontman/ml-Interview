---
title: "Циклы for и range"
description: "Базовый конспект по циклу for и range в Python: перебор списков и строк, вложенные циклы, continue, break, изменение списка по индексам и поиск индексов символа."
tags:
  - "python"
  - "core"
  - "loops"
  - "range"
updatedAt: "2026-07-02"
---
## Зачем нужны циклы

Цикл нужен, когда одно действие нужно выполнить много раз.

Например:

- вывести все элементы списка;
- пройти по каждому символу строки;
- посчитать количество нужных символов;
- изменить элементы списка;
- построить таблицу умножения.

## `for`

`for` перебирает элементы последовательности.

```python
file_names = ["document1.txt", "image1.jpg", "document2.txt", "image2.jpg"]

for file_name in file_names:
    print(file_name)
```

На каждой итерации переменная `file_name` получает следующий элемент списка.

## Перебор строки

Строка тоже является последовательностью, поэтому по ней можно пройти циклом.

```python
greeting = "Hello, World!"

for char in greeting:
    print(char)
```

На каждой итерации `char` получает один символ строки.

## Подсчет символов

Чтобы посчитать, сколько раз символ встречается в строке, можно завести счетчик.

```python
greeting = "Hello, World!"
count_o = 0

for char in greeting:
    if char == "o":
        count_o += 1

print(count_o)  # 2
```

`count_o += 1` - короткая форма записи:

```python
count_o = count_o + 1
```

## Вложенные циклы

Вложенный цикл - это цикл внутри другого цикла.

```python
students = ["Alice", "Bob", "Charlie", "David"]

for student in students:
    print(student)

    for char in student:
        print(char)
```

Здесь внешний цикл перебирает студентов, а внутренний цикл перебирает буквы в имени текущего студента.

Внутренний цикл полностью выполняется для каждого значения внешнего цикла.

## `continue`

`continue` пропускает текущую итерацию и переходит к следующей.

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

for num in numbers:
    if num % 2 != 0:
        continue

    print(num)
```

В этом примере нечетные числа пропускаются, а четные выводятся.

Проверка:

```python
num % 2 != 0
```

означает: остаток от деления на `2` не равен `0`, то есть число нечетное.

## `break`

`break` досрочно завершает цикл.

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

for num in numbers:
    if num == 10:
        break

    print(num)
```

Когда `num` становится равен `10`, цикл останавливается. Число `10` уже не печатается, потому что `break` выполняется раньше `print()`.

## `range()`

`range()` создает диапазон чисел.

```python
range_object = range(10)
print(range_object)  # range(0, 10)
```

`range` - это не список. Если нужно увидеть все числа сразу, можно преобразовать его в список.

```python
numbers = list(range(10))
print(numbers)  # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

Правая граница не включается: `range(10)` дает числа от `0` до `9`.

## Варианты `range()`

Один аргумент:

```python
print(list(range(10)))
# [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

Два аргумента:

```python
print(list(range(1, 10)))
# [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

Три аргумента:

```python
print(list(range(1, 10, 2)))
# [1, 3, 5, 7, 9]
```

Формат:

```python
range(start, stop, step)
```

Где:

- `start` - с какого числа начать;
- `stop` - перед каким числом остановиться;
- `step` - с каким шагом идти.

## Обратный `range()`

Чтобы идти назад, нужен отрицательный шаг.

```python
print(list(range(10, 1, -1)))
# [10, 9, 8, 7, 6, 5, 4, 3, 2]
```

Здесь стартуем с `10`, идем вниз с шагом `-1` и останавливаемся перед `1`.

## Почему простое изменение переменной не меняет список

Если в цикле изменить переменную, сам список не изменится.

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

for number in numbers:
    number = number + 1

print(numbers)  # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

`number` - это временная переменная цикла. Присваивание `number = number + 1` меняет только эту переменную, а не элемент внутри списка.

## Изменение списка по индексам

Чтобы изменить элементы списка, нужно обращаться к ним по индексу.

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

for i in range(len(numbers)):
    numbers[i] += 1

print(numbers)  # [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

Что здесь происходит:

- `len(numbers)` возвращает длину списка;
- `range(len(numbers))` дает индексы от `0` до последнего;
- `numbers[i] += 1` меняет элемент списка по индексу.

## Обход списка с конца

Можно пройти по индексам в обратном порядке.

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

for i in range(len(numbers) - 1, -1, -1):
    print(numbers[i])
    numbers[i] += 1

print(numbers)  # [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

Разбор:

- `len(numbers) - 1` - индекс последнего элемента;
- `-1` как `stop` нужен, чтобы дойти до индекса `0`;
- последний `-1` - шаг назад.

## Поиск индексов символа

Чтобы найти все позиции буквы в строке, удобно идти по индексам.

```python
greeting = "Hello, World!"
indexes = []
letter = "o"
count = 0

for i in range(len(greeting)):
    if greeting[i] == letter:
        indexes.append(i)
        count += 1

print(count)    # 2
print(indexes)  # [4, 8]
```

Здесь `i` - индекс символа, а `greeting[i]` - сам символ по этому индексу.

## Задача: таблица умножения

Нужно вывести таблицу умножения от `1 * 1` до `9 * 9`.

```python
for i in range(1, 10):
    for j in range(1, 10):
        print(i, "*", j, "=", i * j)
```

Что здесь происходит:

- внешний цикл выбирает первое число;
- внутренний цикл выбирает второе число;
- `range(1, 10)` дает числа от `1` до `9`;
- `i * j` считает результат умножения.

Пример одной строки вывода:

```text
9 * 9 = 81
```

## Когда нужен обычный перебор, а когда индексы

Обычный перебор удобнее, когда нужно только прочитать значения.

```python
for number in numbers:
    print(number)
```

Индексы нужны, когда нужно:

- изменить элемент списка;
- знать позицию элемента;
- идти по списку в обратном порядке через `range()`.

```python
for i in range(len(numbers)):
    numbers[i] += 1
```

## Частые ошибки

1. Думать, что правая граница `range()` включается.
   Проблема: `range(1, 10)` дает числа до `9`.
   Решение: помнить правило: `stop` не включается.

2. Ожидать, что `range()` сразу является списком.
   Проблема: `print(range(10))` покажет `range(0, 10)`.
   Решение: для просмотра использовать `list(range(10))`.

3. Изменять временную переменную цикла вместо элемента списка.
   Проблема: `number = number + 1` не меняет список.
   Решение: менять элемент по индексу: `numbers[i] += 1`.

4. Забывать, что `break` останавливает цикл до кода ниже.
   Проблема: если `break` стоит перед `print()`, текущее значение не будет напечатано.
   Решение: внимательно выбирать порядок команд внутри цикла.

5. Путать `break` и `continue`.
   Проблема: `break` завершает цикл полностью, а `continue` пропускает только текущую итерацию.
   Решение: использовать `continue` для пропуска, `break` для остановки.

6. Путать переменные во вложенных циклах.
   Проблема: легко использовать `i` вместо `j` или наоборот.
   Решение: для учебных задач можно использовать `i` и `j`, а в реальном коде лучше давать понятные имена.

## Cheat-sheet

| Синтаксис | Что делает |
| --- | --- |
| `for item in items:` | Перебирает элементы |
| `for char in text:` | Перебирает символы строки |
| `range(10)` | Числа от `0` до `9` |
| `range(1, 10)` | Числа от `1` до `9` |
| `range(1, 10, 2)` | Числа от `1` до `9` с шагом `2` |
| `range(10, 1, -1)` | Числа от `10` до `2` в обратном порядке |
| `range(len(items))` | Индексы списка |
| `items[i]` | Элемент по индексу |
| `continue` | Пропустить текущую итерацию |
| `break` | Завершить цикл |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Python Tutorial: for statements', href: 'https://docs.python.org/3/tutorial/controlflow.html#for-statements' },
        { title: 'Python Tutorial: range()', href: 'https://docs.python.org/3/tutorial/controlflow.html#the-range-function' },
        { title: 'Python Reference: for statement', href: 'https://docs.python.org/3/reference/compound_stmts.html#the-for-statement' },
        { title: 'Python Tutorial: break and continue', href: 'https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements' },
        { title: 'Python Built-in Types: range', href: 'https://docs.python.org/3/library/stdtypes.html#ranges' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Boolean и условия', href: '/python/yazyk-python/1-core/boolean-i-usloviya' },
        { title: 'Списки: базовые операции', href: '/python/yazyk-python/tipy-dannykh/spiski-bazovye-operatsii' },
        { title: 'Индексы и срезы', href: '/python/yazyk-python/tipy-dannykh/indeksy-i-srezy' },
        { title: 'Итераторы, генераторы и comprehensions', href: '/python/yazyk-python/iteratory-generatory-i-comprehensions' },
    ]"
/>
