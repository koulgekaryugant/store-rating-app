"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.userValidation = void 0;
const express_validator_1 = require("express-validator");
const passwordValidator = () => (0, express_validator_1.body)('password')
    .isLength({ min: 8, max: 16 })
    .matches(/[A-Z]/)
    .matches(/[!@#$%^&*(),.?":{}|<>]/);
exports.userValidation = {
    register: [
        (0, express_validator_1.body)('name').trim().isLength({ min: 3, max: 60 }),
        (0, express_validator_1.body)('email').isEmail(),
        (0, express_validator_1.body)('address').isLength({ max: 400 }),
        passwordValidator(),
        (0, express_validator_1.body)('role').optional().isIn(['NORMAL_USER', 'STORE_OWNER'])
    ],
    login: [
        (0, express_validator_1.body)('email').isEmail(),
        (0, express_validator_1.body)('password').notEmpty()
    ],
    createUser: [
        (0, express_validator_1.body)('name').trim().isLength({ min: 3, max: 60 }),
        (0, express_validator_1.body)('email').isEmail(),
        (0, express_validator_1.body)('address').isLength({ max: 400 }),
        (0, express_validator_1.body)('role').isIn(['NORMAL_USER', 'STORE_OWNER', 'SYSTEM_ADMIN']),
        passwordValidator()
    ],
    createStore: [
        (0, express_validator_1.body)('name').notEmpty(),
        (0, express_validator_1.body)('email').isEmail(),
        (0, express_validator_1.body)('address').isLength({ max: 400 }),
        (0, express_validator_1.body)('ownerId').isUUID()
    ],
    submitRating: [
        (0, express_validator_1.body)('ratingValue').isInt({ min: 1, max: 5 })
    ],
    updatePassword: [
        (0, express_validator_1.body)('currentPassword').notEmpty(),
        passwordValidator()
    ]
};
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty())
        return next();
    const extractedErrors = [];
    errors.array().forEach(err => extractedErrors.push({ [err.param]: err.msg }));
    return res.status(400).json({ errors: extractedErrors });
};
exports.validate = validate;
