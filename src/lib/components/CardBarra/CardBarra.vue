<script setup>
import { computed } from 'vue'
import ChartBase from '../ChartBase/ChartBase.vue'
import CardCabecalho from '../internos/CardCabecalho.vue'
import CardTitulos from '../internos/CardTitulos.vue'
import { useTema, toRgba } from '../../composables/useTema.js'
import { useFormatadorValor } from '../../composables/useFormatadorValor.js'
import {
  criarTooltipEl,
  prepararTooltipParent,
  clampHorizontal,
  ttTitulo,
  ttLinhaValor,
  ttLinhaTexto,
  aplicarCaretFlip,
} from '../../composables/useTooltipExterno.js'
import { useLinhasReferencia } from '../../composables/useLinhasReferencia.js'
import { useExportarCard } from '../../composables/useExportarImagem.js'
import { propsCartao, propsValor, propsDirecao } from '../../props.js'

const props = defineProps({
  ...propsCartao({ nomeArquivoExport: 'card-barra.png' }),
  ...propsValor(),
  ...propsDirecao('top'),
  corDetalhes: { type: String, default: '#3B82F6' },
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
  series: { type: Array, default: null },
  cores: {
    type: Array,
    default: () => ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'],
  },
  orientacao: {
    type: String,
    default: 'vertical',
    validator: (v) => ['vertical', 'horizontal'].includes(v),
  },
  empilhado: { type: Boolean, default: false },
  mostrarLegendaSeries: { type: Boolean, default: true },
  height: { type: [String, Number], default: 280 },
  larguraBarra: { type: [String, Number], default: 0.92 },
  raioBarra: { type: Number, default: 6 },
  linhasReferencia: { type: [Object, Array], default: null },
  corHover: { type: String, default: null },
  // Recebe o item original (da 1ª série em `data`/`series`) e o índice, e
  // retorna texto(s) extra(s) exibidos no tooltip abaixo dos valores. Pode
  // devolver uma string ou um array de strings.
  detalheTooltip: { type: Function, default: null },
})

const emit = defineEmits(['botaoAcao', 'exportado'])

const { palette, cardStyle } = useTema(props)
const { formatar } = useFormatadorValor(props)
const { cardRef, onExportar, iconeExportar } = useExportarCard(props, palette, emit)

const layoutClass = computed(() => `card-barra--${props.direcao}`)

const heightCss = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height
)

const isHorizontal = computed(() => props.orientacao === 'horizontal')

const { linhasNormalizadas, pluginLinhaReferencia, temLinhaHover } = useLinhasReferencia({
  linhasReferencia: () => props.linhasReferencia,
  horizontal: () => isHorizontal.value,
  formatar,
})

const pluginsChart = [pluginLinhaReferencia]

const seriesNormalizadas = computed(() => {
  if (Array.isArray(props.series) && props.series.length > 0) {
    return props.series.map((s, i) => ({
      nome: s.nome ?? `Série ${i + 1}`,
      cor: s.cor || props.cores[i % props.cores.length],
      dados: Array.isArray(s.dados) ? s.dados : [],
    }))
  }
  return [{ nome: props.legenda || 'Valores', cor: props.corDetalhes, dados: props.data }]
})

const rotulos = computed(() => {
  const primeira = seriesNormalizadas.value[0]
  return primeira ? primeira.dados.map((d) => d.rotulo) : []
})

const chartData = computed(() => {
  const series = seriesNormalizadas.value
  const ultimaIdx = series.length - 1
  const largura = typeof props.larguraBarra === 'number' ? props.larguraBarra : Number(props.larguraBarra) || 0.6
  const r = props.raioBarra
  const horizontal = isHorizontal.value
  // barras empilhadas: só o primeiro e o último segmento têm cantos arredondados
  function raioSegmento(i) {
    if (!props.empilhado || series.length === 1) return r
    const ehPrimeiro = i === 0
    const ehUltimo = i === ultimaIdx
    if (horizontal) {
      return {
        topLeft: ehPrimeiro ? r : 0,
        bottomLeft: ehPrimeiro ? r : 0,
        topRight: ehUltimo ? r : 0,
        bottomRight: ehUltimo ? r : 0,
      }
    }
    return {
      bottomLeft: ehPrimeiro ? r : 0,
      bottomRight: ehPrimeiro ? r : 0,
      topLeft: ehUltimo ? r : 0,
      topRight: ehUltimo ? r : 0,
    }
  }
  return {
    labels: rotulos.value,
    datasets: series.map((s, i) => ({
      label: s.nome,
      data: s.dados.map((d) => d.quantidade),
      previstos: s.dados.map((d) => (d.previsto != null ? d.previsto : null)),
      backgroundColor: toRgba(s.cor, 0.72),
      hoverBackgroundColor: props.corHover || s.cor,
      borderWidth: 0,
      borderRadius: raioSegmento(i),
      borderSkipped: false,
      categoryPercentage: 1.0,
      barPercentage: largura,
    })),
  }
})

