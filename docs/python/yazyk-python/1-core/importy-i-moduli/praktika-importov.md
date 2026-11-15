---
title: "Практика импортов"
description: "Практическая задача на создание собственного пакета Python, явные импорты функций и запуск программы из корня проекта."
tags:
  - "python"
  - "core"
  - "imports"
  - "practice"
updatedAt: "2026-11-13"
---
## Задача: пакет расчёта цены {#zadacha-paket-raschyota-tseny}

Создай пакет со следующей структурой:

```text
project/
├── main.py
└── shop/
    ├── __init__.py
    └── prices.py
```

В `prices.py` создай две функции:

```python
def apply_discount(price: float, discount: float) -> float:
    return price * (1 - discount / 100)


def add_tax(price: float, tax: float) -> float:
    return price * (1 + tax / 100)
```

В `main.py`:

1. Импортируй обе функции явным импортом.
2. Рассчитай цену товара после скидки 10 процентов.
3. Добавь к полученной цене налог 20 процентов.
4. Округли результат до двух знаков.

Ожидаемый результат для исходной цены `1000`:

```text
1080.0
```

<details>
<summary>Показать решение</summary>

```python
from shop.prices import add_tax, apply_discount

price = 1000
discounted_price = apply_discount(price, 10)
final_price = add_tax(discounted_price, 20)

print(round(final_price, 2))  # 1080.0
```

</details>

## Как запустить {#kak-zapustit}

Перейди в директорию `project` и запусти:

```bash
python main.py
```

Команда выполняется из корня проекта, поэтому пакет `shop` находится в пути поиска модулей.

## Что проверить {#chto-proverit}

1. Файл `shop/__init__.py` существует.
2. Команда запускается из директории `project`.
3. В импорте написано `shop.prices`, а не путь файловой системы.
4. В `prices.py` нет кода, который неожиданно запускается при импорте.

## Дополнительные задания {#dopolnitelnye-zadaniya}

1. Добавь модуль `shop/validators.py` с проверкой, что цена неотрицательная.
2. Импортируй проверку в `prices.py` абсолютным импортом.
3. Создай `shop/report.py`, который выводит исходную цену, скидку, налог и итог.
4. Добавь в `report.py` функцию `main()` и защиту `if __name__ == "__main__"`.
5. Запусти отчёт командой `python -m shop.report`.

## Темы задачи {#temy-zadachi}

- модуль и пакет;
- `__init__.py`;
- явный импорт;
- путь поиска модулей;
- запуск от корня проекта;
- функция `main()`.

<RelatedTopics
    :items="[
        { title: 'Обзор импортов', href: '/python/yazyk-python/1-core/importy-i-moduli/' },
        { title: 'Модули и пакеты', href: '/python/yazyk-python/1-core/importy-i-moduli/moduli-pakety-i-biblioteki' },
        { title: 'Поиск модулей и ошибки', href: '/python/yazyk-python/1-core/importy-i-moduli/poisk-modulya-i-oshibki' },
    ]"
/>
