<script setup>
import { computed, ref } from 'vue'
import ChartBase from '../ChartBase/ChartBase.vue'
import { useTema, toRgba, gerarPaleta } from '../../composables/useTema.js'
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
  borderRadius: { type: [String, Number], default: '0.75rem' },
  sombra: { type: String, default: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)' },
  corDetalhes: { type: String, default: '#3B82F6' },
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
  cutout: { type: [String, Number], default: '70%' },
  exportar: { type: Boolean, default: false },
  nomeArquivoExport: { type: String, default: 'card-pizza.png' },
  itensClicaveis: { type: Boolean, default: false },
})

const emit = defineEmits(['botaoAcao', 'exportado', 'itemClicado'])

const { palette, cardStyle } = useTema(props)
const { formatar } = useFormatadorValor(props)
const cardRef = ref(null)

async function onExportar() {
  await exportarElementoComoImagem(cardRef.value, {
    nomeArquivo: props.nomeArquivoExport,
    corFundo: palette.value.bg !== 'transparent' ? palette.value.bg : null,
  })
  emit('exportado')
}

const layoutClass = computed(() => `card-pizza--${props.direcao}`)

const coresAplicadas = computed(() => {
  const paleta = gerarPaleta(props.corDetalhes, props.data.length)
  return props.data.map((d, i) => d.cor ?? paleta[i])
})

const chartData = computed(() => ({
  labels: props.data.map((d) => d.rotulo),
  datasets: [
    {
      data: props.data.map((d) => d.quantidade),
      backgroundColor: coresAplicadas.value,
      borderWidth: 0,
      borderColor: 'transparent',
      hoverOffset: 6,
      borderRadius: 0,
      spacing: 0,
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
  const valor = dp ? formatar(dp.parsed) : ''
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
  const targetX = offsetLeft + tooltip.caretX
  const targetY = offsetTop + tooltip.caretY
  const left = clampHorizontal(targetX, ttWidth, parent.clientWidth, margin)
  const flipBelow = targetY < ttHeight + 16 + margin
  el.style.transform = flipBelow ? 'translate(-50%, 16px)' : 'translate(-50%, calc(-100% - 16px))'
  const caret = el.querySelector('.nc-tt__caret')
  if (caret) {
    if (flipBelow) {
      caret.style.bottom = ''
      caret.style.top = '-5px'
      caret.style.borderRight = ''
      caret.style.borderBottom = ''
      caret.style.borderLeft = '1px solid rgba(15,23,42,.06)'
      caret.style.borderTop = '1px solid rgba(15,23,42,.06)'
    } else {
      caret.style.top = ''
      caret.style.bottom = '-5px'
      caret.style.borderLeft = ''
      caret.style.borderTop = ''
      caret.style.borderRight = '1px solid rgba(15,23,42,.06)'
      caret.style.borderBottom = '1px solid rgba(15,23,42,.06)'
    }
  }
  el.style.left = left + 'px'
  el.style.top = targetY + 'px'
  el.style.visibility = 'visible'
}

function emitirItem(index) {
  const item = props.data[index]
  if (!item) return
  emit('itemClicado', { item, index, cor: coresAplicadas.value[index] })
}

function onItemClick(item, index) {
  if (!props.itensClicaveis) return
  emit('itemClicado', { item, index, cor: coresAplicadas.value[index] })
}

const hoverIndex = ref(null)

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: props.cutout,
  layout: { padding: 4 },
  onHover: (event, elements, chart) => {
    const idx = elements.length ? elements[0].index : null
    hoverIndex.value = idx
    chart.canvas.style.cursor = props.itensClicaveis && elements.length ? 'pointer' : 'default'
  },
  onClick: (event, elements) => {
    if (!props.itensClicaveis || !elements.length) return
    emitirItem(elements[0].index)
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: false,
      external: externalTooltip,
      callbacks: {
        title: (items) => items[0]?.label ?? '',
        label: (ctx) => formatar(ctx.parsed),
      },
    },
  },
}))

