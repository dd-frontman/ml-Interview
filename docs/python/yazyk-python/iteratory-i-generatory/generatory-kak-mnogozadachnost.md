---
title: "Генераторы как простая многозадачность"
description: "Разбор примера с часами и обходом диска на генераторах под macOS: как два генератора работают по очереди в одном потоке, подводные камни, улучшенная версия, простой планировщик задач, связь с asyncio и аналогии с JS."
tags:
  - "python"
  - "core"
  - "generators"
  - "concurrency"
updatedAt: "2026-10-22"
search: false
---
## Идея примера {#ideya-primera}

Два независимых процесса работают по очереди в одном потоке, без потоков и `async`:

- `query()` обходит папки на диске;
- `clock()` работает как будильник и раз в 5 секунд отдает `"5 sec"`.

Функция `main()` по очереди берет по одному значению из каждого генератора. Пока один генератор работает, другой стоит на паузе на своем `yield`. Это и есть кооперативная многозадачность: задачи сами уступают управление друг другу.

## Код для macOS {#kod-dlya-macos}

```python
import os
import time


def clock():
    time0 = round(time.time())
    while True:
        if (round(time.time()) - time0) % 5 == 0:
            yield "5 sec"
        else:
            yield 0


def query():
    for i in os.walk("/"):
        yield i[0]


def main():
    data = query()
    alarm = clock()
    while True:
        d = next(data)
        a = next(alarm)
        print(d)
        if a:
            print(a)
        time.sleep(1)


main()
```

Остановить программу: `Ctrl + C`.

## Что поменялось относительно Windows {#chto-pomenyalos-otnositelno-windows}

В исходном примере обход начинался с `os.walk("C:\\")`. На macOS и Linux дисков с буквами нет, вся файловая система начинается с корня `/`.

| | Windows | macOS и Linux |
| --- | --- | --- |
| Корень диска | `C:\` | `/` |
| Строка в Python | `"C:\\"` | `"/"` |
| Домашняя папка | `C:\Users\имя` | `/Users/имя` на macOS, `/home/имя` на Linux |
| Разделитель в пути | `\` | `/` |

Если оставить `"C:\\"` на macOS, программа сразу упадет. Такой папки нет, `os.walk` по умолчанию молча пропускает ошибки и ничего не отдает, поэтому первый же `next(data)` бросит `StopIteration`.

Варианты, которые работают на macOS:

```python
os.walk("/")                          # весь диск, как C:\ в Windows
os.walk(os.path.expanduser("~"))      # только домашняя папка
os.walk(os.path.expanduser("~/Downloads"))  # одна конкретная папка
```

Если код должен работать на любой системе, корень можно получить через `pathlib`:

```python
from pathlib import Path

root = Path.home().anchor  # "C:\\" на Windows, "/" на macOS и Linux
os.walk(root)
```

## Разбор по частям {#razbor-po-chastyam}

### `query()` - обход папок {#query-obkhod-papok}

`os.walk(path)` обходит дерево папок вглубь. На каждом шаге он отдает кортеж из трех элементов:

```python
for dir_path, dir_names, file_names in os.walk("/"):
    print(dir_path)    # '/usr' - путь текущей папки
    print(dir_names)   # ['bin', 'lib', ...] - вложенные папки
    print(file_names)  # [...] - файлы в этой папке
    break
