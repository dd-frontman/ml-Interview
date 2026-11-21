---
title: "Бинарные типы: bytes, bytearray и memoryview"
description: "Чем отличаются bytes, bytearray и memoryview, как читать и изменять бинарные данные без лишнего копирования."
tags:
  - "python"
  - "core"
  - "data-types"
  - "bytes"
  - "memoryview"
updatedAt: "2026-11-21"
---
## Зачем нужны три бинарных типа {#zachem-nuzhny-tri-binarnykh-tipa}

Файл, сетевой пакет или изображение приходят в программу как последовательность байтов. Иногда данные нужно только прочитать, иногда изменить, а для большого буфера желательно обойтись без копирования.

Python предоставляет три связанных встроенных типа:

| Тип | Собственные данные | Возможность записи |
| --- | --- | --- |
| `bytes` | хранит | нет |
| `bytearray` | хранит | да |
| `memoryview` | ссылается на чужой буфер | зависит от исходного объекта |

## `bytes`: неизменяемые байты {#bytes-neizmenyaemye-bayty}

`bytes` хранит неизменяемую последовательность целых чисел от `0` до `255`.

```python
data = b"ABC"

print(data[0])  # 65
print(data[1:])  # b'BC'
```

По индексу возвращается число, а срез создаёт новый объект `bytes`. Изменить байт на месте нельзя:

```python
data = b"ABC"
data[0] = 97  # TypeError
```

Подробнее о кодировках и преобразовании текста: [`bytes` в Python](./bayty-bytes.md).

## `bytearray`: изменяемый буфер {#bytearray-izmenyaemyy-bufer}

`bytearray` хранит байты, но позволяет заменять элементы и срезы.

```python
data = bytearray(b"ABC")
data[0] = 97

print(data)  # bytearray(b'aBC')
```

`bytearray` подходит, когда бинарные данные собираются или изменяются по частям. После обработки его можно преобразовать в неизменяемый `bytes`:

```python
data = bytearray(b"ABC")

print(bytes(data))  # b'ABC'
```

## `memoryview`: представление без копирования {#memoryview-predstavlenie-bez-kopirovaniya}

`memoryview` не хранит отдельную копию бинарных данных. Он предоставляет доступ к буферу другого объекта.

```python
data = bytearray(b"ABC")
view = memoryview(data)

view[0] = 97

print(data)  # bytearray(b'aBC')
```

Изменение через `view` попало в исходный `bytearray`, потому что оба объекта работают с одним буфером.

Срез `memoryview` также создаёт представление, а не копию данных:

```python
data = bytearray(b"ABCDE")
middle = memoryview(data)[1:4]

middle[0] = 120

print(data)  # bytearray(b'AxCDE')
```

## Почему `memoryview` не всегда изменяемый {#pochemu-memoryview-ne-vsegda-izmenyaemyy}

Возможность записи зависит от исходного буфера и режима самого представления. Представление над `bytes` доступно только для чтения:

```python
readonly_view = memoryview(b"ABC")

print(readonly_view.readonly)  # True
```

Представление над `bytearray` обычно позволяет запись:

```python
writable_view = memoryview(bytearray(b"ABC"))

print(writable_view.readonly)  # False
```

Даже для изменяемого буфера можно явно создать представление только для чтения:

```python
data = bytearray(b"ABC")
readonly_view = memoryview(data).toreadonly()

print(readonly_view.readonly)  # True
```

Поэтому в классификации изменяемости `memoryview` лучше помещать в отдельную категорию: его поведение зависит от предоставленного буфера и режима представления.

## Ограничение на изменение размера {#ogranichenie-na-izmenenie-razmera}

Пока существует активный `memoryview`, размер исходного `bytearray` нельзя менять:

```python
data = bytearray(b"ABC")
view = memoryview(data)

data.append(68)  # BufferError
```

Когда представление больше не нужно, его можно освободить методом `release()` или использовать контекстный менеджер:

```python
data = bytearray(b"ABC")

with memoryview(data) as view:
    print(view[0])  # 65

data.append(68)
print(data)  # bytearray(b'ABCD')
```

## Когда какой тип выбирать {#kogda-kakoy-tip-vybirat}

| Задача | Тип |
| --- | --- |
| Передать или сохранить готовые бинарные данные | `bytes` |
| Собрать или изменить бинарный буфер | `bytearray` |
| Прочитать часть большого буфера без копирования | `memoryview` |
| Изменить доступный для записи буфер через представление | `memoryview` над `bytearray` или другим writable-буфером |

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Создай `bytearray(b"python")` и замени первую букву через индекс.
2. Создай `memoryview` над этим буфером, возьми срез последних трёх байтов и измени один из них. Проверь исходный `bytearray`.
3. Создай `memoryview` над `bytes` и проверь свойство `readonly`.

## Типичные ошибки {#tipichnye-oshibki}

1. Считать `memoryview` самостоятельным хранилищем. Он ссылается на буфер другого объекта.
2. Ожидать возможность записи в представление над `bytes`. Такой буфер доступен только для чтения.
3. Менять размер `bytearray`, пока на него ссылается активный `memoryview`. Это приводит к `BufferError`.
4. Путать текст и бинарные данные. Для перехода между `str` и байтами нужны `encode()` и `decode()`.

## Шпаргалка {#shpargalka}

| Выражение | Результат |
| --- | --- |
| `bytes([65, 66])` | неизменяемый `b"AB"` |
| `bytearray(b"AB")` | изменяемый бинарный буфер |
| `memoryview(buffer)` | представление над существующим буфером |
| `view.readonly` | доступна ли запись через представление |
| `view.release()` | освобождение представления |

<OfficialDocsLinks
    :links="[
        { title: 'Binary Sequence Types', href: 'https://docs.python.org/3/library/stdtypes.html#binary-sequence-types-bytes-bytearray-memoryview' },
        { title: 'Memory Views', href: 'https://docs.python.org/3/library/stdtypes.html#memory-views' },
        { title: 'Buffer Protocol', href: 'https://docs.python.org/3/c-api/buffer.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Байты bytes', href: '/python/yazyk-python/tipy-dannykh/bayty-bytes' },
        { title: 'Изменяемые типы', href: '/python/yazyk-python/tipy-dannykh/izmenyaemye-tipy' },
        { title: 'Неизменяемые типы', href: '/python/yazyk-python/tipy-dannykh/neizmenyaemye-tipy' },
        { title: 'Типы данных', href: '/python/yazyk-python/tipy-dannykh/tipy-glavnaya' },
    ]"
/>
