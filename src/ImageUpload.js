import { Button } from '@mui/material';
import React, { useState } from 'react';
import {storage, db} from "./firebase";
import firebase from './firebase';
import './ImageUpload.css';

function ImageUpload({username}){
    const [image, setImage]=useState(null);
    const [progress, setProgress]=useState(0);
    const [caption, setCaption]=useState('');

    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };
    const handleUpload=()=>{
        const uploadTask=storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                //progress function..
                const progress=Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes)*100
                );
                setProgress(progress);
            },
            (error)=>{
                //Error function...
                console.log(error);
                alert(error.message);
            },
            ()=>{
                //complete function...
                storage
                .ref("images").child(image.name).getDownloadURL()
                .then(url=>{
                    //post image inside db
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        )
    }

  return (
    <div className='imageupload'>
        {/*need caption input, file picker, post button, progress bar*/}
        <progress className='imageupload__progress' value={progress} max="100%"/>
        <input type="text" placeholder='Enter a caption...' onChange={event=> setCaption(event.target.value)} value={caption}></input>
        <input type="file" onChange={handleChange}></input>
        <Button onClick={handleUpload}>upload </Button>
    </div>
  )
}

export default ImageUpload