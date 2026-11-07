---
title: "Цикл while"
description: "Конспект по циклу while в Python: условие продолжения, счетчик, truthy/falsy коллекции, бесконечный цикл, break, else и практическая симуляция со ставками."
tags:
  - "python"
  - "core"
  - "loops"
  - "while"
updatedAt: "2026-11-05"
---
## Когда нужен `while` {#kogda-nuzhen-while}

`while` выполняет блок кода, пока условие истинно.

```python
counter = 1

while counter <= 5:
    print(f"Counter is: {counter}")
    counter += 1
```

Результат:

```text
Counter is: 1
Counter is: 2
Counter is: 3
Counter is: 4
Counter is: 5
```

`while` удобен, когда заранее неизвестно точное количество повторений.

## Как работает условие {#kak-rabotaet-uslovie}

Перед каждой итерацией Python проверяет условие после `while`.

```python
while counter <= 5:
    ...
```

Если условие истинно, тело цикла выполняется. Если условие ложно, цикл завершается.

Важно менять данные, от которых зависит условие.

```python
counter += 1
```

Без этой строки `counter` не изменится, и цикл может стать бесконечным.

## `while` со списком {#while-so-spiskom}

Список можно использовать как условие.

```python
my_list = [0, 1, 2]

while my_list:
    element = my_list.pop()
    print(f"element: {element}")

print(my_list)  # []
```

Пустой список считается `False`, непустой - `True`.

Что происходит:

- пока список непустой, условие `while my_list` истинно;
- `pop()` удаляет и возвращает последний элемент;
- когда список становится пустым, цикл завершается.

Вывод:

```text
element: 2
element: 1
element: 0
[]
```

## Бесконечный цикл {#beskonechnyy-tsikl}

`while True` создает бесконечный цикл.

```python
while True:
    print("Infinite loop!")
```

Такой цикл нужно останавливать вручную или через условие внутри тела цикла.

## `break` {#break}

`break` завершает цикл.

```python
while True:
    answer = input("Enter a number: ")

    if answer == "quit":
        break

    print(f"You entered: {answer}")
```

Здесь цикл продолжается бесконечно, пока пользователь не введет `"quit"`.

`break` часто используют вместе с `while True`, когда условие остановки удобнее проверить внутри цикла.

## Блок `else` в цикле `while` {#blok-else-v-tsikle-while}

После `while` можно добавить блок `else`. Он выполняется, когда цикл завершился обычным способом: условие после `while` стало ложным.

```python
counter = 1

while counter <= 3:
    print(counter)
    counter += 1
else:
    print("Цикл завершен")
```

Вывод:

```text
1
2
3
Цикл завершен
```

После третьей итерации `counter` становится равен `4`. Условие `counter <= 3` возвращает `False`, поэтому Python переходит в блок `else`.

### Когда `else` не выполняется {#kogda-else-ne-vypolnyaetsya}

Если выйти из цикла с помощью `break`, блок `else` будет пропущен.

```python
counter = 1

while counter <= 3:
    if counter == 2:
        break

    print(counter)
    counter += 1
else:
    print("Цикл завершен")

print("После цикла")
```

Вывод:

```text
1
После цикла
```

На второй итерации срабатывает `break`. Он немедленно завершает цикл, поэтому строка `"Цикл завершен"` не выводится.

Удобно читать такую конструкцию так:

- `while` - повторяй действия, пока условие истинно;
- `else` - выполни этот код, если цикл закончился без `break`.

### Если цикл не начался {#esli-tsikl-ne-nachalsya}

Блок `else` выполнится даже в том случае, если условие `while` сразу оказалось ложным и тело цикла не выполнилось ни разу.

```python
counter = 10

while counter < 5:
    print(counter)
else:
    print("Условие сразу ложно")  # Условие сразу ложно
```

Это произошло потому, что цикл завершился без `break`.

## `break` работает и в `for` {#break-rabotaet-i-v-for}

`break` можно использовать не только в `while`, но и в `for`.

```python
for number in range(10):
    print(number)

    if number == 2:
        break
```

Вывод:

```text
0
1
2
```

Когда `number` становится равен `2`, цикл завершается.

## Практический пример: симуляция ставок {#prakticheskiy-primer-simulyatsiya-stavok}

В практической задаче есть случайный бросок монеты и цикл, который продолжается, пока у игрока есть деньги.

```python
import random

HEADS = "heads"
TAILS = "tails"
COIN_VALUES = [HEADS, TAILS]


def flip_coin() -> str:
    return random.choice(COIN_VALUES)
```

Функция `flip_coin()` возвращает случайное значение: `"heads"` или `"tails"`.

## Цикл с состоянием {#tsikl-s-sostoyaniem}

Внутри симуляции есть несколько переменных состояния:

- `current_funds` - текущие деньги;
- `current_bet` - текущая ставка;
- `steps_to_lose` - сколько шагов прошло до проигрыша.

