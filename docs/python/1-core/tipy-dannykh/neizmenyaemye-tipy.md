---
title: "Неизменяемые типы"
description: "Подробный разбор неизменяемых типов Python: int, float, bool, str, tuple, frozenset и bytes."
tags:
  - "python"
  - "core"
  - "data-types"
  - "immutable"
updatedAt: "2026-02-27"
---
## Что входит в группу

В этом разделе: `7` неизменяемых типов.

- `int`
- `float`
- `bool`
- `str`
- `tuple`
- `frozenset`
- `bytes`

Неизменяемый тип значит: после создания объект нельзя изменить "на месте". Любая модификация создает новый объект.

## Int

`42` Аналогия с JS: по смыслу это обычный `number`, но без жесткого ограничения `int32/int64`

- `int` в Python не ограничен жестко `int32/int64`, число может быть очень большим: `10 ** 100`
- `bool` является подтипом `int`: `True == 1`, `False == 0`
  Это ближе к `Number(true) === 1` и `Number(false) === 0`, а не к `Infinity`
- `/` возвращает `float`, а `//` - целую часть: `10 / 2 == 5.0`, `10 // 2 == 5`
- Для читаемости можно писать `_`: `1_000_000`
- Есть бинарная, восьмеричная и hex-запись: `0b1010`, `0o12`, `0xA`
- Это неизменяемый тип: при `x += 1` создается новый объект

## Float

`3.14` Аналогия с JS: это обычный `number` с той же проблемой точности у дробей

- `float` хранит число с плавающей точкой
- Из-за двоичного представления часть десятичных дробей хранится неточно: `0.1 + 0.2 != 0.3`
- Может хранить специальные значения: `float("inf")`, `float("-inf")`, `float("nan")`
  Это как `Infinity`, `-Infinity` и `NaN`
- Поддерживает scientific notation: `1.5e3 == 1500.0`
  `1.5e3` значит `1.5 * 10^3`, а `3e-2` значит `3 * 10^-2`
- Это неизменяемый тип

## Bool

`True` Аналогия с JS: это обычный boolean, близкий по смыслу к `true` / `false`

- `bool` имеет только два значения: `True` и `False`
- Часто используется в условиях: `if`, `while`, фильтрах и проверках
- Многие значения приводятся к булевому типу:
  `bool(0) == False`, `bool("") == False`, `bool([]) == False`
  `bool(1) == True`, `bool("text") == True`, `bool([1]) == True`
- Это похоже на `Boolean(value)`, где часть значений становится `false`, а часть `true`
- `bool` связан с `int`: `True == 1`, `False == 0`
- Логические операторы: `and`, `or`, `not`
- `and` и `or` работают с short-circuit: если левая часть уже определяет результат, правая не вычисляется
- Подробнее: [Логические и побитовые операторы: and, or, &, |](../logicheskie-i-pobitovye-operatory.md)
- Это неизменяемый тип

## Str

`"python"` Аналогия с JS: по смыслу это обычная строка `string`

- `str` хранит текст
- Это последовательность символов, по которой можно ходить по индексу: `"ml"[0] == "m"`
- Конкатенация создает новую строку: `"py" + "thon" == "python"`
- Это неизменяемый тип

## Tuple

`(1, "ml", 2.5)` Аналогия с JS: это как `const arr = [1, "ml", 2.5]`, только в Python сам набор значений нельзя поменять после создания

- Удобен для фиксированного набора значений: координаты, `(x, y)`, `(id, status)`
- Если внутри лежит изменяемый объект, сам `tuple` не меняется, но вложенный объект можно изменить: `([1, 2], "ml")`
- Это неизменяемый тип как контейнер

## Frozenset

`frozenset({"python", "ml"})` Аналогия с JS: это как `new Set(["python", "ml"])`, только после создания в него уже нельзя ничего добавить или удалить

- Внутри хранятся только уникальные значения: `frozenset([1, 1, 1])` -> `frozenset({1})`
- Удобен, когда нужен набор уникальных значений без риска случайной мутации
- Это неизменяемый тип

## Bytes

`b"hello"` Аналогия с JS: ближе всего к `Uint8Array` или сырому бинарному буферу

- `bytes` хранит последовательность байтов
- Обычно нужен для работы с файлами, сетью, бинарными протоколами, изображениями
- Это неизменяемый тип

## Типичные ошибки

1. Считать, что `tuple` полностью "замораживает" вложенные объекты.
   Решение: помнить, что вложенные mutable-объекты внутри могут меняться.

2. Ждать точного результата у дробей типа `0.1 + 0.2`.
   Решение: помнить про двоичное представление `float`.

3. Путать `bool` и `int` в условиях и арифметике.
   Решение: знать, что `True == 1`, `False == 0`.

4. Использовать `frozenset`, когда коллекцию нужно дополнять.
   Решение: в таких случаях нужен обычный `set`.

## Cheat-sheet

| Тип | Пример | Особенность |
| --- | --- | --- |
| `int` | `42` | Большие целые без жесткого лимита |
| `float` | `3.14` | Возможна неточность дробей |
| `bool` | `True` | Связан с `int` |
| `str` | `"python"` | Неизменяемая строка |
| `tuple` | `(1, 2)` | Фиксированный набор значений |
| `frozenset` | `frozenset({1, 2})` | Только уникальные значения, без мутаций |
| `bytes` | `b"abc"` | Бинарные данные |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Built-in Types', href: 'https://docs.python.org/3/library/stdtypes.html' },
        { title: 'Numeric types', href: 'https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex' },
        { title: 'Boolean operations and bool', href: 'https://docs.python.org/3/library/stdtypes.html#boolean-type-bool' },
        { title: 'Text sequence type str', href: 'https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str' },
        { title: 'Binary sequence types', href: 'https://docs.python.org/3/library/stdtypes.html#binary-sequence-types-bytes-bytearray-memoryview' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Общая информация', href: '/python/1-core/tipy-dannykh/obshaya-informatsiya' },
        { title: 'Изменяемые типы', href: '/python/1-core/tipy-dannykh/izmenyaemye-tipy' },
        { title: 'Логические и побитовые операторы: and, or, &, |', href: '/python/1-core/logicheskie-i-pobitovye-operatory' },
    ]"
/>
