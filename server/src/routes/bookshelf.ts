import { Router, Response } from 'express'
import db from '../db/database.js'
import { requireAuth, AuthRequest } from '../middleware/auth.js'

const router = Router()

// GET /api/bookshelf
router.get('/', requireAuth, (req: AuthRequest, res: Response) => {
  const data = db.prepare(`
    SELECT b.*, n.title, n.author, n.cover_url, n.status, n.total_words,
           h.chapter_number as last_chapter, h.progress as last_progress
    FROM bookshelf b
    JOIN novels n ON n.id = b.novel_id
    LEFT JOIN reading_history h ON h.user_id = b.user_id AND h.novel_id = b.novel_id
    WHERE b.user_id = ?
    ORDER BY b.added_at DESC
  `).all(req.userId!)

  res.json(data)
})

// POST /api/bookshelf
router.post('/', requireAuth, (req: AuthRequest, res: Response) => {
  const { novel_id } = req.body
  if (!novel_id) {
    return res.status(400).json({ message: '缺少小说ID' })
  }

  const novel = db.prepare('SELECT id FROM novels WHERE id = ?').get(novel_id)
  if (!novel) {
    return res.status(404).json({ message: '小说不存在' })
  }

  try {
    db.prepare('INSERT INTO bookshelf (user_id, novel_id) VALUES (?, ?)').run(req.userId!, novel_id)
    res.json({ message: '已加入书架' })
  } catch {
    return res.status(400).json({ message: '已在书架中' })
  }
})

// DELETE /api/bookshelf/:novelId
router.delete('/:novelId', requireAuth, (req: AuthRequest, res: Response) => {
  const novelId = Number(req.params.novelId)
  db.prepare('DELETE FROM bookshelf WHERE user_id = ? AND novel_id = ?').run(req.userId!, novelId)
  res.json({ message: '已移出书架' })
})

// GET /api/bookshelf/check/:novelId
router.get('/check/:novelId', requireAuth, (req: AuthRequest, res: Response) => {
  const novelId = Number(req.params.novelId)
  const item = db.prepare('SELECT id FROM bookshelf WHERE user_id = ? AND novel_id = ?').get(req.userId!, novelId)
  res.json({ inBookshelf: !!item })
})

export default router
