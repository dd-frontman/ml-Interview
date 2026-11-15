---
title: "return, print и pass"
description: "Как return возвращает результат, чем он отличается от print, почему функция возвращает None и зачем нужен pass."
tags:
  - "python"
  - "core"
  - "functions"
updatedAt: "2026-11-09"
---
## `return` {#return}

`return` возвращает значение вызывающему коду и сразу завершает выполнение функции.

```python
def find_average(numbers):
    return sum(numbers) / len(numbers)


average = find_average([1, 2, 3])
print(average)  # 2.0
```

Возвращённое значение можно:

- сохранить в переменную;
- передать другой функции;
- использовать в выражении;
- вернуть из другой функции.

```python
result = find_average([1, 2, 3]) + 10
print(result)  # 12.0
```

## `return` завершает функцию {#return-zavershaet-funktsiyu}

Код после выполненного `return` не запускается:

```python
def get_status(score):
    if score >= 60:
        return "Зачёт"

    return "Незачёт"


print(get_status(75))  # Зачёт
print(get_status(40))  # Незачёт
```

При `score = 75` первый `return` сразу завершает функцию, поэтому второй не выполняется.

## Функция без `return` {#funktsiya-bez-return}

Если функция дошла до конца без `return`, она автоматически возвращает `None`:

```python
def show_message():
    print("Сообщение")


result = show_message()  # Сообщение
print(result)  # None
```

`None` означает отсутствие полезного значения, но это всё равно результат вызова функции.

Пустой `return` также возвращает `None`:

```python
def stop_if_negative(number):
    if number < 0:
        return

    return number


print(stop_if_negative(-1))  # None
print(stop_if_negative(5))   # 5
```

## `print()` или `return` {#print-ili-return}

`print()` выводит значение в консоль. `return` передаёт значение вызывающему коду.

```python
def show_average(numbers):
    print(sum(numbers) / len(numbers))


result = show_average([1, 2, 3])  # 2.0
print(result)  # None
```

Результат `show_average()` нельзя использовать в следующем вычислении, потому что функция только напечатала число.

```python
def find_average(numbers):
    return sum(numbers) / len(numbers)


result = find_average([1, 2, 3])
print(result + 10)  # 12.0
```

Используй `return`, если результат нужен программе дальше. `print()` подходит для учебного вывода, отладки или простого консольного интерфейса.

## `pass` {#pass}

Python не разрешает оставлять тело функции пустым. `pass` создаёт пустой допустимый блок:

```python
def nothing():
    pass
```

Такая функция ничего не делает и возвращает `None`:

```python
my_variable = nothing()

print(my_variable)  # None
print(nothing())    # None
```

`pass` полезен как временная заглушка, когда функция уже нужна по структуре, но её логика ещё не написана.

## Типичные ошибки {#tipichnye-oshibki}

### Вернуть результат `print()` {#vernut-rezultat-print}

```python
def add(a, b):
    return print(a + b)


result = add(2, 3)  # 5
print(result)       # None
```

`print()` возвращает `None`, поэтому функция `add()` тоже возвращает `None`. Правильнее вернуть вычисленное значение:

```python
def add(a, b):
    return a + b


print(add(2, 3))  # 5
```

### Ожидать выполнение кода после `return` {#ozhidat-vypolnenie-koda-posle-return}

```python
def example():
    return 10
    print("Эта строка не выполнится")
```

После `return` выполнение функции уже завершено.

## Самостоятельная практика {#samostoyatelnaya-praktika}

1. Напиши функцию `is_adult(age)`, которая возвращает `True` или `False`.
2. Напиши функцию, которая печатает число, и сравни её результат с функцией, которая возвращает число.
3. Создай функцию-заглушку `load_data()` с помощью `pass` и проверь её результат.

<RelatedTopics
    :items="[
        { title: 'Обзор функций', href: '/python/yazyk-python/1-core/funktsii-v-python/' },
        { title: 'Объявление и вызов функции', href: '/python/yazyk-python/1-core/funktsii-v-python/obyavlenie-i-vyzov-funktsii' },
        { title: 'Обработка исключений', href: '/python/yazyk-python/1-core/obrabotka-isklyucheniy-try-except' },
    ]"
/>
