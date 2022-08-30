import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import {db, auth} from './firebase';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import ImageUpload from './ImageUpload';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App(){
  const [posts, setPosts]=useState([]);
  const [open, setOpen]= useState(false);
  const [openSignIn, setOpenSignIn]=useState(false);
  const [username, setUsername]= useState('');
  const [password, setPassword]= useState('');
  const [email, setEmail]= useState('');
  const [user, setUser] = useState(null);
  //useEffect: Runs a piece of code based on a specific condition
  useEffect(()=>{
   const unsubscribe= auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //user has logged in...
        console.log(authUser);
        setUser(authUser);
      }else{
        //user has logged out...
        setUser(null);
      }
    })
    return ()=>{
      //performs some leanup actions
      unsubscribe();
    }
  },[user, username]);

  useEffect(()=>{
    //this is where the code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot=>{
      //every time a new post is added, this code excutes
      setPosts(snapshot.docs.map(doc=>({
        id: doc.id,
        post: doc.data()
      })));
    })
    // if i a new document is updates automatically by onsnapshot
  },[]);

  const signUp= (event)=> {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error)=>alert(error.message));// catch and error will giving us backend validation
    setOpen(false);
  }

  const signIn=(event)=>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error)=>alert(error.message))

    setOpenSignIn(false);
  }

  return (
    <div className="app">
       <div> 
      <Modal
        open={open}
        onClose={()=>setOpen(false)}>
        <Box sx={style}>
          <form className='app__signup'>
          <img className="app__headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""/>
        <Input placeholder="username" type="text" value={username}
        onChange={(e)=>setUsername(e.target.value)}/>
        <Input placeholder="email" type="text" value={email}
        onChange={(e)=>setEmail(e.target.value)}/>
        <Input placeholder="password" type="password" value={password}
        onChange={(e)=>setPassword(e.target.value)}/>
        <Button type="submit" onClick={signUp}>sign Up</Button>
        </form>
        </Box>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}>
        <Box sx={style}>
          <form className='app__signup'>
          <img className="app__headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""/>
        
        <Input placeholder="email" type="text" value={email}
        onChange={(e)=>setEmail(e.target.value)}/>
        <Input placeholder="password" type="password" value={password}
        onChange={(e)=>setPassword(e.target.value)}/>
        <Button type="submit" onClick={signIn}>sign In</Button>
        </form>
        </Box>
      </Modal>
      
    </div>
      <div className="app__header">
        <img className="app__headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""/>
        {user ? (
        <Button onClick={()=>auth.signOut()}>Logout</Button>
      ):(
        <div className="app__loginContainer">
        <Button onClick={()=>setOpenSignIn(true)}>sign IN</Button>
        <Button onClick={()=>setOpen(true)}>sign Up</Button>
        </div>
      )}
      </div>
      
      <div className="app__posts">
      {
        posts.map(({id, post}) => (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }
      </div>
      
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ): (
        <h3>sorry you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
