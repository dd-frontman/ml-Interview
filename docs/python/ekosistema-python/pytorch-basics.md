---
title: "PyTorch basics"
description: "Практический минимум PyTorch для перехода к deep learning: Tensor, Dataset, DataLoader, training loop, device и no_grad."
tags:
  - "python"
  - "pytorch"
  - "deep-learning"
  - "ml"
updatedAt: "2026-06-13"
---
## Big Picture

PyTorch нужен, когда классического ML уже недостаточно: нейросети, embeddings, компьютерное зрение, NLP, трансформеры.

Минимум для входа:

- `Tensor`;
- `Dataset` и `DataLoader`;
- модель как `nn.Module`;
- training loop;
- `device`;
- `torch.no_grad()` для inference.

## Tensor

```python
import torch

x = torch.tensor([[1.0, 2.0], [3.0, 4.0]])

print(x.shape)
print(x.dtype)
```

Tensor похож на NumPy array, но умеет autograd и работу на GPU.

## Dataset и DataLoader

```python
from torch.utils.data import DataLoader, TensorDataset

X = torch.tensor([[1.0, 2.0], [3.0, 4.0]])
y = torch.tensor([0, 1])

dataset = TensorDataset(X, y)
loader = DataLoader(dataset, batch_size=2, shuffle=True)
```

`DataLoader` отвечает за batch-и и перемешивание данных.

## Модель

```python
from torch import nn


class LogisticModel(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.linear = nn.Linear(2, 1)

    def forward(self, x):
        return self.linear(x)
```

`forward` описывает прямой проход модели.

## Training loop

```python
model = LogisticModel()
loss_fn = nn.BCEWithLogitsLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

for features, target in loader:
    logits = model(features).squeeze(1)
    loss = loss_fn(logits, target.float())

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
```

Смысл шагов:

- forward;
- loss;
- обнулить градиенты;
- backward;
- optimizer step.

## Inference

```python
model.eval()

with torch.no_grad():
    logits = model(X).squeeze(1)
    scores = torch.sigmoid(logits)
```

`model.eval()` переключает модель в inference-режим, `torch.no_grad()` отключает расчет градиентов.

## Типичные ошибки

1. Не вызывать `optimizer.zero_grad()`.
   Проблема: градиенты накапливаются.
   Решение: обнулять перед `backward`.

2. Забыть `model.eval()` на inference.
   Проблема: dropout/batchnorm ведут себя как на train.
   Решение: вызывать `eval()`.

3. Считать градиенты на inference.
   Проблема: лишняя память и время.
   Решение: `with torch.no_grad()`.

4. Смешивать CPU и GPU tensors.
   Проблема: runtime error.
   Решение: переносить model и tensors на один `device`.

## Cheat-sheet

| Задача | PyTorch |
| --- | --- |
| Массив данных | `torch.Tensor` |
| Батчи | `DataLoader` |
| Модель | `nn.Module` |
| Loss | `nn.*Loss` |
| Оптимизация | `torch.optim.*` |
| Inference | `model.eval()` + `torch.no_grad()` |

## Official docs

<OfficialDocsLinks
    :links="[
        { title: 'PyTorch quickstart', href: 'https://docs.pytorch.org/tutorials/beginner/basics/quickstart_tutorial.html' },
        { title: 'PyTorch tensors', href: 'https://docs.pytorch.org/tutorials/beginner/basics/tensorqs_tutorial.html' },
        { title: 'PyTorch Dataset and DataLoader', href: 'https://docs.pytorch.org/tutorials/beginner/basics/data_tutorial.html' },
        { title: 'PyTorch autograd', href: 'https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html' },
    ]"
/>

<RelatedTopics
    :items="[
        { title: 'Основы нейросетей', href: '/deep-learning/osnovy-neirosetei' },
        { title: 'NumPy и Pandas для ML', href: '/python/ekosistema-python/numpy-i-pandas-dlya-ml' },
        { title: 'Артефакты модели и inference', href: '/python/ekosistema-python/artefakty-modeli-i-inference' },
    ]"
/>
