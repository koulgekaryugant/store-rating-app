"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer'))
        return res.status(401).json({ message: 'No token' });
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = { id: decoded.userId, email: decoded.email, role: decoded.role };
        next();
    }
    catch {
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.protect = protect;
const authorize = (roles) => (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ message: 'Not authenticated' });
    if (!roles.includes(req.user.role))
        return res.status(403).json({ message: 'Not authorized' });
    next();
};
exports.authorize = authorize;
