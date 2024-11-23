import db from "../database/db.js";

export const validateItemQuantity = (req, res, next) => {
    const id = parseInt(req.body.id);
    const quantity = parseInt(req.body.quantity);
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
      } else if(quantity === 0) {
        const error = new Error(`Please input a quantity`)
        error.status = 400;
        return next(error);
      } else {
        const currentQuantity = result[0].quantity;
        const newQuantity = currentQuantity - quantity;
        if (newQuantity < 0) {
            const error = new Error(`We dont have up to that quantity`)
            error.status = 400;
            return next(error);
        }
      }

      next();
    });
}