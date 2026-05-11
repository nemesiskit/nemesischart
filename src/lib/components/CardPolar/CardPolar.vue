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
  corTexto: { type: String, default: null },
  corBorda: { type: String, default: '#EAE8E8' },
  borderRadius: { type: [String, Number], default: '1rem' },
  sombra: { type: String, default: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)' },
  cores: {
    type: Array,
    default: () => ['#0A1A6B', '#1535B5', '#1A5FD4', '#2F8DDF', '#5BB1E8', '#93D0F0', '#CDEAF6'],
  },
  textoBotao: { type: String, default: 'Ver mais' },
  botaoVisivel: { type: Boolean, default: false },
  direcao: {
    type: String,
    default: 'right',
    validator: (v) => ['left', 'right', 'top', 'bottom'].includes(v),
  },
  rotuloCategoria: { type: String, default: 'Categoria' },
  rotuloQuantidade: { type: String, default: 'Quantidade' },
  mostrarCabecalho: { type: Boolean, default: true },
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
      { rotulo: 'Vendas', quantidade: 4200 },
      { rotulo: 'Serviços', quantidade: 3100 },
      { rotulo: 'Assinaturas', quantidade: 2450 },
      { rotulo: 'Licenças', quantidade: 1800 },
      { rotulo: 'Suporte', quantidade: 1250 },
      { rotulo: 'Treinamentos', quantidade: 820 },
      { rotulo: 'Outros', quantidade: 410 },
    ],
  },
  height: { type: [String, Number], default: 260 },
  mostrarLinhasGrade: { type: Boolean, default: true },
  exportar: { type: Boolean, default: false },
  nomeArquivoExport: { type: String, default: 'card-polar.png' },
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

const layoutClass = computed(() => `card-polar--${props.direcao}`)

const coresAplicadas = computed(() =>
  props.data.map((_, i) => props.cores[i % props.cores.length])
)

