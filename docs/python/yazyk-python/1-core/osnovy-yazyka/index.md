---
title: "Основы языка Python"
description: "Навигация по базовому синтаксису Python, встроенным функциям, repr и инструкции del."
tags:
  - "python"
  - "core"
  - "syntax"
  - "builtins"
updatedAt: "2026-11-21"
---
## Что входит в раздел {#chto-vkhodit-v-razdel}

Начни с правил записи программы, затем переходи к встроенным функциям и операциям с именами.

```python
name = "Alice"
scores = [0.72, 0.91]

print(name, scores)
print(repr(name))  # 'Alice'
```

В примере используются переменные, строки, список и две встроенные функции. Эти элементы встречаются почти в каждом Python-скрипте.

## Порядок изучения {#poryadok-izucheniya}

1. [Основы синтаксиса и переменные](/python/yazyk-python/1-core/osnovy-sintaksisa-i-peremennye)
   Присваивание, имена, базовые типы, распаковка и правила оформления кода.

2. [Основные функции](/python/yazyk-python/1-core/osnovnye-funktsii)
   `print()`, `input()`, преобразование типов, `type()` и `isinstance()`.

3. [`repr()` в Python](/python/yazyk-python/1-core/repr-v-python)
   Представление объекта для отладки, отличие от `str()` и метод `__repr__()`.

4. [Инструкция `del`](/python/yazyk-python/1-core/del-v-python)
   Удаление имени, элемента коллекции, среза или атрибута объекта.

## Что изучать дальше {#chto-izuchat-dalshe}

После основ переходи к [операторам и условиям](../operatory-i-usloviya/) и затем к [итерации](../iteratsiya/).

<RelatedTopics
    :items="[
        { title: 'Базовый Python', href: '/python/yazyk-python/1-core/python-core-funktsii-klassy-moduli-venv-i-pip' },
        { title: 'Операторы и условия', href: '/python/yazyk-python/1-core/operatory-i-usloviya/' },
        { title: 'Типы данных', href: '/python/yazyk-python/tipy-dannykh/tipy-glavnaya' },
    ]"
/>
