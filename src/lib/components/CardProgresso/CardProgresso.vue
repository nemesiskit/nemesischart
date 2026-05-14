<script setup>
import { computed, ref } from 'vue'
import ChartBase from '../ChartBase/ChartBase.vue'
import { useTema, toRgba, gerarPaleta } from '../../composables/useTema.js'
import { useFormatadorValor } from '../../composables/useFormatadorValor.js'
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
  corExcesso: { type: String, default: '#EF4444' },
  textoBotao: { type: String, default: 'Ver mais' },
  botaoVisivel: { type: Boolean, default: false },
  direcao: {
    type: String,
    default: 'top',
    validator: (v) => ['top', 'bottom', 'left', 'right'].includes(v),
  },
  formato: {
    type: String,
    default: 'linear',
    validator: (v) => ['linear', 'circular'].includes(v),
  },
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
      { rotulo: 'Vendas', quantidade: 72, meta: 100 },
      { rotulo: 'Serviços', quantidade: 48, meta: 80 },
      { rotulo: 'Assinaturas', quantidade: 35, meta: 60 },
      { rotulo: 'Suporte', quantidade: 18, meta: 40 },
    ],
  },
  metaPadrao: { type: Number, default: 100 },
  mostrarValor: { type: Boolean, default: true },
  mostrarPercentual: { type: Boolean, default: true },
  alturaBarra: { type: [String, Number], default: 8 },
  raioBarra: { type: [String, Number], default: '999px' },
  height: { type: [String, Number], default: 220 },
  cutout: { type: [String, Number], default: '78%' },
  exportar: { type: Boolean, default: false },
  nomeArquivoExport: { type: String, default: 'card-progresso.png' },
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

const layoutClass = computed(() => `card-progresso--${props.direcao}`)

const itens = computed(() => {
  const paleta = gerarPaleta(props.corDetalhes, props.data.length)
  return props.data.map((d, i) => {
    const meta = Number(d.meta ?? props.metaPadrao) || 0
    const quantidade = Number(d.quantidade) || 0
    const cor = d.cor ?? paleta[i]
    const isReducao = d.modo === 'reducao'

    let percentual
    if (isReducao) {
      const valorRef = Number(d.valor_referencia) || 0
      const range = valorRef - meta
      percentual = range > 0
        ? Math.max(0, Math.min(100, ((valorRef - quantidade) / range) * 100))
        : 0
    } else {
      percentual = meta > 0 ? Math.max(0, Math.min(100, (quantidade / meta) * 100)) : 0
    }

    return { rotulo: d.rotulo, quantidade, meta, valorReferencia: d.valor_referencia ?? null, cor, percentual, reducao: isReducao }
  })
})

const alturaBarraCss = computed(() =>
  typeof props.alturaBarra === 'number' ? `${props.alturaBarra}px` : props.alturaBarra
)
const raioBarraCss = computed(() =>
  typeof props.raioBarra === 'number' ? `${props.raioBarra}px` : props.raioBarra
)

const totalQuantidade = computed(() => itens.value.reduce((s, i) => s + i.quantidade, 0))
const totalMeta = computed(() => itens.value.reduce((s, i) => s + i.meta, 0))
const percentualTotal = computed(() => {
  if (!itens.value.length) return 0
  const peso = (item) =>
    item.reducao && item.valorReferencia != null
      ? Math.max(0, Number(item.valorReferencia) - item.meta)
      : item.meta
  const totalPeso = itens.value.reduce((s, item) => s + peso(item), 0)
  if (totalPeso <= 0) return 0
  return itens.value.reduce((s, item) => s + item.percentual * peso(item), 0) / totalPeso
})

const reducaoTotal = computed(() => itens.value.every((item) => item.reducao))

