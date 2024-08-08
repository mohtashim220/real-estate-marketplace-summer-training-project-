import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';

export const verifyToken =  (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, 'Unauthorized'));

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    
    if (err) { return next(errorHandler(403, 'forbidden')); }
    else {
      console.log("token is verified");
      
    req.user = user;
    console.log(user)
    next();
      

    }
  });
  
}