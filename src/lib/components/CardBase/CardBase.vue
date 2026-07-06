<script setup>
import { useTema, toRgba } from '../../composables/useTema.js'
import { useExportarCard } from '../../composables/useExportarImagem.js'
import { propsCartao } from '../../props.js'

const props = defineProps({
  ...propsCartao({
    sombra: 'none',
    textoBotao: 'Ver Todos',
    botaoVisivel: true,
    nomeArquivoExport: 'card-base.png',
  }),
  alinhamento: {
    type: String,
    default: 'left',
    validator: (v) => ['left', 'center', 'right'].includes(v),
  },
})

const emit = defineEmits(['botaoAcao', 'exportado'])

const { palette, cardStyle } = useTema(props)
const { cardRef, onExportar, iconeExportar } = useExportarCard(props, palette, emit)

function onBotaoClick() {
  emit('botaoAcao')
}
</script>

<template>
  <div ref="cardRef" class="card-base nc-flex nc-flex-column" :class="`card-base--${alinhamento}`" :style="cardStyle">
    <div v-if="exportar" class="card-base__topo">
      <button type="button" class="nc-exportar card-base__exportar nc-inline-flex nc-align-items-center nc-justify-content-center"
        :style="{ color: palette.muted, borderColor: toRgba(palette.text === 'inherit' ? '#0F172A' : palette.text, 0.18) }"
        title="Exportar como imagem" aria-label="Exportar como imagem"
        @click="onExportar" v-html="iconeExportar"></button>
    </div>

    <div class="card-base__legendas nc-flex nc-flex-column">
      <div v-if="$slots.legenda || legenda" class="card-base__legenda nc-font-medium nc-text-xs" :style="{ color: palette.text }">
        <slot name="legenda">{{ legenda }}</slot>
      </div>
      <div v-if="$slots.sublegenda || sublegenda" class="card-base__sublegenda nc-text-xs" :style="{ color: palette.muted }">
        <slot name="sublegenda">{{ sublegenda }}</slot>
      </div>
    </div>

    <div v-if="$slots.titulo || titulo || $slots.descricao || descricao" class="card-base__titulos nc-flex nc-flex-column">
      <div v-if="$slots.titulo || titulo" class="card-base__titulo nc-m-0 nc-text-3xl nc-font-semibold" :style="{ color: palette.text, lineHeight: '33px', letterSpacing: '-1px' }">
        <slot name="titulo">{{ titulo }}</slot>
      </div>
      <div v-if="$slots.descricao || descricao" class="nc-text-sm" :style="{ color: palette.muted }">
        <slot name="descricao">{{ descricao }}</slot>
      </div>
    </div>

    <div v-if="$slots.acao || botaoVisivel" class="card-base__acao nc-flex">
      <slot name="acao">
        <button v-if="botaoVisivel" type="button" class="card-base__link nc-text-xs nc-inline-flex nc-align-items-center"
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
