function copiarEstilos(origem, destino) {
  const cs = window.getComputedStyle(origem)
  let css = ''
  for (let i = 0; i < cs.length; i++) {
    const prop = cs[i]
    let valor = cs.getPropertyValue(prop)
    if (valor && valor.indexOf('url(') !== -1 && !/url\(["']?data:/.test(valor)) {
      if (prop === 'background-image' || prop === 'background' || prop === 'mask-image' || prop === 'border-image' || prop === 'border-image-source') {
        valor = 'none'
      } else {
        continue
      }
    }
    css += `${prop}:${valor};`
  }
  destino.setAttribute('style', css)
}

function inlinearEstilos(origem, destino) {
  copiarEstilos(origem, destino)
  const filhosO = origem.querySelectorAll('*')
  const filhosD = destino.querySelectorAll('*')
  for (let i = 0; i < filhosO.length; i++) {
    if (filhosD[i]) copiarEstilos(filhosO[i], filhosD[i])
  }
}

function substituirCanvases(origem, destino) {
  const cO = origem.querySelectorAll('canvas')
  const cD = destino.querySelectorAll('canvas')
  cO.forEach((c, i) => {
    if (!cD[i]) return
    const img = document.createElement('img')
    try {
      img.src = c.toDataURL('image/png')
    } catch (_) {
      return
    }
    const rect = c.getBoundingClientRect()
    img.setAttribute('style', `width:${rect.width}px;height:${rect.height}px;display:block;`)
    cD[i].replaceWith(img)
  })
}

export async function exportarElementoComoImagem(elemento, opcoes = {}) {
  if (!elemento) return
  const {
    nomeArquivo = 'componente.png',
    escala = 2,
    corFundo = null,
  } = opcoes

  const rect = elemento.getBoundingClientRect()
  const largura = Math.ceil(rect.width)
  const altura = Math.ceil(rect.height)

  const clone = elemento.cloneNode(true)
  inlinearEstilos(elemento, clone)
  substituirCanvases(elemento, clone)

  clone.style.margin = '0'
  clone.style.transform = 'none'

  const serializado = new XMLSerializer().serializeToString(clone)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}">` +
      `<foreignObject width="100%" height="100%">` +
        `<div xmlns="http://www.w3.org/1999/xhtml" style="width:${largura}px;height:${altura}px;">` +
          serializado +
        `</div>` +
      `</foreignObject>` +
    `</svg>`

  const svgBase64 = typeof window !== 'undefined' && window.btoa
    ? window.btoa(unescape(encodeURIComponent(svg)))
    : ''
  const url = 'data:image/svg+xml;base64,' + svgBase64

  const img = new Image()
  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    img.src = url
  })

  const canvas = document.createElement('canvas')
  canvas.width = largura * escala
  canvas.height = altura * escala
  const ctx = canvas.getContext('2d')
  ctx.scale(escala, escala)
  if (corFundo) {
    ctx.fillStyle = corFundo
    ctx.fillRect(0, 0, largura, altura)
  }
  ctx.drawImage(img, 0, 0)

  let dataUrl
  try {
    dataUrl = canvas.toDataURL('image/png')
  } catch (e) {
    console.error('Falha ao exportar imagem: canvas contaminado.', e)
    return
  }

  const link = document.createElement('a')
  link.download = nomeArquivo
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const ICONE_EXPORTAR_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
