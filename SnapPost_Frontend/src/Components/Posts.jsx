import React from 'react'
import PostCardHome from './PostCardHome'
import { checkToken } from '../Utils/checkToken';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../API/api';
import Loader from './Loader';
function Posts() {
  
  const token = checkToken();
  const [posts, setposts] = useState([]);
  const [loading , setloading ] = useState(false);

  const getPosts = async ()=>{
    setloading(true);
   const res = await api.get('/post/all');
   if(res.data.success){
    setposts(res.data.posts);
   }
   else{
    toast.sucess("Internal Server Error");
   }
   setloading(false);
  }

  useEffect(()=>{getPosts()},[])
  
  return (

    <>
    
    {loading && <Loader/>}
    
    <main className="max-w-6xl  mx-auto px-4 pt-2 flex flex-col gap-8">
      {posts.map((elem)=><PostCardHome key={elem._id} data={elem}/>)}
       
       
         
     

     

      </main>
      </>
  )
}

export default Posts