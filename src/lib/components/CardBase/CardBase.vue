<script setup>
import { ref } from 'vue'
import { useTema, toRgba } from '../../composables/useTema.js'
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
  sombra: { type: String, default: 'none' },
  textoBotao: { type: String, default: 'Ver Todos' },
  botaoVisivel: { type: Boolean, default: true },
  alinhamento: {
    type: String,
    default: 'left',
    validator: (v) => ['left', 'center', 'right'].includes(v),
  },
  exportar: { type: Boolean, default: false },
  nomeArquivoExport: { type: String, default: 'card-base.png' },
})

const emit = defineEmits(['botaoAcao', 'exportado'])

const { palette, cardStyle } = useTema(props)
const cardRef = ref(null)
const iconeExportar = ICONE_EXPORTAR_SVG

function onBotaoClick() {
  emit('botaoAcao')
}

async function onExportar() {
  await exportarElementoComoImagem(cardRef.value, {
    nomeArquivo: props.nomeArquivoExport,
    corFundo: palette.value.bg !== 'transparent' ? palette.value.bg : null,
  })
  emit('exportado')
}
</script>

<template>
  <div ref="cardRef" class="card-base flex flex-column" :class="`card-base--${alinhamento}`" :style="cardStyle">
    <div v-if="exportar" class="card-base__topo">
      <button type="button" class="nc-exportar card-base__exportar inline-flex align-items-center justify-content-center"
        :style="{ color: palette.muted, borderColor: toRgba(palette.text === 'inherit' ? '#0F172A' : palette.text, 0.18) }"
        title="Exportar como imagem" aria-label="Exportar como imagem"
        @click="onExportar" v-html="iconeExportar"></button>
    </div>

    <div class="card-base__legendas flex flex-column">
      <div v-if="$slots.legenda || legenda" class="card-base__legenda font-medium text-xs" :style="{ color: palette.text }">
        <slot name="legenda">{{ legenda }}</slot>
      </div>
      <div v-if="$slots.sublegenda || sublegenda" class="card-base__sublegenda text-xs" :style="{ color: palette.muted }">
        <slot name="sublegenda">{{ sublegenda }}</slot>
      </div>
    </div>

    <div v-if="$slots.titulo || titulo || $slots.descricao || descricao" class="card-base__titulos flex flex-column">
      <div v-if="$slots.titulo || titulo" class="card-base__titulo m-0 text-3xl font-semibold  " :style="{ color: palette.text, lineHeight: '33px', letterSpacing: '-1px' }">
        <slot name="titulo">{{ titulo }}</slot>
      </div>
      <div v-if="$slots.descricao || descricao" class="text-sm" :style="{ color: palette.muted }">
        <slot name="descricao">{{ descricao }}</slot>
      </div>
    </div>

    <div v-if="$slots.acao || botaoVisivel" class="card-base__acao flex">
      <slot name="acao">
        <button v-if="botaoVisivel" type="button" class="card-base__link text-xs inline-flex align-items-center"
          :style="{ color: palette.text }" @click="onBotaoClick">
          <span>{{ textoBotao }}</span>
          <span class="card-base__chevron" aria-hidden="true">›</span>
        </button>
      </slot>
    </div>

    <div v-if="$slots.footer" class="card-base__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.card-base {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem;
  transition: background 0.2s ease;
  overflow: hidden;
  font-family: 'Geist', sans-serif;
  position: relative;
}

.card-base--left { text-align: left; align-items: stretch; }
.card-base--center { text-align: center; align-items: center; }
.card-base--right { text-align: right; align-items: flex-end; }

.card-base__topo {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
}

.card-base__legendas {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.card-base__legenda {
  line-height: 1.2;
  letter-spacing: -0.005em;
}

.card-base__sublegenda {
  font-size: 0.78rem;
  font-weight: 400;
  line-height: 1.2;
}

.card-base__titulos {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-base__titulo {
  font-size: 1.85rem;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.015em;
  word-break: break-word;
}



.card-base__acao {
  display: flex;
}

.card-base--center .card-base__acao { justify-content: center; }
.card-base--right .card-base__acao { justify-content: flex-end; }

.card-base__link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: transparent;
  border: none;
  padding: 0;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s ease;
}

.card-base__link:hover {
  opacity: 0.7;
}

.card-base__chevron {
  font-size: 1.1rem;
  line-height: 1;
  font-weight: 400;
  transform: translateY(-1px);
}

.card-base__exportar {
  width: 28px;
  height: 28px;
}

.card-base__footer {
  margin-top: 0.25rem;
}
</style>

<style>
@import '../../styles/shared.css';
</style>
