<script setup>
import { ref, computed, onMounted, onBeforeUnmount, reactive, nextTick } from 'vue'
import { CardLinhas, CardBarra, CardPizza, CardPolar, CardProgresso } from '../lib'

const ROW_H = 70
const GAP = 12

const containerRef = ref(null)
const containerWidth = ref(1200)

const COLS = computed(() => {
  if (containerWidth.value < 520) return 2
  if (containerWidth.value < 820) return 6
  return 12
})

const empilhado = computed(() => containerWidth.value < 520)

function atualizarLargura() {
  if (containerRef.value) containerWidth.value = containerRef.value.clientWidth
}

const colW = computed(() => (containerWidth.value - GAP * (COLS.value - 1)) / COLS.value)

let _id = 0
function uid() { return `card-${++_id}-${Date.now().toString(36)}` }

const linhasData = [
  { rotulo: 'Jan', quantidade: 1200 }, { rotulo: 'Fev', quantidade: 2800 },
  { rotulo: 'Mar', quantidade: 3200 }, { rotulo: 'Abr', quantidade: 3500 },
  { rotulo: 'Mai', quantidade: 4100 }, { rotulo: 'Jun', quantidade: 3800 },
]
const barraData = [
  { rotulo: 'A', quantidade: 320 }, { rotulo: 'B', quantidade: 210 },
  { rotulo: 'C', quantidade: 480 }, { rotulo: 'D', quantidade: 150 },
]
const pizzaData = [
  { rotulo: 'Mobile', quantidade: 55 }, { rotulo: 'Desktop', quantidade: 35 }, { rotulo: 'Tablet', quantidade: 10 },
]
const polarData = [
  { rotulo: 'Vendas', quantidade: 4200 }, { rotulo: 'Serviços', quantidade: 3100 },
  { rotulo: 'Assinaturas', quantidade: 2450 }, { rotulo: 'Suporte', quantidade: 1250 },
]
const progressoData = [
  { rotulo: 'Vendas', quantidade: 72, meta: 100 },
  { rotulo: 'Serviços', quantidade: 48, meta: 80 },
  { rotulo: 'Suporte', quantidade: 35, meta: 60 },
]

const TIPOS = {
  linhas: {
    label: 'Linhas',
    component: CardLinhas,
    propsPadrao: () => ({ legenda: 'Faturamento', sublegenda: '2026', titulo: 'R$ 11M', tipoValor: 'moeda', corDetalhes: '#3B82F6', data: linhasData }),
    sizePadrao: { w: 6, h: 5 },
  },
  barra: {
    label: 'Barras',
    component: CardBarra,
    propsPadrao: () => ({ legenda: 'Produtos', sublegenda: 'trimestre', titulo: '1.160', corDetalhes: '#10B981', data: barraData }),
    sizePadrao: { w: 6, h: 5 },
  },
  pizza: {
    label: 'Pizza',
    component: CardPizza,
    propsPadrao: () => ({ legenda: 'Dispositivos', sublegenda: 'últimos 30 dias', titulo: '100%', tipoValor: 'percentual', data: pizzaData }),
    sizePadrao: { w: 4, h: 5 },
  },
  polar: {
    label: 'Polar',
    component: CardPolar,
    propsPadrao: () => ({ legenda: 'Receita por área', sublegenda: 'mês', titulo: 'R$ 11k', tipoValor: 'moeda', data: polarData }),
    sizePadrao: { w: 4, h: 5 },
  },
  progresso: {
    label: 'Progresso',
    component: CardProgresso,
    propsPadrao: () => ({ legenda: 'Metas', sublegenda: 'trimestre', titulo: '72%', tipoValor: 'percentual', data: progressoData }),
    sizePadrao: { w: 4, h: 4 },
  },
}

const cards = reactive([
  { id: uid(), tipo: 'linhas', x: 0, y: 0, w: 8, h: 5, props: TIPOS.linhas.propsPadrao() },
  { id: uid(), tipo: 'pizza', x: 8, y: 0, w: 4, h: 5, props: TIPOS.pizza.propsPadrao() },
  { id: uid(), tipo: 'barra', x: 0, y: 5, w: 6, h: 5, props: TIPOS.barra.propsPadrao() },
  { id: uid(), tipo: 'progresso', x: 6, y: 5, w: 6, h: 4, props: TIPOS.progresso.propsPadrao() },
])

