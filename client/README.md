# 🎓 Student Management System

A full-stack Student Management System built using the **MERN Stack**.

This project allows registered users to securely log in and manage their own student records. Each user's student data is separated using **JWT authentication** and **MongoDB user ownership**.

---

## 📌 Project Overview

The Student Management System is a web-based application designed to manage student information in an organized and user-friendly way.

Users can:

- Register an account
- Login securely
- View their profile
- Add students
- View students
- Edit student information
- Delete students
- Search students
- Filter students by course
- Filter students by department
- Logout securely

Each user can access **only their own student records**.

---

## 🚀 Features

### 🔐 User Authentication

- User Registration
- User Login
- JWT-based Authentication
- Password hashing using bcrypt
- User Profile
- Logout
- Protected student routes

### 👨‍🎓 Student Management

- Add Student
- View Students
- Update Student
- Delete Student
- Search by name or email
- Filter by course
- Filter by department

### 📊 Dashboard

The dashboard displays:

- Total Students
- Total Courses
- Total Departments
- Students grouped by Course
- Students grouped by Department

### 👤 User-Specific Data

Each student is connected to the user who created the record.

For example:

```text
User A
 ├── Student A1
 └── Student A2

User B
 ├── Student B1
 └── Student B2