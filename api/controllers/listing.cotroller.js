import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  console.log('creat listing APi is called');
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
    
  } catch (error){
    next(error);
  }
};


export const deleteListing = async (req, res, next) => {
  console.log('delete listing APi is called');
  console.log('id', req.user.userId);
  

  const listing = await Listing.findById(req.params.id);
  console.log("userREf", listing.userRef);
  if (!listing) {
    return res.status(404).json({ message: 'Listing not found' });
  }
  if (req.user.userId !== listing.userRef) {
    return next(errorHandler(401,'you can delete your listing only'))
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted');
    
  } catch (error) {
    next(error);
  }

};