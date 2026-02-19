import React from 'react';
import NavBar from '../Components/NavBar';
import PostCardHome from '../Components/PostCardHome';
import { useTheme } from "../Context/ThemeContext";
import { checkToken } from '../Utils/checkToken';
import HomeSection from '../Sections/HomeSection';
import Posts from '../Components/Posts';

function HomePage() {
  const { dark } = useTheme();
  const token = checkToken();
  return (
    <div className={`min-h-screen pt-20 transition-colors duration-300 ${dark ? "bg-zinc-950" : "bg-zinc-50"}`}>
    
      

    {token ? ( <Posts/> ) : (
      <HomeSection/>
      ) }
      
    </div>
  );
}

export default HomePage;