const chartData = computed(() => ({
  labels: props.data.map((d) => d.rotulo),
  datasets: [
    {
      data: props.data.map((d) => d.quantidade),
      backgroundColor: coresAplicadas.value,
      borderColor: coresAplicadas.value,
      borderWidth: 0,
      hoverOffset: 6,
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
  const dp = tooltip.dataPoints && tooltip.dataPoints[0]
  const cor = dp ? coresAplicadas.value[dp.dataIndex] : '#3B82F6'
  const valor = dp ? formatar(dp.parsed.r ?? dp.parsed) : ''
  const content = el.querySelector('.nc-tt__content')
  content.innerHTML =
    `<div style="font-size:9px;font-weight:500;color:#94A3B8;letter-spacing:.04em;text-transform:uppercase;line-height:1;margin-bottom:4px;">${titleLines.join(' ')}</div>` +
    `<div style="display:flex;align-items:center;gap:6px;">` +
      `<span style="width:6px;height:6px;border-radius:999px;background:${cor};box-shadow:0 0 0 2px ${toRgba(cor, 0.15)};flex:0 0 auto;"></span>` +
      `<span style="font-size:12px;font-weight:700;color:#0F172A;letter-spacing:-.01em;line-height:1.1;">${valor}</span>` +
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
  layout: { padding: 4 },
  scales: {
    r: {
      beginAtZero: true,
      ticks: { display: false, backdropColor: 'transparent' },
      grid: {
        display: props.mostrarLinhasGrade,
        color: toRgba(palette.value.muted, 0.18),
      },
      angleLines: {
        display: props.mostrarLinhasGrade,
        color: toRgba(palette.value.muted, 0.18),
      },
      pointLabels: { display: false },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: false,
      external: externalTooltip,
      callbacks: {
        title: (items) => items[0]?.label ?? '',
        label: (ctx) => formatar(ctx.parsed?.r ?? ctx.parsed),
      },
    },
  },
}))

function onBotaoClick() {
  emit('botaoAcao')
}
</script>

<template>
  <div ref="cardRef" class="card-polar p-4" :class="layoutClass" :style="cardStyle">
    <div class="card-polar__topo">
      <div v-if="$slots.legenda || legenda || $slots.sublegenda || sublegenda" class="card-polar__legendas">
        <div v-if="$slots.legenda || legenda" class="text-sm font-medium" :style="{ color: palette.text, opacity: 0.95 }">
          <slot name="legenda">{{ legenda }}</slot>
        </div>
        <div v-if="$slots.sublegenda || sublegenda" class="text-xs" :style="{ color: palette.muted }">
          <slot name="sublegenda">{{ sublegenda }}</slot>
        </div>
      </div>
      <div v-if="$slots.actions || botaoVisivel || exportar" class="card-polar__actions">
        <slot name="actions">
          <button v-if="botaoVisivel" class="card-polar__btn"
            :style="{ color: palette.text, borderColor: toRgba(palette.text, 0.18) }" @click="onBotaoClick">
            <span>{{ textoBotao }}</span>
          </button>
        </slot>
        <button v-if="exportar" type="button" class="card-polar__exportar"
          :style="{ color: palette.muted, borderColor: toRgba(palette.text, 0.18) }"
          title="Exportar como imagem" aria-label="Exportar como imagem"
          @click="onExportar" v-html="iconeExportar"></button>
      </div>
    </div>

    <div class="card-polar__corpo">
      <div class="card-polar__tabela">
        <div v-if="mostrarCabecalho" class="card-polar__tabela-cab"
          :style="{ color: palette.muted, borderColor: toRgba(palette.muted, 0.25) }">
          <span>{{ rotuloCategoria }}</span>
          <span class="card-polar__tabela-valor">{{ rotuloQuantidade }}</span>
        </div>
        <div v-for="(item, i) in data" :key="i" class="card-polar__tabela-linha"
          :style="{ color: palette.text }">
          <span class="card-polar__tabela-rotulo">
            <span class="card-polar__bolinha" :style="{ background: coresAplicadas[i] }"></span>
            <span>{{ item.rotulo }}</span>
          </span>
          <span class="card-polar__tabela-valor">{{ formatar(item.quantidade) }}</span>
        </div>
      </div>

      <div class="card-polar__chart-wrap">
        <div class="card-polar__chart">
          <ChartBase type="polarArea" :data="chartData" :options="chartOptions" :height="height" />
          <div v-if="$slots.titulo || titulo || $slots.descricao || descricao" class="card-polar__centro-bottom">
            <div v-if="$slots.titulo || titulo" class="card-polar__centro-titulo" :style="{ color: palette.text }">
              <slot name="titulo">{{ titulo }}</slot>
            </div>
            <div v-if="$slots.descricao || descricao" class="card-polar__centro-desc" :style="{ color: palette.muted }">
              <slot name="descricao">{{ descricao }}</slot>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$slots.footer" class="card-polar__footer mt-3">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.card-polar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: background 0.2s ease;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.card-polar__topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.card-polar__corpo {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex: 1 1 auto;
  min-height: 0;
}

.card-polar--right .card-polar__corpo {
  flex-direction: row;
}

.card-polar--left .card-polar__corpo {
  flex-direction: row-reverse;
}

.card-polar--bottom .card-polar__corpo {
  flex-direction: column;
  align-items: stretch;
}

.card-polar--top .card-polar__corpo {
  flex-direction: column-reverse;
  align-items: stretch;
}

.card-polar--top .card-polar__chart,
.card-polar--bottom .card-polar__chart {
  max-width: 320px;
  margin: 0 auto;
}

.card-polar__legendas {
  min-width: 0;
  flex: 1 1 auto;
}

.card-polar__actions {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.card-polar__exportar {
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

.card-polar__exportar:hover {
  opacity: 0.7;
}

.card-polar__exportar :deep(svg) {
  display: block;
}

.card-polar__tabela {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
}

.card-polar__tabela-cab {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.72rem;
  font-weight: 500;
  padding: 0 0 0.5rem 0;
  border-bottom: 1px solid;
}

.card-polar__tabela-linha {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0;
  font-size: 0.8rem;
}

.card-polar__tabela-rotulo {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
}

.card-polar__tabela-valor {
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

.card-polar__bolinha {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex: 0 0 auto;
  display: inline-block;
}

.card-polar__chart-wrap {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-polar__chart {
  position: relative;
  width: 100%;
  min-width: 220px;
}

.card-polar__centro-bottom {
  text-align: center;
  margin-top: 0.5rem;
}

.card-polar__centro-titulo {
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.2;
}

.card-polar__centro-desc {
  font-size: 0.85rem;
  margin-top: 0.15rem;
}

.card-polar__btn {
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

.card-polar__btn:hover {
  opacity: 0.75;
}

@media (max-width: 640px) {
  .card-polar { gap: 0.75rem; }
  .card-polar__topo { flex-wrap: wrap; }
  .card-polar--left .card-polar__corpo,
  .card-polar--right .card-polar__corpo {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .card-polar__chart-wrap { width: 100%; }
  .card-polar__chart {
    max-width: 280px;
    min-width: 0;
    margin: 0 auto;
  }
  .card-polar__centro-titulo { font-size: 1rem; }
  .card-polar__centro-desc { font-size: 0.78rem; }
  .card-polar__tabela-linha { font-size: 0.78rem; }
  .card-polar__btn {
    padding: 0.4rem 0.85rem;
    font-size: 0.82rem;
  }
}

@media (max-width: 380px) {
  .card-polar__chart { max-width: 220px; }
  .card-polar__centro-titulo { font-size: 0.9rem; }
}
</style>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
</style>
