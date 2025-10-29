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
exports.login = exports.register = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
const JWT_SECRET = process.env.JWT_SECRET;
const generateToken = (id, email, role) => {
    return jwt.sign({ userId: id, email, role }, JWT_SECRET, { expiresIn: '1d' });
};
const register = async (req, res) => {
    const { name, email, password, address, role } = req.body;
    const errors = [];
    if (!name || name.length < 3)
        errors.push('Name must be at least 3 characters long');
    if (!password || password.length < 8)
        errors.push('Password must be at least 8 characters long');
    if (password && !/[A-Z]/.test(password))
        errors.push('Password must contain at least one uppercase letter');
    if (password && !/[!@#$%^&*(),.?":{}|<>]/.test(password))
        errors.push('Password must contain at least one special character');
    if (errors.length > 0)
        return res.status(400).json({ errors });
    try {
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser)
            return res.status(400).json({ message: 'User with this email already exists.' });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userRole = role === 'STORE_OWNER' ? client_1.Role.STORE_OWNER : client_1.Role.NORMAL_USER;
        const user = await prisma_1.default.user.create({
            data: { name, email, password: hashedPassword, address, role: userRole },
            select: { id: true, name: true, email: true, role: true, address: true }
        });
        if (userRole === client_1.Role.STORE_OWNER) {
            await prisma_1.default.store.create({
                data: {
                    name: req.body.storeName || `${user.name}'s Store`,
                    email: user.email,
                    address: user.address,
                    ownerId: user.id
                }
            });
        }
        const token = generateToken(user.id, user.email, user.role);
        res.status(201).json({ ...user, token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during registration.', error });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials.' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid credentials.' });
        const token = generateToken(user.id, user.email, user.role);
        res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role, address: user.address, token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during login.', error });
    }
};
exports.login = login;
