import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db,auth,storage } from "../firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useState } from 'react'
import { doc, setDoc } from "firebase/firestore"; 
import Add from "../img/addAvatar.png"

const Register = () => {
  const [err, setErr] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

try{
  const res = await createUserWithEmailAndPassword(auth, email, password)

const storageRef = ref(storage, name);

const uploadTask = uploadBytesResumable(storageRef, file);
uploadTask.on( 
  (error) => {
    setErr(true);
  },   
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
      await updateProfile(res.user,{
        name,
        photoURL:downloadURL,
      });
      await setDoc(doc(db, "users", res.user.uid),{
        uid: res.user.uid,
        name,
        email,
        photoURL: downloadURL,
      });
    });
  }
);

}catch(err){
setErr(true);
}
  
  };
  return (
    <div className='formContainer'>
    <div className='formWrapper'>
    <span className='logo'>ReactChat</span>
    <span className='title'>Register</span>
    <form onSubmit={handleSubmit}>
        <input type="text" placeholder='Name' />
        <input type="email" placeholder='email'/>
        <input type="password" placeholder='password' />
        <input style={{display: "none"}} type="file" id='file' />
        <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
        </label>
        <button>Sign up</button>
        {err && <span>Something went wrong</span>}
    </form>
    <p>I have already an account.  LogIn</p>
    </div>
    </div>
  )
}

export default Register
