<script setup>
import { CardLinhas, CardBarra, CardPizza, CardPolar, CardProgresso } from '../lib'

const exemploLinhas = [
  { rotulo: 'Jan', quantidade: 1200 }, { rotulo: 'Fev', quantidade: 2800 },
  { rotulo: 'Mar', quantidade: 3200 }, { rotulo: 'Abr', quantidade: 3500 },
]
const exemploBarra = [
  { rotulo: 'A', quantidade: 320 }, { rotulo: 'B', quantidade: 210 }, { rotulo: 'C', quantidade: 480 },
]
const exemploPizza = [
  { rotulo: 'Mobile', quantidade: 55 }, { rotulo: 'Desktop', quantidade: 35 }, { rotulo: 'Tablet', quantidade: 10 },
]
const exemploPolar = [
  { rotulo: 'Vendas', quantidade: 4200 }, { rotulo: 'Serviços', quantidade: 3100 }, { rotulo: 'Suporte', quantidade: 1250 },
]
const exemploProgresso = [
  { rotulo: 'Vendas', quantidade: 72, meta: 100 }, { rotulo: 'Serviços', quantidade: 48, meta: 80 },
]
</script>

<template>
  <div class="docs">
    <h2 class="text-2xl font-bold mb-1">Documentação</h2>
    <p class="text-sm mb-4" style="color:#64748B">Componentes Vue 3 para charts construídos sobre Chart.js — sem dependências de UI externas.</p>

    <section class="docs__section">
      <h3>Instalação</h3>
      <pre><code>npm install nemesischart chart.js</code></pre>
      <h4>Registro como plugin</h4>
      <pre><code>import { createApp } from 'vue'
import NemesisChart from 'nemesischart'
import 'nemesischart/style.css'

createApp(App)
  .use(NemesisChart)
  .mount('#app')</code></pre>

      <h4>Importação pontual</h4>
      <pre><code>import { CardLinhas, CardBarra, CardPizza } from 'nemesischart'</code></pre>
    </section>

    <section class="docs__section">
      <h3>Formato de dados</h3>
      <p>Todos os cards aceitam <code>data</code> no formato:</p>
      <pre><code>[{ rotulo: 'Jan', quantidade: 1200 }, { rotulo: 'Fev', quantidade: 2800 }]</code></pre>
      <p>Para <code>CardProgresso</code> cada item pode opcionalmente incluir <code>meta</code>. Para múltiplas séries em <code>CardLinhas</code>/<code>CardBarra</code>, use a prop <code>series</code>.</p>
    </section>

    <section class="docs__section">
      <h3>Props comuns</h3>
      <div class="docs__table-wrap">
      <table class="docs__table">
        <thead><tr><th>Prop</th><th>Tipo</th><th>Padrão</th><th>Descrição</th></tr></thead>
        <tbody>
          <tr><td><code>legenda</code></td><td>String</td><td>—</td><td>Título superior do card</td></tr>
          <tr><td><code>sublegenda</code></td><td>String</td><td>—</td><td>Texto auxiliar abaixo da legenda</td></tr>
          <tr><td><code>titulo</code></td><td>String</td><td>—</td><td>Valor de destaque</td></tr>
          <tr><td><code>descricao</code></td><td>String</td><td>—</td><td>Texto complementar do título</td></tr>
          <tr><td><code>tema</code></td><td>'light' | 'dark'</td><td>'light'</td><td>Paleta base do card</td></tr>
          <tr><td><code>corFundo</code></td><td>String</td><td>—</td><td>Sobrescreve a cor de fundo</td></tr>
          <tr><td><code>corTexto</code></td><td>String</td><td>—</td><td>Sobrescreve a cor do texto</td></tr>
          <tr><td><code>corBorda</code></td><td>String</td><td>#EAE8E8</td><td>Cor da borda externa</td></tr>
          <tr><td><code>corDetalhes</code></td><td>String</td><td>#3B82F6</td><td>Cor principal do gráfico</td></tr>
          <tr><td><code>borderRadius</code></td><td>String/Number</td><td>1rem</td><td>Raio da borda</td></tr>
          <tr><td><code>sombra</code></td><td>String</td><td>box-shadow padrão</td><td>Sombra do card</td></tr>
          <tr><td><code>tipoValor</code></td><td>'numero' | 'moeda' | 'percentual'</td><td>'numero'</td><td>Formatação dos valores</td></tr>
          <tr><td><code>locale</code></td><td>String</td><td>'pt-BR'</td><td>Locale do formatador</td></tr>
          <tr><td><code>moeda</code></td><td>String</td><td>'BRL'</td><td>Código ISO da moeda</td></tr>
          <tr><td><code>height</code></td><td>Number/String</td><td>varia</td><td>Altura do gráfico interno</td></tr>
          <tr><td><code>direcao</code></td><td>'top' | 'bottom' | 'left' | 'right'</td><td>'top'</td><td>Disposição do header em relação ao gráfico</td></tr>
          <tr><td><code>botaoVisivel</code></td><td>Boolean</td><td>false</td><td>Exibe botão "Ver mais"</td></tr>
          <tr><td><code>textoBotao</code></td><td>String</td><td>'Ver mais'</td><td>Texto do botão</td></tr>
          <tr><td><code>exportar</code></td><td>Boolean</td><td>false</td><td>Exibe botão de exportar imagem</td></tr>
          <tr><td><code>nomeArquivoExport</code></td><td>String</td><td>varia</td><td>Nome do arquivo PNG ao exportar</td></tr>
          <tr><td><code>data</code></td><td>Array</td><td>amostra</td><td>Dados <code>[{ rotulo, quantidade }]</code></td></tr>
        </tbody>
      </table>
      </div>
      <p class="docs__note">Eventos: todos os cards emitem <code>botaoAcao</code> (clique no botão de ação) e <code>exportado</code> (quando a exportação como PNG conclui). Slots: <code>legenda</code>, <code>sublegenda</code>, <code>titulo</code>, <code>descricao</code>, <code>actions</code>, <code>footer</code>.</p>
    </section>

    <section class="docs__section">
      <h3>CardLinhas</h3>
      <p>Gráfico de linhas com gradiente. Aceita <code>corDetalhes</code> e <code>corDetalhesSecundaria</code> (para gradiente combinado).</p>
      <div class="docs__demo">
        <CardLinhas legenda="Faturamento" sublegenda="2026" titulo="R$ 11M" descricao="acumulado" tipoValor="moeda" :data="exemploLinhas" />
      </div>
      <pre><code>&lt;CardLinhas
  legenda="Faturamento"
  titulo="R$ 11M"
  tipoValor="moeda"
  corDetalhes="#3B82F6"
  :data="dados" /&gt;</code></pre>
    </section>

    <section class="docs__section">
      <h3>CardBarra</h3>
      <p>Barras verticais ou horizontais. Props específicas: <code>orientacao</code> ('vertical' | 'horizontal'), <code>empilhado</code>, <code>series</code>, <code>cores</code>, <code>mostrarLegendaSeries</code>.</p>
      <div class="docs__demo">
        <CardBarra legenda="Vendas" titulo="1.010" corDetalhes="#10B981" :data="exemploBarra" />
      </div>
    </section>

    <section class="docs__section">
      <h3>CardPizza</h3>
      <p>Gráfico doughnut. Props específicas: <code>cutout</code> (tamanho do furo, ex.: <code>'70%'</code>), <code>rotuloCategoria</code>, <code>rotuloQuantidade</code>, <code>itensClicaveis</code>. A paleta das fatias é gerada a partir de <code>corDetalhes</code>; cada item pode sobrescrever com <code>cor</code>.</p>
      <div class="docs__demo">
        <CardPizza legenda="Dispositivos" titulo="100%" tipoValor="percentual" :data="exemploPizza" />
      </div>
    </section>

    <section class="docs__section">
      <h3>CardPolar</h3>
      <p>Gráfico polar area. Props específicas: <code>mostrarLinhasGrade</code>, <code>itensClicaveis</code>. A paleta segue a mesma regra do CardPizza (<code>corDetalhes</code> + <code>cor</code> por item).</p>
      <div class="docs__demo">
        <CardPolar legenda="Receita" titulo="R$ 11k" tipoValor="moeda" :data="exemploPolar" />
      </div>
    </section>

    <section class="docs__section">
      <h3>CardProgresso</h3>
      <p>Barras de progresso (linear ou circular). Props específicas: <code>formato</code> ('linear' | 'circular'), <code>metaPadrao</code>, <code>mostrarValor</code>, <code>mostrarPercentual</code>, <code>alturaBarra</code>, <code>raioBarra</code>.</p>
      <div class="docs__demo">
        <CardProgresso legenda="Metas" titulo="72%" tipoValor="percentual" :data="exemploProgresso" />
      </div>
    </section>

    <section class="docs__section">
      <h3>Componentes base</h3>
      <p><code>CardBase</code> oferece apenas o esqueleto (legendas, título, descrição, ação, slot footer) — útil para criar visualizações customizadas. <code>ChartBase</code> encapsula uma instância Chart.js, recebendo <code>type</code>, <code>data</code>, <code>options</code> e <code>height</code>.</p>
    </section>
  </div>