function externalTooltip(context) {
  const { chart, tooltip } = context
  const parent = prepararTooltipParent(chart)
  if (!parent) return
  const el = criarTooltipEl(parent, { caretFlexivel: true })
  if (tooltip.opacity === 0 || temLinhaHover()) {
    el.style.opacity = '0'
    return
  }
  const dataPoints = tooltip.dataPoints || []
  const multiSerie = seriesNormalizadas.value.length > 1
  const linhas = dataPoints.map((dp) => {
    const cor = seriesNormalizadas.value[dp.datasetIndex]?.cor || props.corDetalhes
    const valor = formatar(isHorizontal.value ? dp.parsed.x : dp.parsed.y)
    return ttLinhaValor(cor, valor, {
      nome: multiSerie ? dp.dataset.label : '',
      alinharDireita: true,
      margemTopo: true,
    })
  }).join('')

  const idxPrevisto = dataPoints[0]?.dataIndex
  let previsto = null
  if (idxPrevisto != null) {
    for (const ds of chart.data.datasets) {
      const v = ds.previstos?.[idxPrevisto]
      if (v != null) { previsto = v; break }
    }
  }
  const linhaPrevisto = previsto != null
    ? `<div style="display:flex;align-items:center;gap:6px;margin-top:6px;padding-top:4px;border-top:1px dashed rgba(15,23,42,.08);">` +
        `<span style="font-size:11px;color:#64748B;margin-right:6px;">Previsto</span>` +
        `<span style="font-size:12px;font-weight:700;color:#0F172A;letter-spacing:-.01em;line-height:1.1;margin-left:auto;">${formatar(previsto)}</span>` +
      `</div>`
    : ''

  let linhasExtras = ''
  if (props.detalheTooltip && idxPrevisto != null) {
    const item = seriesNormalizadas.value[0]?.dados[idxPrevisto]
    const extras = props.detalheTooltip(item, idxPrevisto)
    linhasExtras = (Array.isArray(extras) ? extras : [extras]).filter(Boolean).map((t) => ttLinhaTexto(t)).join('')
  }

  const content = el.querySelector('.nc-tt__content')
  content.innerHTML = ttTitulo((tooltip.title || []).join(' ')) + linhas + linhaPrevisto + linhasExtras

  const { offsetLeft, offsetTop } = chart.canvas
  el.style.opacity = '1'
  el.style.visibility = 'hidden'
  el.style.left = '0px'
  el.style.top = '0px'
  const ttWidth = el.offsetWidth
  const ttHeight = el.offsetHeight
  const margin = 4
  const ancoraX = offsetLeft + tooltip.caretX
  const ancoraY = offsetTop + tooltip.caretY
  const left = clampHorizontal(ancoraX, ttWidth, parent.clientWidth, margin)
  const halfW = ttWidth / 2
  const gap = 14
  const topAcima = ancoraY - gap - ttHeight
  const flip = topAcima < margin
  const top = flip ? ancoraY + gap : topAcima
  const caret = el.querySelector('.nc-tt__caret')
  aplicarCaretFlip(caret, flip)
  const caretXRelativo = ancoraX - (left - halfW)
  const caretClamp = Math.max(10, Math.min(ttWidth - 10, caretXRelativo))
  caret.style.left = caretClamp + 'px'
  el.style.left = left + 'px'
  el.style.top = top + 'px'
  el.style.visibility = 'visible'
}

