---
title: "Выбор исключения и практика"
description: "Как выбрать подходящий класс исключения, отличить ожидаемую проблему от бага и закрепить тему на практических задачах."
tags:
  - "python"
  - "exceptions"
  - "practice"
  - "debugging"
updatedAt: "2026-11-17"
---
## Зачем выбирать точное исключение {#zachem-vybirat-tochnoe-isklyuchenie}

Класс исключения является частью контракта функции. Он сообщает вызывающему коду, что именно пошло не так.

```python
def set_age(age):
    if not isinstance(age, int):
        raise TypeError("Возраст должен быть целым числом")

    if age < 0:
        raise ValueError("Возраст не может быть отрицательным")
```

Здесь различаются две причины:

- `"18"` имеет неправильный тип;
- `-18` имеет правильный тип, но недопустимое значение.

## Таблица выбора {#tablitsa-vybora}

| Ситуация | Подходящий класс |
| --- | --- |
| неверный тип аргумента | `TypeError` |
| правильный тип, но неверное значение | `ValueError` |
| отсутствует имя | `NameError` |
| отсутствует атрибут | `AttributeError` |
| отсутствует индекс | `IndexError` |
| отсутствует ключ | `KeyError` |
| деление на ноль | `ZeroDivisionError` |
| не найден файл | `FileNotFoundError` |
| нет прав | `PermissionError` |
| не найден модуль | `ModuleNotFoundError` |
| метод ещё не реализован | `NotImplementedError` |
| нарушено правило предметной области | собственный класс от `Exception` |

## Что исправлять, а что перехватывать {#chto-ispravlyat-a-chto-perekhvatyvat}

Обычно нужно исправить код:

- `SyntaxError`;
- `IndentationError`;
- `NameError` из-за опечатки;
- `AttributeError` из-за неправильного метода;
- `RecursionError` без базового случая;
- `IndexError` из-за ошибки алгоритма.

Разумно обрабатывать ожидаемые ситуации:

- пользователь ввёл неправильное число;
- необязательный файл отсутствует;
- внешний сервер временно недоступен;
- словарь действительно может не содержать необязательный ключ.

`try/except` не исправляет причину автоматически. Он только позволяет выбрать другое поведение.

## Почему конкретный `except` лучше {#pochemu-konkretnyy-except-luchshe}

Плохо:

```python
try:
    value = int(user_input)
except Exception:
    value = 0
```

Обработчик скроет не только неправильный ввод, но и неожиданные ошибки внутри блока.

Лучше:

```python
try:
    value = int(user_input)
except ValueError:
    value = 0
```

Теперь обрабатывается только ожидаемая проблема преобразования.

## Задача 1. Предсказать исключение {#zadacha-1-predskazat-isklyuchenie}

Не запускайте код сразу. Для каждой строки назовите исключение:

```python
int("abc")
{}["id"]
[1][3]
10 / 0
"text".append("!")
```

::: details Показать ответ

1. `ValueError`.
2. `KeyError`.
3. `IndexError`.
4. `ZeroDivisionError`.
5. `AttributeError`.

:::

## Задача 2. Безопасное преобразование {#zadacha-2-bezopasnoe-preobrazovanie}

Напишите функцию `parse_age(value)`, которая:

- преобразует строку в `int`;
- при неправильном формате возвращает `None`;
- не перехватывает неизвестные исключения.

::: details Показать решение

```python
def parse_age(value):
    try:
        return int(value)
    except ValueError:
        return None


print(parse_age("25"))  # 25
print(parse_age("unknown"))  # None
```

:::

## Задача 3. Проверка аргументов {#zadacha-3-proverka-argumentov}

Напишите `calculate_discount(price, discount)`. Требования:

- оба аргумента должны быть числами;
- цена не может быть отрицательной;
- скидка должна находиться от `0` до `1`;
- выберите разные исключения для неправильного типа и значения.

::: details Показать решение

```python
def calculate_discount(price, discount):
    if not isinstance(price, (int, float)):
        raise TypeError("Цена должна быть числом")

    if not isinstance(discount, (int, float)):
        raise TypeError("Скидка должна быть числом")

    if price < 0:
        raise ValueError("Цена не может быть отрицательной")

    if not 0 <= discount <= 1:
        raise ValueError("Скидка должна находиться от 0 до 1")

    return price * (1 - discount)


print(calculate_discount(100, 0.2))  # 80.0
```

:::

## Задача 4. Собственное исключение {#zadacha-4-sobstvennoe-isklyuchenie}

Создайте `InvalidAgeError`. Функция `register_user(age)` должна создавать его для возраста меньше нуля.

::: details Показать решение

```python
class InvalidAgeError(ValueError):
    pass


def register_user(age):
    if age < 0:
        raise InvalidAgeError("Возраст не может быть отрицательным")

    return "Пользователь зарегистрирован"
```

:::

## Задача 5. Исправить плохой обработчик {#zadacha-5-ispravit-plokhoy-obrabotchik}

Дан код:

```python
try:
    with open(path, "r", encoding="utf-8") as file:
        number = int(file.read())
except:
    number = 0
```

Разделите обработку отсутствующего файла и неправильного содержимого.

::: details Показать решение

```python
try:
    with open(path, "r", encoding="utf-8") as file:
        number = int(file.read())
except FileNotFoundError:
    print("Файл не найден")
    number = 0
except ValueError:
    print("В файле должно находиться целое число")
    number = 0
```

:::

## Алгоритм диагностики {#algoritm-diagnostiki}

1. Прочитайте последнюю строку traceback.
2. Найдите первую строку своего кода снизу.
3. Определите фактические значения и их типы.
4. Воспроизведите проблему на минимальном примере.
5. Решите, является ли ситуация ожидаемой.
6. Исправьте баг или добавьте конкретный обработчик.
7. Проверьте пограничные случаи.

## Краткое повторение {#kratkoe-povtorenie}

- Класс исключения описывает причину проблемы.
- Ошибки программирования нужно исправлять.
- Ожидаемые внешние проблемы можно обрабатывать.
- Перехватывайте наиболее конкретный класс.
- Собственное исключение полезно для правила предметной области.

<RelatedTopics
    :items="[
        { title: 'Обзор типов ошибок', href: '/python/yazyk-python/1-core/tipy-oshibok-i-isklyucheniy/' },
        { title: 'Обработка исключений', href: '/python/yazyk-python/1-core/tipy-oshibok-i-isklyucheniy/obrabotka-isklyucheniy-try-except' },
        { title: 'Функции', href: '/python/yazyk-python/1-core/funktsii-v-python/' },
    ]"
/>
