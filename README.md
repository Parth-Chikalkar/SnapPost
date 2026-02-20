# <p align="center">SNAPPOST <span style="color: #6366f1;">v2.0</span></p>

<p align="center">
  <b>A Modern Full-Stack Social Media Experience</b><br/>
  <i>Built with the MERN Stack, featuring Glassmorphism UI, Smart Search, and Advanced Admin Controls.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

---

## 🔗 Live Demo

Experience the platform live:  
**[SnapPost Live Deployment](https://snappost-v2.vercel.app)**

---

## 💎 Version Evolution

This repository represents **v2.0** of SnapPost.  
This version introduces a complete architecture migration, transition from EJS to React, and a mobile-first UI strategy.

> **Legacy Build:** You can find the original EJS-based version here:  
> [SnapPost v1.0 Legacy 🔗](https://snappost-xvth.onrender.com)

---

## ✨ Key Features

### 🔐 Authentication & Security

- **JWT:** Secure token-based authentication.
- **Role-Based Access:** Dedicated Admin routes and protected middleware.
- **Ownership Validation:** Strict server-side checks for editing/deleting content.

---

### 📝 Content Management

- **MERN CRUD:** Create, read, update, and delete posts seamlessly.
- **Media Handling:** Image integration via Multer and Cloudinary storage.
- **Engagement:** Real-time like system and nested comment threads.

---

### 🔍 Smart Search & UI

- **Debounced API:** Optimized search functionality for reduced server load.
- **Mobile Search:** Full-screen modal search specifically designed for small viewports.
- **Theme Engine:** Instant Dark/Light mode toggle via React Context.

---

## 📂 Project Structure

### 🚀 Backend Architecture

```text
📦 SnapPost_Backend
 ┣ 📂 Cloudinary     # Cloud image storage configuration
 ┣ 📂 Controllers    # Business logic handlers
 ┣ 📂 Middleware     # Auth & Admin verification logic
 ┣ 📂 Models         # Mongoose Schemas (User, Post, Comment)
 ┣ 📂 uploads        # Local temporary file storage
 ┣ 📂 Utils          # Helper functions & token utilities
 ┣ 📂 views          # Admin EJS templates
 ┣ 📜 multer.js      # Middleware for handling multipart/form-data
 ┗ 📜 server.js      # Application entry point
```

---

### 🚀 Frontend Architecture

```text
📦 SnapPost_Frontend
 ┣ 📂 src
 ┃ ┣ 📂 API          # Axios instances and endpoint definitions
 ┃ ┣ 📂 assets       # Global static assets and icons
 ┃ ┣ 📂 Components   # Reusable UI elements (NavBar, Toast, Loader)
 ┃ ┣ 📂 Context      # Global state management (Theme, User)
 ┃ ┣ 📂 Pages        # Route components (Home, Profile, Admin)
 ┃ ┣ 📂 Sections     # Feature-specific page fragments
 ┃ ┣ 📂 Utils        # Formatting & Token validators
 ┃ ┣ 📜 App.jsx      # Main router and layout configuration
 ┃ ┗ 📜 index.css    # Global Tailwind and custom styles
 ┗ 📜 vite.config.js
```

---

## 🛠 Admin Terminal

- To access the terminal, the user should log in through admin credentials.
- **Unified Dashboard:** Real-time overview of all registered creators.
- **User Management:** Secure search and "Suspend/Remove" capabilities.
- **Cascade Logic:** Automated deletion of all associated posts and comments when a user is removed to ensure database integrity.

---

## 👨‍💻 Author

### Parth Chikalkar

---
