---
title: "Байты bytes"
description: "Конспект по типу bytes в Python: создание, кодировки, отличие от str и bytearray, срезы, конкатенация, методы и типичные ошибки."
tags:
  - "python"
  - "core"
  - "data-types"
  - "bytes"
updatedAt: "2026-07-25"
---
## Что такое `bytes`

`bytes` - это неизменяемая последовательность байтов, чисел от `0` до `255`.

```python
raw = b"hello"

print(raw)  # b'hello'
print(type(raw))  # <class 'bytes'>
```

Аналогия с JS: ближе всего к `Uint8Array` или сырому бинарному буферу, только `bytes` в Python неизменяемый, как `str`.

## Зачем нужен `bytes`

`str` хранит текст как последовательность символов (Unicode). `bytes` хранит сырые байты без привязки к алфавиту.

Типичные сценарии:

- чтение и запись файлов в бинарном режиме;
- сетевые протоколы, сокеты, HTTP-тела;
- работа с изображениями, архивами и другими бинарными форматами;
- хеширование и криптография.

## Способы создания

```python
a = b"hello"
b = bytes("hello", "utf-8")
c = bytes([104, 101, 108, 108, 111])
d = bytes(5)

print(a)  # b'hello'
print(b)  # b'hello'
print(c)  # b'hello'
print(d)  # b'\x00\x00\x00\x00\x00'
```

- `b"..."` - литерал, работает только с ASCII-символами;
- `bytes(str, encoding)` - кодирует строку в байты;
- `bytes(iterable_of_ints)` - каждое число становится одним байтом, допустимый диапазон `0-255`;
- `bytes(n)` - создает `n` нулевых байтов.

## `encode()` и `decode()`

Строка превращается в байты через `encode()`, обратно - через `decode()`.

```python
text = "привет"
raw = text.encode("utf-8")

print(raw)  # b'\xd0\xbf\xd1\x80\xd0\xb8\xd0\xb2\xd0\xb5\xd1\x82'
print(raw.decode("utf-8"))  # привет
```

Если кодировка не совпадает с реальным содержимым, `decode()` выбрасывает `UnicodeDecodeError`.

```python
raw = "привет".encode("utf-8")
raw.decode("ascii")  # UnicodeDecodeError
```

## Индексы и срезы

По индексу `bytes` возвращает `int`, а срез - снова `bytes`.

```python
raw = b"hello"

print(raw[0])     # 104
print(raw[0:2])   # b'he'
print(raw[-1])    # 111
```

Это отличается от `str`, где и индекс, и срез возвращают строку.

## Конкатенация и повторение

```python
a = b"hello"
b = b"world"

print(a + b"-" + b)  # b'hello-world'
print(a * 3)          # b'hellohellohello'
```

`bytes` нельзя складывать со `str` напрямую.

```python
b"hello" + "world"  # TypeError
```

## `bytes` неизменяемый

Элемент нельзя заменить по индексу.

```python
raw = bytearray(b"hello")
raw[0] = 72

print(raw)  # bytearray(b'Hello')
```

```python
raw = b"hello"
raw[0] = 72  # TypeError
```

Ошибка:

```text
TypeError: 'bytes' object does not support item assignment
```

Если нужны изменяемые байты, используется `bytearray`, а не `bytes`.

## Частые методы

`bytes` поддерживает многие методы `str`, но работает с байтами, а не с символами.

```python
payload = b" user=alice;role=admin \n"
clean = payload.strip()

print(clean)  # b'user=alice;role=admin'
print(clean.split(b";"))  # [b'user=alice', b'role=admin']
print(clean.replace(b"alice", b"bob"))  # b'user=bob;role=admin'
print(clean.find(b"role"))  # 11
print(clean.startswith(b"user"))  # True
print(clean.endswith(b"admin"))  # True
```

Подробнее про весь список методов: [Методы типов данных](./metody-tipov-dannykh.md).

## `bytes` vs `bytearray` vs `str`

| Тип | Изменяемость | Хранит | Пример |
| --- | --- | --- | --- |
| `str` | неизменяемый | текст (Unicode) | `"hello"` |
| `bytes` | неизменяемый | сырые байты | `b"hello"` |
| `bytearray` | изменяемый | сырые байты | `bytearray(b"hello")` |

Подробнее про изменяемый аналог: [Изменяемые типы](./izmenyaemye-tipy.md#bytearray).

## Практический пример

Разбор бинарного заголовка фиксированной длины, например при чтении файла.

```python
def read_header(raw: bytes) -> dict:
    magic = raw[:4]
    version = raw[4]
    length = int.from_bytes(raw[5:9], "big")
    return {"magic": magic, "version": version, "length": length}

header = b"PY01" + (2).to_bytes(1, "big") + (256).to_bytes(4, "big")

print(read_header(header))  # {'magic': b'PY01', 'version': 2, 'length': 256}
```

## Типичные ошибки

1. Пытаться сложить `bytes` и `str` напрямую.
   Проблема: `TypeError: can't concat str to bytes`.
   Решение: явно привести через `encode()`/`decode()`.

2. Декодировать байты не в той кодировке, в которой они были закодированы.
   Проблема: `UnicodeDecodeError` или "битые" символы вместо ошибки.
   Решение: использовать ту же кодировку, что и при `encode()`, обычно `utf-8`.

3. Пытаться изменить `bytes` по индексу.
   Проблема: `TypeError: 'bytes' object does not support item assignment`.
   Решение: если нужна мутация, использовать `bytearray`.

4. Путать `bytes[0]` и `bytes[0:1]`.
   Проблема: первое - `int`, второе - `bytes` из одного байта.
   Решение: помнить, что индекс всегда возвращает `int`, а срез - `bytes`.

## Cheat-sheet

| Синтаксис | Что делает |
| --- | --- |
| `b"abc"` | Литерал bytes (только ASCII) |
| `bytes("abc", "utf-8")` | Кодирование строки в байты |
| `text.encode("utf-8")` | Строка -> байты |
| `raw.decode("utf-8")` | Байты -> строка |
| `raw[0]` | Один байт как `int` |
| `raw[0:2]` | Срез как `bytes` |
| `raw + other` | Конкатенация |
| `bytearray(raw)` | Изменяемая версия |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'Binary Sequence Types: bytes, bytearray, memoryview', href: 'https://docs.python.org/3/library/stdtypes.html#binary-sequence-types-bytes-bytearray-memoryview' },
        { title: 'str.encode()', href: 'https://docs.python.org/3/library/stdtypes.html#str.encode' },
        { title: 'bytes.decode()', href: 'https://docs.python.org/3/library/stdtypes.html#bytes.decode' },
        { title: 'Unicode HOWTO', href: 'https://docs.python.org/3/howto/unicode.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Неизменяемые типы', href: '/python/yazyk-python/tipy-dannykh/neizmenyaemye-tipy' },
        { title: 'Изменяемые типы', href: '/python/yazyk-python/tipy-dannykh/izmenyaemye-tipy' },
        { title: 'Методы типов данных', href: '/python/yazyk-python/tipy-dannykh/metody-tipov-dannykh' },
        { title: 'Операции со строками', href: '/python/yazyk-python/tipy-dannykh/operatsii-so-strokami' },
        { title: 'Типы главная', href: '/python/yazyk-python/tipy-dannykh/tipy-glavnaya' },
    ]"
/>
