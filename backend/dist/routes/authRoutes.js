"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const router = (0, express_1.Router)();
router.post('/register', validationMiddleware_1.userValidation.register, validationMiddleware_1.validate, authController_1.register);
router.post('/login', validationMiddleware_1.userValidation.login, validationMiddleware_1.validate, authController_1.login);
exports.default = router;
