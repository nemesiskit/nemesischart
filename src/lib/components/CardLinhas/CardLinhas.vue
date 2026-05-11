<script setup>
import { computed, ref } from 'vue'
import ChartBase from '../ChartBase/ChartBase.vue'
import { useTema, toRgba } from '../../composables/useTema.js'
import { useFormatadorValor } from '../../composables/useFormatadorValor.js'
import { criarTooltipEl, prepararTooltipParent, clampHorizontal } from '../../composables/useTooltipExterno.js'
import { exportarElementoComoImagem, ICONE_EXPORTAR_SVG } from '../../composables/useExportarImagem.js'

const props = defineProps({
  legenda: { type: String, default: null },
  sublegenda: { type: String, default: null },
  titulo: { type: String, default: null },
  descricao: { type: String, default: null },
  tema: { type: String, default: 'light' },
  corFundo: { type: String, default: null },
  corDetalhes: { type: String, default: '#3B82F6' },
  corTexto: { type: String, default: null },
  textoBotao: { type: String, default: 'Ver mais' },
  direcao: {
    type: String,
    default: 'top',
    validator: (v) => ['top', 'bottom', 'left', 'right'].includes(v),
  },
  botaoVisivel: { type: Boolean, default: false },
  tipoValor: {
    type: String,
    default: 'numero',
    validator: (v) => ['numero', 'moeda', 'percentual'].includes(v),
  },
  locale: { type: String, default: 'pt-BR' },
  moeda: { type: String, default: 'BRL' },
  data: {
    type: Array,
    default: () => [
      { rotulo: 'Jan', quantidade: 22 },
      { rotulo: 'Fev', quantidade: 35 },
      { rotulo: 'Mar', quantidade: 28 },
      { rotulo: 'Abr', quantidade: 45 },
      { rotulo: 'Mai', quantidade: 30 },
      { rotulo: 'Jun', quantidade: 55 },
      { rotulo: 'Jul', quantidade: 42 },
      { rotulo: 'Ago', quantidade: 60 },
      { rotulo: 'Set', quantidade: 48 },
      { rotulo: 'Out', quantidade: 70 },
      { rotulo: 'Nov', quantidade: 58 },
      { rotulo: 'Dez', quantidade: 75 },
    ],
  },
  height: { type: [String, Number], default: 280 },
  borderRadius: { type: [String, Number], default: '1rem' },
  sombra: { type: String, default: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)' },
  corBorda: { type: String, default: '#EAE8E8' },
  exportar: { type: Boolean, default: false },
  nomeArquivoExport: { type: String, default: 'card-linhas.png' },
})

const emit = defineEmits(['botaoAcao', 'exportado'])

const { palette, cardStyle } = useTema(props)
const { formatar } = useFormatadorValor(props)
const cardRef = ref(null)
const iconeExportar = ICONE_EXPORTAR_SVG

async function onExportar() {
  await exportarElementoComoImagem(cardRef.value, {
    nomeArquivo: props.nomeArquivoExport,
    corFundo: palette.value.bg !== 'transparent' ? palette.value.bg : null,
  })
  emit('exportado')
}

const layoutClass = computed(() => `card-linhas--${props.direcao}`)


const chartData = computed(() => ({
  labels: props.data.map((d) => d.rotulo),
  datasets: [
    {
      data: props.data.map((d) => d.quantidade),
      borderColor: props.corDetalhes,
      borderWidth: 3,
      borderJoinStyle: 'round',
      borderCapStyle: 'round',
      backgroundColor: (ctx) => {
        const { chart } = ctx
        const { ctx: c, chartArea } = chart
        if (!chartArea) return 'transparent'
        const corTopo = props.corDetalhes || '#0400FF'
        const corBase = '#7C7C7C'
        const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0.16, toRgba(corTopo, 0.2))
        gradient.addColorStop(1, toRgba(corBase, 0))
        return gradient
      },
      fill: true,
      tension: 0.45,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBorderWidth: 3,
      pointHoverBackgroundColor: props.corDetalhes,
      pointHoverBorderColor: palette.value.bg === 'transparent' ? '#fff' : palette.value.bg,
      clip: false,
    },
  ],
}))

