<div align="center">

# 📁 Project Manager App

### Full-Stack Project & Task Management Platform

A web application designed to help users organize projects, track tasks, and manage development workflows through a simple and intuitive interface.

---

👩‍💻 **Created by Faith Burnett (FABDEV)**  
Full-Stack Developer • Data Engineering • Systems Integration

</div>

---

# Overview

The **Project Manager App** is a full-stack web application that allows users to create, organize, and track development projects in one centralized interface.

This project demonstrates key full-stack development concepts including:

• REST API design  
• frontend UI architecture  
• database integration  
• image storage and uploads  
• project and task management workflows  

The application was designed to simulate the type of internal tools teams use to manage development projects.

---

# System Architecture


Frontend (React)
↓
Backend API (Node / Express)
↓
Database (MongoDB)


The application follows a **typical MERN-style architecture** separating frontend UI, backend logic, and persistent storage.

---

# Key Features

### Project Management

Users can:

• create projects  
• update project details  
• delete projects  
• attach descriptions and technologies  
• add links to code repositories and live apps  

---

### Image Upload Support

Projects can include screenshots or preview images.

Images are stored using **cloud storage integration** and displayed in the application UI.

---

### REST API Backend

The backend service handles:

• project CRUD operations  
• file uploads  
• request validation  
• database interactions  

---

### Responsive UI

The frontend interface allows users to quickly view and manage projects with a clean, responsive layout.

---

# Project Structure


Project-Manager

│
├── client
│
│ ├── src
│ │
│ ├── components
│ │ ├── ProjectForm.jsx
│ │ ├── ProjectList.jsx
│ │ └── Navbar.jsx
│ │
│ ├── pages
│ │ └── Projects.jsx
│ │
│ └── App.jsx
│
├── server
│
│ ├── routes
│ │ └── projects.js
│ │
│ ├── controllers
│ │ └── projectController.js
│ │
│ ├── models
│ │ └── Project.js
│ │
│ └── server.js
│
└── package.json


---

# Tech Stack

| Category | Technology |
|--------|-------------|
| Frontend | React |
| Backend | Node.js |
| API Framework | Express |
| Database | MongoDB |
| Storage | Cloud image storage |
| Styling | CSS |
| Build Tool | Vite |

---

# Installation

### Clone the repository


git clone https://github.com/faithbrnttt/Project-Manager.git

cd Project-Manager


---

### Install dependencies

Install frontend dependencies


cd client
npm install


Install backend dependencies


cd ../server
npm install


---

# Running the Application

### Start the backend server


cd server
npm run dev


---

### Start the frontend


cd client
npm run dev


The app will start locally and connect the frontend to the API server.

---

# Example Project Object

Example JSON structure used by the API:


{
"title": "Hospital Integration Simulator",
"description": "Simulates healthcare device workflows",
"technologies": ["Python", "PostgreSQL", "Flask"],
"codeUrl": "https://github.com/example/repo
",
"appUrl": "https://example.com
",
"imageUrl": "/uploads/project.png"
}


---

# Screenshots

*(Add screenshots here for best GitHub presentation)*

Example sections:


Project Dashboard
Project Creation Form
Project Card Display


Screenshots dramatically improve recruiter engagement when viewing a repo.

---

# Use Cases

This project demonstrates engineering patterns relevant to:

• full-stack web development  
• REST API architecture  
• CRUD data management  
• UI component architecture  
• cloud storage integration  

---

# Future Improvements

Potential enhancements:

• user authentication  
• project collaboration  
• task management within projects  
• comments / activity logs  
• project analytics dashboard  
• drag-and-drop task boards  
• role-based permissions  

---

# Why I Built This

This application was built to explore full-stack architecture and demonstrate how modern web applications manage projects, tasks, and development workflows.

The project reflects my interests in:

• full-stack development  
• system architecture  
• productivity tools for engineering teams  
• scalable application design  

---

# Author

### Faith Burnett

Full-Stack Developer  
Data Engineering • Systems Integration

GitHub  
https://github.com/faithbrnttt

Portfolio  
https://faithburnett.dev

---

<div align="center">

### ⭐ If you found this project interesting, feel free to star the repo!

</div>
