import db from '../database/db.js'

// get all items 
// @route GET /api/categories
export const getCategories = (req, res) => {
    const limit = parseInt(req.query.limit);
    const query = 'SELECT * FROM categories';
    db.query(query, (err, results) => {
        if (err) {
            const error = new Error(`Error fetching data`)
            return next(error);
        } else {
            if(!isNaN(limit) && limit > 0) {
                return res.status(200).json(results.slice(0, limit))
            }
            res.status(200).json({
                message: "fetched successfully",
                categories : results 
            });
        }
    });
}

// @desc Get single category
export const getCategory = (req, res, next) => {
    const id = parseInt(req.params.id);
    const query = 'SELECT * FROM categories WHERE id = ?';
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

// create category
export const createCategory = async (req, res, next) => {
    const { name } = req.body;
    const query = 'INSERT INTO categories (name) VALUES (?)';
    const values = [name];
    db.query(query, values, (err, result) => {
    if (err) {
        const error = new Error(`Failed to add category to database: ${err.message}`);
        return next(error);
    }
    res.status(201).json({
        message: 'Category added successfully.',
        item: result,
    });
    });
};

// update category
export const updateCategory = async (req, res, next) => {

    const { name } = req.body;
    const query = 'UPDATE categories SET name = ? WHERE id = ?';
    const values = [name, id];
    db.query(query, values, (err, dbResult) => {
        if (err) {
        const dbError = new Error(`Failed to update categories in database: ${err.message}`);
        return next(dbError);
        }
        res.status(201).json({
        message: 'Category updated successfully.',
        item: dbResult,
        });
    });
    
}

// delete item
export const deleteCategory = (req, res, next) => {
    const id = parseInt(req.params.id);
    const query = 'DELETE FROM categories WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            const error = new Error(`Error deleting data:', ${err.message}`)
            return next(error);
        } else {
            res.status(201).json({
                message: 'Category deleted successfully.',
                item: '',
            });
        }
    });
    
}