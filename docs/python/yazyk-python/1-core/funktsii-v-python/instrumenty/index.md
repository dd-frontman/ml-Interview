---
title: "Инструменты для работы с функциями"
description: "Lambda-функции, sorted, filter и декораторы как дополнительные инструменты функционального кода Python."
tags:
  - "python"
  - "core"
  - "functions"
  - "functional"
updatedAt: "2026-11-21"
---
## Когда переходить к этим темам {#kogda-perekhodit-k-etim-temam}

Сначала изучи объявление функций, параметры, `return` и область видимости. После этого можно разбирать инструменты, которые принимают функции, создают короткие функции или изменяют поведение вызова.

## Порядок изучения {#poryadok-izucheniya}

1. [Lambda-функции](/python/yazyk-python/1-core/lambda-funktsii)
   Короткие функции для простых выражений.

2. [`sorted()` и `filter()`](/python/yazyk-python/1-core/sorted-i-filter)
   Передача функции как правила сортировки или фильтрации.

3. [Декораторы](/python/yazyk-python/1-core/dekoratory-v-python)
   Обёртка функции и изменение её поведения без правки основной реализации.

```python
users = [{"name": "Bob", "score": 0.72}, {"name": "Alice", "score": 0.91}]

users_by_score = sorted(users, key=lambda user: user["score"], reverse=True)
print(users_by_score[0]["name"])  # Alice
```

Если выражение в `lambda` становится сложным, используй обычную функцию через `def`.

<RelatedTopics
    :items="[
        { title: 'Функции в Python', href: '/python/yazyk-python/1-core/funktsii-v-python/' },
        { title: 'Область видимости', href: '/python/yazyk-python/1-core/oblast-vidimosti-peremennyh/' },
        { title: 'Comprehensions', href: '/python/yazyk-python/1-core/comprehensions-v-python' },
    ]"
/>
