---
---

<script setup>
import { withBase } from 'vitepress'
</script>

<div class="home-content home-header">
  <h1 class="home-title">ML Interview Documentation</h1>
  <p class="home-subtitle">Документация по Machine Learning</p>
  <p class="home-description">Структурированная база знаний по математике, алгоритмам ML, deep learning и MLOps для подготовки к собеседованиям</p>
  <a :href="withBase('/ml/obuchenie-s-uchitelem')" class="home-cta-button">Начать изучение</a>
</div>

<div class="home-divider">
  <hr>
</div>

<div class="home-content home-sections">

## Основные разделы

<div class="home-sections-grid">

<div class="home-section-card">
  <h3 class="home-section-title"><a :href="withBase('/math/lineynaya-algebra-dlya-ml')" class="home-section-link">Математика</a></h3>
  <p class="home-section-description">Линейная алгебра и статистика для ML</p>
</div>

<div class="home-section-card">
  <h3 class="home-section-title"><a :href="withBase('/ml/obuchenie-s-uchitelem')" class="home-section-link">Классический ML</a></h3>
  <p class="home-section-description">Supervised/unsupervised задачи, модели и метрики</p>
</div>

<div class="home-section-card">
  <h3 class="home-section-title"><a :href="withBase('/deep-learning/transformery-baza')" class="home-section-link">Deep Learning</a></h3>
  <p class="home-section-description">Нейросети, оптимизация и трансформеры</p>
</div>

<div class="home-section-card">
  <h3 class="home-section-title"><a :href="withBase('/mlops/deploy-i-monitoring')" class="home-section-link">MLOps</a></h3>
  <p class="home-section-description">Прод, мониторинг, дрейф и жизненный цикл моделей</p>
</div>

<div class="home-section-card">
  <h3 class="home-section-title"><a :href="withBase('/python/vvedenie-v-python')" class="home-section-link">Python Stack</a></h3>
  <p class="home-section-description">Python как инженерная база для data, training и inference flow</p>
</div>

<div class="home-section-card">
  <h3 class="home-section-title"><a :href="withBase('/interview-prep/podgotovka-k-ml-sobesedovaniyu')" class="home-section-link">Подготовка к интервью</a></h3>
  <p class="home-section-description">План подготовки и типовые вопросы</p>
</div>

</div>

</div>

---

<RelatedTopics
    :items="[
        { title: 'Обучение с учителем', href: '/ml/obuchenie-s-uchitelem' },
        { title: 'Подготовка к ML-собеседованию', href: '/interview-prep/podgotovka-k-ml-sobesedovaniyu' },
    ]"
/>
