import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Role } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET!

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: Role }
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer')) return res.status(401).json({ message: 'No token' })
  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: Role }
    req.user = { id: decoded.userId, email: decoded.email, role: decoded.role }
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

export const authorize = (roles: Role[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' })
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Not authorized' })
  next()
}