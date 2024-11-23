import db from '../database/db.js'
import cloudinary from '../config/cloudinaryConfig.js';
import streamifier from 'streamifier';
import randomSKU from '../helpers/randomSku.js';

// get all items 
// @route GET /api/items
export const getItems = (req, res, next) => {
  const limit = parseInt(req.query.limit);
  const cat_id = req.query.cat_id;
  const queryParams = [];
  let query = `
      SELECT items.*, categories.name AS category_name 
      FROM items 
      LEFT JOIN categories ON items.category_id = categories.id
  `;

  if (cat_id) {
      query += ` WHERE items.category_id = ?`;
      queryParams.push(cat_id);
  }

  db.query(query, queryParams, (err, results) => {
      if (err) {
          const error = new Error(`Error fetching data: ${err.message}`);
          return next(error);
      } else {
          if (!isNaN(limit) && limit > 0) {
              return res.status(200).json(results.slice(0, limit));
          }
          res.status(200).json({
              message: "Fetched successfully",
              items: results,
          });
      }
  });
};


// @desc Get single item
export const getItem = (req, res, next) => {
    const id = parseInt(req.params.id);
    const query = 'SELECT * FROM items WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            const error = new Error(`Error fetching data ${err.message}`)
            return next(error);
        } else if (results.length === 0) {
            const error = new Error(`Item not found`)
            error.status = 404;
            return next(error);
        } else {
            res.status(200).json(results[0]);
        }
    });
}

// create item
export const createItem = async (req, res, next) => {

    if (!req.file) {
      const error = new Error(`Image is required`);
      error.status = 400;
      return next(error);
    }
  
    try {
      const { name, cost_price, sales_price, quantity, category_id } = req.body;
      // Use upload_stream to handle file buffers
      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            {
              resource_type: 'auto', // Auto detect file type
              folder: 'items/',      // Folder in Cloudinary
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
  
      const result = await uploadToCloudinary();
      const imageUrl = result.secure_url;
      const sku = randomSKU;
      // Insert the item details into the database
      const query = 'INSERT INTO items (name, cost_price, sales_price, quantity, category_id, image, sku) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [name, cost_price, sales_price, quantity, category_id, imageUrl, sku];

      db.query(query, values, (err, dbResult) => {
        
        if (err) {
          const dbError = new Error(`Failed to add item to database: ${err.message}`);
          return next(dbError);
        }

        const item_id = dbResult.insertId
        const action_type = 'added';
        const quantity_changed = quantity;
        const purchaser_name = 'Admin';
        const query_again = 'INSERT INTO logs (item_id, action_type, quantity_changed, purchaser_name) VALUES (?, ?, ?, ?)';
        const values_again = [item_id, action_type, quantity_changed, purchaser_name];
        db.query(query_again, values_again, (err, resl) => {
          if (err) {
            const dbError = new Error(`Failed to add log to database: ${err.message}`);
            return next(dbError);
          }
          res.status(201).json({
            message: 'Item added successfully.',
            item: dbResult,
          });
        })
      });
    } catch (error) {
      const uploadError = new Error(`Failed to upload image to Cloudinary: ${error.message}`);
      return next(uploadError);
    }
};

// update item
export const updateItem = async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (!req.file) {
        const { name, cost_price, sales_price, quantity, category_id, image, sku } = req.body;
        const query = 'UPDATE items SET name = ?, cost_price = ?, sales_price = ?, quantity = ?, category_id = ?, image = ?, sku = ? WHERE id = ?';
        const values = [name, cost_price, sales_price, quantity, category_id, image, sku, id];
        db.query(query, values, (err, result) => {
            if (err) {
            const error = new Error(`Failed to update data: ${err.message}`)
            return next(error);
            }
            res.status(201).json({
            message: 'Item updated successfully.',
            item: result
            });
        });
    } else {

        try {
            const { name, cost_price, sales_price, quantity, category_id, sku } = req.body;
            const uploadToCloudinary = () => {
              return new Promise((resolve, reject) => {
                const stream = cloudinary.v2.uploader.upload_stream(
                  {
                    resource_type: 'auto',
                    folder: 'items/',  
                  },
                  (error, result) => {
                    if (error) {
                      return reject(error);
                    }
                    resolve(result);
                  }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
              });
            };
            const result = await uploadToCloudinary();
            const imageUrl = result.secure_url;
            const query = 'UPDATE items SET name = ?, cost_price = ?, sales_price = ?, quantity = ?, category_id = ?, image = ?, sku = ? WHERE id = ?';
            const values = [name, cost_price, sales_price, quantity, category_id, imageUrl, sku, id];
            db.query(query, values, (err, dbResult) => {
              if (err) {
                const dbError = new Error(`Failed to update item in database: ${err.message}`);
                return next(dbError);
              }
              res.status(201).json({
                message: 'Item updated successfully.',
                item: dbResult,
              });
            });
        } catch (error) {
            const uploadError = new Error(`Failed to upload image to Cloudinary: ${error.message}`);
            return next(uploadError);
        }

    }
    
}

// update quantity
export const updateItemQuantity = async (req, res, next) => {
  const { quantity, id } = req.body;

  // First, fetch the current quantity of the item
  const fetchQuery = 'SELECT quantity FROM items WHERE id = ?';
  db.query(fetchQuery, [id], (err, result) => {
    if (err) {
      const error = new Error(`Failed to fetch item: ${err.message}`);
      return next(error);
    }
    const currentQuantity = result[0].quantity;
    const newQuantity = currentQuantity - quantity;
    const updateQuery = 'UPDATE items SET quantity = ? WHERE id = ?';
    db.query(updateQuery, [newQuantity, id], (err, result) => {
      if (err) {
        const error = new Error(`Failed to update data: ${err.message}`);
        return next(error);
      }

      const item_id = id;
      const action_type = 'sold';
      const quantity_changed = quantity;
      const purchaser_name = 'Buyer';
      const query_again = 'INSERT INTO logs (item_id, action_type, quantity_changed, purchaser_name) VALUES (?, ?, ?, ?)';
      const values_again = [item_id, action_type, quantity_changed, purchaser_name];
      db.query(query_again, values_again, (err, resl) => {
        if (err) {
          const dbError = new Error(`Failed to add log to database: ${err.message}`);
          return next(dbError);
        }
        res.status(200).json({
          message: 'Item quantity updated successfully.',
          item: result
        });
      })
    });
  });
};


// delete item
export const deleteItem = (req, res, next) => {
    const id = parseInt(req.params.id);
    const query = 'DELETE FROM items WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            const error = new Error(`Error deleting data:', ${err.message}`)
            return next(error);
        } else {
            res.status(201).json({
                message: 'Item deleted successfully.',
                item: '',
            });
        }
    });
    
}