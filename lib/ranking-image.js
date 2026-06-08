// Lógica compartida para generar el PNG del Salón de la Fama.
// La usan los endpoints /api/ranking.png, /api/ranking-money.png, /api/ranking-mobs.png
// (este archivo está fuera de /api, así que Vercel NO lo expone como ruta).

import { ImageResponse } from '@vercel/og'

const API_BASE = 'https://avcback.onrender.com/api'

// Paleta (igual que la web)
const C = {
  bg: '#0a0914',
  card: '#16132a',
  border: '#2a2546',
  gold: '#d4a843',
  goldLight: '#f5d98a',
  text: '#ffffff',
  muted: '#8b86a3',
}

// Categorías -> etiqueta + formato (espejo de la web)
const CATS = {
  kills: { label: 'KILLS', fmt: 'int' },
  money: { label: 'DINERO', fmt: 'money' },
  mobsKilled: { label: 'MOBS', fmt: 'int' },
  blocksBroken: { label: 'MINADO', fmt: 'int' },
  blocksPlaced: { label: 'CONSTRUIDO', fmt: 'int' },
  distanceWalked: { label: 'DISTANCIA', fmt: 'distance' },
  timePlayed: { label: 'TIEMPO', fmt: 'time' },
  kdr: { label: 'KDR', fmt: 'decimal' },
}

// helper para construir el árbol sin JSX (Satori acepta {type, props})
function h(type, props, ...children) {
  return { type, props: { ...(props || {}), children: children.flat() } }
}

function fmtInt(v) {
  return Math.round(Number(v) || 0).toLocaleString('es-ES')
}
function fmtValue(v, fmt) {
  const n = Number(v) || 0
  switch (fmt) {
    case 'money':
      return '$' + fmtInt(n)
    case 'decimal':
      return n.toFixed(2)
    case 'distance':
      return n >= 1000 ? (n / 1000).toFixed(1) + ' km' : fmtInt(n) + ' bloques'
    case 'time': {
      const min = Math.floor(n / 60)
      const hh = Math.floor(min / 60)
      const mm = min % 60
      return hh > 0 ? `${hh}h ${mm}m` : `${mm}m`
    }
    default:
      return fmtInt(n)
  }
}

// fuentes (truco UA antiguo para que Google sirva TTF, no woff2)
let _fonts
async function getFonts() {
  if (_fonts) return _fonts
  const UA = 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko'
  async function load(weight) {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}`,
      { headers: { 'User-Agent': UA } }
    ).then((r) => r.text())
    const url = css.match(/src:\s*url\((.+?)\)/)[1]
    return fetch(url).then((r) => r.arrayBuffer())
  }
  const [regular, bold] = await Promise.all([load(400), load(800)])
  _fonts = [
    { name: 'Inter', data: regular, weight: 400, style: 'normal' },
    { name: 'Inter', data: bold, weight: 800, style: 'normal' },
  ]
  return _fonts
}

async function getData(cat, limit) {
  const url = `${API_BASE}/rankings?category=${encodeURIComponent(cat)}&limit=${limit}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('backend ' + res.status)
  const data = await res.json()
  return Array.isArray(data?.players) ? data.players : []
}

function avatarUrl(p) {
  const id = p.uuid || p.playerName || 'steve'
  return `https://mc-heads.net/avatar/${id}/48`
}

function row(p, cat, top) {
  const value = fmtValue(p[cat], CATS[cat].fmt)
  const rank = p.rank || top
  const isFirst = rank === 1
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '8px 12px',
        marginBottom: 6,
        borderRadius: 10,
        background: isFirst ? 'rgba(212,168,67,0.16)' : C.card,
        border: `1px solid ${isFirst ? C.gold : C.border}`,
      },
    },
    h('div', { style: { display: 'flex', width: 30, fontSize: 22, fontWeight: 800, color: isFirst ? C.gold : C.muted } }, String(rank)),
    h('img', { src: avatarUrl(p), width: 38, height: 38, style: { borderRadius: 8, marginRight: 10 } }),
    h('div', { style: { display: 'flex', flex: 1, fontSize: 22, fontWeight: 700, color: C.text, overflow: 'hidden' } }, p.playerName || '—'),
    h('div', { style: { display: 'flex', fontSize: 22, fontWeight: 800, color: C.gold } }, value)
  )
}

// Genera la imagen. forcedCat fija la categoría (ignora ?cat=).
export async function renderRanking(req, forcedCat) {
  const { searchParams } = new URL(req.url)
  const qCat = searchParams.get('cat')
  const cat = forcedCat || (CATS[qCat] ? qCat : 'kills')
  const width = Math.min(1024, Math.max(256, parseInt(searchParams.get('w')) || 512))
  const height = Math.min(1024, Math.max(256, parseInt(searchParams.get('h')) || 512))
  const limit = Math.min(12, Math.max(1, parseInt(searchParams.get('limit')) || 6))

  let players = []
  let error = null
  try {
    players = (await getData(cat, limit)).slice(0, limit)
  } catch (e) {
    error = e.message
  }

  const fonts = await getFonts()

  const stateMsg = (txt) =>
    h('div', { style: { display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: 22 } }, txt)

  const body = error
    ? stateMsg('Ranking no disponible ahora mismo')
    : players.length === 0
    ? stateMsg('Aun no hay estadisticas')
    : h('div', { style: { display: 'flex', flexDirection: 'column', width: '100%' } }, ...players.map((p, i) => row(p, cat, i + 1)))

  const tree = h(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: `linear-gradient(160deg, ${C.bg}, #050410)`,
        padding: 18,
        border: `3px solid ${C.gold}`,
        fontFamily: 'Inter',
      },
    },
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 14 } },
      h('div', { style: { display: 'flex', fontSize: 13, letterSpacing: 3, color: C.muted } }, 'SALON DE LA FAMA'),
      h('div', { style: { display: 'flex', fontSize: 34, fontWeight: 800, color: C.gold } }, `TOP ${CATS[cat].label}`)
    ),
    body,
    h(
      'div',
      { style: { display: 'flex', marginTop: 'auto', paddingTop: 10, justifyContent: 'center', fontSize: 16, fontWeight: 800, color: C.goldLight } },
      'avclatin.com'
    )
  )

  return new ImageResponse(tree, {
    width,
    height,
    fonts,
    headers: {
      // 'no-transform' evita que el CDN recomprima el PNG (rompe ImageFrame/ImageIO).
      'Cache-Control': 'public, no-transform, max-age=0, s-maxage=60, stale-while-revalidate=120',
      'Content-Type': 'image/png',
    },
  })
}