const STORAGE_KEY = 'nemesis-dashboard-layout-v1'

function salvar() {
  const dump = cards.map(({ id, tipo, x, y, w, h }) => ({ id, tipo, x, y, w, h }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dump))
}

function carregar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const dump = JSON.parse(raw)
    if (!Array.isArray(dump) || !dump.length) return
    cards.splice(0, cards.length, ...dump.map((it) => ({
      ...it,
      props: TIPOS[it.tipo] ? TIPOS[it.tipo].propsPadrao() : {},
    })))
  } catch { /* ignore */ }
}

function adicionar(tipo) {
  const def = TIPOS[tipo]
  if (!def) return
  const { w, h } = def.sizePadrao
  const y = cards.reduce((m, c) => Math.max(m, c.y + c.h), 0)
  cards.push({ id: uid(), tipo, x: 0, y, w, h, props: def.propsPadrao() })
  salvar()
}

function remover(id) {
  const i = cards.findIndex((c) => c.id === id)
  if (i >= 0) {
    cards.splice(i, 1)
    salvar()
  }
}

function limpar() {
  cards.splice(0, cards.length)
  salvar()
}

function resetar() {
  localStorage.removeItem(STORAGE_KEY)
  cards.splice(0, cards.length,
    { id: uid(), tipo: 'linhas', x: 0, y: 0, w: 8, h: 5, props: TIPOS.linhas.propsPadrao() },
    { id: uid(), tipo: 'pizza', x: 8, y: 0, w: 4, h: 5, props: TIPOS.pizza.propsPadrao() },
    { id: uid(), tipo: 'barra', x: 0, y: 5, w: 6, h: 5, props: TIPOS.barra.propsPadrao() },
    { id: uid(), tipo: 'progresso', x: 6, y: 5, w: 6, h: 4, props: TIPOS.progresso.propsPadrao() },
  )
}

function estiloCard(card, indice) {
  if (empilhado.value) {
    return {
      position: 'relative',
      transform: 'none',
      width: '100%',
      height: `${card.h * ROW_H + (card.h - 1) * GAP}px`,
      marginBottom: indice < cards.length - 1 ? `${GAP}px` : '0',
    }
  }
  const w = Math.min(card.w, COLS.value)
  const x = Math.min(card.x, COLS.value - w)
  const left = x * (colW.value + GAP)
  const top = card.y * (ROW_H + GAP)
  const width = w * colW.value + (w - 1) * GAP
  const height = card.h * ROW_H + (card.h - 1) * GAP
  return {
    transform: `translate(${left}px, ${top}px)`,
    width: `${width}px`,
    height: `${height}px`,
  }
}

const alturaGrid = computed(() => {
  if (empilhado.value) return 'auto'
  const maxY = cards.reduce((m, c) => Math.max(m, c.y + c.h), 0)
  return Math.max(10, maxY + 2) * (ROW_H + GAP) + 'px'
})

const estiloFundoGrid = computed(() => {
  if (empilhado.value) return { backgroundImage: 'none' }
  const cellW = `calc((100% - ${(COLS.value - 1) * GAP}px) / ${COLS.value} + ${GAP}px)`
  return { backgroundSize: `${cellW} ${ROW_H + GAP}px` }
})

// Drag and resize logic
const interacao = ref(null) // { tipo: 'move'|'resize', cardId, startX, startY, origX, origY, origW, origH }

function iniciarMover(e, card) {
  if (e.button !== 0) return
  e.preventDefault()
  interacao.value = {
    tipo: 'move', cardId: card.id,
    startX: e.clientX, startY: e.clientY,
    origX: card.x, origY: card.y, origW: card.w, origH: card.h,
  }
  document.addEventListener('pointermove', aoMover)
  document.addEventListener('pointerup', aoSoltar)
}

