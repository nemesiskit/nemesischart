<script setup>
import { CardLinhas, CardBarra, CardPizza } from '../lib'

const lineSample = [
  { rotulo: 'Jan', quantidade: 1186451.5 },
  { rotulo: 'Fev', quantidade: 2810076.48 },
  { rotulo: 'Mar', quantidade: 3247974.14 },
  { rotulo: 'Abr', quantidade: 3565908.98 },
  { rotulo: 'Mai', quantidade: 159800.0 },
  { rotulo: 'Jun', quantidade: 0 },
  { rotulo: 'Jul', quantidade: 0 },
  { rotulo: 'Ago', quantidade: 0 },
  { rotulo: 'Set', quantidade: 0 },
  { rotulo: 'Out', quantidade: 0 },
  { rotulo: 'Nov', quantidade: 0 },
  { rotulo: 'Dez', quantidade: 0 },
]

const barData = [
  { rotulo: 'Produto A', quantidade: 320 },
  { rotulo: 'Produto B', quantidade: 210 },
  { rotulo: 'Produto C', quantidade: 480 },
  { rotulo: 'Produto D', quantidade: 150 },
]

const pizzaData = [
  { rotulo: 'Mobile', quantidade: 55 },
  { rotulo: 'Desktop', quantidade: 35 },
  { rotulo: 'Tablet', quantidade: 10 },
]
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-3">Playground</h2>
    <p class="text-sm mb-4" style="color:#64748B">Exemplos estáticos dos componentes da NemesisChart.</p>
    <div class="grid">
      <div class="col-12 md:col-6">
        <CardLinhas
          legenda="Faturamento" sublegenda="2026" titulo="R$ 11M" descricao="acumulado no ano"
          tema="light" tipoValor="moeda" corDetalhes="#3B82F6" corDetalhesSecundaria="#8B5CF6" :data="lineSample" />
      </div>
      <div class="col-12 md:col-6">
        <CardLinhas
          legenda="Faturamento" sublegenda="2026" titulo="R$ 11M" descricao="acumulado no ano"
          tema="dark" tipoValor="moeda" corDetalhes="#22D3EE" corDetalhesSecundaria="#A855F7" :data="lineSample" />
      </div>
      <div class="col-12 md:col-6">
        <CardBarra
          legenda="Vendas por produto" sublegenda="trimestre" titulo="1.160" descricao="unidades vendidas"
          tema="light" corDetalhes="#3B82F6" :data="barData" />
      </div>
      <div class="col-12 md:col-6">
        <CardPizza
          legenda="Dispositivos" sublegenda="últimos 30 dias" titulo="100%" descricao="distribuição"
          tipoValor="percentual" :data="pizzaData" />
      </div>
    </div>
  </div>
</template>
