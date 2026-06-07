// import express from "express";

// const error = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//     if (err.name === 'SequelizeValidationError') {
//         return res.status(500).send({
//             message: err.message,
//             error: err.error,

//         })
//     }
//     err.message = err.message || "Internal Server Error";
//     err.statusCode = err.statusCode || 500;

//     res.status(err.statusCode).json({
//         success: false,
//         message: err.message,
//         errorObj: err.error
//     })
// }

// export default error;

import express from "express";
const error = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  console.log("FULL ERROR:", err);

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: "Password must be between 6 and 20 characters in length, and phone number must be exactly 10 characters long.",
    //   errorObj: err || null,
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      success: false,
      message: err.errors ? err.errors[0].message : "Duplicate entry found. Please use a different value.",
    //   errorObj: err || null,
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errorObj: err || null,
  });
};

export default error;
