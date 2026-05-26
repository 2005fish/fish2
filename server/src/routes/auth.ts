import { Router, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db/database.js'
import { config } from '../config.js'
import { requireAuth, AuthRequest } from '../middleware/auth.js'

const router = Router()

function signToken(userId: number): string {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '30d' })
}

// POST /api/auth/register
router.post('/register', (req: AuthRequest, res: Response) => {
  const { username, password, nickname } = req.body
  if (!username || !password || !nickname) {
    return res.status(400).json({ message: '请填写完整信息' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: '密码至少6位' })
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
  if (existing) {
    return res.status(400).json({ message: '用户名已存在' })
  }

  const hash = bcrypt.hashSync(password, 10)
  const result = db.prepare('INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)').run(username, hash, nickname)
  const userId = result.lastInsertRowid as number

  // Create default reading settings
  db.prepare('INSERT INTO reading_settings (user_id) VALUES (?)').run(userId)

  const token = signToken(userId)
  const user = db.prepare('SELECT id, username, nickname, avatar, gender, created_at FROM users WHERE id = ?').get(userId)

  res.json({ token, user })
})

// POST /api/auth/login
router.post('/login', (req: AuthRequest, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: '请输入用户名和密码' })
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: '用户名或密码错误' })
  }

  const token = signToken(user.id)
  const { password: _, ...safeUser } = user

  res.json({ token, user: safeUser })
})

// GET /api/auth/profile
router.get('/profile', requireAuth, (req: AuthRequest, res: Response) => {
  const user = db.prepare('SELECT id, username, nickname, avatar, gender, created_at FROM users WHERE id = ?').get(req.userId!)
  if (!user) {
    return res.status(404).json({ message: '用户不存在' })
  }
  res.json(user)
})

export default router