function externalTooltip(context) {
  const { chart, tooltip } = context
  const parent = prepararTooltipParent(chart)
  if (!parent) return
  const el = criarTooltipEl(parent)
  if (tooltip.opacity === 0) {
    el.style.opacity = '0'
    return
  }
  const titleLines = tooltip.title || []
  const bodyLines = (tooltip.body || []).flatMap((b) => b.lines)
  const content = el.querySelector('.nc-tt__content')
  const corPonto = props.corDetalhes || '#3B82F6'
  content.innerHTML =
    `<div style="font-size:9px;font-weight:500;color:#94A3B8;letter-spacing:.04em;text-transform:uppercase;line-height:1;margin-bottom:4px;">${titleLines.join(' ')}</div>` +
    `<div style="display:flex;align-items:center;gap:6px;">` +
      `<span style="width:6px;height:6px;border-radius:999px;background:${corPonto};box-shadow:0 0 0 2px ${toRgba(corPonto, 0.15)};flex:0 0 auto;"></span>` +
      `<span style="font-size:12px;font-weight:700;color:#0F172A;letter-spacing:-.01em;line-height:1.1;">${bodyLines.join(' ')}</span>` +
    `</div>`
  const { offsetLeft, offsetTop } = chart.canvas
  el.style.opacity = '1'
  el.style.visibility = 'hidden'
  el.style.left = '0px'
  el.style.top = '0px'
  const ttWidth = el.offsetWidth
  const ttHeight = el.offsetHeight
  const margin = 4
  const left = clampHorizontal(offsetLeft + tooltip.caretX, ttWidth, parent.clientWidth, margin)
  let top = offsetTop + tooltip.caretY
  const minTop = ttHeight + 16 + margin
  if (top < minTop) top = minTop
  el.style.left = left + 'px'
  el.style.top = top + 'px'
  el.style.visibility = 'visible'
}

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
  layout: {
    padding: { top: 12, right: 0, bottom: 0, left: 0 },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: false,
      external: externalTooltip,
      callbacks: {
        title: (items) => items[0]?.label ?? '',
        label: (ctx) => formatar(ctx.parsed.y),
      },
    },
  },
  scales: {
    x: {
      grid: { display: false, drawBorder: false },
      border: { display: false },
      ticks: { color: palette.value.muted, font: { size: 11, family: "'Inter', sans-serif" }, padding: 8 },
    },
    y: {
      display: false,
      grid: { display: false },
      beginAtZero: true,
    },
  },
}))

function onBotaoClick() {
  emit('botaoAcao')
}
</script>

