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
  borderRadius: { type: [String, Number], default: '0.75rem' },
  sombra: { type: String, default: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)' },
  corBorda: { type: String, default: '#EAE8E8' },
  larguraBarra: { type: [String, Number], default: 0.92 },
  raioBarra: { type: Number, default: 6 },
  linhasReferencia: { type: [Object, Array], default: null },
  exportar: { type: Boolean, default: false },
  nomeArquivoExport: { type: String, default: 'card-barra.png' },
  corHover: { type: String, default: null },
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

const layoutClass = computed(() => `card-barra--${props.direcao}`)

const heightCss = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height
)

const isHorizontal = computed(() => props.orientacao === 'horizontal')

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

function aplicarCaret(caret, flip) {
  if (flip) {
    Object.assign(caret.style, {
      top: '-5px',
      bottom: 'auto',
      borderTop: '1px solid rgba(15,23,42,.06)',
      borderLeft: '1px solid rgba(15,23,42,.06)',
      borderRight: 'none',
      borderBottom: 'none',
    })
  } else {
    Object.assign(caret.style, {
      bottom: '-5px',
      top: 'auto',
      borderRight: '1px solid rgba(15,23,42,.06)',
      borderBottom: '1px solid rgba(15,23,42,.06)',
      borderTop: 'none',
      borderLeft: 'none',
    })
  }
}

let linhaHover = null

