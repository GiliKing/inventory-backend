import db from "../database/db.js";

// items Validation Middleware
export const validateItemInputs = (req, res, next) => {
    const { name, cost_price, sales_price, quantity, category_id } = req.body;
    if (!name || !cost_price  || !sales_price || !quantity || !category_id) {
      const error = new Error(`All fields (name, cost_price, sales_price, quantity, category_id) are required.`)
      error.status = 400;
      return next(error);
    }
    if (name.length === 0) {
      const error = new Error(`Name must be not be empty.`)
      error.status = 400;
      return next(error);
    }
    if (isNaN(cost_price) || cost_price <= 0) {
      const error = new Error(`Cost price must be a positive number.`)
      error.status = 400;
      return next(error);
    }
    if (isNaN(sales_price) || sales_price <= 0) {
      const error = new Error(`Sales price must be a positive number.`)
      error.status = 400;
      return next(error);
    }
    if (isNaN(quantity) || quantity < 0 || !Number.isInteger(Number(quantity))) {
      const error = new Error(`Quantity must be a positive number`)
      error.status = 400;
      return next(error);
    }
    const query = 'SELECT id FROM categories WHERE id = ?';
    db.query(query, [category_id], (err, result) => {
      if (err) {
        const error = new Error(`Database error occurred. ${err.message}`)
        return next(error);
      }
      if (result.length === 0) {
        const error = new Error(`Invalid category id.`)
        error.status = 400;
        return next(error);
      }
    });
    const query_first = 'SELECT name FROM items WHERE name = ?';
    db.query(query_first, [name], (err, result) => { 
      if (err) {
        const error = new Error(`Database error occurred. ${err.message}`)
        return next(error);
      }
      if (result.length > 0) {
        const error = new Error(`Product name already exists`);
        error.status = 400;
        return next(error);
      }
      next();
    });
};

export const validateItemId = (req, res, next) => {
    const id = parseInt(req.params.id);
    const query = 'SELECT id FROM items WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        const error = new Error(`Database error occurred. ${err.message}`)
        return next(error);
      }
      if (result.length === 0) {
        const error = new Error(`Invalid item id`)
        error.status = 400;
        return next(error);
      }

      next();
    });
}