</template>

<style scoped>
.docs { max-width: 980px; }
.docs__section { margin-bottom: 2rem; }
.docs__section h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.5rem; color: #0F172A; }
.docs__section h4 { font-size: 0.95rem; font-weight: 600; margin: 1rem 0 0.4rem; color: #0F172A; }
.docs__section p { font-size: 0.9rem; line-height: 1.55; color: #334155; margin: 0 0 0.6rem; }
.docs__section code {
  background: #F1F5F9; padding: 0.1rem 0.35rem; border-radius: 4px;
  font-size: 0.82rem; color: #0F172A; font-family: 'JetBrains Mono', ui-monospace, monospace;
}
.docs__section pre {
  background: #0F172A; color: #E2E8F0; padding: 0.9rem 1rem; border-radius: 8px;
  font-size: 0.8rem; line-height: 1.5; overflow-x: auto; margin: 0 0 0.8rem;
}
.docs__section pre code { background: transparent; color: inherit; padding: 0; }
.docs__table { width: 100%; border-collapse: collapse; font-size: 0.82rem; margin-bottom: 0.5rem; }
.docs__table th, .docs__table td {
  border-bottom: 1px solid #E2E8F0; padding: 0.5rem 0.7rem; text-align: left; vertical-align: top;
}
.docs__table th { background: #F8FAFC; font-weight: 600; color: #475569; }
.docs__note { font-size: 0.82rem; color: #475569; background: #F8FAFC; padding: 0.7rem 0.9rem; border-radius: 8px; border-left: 3px solid #3B82F6; }
.docs__demo { margin: 0.6rem 0 1rem; max-width: 520px; }
.docs__table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; margin-bottom: 0.5rem; }
.docs__table { min-width: 560px; }

@media (max-width: 640px) {
  .docs__demo { max-width: 100%; }
  .docs__section pre { font-size: 0.75rem; padding: 0.7rem 0.8rem; }
  .docs__section h3 { font-size: 1.1rem; }
}
</style>
