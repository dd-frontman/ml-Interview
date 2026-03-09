# Documentation Project Analysis

## 1) Структура проекта

- Формат: VitePress (`srcDir: docs`) с автогенерацией навигации и индекса.
- Source of truth:
  - контент: `docs/**/*.md`;
  - frontmatter в самих markdown-файлах;
  - generated-артефакты: `.vitepress/sidebar.generated.ts`, `.vitepress/theme/generated/content-index.ts`.
- Ключевые разделы первого уровня:
  - `docs/math`
  - `docs/ml`
  - `docs/deep-learning`
  - `docs/mlops`
  - `docs/python`
  - `docs/interview-prep`
- Навигация:
  - sidebar полностью генерируется `scripts/generate-sidebar.mjs`;
  - карточки home заданы вручную в `docs/index.md`;
  - cross-linking через `<RelatedTopics />`.
- UI-компоненты документации:
  - `<OfficialDocsLinks />` для ссылок на первоисточники;
  - `<RelatedTopics />` для внутренних связей.

## 2) Правила оформления и стандарты

- Обязательный frontmatter (кроме `docs/index.md`):
  - `title`, `description`, `tags`, `updatedAt` (`YYYY-MM-DD`).
- Naming conventions:
  - маршруты и slug только `kebab-case` и lower-case латиница (`validate-routes.mjs`);
  - root-ссылки вида `/section/page`.
- Встроенные проверки качества:
  - `yarn validate-content` (frontmatter, недопустимые артефакты, code fences);
  - `yarn validate-links` (внутренние ссылки, `RelatedTopics`, orphan pages);
  - `yarn validate-routes` (валидность route формата и ссылок sidebar/home).
- Проект ориентирован на итеративное обновление без ручного редактирования generated-файлов.

## 3) Стиль документации

- Язык: русский.
- Тон: инженерный, прикладной, без академического перегруза.
- Формат: короткие секции, списки, код-блоки и таблицы.
- Наблюдаемая глубина неоднородна:
  - части `docs/python/1-core/*` и `docs/ml/obuchenie-s-uchitelem.md` уже в формате «практический гайд»;
  - ряд страниц (`math/*`, `deep-learning/*`, часть `mlops/*`, `docs/python/numpy-i-pandas-dlya-ml.md`) остаются краткими конспектами.

## 4) Что уже описано

- Покрыты основные домены:
  - математика для ML;
  - supervised/unsupervised ML;
  - основы deep learning;
  - MLOps;
  - Python-база;
  - подготовка к интервью.
- В Python-разделе появилась детальная ветка `1-core` с кодом, типичными ошибками, cheat-sheet и official docs.

## 5) Пробелы, дублирование, противоречия

### Пробелы

- Неполное выравнивание страниц по единому шаблону:
  - не везде есть «Практический пример», «Типичные ошибки», «Cheat-sheet», «Official docs».
- Не у всех тем явно разложены data/training/inference flow.
- Часть страниц слабо связана через `RelatedTopics`.

### Потенциальное дублирование

- `docs/ml/obuchenie-s-uchitelem.md` и `docs/mlops/feature-engineering-i-validatsiya.md` пересекаются в leakage/валидации.
- `docs/python/vvedenie-v-python.md` и `docs/python/1-core/*` частично покрывают одинаковый вводный материал (typing, venv, testing).

### Противоречия

- Инфраструктура качества зрелая (генераторы, валидаторы, компоненты), но глубина контента по разделам пока неравномерна.
- Home-страница позиционирует документацию как комплексную базу, но часть статей пока ближе к «шпаргалке».

## 6) Рекомендации

- Обновлять контент итеративно в существующей структуре без новых верхнеуровневых разделов.
- Нормализовать формат страниц к единому каркасу:
  1. Big Picture
  2. Концепция простым языком
  3. Инженерная интерпретация
  4. Минимальный пример кода
  5. Практический пример
  6. Типичные ошибки
  7. Cheat-sheet
  8. Official docs
- При обновлении вводных страниц делать явные ссылки на более глубокие разделы, чтобы избегать дублирования.
