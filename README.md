✨ Initial commit: User Management System with authentication, dashboard, CRUD operations, profile management, and responsive admin UI

# 👥 User Management System

A modern and responsive **User Management System** built as part of the **ApexPlanet Internship - Task 3 (Backend Development & Database Integration)**.

The application provides a clean admin dashboard with authentication, user management, profile management, and role-based access control.

---

## 🚀 Live Preview

> Add your deployed website link here

```
https://your-live-demo-link.com
```

---

## 📸 Screenshots

### 🔐 Login Page

- Secure authentication
- Remember Me
- Password visibility toggle

### 📊 Dashboard

- User statistics
- Recent users
- Analytics cards
- Quick actions

### 👥 User Management

- Add User
- Edit User
- Delete User
- Search users
- Filter by role

### 👤 Profile Management

- Update profile
- Upload profile picture
- Change password

---

## ✨ Features

- 🔐 Secure Login & Registration
- 👤 User Authentication
- 📊 Modern Admin Dashboard
- 👥 User Management
- ➕ Add Users
- ✏️ Edit Users
- 🗑 Delete Users
- 🔎 Search Users
- 🎭 Role-Based Access (Admin/User)
- 📷 Profile Image Upload
- 📱 Fully Responsive Design
- 🌙 Modern UI Components
- ⚡ Fast Performance
- 🎨 Beautiful Dashboard Design

---

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- ShadCN UI
- TanStack Router
- Lucide Icons

### Backend

- PHP
- MySQL

### Tools

- Git
- GitHub
- VS Code
- XAMPP

---

## 📁 Project Structure

```text
src/
 ├── components/
 ├── hooks/
 ├── lib/
 ├── routes/
 ├── styles.css
 ├── router.tsx
 └── start.ts

public/

README.md
package.json
vite.config.ts
tsconfig.json
```

---

## 🔑 Authentication

- Login
- Registration
- Logout
- Protected Routes
- Session Management

---

## 👥 User Roles

### Admin

- Add Users
- Edit Users
- Delete Users
- View Dashboard
- Manage Profiles

### User

- View Dashboard
- Edit Own Profile

---

## 📷 Profile Management

- Upload Profile Picture
- Change Password
- Update Personal Information

---

## 🎯 Dashboard Modules

- Total Users
- Admin Count
- User Count
- Recent Users
- User Statistics
- Quick Actions

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/your-username/user-management-system.git
```

Go to the project folder

```bash
cd user-management-system
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

---

## 📌 Future Improvements

- Email Verification
- Forgot Password
- Dark Mode
- Export Users (PDF/Excel)
- Activity Logs
- Notifications
- Two-Factor Authentication

---

## 📚 Internship Information

**Internship:** ApexPlanet Software Pvt. Ltd.

**Task:** Task 3 – Backend Development & Database Integration

---

## 👨‍💻 Author

**M Leela Sai Aditya**

GitHub: https://github.com/your-username

LinkedIn: https://linkedin.com/in/your-profile

---

## ⭐ Support

If you like this project, don't forget to ⭐ star the repository.

# Routes

TanStack Start uses **file-based routing**. Every `.tsx` file in this directory
defines a route. Do **not** create `src/pages/`, `src/routes/_app/index.tsx`, or
`app/layout.tsx` — those are Next.js / Remix conventions. The only root layout
is `src/routes/__root.tsx`.

## Conventions

| File | URL |
| --- | --- |
| `index.tsx` | `/` |
| `about.tsx` | `/about` |
| `users/index.tsx` | `/users` |
| `users/$id.tsx` | `/users/:id` (dynamic — bare `$`, no curly braces) |
| `posts/{-$category}.tsx` | `/posts/:category?` (optional segment) |
| `files/$.tsx` | `/files/*` (splat — read via `_splat` param, never `*`) |
| `_layout.tsx` | layout route (renders children via `<Outlet />`) |
| `__root.tsx` | app shell — wraps every page; preserve `<Outlet />` |

`routeTree.gen.ts` is auto-generated. Don't edit it by hand.