const chartOptions = computed(() => {
  const horizontal = isHorizontal.value
  const eixoCategoria = {
    grid: { display: false, drawBorder: false },
    border: { display: false },
    ticks: { color: palette.value.muted, font: { size: 10, family: "'Inter', sans-serif" }, padding: 8 },
    stacked: props.empilhado,
  }
  const eixoValor = {
    display: false,
    grid: { display: false },
    beginAtZero: true,
    stacked: props.empilhado,
    suggestedMax: linhasNormalizadas.value.length
      ? Math.max(...linhasNormalizadas.value.map((l) => l.valor))
      : undefined,
  }
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    interaction: { intersect: false, mode: 'index', axis: horizontal ? 'y' : 'x' },
    layout: {
      padding: {
        top: linhasNormalizadas.value.length && !horizontal ? 24 : 12,
        right: horizontal ? 12 : 0,
        bottom: 0,
        left: linhasNormalizadas.value.length && horizontal ? 60 : 0,
      },
    },
    plugins: {
      legend: {
        display: props.mostrarLegendaSeries && seriesNormalizadas.value.length > 1,
        position: 'bottom',
        align: 'start',
        labels: {
          color: palette.value.muted,
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 10, family: "'Inter', sans-serif" },
          padding: 12,
        },
      },
      tooltip: {
        enabled: false,
        external: externalTooltip,
        callbacks: {
          title: (items) => items[0]?.label ?? '',
          label: (ctx) => formatar(horizontal ? ctx.parsed.x : ctx.parsed.y),
        },
      },
    },
    scales: {
      x: horizontal ? eixoValor : eixoCategoria,
      y: horizontal ? eixoCategoria : eixoValor,
    },
  }
})
</script>

<template>
  <div ref="cardRef" class="card-barra nc-p-4 nc-flex" :class="layoutClass" :style="cardStyle">
    <div class="card-barra__header nc-flex nc-flex-column">
      <CardCabecalho class="card-barra__topo" :legenda="legenda" :sublegenda="sublegenda" :palette="palette"
        :texto-botao="textoBotao" :botao-visivel="botaoVisivel" :exportar="exportar" opacidade-legenda="0.85"
        @botao-acao="emit('botaoAcao')" @exportar="onExportar">
        <template v-if="$slots.legenda" #legenda><slot name="legenda" /></template>
        <template v-if="$slots.sublegenda" #sublegenda><slot name="sublegenda" /></template>
        <template v-if="$slots.actions" #actions><slot name="actions" /></template>
      </CardCabecalho>
      <CardTitulos v-if="$slots.titulo || titulo || $slots.descricao || descricao"
        class="card-barra__titulos nc-mt-3 nc-mb-2" :titulo="titulo" :descricao="descricao" :palette="palette">
        <template v-if="$slots.titulo" #titulo><slot name="titulo" /></template>
        <template v-if="$slots.descricao" #descricao><slot name="descricao" /></template>
      </CardTitulos>
    </div>

    <div class="card-barra__chart nc-flex-1">
      <ChartBase type="bar" :data="chartData" :options="chartOptions" :plugins="pluginsChart" height="100%" />
    </div>

    <div v-if="$slots.footer" class="card-barra__footer nc-mt-3">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.card-barra {
  display: flex;
  gap: 1rem;
  transition: background 0.2s ease;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.card-barra__header {
  display: flex;
  flex-direction: column;
}

.card-barra__chart {
  flex: 1 1 auto;
  min-width: 0;
  min-height: v-bind(heightCss);
  /* flex garante que o wrapper do gráfico estique até o min-height/altura do
     card — height:100% sozinho não resolve contra pai que só tem min-height */
  display: flex;
  flex-direction: column;
}

.card-barra__chart :deep(.nc-chart-wrapper) {
  flex: 1 1 auto;
  min-height: 0;
}

.card-barra--top {
  flex-direction: column;
  align-items: stretch;
}

.card-barra--bottom {
  flex-direction: column-reverse;
  align-items: stretch;
}

.card-barra--top .card-barra__chart,
.card-barra--bottom .card-barra__chart {
  margin-left: -0.5rem;
  margin-right: -0.5rem;
}

.card-barra--top .card-barra__chart {
  margin-bottom: -0.5rem;
}

.card-barra--bottom .card-barra__chart {
  margin-top: -0.5rem;
}

.card-barra--left {
  flex-direction: row;
  align-items: stretch;
}

.card-barra--left .card-barra__header {
  flex: 0 0 35%;
  justify-content: center;
}

.card-barra--right {
  flex-direction: row-reverse;
  align-items: stretch;
}

.card-barra--right .card-barra__header {
  flex: 0 0 35%;
  justify-content: center;
}
</style>

<style>
@import '../../styles/shared.css';
</style>
