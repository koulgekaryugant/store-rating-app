import { Request, Response } from 'express'
import * as bcrypt from 'bcryptjs'
import prisma from '../config/prisma'
import { Role } from '@prisma/client'

export const getDashboardStats = async (req: Request, res: Response) => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count()
  ])
  res.status(200).json({ totalUsers, totalStores, totalRatings })
}

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, address, role } = req.body
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) return res.status(400).json({ message: `User with email ${email} already exists.` })
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, address, role: role as Role },
    select: { id: true, name: true, email: true, role: true, address: true }
  })
  res.status(201).json({ user, message: 'User created successfully.' })
}

export const createStore = async (req: Request, res: Response) => {
  const { name, email, address, ownerId } = req.body
  const owner = await prisma.user.findUnique({ where: { id: ownerId } })
  if (!owner || owner.role !== Role.STORE_OWNER) return res.status(404).json({ message: 'Owner not found or not STORE_OWNER' })
  const existingStore = await prisma.store.findUnique({ where: { ownerId } })
  if (existingStore) return res.status(400).json({ message: 'This owner already has a store registered.' })
  const store = await prisma.store.create({ data: { name, email, address, ownerId } })
  res.status(201).json({ store, message: 'Store created successfully.' })
}

export const getAllUsers = async (req: Request, res: Response) => {
  const { name, email, address, role } = req.query
  const where: any = {}
  if (name) where.name = { contains: name, mode: 'insensitive' }
  if (email) where.email = { contains: email, mode: 'insensitive' }
  if (address) where.address = { contains: address, mode: 'insensitive' }
  if (role) where.role = role as Role
  const users = await prisma.user.findMany({
    where,
    include: { ownedStore: { select: { ratings: { select: { ratingValue: true } } } } }
  })
  const usersWithRating = users.map(u => {
    let avgRating = null
    if (u.role === Role.STORE_OWNER && u.ownedStore) {
      const ratings = u.ownedStore.ratings
      if (ratings.length) avgRating = parseFloat((ratings.reduce((sum, r) => sum + r.ratingValue, 0) / ratings.length).toFixed(2))
    }
    const { ownedStore, ...userData } = u
    return { ...userData, averageStoreRating: avgRating }
  })
  res.status(200).json(usersWithRating)
}

export const getAllStores = async (req: Request, res: Response) => {
  const { name, email, address } = req.query
  const where: any = {}
  if (name) where.name = { contains: name, mode: 'insensitive' }
  if (email) where.email = { contains: email, mode: 'insensitive' }
  if (address) where.address = { contains: address, mode: 'insensitive' }
  const stores = await prisma.store.findMany({ where, include: { ratings: { select: { ratingValue: true } } } })
  const storesWithRating = stores.map(s => {
    const ratings = s.ratings
    let avgRating = null
    if (ratings.length) avgRating = parseFloat((ratings.reduce((sum, r) => sum + r.ratingValue, 0) / ratings.length).toFixed(2))
    const { ratings: _, ...storeData } = s
    return { ...storeData, overallRating: avgRating, totalRatings: ratings.length }
  })
  res.status(200).json(storesWithRating)
}
