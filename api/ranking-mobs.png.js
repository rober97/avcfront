// /api/ranking-mobs.png  -> top de MOBS cazados (categoría fija)
import { renderRanking } from '../lib/ranking-image.js'

export const config = { runtime: 'edge' }

export default function handler(req) {
  return renderRanking(req, 'mobsKilled')
}
