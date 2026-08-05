<script setup>
import { computed } from 'vue'
import ChartBase from '../ChartBase/ChartBase.vue'
import CardCabecalho from '../internos/CardCabecalho.vue'
import CardTitulos from '../internos/CardTitulos.vue'
import { useTema, toRgba } from '../../composables/useTema.js'
import { useFormatadorValor } from '../../composables/useFormatadorValor.js'
import { criarTooltipExternoPadrao } from '../../composables/useTooltipExterno.js'
import { useLinhasReferencia } from '../../composables/useLinhasReferencia.js'
import { useExportarCard } from '../../composables/useExportarImagem.js'
import { propsCartao, propsValor, propsDirecao } from '../../props.js'

const props = defineProps({
  ...propsCartao({ nomeArquivoExport: 'card-linhas.png' }),
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
  height: { type: [String, Number], default: 280 },
  // Curvatura da linha (0 = reta/segmentos retos, 1 = bem arredondada).
  tension: { type: Number, default: 0.45 },
  linhasReferencia: { type: [Object, Array], default: null },
  // Recebe o item original de `data` e retorna texto(s) extra(s) exibidos no
  // tooltip abaixo do valor. Pode devolver uma string ou um array de strings.
  detalheTooltip: { type: Function, default: null },
})

const emit = defineEmits(['botaoAcao', 'exportado'])

const { palette, cardStyle } = useTema(props)
const { formatar } = useFormatadorValor(props)
const { cardRef, onExportar, iconeExportar } = useExportarCard(props, palette, emit)

const layoutClass = computed(() => `card-linhas--${props.direcao}`)

const { linhasNormalizadas, pluginLinhaReferencia, temLinhaHover } = useLinhasReferencia({
  linhasReferencia: () => props.linhasReferencia,
  formatar,
})

const pluginsChart = [pluginLinhaReferencia]

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
      tension: Math.min(Math.max(props.tension, 0), 1),
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBorderWidth: 3,
      pointHoverBackgroundColor: props.corDetalhes,
      pointHoverBorderColor: palette.value.bg === 'transparent' ? '#fff' : palette.value.bg,
      clip: false,
    },
  ],
}))

const externalTooltip = criarTooltipExternoPadrao({
  corDe: () => props.corDetalhes || '#3B82F6',
  valorDe: (dp) => formatar(dp.parsed.y),
  linhasExtrasDe: props.detalheTooltip
    ? (dp) => props.detalheTooltip(props.data[dp.dataIndex], dp.dataIndex)
    : null,
  deveOcultar: temLinhaHover,
})

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
</script>

<template>
  <div ref="cardRef" class="card-linhas nc-p-4 nc-flex" :class="layoutClass" :style="cardStyle">
    <div class="card-linhas__header nc-flex nc-flex-column">
      <CardCabecalho class="card-linhas__topo" :legenda="legenda" :sublegenda="sublegenda" :palette="palette"
        :texto-botao="textoBotao" :botao-visivel="botaoVisivel" :exportar="exportar" opacidade-legenda="0.85"
        @botao-acao="emit('botaoAcao')" @exportar="onExportar">
        <template v-if="$slots.legenda" #legenda><slot name="legenda" /></template>
        <template v-if="$slots.sublegenda" #sublegenda><slot name="sublegenda" /></template>
        <template v-if="$slots.actions" #actions><slot name="actions" /></template>
      </CardCabecalho>
      <CardTitulos v-if="$slots.titulo || titulo || $slots.descricao || descricao"
        class="card-linhas__titulos nc-mt-3 nc-mb-2" :titulo="titulo" :descricao="descricao" :palette="palette">
        <template v-if="$slots.titulo" #titulo><slot name="titulo" /></template>
        <template v-if="$slots.descricao" #descricao><slot name="descricao" /></template>
      </CardTitulos>
    </div>

    <div class="card-linhas__chart nc-flex-1">
      <ChartBase type="line" :data="chartData" :options="chartOptions" :plugins="pluginsChart" :height="height" />
    </div>

    <div v-if="$slots.footer" class="card-linhas__footer nc-mt-3">
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
  padding: 1.5rem;
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

.card-linhas--left,
.card-linhas--right {
  /* o padding lateral vem do header (1.5rem); zera o do card para não somar
     com o nc-p-4 e duplicar o espaçamento, igual aos modos top/bottom */
  padding: 0 !important;
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
