import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";


export default function CreateListing() {
  const { currentuser } = useSelector((state) => state.user);
  const [files, setfFiles] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imagesURLs: [],
    name: 'ali',
    description: 'description',
    address: 'bareiily',
    bedrooms: 1,
    bathrooms:1,
    regularPrice: 50,
    discountPrice: 0,
    type:'rent',
    offer: false,
    parking: false,
    furnished:false,
  });

  const [imageUploadError, setImageUploadError] = useState(null);
  console.log(formData);
  console.log(formData.imagesURLs.length);


  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imagesURLs.length < 7  ) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({
          ...formData,
          imagesURLs: formData.imagesURLs.concat(urls),
        });
        setImageUploadError(false);
        setUploading(false);
      }).catch((err) => {
        setImageUploadError('image upload failed (2 mb max per image )');
        setUploading(false);
      });
    }
    else {
      setImageUploadError('you can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    setUploading(true);
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          // setFilePerc(Math.round(progress))
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imagesURLs: formData.imagesURLs.filter((_, i) => i !== index),
  })
  }
  
  const handleChange = (e)=> {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type:e.target.id
      })
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({...formData, [e.target.id]:e.target.checked})
    }

    if (e.target.type === 'number' || e.target.type === 'textarea' || e.target.type === 'text') {
      setFormData({
        ...formData,
        [e.target.id]:e.target.value
      })
    }


  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imagesURLs.length < 1) {
         
        setError('you must upload atleast one image');
        return
        
      }
      if (+formData.regularPrice < +formData.discountPrice) {
        setError('discount price must be less than regular price');
        return;
    }
      
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef:currentuser._id
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`)
      
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
  

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex flex-col gap-4 flex-1 mt-7">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap ">
            <div className="flex-gap">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex-gap">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex-gap">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex-gap">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex-gap">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className=" flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="0"
                max="100000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">
                  {formData.type === "rent" ? "(rupee / month)" : "in rupee"}
                </span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="100000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs">
                    {formData.type === "rent" ? "(rupee / month)" : "in rupee"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4 mt-7 ">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setfFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "uploading..." : "upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm ">
            {imageUploadError ? imageUploadError : " "}
          </p>

          {formData.imagesURLs.length > 0 &&
            formData.imagesURLs.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 items-center border"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 objec-cover rounded-lg"
                ></img>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-700 p-3 h-10 rounded-lg uppercase hover:opacity-80   "
                >
                  delete
                </button>
              </div>
            ))}

          <button disabled={loading || uploading} className="p-3 bg-slate-700 rounded-lg uppercase hover:opacity-95 text-white disabled:opacity-80">
            {loading ? "creating..." : "create listing"}
          </button>
          {error ? <p className="text-red-700 text-sm">{error}</p> : ""}
        </div>
      </form>
    </main>
  );
}
