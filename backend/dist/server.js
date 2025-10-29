"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const prisma_1 = __importDefault(require("./config/prisma"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const storeRoutes_1 = __importDefault(require("./routes/storeRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'API is healthy' });
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/stores', storeRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
// Error handling
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ message: 'Something broke!', error: err.message });
});
// Start server
async function startServer() {
    try {
        console.log('⏳ Connecting to database...');
        await prisma_1.default.$connect();
        console.log('✅ Database connected');
        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 SIGINT received: closing database connection...');
    await prisma_1.default.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('🛑 SIGTERM received: closing database connection...');
    await prisma_1.default.$disconnect();
    process.exit(0);
});
startServer();
