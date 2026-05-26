import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export interface AuthRequest extends Request {
  userId?: number
}

export function auth(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    req.userId = undefined
    return next()
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { userId: number }
    req.userId = payload.userId
  } catch {
    // Token invalid, continue without auth
  }
  next()
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ message: '请先登录' })
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { userId: number }
    req.userId = payload.userId
    next()
  } catch {
    return res.status(401).json({ message: '登录已过期，请重新登录' })
  }
}
