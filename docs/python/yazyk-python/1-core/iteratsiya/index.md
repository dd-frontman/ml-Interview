---
title: "Циклы и comprehensions"
description: "Навигация по циклам for и while, функции range и comprehensions в Python."
tags:
  - "python"
  - "core"
  - "loops"
  - "comprehensions"
updatedAt: "2026-11-21"
---
## Зачем нужна итерация {#zachem-nuzhna-iteratsiya}

Итерация позволяет обработать несколько значений одним блоком кода.

```python
scores = [0.45, 0.81, 0.73]

for score in scores:
    if score >= 0.7:
        print(score)
```

Результат:

```text
0.81
0.73
```

## Порядок изучения {#poryadok-izucheniya}

1. [Циклы `for` и `range()`](/python/yazyk-python/1-core/tsikly-for-i-range/)
   Перебор коллекций, диапазоны чисел, `break`, `continue`, `enumerate()` и `zip()`.

2. [Цикл `while`](/python/yazyk-python/1-core/tsikl-while)
   Повторение, пока условие истинно, защита от бесконечного цикла.

3. [Comprehensions](/python/yazyk-python/1-core/comprehensions-v-python)
   Короткая запись простой трансформации или фильтрации коллекции.

4. [Практика: бриллиантовый ромб](/python/yazyk-python/1-core/tsikly-for-i-range/zadacha-brilliantovyy-romb)
   Совместное применение циклов, условий и арифметики.

## Граница раздела {#granitsa-razdela}

Здесь рассматривается обычный перебор. Протокол `iter()`, `next()`, собственные итераторы и `yield` вынесены в отдельный раздел [«Итераторы и генераторы»](/python/yazyk-python/iteratory-i-generatory/iteratory-i-generatory-glavnaya).

<RelatedTopics
    :items="[
        { title: 'Операторы и условия', href: '/python/yazyk-python/1-core/operatory-i-usloviya/' },
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python/' },
        { title: 'Итераторы и генераторы', href: '/python/yazyk-python/iteratory-i-generatory/iteratory-i-generatory-glavnaya' },
    ]"
/>