<template>
  <div ref="cardRef" class="card-linhas p-4" :class="layoutClass" :style="cardStyle">
    <div class="card-linhas__header">
      <div class="card-linhas__topo">
        <div v-if="$slots.legenda || legenda || $slots.sublegenda || sublegenda" class="card-linhas__legendas">
          <div v-if="$slots.legenda || legenda" class="text-sm font-medium" :style="{ color: palette.text, opacity: 0.85 }">
            <slot name="legenda">{{ legenda }}</slot>
          </div>
          <div v-if="$slots.sublegenda || sublegenda" class="text-xs" :style="{ color: palette.muted }">
            <slot name="sublegenda">{{ sublegenda }}</slot>
          </div>
        </div>
        <div v-if="$slots.actions || botaoVisivel || exportar" class="card-linhas__actions">
          <slot name="actions">
            <button v-if="botaoVisivel" class="card-linhas__btn" :style="{ color: palette.text, borderColor: toRgba(palette.text, 0.18) }"
              @click="onBotaoClick">
              <span>{{ textoBotao }}</span>
            </button>
          </slot>
          <button v-if="exportar" type="button" class="card-linhas__exportar"
            :style="{ color: palette.muted, borderColor: toRgba(palette.text, 0.18) }"
            title="Exportar como imagem" aria-label="Exportar como imagem"
            @click="onExportar" v-html="iconeExportar"></button>
        </div>
      </div>
      <div v-if="$slots.titulo || titulo || $slots.descricao || descricao" class="card-linhas__titulos mt-3 mb-2">
        <div v-if="$slots.titulo || titulo" class="text-4xl font-semibold line-height-2" :style="{ color: palette.text }">
          <slot name="titulo">{{ titulo }}</slot>
        </div>
        <div v-if="$slots.descricao || descricao" class="text-sm mt-1" :style="{ color: palette.muted }">
          <slot name="descricao">{{ descricao }}</slot>
        </div>
      </div>
    </div>

    <div class="card-linhas__chart">
      <ChartBase type="line" :data="chartData" :options="chartOptions" :height="height" />
    </div>

    <div v-if="$slots.footer" class="card-linhas__footer mt-3">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.card-linhas {
  display: flex;
  gap: 1rem;
  transition: background 0.2s ease;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.card-linhas__header {
  display: flex;
  flex-direction: column;
}

.card-linhas__topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.card-linhas__legendas {
  min-width: 0;
  flex: 1 1 auto;
}

.card-linhas__actions {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.card-linhas__exportar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  background: transparent;
  border: 1px solid rgba(15, 23, 42, 0.18);
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s ease, background 0.2s ease;
  font-family: inherit;
}

.card-linhas__exportar:hover {
  opacity: 0.7;
}

.card-linhas__exportar :deep(svg) {
  display: block;
}

.card-linhas__chart {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
}

.card-linhas--top {
  flex-direction: column;
}

.card-linhas--bottom {
  flex-direction: column-reverse;
}

.card-linhas--top .card-linhas__chart,
.card-linhas--bottom .card-linhas__chart {
  margin-left: -1.25rem;
  margin-right: -1.25rem;
}

.card-linhas--top .card-linhas__chart {
  margin-bottom: -0.5rem;
}

.card-linhas--bottom .card-linhas__chart {
  margin-top: -0.5rem;
}

.card-linhas--left {
  flex-direction: row;
  align-items: stretch;
}

.card-linhas--left .card-linhas__header {
  flex: 0 0 35%;
  justify-content: center;
}

.card-linhas--right {
  flex-direction: row-reverse;
  align-items: stretch;
}

.card-linhas--right .card-linhas__header {
  flex: 0 0 35%;
  justify-content: center;
}

.card-linhas__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: 1px solid rgba(15, 23, 42, 0.18);
  border-radius: 10px;
  padding: 0.5rem 1.1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease, background 0.2s ease;
  align-self: flex-start;
  font-family: inherit;
}

.card-linhas__btn:hover {
  opacity: 0.75;
}

@media (max-width: 640px) {
  .card-linhas { gap: 0.75rem; }
  .card-linhas__topo { flex-wrap: wrap; }
  .card-linhas--left,
  .card-linhas--right {
    flex-direction: column;
    align-items: stretch;
  }
  .card-linhas--left .card-linhas__header,
  .card-linhas--right .card-linhas__header {
    flex: 0 0 auto;
  }
  .card-linhas--left .card-linhas__chart,
  .card-linhas--right .card-linhas__chart {
    margin-left: -1.25rem;
    margin-right: -1.25rem;
  }
  .card-linhas__titulos :deep(.text-4xl),
  .card-linhas__titulos .text-4xl {
    font-size: 1.75rem !important;
    line-height: 1.15 !important;
  }
  .card-linhas__btn {
    padding: 0.4rem 0.85rem;
    font-size: 0.82rem;
  }
}

@media (max-width: 380px) {
  .card-linhas__titulos .text-4xl {
    font-size: 1.4rem !important;
  }
}
</style>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
</style>