function onBotaoClick() {
  emit('botaoAcao')
}

const iconeExportar = ICONE_EXPORTAR_SVG
</script>

<template>
  <div ref="cardRef" class="card-pizza p-4 flex flex-column" :class="layoutClass" :style="cardStyle">
    <div class="card-pizza__topo flex align-items-start justify-content-between gap-3">
      <div v-if="$slots.legenda || legenda || $slots.sublegenda || sublegenda" class="nc-legendas-flex flex flex-column">
        <div v-if="$slots.legenda || legenda" class="text-xs font-medium" :style="{ color: palette.text, opacity: 0.95 }">
          <slot name="legenda">{{ legenda }}</slot>
        </div>
        <div v-if="$slots.sublegenda || sublegenda" class="text-xs" :style="{ color: palette.muted }">
          <slot name="sublegenda">{{ sublegenda }}</slot>
        </div>
      </div>
      <div v-if="$slots.actions || botaoVisivel || exportar" class="nc-actions inline-flex align-items-center gap-2">
        <slot name="actions">
          <button v-if="botaoVisivel" class="nc-btn inline-flex align-items-center"
            :style="{ color: palette.text, borderColor: toRgba(palette.text, 0.18) }" @click="onBotaoClick">
            <span>{{ textoBotao }}</span>
          </button>
        </slot>
        <button v-if="exportar" type="button" class="nc-exportar inline-flex align-items-center justify-content-center"
          :style="{ color: palette.muted, borderColor: toRgba(palette.text, 0.18) }"
          title="Exportar como imagem" aria-label="Exportar como imagem"
          @click="onExportar" v-html="iconeExportar"></button>
      </div>
    </div>

    <div class="card-pizza__corpo flex align-items-center">
      <div class="nc-tabela flex flex-column">
        <div v-if="mostrarCabecalho" class="nc-tabela-cab flex align-items-center justify-content-between"
          :style="{ color: palette.muted, borderColor: toRgba(palette.muted, 0.25) }">
          <span>{{ rotuloCategoria }}</span>
          <span class="nc-tabela-valor">{{ rotuloQuantidade }}</span>
        </div>
        <div v-for="(item, i) in data" :key="i"
          class="nc-tabela-linha flex align-items-center justify-content-between"
          :class="{ 'nc-tabela-linha--clicavel': itensClicaveis, 'nc-tabela-linha--ativa': hoverIndex === i }"
          :style="{
            color: palette.text,
            cursor: itensClicaveis ? 'pointer' : 'default',
            '--nc-linha-bg': toRgba(coresAplicadas[i], 0.05),
            '--nc-linha-bg-forte': toRgba(coresAplicadas[i], 0.08),
          }"
          :role="itensClicaveis ? 'button' : null"
          :tabindex="itensClicaveis ? 0 : null"
          @mouseenter="hoverIndex = i"
          @mouseleave="hoverIndex = null"
          @focus="hoverIndex = i"
          @blur="hoverIndex = null"
          @click="onItemClick(item, i)"
          @keydown.enter.prevent="onItemClick(item, i)"
          @keydown.space.prevent="onItemClick(item, i)">
          <span class="nc-tabela-rotulo inline-flex align-items-center gap-2">
            <span class="nc-bolinha" :style="{ background: coresAplicadas[i] }"></span>
            <span>{{ item.rotulo }}</span>
          </span>
          <span class="nc-tabela-valor">{{ formatar(item.quantidade) }}</span>
        </div>
      </div>

      <div class="card-pizza__chart-wrap flex align-items-center justify-content-center">
        <div class="card-pizza__chart">
          <ChartBase type="doughnut" :data="chartData" :options="chartOptions" :height="height" />
          <div v-if="$slots.titulo || titulo || $slots.descricao || descricao" class="nc-centro flex flex-column align-items-center justify-content-center">
            <div v-if="$slots.titulo || titulo" class="nc-centro-titulo m-0 font-semibold" :style="{ color: palette.text }">
              <slot name="titulo">{{ titulo }}</slot>
            </div>
            <div v-if="$slots.descricao || descricao" class="nc-centro-desc" :style="{ color: palette.muted }">
              <slot name="descricao">{{ descricao }}</slot>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$slots.footer" class="card-pizza__footer mt-3">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.card-pizza {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: background 0.2s ease;
  overflow: hidden;
  font-family: 'Geist', sans-serif;
}

