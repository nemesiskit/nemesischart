<script setup>
import { toRgba } from '../../composables/useTema.js'
import { ICONE_EXPORTAR_SVG } from '../../composables/useExportarImagem.js'

// Topo padrão dos cards: legenda/sublegenda à esquerda, ações à direita.
// Componente interno — não exportado pela lib.
const props = defineProps({
  legenda: { type: String, default: null },
  sublegenda: { type: String, default: null },
  palette: { type: Object, required: true },
  textoBotao: { type: String, default: 'Ver mais' },
  botaoVisivel: { type: Boolean, default: false },
  exportar: { type: Boolean, default: false },
  opacidadeLegenda: { type: [Number, String], default: 0.95 },
})

const emit = defineEmits(['botaoAcao', 'exportar'])
const iconeExportar = ICONE_EXPORTAR_SVG
</script>

<template>
  <div class="nc-topo nc-flex nc-align-items-start nc-justify-content-between nc-gap-3">
    <div v-if="$slots.legenda || legenda || $slots.sublegenda || sublegenda" class="nc-legendas-flex nc-flex nc-flex-column">
      <div v-if="$slots.legenda || legenda" class="nc-text-xs nc-font-medium" :style="{ color: palette.text, opacity: opacidadeLegenda }">
        <slot name="legenda">{{ legenda }}</slot>
      </div>
      <div v-if="$slots.sublegenda || sublegenda" class="nc-text-xs" :style="{ color: palette.muted }">
        <slot name="sublegenda">{{ sublegenda }}</slot>
      </div>
    </div>
    <div v-if="$slots.actions || botaoVisivel || exportar" class="nc-actions nc-inline-flex nc-align-items-center nc-gap-2">
      <slot name="actions">
        <button v-if="botaoVisivel" class="nc-btn nc-inline-flex nc-align-items-center"
          :style="{ color: palette.text, borderColor: toRgba(palette.text, 0.18) }" @click="emit('botaoAcao')">
          <span>{{ textoBotao }}</span>
        </button>
      </slot>
      <button v-if="exportar" type="button" class="nc-exportar nc-inline-flex nc-align-items-center nc-justify-content-center"
        :style="{ color: palette.muted, borderColor: toRgba(palette.text, 0.18) }"
        title="Exportar como imagem" aria-label="Exportar como imagem"
        @click="emit('exportar')" v-html="iconeExportar"></button>
    </div>
  </div>
</template>

<style scoped>
.nc-topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
</style>
