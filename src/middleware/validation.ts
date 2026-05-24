import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Validation middleware for challenge creation
 */
export const validateChallenge: RequestHandler[] = [
  body('name')
    .notEmpty()
    .withMessage('Challenge name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Challenge name must be between 1 and 255 characters'),
  
  body('type')
    .notEmpty()
    .withMessage('Challenge type is required')
    .isString()
    .withMessage('Challenge type must be a string'),
  
  body('track')
    .notEmpty()
    .withMessage('Challenge track is required')
    .isString()
    .withMessage('Challenge track must be a string'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  
  body('challengeSource')
    .optional()
    .isString()
    .withMessage('Challenge source must be a string')
    .isLength({ max: 255 })
    .withMessage('Challenge source must not exceed 255 characters'),
  
  body('status')
    .optional()
    .isIn(['draft', 'active', 'completed', 'cancelled'])
    .withMessage('Status must be one of: draft, active, completed, cancelled'),
  
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  
  body('registrationStartDate')
    .optional()
    .isISO8601()
    .withMessage('Registration start date must be a valid ISO 8601 date'),
  
  body('registrationEndDate')
    .optional()
    .isISO8601()
    .withMessage('Registration end date must be a valid ISO 8601 date'),
  
  body('submissionStartDate')
    .optional()
    .isISO8601()
    .withMessage('Submission start date must be a valid ISO 8601 date'),
  
  body('submissionEndDate')
    .optional()
    .isISO8601()
    .withMessage('Submission end date must be a valid ISO 8601 date'),
  
  body('createdBy')
    .notEmpty()
    .withMessage('Created by is required')
    .isString()
    .withMessage('Created by must be a string'),
  
  body('prizes')
    .optional()
    .isArray()
    .withMessage('Prizes must be an array'),
  
  body('phases')
    .optional()
    .isArray()
    .withMessage('Phases must be an array'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('groups')
    .optional()
    .isArray()
    .withMessage('Groups must be an array'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'The request contains invalid data',
        details: errors.array()
      });
    }
    next();
  }
];

/**
 * Validation middleware for challenge update
 */
export const validateChallengeUpdate: RequestHandler[] = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Challenge name must be between 1 and 255 characters'),
  
  body('type')
    .optional()
    .isString()
    .withMessage('Challenge type must be a string'),
  
  body('track')
    .optional()
    .isString()
    .withMessage('Challenge track must be a string'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  
  body('challengeSource')
    .optional()
    .isString()
    .withMessage('Challenge source must be a string')
    .isLength({ max: 255 })
    .withMessage('Challenge source must not exceed 255 characters'),
  
  body('status')
    .optional()
    .isIn(['draft', 'active', 'completed', 'cancelled'])
    .withMessage('Status must be one of: draft, active, completed, cancelled'),
  
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  
  body('registrationStartDate')
    .optional()
    .isISO8601()
    .withMessage('Registration start date must be a valid ISO 8601 date'),
  
  body('registrationEndDate')
    .optional()
    .isISO8601()
    .withMessage('Registration end date must be a valid ISO 8601 date'),
  
  body('submissionStartDate')
    .optional()
    .isISO8601()
    .withMessage('Submission start date must be a valid ISO 8601 date'),
  
  body('submissionEndDate')
    .optional()
    .isISO8601()
    .withMessage('Submission end date must be a valid ISO 8601 date'),
  
  body('updatedBy')
    .optional()
    .isString()
    .withMessage('Updated by must be a string'),
  
  body('prizes')
    .optional()
    .isArray()
    .withMessage('Prizes must be an array'),
  
  body('phases')
    .optional()
    .isArray()
    .withMessage('Phases must be an array'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('groups')
    .optional()
    .isArray()
    .withMessage('Groups must be an array'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'The request contains invalid data',
        details: errors.array()
      });
    }
    next();
  }
];