```

`i[0]` в примере берет только путь. Обход ленивый: весь диск заранее не сканируется, следующая папка читается только по запросу `next(data)`. Если бы мы сначала собрали список всех папок, программа надолго зависла бы на старте.

### `clock()` - будильник {#clock-budilnik}

- `time.time()` возвращает текущее время в секундах, `round()` убирает дробную часть.
- `time0` запоминается не при вызове `clock()`, а при первом `next(alarm)`, потому что до этого тело генератора не выполнялось.
- При каждом `next(alarm)` генератор считает, сколько секунд прошло с `time0`. Если число делится на 5, отдает `"5 sec"`, иначе `0`.
- В фоне генератор **не тикает**. Время проверяется только в момент, когда его спрашивают.

### `main()` - диспетчер {#main-dispetcher}

1. Создает оба генератора. Тело ни одного из них еще не выполняется.
2. В бесконечном цикле берет следующую папку и состояние будильника.
3. Печатает папку и, если будильник сработал, `"5 sec"`. `0` - ложное значение, поэтому `if a:` его пропускает.
4. Ждет секунду.

Простая аналогия: генератор похож на дозатор конфет. Нажал `next`, получил одну конфету, дозатор замер. Пока не нажмешь снова, внутри ничего не происходит. `main()` по очереди нажимает два дозатора.

## Пример вывода на macOS {#primer-vyvoda-na-macos}

```text
/
5 sec
/usr
/usr/bin
/usr/standalone
/usr/standalone/firmware
/usr/standalone/firmware/...
5 sec
...
```

Порядок папок зависит от файловой системы и может отличаться.

## Подводные камни {#podvodnye-kamni}

1. `"5 sec"` печатается сразу, на первой итерации.
   Прошло `0` секунд, а `0 % 5 == 0`.

2. Будильник может пропустить срабатывание.
   Генератор проверяет время только по запросу, это не `setInterval`. Одна итерация длится чуть больше секунды: `sleep`, `print` и чтение папки. Если `os.walk` надолго застрянет на большой папке, счетчик может перескочить с `4` сразу на `6`. Кроме того, `round()` округляет до ближайшего целого, и разница может прыгнуть на 2.

3. Когда папки закончатся, программа упадет.
   `next(data)` бросит `StopIteration`. На корне диска до этого дело вряд ли дойдет: при одной папке в секунду обход займет дни.

4. macOS может спросить разрешение на доступ.
   При обходе `/` или `~` генератор дойдет до папок «Документы», «Рабочий стол» и «Загрузки». macOS покажет окно с запросом доступа для терминала или редактора. Если отказать, `os.walk` просто пропустит эти папки.

5. Системные папки без прав доступа пропускаются молча.
   `os.walk` по умолчанию игнорирует ошибки. Чтобы их увидеть, передай `onerror=print`.

6. `time.time()` зависит от системных часов.
   Если часы переведут, например при синхронизации времени, будильник собьется. Для измерения интервалов есть `time.monotonic()`.

## Улучшенная версия {#uluchshennaya-versiya}

Исправим подводные камни, не меняя идеи:

```python
import os
import time
from pathlib import Path


