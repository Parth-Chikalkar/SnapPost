import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

import { ThemeProvider } from "./Context/ThemeContext.jsx";
import { AppProvider } from "./Context/AppContext.jsx";
import { PostProvider } from "./Context/PostContext.jsx";

createRoot(document.getElementById("root")).render(
    
    <BrowserRouter>
      <ThemeProvider>
        <AppProvider>
          <PostProvider>
            <App />
          </PostProvider>
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  
);
