---
title: "Deploy и мониторинг ML-моделей"
description: "Практика вывода модели в прод: способы деплоя, мониторинг качества и реакция на data/model drift."
tags:
  - "ml"
  - "mlops"
  - "deployment"
updatedAt: "2026-02-27"
---
## Способы деплоя {#sposoby-deploya}

- Batch inference.
- Online inference (REST/gRPC).
- Streaming inference.

## Что мониторить {#chto-monitorit}

- Технические метрики: latency, error rate, throughput.
- Data quality: пропуски, выбросы, сдвиг распределений.
- Бизнес-метрики и online-качество модели.

## Drift {#drift}

- Data drift: изменилось входное распределение.
- Concept drift: изменилась связь между `X` и `y`.

## Реакция {#reaktsiya}

- Alerting и fallback-стратегия.
- Переобучение по расписанию или по триггерам.
- A/B или shadow deployment для релизов модели.