const chartData = computed(() => {
  const pct = Math.min(percentualTotal.value, 100)
  const restante = Math.max(0, 100 - pct)
  const cor = reducaoTotal.value ? props.corExcesso : props.corDetalhes
  return {
    labels: ['Progresso', 'Restante'],
    datasets: [
      {
        data: [pct, restante],
        backgroundColor: [cor, toRgba(palette.value.muted, 0.15)],
        borderWidth: 0,
        borderColor: 'transparent',
        hoverOffset: 0,
        spacing: 0,
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: props.cutout,
  rotation: -90,
  circumference: 360,
  layout: { padding: 4 },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
}))

function onBotaoClick() {
  emit('botaoAcao')
}
</script>

<template>
  <div ref="cardRef" class="card-progresso p-4 flex flex-column" :class="layoutClass" :style="cardStyle">
    <div class="card-progresso__topo flex align-items-start justify-content-between gap-3">
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

    <div v-if="$slots.titulo || titulo || $slots.descricao || descricao" class="card-progresso__titulos mt-3 mb-2 flex flex-column">
      <div v-if="$slots.titulo || titulo" class="m-0 text-3xl font-semibold  " :style="{ color: palette.text, lineHeight: '33px', letterSpacing: '-1px' }">
        <slot name="titulo">{{ titulo }}</slot>
      </div>
      <div v-if="$slots.descricao || descricao" class="text-sm mt-1" :style="{ color: palette.muted }">
        <slot name="descricao">{{ descricao }}</slot>
      </div>
    </div>

    <div class="card-progresso__corpo flex align-items-center flex-wrap">
      <div v-if="formato === 'circular'" class="card-progresso__chart-wrap flex align-items-center justify-content-center">
        <div class="card-progresso__chart">
          <ChartBase type="doughnut" :data="chartData" :options="chartOptions" :height="height" />
          <div class="nc-centro flex flex-column align-items-center justify-content-center">
            <div class="nc-centro-titulo" :style="{ color: reducaoTotal ? props.corExcesso : palette.text }">
              {{ Math.round(percentualTotal) }}%
            </div>
            <div class="nc-centro-desc" :style="{ color: palette.muted }">
              {{ formatar(totalQuantidade) }} / {{ formatar(totalMeta) }}
            </div>
          </div>
        </div>
      </div>

      <div class="card-progresso__lista flex flex-column">
        <div v-for="(item, i) in itens" :key="i" class="card-progresso__item flex flex-column">
          <div class="card-progresso__item-cab flex align-items-center justify-content-between">
            <span class="card-progresso__item-rotulo inline-flex align-items-center gap-2" :style="{ color: palette.text }">
              <span class="nc-bolinha" :style="{ background: item.cor }"></span>
              <span>{{ item.rotulo }}</span>
              <span v-if="item.reducao" class="card-progresso__item-modo" :style="{ color: palette.muted }">↓</span>
            </span>
            <span v-if="mostrarValor || mostrarPercentual" class="card-progresso__item-valor inline-flex align-items-center gap-2">
              <template v-if="mostrarValor">
                <span class="card-progresso__item-nums" :style="{ color: palette.muted }">
                  {{ formatar(item.quantidade) }}<span v-if="item.meta"> / {{ formatar(item.meta) }}</span>
                </span>
              </template>
              <span v-if="mostrarPercentual" class="card-progresso__item-pct"
                :style="{ background: toRgba(item.cor, 0.12), color: item.cor }">
                {{ Math.round(item.percentual) }}%
              </span>
            </span>
          </div>
          <div class="card-progresso__trilha w-full"
            :style="{
              height: alturaBarraCss,
              borderRadius: raioBarraCss,
              background: item.reducao ? toRgba(props.corExcesso, 0.18) : toRgba(palette.muted, 0.15),
            }">
            <div class="card-progresso__preenchimento"
              :style="{ width: item.percentual + '%', background: item.cor, borderRadius: raioBarraCss }"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$slots.footer" class="card-progresso__footer mt-3">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.card-progresso {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: background 0.2s ease;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.card-progresso__topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.card-progresso__corpo {
  display: flex;
  gap: 3.5rem;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 0;
  flex-wrap: wrap;
}

.card-progresso--top .card-progresso__corpo {
  flex-direction: column;
  align-items: stretch;
  flex-wrap: nowrap;
}

.card-progresso--bottom .card-progresso__corpo {
  flex-direction: column-reverse;
  align-items: stretch;
  flex-wrap: nowrap;
}

.card-progresso--right .card-progresso__corpo {
  flex-direction: row-reverse;
  flex-wrap: nowrap;
}

.card-progresso--left .card-progresso__corpo {
  flex-direction: row;
  flex-wrap: nowrap;
}

.card-progresso--left .card-progresso__chart-wrap,
.card-progresso--right .card-progresso__chart-wrap {
  align-self: center;
}

.card-progresso__chart-wrap {
  flex: 0 0 clamp(140px, 38%, 220px);
  width: clamp(140px, 38%, 220px);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.card-progresso--top .card-progresso__chart-wrap,
.card-progresso--bottom .card-progresso__chart-wrap {
  flex: 0 0 auto;
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
}

.card-progresso__chart {
  position: relative;
  width: 100%;
}

@container (max-width: 520px) {
  .card-progresso { gap: 0.75rem; }
  .card-progresso__topo { flex-wrap: wrap; }

  .card-progresso--left .card-progresso__corpo,
  .card-progresso--right .card-progresso__corpo {
    flex-direction: column;
    align-items: stretch;
    flex-wrap: nowrap;
  }

  .card-progresso--left .card-progresso__chart-wrap,
  .card-progresso--right .card-progresso__chart-wrap {
    flex: 0 0 auto;
    width: 100%;
    max-width: 240px;
    margin: 0 auto;
  }

  .nc-centro-titulo { font-size: 1.05rem; }
  .nc-centro-desc { font-size: 0.58rem; }
  .card-progresso__item-cab {
    font-size: 0.78rem;
    gap: 0.5rem;
  }
}

@container (max-width: 380px) {
  .card-progresso__item-cab {
    flex-wrap: wrap;
  }
}

.nc-centro-desc {
  font-variant-numeric: tabular-nums;
}

.card-progresso__lista {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
}

.card-progresso--left .card-progresso__lista,
.card-progresso--right .card-progresso__lista {
  flex: 1 1 0;
  width: 100%;
  min-width: 0;
}

.card-progresso__item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.card-progresso__item-cab {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.82rem;
}

.card-progresso__item-rotulo {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
  font-weight: 500;
}

.card-progresso__item-valor {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.card-progresso__item-modo {
  font-size: 0.7rem;
  font-weight: 500;
  line-height: 1;
}

.card-progresso__item-nums {
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
  font-weight: 400;
}

.card-progresso__item-pct {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  line-height: 1.4;
}

.card-progresso__trilha {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.card-progresso__preenchimento {
  height: 100%;
  transition: width 0.4s ease;
}

</style>

<style>
@import '../../styles/shared.css';
</style>