function externalTooltip(context) {
  const { chart, tooltip } = context
  const parent = prepararTooltipParent(chart)
  if (!parent) return
  const el = criarTooltipEl(parent, { caretFlexivel: true })
  if (tooltip.opacity === 0 || linhaHover) {
    el.style.opacity = '0'
    return
  }
  const titleLines = tooltip.title || []
  const dataPoints = tooltip.dataPoints || []
  const content = el.querySelector('.nc-tt__content')
  const linhas = dataPoints.map((dp) => {
    const cor = seriesNormalizadas.value[dp.datasetIndex]?.cor || props.corDetalhes
    const valor = formatar(isHorizontal.value ? dp.parsed.x : dp.parsed.y)
    const nome = dp.dataset.label && seriesNormalizadas.value.length > 1
      ? `<span style="font-size:11px;color:#64748B;margin-right:6px;">${dp.dataset.label}</span>`
      : ''
    return (
      `<div style="display:flex;align-items:center;gap:6px;margin-top:2px;">` +
      `<span style="width:6px;height:6px;border-radius:999px;background:${cor};box-shadow:0 0 0 2px ${toRgba(cor, 0.15)};flex:0 0 auto;"></span>` +
      nome +
      `<span style="font-size:12px;font-weight:700;color:#0F172A;letter-spacing:-.01em;line-height:1.1;margin-left:auto;">${valor}</span>` +
      `</div>`
    )
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
  content.innerHTML =
    `<div style="font-size:9px;font-weight:500;color:#94A3B8;letter-spacing:.04em;text-transform:uppercase;line-height:1;margin-bottom:4px;">${titleLines.join(' ')}</div>` +
    linhas +
    linhaPrevisto
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
  aplicarCaret(caret, flip)
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

function onBotaoClick() {
  emit('botaoAcao')
}

const linhasNormalizadas = computed(() => {
  if (!props.linhasReferencia) return []
  const arr = Array.isArray(props.linhasReferencia) ? props.linhasReferencia : [props.linhasReferencia]
  return arr
    .filter((l) => l && (typeof l === 'number' || typeof l.valor === 'number'))
    .map((l) => {
      if (typeof l === 'number') {
        return { valor: l, rotulo: null, cor: '#0F172A', corRotulo: '#0F172A', corTexto: '#FFFFFF', tracejado: [6, 6], espessura: 1 }
      }
      return {
        valor: l.valor,
        rotulo: l.rotulo ?? null,
        cor: l.cor || '#0F172A',
        corRotulo: l.corRotulo || l.cor || '#0F172A',
        corTexto: l.corTexto || '#FFFFFF',
        tracejado: l.tracejado || [6, 6],
        espessura: l.espessura ?? 1,
      }
    })
})

const linhasPosicoes = []

const pluginLinhaReferencia = {
  id: 'linhaReferencia',
  afterDatasetsDraw(chart) {
    const linhas = linhasNormalizadas.value
    linhasPosicoes.length = 0
    if (!linhas.length) return
    const { ctx, chartArea, scales } = chart
    const horizontal = isHorizontal.value
    const escalaValor = horizontal ? scales.x : scales.y
    if (!escalaValor) return
    linhas.forEach((linha) => {
      const pos = escalaValor.getPixelForValue(linha.valor)
      linhasPosicoes.push({ linha, pos, horizontal, chartArea })
      ctx.save()
      ctx.beginPath()
      ctx.setLineDash(linha.tracejado)
      ctx.lineWidth = linha.espessura
      ctx.strokeStyle = linha.cor
      if (horizontal) {
        if (pos < chartArea.left || pos > chartArea.right) { ctx.restore(); return }
        ctx.moveTo(pos, chartArea.top)
        ctx.lineTo(pos, chartArea.bottom)
      } else {
        if (pos < chartArea.top || pos > chartArea.bottom) { ctx.restore(); return }
        ctx.moveTo(chartArea.left, pos)
        ctx.lineTo(chartArea.right, pos)
      }
      ctx.stroke()
      ctx.setLineDash([])

      if (linha.rotulo) {
        ctx.font = "600 11px 'Inter', sans-serif"
        const padX = 8
        const padY = 5
        const metrics = ctx.measureText(linha.rotulo)
        const textW = metrics.width
        const textH = 12
        const boxW = textW + padX * 2
        const boxH = textH + padY * 2
        const raio = boxH / 2
        let bx, by
        if (horizontal) {
          bx = pos - boxW / 2
          by = chartArea.top - boxH - 6
          if (by < 0) by = chartArea.top + 6
        } else {
          bx = chartArea.left - boxW - 6
          by = pos - boxH / 2
          if (bx < 0) bx = chartArea.left + 6
        }
        ctx.fillStyle = linha.corRotulo
        ctx.beginPath()
        if (ctx.roundRect) {
          ctx.roundRect(bx, by, boxW, boxH, raio)
        } else {
          ctx.moveTo(bx + raio, by)
          ctx.lineTo(bx + boxW - raio, by)
          ctx.quadraticCurveTo(bx + boxW, by, bx + boxW, by + raio)
          ctx.lineTo(bx + boxW, by + boxH - raio)
          ctx.quadraticCurveTo(bx + boxW, by + boxH, bx + boxW - raio, by + boxH)
          ctx.lineTo(bx + raio, by + boxH)
          ctx.quadraticCurveTo(bx, by + boxH, bx, by + boxH - raio)
          ctx.lineTo(bx, by + raio)
          ctx.quadraticCurveTo(bx, by, bx + raio, by)
        }
        ctx.fill()
        ctx.fillStyle = linha.corTexto
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.fillText(linha.rotulo, bx + boxW / 2, by + boxH / 2)
      }
      ctx.restore()
    })
  },
  beforeEvent(chart, args) {
    if (!linhasPosicoes.length) {
      linhaHover = null
      return
    }
    const evt = args.event
    if (!evt || evt.type === 'mouseout' || evt.x == null || evt.y == null) {
      linhaHover = null
      return
    }
    const limiar = 8
    let proxima = null
    let menorDist = Infinity
    for (const p of linhasPosicoes) {
      const dist = p.horizontal ? Math.abs(evt.x - p.pos) : Math.abs(evt.y - p.pos)
      const dentroEixo = p.horizontal
        ? evt.y >= p.chartArea.top && evt.y <= p.chartArea.bottom
        : evt.x >= p.chartArea.left && evt.x <= p.chartArea.right
      if (dist <= limiar && dentroEixo && dist < menorDist) {
        menorDist = dist
        proxima = p
      }
    }
    linhaHover = proxima
  },
  afterEvent(chart, args) {
    if (!linhasPosicoes.length) return
    const evt = args.event
    if (!evt) return
    const parent = prepararTooltipParent(chart)
    if (!parent) return
    let el = parent.querySelector('.nc-tt-linhaRef')

    if (!linhaHover) {
      if (el) el.style.opacity = '0'
      return
    }
    const proxima = linhaHover

    if (!el) {
      el = document.createElement('div')
      el.className = 'nc-tt-linhaRef'
      Object.assign(el.style, {
        position: 'absolute',
        pointerEvents: 'none',
        transform: 'translate(-50%, calc(-100% - 12px))',
        transition: 'opacity .18s ease, left .12s ease, top .12s ease',
        opacity: '0',
        background: '#ffffff',
        borderRadius: '10px',
        padding: '8px 11px',
        boxShadow: '0 1px 2px rgba(15,23,42,.06), 0 8px 24px rgba(15,23,42,.12)',
        border: '1px solid rgba(15,23,42,.06)',
        whiteSpace: 'nowrap',
        zIndex: '11',
        fontFamily: "'Inter', sans-serif",
        textAlign: 'left',
      })
      parent.appendChild(el)
    }
    const cor = proxima.linha.cor || '#0F172A'
    const valorFormatado = formatar(proxima.linha.valor)
    const rotulo = proxima.linha.rotulo
    el.innerHTML =
      (rotulo
        ? `<div style="font-size:9px;font-weight:500;color:#94A3B8;letter-spacing:.04em;text-transform:uppercase;line-height:1;margin-bottom:4px;">${rotulo}</div>`
        : '') +
      `<div style="display:flex;align-items:center;gap:6px;">` +
      `<span style="width:6px;height:6px;border-radius:999px;background:${cor};box-shadow:0 0 0 2px ${toRgba(cor, 0.15)};flex:0 0 auto;"></span>` +
      `<span style="font-size:12px;font-weight:700;color:#0F172A;letter-spacing:-.01em;line-height:1.1;">${valorFormatado}</span>` +
      `</div>`

    const canvas = chart.canvas
    el.style.opacity = '1'
    el.style.visibility = 'hidden'
    el.style.left = '0px'
    el.style.top = '0px'
    const ttWidth = el.offsetWidth
    const ttHeight = el.offsetHeight
    const margin = 4
    let ancoraX, ancoraY
    if (proxima.horizontal) {
      ancoraX = canvas.offsetLeft + proxima.pos
      ancoraY = canvas.offsetTop + evt.y
    } else {
      ancoraX = canvas.offsetLeft + evt.x
      ancoraY = canvas.offsetTop + proxima.pos
    }
    const left = clampHorizontal(ancoraX, ttWidth, parent.clientWidth, margin)
    let top = ancoraY
    const minTop = ttHeight + 16 + margin
    if (top < minTop) top = minTop
    el.style.left = left + 'px'
    el.style.top = top + 'px'
    el.style.visibility = 'visible'
  },
}

const pluginsChart = computed(() => (linhasNormalizadas.value.length ? [pluginLinhaReferencia] : []))
</script>

<template>
  <div ref="cardRef" class="card-barra p-4 flex" :class="layoutClass" :style="cardStyle">
    <div class="card-barra__header flex flex-column">
      <div class="card-barra__topo flex align-items-start justify-content-between gap-3">
        <div v-if="$slots.legenda || legenda || $slots.sublegenda || sublegenda"
          class="nc-legendas-flex flex flex-column">
          <div v-if="$slots.legenda || legenda" class="text-xs font-medium"
            :style="{ color: palette.text, opacity: 0.85 }">
            <slot name="legenda">{{ legenda }}</slot>
          </div>
          <div v-if="$slots.sublegenda || sublegenda" class="text-xs" :style="{ color: palette.muted }">
            <slot name="sublegenda">{{ sublegenda }}</slot>
          </div>
        </div>
        <div v-if="$slots.actions || botaoVisivel || exportar"
          class="nc-actions inline-flex align-items-center gap-2">
          <slot name="actions">
            <button v-if="botaoVisivel" class="nc-btn inline-flex align-items-center"
              :style="{ color: palette.text, borderColor: toRgba(palette.text, 0.18) }" @click="onBotaoClick">
              <span>{{ textoBotao }}</span>
            </button>
          </slot>
          <button v-if="exportar" type="button"
            class="nc-exportar inline-flex align-items-center justify-content-center"
            :style="{ color: palette.muted, borderColor: toRgba(palette.text, 0.18) }" title="Exportar como imagem"
            aria-label="Exportar como imagem" @click="onExportar" v-html="iconeExportar"></button>
        </div>
      </div>
      <div v-if="$slots.titulo || titulo || $slots.descricao || descricao"
        class="card-barra__titulos mt-3 mb-2 flex flex-column">
        <div v-if="$slots.titulo || titulo" class="m-0 text-3xl font-semibold  "
          :style="{ color: palette.text, lineHeight: '33px', letterSpacing: '-1px' }">
          <slot name="titulo">{{ titulo }}</slot>
        </div>
        <div v-if="$slots.descricao || descricao" class="text-sm mt-1" :style="{ color: palette.muted }">
          <slot name="descricao">{{ descricao }}</slot>
        </div>
      </div>
    </div>

    <div class="card-barra__chart flex-1">
      <ChartBase type="bar" :data="chartData" :options="chartOptions" :plugins="pluginsChart" height="100%" />
    </div>

    <div v-if="$slots.footer" class="card-barra__footer mt-3">
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

.card-barra__topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.card-barra__chart {
  flex: 1 1 auto;
  min-width: 0;
  min-height: v-bind(heightCss);
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
