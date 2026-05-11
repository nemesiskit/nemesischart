<script setup>
import { computed, ref } from 'vue'
import ChartBase from '../ChartBase/ChartBase.vue'
import { useTema, toRgba } from '../../composables/useTema.js'
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
  borderRadius: { type: [String, Number], default: '1rem' },
  sombra: { type: String, default: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)' },
  cores: {
    type: Array,
    default: () => ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'],
  },
  corDetalhes: { type: String, default: '#3B82F6' },
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

const itens = computed(() =>
  props.data.map((d, i) => {
    const meta = Number(d.meta ?? props.metaPadrao) || 0
    const quantidade = Number(d.quantidade) || 0
    const cor = d.cor || props.cores[i % props.cores.length]
    const percentual = meta > 0 ? Math.max(0, Math.min(100, (quantidade / meta) * 100)) : 0
    return { rotulo: d.rotulo, quantidade, meta, cor, percentual }
  })
)

const alturaBarraCss = computed(() =>
  typeof props.alturaBarra === 'number' ? `${props.alturaBarra}px` : props.alturaBarra
)
const raioBarraCss = computed(() =>
  typeof props.raioBarra === 'number' ? `${props.raioBarra}px` : props.raioBarra
)

const totalQuantidade = computed(() => itens.value.reduce((s, i) => s + i.quantidade, 0))
const totalMeta = computed(() => itens.value.reduce((s, i) => s + i.meta, 0))
const percentualTotal = computed(() => {
  if (totalMeta.value <= 0) return 0
  return Math.max(0, Math.min(100, (totalQuantidade.value / totalMeta.value) * 100))
})

const chartData = computed(() => {
  const restante = Math.max(0, 100 - percentualTotal.value)
  const cor = props.corDetalhes
  return {
    labels: ['Progresso', 'Restante'],
    datasets: [
      {
        data: [percentualTotal.value, restante],
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
      <div v-if="$slots.legenda || legenda || $slots.sublegenda || sublegenda" class="card-progresso__legendas flex flex-column">
        <div v-if="$slots.legenda || legenda" class="text-xs font-medium" :style="{ color: palette.text, opacity: 0.95 }">
          <slot name="legenda">{{ legenda }}</slot>
        </div>
        <div v-if="$slots.sublegenda || sublegenda" class="text-xs" :style="{ color: palette.muted }">
          <slot name="sublegenda">{{ sublegenda }}</slot>
        </div>
      </div>
      <div v-if="$slots.actions || botaoVisivel || exportar" class="card-progresso__actions inline-flex align-items-center gap-2">
        <slot name="actions">
          <button v-if="botaoVisivel" class="card-progresso__btn inline-flex align-items-center"
            :style="{ color: palette.text, borderColor: toRgba(palette.text, 0.18) }" @click="onBotaoClick">
            <span>{{ textoBotao }}</span>
          </button>
        </slot>
        <button v-if="exportar" type="button" class="card-progresso__exportar inline-flex align-items-center justify-content-center"
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

    <div class="card-progresso__corpo flex align-items-center gap-4 flex-wrap">
      <div v-if="formato === 'circular'" class="card-progresso__chart-wrap flex align-items-center justify-content-center">
        <div class="card-progresso__chart">
          <ChartBase type="doughnut" :data="chartData" :options="chartOptions" :height="height" />
          <div class="card-progresso__centro flex flex-column align-items-center justify-content-center">
            <div class="card-progresso__centro-valor" :style="{ color: palette.text }">
              {{ Math.round(percentualTotal) }}%
            </div>
            <div class="card-progresso__centro-desc" :style="{ color: palette.muted }">
              {{ formatar(totalQuantidade) }} / {{ formatar(totalMeta) }}
            </div>
          </div>
        </div>
      </div>

      <div class="card-progresso__lista flex flex-column">
        <div v-for="(item, i) in itens" :key="i" class="card-progresso__item flex flex-column">
          <div class="card-progresso__item-cab flex align-items-center justify-content-between">
            <span class="card-progresso__item-rotulo inline-flex align-items-center gap-2" :style="{ color: palette.text }">
              <span class="card-progresso__bolinha" :style="{ background: item.cor }"></span>
              <span>{{ item.rotulo }}</span>
            </span>
            <span v-if="mostrarValor || mostrarPercentual" class="card-progresso__item-valor inline-flex align-items-baseline gap-2"
              :style="{ color: palette.text }">
              <template v-if="mostrarValor">{{ formatar(item.quantidade) }}<span v-if="item.meta" :style="{ color: palette.muted }"> / {{ formatar(item.meta) }}</span></template>
              <span v-if="mostrarPercentual" class="card-progresso__item-pct" :style="{ color: palette.muted }">
                {{ Math.round(item.percentual) }}%
              </span>
            </span>
          </div>
          <div class="card-progresso__trilha w-full"
            :style="{ height: alturaBarraCss, borderRadius: raioBarraCss, background: toRgba(palette.muted, 0.15) }">
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

.card-progresso__legendas {
  min-width: 0;
  flex: 1 1 auto;
}

.card-progresso__actions {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.card-progresso__exportar {
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

.card-progresso__exportar:hover {
  opacity: 0.7;
}

.card-progresso__exportar :deep(svg) {
  display: block;
}

.card-progresso__corpo {
  display: flex;
  gap: 1.5rem;
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
}

.card-progresso--left .card-progresso__corpo {
  flex-direction: row;
}

.card-progresso--left .card-progresso__chart-wrap,
.card-progresso--right .card-progresso__chart-wrap {
  align-self: center;
}

.card-progresso__chart-wrap {
  flex: 0 1 200px;
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

@media (max-width: 640px) {
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
  .card-progresso__centro-valor { font-size: 1.05rem; }
  .card-progresso__centro-desc { font-size: 0.58rem; }
  .card-progresso__item-cab {
    font-size: 0.78rem;
    gap: 0.5rem;
  }
  .card-progresso__btn {
    padding: 0.4rem 0.85rem;
    font-size: 0.82rem;
  }
}

@media (max-width: 380px) {
  .card-progresso__item-cab {
    flex-wrap: wrap;
  }
}

.card-progresso__centro {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
  padding: 0 1rem;
}

.card-progresso__centro-valor {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.card-progresso__centro-desc {
  font-size: 0.6rem;
  line-height: 1.3;
  max-width: 80px;
  margin-top: 0.15rem;
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
  width: auto;
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
  align-items: baseline;
  gap: 0.5rem;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

.card-progresso__item-pct {
  font-size: 0.72rem;
  font-weight: 500;
}

.card-progresso__bolinha {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex: 0 0 auto;
  display: inline-block;
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

.card-progresso__btn {
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

.card-progresso__btn:hover {
  opacity: 0.75;
}
</style>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
</style>
