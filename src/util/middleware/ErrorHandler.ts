import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if(err.message === "Wrong query params"){
        res.status(400).json({
            error: err.message,
            message: "On or more query params don't match the expected format"
        })
        return next()
    }
    res.status(500).json({ error: "Internal Server Error" });
    next()
};

export default errorHandler;