function iniciarRedimensionar(e, card) {
  if (e.button !== 0) return
  e.preventDefault()
  e.stopPropagation()
  interacao.value = {
    tipo: 'resize', cardId: card.id,
    startX: e.clientX, startY: e.clientY,
    origX: card.x, origY: card.y, origW: card.w, origH: card.h,
  }
  document.addEventListener('pointermove', aoMover)
  document.addEventListener('pointerup', aoSoltar)
}

function aoMover(e) {
  const it = interacao.value
  if (!it) return
  const card = cards.find((c) => c.id === it.cardId)
  if (!card) return
  const dx = Math.round((e.clientX - it.startX) / (colW.value + GAP))
  const dy = Math.round((e.clientY - it.startY) / (ROW_H + GAP))
  if (it.tipo === 'move') {
    card.x = Math.max(0, Math.min(COLS.value - card.w, it.origX + dx))
    card.y = Math.max(0, it.origY + dy)
  } else {
    card.w = Math.max(2, Math.min(COLS.value - card.x, it.origW + dx))
    card.h = Math.max(2, it.origH + dy)
  }
}

function aoSoltar() {
  document.removeEventListener('pointermove', aoMover)
  document.removeEventListener('pointerup', aoSoltar)
  interacao.value = null
  salvar()
  // chart re-render
  nextTick(() => window.dispatchEvent(new Event('resize')))
}

let ro
onMounted(() => {
  atualizarLargura()
  ro = new ResizeObserver(atualizarLargura)
  if (containerRef.value) ro.observe(containerRef.value)
  carregar()
})

onBeforeUnmount(() => {
  if (ro) ro.disconnect()
  document.removeEventListener('pointermove', aoMover)
  document.removeEventListener('pointerup', aoSoltar)
})
</script>

<template>
  <div class="dashboard">
    <div class="dashboard__topbar">
      <div>
        <h2 class="text-2xl font-bold m-0">Dashboard Dinâmico</h2>
        <p class="text-sm m-0 mt-1" style="color:#64748B">
          Arraste pelo cabeçalho · Redimensione pelo canto inferior direito · Adicione cards na barra lateral
        </p>
      </div>
      <div class="dashboard__actions">
        <button class="dashboard__btn dashboard__btn--ghost" @click="resetar">Reset</button>
        <button class="dashboard__btn dashboard__btn--ghost" @click="limpar">Limpar</button>
      </div>
    </div>

    <div class="dashboard__layout">
      <aside class="dashboard__sidebar">
        <div class="dashboard__sidebar-title">Adicionar Card</div>
        <button v-for="(def, key) in TIPOS" :key="key" class="dashboard__add-btn" @click="adicionar(key)">
          <span class="dashboard__add-icon">＋</span>
          <span>{{ def.label }}</span>
        </button>
        <div class="dashboard__hint">
          {{ cards.length }} card(s) · layout salvo no navegador
        </div>
      </aside>

      <div ref="containerRef" class="dashboard__grid" :class="{ 'dashboard__grid--stacked': empilhado }" :style="[{ height: alturaGrid }, estiloFundoGrid]">
        <div
          v-for="(card, i) in cards"
          :key="card.id"
          class="dashboard__card"
          :class="{ 'dashboard__card--moving': interacao && interacao.cardId === card.id }"
          :style="estiloCard(card, i)"
        >
          <div class="dashboard__card-header" @pointerdown="!empilhado && iniciarMover($event, card)">
            <span class="dashboard__drag-handle" aria-hidden="true">⋮⋮</span>
            <span class="dashboard__card-tipo">{{ TIPOS[card.tipo]?.label }}</span>
            <button class="dashboard__close" title="Remover" @pointerdown.stop @click="remover(card.id)">✕</button>
          </div>
          <div class="dashboard__card-body">
            <component :is="TIPOS[card.tipo].component" v-bind="card.props" />
          </div>
          <div v-if="!empilhado" class="dashboard__resize" @pointerdown="iniciarRedimensionar($event, card)" title="Redimensionar">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M2 12 L12 2 M6 12 L12 6 M10 12 L12 10" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 1rem; }

.dashboard__topbar {
  display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap;
}

