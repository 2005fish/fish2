import { Router, Request, Response } from 'express'
import db from '../db/database.js'
import { auth, AuthRequest } from '../middleware/auth.js'

const router = Router()

// GET /api/chapters/:id
router.get('/:id', auth, (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id)
  const chapter = db.prepare('SELECT * FROM chapters WHERE id = ?').get(id) as any

  if (!chapter) {
    return res.status(404).json({ message: '章节不存在' })
  }

  // Get novel info for navigation
  const novel = db.prepare('SELECT id, title FROM novels WHERE id = ?').get(chapter.novel_id) as any
  const totalChapters = (db.prepare('SELECT COUNT(*) as c FROM chapters WHERE novel_id = ?').get(chapter.novel_id) as { c: number }).c

  // Get prev/next chapter
  const prevChapter = db.prepare('SELECT id, chapter_number, title FROM chapters WHERE novel_id = ? AND chapter_number = ?').get(chapter.novel_id, chapter.chapter_number - 1)
  const nextChapter = db.prepare('SELECT id, chapter_number, title FROM chapters WHERE novel_id = ? AND chapter_number = ?').get(chapter.novel_id, chapter.chapter_number + 1)

  // Get reading settings if authenticated
  let settings = null
  if (req.userId) {
    settings = db.prepare('SELECT * FROM reading_settings WHERE user_id = ? AND (novel_id = ? OR novel_id IS NULL) ORDER BY novel_id DESC LIMIT 1').get(req.userId, chapter.novel_id)
  }

  res.json({
    chapter,
    novel,
    totalChapters,
    prevChapter,
    nextChapter,
    settings,
  })
})

export default router
