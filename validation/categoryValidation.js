import db from "../database/db.js";

// items Validation Middleware
export const validateCategoryInputs = (req, res, next) => {
    const { name } = req.body;
    if (name.length === 0) {
      const error = new Error(`Name must not be empty.`)
      error.status = 400;
      return next(error);
    }
    const query_first = 'SELECT name FROM categories WHERE name = ?';
    db.query(query_first, [name], (err, result) => { 
      if (err) {
        const error = new Error(`Database error occurred. ${err.message}`)
        return next(error);
      }
      if (result.length > 0) {
        const error = new Error(`Catgeory name already exists`);
        error.status = 400;
        return next(error);
      }
      next();
    });
};

export const validateCategoryId = (req, res, next) => {
    const id = parseInt(req.params.id);
    const query = 'SELECT id FROM categories WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        const error = new Error(`Database error occurred. ${err.message}`)
        return next(error);
      }
      if (result.length === 0) {
        const error = new Error(`Invalid category id`)
        error.status = 400;
        return next(error);
      }

      next();

    });
}