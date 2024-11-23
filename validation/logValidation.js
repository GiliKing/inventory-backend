import db from "../database/db.js";

// items Validation Middleware
export const validateLogInputs = (req, res, next) => {
    const { item_id, action_type, quantity_changed } = req.body;

    if (!item_id || !action_type || !quantity_changed) {
      const error = new Error(`All fields (item_id, action_type, quantity_changed) are required.`)
      error.status = 400;
      return next(error);
    }

    if(isNaN(item_id) || quantity_changed <= 0) {
      const error = new Error(`item id must be a number.`)
      error.status = 400;
      return next(error);
    }

    const query = 'SELECT id FROM items WHERE id = ?';
    db.query(query, [item_id], (err, result) => {
      if (err) {
        const error = new Error(`Database error occurred. ${err.message}`)
        return next(error);
      }
      if (result.length === 0) {
        const error = new Error(`Invalid item id`)
        error.status = 400;
        return next(error);
      }
    });

    const actions = ['added', 'updated', 'sold'];

    if (action_type.length !== 0) {
      if (!actions.includes(action_type)) {
        const error = new Error(`action type does not exists`);
        error.status = 400;
        return next(error);
      }
    }

    if (isNaN(quantity_changed) || quantity_changed <= 0) {
      const error = new Error(`Quantity Changed must be a positive number.`)
      error.status = 400;
      return next(error);
    }

    next();

};

export const validateLogId = (req, res, next) => {
    const id = parseInt(req.params.id);
    const query = 'SELECT id FROM logs WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        const error = new Error(`Database error occurred. ${err.message}`)
        return next(error);
      }
      if (result.length === 0) {
        const error = new Error(`Invalid log id`)
        error.status = 400;
        return next(error);
      }
      next();
    });
}