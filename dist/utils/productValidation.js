"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateProduct = exports.validateAddProduct = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    next();
});
exports.validateAddProduct = [
    (0, express_validator_1.body)('name')
        .isEmpty()
        .withMessage('Product name is required')
        .not()
        .isLength({ min: 3 })
        .withMessage('Product name must be at least 3 characters long'),
    (0, express_validator_1.body)('description')
        .isEmpty()
        .withMessage('Product description is required')
        .not()
        .isLength({ min: 10 })
        .withMessage('Product description must be at least 10 characters long'),
    (0, express_validator_1.body)('quantity')
        .isEmpty() // Assuming quantity is a whole number
        .withMessage('Product quantity must be provided'),
    (0, express_validator_1.body)('unitPrice')
        .isEmpty()
        .withMessage('Product unit price must provided'),
    (0, express_validator_1.body)('deliveryPrice')
        .isEmpty()
        .withMessage('Delivery price for this product must be provided'),
    (0, express_validator_1.body)('province')
        .isEmpty()
        .withMessage('Product address line 1 must be provided')
        .not()
        .isLength({ min: 3 })
        .withMessage('Product address line 1 must be at least 3 characters long'),
    (0, express_validator_1.body)('district') // Assuming district is required or optional based on your logic
        .optional()
        .isString()
        .withMessage('Product address line 2 must be a string')
        .not()
        .isLength({ min: 3 })
        .withMessage('Product address line 2 must be at least 3 characters long'),
    (0, express_validator_1.body)('type')
        .not()
        .isIn([
        'Home Appliance',
        'Clothing',
        'Shoes',
        'Furniture',
        'Electronics',
        'Phone',
        'Computer',
        'Part of house',
        'Cereals',
        'Other food items',
    ])
        .withMessage('Invalid product type'),
    (0, express_validator_1.body)('category')
        .not()
        .isIn(['Renewable', 'Non-renewable'])
        .withMessage('Invalid product category'),
    handleValidationErrors
];
exports.validateUpdateProduct = [
    (0, express_validator_1.body)('name')
        .not()
        .isEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 3 })
        .withMessage('Product name must be at least 3 characters long'),
    (0, express_validator_1.body)('description')
        .not()
        .isEmpty()
        .withMessage('Product description is required')
        .isLength({ min: 10 })
        .withMessage('Product description must be at least 10 characters long'),
    (0, express_validator_1.body)('quantity')
        .isInt() // Assuming quantity is a whole number
        .withMessage('Product quantity must be a valid integer')
        .isInt({ min: 1 })
        .withMessage('Product quantity must be at least 1'),
    (0, express_validator_1.body)('unitprice')
        .not()
        .isNumeric()
        .withMessage('Product unit price must be a valid number'),
    (0, express_validator_1.body)('province')
        .not()
        .isEmpty()
        .withMessage('Product address line 1 must be provided')
        .isLength({ min: 3 })
        .withMessage('Product address line 1 must be at least 3 characters long'),
    (0, express_validator_1.body)('district') // Assuming district is required or optional based on your logic
        .optional()
        .isString()
        .withMessage('Product address line 2 must be a string')
        .isLength({ min: 3 })
        .withMessage('Product address line 2 must be at least 3 characters long'),
    (0, express_validator_1.body)('deliveryStatus.client')
        .isIn(['Pending', 'Received'])
        .withMessage('Invalid delivery status for client'),
    (0, express_validator_1.body)('deliveryStatus.seller')
        .isIn(['Pending', 'Delivered'])
        .withMessage('Invalid delivery status for seller'),
    (0, express_validator_1.body)('type')
        .isIn([
        'Home Appliance',
        'Clothing',
        'Shoes',
        'Furniture',
        'Electronics',
        'Phone',
        'Computer',
        'Part of house',
        'Cereals',
        'Other food items',
    ])
        .withMessage('Invalid product type'),
    (0, express_validator_1.body)('category')
        .isIn(['Renewable', 'Non-renewable'])
        .withMessage('Invalid product category'),
    handleValidationErrors
];
// export const imageValidation = [
//   files('imageFiles')
//     .isArray()
//     .withMessage('Product image files must be an array of strings')
//     .custom((imageFiles) => {
//       if (imageFiles.length === 0) {
//         throw new Error('Product must have at least one image file');
//       }
//       return true;
//     }),
// ];
