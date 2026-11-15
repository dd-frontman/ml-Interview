---
title: "Возврат и распаковка нескольких значений"
description: "Как Python возвращает несколько значений кортежем, как распаковать результат и сообщить вызывающему коду об изменении данных."
tags:
  - "python"
  - "core"
  - "functions"
  - "return"
updatedAt: "2026-11-15"
---
## Какую задачу решаем {#kakuyu-zadachu-reshaem}

Иногда одного результата недостаточно. Например, функция обновляет словарь и должна вернуть:

- обновлённые данные;
- флаг, который показывает, произошло ли изменение.

Python позволяет перечислить несколько возвращаемых значений через запятую.

## Минимальный пример {#minimalnyy-primer}

```python
def min_and_max(numbers: list[int]) -> tuple[int, int]:
    return min(numbers), max(numbers)


result = min_and_max([4, 1, 9, 2])

print(result)        # (1, 9)
print(type(result))  # <class 'tuple'>
```

Запись `return min_value, max_value` не создаёт особый многозначный результат. Python автоматически упаковывает значения в кортеж.

## Распаковка результата {#raspakovka-rezultata}

Кортеж можно сразу распределить по переменным:

```python
minimum, maximum = min_and_max([4, 1, 9, 2])

print(minimum)  # 1
print(maximum)  # 9
```

Количество переменных должно совпадать с количеством элементов:

```python
minimum, maximum, average = min_and_max([4, 1, 9, 2])  # ValueError
```

Ненужное значение принято сохранять в переменную `_`:

```python
_, maximum = min_and_max([4, 1, 9, 2])

print(maximum)  # 9
```

Символ `_` остаётся обычным именем переменной, но по соглашению показывает: значение намеренно не используется.

## Пример с `**kwargs`: обновление словаря {#primer-s-kwargs-obnovlenie-slovarya}

```python
def modify_dict(
    old_dict: dict[str, object],
    **changes: object,
) -> tuple[dict[str, object], bool]:
    is_modified = False

    for key, value in changes.items():
        if key not in old_dict or old_dict[key] != value:
            old_dict[key] = value
            is_modified = True

    return old_dict, is_modified
```

Функция перебирает новые значения из `changes`. Если ключ отсутствует или его значение отличается, словарь обновляется, а флаг становится `True`. Отдельная проверка `key not in old_dict` нужна, чтобы новый ключ со значением `None` не потерялся.

```python
product = {"id": 1, "name": "Laptop", "price": 999.99}

product, was_modified = modify_dict(product, in_stock=True)

print(product)       # {'id': 1, 'name': 'Laptop', 'price': 999.99, 'in_stock': True}
print(was_modified)  # True
```

Повторная передача тех же значений не считается изменением:

```python
product, was_modified = modify_dict(product, id=1, name="Laptop")

print(was_modified)  # False
```

## Зачем нужен флаг изменения {#zachem-nuzhen-flag-izmeneniya}

Вызывающий код может использовать флаг, чтобы решить, нужно ли выполнять дорогую операцию:

```python
product, was_modified = modify_dict(product, price=899.99)

if was_modified:
    print("Сохраняем изменения")  # Сохраняем изменения
```

Без флага пришлось бы самостоятельно сравнивать старые и новые данные.

## Важная деталь: исходный словарь меняется {#vazhnaya-detal-iskhodnyy-slovar-menyaetsya}

Строка `old_dict[key] = value` изменяет объект на месте:

```python
product = {"id": 1}

updated_product, _ = modify_dict(product, name="Laptop")

print(product)          # {'id': 1, 'name': 'Laptop'}
print(updated_product)  # {'id': 1, 'name': 'Laptop'}
print(product is updated_product)  # True
```

Обе переменные ссылаются на один словарь.

## Вариант без изменения исходного словаря {#variant-bez-izmeneniya-iskhodnogo-slovarya}

Если мутация нежелательна, сначала создаётся поверхностная копия:

```python
def modify_dict_copy(
    old_dict: dict[str, object],
    **changes: object,
) -> tuple[dict[str, object], bool]:
    new_dict = old_dict.copy()
    is_modified = False

    for key, value in changes.items():
        if key not in new_dict or new_dict[key] != value:
            new_dict[key] = value
            is_modified = True

    return new_dict, is_modified


original = {"id": 1}
updated, was_modified = modify_dict_copy(original, name="Laptop")

print(original)      # {'id': 1}
print(updated)       # {'id': 1, 'name': 'Laptop'}
print(was_modified)  # True
```

`dict.copy()` создаёт поверхностную копию. Вложенные изменяемые объекты всё ещё могут быть общими для двух словарей.

## Аннотация типа результата {#annotatsiya-tipa-rezultata}

Тип `tuple[dict[str, object], bool]` сообщает, что функция возвращает кортеж из двух элементов в определённом порядке:

1. словарь;
2. логический флаг.

Для большого количества связанных значений кортеж становится трудно читать. Тогда лучше использовать `dataclass`, `NamedTuple` или отдельный класс результата.

## Частые ошибки {#chastye-oshibki}

1. Ожидать, что `return first, second` возвращает не кортеж, а специальный тип.
2. Распаковать результат в неправильное количество переменных.
3. Перепутать порядок элементов результата.
4. Не учитывать изменение переданного словаря.
5. Перебирать `old_dict.items()` вместо новых значений `changes.items()`.
6. Считать поверхностную копию полной копией всех вложенных объектов.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Напиши функцию, которая возвращает сумму и среднее списка.
2. Напиши функцию `pop_with_status()`, которая возвращает найденное значение и `True`, либо `None` и `False`.
3. Измени `modify_dict_copy()`, чтобы она дополнительно возвращала список изменённых ключей.

<RelatedTopics
    :items="[
        { title: 'Return, print и pass', href: '/python/yazyk-python/1-core/funktsii-v-python/return-print-i-pass' },
        { title: '**kwargs', href: '/python/yazyk-python/1-core/funktsii-v-python/kwargs-proizvolnye-imenovannye-argumenty' },
        { title: 'Кортежи tuple', href: '/python/yazyk-python/tipy-dannykh/kortezhi-tuple' },
        { title: 'Словари dict', href: '/python/yazyk-python/tipy-dannykh/slovari-dict' },
    ]"
/>
