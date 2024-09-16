import { body } from 'express-validator';
import { handleValidationErrors } from './userValidation';

export const validateBloodBag = [
  body('bloodType')
    .isString()
    .withMessage('Blood type must be a string')
    .isIn(['Plasma', 'Platelet', 'Whole Blood', 'Red Blood Cells'])
    .withMessage('Invalid blood type, accepted values are: Plasma, Platelet, Whole Blood, Red Blood Cells'),
  body('bloodGroup')
    .isString()
    .withMessage('Blood group must be a string')
    .isIn(['O', 'A', 'B', 'AB'])
    .withMessage('Invalid blood group, accepted values are: O, A, B, AB'),
  body('rhesis')
    .isString()
    .withMessage('Rhesis must be a string')
    .isIn(['P', 'N'])
    .withMessage('Rhesis must be either P (positive) or N (negative)'),
  body('quantity')
    .isInt()
    .withMessage('Quantity must be an integer greater than 0'),
  body('bloodQuality')
    .isString()
    .withMessage('Blood quality must be a string')
    .isIn(['Good', 'Moderate', 'Expired'])
    .withMessage('Blood quality must be either Good, Moderate, or Poor'),
  handleValidationErrors
];