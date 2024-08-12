import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md'
import { FaIndianRupeeSign } from "react-icons/fa6";

export default function ListingItem({listing}) {
  
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imagesURLs[0] || "https://img.indiafilings.com/learn/wp-content/uploads/2015/10/12011006/Real-Estate-Agent-Business-India.jpg" }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncatew-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className=" text-slate-500 mt-2 font-semibold ">
            <FaIndianRupeeSign className="inline" />
            <p className=" inline ">
              {listing.offer ? (listing.type==='rent'? listing.discountPrice + '/month':listing.discountPrice) :(listing.type==='rent'? listing.regularPrice+ '/month':listing.regularPrice) }
            </p>
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {listing.bedrooms>1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
            </div>
             <div className="font-bold text-xs">
              {listing.bathrooms>1 ? `${listing.bathroooms} baths` : `${listing.bathrooms} bath`}
            </div>
            </div>
          </div>

      
      </Link>
    </div>
  );
}

