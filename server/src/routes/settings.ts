import { Router, Response } from 'express'
import db from '../db/database.js'
import { requireAuth, AuthRequest } from '../middleware/auth.js'

const router = Router()

// GET /api/settings/reading
router.get('/reading', requireAuth, (req: AuthRequest, res: Response) => {
  const novelId = req.query.novel_id ? Number(req.query.novel_id) : null

  let settings
  if (novelId) {
    settings = db.prepare('SELECT * FROM reading_settings WHERE user_id = ? AND novel_id = ?').get(req.userId!, novelId)
    if (!settings) {
      settings = db.prepare('SELECT * FROM reading_settings WHERE user_id = ? AND novel_id IS NULL').get(req.userId!)
    }
  } else {
    settings = db.prepare('SELECT * FROM reading_settings WHERE user_id = ? AND novel_id IS NULL').get(req.userId!)
  }

  res.json(settings || { font_size: 18, line_height: 1.8, theme: 'day', page_mode: 'scroll' })
})

// PUT /api/settings/reading
router.put('/reading', requireAuth, (req: AuthRequest, res: Response) => {
  const { novel_id, font_size, line_height, theme, page_mode } = req.body

  const existing = db.prepare('SELECT id FROM reading_settings WHERE user_id = ? AND novel_id IS ?').get(
    req.userId!, novel_id || null
  )

  if (existing) {
    db.prepare('UPDATE reading_settings SET font_size=?, line_height=?, theme=?, page_mode=? WHERE id=?').run(
      font_size, line_height, theme, page_mode, (existing as any).id
    )
  } else {
    db.prepare('INSERT INTO reading_settings (user_id, novel_id, font_size, line_height, theme, page_mode) VALUES (?,?,?,?,?,?)').run(
      req.userId!, novel_id || null, font_size, line_height, theme, page_mode
    )
  }

  res.json({ message: 'ok' })
})

export default router