.dashboard__actions { display: flex; gap: 0.5rem; }

.dashboard__btn {
  border: 1px solid #E2E8F0; background: #fff; color: #0F172A;
  padding: 0.5rem 0.9rem; border-radius: 8px; font-size: 0.85rem; font-weight: 500;
  cursor: pointer; transition: background 0.15s ease;
}
.dashboard__btn:hover { background: #F8FAFC; }
.dashboard__btn--ghost { background: transparent; }

.dashboard__layout {
  display: grid; grid-template-columns: 220px 1fr; gap: 1rem; align-items: flex-start;
}

.dashboard__sidebar {
  position: sticky; top: 1rem;
  background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1rem;
  display: flex; flex-direction: column; gap: 0.5rem;
}

.dashboard__sidebar-title {
  font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
  color: #64748B; margin-bottom: 0.25rem;
}

.dashboard__add-btn {
  display: flex; align-items: center; gap: 0.5rem;
  width: 100%; padding: 0.55rem 0.7rem; background: #F8FAFC;
  border: 1px solid #E2E8F0; border-radius: 8px; cursor: pointer;
  font-size: 0.85rem; font-weight: 500; color: #0F172A; text-align: left;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.dashboard__add-btn:hover { background: #EFF6FF; border-color: #3B82F6; color: #1D4ED8; }
.dashboard__add-icon { font-size: 1rem; line-height: 1; }

.dashboard__hint {
  margin-top: 0.5rem; font-size: 0.72rem; color: #94A3B8; line-height: 1.4;
}

.dashboard__grid {
  position: relative;
  background-image: linear-gradient(#F1F5F9 1px, transparent 1px),
                    linear-gradient(90deg, #F1F5F9 1px, transparent 1px);
  background-size: calc((100% - 11 * 12px) / 12 + 12px) 82px;
  border-radius: 12px;
  min-height: 600px;
  min-width: 0;
}
.dashboard__grid--stacked {
  background-image: none;
  min-height: 0;
  display: flex; flex-direction: column;
}

.dashboard__card {
  position: absolute; top: 0; left: 0;
  background: #fff; border: 1px solid #E2E8F0; border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);
  display: flex; flex-direction: column; overflow: hidden;
  transition: box-shadow 0.15s ease;
}
.dashboard__card--moving {
  box-shadow: 0 8px 24px rgba(59,130,246,0.25); z-index: 5;
}

.dashboard__card-header {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.4rem 0.7rem; background: #F8FAFC; border-bottom: 1px solid #EAE8E8;
  cursor: grab; user-select: none;
}
.dashboard__card-header:active { cursor: grabbing; }

.dashboard__drag-handle { color: #94A3B8; font-size: 0.85rem; letter-spacing: -2px; }
.dashboard__card-tipo {
  flex: 1; font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.05em; color: #64748B;
}
.dashboard__close {
  background: transparent; border: none; color: #94A3B8; cursor: pointer;
  font-size: 0.85rem; padding: 0.15rem 0.35rem; border-radius: 4px;
}
.dashboard__close:hover { background: #FEE2E2; color: #DC2626; }

.dashboard__card-body { flex: 1; overflow: hidden; padding: 0; min-height: 0; }
.dashboard__card-body > * { height: 100%; }

.dashboard__resize {
  position: absolute; right: 2px; bottom: 2px;
  width: 18px; height: 18px;
  display: flex; align-items: center; justify-content: center;
  color: #94A3B8; cursor: nwse-resize;
}
.dashboard__resize:hover { color: #3B82F6; }

@media (max-width: 900px) {
  .dashboard__layout {
    grid-template-columns: 1fr;
  }
  .dashboard__sidebar {
    position: static;
    flex-direction: row; flex-wrap: wrap; align-items: center;
  }
  .dashboard__sidebar-title { width: 100%; margin-bottom: 0; }
  .dashboard__add-btn { width: auto; flex: 0 0 auto; }
  .dashboard__hint { width: 100%; margin-top: 0.25rem; }
}

@media (max-width: 520px) {
  .dashboard__card-header { cursor: default; }
}
</style>
