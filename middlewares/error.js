const errorHandler = (err, req, res, next) => {
    if(err.status) {
        res.status(err.status).json({
            error: "Error Occured",
            message: err.message
        });
    } else {
        res.status(500).json({
            error: "Error Occured",
            message: err.message
        });
    }
    
}

export default errorHandler;