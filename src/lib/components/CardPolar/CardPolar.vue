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
  <div ref="cardRef" class="card-polar p-4 flex flex-column" :class="layoutClass" :style="cardStyle">
    <div class="card-polar__topo flex align-items-start justify-content-between gap-3">
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

    <div class="card-polar__corpo flex align-items-center">
      <div class="nc-tabela flex flex-column">
        <div v-if="mostrarCabecalho" class="nc-tabela-cab flex align-items-center justify-content-between"
          :style="{ color: palette.muted, borderColor: toRgba(palette.muted, 0.25) }">
          <span>{{ rotuloCategoria }}</span>
          <span class="nc-tabela-valor">{{ rotuloQuantidade }}</span>
        </div>
        <div v-for="(item, i) in data" :key="i" class="nc-tabela-linha flex align-items-center justify-content-between"
          :style="{ color: palette.text }">
          <span class="nc-tabela-rotulo inline-flex align-items-center gap-2">
            <span class="nc-bolinha" :style="{ background: coresAplicadas[i] }"></span>
            <span>{{ item.rotulo }}</span>
          </span>
          <span class="nc-tabela-valor">{{ formatar(item.quantidade) }}</span>
        </div>
      </div>

      <div class="card-polar__chart-wrap flex align-items-center justify-content-center">
        <div class="card-polar__chart">
          <ChartBase type="polarArea" :data="chartData" :options="chartOptions" :height="height" />
          <div v-if="$slots.titulo || titulo || $slots.descricao || descricao" class="card-polar__centro-bottom">
            <div v-if="$slots.titulo || titulo" class="card-polar__centro-titulo m-0 text-3xl font-semibold  " :style="{ color: palette.text, lineHeight: '33px', letterSpacing: '-1px' }">
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
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: background 0.2s ease;
  overflow: hidden;
  font-family: 'Geist', sans-serif;
}

.card-polar__topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.card-polar__corpo {
  display: flex;
  gap: 3.5rem;
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

/* tabela ocupa o espaço restante sem comprimir o gráfico (apenas layouts horizontais) */
.card-polar--right .nc-tabela,
.card-polar--left .nc-tabela {
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
}

.card-polar--top .nc-tabela,
.card-polar--bottom .nc-tabela {
  width: 100%;
}

/* gráfico: tamanho fixo em layouts horizontais */
.card-polar--right .card-polar__chart-wrap,
.card-polar--left .card-polar__chart-wrap {
  flex: 0 0 clamp(140px, 38%, 240px);
  width: clamp(140px, 38%, 240px);
}

.card-polar__chart-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-polar__chart {
  position: relative;
  width: 100%;
  min-width: 0;
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

@container (max-width: 520px) {
  .card-polar { gap: 0.75rem; }
  .card-polar__topo { flex-wrap: wrap; }

  .card-polar--left .card-polar__corpo,
  .card-polar--right .card-polar__corpo {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .card-polar--left .nc-tabela,
  .card-polar--right .nc-tabela {
    flex: 1 1 auto;
    width: 100%;
  }

  .card-polar--left .card-polar__chart-wrap,
  .card-polar--right .card-polar__chart-wrap {
    flex: 0 0 auto;
    width: 100%;
  }

  .card-polar__chart {
    max-width: 260px;
    margin: 0 auto;
  }

  .card-polar__centro-titulo { font-size: 1rem; }
  .card-polar__centro-desc { font-size: 0.78rem; }
  .nc-tabela-linha { font-size: 0.78rem; }
}

@container (max-width: 340px) {
  .card-polar__chart { max-width: 200px; }
  .card-polar__centro-titulo { font-size: 0.9rem; }
  .nc-tabela-linha { font-size: 0.72rem; }
  .nc-tabela-cab { font-size: 0.68rem; }
}
</style>

<style>
@import '../../styles/shared.css';
</style>