def clock(interval: int = 5):
    start = time.monotonic()
    last_tick = 0
    while True:
        tick = int((time.monotonic() - start) // interval)
        if tick > last_tick:  # прошел новый интервал
            last_tick = tick
            yield f"{interval} sec"
        else:
            yield None


def query(root: Path):
    for dir_path, _dir_names, _file_names in os.walk(root):
        yield dir_path


def main():
    data = query(Path.home() / "Downloads")
    alarm = clock()
    while True:
        d = next(data, None)
        if d is None:
            print("Обход закончен")
            break

        a = next(alarm)
        print(d)
        if a:
            print(a)
        time.sleep(1)


main()
```

Что изменилось:

| Было | Стало | Зачем |
| --- | --- | --- |
| `% 5 == 0` | сравнение номера интервала с прошлым | будильник не срабатывает на старте и не пропускает интервалы |
| `time.time()` | `time.monotonic()` | не зависит от перевода системных часов |
| `os.walk("C:\\")` | `os.walk(root)` с параметром | папку легко поменять, работает на любой системе |
| `i[0]` | распаковка `dir_path, _dir_names, _file_names` | понятно, что лежит в кортеже |
| `next(data)` | `next(data, None)` и `break` | программа завершается без ошибки |
| `yield 0` | `yield None` | «ничего не произошло» обозначено явно |

## Обобщение: планировщик задач {#obobshchenie-planirovshchik-zadach}

В `main()` два генератора зашиты вручную. Если задач много, их кладут в очередь и по кругу дают каждой сделать один шаг:

```python
from collections import deque


def task(name: str, steps: int):
    for i in range(steps):
        yield f"{name} step {i}"


def run(tasks: list):
    queue = deque(tasks)
    while queue:
        current = queue.popleft()
        try:
            print(next(current))
        except StopIteration:
            continue          # задача закончилась - не возвращаем в очередь
        queue.append(current) # задача сделала шаг - в конец очереди


run([task("A", 2), task("B", 3)])

# A step 0
# B step 0
# A step 1
# B step 1
# B step 2
```

Это упрощенная модель цикла событий (event loop). Настоящий `asyncio` устроен так же: задачи встают на паузу на `await`, а цикл событий переключается на ту, которая готова продолжить. Только вместо `time.sleep()`, который блокирует весь поток, используется `await asyncio.sleep()`, и в это время выполняются другие задачи.

Как запускать задачи в настоящем `asyncio`, разобрано в разделе [Asyncio: корутины, задачи и TaskGroup](../asyncio-korutiny-i-taskgroup.md).

## Аналогия с JS {#analogiya-s-js}

| Python | JS |
| --- | --- |
| `def f(): yield x` | `function* f() { yield x }` |
| `g = f()` | `const g = f()`, тело еще не запущено |
| `next(g)` | `g.next().value` |
| генератор закончился, `next()` бросает `StopIteration` | `g.next()` возвращает `{ done: true, value: undefined }` |
| `time.time()` | `Date.now() / 1000` |
| `time.monotonic()` | `performance.now() / 1000` |
| `time.sleep(1)` блокирует поток | `await new Promise(r => setTimeout(r, 1000))` поток не блокирует |
| `os.walk(root)` | рекурсивный `fs.readdirSync` |

Тот же код на JS для Node.js:

```js
const fs = require("fs");
const path = require("path");

function* clock() {
  const time0 = Math.round(Date.now() / 1000);
  while (true) {
    if ((Math.round(Date.now() / 1000) - time0) % 5 === 0) {
      yield "5 sec";
    } else {
      yield 0;
    }
  }
}

// аналог os.walk: обход папок вглубь, по одной за раз
function* query(dir = "/") {
  yield dir;
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {} // os.walk по умолчанию тоже молча пропускает ошибки доступа
  for (const entry of entries) {
    if (entry.isDirectory()) yield* query(path.join(dir, entry.name));
  }
}

async function main() {
  const data = query();
  const alarm = clock();
  while (true) {
    const d = data.next().value;
    const a = alarm.next().value;
    console.log(d);
    if (a) console.log(a);
    await new Promise((r) => setTimeout(r, 1000));
  }
}

main();
```

Отличие в конце обхода: Python упадет со `StopIteration`, а JS не упадет и будет бесконечно печатать `undefined`.

Похожая идея в JS-мире - библиотеки `co` и `redux-saga`. До появления `async/await` асинхронный код писали на генераторах: функция делала `yield` промиса, а библиотека ждала его и возвращала результат через `next(value)`.

## Частые ошибки {#chastye-oshibki}

1. Оставить путь `"C:\\"` на macOS или Linux.
   Генератор ничего не отдаст, и первый `next()` упадет со `StopIteration`.

2. Ждать, что генератор работает в фоне.
   Генератор выполняется только внутри `next()`. Между вызовами он стоит.

3. Делать в одном шаге генератора долгую работу.
   Остальные задачи будут ждать. В кооперативной многозадачности каждая задача должна быстро уступать управление.

4. Использовать `time.sleep()` в асинхронном коде.
   Он останавливает весь поток. В `asyncio` нужен `await asyncio.sleep()`.

## Практические задачи {#prakticheskie-zadachi}

### Задача 1 {#zadacha-1}

Запусти код для macOS. Посчитай, через сколько итераций будильник сработает второй раз, и объясни, почему на первой итерации он сработал сразу.

### Задача 2 {#zadacha-2}

Добавь третий генератор `counter()`, который отдает номер итерации, и выводи его рядом с путем папки.

### Задача 3 {#zadacha-3}

Перепиши `main()` через планировщик `run()` из раздела про обобщение так, чтобы `query()` и `clock()` были двумя задачами в одной очереди.

## Краткая шпаргалка {#kratkaya-shpargalka}

```python
os.walk("/")                     # корень диска на macOS и Linux
os.walk(Path.home().anchor)      # корень на любой системе
next(gen, None)                  # без StopIteration в конце
time.monotonic()                 # для интервалов вместо time.time()

queue = deque(tasks)             # простой планировщик
while queue:
    task = queue.popleft()
    try:
        next(task)
    except StopIteration:
        continue
    queue.append(task)
```

## Официальная документация {#ofitsialnaya-dokumentatsiya}

<OfficialDocsLinks
    :links="[
        { title: 'Python: os.walk()', href: 'https://docs.python.org/3/library/os.html#os.walk' },
        { title: 'Python: time.monotonic()', href: 'https://docs.python.org/3/library/time.html#time.monotonic' },
        { title: 'Python: pathlib', href: 'https://docs.python.org/3/library/pathlib.html' },
        { title: 'Python: asyncio', href: 'https://docs.python.org/3/library/asyncio.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Генераторы и yield', href: '/python/yazyk-python/iteratory-i-generatory/generatory-i-yield' },
        { title: 'Управление генератором', href: '/python/yazyk-python/iteratory-i-generatory/upravlenie-generatorom-send-throw-close' },
        { title: 'yield from и конвейеры', href: '/python/yazyk-python/iteratory-i-generatory/yield-from-i-konveyery' },
        { title: 'Дата и время', href: '/python/yazyk-python/datetime-i-timezone' },
    ]"
/>