```python
def play_martingale(*, starting_funds: int, min_bet: int, max_bet: int) -> int:
    steps_to_lose = 0
    current_funds = starting_funds
    current_bet = min_bet

    while current_funds > 0:
        steps_to_lose += 1
        current_funds -= current_bet

        flipped_coin_value = flip_coin()

        if flipped_coin_value == HEADS:
            win = current_bet * 2
            current_funds += win
            current_bet = min_bet
        else:
            current_bet *= 2

            if current_bet > max_bet:
                current_bet = min_bet

            if current_bet > current_funds:
                current_bet = current_funds

    return steps_to_lose
```

Условие:

```python
while current_funds > 0:
```

означает: продолжать игру, пока у игрока есть деньги.

## Что происходит при выигрыше {#chto-proiskhodit-pri-vyigryshe}

```python
if flipped_coin_value == HEADS:
    win = current_bet * 2
    current_funds += win
    current_bet = min_bet
```

Если выпал `HEADS`:

- игрок получает выигрыш;
- деньги увеличиваются;
- ставка возвращается к минимальной.

## Что происходит при проигрыше {#chto-proiskhodit-pri-proigryshe}

```python
else:
    current_bet *= 2

    if current_bet > max_bet:
        current_bet = min_bet

    if current_bet > current_funds:
        current_bet = current_funds
```

Если монета выпала неудачно:

- ставка удваивается;
- если ставка выше лимита, она сбрасывается к минимальной;
- если ставка выше текущих денег, ставка ограничивается остатком денег.

Это защищает симуляцию от ставки больше доступной суммы.

## Несколько запусков {#neskolko-zapuskov}

Чтобы оценить средний результат, можно запустить симуляцию несколько раз.

```python
def simulate_martingale_for_n_games(
    *,
    starting_funds: int,
    min_bet: int,
    max_bet: int,
    n_games: int,
) -> float:
    total_steps_to_lose = 0

    for _ in range(n_games):
        steps_to_lose = play_martingale(
            starting_funds=starting_funds,
            min_bet=min_bet,
            max_bet=max_bet,
        )
        total_steps_to_lose += steps_to_lose

    return total_steps_to_lose / n_games
```

Здесь `for` используется для известного количества запусков, а `while` - для одной игры, где заранее неизвестно, сколько будет шагов.

## `while` или `for` {#while-ili-for}

Используй `for`, когда количество повторений известно.

```python
for number in range(10):
    print(number)
```

Используй `while`, когда повторять нужно до выполнения условия.

```python
while current_funds > 0:
    ...
```

Практическое правило:

- `for` - перебрать элементы или повторить `N` раз;
- `while` - продолжать, пока состояние программы не изменится нужным образом.

## Частые ошибки {#chastye-oshibki}

1. Забыть изменить переменную условия.
   Проблема: цикл может стать бесконечным.
   Решение: внутри цикла менять счетчик или состояние.

2. Писать `while True` без `break`.
   Проблема: цикл не остановится сам.
   Решение: добавить условие выхода.

3. Путать `break` и условие `while`.
   Проблема: логика остановки становится неочевидной.
   Решение: простые условия писать после `while`, сложные условия выхода - через `break`.

4. Менять список через `pop()` и забывать, что список станет пустым.
   Проблема: исходные данные будут удалены.
   Решение: если список нужен дальше, работай с копией.

```python
items = [0, 1, 2]
copy_items = items[:]

while copy_items:
    print(copy_items.pop())

print(items)  # [0, 1, 2]
```

5. Указывать неверный тип результата в type hints.
   Проблема: функция возвращает число, а аннотация обещает строку.
   Решение: аннотация должна соответствовать фактическому результату.

```python
def play_martingale(...) -> int:
    ...
```

## Cheat-sheet {#cheat-sheet}

| Синтаксис | Что делает |
| --- | --- |
| `while condition:` | Выполняет цикл, пока условие истинно |
| `while True:` | Бесконечный цикл |
| `break` | Завершает цикл |
| `while ... else:` | Выполняет `else`, если цикл завершился без `break` |
| `while my_list:` | Работает, пока список непустой |
| `my_list.pop()` | Удаляет и возвращает последний элемент |
| `counter += 1` | Обновляет счетчик |
| `for _ in range(n):` | Повторяет действие `n` раз, если значение счетчика не нужно |

## Official docs {#official-docs}

<OfficialDocsLinks
    :links="[
        { title: 'Python Reference: while statement', href: 'https://docs.python.org/3/reference/compound_stmts.html#the-while-statement' },
        { title: 'Python Tutorial: break and continue', href: 'https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements' },
        { title: 'Python Tutorial: Truth value testing', href: 'https://docs.python.org/3/library/stdtypes.html#truth-value-testing' },
        { title: 'Python random.choice()', href: 'https://docs.python.org/3/library/random.html#random.choice' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Циклы for и range', href: '/python/yazyk-python/1-core/tsikly-for-i-range' },
        { title: 'Boolean и условия', href: '/python/yazyk-python/1-core/boolean-i-usloviya' },
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python' },
        { title: 'Область видимости переменных', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh' },
    ]"
/>
