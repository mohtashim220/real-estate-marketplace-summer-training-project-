import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import { verifyToken } from "../utils/verifyUser.js";

export const test = (req, res) => {
  res.json({
    message: 'Hello from server',
  })
};

export const updateUser = async (req,res, next) => {
  console.log("update api is called");
  console.log("user id ", req.user.userId);
  if (req.user.userId !== req.params.id) return next(errorHandler(401, "you can update your own account only!"));

  
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password,10)
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar:req.body.avatar,
      }
    }, { new: true })
    
    const { password, ...rest } = updateUser._doc;

    res.status(200).json({rest})
  } catch (error) {
    next(error);
  }
  
};