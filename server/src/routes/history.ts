import { Router, Response } from 'express'
import db from '../db/database.js'
import { requireAuth, AuthRequest } from '../middleware/auth.js'

const router = Router()

// GET /api/history
router.get('/', requireAuth, (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1
  const pageSize = Number(req.query.pageSize) || 20

  const { total } = db.prepare('SELECT COUNT(*) as total FROM reading_history WHERE user_id = ?').get(req.userId!) as { total: number }
  const offset = (page - 1) * pageSize

  const data = db.prepare(`
    SELECT h.*, n.title, n.author, n.cover_url
    FROM reading_history h
    JOIN novels n ON n.id = h.novel_id
    WHERE h.user_id = ?
    ORDER BY h.read_at DESC
    LIMIT ? OFFSET ?
  `).all(req.userId!, pageSize, offset)

  res.json({ data, page, pageSize, total, totalPages: Math.ceil(total / pageSize) })
})

// POST /api/history
router.post('/', requireAuth, (req: AuthRequest, res: Response) => {
  const { novel_id, chapter_id, chapter_number, progress } = req.body
  if (!novel_id) {
    return res.status(400).json({ message: '缺少参数' })
  }

  // Upsert: delete existing then insert
  db.prepare('DELETE FROM reading_history WHERE user_id = ? AND novel_id = ?').run(req.userId!, novel_id)
  db.prepare('INSERT INTO reading_history (user_id, novel_id, chapter_id, chapter_number, progress) VALUES (?, ?, ?, ?, ?)').run(
    req.userId!, novel_id, chapter_id || null, chapter_number || 1, progress || 0
  )

  res.json({ message: 'ok' })
})

export default router
