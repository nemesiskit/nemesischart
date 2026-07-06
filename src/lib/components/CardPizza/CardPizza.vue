<script setup>
import { computed, ref } from 'vue'
import ChartBase from '../ChartBase/ChartBase.vue'
import CardCabecalho from '../internos/CardCabecalho.vue'
import TabelaDados from '../internos/TabelaDados.vue'
import { useTema, gerarPaleta } from '../../composables/useTema.js'
import { useFormatadorValor } from '../../composables/useFormatadorValor.js'
import { criarTooltipExternoPadrao } from '../../composables/useTooltipExterno.js'
import { useExportarCard } from '../../composables/useExportarImagem.js'
import { propsCartao, propsValor, propsDirecao, propsTabela } from '../../props.js'

const props = defineProps({
  ...propsCartao({ nomeArquivoExport: 'card-pizza.png' }),
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
  cutout: { type: [String, Number], default: '70%' },
  // Recebe o item original de `data` e retorna texto(s) extra(s) exibidos no
  // tooltip abaixo do valor. Pode devolver uma string ou um array de strings.
  detalheTooltip: { type: Function, default: null },
})

const emit = defineEmits(['botaoAcao', 'exportado', 'itemClicado'])

const { palette, cardStyle } = useTema(props)
const { formatar } = useFormatadorValor(props)
const { cardRef, onExportar, iconeExportar } = useExportarCard(props, palette, emit)

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

const externalTooltip = criarTooltipExternoPadrao({
  corDe: (dp) => coresAplicadas.value[dp.dataIndex],
  valorDe: (dp) => formatar(dp.parsed),
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
  cutout: props.cutout,
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
</script>

<template>
  <div ref="cardRef" class="card-pizza nc-p-4 nc-flex nc-flex-column" :class="layoutClass" :style="cardStyle">
    <CardCabecalho class="card-pizza__topo" :legenda="legenda" :sublegenda="sublegenda" :palette="palette"
      :texto-botao="textoBotao" :botao-visivel="botaoVisivel" :exportar="exportar"
      @botao-acao="emit('botaoAcao')" @exportar="onExportar">
      <template v-if="$slots.legenda" #legenda><slot name="legenda" /></template>
      <template v-if="$slots.sublegenda" #sublegenda><slot name="sublegenda" /></template>
      <template v-if="$slots.actions" #actions><slot name="actions" /></template>
    </CardCabecalho>

    <div class="card-pizza__corpo nc-flex nc-align-items-center">
      <TabelaDados :data="data" :cores-aplicadas="coresAplicadas" :palette="palette" :formatar="formatar"
        :rotulo-categoria="rotuloCategoria" :rotulo-quantidade="rotuloQuantidade"
        :mostrar-cabecalho="mostrarCabecalho" :itens-clicaveis="itensClicaveis" :tooltip-linha="tooltipLinha"
        v-model:hover-index="hoverIndex" @item-clicado="emitirItem" />

      <div class="card-pizza__chart-wrap nc-flex nc-align-items-center nc-justify-content-center">
        <div class="card-pizza__chart">
          <ChartBase type="doughnut" :data="chartData" :options="chartOptions" :height="height" />
          <div v-if="$slots.titulo || titulo || $slots.descricao || descricao" class="nc-centro nc-flex nc-flex-column nc-align-items-center nc-justify-content-center">
            <div v-if="$slots.titulo || titulo" class="nc-centro-titulo nc-m-0 nc-font-semibold" :style="{ color: palette.text }">
              <slot name="titulo">{{ titulo }}</slot>
            </div>
            <div v-if="$slots.descricao || descricao" class="nc-centro-desc" :style="{ color: palette.muted }">
              <slot name="descricao">{{ descricao }}</slot>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$slots.footer" class="card-pizza__footer nc-mt-3">
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
}

@container (max-width: 340px) {
  .card-pizza__chart { max-width: 200px; }
  .nc-centro-titulo { font-size: 0.9rem; }
}
</style>

<style>
@import '../../styles/shared.css';
</style>