.card-pizza__topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.card-pizza__corpo {
  display: flex;
  gap: 3.5rem;
  align-items: center;
  flex: 1 1 auto;
  min-height: 0;
}

.card-pizza--right .card-pizza__corpo {
  flex-direction: row;
}

.card-pizza--left .card-pizza__corpo {
  flex-direction: row-reverse;
}

.card-pizza--bottom .card-pizza__corpo {
  flex-direction: column;
  align-items: stretch;
}

.card-pizza--top .card-pizza__corpo {
  flex-direction: column-reverse;
  align-items: stretch;
}

.card-pizza--top .card-pizza__chart,
.card-pizza--bottom .card-pizza__chart {
  max-width: 320px;
  margin: 0 auto;
}

/* tabela ocupa o espaço restante sem comprimir o gráfico (apenas layouts horizontais) */
.card-pizza--right .nc-tabela,
.card-pizza--left .nc-tabela {
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
}

.card-pizza--top .nc-tabela,
.card-pizza--bottom .nc-tabela {
  width: 100%;
}

/* gráfico: tamanho fixo em layouts horizontais */
.card-pizza--right .card-pizza__chart-wrap,
.card-pizza--left .card-pizza__chart-wrap {
  flex: 0 0 clamp(140px, 38%, 240px);
  width: clamp(140px, 38%, 240px);
}

.card-pizza__chart-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-pizza__chart {
  position: relative;
  width: 100%;
  min-width: 0;
}

.nc-tabela-linha {
  position: relative;
  border-radius: 8px;
  padding-inline: 0;
  transition: background 0.18s ease, padding-inline 0.18s ease;
}

.nc-tabela-linha--ativa {
  background: var(--nc-linha-bg, rgba(15, 23, 42, 0.03));
  padding-inline: 0.40rem;
}

.nc-tabela-linha--clicavel:hover,
.nc-tabela-linha--clicavel:focus-visible {
  background: var(--nc-linha-bg-forte, rgba(15, 23, 42, 0.04));
  padding-inline: 0.40rem;
  outline: none;
}

/* breakpoint baseado no tamanho do componente, não do viewport */
@container (max-width: 520px) {
  .card-pizza { gap: 0.75rem; }
  .card-pizza__topo { flex-wrap: wrap; }

  .card-pizza--left .card-pizza__corpo,
  .card-pizza--right .card-pizza__corpo {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 1rem;
  }

  .card-pizza--left .nc-tabela,
  .card-pizza--right .nc-tabela {
    flex: 1 1 auto;
    width: 100%;
  }

  .card-pizza--left .card-pizza__chart-wrap,
  .card-pizza--right .card-pizza__chart-wrap {
    flex: 0 0 auto;
    width: 100%;
  }

  .card-pizza__chart {
    max-width: 260px;
    margin: 0 auto;
  }

  .nc-centro-titulo { font-size: 1.05rem; }
  .nc-centro-desc { font-size: 0.58rem; }
  .nc-tabela-linha { font-size: 0.78rem; }
}

@container (max-width: 340px) {
  .card-pizza__chart { max-width: 200px; }
  .nc-centro-titulo { font-size: 0.9rem; }
  .nc-tabela-linha { font-size: 0.72rem; }
  .nc-tabela-cab { font-size: 0.68rem; }
}
</style>

<style>
@import '../../styles/shared.css';
</style>
