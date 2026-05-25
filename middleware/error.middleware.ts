import express from "express";

const error = (err:any, req:express.Request, res:express.Response, next:express.NextFunction) => {
    if (err.name === 'SequelizeValidationError') {
        return res.status(500).send({
            message: err.message,
            error: err.error,

        })
    }
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errorObj: err.error
    })
}

export default error;