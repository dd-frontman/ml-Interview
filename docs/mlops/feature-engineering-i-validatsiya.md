---
title: "Feature engineering и валидация"
description: "Принципы построения признаков и корректной валидации модели без утечек и переобучения."
tags:
  - "ml"
  - "mlops"
  - "feature-engineering"
updatedAt: "2026-02-27"
---
## Feature engineering

- Очистка и нормализация данных.
- Категориальные признаки: one-hot, target encoding (осторожно с leakage).
- Временные признаки и лаги.

## Валидация

- Hold-out, K-Fold, Stratified K-Fold.
- Time-series split для временных рядов.
- Стабильность метрик на разных срезах данных.

## Антипаттерны

- Фитить препроцессор на всем датасете до split.
- Подбирать гиперпараметры на test.
