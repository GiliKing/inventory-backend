import express from 'express';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { validateCategoryInputs, validateCategoryId } from '../validation/categoryValidation.js';
const router = express.Router();

// GET all categories
router.get('/', getCategories);

// GET single category
router.get('/:id', getCategory)

// create new category
router.post('/', validateCategoryInputs, createCategory)

// update category
router.put('/:id', validateCategoryId, updateCategory)

router.delete('/:id', validateCategoryId, deleteCategory)

export default router;