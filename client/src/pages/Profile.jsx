import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";


export default function Profile() {
const fileRef = useRef(null);
const {currentuser}=useSelector((state=>state.user))
const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploaderror, setfileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(formData);
console.log(filePerc);
console.log(fileUploaderror);


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      setFilePerc(Math.round(progress))
    },
      (error) => {
        setfileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL })
        
        });
      },
    );
}


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semiblod text-center my-7 ">
      Profile
      </h1>
      <from className='flex flex-col gap-4'>
        <input onChange={(e)=>{setFile(e.target.files[0])}} type="file" ref={fileRef} hidden accept='image/*'></input>
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentuser.avatar } alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"></img>

        <p className="text-sm self-center">
          {fileUploaderror ? (<span className="text-red-700">Error Image upload (image must be lass than 2mb)  </span>) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{` Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (<span className="text-green-700">Image Successfully Uploaded!</span>):('')}
        </p>


        <input type="text" placeholder="username" className="border p-3 rounded-lg" id="username"></input>
        <input type="text" placeholder="email" className="border p-3 rounded-lg" id="email"></input>
        <input type="text" placeholder="password" className="border p-3 rounded-lg" id="password"></input>
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">Update</button>
      </from>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      
       
    </div>
  )
}
