"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnerDashboard = exports.submitRating = exports.listStoresForUser = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const listStoresForUser = async (req, res) => {
    const userId = req.user.id;
    const { name, address } = req.query;
    const where = {};
    if (name)
        where.name = { contains: name, mode: 'insensitive' };
    if (address)
        where.address = { contains: address, mode: 'insensitive' };
    try {
        const stores = await prisma_1.default.store.findMany({
            where,
            include: { ratings: { select: { ratingValue: true, userId: true } } },
            orderBy: { name: 'asc' }
        });
        const storeList = stores.map(store => {
            const allRatings = store.ratings;
            const userRating = allRatings.find(r => r.userId === userId)?.ratingValue || null;
            let overallRating = null;
            if (allRatings.length > 0) {
                const total = allRatings.reduce((sum, r) => sum + r.ratingValue, 0);
                overallRating = parseFloat((total / allRatings.length).toFixed(2));
            }
            const { ratings: _, ...storeData } = store;
            return { ...storeData, overallRating, userSubmittedRating: userRating };
        });
        res.status(200).json(storeList);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error listing stores.', error });
    }
};
exports.listStoresForUser = listStoresForUser;
const submitRating = async (req, res) => {
    const userId = req.user.id;
    const { storeId } = req.params;
    const { ratingValue } = req.body;
    if (ratingValue < 1 || ratingValue > 5)
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    try {
        const storeExists = await prisma_1.default.store.findUnique({ where: { id: storeId } });
        if (!storeExists)
            return res.status(404).json({ message: 'Store not found.' });
        const rating = await prisma_1.default.rating.upsert({
            where: { userId_storeId: { userId, storeId } },
            update: { ratingValue },
            create: { userId, storeId, ratingValue }
        });
        res.status(200).json({ message: 'Rating submitted successfully.', rating });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error submitting rating.', error: error.message });
    }
};
exports.submitRating = submitRating;
const getOwnerDashboard = async (req, res) => {
    const ownerId = req.user.id;
    try {
        const store = await prisma_1.default.store.findUnique({
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
        });
        if (!store) {
            const user = await prisma_1.default.user.findUnique({ where: { id: ownerId } });
            await prisma_1.default.store.create({
                data: {
                    name: `${user?.name || 'New'}'s Store`,
                    email: `${ownerId}@store.com`,
                    address: 'Store address not provided',
                    ownerId
                }
            });
            return res.status(200).json({ storeId: null, storeName: `${user?.name || 'New'}'s Store`, averageRating: 0, totalRatings: 0, ratersList: [] });
        }
        const ratings = store.ratings;
        let averageRating = 0;
        let totalRatings = 0;
        if (ratings.length > 0) {
            const total = ratings.reduce((sum, r) => sum + r.ratingValue, 0);
            averageRating = parseFloat((total / ratings.length).toFixed(2));
            totalRatings = ratings.length;
        }
        const ratersList = ratings.map(r => ({ name: r.user.name, email: r.user.email, rating: r.ratingValue, ratedAt: r.createdAt }));
        res.status(200).json({ storeId: store.id, storeName: store.name, averageRating, totalRatings, ratersList });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching owner dashboard data.', error });
    }
};
exports.getOwnerDashboard = getOwnerDashboard;
