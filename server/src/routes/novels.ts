import { Router, Request, Response } from 'express'
import db from '../db/database.js'

const router = Router()

// GET /api/recommend
router.get('/recommend', (_req: Request, res: Response) => {
  const banners = db.prepare('SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order').all()
  const hotNovels = db.prepare('SELECT * FROM novels ORDER BY read_count DESC LIMIT 6').all()
  const newNovels = db.prepare('SELECT * FROM novels ORDER BY created_at DESC LIMIT 9').all()
  const completedNovels = db.prepare('SELECT * FROM novels WHERE status = 1 ORDER BY rating DESC LIMIT 6').all()
  const hotCategories = db.prepare('SELECT * FROM categories ORDER BY sort_order LIMIT 8').all()
  const categoryPicks = db.prepare(`
    SELECT n.*, c.name as category_name FROM novels n
    JOIN categories c ON n.category_id = c.id
    WHERE n.id IN (SELECT MIN(id) FROM novels GROUP BY category_id)
    LIMIT 6
  `).all()

  res.json({ banners, hotNovels, newNovels, completedNovels, hotCategories, categoryPicks })
})

// GET /api/novels
router.get('/novels', (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const pageSize = Number(req.query.pageSize) || 12
  const categoryId = req.query.category_id ? Number(req.query.category_id) : undefined
  const status = req.query.status !== undefined ? Number(req.query.status) : undefined
  const sort = (req.query.sort as string) || 'popular'

  let where = 'WHERE 1=1'
  const params: any[] = []

  if (categoryId) {
    where += ' AND n.category_id = ?'
    params.push(categoryId)
  }
  if (status !== undefined) {
    where += ' AND n.status = ?'
    params.push(status)
  }

  let orderBy = 'ORDER BY n.read_count DESC'
  if (sort === 'latest') orderBy = 'ORDER BY n.created_at DESC'
  if (sort === 'rating') orderBy = 'ORDER BY n.rating DESC'

  const { total } = db.prepare(`SELECT COUNT(*) as total FROM novels n ${where}`).get(...params) as { total: number }
  const offset = (page - 1) * pageSize
  params.push(pageSize, offset)
  const data = db.prepare(`SELECT n.*, c.name as category_name FROM novels n JOIN categories c ON n.category_id = c.id ${where} ${orderBy} LIMIT ? OFFSET ?`).all(...params)

  res.json({ data, page, pageSize, total, totalPages: Math.ceil(total / pageSize) })
})

// GET /api/novels/:id
router.get('/novels/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const novel = db.prepare('SELECT n.*, c.name as category_name FROM novels n JOIN categories c ON n.category_id = c.id WHERE n.id = ?').get(id)
  if (!novel) return res.status(404).json({ message: '小说不存在' })

  const tags = db.prepare('SELECT tag_name FROM novel_tags WHERE novel_id = ?').all(id) as { tag_name: string }[]
  const { c: chapterCount } = db.prepare('SELECT COUNT(*) as c FROM chapters WHERE novel_id = ?').get(id) as { c: number }
  const latestChapter = db.prepare('SELECT chapter_number, title FROM chapters WHERE novel_id = ? ORDER BY chapter_number DESC LIMIT 1').get(id)

  res.json({ ...(novel as any), tags: tags.map(t => t.tag_name), chapterCount, latestChapter })
})

// GET /api/novels/:id/chapters
router.get('/novels/:id/chapters', (req: Request, res: Response) => {
  const novelId = Number(req.params.id)
  const page = Number(req.query.page) || 1
  const pageSize = Number(req.query.pageSize) || 50

  const { total } = db.prepare('SELECT COUNT(*) as total FROM chapters WHERE novel_id = ?').get(novelId) as { total: number }
  const offset = (page - 1) * pageSize
  const data = db.prepare('SELECT id, novel_id, chapter_number, title, word_count, is_free, created_at FROM chapters WHERE novel_id = ? ORDER BY chapter_number ASC LIMIT ? OFFSET ?').all(novelId, pageSize, offset)

  res.json({ data, page, pageSize, total, totalPages: Math.ceil(total / pageSize) })
})

// GET /api/categories
router.get('/categories', (_req: Request, res: Response) => {
  const categories = db.prepare('SELECT c.*, COUNT(n.id) as novel_count FROM categories c LEFT JOIN novels n ON n.category_id = c.id GROUP BY c.id ORDER BY c.sort_order').all()
  res.json(categories)
})

// GET /api/banners
router.get('/banners', (_req: Request, res: Response) => {
  const banners = db.prepare('SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order').all()
  res.json(banners)
})

export default router
