import express from 'express';
import upload from '../middlewares/file.js';
import { validateItemInputs, validateItemId } from '../validation/itemValidation.js';
import { getItems, getItem, createItem, updateItem, deleteItem, updateItemQuantity } from '../controllers/itemController.js'
import { validateItemQuantity } from '../validation/quantityValidation.js';
const router = express.Router();



// GET all items
router.get('/', getItems);

// GET single item
router.get('/:id', getItem)

// create new item
router.post('/', upload.single('image'), validateItemInputs, createItem)

// update item
router.put('/:id', upload.single('image_again'), validateItemId, updateItem)

// update quantity
router.post('/update', validateItemQuantity, updateItemQuantity)


router.delete('/:id', validateItemId, deleteItem)

export default router;
