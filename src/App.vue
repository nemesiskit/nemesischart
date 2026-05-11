<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const tituloAtual = computed(() => route.meta?.titulo || 'NemesisChart')
</script>

<template>
  <div class="app">
    <header class="app__header">
      <div class="app__brand">
        <span class="app__logo">◆</span>
        <div>
          <div class="app__brand-name">NemesisChart</div>
          <div class="app__brand-sub">{{ tituloAtual }}</div>
        </div>
      </div>
      <nav class="app__nav">
        <RouterLink to="/playground" class="app__link">Playground</RouterLink>
        <RouterLink to="/dashboard" class="app__link">Dashboard</RouterLink>
        <RouterLink to="/docs" class="app__link">Docs</RouterLink>
      </nav>
    </header>

    <main class="app__main">
      <RouterView />
    </main>
  </div>
</template>

<style>
body { margin: 0; background: #F8FAFC; font-family: 'Inter', sans-serif; color: #0F172A; }
.app { min-height: 100vh; display: flex; flex-direction: column; }

.app__header {
  display: flex; justify-content: space-between; align-items: center;
  gap: 0.75rem; flex-wrap: wrap;
  padding: 0.9rem 1.5rem; background: #fff; border-bottom: 1px solid #E2E8F0;
  position: sticky; top: 0; z-index: 10;
}
.app__brand { display: flex; align-items: center; gap: 0.7rem; min-width: 0; }
.app__brand > div { min-width: 0; }
.app__brand-name, .app__brand-sub { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.app__logo {
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: #fff;
  border-radius: 10px; font-size: 1.1rem;
}
.app__brand-name { font-weight: 700; font-size: 1.05rem; line-height: 1.1; }
.app__brand-sub { font-size: 0.75rem; color: #64748B; }

.app__nav { display: flex; gap: 0.3rem; flex-wrap: wrap; }
.app__link {
  text-decoration: none; color: #475569; font-size: 0.88rem; font-weight: 500;
  padding: 0.45rem 0.9rem; border-radius: 8px; transition: background 0.15s ease, color 0.15s ease;
}
.app__link:hover { background: #F1F5F9; color: #0F172A; }
.app__link.router-link-active {
  background: #EFF6FF; color: #1D4ED8;
}

.app__main { padding: 1.5rem; flex: 1; }

@media (max-width: 640px) {
  .app__header { padding: 0.7rem 1rem; }
  .app__main { padding: 1rem; }
  .app__link { padding: 0.4rem 0.65rem; font-size: 0.82rem; }
  .app__brand-sub { display: none; }
}
</style>
