---
title: "Операторы и условия"
description: "Навигация по арифметическим, сравнительным, логическим и побитовым операторам, bool и условиям Python."
tags:
  - "python"
  - "core"
  - "operators"
  - "conditions"
updatedAt: "2026-11-21"
---
## Задача раздела {#zadacha-razdela}

Операторы вычисляют значения и сравнивают их, а условия выбирают следующую ветку программы.

```python
score = 0.78
min_score = 0.7

if score >= min_score and score <= 1:
    print("accepted")  # accepted
```

Здесь `>=` и `<=` сравнивают числа, `and` объединяет проверки, а `if` выполняет блок только при истинном условии.

## Порядок изучения {#poryadok-izucheniya}

1. [Арифметические операторы](/python/yazyk-python/1-core/arifmeticheskie-operatory)
2. [Операторы сравнения](/python/yazyk-python/1-core/operatory-sravneniya)
3. [Boolean и условия](/python/yazyk-python/1-core/boolean-i-usloviya)
4. [Логические и побитовые операторы](/python/yazyk-python/1-core/logicheskie-i-pobitovye-operatory)
5. [Полный справочник операторов](/python/yazyk-python/1-core/vse-operatory-python)

Справочник удобно использовать для повторения. Для первого изучения лучше идти по отдельным страницам: в них больше примеров и объяснений ошибок.

## Что изучать дальше {#chto-izuchat-dalshe}

После условий переходи к [циклам и comprehensions](../iteratsiya/). Цикл повторяет действие, а условие определяет, когда его выполнять или останавливать.

<RelatedTopics
    :items="[
        { title: 'Основы языка', href: '/python/yazyk-python/1-core/osnovy-yazyka/' },
        { title: 'Итерация', href: '/python/yazyk-python/1-core/iteratsiya/' },
        { title: 'Типы данных', href: '/python/yazyk-python/tipy-dannykh/tipy-glavnaya' },
    ]"
/>
