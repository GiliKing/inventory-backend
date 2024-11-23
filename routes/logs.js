import express from 'express';
import { getLogs, getLog, createLog, deleteLog } from '../controllers/logController.js';
import { validateLogInputs, validateLogId } from '../validation/logValidation.js';
const router = express.Router();

// GET all categories
router.get('/', getLogs);

// GET single category
router.get('/:id', getLog)

// create new category
router.post('/', validateLogInputs, createLog)

router.delete('/:id', validateLogId, deleteLog)

export default router;
