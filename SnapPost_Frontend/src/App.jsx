import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import NavBar from './Components/NavBar'
import ProfilePage from './Pages/ProfilePage'
import EditProfile from './Pages/EditProfile'
import CreatePost from './Pages/CreatePost'
import PostDetail from './Pages/PostDetail'
import LoginPage from './Pages/LoginPage'
import SignupPage from './Pages/SignupPage'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedFile from './Components/ProtectedFile'
import UserProfile from './Pages/UserProfile'
import EditPost from './Pages/EditPost'
import NotFound from './Pages/404'

function App() {
  return (

    <>
    <NavBar/>
   <ToastContainer
  position="top-center"
  autoClose={2500}
  hideProgressBar
  newestOnTop
  closeOnClick
  pauseOnHover
  draggable
  theme="colored"
  toastClassName="!rounded-2xl !shadow-2xl !px-6 !py-4 !text-sm !font-medium backdrop-blur-md"
  bodyClassName="!flex !items-center !gap-3"
  className="mt-6 "
/>
    <Routes>
     <Route path='/' element={<HomePage/>} />

     <Route path='/profile' element={
      
      
      <ProtectedFile>
      
      
      <ProfilePage/>
      </ProtectedFile>
      
      }/>
      <Route path="/profile/:username" element={<ProtectedFile><UserProfile/></ProtectedFile>}/>
     <Route path='/edit' element={ <ProtectedFile><EditProfile/></ProtectedFile>}/> 
     <Route path='/createPost' element={ <ProtectedFile><CreatePost/></ProtectedFile>}/>
     <Route path='/postdetails/:id' element={ <ProtectedFile><PostDetail/></ProtectedFile>}/>
     <Route path='/edit-post/:id' element={ <ProtectedFile><EditPost/></ProtectedFile>}/>
     <Route path='/login' element={<LoginPage/>}/>
     <Route path='/signup' element={<SignupPage/>}/>
     <Route path="*" element={<NotFound/>} />
    </Routes>
    </>
  )
}

export default App