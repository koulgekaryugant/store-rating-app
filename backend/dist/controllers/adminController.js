"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStores = exports.getAllUsers = exports.createStore = exports.createUser = exports.getDashboardStats = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
const getDashboardStats = async (req, res) => {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
        prisma_1.default.user.count(),
        prisma_1.default.store.count(),
        prisma_1.default.rating.count()
    ]);
    res.status(200).json({ totalUsers, totalStores, totalRatings });
};
exports.getDashboardStats = getDashboardStats;
const createUser = async (req, res) => {
    const { name, email, password, address, role } = req.body;
    const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
    if (existingUser)
        return res.status(400).json({ message: `User with email ${email} already exists.` });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma_1.default.user.create({
        data: { name, email, password: hashedPassword, address, role: role },
        select: { id: true, name: true, email: true, role: true, address: true }
    });
    res.status(201).json({ user, message: 'User created successfully.' });
};
exports.createUser = createUser;
const createStore = async (req, res) => {
    const { name, email, address, ownerId } = req.body;
    const owner = await prisma_1.default.user.findUnique({ where: { id: ownerId } });
    if (!owner || owner.role !== client_1.Role.STORE_OWNER)
        return res.status(404).json({ message: 'Owner not found or not STORE_OWNER' });
    const existingStore = await prisma_1.default.store.findUnique({ where: { ownerId } });
    if (existingStore)
        return res.status(400).json({ message: 'This owner already has a store registered.' });
    const store = await prisma_1.default.store.create({ data: { name, email, address, ownerId } });
    res.status(201).json({ store, message: 'Store created successfully.' });
};
exports.createStore = createStore;
const getAllUsers = async (req, res) => {
    const { name, email, address, role } = req.query;
    const where = {};
    if (name)
        where.name = { contains: name, mode: 'insensitive' };
    if (email)
        where.email = { contains: email, mode: 'insensitive' };
    if (address)
        where.address = { contains: address, mode: 'insensitive' };
    if (role)
        where.role = role;
    const users = await prisma_1.default.user.findMany({
        where,
        include: { ownedStore: { select: { ratings: { select: { ratingValue: true } } } } }
    });
    const usersWithRating = users.map(u => {
        let avgRating = null;
        if (u.role === client_1.Role.STORE_OWNER && u.ownedStore) {
            const ratings = u.ownedStore.ratings;
            if (ratings.length)
                avgRating = parseFloat((ratings.reduce((sum, r) => sum + r.ratingValue, 0) / ratings.length).toFixed(2));
        }
        const { ownedStore, ...userData } = u;
        return { ...userData, averageStoreRating: avgRating };
    });
    res.status(200).json(usersWithRating);
};
exports.getAllUsers = getAllUsers;
const getAllStores = async (req, res) => {
    const { name, email, address } = req.query;
    const where = {};
    if (name)
        where.name = { contains: name, mode: 'insensitive' };
    if (email)
        where.email = { contains: email, mode: 'insensitive' };
    if (address)
        where.address = { contains: address, mode: 'insensitive' };
    const stores = await prisma_1.default.store.findMany({ where, include: { ratings: { select: { ratingValue: true } } } });
    const storesWithRating = stores.map(s => {
        const ratings = s.ratings;
        let avgRating = null;
        if (ratings.length)
            avgRating = parseFloat((ratings.reduce((sum, r) => sum + r.ratingValue, 0) / ratings.length).toFixed(2));
        const { ratings: _, ...storeData } = s;
        return { ...storeData, overallRating: avgRating, totalRatings: ratings.length };
    });
    res.status(200).json(storesWithRating);
};
exports.getAllStores = getAllStores;
