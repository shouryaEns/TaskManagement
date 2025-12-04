TaskFlow Pro – Task Management System

A full-stack task management platform that allows users to create, assign, track, update, and manage tasks with role-based access. This application is designed to demonstrate real-world backend architecture, frontend UI/UX implementation, authentication security, and cloud deployment.

Backend:
Node.js + Express.js
MongoDB + Mongoose
JWT Authentication & Authorization
JOI Request Validation
Winston Logging
Environment Management with Dotenv
Hosted on Vercel Serverless Functions
Cloud Database: MongoDB Atlas


Frontened:
React 18.2.0 - Modern React with Hooks (useState, useEffect)
JavaScript (ES6+) - Arrow functions, async/await, destructuring
CSS3 - Custom utility classes (Tailwind-inspired approach)
Lucide React - Modern icon library for UI components
State Management
React Hooks - useState for local component state
useEffect - Side effects and data fetching
localStorage - Client-side session persistence
API Integration
Fetch API - RESTful API communication
JWT Bearer Tokens - Secure authentication
Error Handling - Try-catch with user-friendly messages


Key Features
Authentication
✔ User Registration & Login
✔ Password Hashing using Bcrypt
✔ JWT-based Authentication
✔ Role-Based Authorization (Admin, User)

Task Management
✔ Create Tasks with Priority, Status, and Deadline
✔ Update & Delete Tasks
✔ Assign tasks automatically to logged-in user
✔ Task visibility restricted to:

Task Creator
Task Assignee

Admin
Task Analytics
✔ View tasks by status: todo | in-progress | done
✔ Admins can view all status analytics
✔ Users can view analytics only for:

Tasks they created
Tasks assigned to them

Validation
✔ Backend validation using Joi
✔ Prevents invalid data submission

Security
✔ Token-based protected routes
✔ User cannot edit others' tasks
✔ No file write in serverless logs
✔ Restricted access based on role