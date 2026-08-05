<script setup>
import { computed, ref, useSlots } from 'vue'
import ChartBase from '../ChartBase/ChartBase.vue'
import CardCabecalho from '../internos/CardCabecalho.vue'
import TabelaDados from '../internos/TabelaDados.vue'
import { useTema, toRgba, gerarPaleta } from '../../composables/useTema.js'
import { useFormatadorValor } from '../../composables/useFormatadorValor.js'
import { criarTooltipExternoPadrao } from '../../composables/useTooltipExterno.js'
import { useExportarCard } from '../../composables/useExportarImagem.js'
import { propsCartao, propsValor, propsDirecao, propsTabela } from '../../props.js'

const props = defineProps({
  ...propsCartao({ nomeArquivoExport: 'card-polar.png' }),
  ...propsValor(),
  ...propsDirecao('right'),
  ...propsTabela(),
  corDetalhes: { type: String, default: '#3B82F6' },
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
  // Esconde o gráfico e deixa apenas a tabela (título/descrição continuam visíveis).
  mostrarGrafico: { type: Boolean, default: true },
  // Recebe o item original de `data` e retorna texto(s) extra(s) exibidos no
  // tooltip abaixo do valor. Pode devolver uma string ou um array de strings.
  detalheTooltip: { type: Function, default: null },
})

const emit = defineEmits(['botaoAcao', 'exportado', 'itemClicado'])

const { palette, cardStyle } = useTema(props)
const { formatar } = useFormatadorValor(props)
const { cardRef, onExportar, iconeExportar } = useExportarCard(props, palette, emit)

const layoutClass = computed(() => `card-polar--${props.direcao}`)

const slots = useSlots()
const temCentro = computed(
  () => Boolean(slots.titulo || props.titulo || slots.descricao || props.descricao),
)
// sem gráfico e sem título/descrição, a coluna lateral inteira sai do layout
const mostrarLateral = computed(() => props.mostrarGrafico || temCentro.value)

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

const externalTooltip = criarTooltipExternoPadrao({
  corDe: (dp) => coresAplicadas.value[dp.dataIndex],
  valorDe: (dp) => formatar(dp.parsed.r ?? dp.parsed),
  linhasExtrasDe: props.detalheTooltip
    ? (dp) => props.detalheTooltip(props.data[dp.dataIndex], dp.dataIndex)
    : null,
})

const hoverIndex = ref(null)

function emitirItem(payload) {
  emit('itemClicado', payload)
}

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: 4 },
  onHover: (event, elements, chart) => {
    hoverIndex.value = elements.length ? elements[0].index : null
    chart.canvas.style.cursor = props.itensClicaveis && elements.length ? 'pointer' : 'default'
  },
  onClick: (event, elements) => {
    if (!props.itensClicaveis || !elements.length) return
    const index = elements[0].index
    const item = props.data[index]
    if (!item) return
    emitirItem({ item, index, cor: coresAplicadas.value[index] })
  },
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
</script>

<template>
  <div ref="cardRef" class="card-polar nc-p-4 nc-flex nc-flex-column" :class="layoutClass" :style="cardStyle">
    <CardCabecalho class="card-polar__topo" :legenda="legenda" :sublegenda="sublegenda" :palette="palette"
      :texto-botao="textoBotao" :botao-visivel="botaoVisivel" :exportar="exportar"
      @botao-acao="emit('botaoAcao')" @exportar="onExportar">
      <template v-if="$slots.legenda" #legenda><slot name="legenda" /></template>
      <template v-if="$slots.sublegenda" #sublegenda><slot name="sublegenda" /></template>
      <template v-if="$slots.actions" #actions><slot name="actions" /></template>
    </CardCabecalho>

    <div class="card-polar__corpo nc-flex nc-align-items-center">
      <TabelaDados :data="data" :cores-aplicadas="coresAplicadas" :palette="palette" :formatar="formatar"
        :rotulo-categoria="rotuloCategoria" :rotulo-quantidade="rotuloQuantidade"
        :mostrar-cabecalho="mostrarCabecalho" :itens-clicaveis="itensClicaveis" :tooltip-linha="tooltipLinha"
        pad-ativa="0.25rem" v-model:hover-index="hoverIndex" @item-clicado="emitirItem" />

      <div v-if="mostrarLateral" class="card-polar__chart-wrap nc-flex nc-align-items-center nc-justify-content-center"
        :class="{ 'card-polar__chart-wrap--sem-grafico': !mostrarGrafico }">
        <div class="card-polar__chart">
          <ChartBase v-if="mostrarGrafico" type="polarArea" :data="chartData" :options="chartOptions"
            :height="height" />
          <div v-if="temCentro" class="card-polar__centro-bottom">
            <div v-if="$slots.titulo || titulo" class="card-polar__centro-titulo nc-m-0 nc-text-3xl nc-font-semibold" :style="{ color: palette.text, lineHeight: '33px', letterSpacing: '-1px' }">
              <slot name="titulo">{{ titulo }}</slot>
            </div>
            <div v-if="$slots.descricao || descricao" class="card-polar__centro-desc" :style="{ color: palette.muted }">
              <slot name="descricao">{{ descricao }}</slot>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$slots.footer" class="card-polar__footer nc-mt-3">
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

/* sem gráfico sobra apenas o título/descrição: não reserva a largura do canvas */
.card-polar--right .card-polar__chart-wrap--sem-grafico,
.card-polar--left .card-polar__chart-wrap--sem-grafico {
  flex: 0 0 auto;
  width: auto;
}

.card-polar__chart-wrap--sem-grafico .card-polar__centro-bottom {
  margin-top: 0;
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
    flex-direction: column-reverse;
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
}

@container (max-width: 340px) {
  .card-polar__chart { max-width: 200px; }
  .card-polar__centro-titulo { font-size: 0.9rem; }
}
</style>

<style>
@import '../../styles/shared.css';
</style>
