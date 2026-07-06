<script setup>
import { ref } from 'vue'
import { toRgba } from '../../composables/useTema.js'

// Tabela rótulo/valor sincronizada com o gráfico (hover e clique).
// Componente interno usado por CardPizza e CardPolar — não exportado.
const props = defineProps({
  data: { type: Array, required: true },
  coresAplicadas: { type: Array, required: true },
  palette: { type: Object, required: true },
  formatar: { type: Function, required: true },
  rotuloCategoria: { type: String, default: 'Categoria' },
  rotuloQuantidade: { type: String, default: 'Quantidade' },
  mostrarCabecalho: { type: Boolean, default: true },
  itensClicaveis: { type: Boolean, default: false },
  hoverIndex: { type: Number, default: null },
  /** padding-inline aplicado à linha em hover/ativa (difere entre cards). */
  padAtiva: { type: String, default: '0.40rem' },
  /** `(item, index) => string` — tooltip da linha. Padrão: item.descricao. */
  tooltipLinha: { type: Function, default: null },
})

const emit = defineEmits(['update:hoverIndex', 'itemClicado'])

function onItemClick(item, index) {
  if (!props.itensClicaveis) return
  emit('itemClicado', { item, index, cor: props.coresAplicadas[index] })
}

function textoTooltip(item, index) {
  const texto = props.tooltipLinha ? props.tooltipLinha(item, index) : item?.descricao
  return texto || ''
}

// Tooltip flutuante (teleportado para o body para não ser cortado pelo
// `overflow: hidden` do card). Posicionado junto ao cursor, com clamp para não
// vazar das bordas da viewport.
const tooltip = ref({ visivel: false, texto: '', x: 0, y: 0 })

function posicionar(event) {
  const margem = 12
  const x = Math.min(Math.max(event.clientX, 150), window.innerWidth - 150)
  const y = Math.max(event.clientY - margem, 80)
  tooltip.value.x = x
  tooltip.value.y = y
}

function onRowEnter(event, item, index) {
  emit('update:hoverIndex', index)
  const texto = textoTooltip(item, index)
  if (!texto) return
  tooltip.value.texto = texto
  tooltip.value.visivel = true
  posicionar(event)
}

function onRowMove(event) {
  if (tooltip.value.visivel) posicionar(event)
}

function onRowLeave() {
  emit('update:hoverIndex', null)
  tooltip.value.visivel = false
}
</script>

<template>
  <div class="nc-tabela nc-flex nc-flex-column" :style="{ '--nc-tabela-pad-ativa': padAtiva }">
    <div v-if="mostrarCabecalho" class="nc-tabela-cab nc-flex nc-align-items-center nc-justify-content-between"
      :style="{ color: palette.muted, borderColor: toRgba(palette.muted, 0.25) }">
      <span>{{ rotuloCategoria }}</span>
      <span class="nc-tabela-valor">{{ rotuloQuantidade }}</span>
    </div>
    <div v-for="(item, i) in data" :key="i"
      class="nc-tabela-linha nc-flex nc-align-items-center nc-justify-content-between"
      :class="{ 'nc-tabela-linha--clicavel': itensClicaveis, 'nc-tabela-linha--ativa': hoverIndex === i }"
      :style="{
        color: palette.text,
        cursor: itensClicaveis ? 'pointer' : 'default',
        '--nc-linha-bg': toRgba(coresAplicadas[i], 0.05),
        '--nc-linha-bg-forte': toRgba(coresAplicadas[i], 0.08),
      }"
      :role="itensClicaveis ? 'button' : null"
      :tabindex="itensClicaveis ? 0 : null"
      @mouseenter="onRowEnter($event, item, i)"
      @mousemove="onRowMove"
      @mouseleave="onRowLeave"
      @focus="emit('update:hoverIndex', i)"
      @blur="emit('update:hoverIndex', null)"
      @click="onItemClick(item, i)"
      @keydown.enter.prevent="onItemClick(item, i)"
      @keydown.space.prevent="onItemClick(item, i)">
      <span class="nc-tabela-rotulo nc-inline-flex nc-align-items-center nc-gap-2">
        <span class="nc-bolinha" :style="{ background: coresAplicadas[i] }"></span>
        <span>{{ item.rotulo }}</span>
      </span>
      <span class="nc-tabela-valor">{{ formatar(item.quantidade) }}</span>
    </div>

    <Teleport to="body">
      <div v-if="tooltip.visivel" class="nc-tabela-tt"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
        {{ tooltip.texto }}
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.nc-tabela-linha {
  position: relative;
  border-radius: 8px;
  padding-inline: 0;
  transition: background 0.18s ease, padding-inline 0.18s ease;
}

.nc-tabela-linha--ativa {
  background: var(--nc-linha-bg, rgba(15, 23, 42, 0.03));
  padding-inline: var(--nc-tabela-pad-ativa, 0.40rem);
}

.nc-tabela-linha--clicavel:hover,
.nc-tabela-linha--clicavel:focus-visible {
  background: var(--nc-linha-bg-forte, rgba(15, 23, 42, 0.04));
  padding-inline: var(--nc-tabela-pad-ativa, 0.40rem);
  outline: none;
}

.nc-tabela-tt {
  position: fixed;
  transform: translate(-50%, -100%);
  pointer-events: none;
  z-index: 9999;
  max-width: 280px;
  white-space: normal;
  font-family: 'Geist', sans-serif;
  font-size: 12px;
  line-height: 1.35;
  color: #0F172A;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.12);
  padding: 8px 11px;
}

/* breakpoints baseados no container do card pai (container-type no card) */
@container (max-width: 520px) {
  .nc-tabela-linha { font-size: 0.78rem; }
}

@container (max-width: 340px) {
  .nc-tabela-linha { font-size: 0.72rem; }
  .nc-tabela-cab { font-size: 0.68rem; }
}
</style>
