<script setup>
// Bloco título + descrição dos cards. Componente interno — não exportado.
// O pai controla a visibilidade (v-if) e as margens externas via class.
defineProps({
  titulo: { type: String, default: null },
  descricao: { type: String, default: null },
  palette: { type: Object, required: true },
})
</script>

<template>
  <div class="nc-titulos nc-flex nc-flex-column">
    <div v-if="$slots.titulo || titulo" class="nc-m-0 nc-text-3xl nc-font-semibold"
      :style="{ color: palette.text, lineHeight: '33px', letterSpacing: '-1px' }">
      <slot name="titulo">{{ titulo }}</slot>
    </div>
    <div v-if="$slots.descricao || descricao" class="nc-text-sm nc-mt-1" :style="{ color: palette.muted }">
      <slot name="descricao">{{ descricao }}</slot>
    </div>
  </div>
</template>
