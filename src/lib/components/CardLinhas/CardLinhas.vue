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
  borderRadius: { type: [String, Number], default: '0.75rem' },
  sombra: { type: String, default: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)' },
  corBorda: { type: String, default: '#EAE8E8' },
  linhasReferencia: { type: [Object, Array], default: null },
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
let linhaHover = null

const pluginLinhaReferencia = {
  id: 'linhaReferencia',
  afterDatasetsDraw(chart) {
    const linhas = linhasNormalizadas.value
    linhasPosicoes.length = 0
    if (!linhas.length) return
    const { ctx, chartArea, scales } = chart
    const escalaValor = scales.y
    if (!escalaValor) return
    linhas.forEach((linha) => {
      const pos = escalaValor.getPixelForValue(linha.valor)
      linhasPosicoes.push({ linha, pos, chartArea })
      ctx.save()
      ctx.beginPath()
      ctx.setLineDash(linha.tracejado)
      ctx.lineWidth = linha.espessura
      ctx.strokeStyle = linha.cor
      if (pos < chartArea.top || pos > chartArea.bottom) { ctx.restore(); return }
      ctx.moveTo(chartArea.left, pos)
      ctx.lineTo(chartArea.right, pos)
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
        let bx = chartArea.left - boxW - 6
        let by = pos - boxH / 2
        if (bx < 0) bx = chartArea.left + 6
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
    if (!linhasPosicoes.length) { linhaHover = null; return }
    const evt = args.event
    if (!evt || evt.type === 'mouseout' || evt.x == null || evt.y == null) { linhaHover = null; return }
    const limiar = 8
    let proxima = null
    let menorDist = Infinity
    for (const p of linhasPosicoes) {
      const dist = Math.abs(evt.y - p.pos)
      const dentroEixo = evt.x >= p.chartArea.left && evt.x <= p.chartArea.right
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
    const ancoraX = canvas.offsetLeft + evt.x
    const ancoraY = canvas.offsetTop + proxima.pos
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
  if (tooltip.opacity === 0 || linhaHover) {
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
  const targetX = offsetLeft + tooltip.caretX
  const targetY = offsetTop + tooltip.caretY
  const left = clampHorizontal(targetX, ttWidth, parent.clientWidth, margin)
  const minTop = ttHeight + 16 + margin
  const flipBelow = targetY < minTop
  let top
  if (flipBelow) {
    el.style.transform = 'translateX(-50%) translateY(16px)'
    top = targetY
  } else {
    el.style.transform = 'translate(-50%, calc(-100% - 16px))'
    top = targetY
  }
  el.style.left = left + 'px'
  el.style.top = top + 'px'
  const caret = el.querySelector('.nc-tt__caret')
  if (caret) {
    const offset = targetX - left
    const half = ttWidth / 2
    const clampedOffset = Math.max(-half + 8, Math.min(half - 8, offset))
    caret.style.left = `calc(50% + ${clampedOffset}px)`
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
  el.style.visibility = 'visible'
}

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
  layout: {
    padding: { top: linhasNormalizadas.value.length ? 24 : 0, right: 0, bottom: 0, left: 0 },
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
      display: true,
      afterFit: (scale) => {
        scale.paddingLeft = 0
        scale.paddingRight = 0
      },
      grid: { display: false, drawBorder: false },
      border: { display: false },
      ticks: {
        color: palette.value.muted,
        font: { size: 10, family: "'Inter', sans-serif" },
        padding: 8,
        align: 'inner',
      },
    },
    y: {
      display: false,
      grid: { display: false },
      beginAtZero: true,
      suggestedMax: linhasNormalizadas.value.length
        ? Math.max(...linhasNormalizadas.value.map((l) => l.valor))
        : undefined,
    },
  },
}))

function onBotaoClick() {
  emit('botaoAcao')
}
</script>

<template>
  <div ref="cardRef" class="card-linhas p-4 flex" :class="layoutClass" :style="cardStyle">
    <div class="card-linhas__header flex flex-column">
      <div class="card-linhas__topo flex align-items-start justify-content-between gap-3">
        <div v-if="$slots.legenda || legenda || $slots.sublegenda || sublegenda" class="nc-legendas-flex flex flex-column">
          <div v-if="$slots.legenda || legenda" class="text-xs font-medium" :style="{ color: palette.text, opacity: 0.85 }">
            <slot name="legenda">{{ legenda }}</slot>
          </div>
          <div v-if="$slots.sublegenda || sublegenda" class="text-xs" :style="{ color: palette.muted }">
            <slot name="sublegenda">{{ sublegenda }}</slot>
          </div>
        </div>
        <div v-if="$slots.actions || botaoVisivel || exportar" class="nc-actions inline-flex align-items-center gap-2">
          <slot name="actions">
            <button v-if="botaoVisivel" class="nc-btn inline-flex align-items-center" :style="{ color: palette.text, borderColor: toRgba(palette.text, 0.18) }"
              @click="onBotaoClick">
              <span>{{ textoBotao }}</span>
            </button>
          </slot>
          <button v-if="exportar" type="button" class="nc-exportar inline-flex align-items-center justify-content-center"
            :style="{ color: palette.muted, borderColor: toRgba(palette.text, 0.18) }"
            title="Exportar como imagem" aria-label="Exportar como imagem"
            @click="onExportar" v-html="iconeExportar"></button>
        </div>
      </div>
      <div v-if="$slots.titulo || titulo || $slots.descricao || descricao" class="card-linhas__titulos mt-3 mb-2 flex flex-column">
        <div v-if="$slots.titulo || titulo" class="m-0 text-3xl font-semibold  " :style="{ color: palette.text, lineHeight: '33px', letterSpacing: '-1px' }">
          <slot name="titulo">{{ titulo }}</slot>
        </div>
        <div v-if="$slots.descricao || descricao" class="text-sm mt-1" :style="{ color: palette.muted }">
          <slot name="descricao">{{ descricao }}</slot>
        </div>
      </div>
    </div>

    <div class="card-linhas__chart flex-1">
      <ChartBase type="line" :data="chartData" :options="chartOptions" :plugins="pluginsChart" :height="height" />
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
  padding: 1rem;
}

.card-linhas__topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.card-linhas__chart {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
}

.card-linhas--top {
  flex-direction: column;
  padding: 0 !important;
}

.card-linhas--bottom {
  flex-direction: column-reverse;
  padding: 0 !important;
}

.card-linhas--top .card-linhas__chart,
.card-linhas--bottom .card-linhas__chart {
  margin-left: 0;
  margin-right: 0;
}

.card-linhas--top .card-linhas__chart {
  margin-bottom: 0;
}

.card-linhas--bottom .card-linhas__chart {
  margin-top: 0;
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
    margin-left: 0;
    margin-right: 0;
  }
}
</style>

<style>
@import '../../styles/shared.css';
</style>
