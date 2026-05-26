import { Router, Request, Response } from 'express'
import db from '../db/database.js'

const router = Router()

// GET /api/search
router.get('/', (req: Request, res: Response) => {
  const q = (req.query.q as string) || ''
  const page = Number(req.query.page) || 1
  const pageSize = Number(req.query.pageSize) || 12

  if (!q.trim()) {
    // Return hot search tags
    const hotTags = db.prepare('SELECT tag_name, COUNT(*) as cnt FROM novel_tags GROUP BY tag_name ORDER BY cnt DESC LIMIT 10').all()
    return res.json({ type: 'tags', data: hotTags })
  }

  const searchTerm = `%${q}%`
  const { total } = db.prepare(`
    SELECT COUNT(*) as total FROM novels
    WHERE title LIKE ? OR author LIKE ? OR summary LIKE ?
  `).get(searchTerm, searchTerm, searchTerm) as { total: number }

  const offset = (page - 1) * pageSize
  const data = db.prepare(`
    SELECT n.*, c.name as category_name FROM novels n
    JOIN categories c ON n.category_id = c.id
    WHERE n.title LIKE ? OR n.author LIKE ? OR n.summary LIKE ?
    ORDER BY n.read_count DESC
    LIMIT ? OFFSET ?
  `).all(searchTerm, searchTerm, searchTerm, pageSize, offset)

  res.json({
    type: 'results',
    data,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
    q,
  })
})

export default router
