import { Request, Response } from 'express'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import prisma from '../config/prisma'
import { Role } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET!

const generateToken = (id: string, email: string, role: Role) => {
  return jwt.sign({ userId: id, email, role }, JWT_SECRET, { expiresIn: '1d' })
}

export const register = async (req: Request, res: Response) => {
  const { name, email, password, address, role } = req.body
  const errors: string[] = []

  if (!name || name.length < 3) errors.push('Name must be at least 3 characters long')
  if (!password || password.length < 8) errors.push('Password must be at least 8 characters long')
  if (password && !/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter')
  if (password && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must contain at least one special character')

  if (errors.length > 0) return res.status(400).json({ errors })

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) return res.status(400).json({ message: 'User with this email already exists.' })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const userRole = role === 'STORE_OWNER' ? Role.STORE_OWNER : Role.NORMAL_USER

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, address, role: userRole },
      select: { id: true, name: true, email: true, role: true, address: true }
    })

    if (userRole === Role.STORE_OWNER) {
      await prisma.store.create({
        data: {
          name: req.body.storeName || `${user.name}'s Store`,
          email: user.email,
          address: user.address,
          ownerId: user.id
        }
      })
    }

    const token = generateToken(user.id, user.email, user.role)
    res.status(201).json({ ...user, token })
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' })

    const token = generateToken(user.id, user.email, user.role)
    res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role, address: user.address, token })
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.', error })
  }
}
