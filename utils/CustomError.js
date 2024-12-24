class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const handleErrors = (err, req, res, next) => {
    console.log('Error:', err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error',
    });
};

export default CustomError;
