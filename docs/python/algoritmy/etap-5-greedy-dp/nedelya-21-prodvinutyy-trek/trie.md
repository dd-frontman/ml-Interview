---
title: "Префиксное дерево Trie"
description: "Структура Trie для строк: общие префиксы, флаг конца слова, вставка, поиск полного слова, поиск префикса и сравнение с set."
tags:
  - "python"
  - "algorithms"
  - "data-structures"
  - "trie"
updatedAt: "2026-11-14"
---
## Какую проблему решаем {#kakuyu-problemu-reshaem}

Обычное множество быстро отвечает, существует ли полное слово. Но иногда нужно искать все слова с определённым началом:

```text
app -> app, apple, application
```

**Trie**, или префиксное дерево, хранит строки по символам и объединяет общие префиксы.

Для слов `cat`, `car`, `dog` структура выглядит так:

```text
root
├── c
│   └── a
│       ├── t*
│       └── r*
└── d
    └── o
        └── g*
```

Звёздочка обозначает конец полного слова.

## Узел дерева {#uzel-dereva}

Каждый узел хранит:

- словарь дочерних символов;
- флаг `is_word`, показывающий конец полного слова.

```python
class TrieNode:
    def __init__(self) -> None:
        self.children: dict[str, TrieNode] = {}
        self.is_word = False
```

Ключ словаря - следующий символ, значение - узел этого символа.

## Почему нужен `is_word` {#pochemu-nuzhen-is-word}

Слово может быть префиксом другого слова:

```text
app
apple
```

Узел второго `p` имеет потомка `l`, но одновременно завершает слово `app`. Поэтому нельзя считать словами только листья дерева: нужен отдельный флаг `is_word`.

## Полная реализация {#polnaya-realizatsiya}

```python
class TrieNode:
    def __init__(self) -> None:
        self.children: dict[str, TrieNode] = {}
        self.is_word = False


class Trie:
    def __init__(self) -> None:
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        current = self.root

        for character in word:
            if character not in current.children:
                current.children[character] = TrieNode()

            current = current.children[character]

        current.is_word = True

    def search(self, word: str) -> bool:
        node = self._find_node(word)
        return node is not None and node.is_word

    def starts_with(self, prefix: str) -> bool:
        return self._find_node(prefix) is not None

    def _find_node(self, text: str) -> TrieNode | None:
        current = self.root

        for character in text:
            if character not in current.children:
                return None

            current = current.children[character]

        return current
```

## Минимальный пример {#minimalnyy-primer}

```python
trie = Trie()
trie.insert("app")
trie.insert("apple")

print(trie.search("app"))        # True
print(trie.search("ap"))         # False
print(trie.starts_with("ap"))    # True
print(trie.starts_with("cat"))   # False
```

Префикс `"ap"` существует в дереве, но не является полным словом, потому что у соответствующего узла `is_word == False`.

## Как работает `insert()` {#kak-rabotaet-insert}

Для каждого символа:

1. проверяем, существует ли дочерний узел;
2. создаём его при необходимости;
3. переходим в этот узел;
4. после последнего символа устанавливаем `is_word = True`.

```python
for character in word:
    if character not in current.children:
        current.children[character] = TrieNode()

    current = current.children[character]
```

Общие части слов проходят через одни и те же узлы.

## Поиск слова и префикса {#poisk-slova-i-prefiksa}

Вспомогательный метод `_find_node()` возвращает узел последнего символа или `None`.

Для префикса достаточно существования узла:

```python
return self._find_node(prefix) is not None
```

Для полного слова дополнительно проверяется `is_word`:

```python
node = self._find_node(word)
return node is not None and node.is_word
```

## Сложность {#slozhnost}

Для строки длины `L`:

- вставка: `O(L)`;
- поиск слова: `O(L)`;
- поиск префикса: `O(L)`.

Память зависит от количества уникальных префиксов. В Python Trie может занимать заметно больше памяти, чем множество строк, из-за большого количества объектов и словарей.

## Trie или `set` {#trie-ili-set}

Используй `set`, если нужно только проверять полное слово:

```python
words = {"cat", "car", "dog"}

print("cat" in words)  # True
```

Используй Trie, если нужны:

- запросы по префиксу;
- автодополнение;
- одновременный поиск многих слов в тексте или матрице;
- обход всех слов с общим началом.

Не добавляй Trie, если обычное множество полностью решает задачу.

## Усложнение: автодополнение {#uslozhnenie-avtodopolnenie}

Чтобы вернуть все слова по префиксу:

1. найди узел последнего символа префикса;
2. запусти DFS из этого узла;
3. добавляй строку в ответ в каждом узле с `is_word == True`;
4. при возврате из рекурсии убирай последний символ текущего пути.

Важно оценить размер ответа: если по префиксу подходят тысячи слов, алгоритм не может вернуть их быстрее количества найденных символов.

## Типичные ошибки {#tipichnye-oshibki}

1. Считать словами только листья.
2. Не установить `is_word` после вставки.
3. Путать поиск слова и поиск префикса.
4. Использовать общий словарь `children` как атрибут класса.
5. Добавлять Trie, когда достаточно множества.
6. Не учитывать память большого количества узлов.

## Задачи для практики {#zadachi-dlya-praktiki}

1. Добавь метод, возвращающий все слова по заданному префиксу.
2. Реализуй удаление слова без удаления общих префиксов других слов.
3. Найди слова из словаря в матрице символов, используя Trie для отсечения лишних путей.

<RelatedTopics
    :items="[
        { title: 'Обзор недели', href: '/python/algoritmy/etap-5-greedy-dp/nedelya-21-prodvinutyy-trek/' },
        { title: 'Неделя 13. Binary Trees', href: '/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-13-binary-trees' },
        { title: 'Практика недели', href: '/python/algoritmy/etap-5-greedy-dp/nedelya-21-prodvinutyy-trek/praktika' },
    ]"
/>
