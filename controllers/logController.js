import db from '../database/db.js'

// get all logs 
// @route GET /api/logs
export const getLogs = (req, res, next) => {
    const limit = parseInt(req.query.limit);
    const actionType = req.query.action_type;
    let query = 'SELECT * FROM logs';
    const queryParams = [];
    if (actionType) {
        query += ' WHERE action_type = ?';
        queryParams.push(actionType);
    }
    if (actionType == 'all') {
        query = 'SELECT * FROM logs';
        queryParams.push(actionType);
    }
    db.query(query, queryParams, (err, results) => {
        if (err) {
            const error = new Error('Error fetching data');
            return next(error);
        }
        const filteredResults = !isNaN(limit) && limit > 0 ? results.slice(0, limit) : results;
        res.status(200).json({
            message: 'Fetched successfully',
            logs: filteredResults,
        });
    });
};


// @desc Get single log
export const getLog = (req, res, next) => {
    const id = parseInt(req.params.id);
    const query = 'SELECT * FROM logs WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            const error = new Error(`Error fetching data ${err.message}`)
            return next(error);
        } else if (results.length === 0) {
            const error = new Error(`log not found`)
            error.status = 404;
            return next(error);
        } else {
            res.status(200).json(results[0]);
        }
    });
}

// create log
export const createLog = async (req, res, next) => {
    const { item_id, action_type, quantity_changed  } = req.body;
    const query = 'INSERT INTO logs (item_id, action_type, quantity_changed, purchaser_name) VALUES (?, ?, ?, ?)';
    const purchaser_name  = req.body.purchaser_name ?? null;
    const values = [item_id, action_type, quantity_changed, purchaser_name];
    db.query(query, values, (err, result) => {
        if (err) {
            const error = new Error(`Failed to add log to database: ${err.message}`);
            return next(error);
        }
        res.status(201).json({
            message: 'Log added successfully.',
            log: result,
        });
    });
};


// delete log
export const deleteLog = (req, res, next) => {
    const id = parseInt(req.params.id);
    const query = 'DELETE FROM logs WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            const error = new Error(`Error deleting data:', ${err.message}`)
            return next(error);
        } else {
            res.status(201).json({
                message: 'Log deleted successfully.',
                log: '',
            });
        }
    });
    
}