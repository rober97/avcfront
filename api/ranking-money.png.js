// /api/ranking-money.png  -> top de DINERO (categoría fija)
import { renderRanking } from '../lib/ranking-image.js'

export const config = { runtime: 'edge' }

export default function handler(req) {
  return renderRanking(req, 'money')
}
