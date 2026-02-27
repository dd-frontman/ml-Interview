# ML Interview Documentation

Комплексная документация по Machine Learning для подготовки к собеседованиям.

## О проекте

Проект построен на VitePress и содержит структурированную базу знаний по:

- математике для ML;
- классическому ML;
- deep learning;
- MLOps;
- практической подготовке к интервью.

Ключевые особенности:

- Контент в `docs/` с единым `frontmatter`
- Автогенерация `sidebar` из контента
- Генерация индекса контента по тегам
- Проверки ссылок/роутов/контента и orphan-страниц
- Stale-репорт по `updatedAt`
- Mobile smoke-тесты через Playwright в CI

## Требования

- Node.js `>=20`
- Yarn `1.22.x`

## Быстрый старт

```bash
yarn install
yarn dev
```

Локальный адрес: `http://localhost:5173/ml-interview/`

Продакшен-сборка:

```bash
yarn build
```

Артефакты: `.vitepress/dist`

## Основные команды

```bash
# Dev / Build
yarn dev
yarn build
yarn preview

# Генерация метаданных
yarn sync:frontmatter
yarn generate:content-index
yarn generate:sidebar
yarn sync:meta
yarn check:generated

# Валидации
yarn type-check
yarn validate-content
yarn validate-links
yarn validate-routes
yarn report:stale

# Линтинг / форматирование / тесты
yarn lint
yarn lint:md
yarn format
yarn test:mobile
```

## Контент: правила добавления

1. Добавляйте новый материал как `docs/<section>/<slug>.md` в `kebab-case`.
2. Пишите контент в markdown без ручной правки `sidebar.generated.ts`.
3. Перед коммитом запускайте:

```bash
yarn sync:meta
yarn validate-content
yarn validate-links
yarn validate-routes
```

### Frontmatter (обязательный формат)

Для всех страниц (кроме `docs/index.md`) используется единая схема:

```yaml
---
title: "Название статьи"
description: "Короткое описание"
tags:
  - "tag-1"
  - "tag-2"
updatedAt: "2026-02-27"
---
```

## Структура проекта

```text
.
├── docs/
├── .vitepress/
│   ├── config.ts
│   ├── sidebar.generated.ts
│   └── theme/generated/content-index.ts
├── scripts/
├── tests/mobile/
├── playwright.mobile.config.ts
└── .github/workflows/deploy.yml
```

## Лицензия

MIT, см. [LICENSE](LICENSE).
