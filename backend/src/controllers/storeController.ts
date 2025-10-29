import { Response } from 'express'
import prisma from '../config/prisma'
import { AuthRequest } from '../middlewares/authMiddleware'

export const listStoresForUser = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id
  const { name, address } = req.query
  const where: any = {}
  if (name) where.name = { contains: name, mode: 'insensitive' }
  if (address) where.address = { contains: address, mode: 'insensitive' }
  try {
    const stores = await prisma.store.findMany({
      where,
      include: { ratings: { select: { ratingValue: true, userId: true } } },
      orderBy: { name: 'asc' }
    })
    const storeList = stores.map(store => {
      const allRatings = store.ratings
      const userRating = allRatings.find(r => r.userId === userId)?.ratingValue || null
      let overallRating = null
      if (allRatings.length > 0) {
        const total = allRatings.reduce((sum, r) => sum + r.ratingValue, 0)
        overallRating = parseFloat((total / allRatings.length).toFixed(2))
      }
      const { ratings: _, ...storeData } = store
      return { ...storeData, overallRating, userSubmittedRating: userRating }
    })
    res.status(200).json(storeList)
  } catch (error) {
    res.status(500).json({ message: 'Server error listing stores.', error })
  }
}

export const submitRating = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id
  const { storeId } = req.params
  const { ratingValue } = req.body
  if (ratingValue < 1 || ratingValue > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5.' })
  try {
    const storeExists = await prisma.store.findUnique({ where: { id: storeId } })
    if (!storeExists) return res.status(404).json({ message: 'Store not found.' })
    const rating = await prisma.rating.upsert({
      where: { userId_storeId: { userId, storeId } },
      update: { ratingValue },
      create: { userId, storeId, ratingValue }
    })
    res.status(200).json({ message: 'Rating submitted successfully.', rating })
  } catch (error: any) {
    res.status(500).json({ message: 'Server error submitting rating.', error: error.message })
  }
}

export const getOwnerDashboard = async (req: AuthRequest, res: Response) => {
  const ownerId = req.user!.id
  try {
    const store = await prisma.store.findUnique({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        ratings: {
          select: {
            ratingValue: true,
            createdAt: true,
            user: { select: { name: true, email: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    if (!store) {
      const user = await prisma.user.findUnique({ where: { id: ownerId } })
      await prisma.store.create({
        data: {
          name: `${user?.name || 'New'}'s Store`,
          email: `${ownerId}@store.com`,
          address: 'Store address not provided',
          ownerId
        }
      })
      return res.status(200).json({ storeId: null, storeName: `${user?.name || 'New'}'s Store`, averageRating: 0, totalRatings: 0, ratersList: [] })
    }
    const ratings = store.ratings
    let averageRating = 0
    let totalRatings = 0
    if (ratings.length > 0) {
      const total = ratings.reduce((sum, r) => sum + r.ratingValue, 0)
      averageRating = parseFloat((total / ratings.length).toFixed(2))
      totalRatings = ratings.length
    }
    const ratersList = ratings.map(r => ({ name: r.user.name, email: r.user.email, rating: r.ratingValue, ratedAt: r.createdAt }))
    res.status(200).json({ storeId: store.id, storeName: store.name, averageRating, totalRatings, ratersList })
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching owner dashboard data.', error })
  }
}