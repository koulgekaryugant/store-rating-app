# ⭐ Store Rating and Management System - (RateIt ⭐)

A full-stack web application that allows users to register, log in, and submit ratings for stores registered on the platform. The system supports multiple user roles — **System Administrator**, **Normal User**, and **Store Owner** — each with different access permissions and dashboards.

---

## 📘 Table of Contents

1. [Project Overview](#project-overview)
2. [User Roles & Functionalities](#user-roles--functionalities)

   * [System Administrator](#system-administrator)
   * [Normal User](#normal-user)
   * [Store Owner](#store-owner)
3. [Form Validations](#form-validations)
4. [Tech Stack](#tech-stack)
5. [Project Setup](#project-setup)

   * [Backend Setup](#backend-setup)
   * [Frontend Setup](#frontend-setup)
6. [Environment Variables](#environment-variables)
7. [Folder Structure](#folder-structure)
8. [Scripts](#scripts)
9. [Deployment](#deployment)

---

## 🧩 Project Overview

This system provides a seamless platform where users can register as either **Normal Users** or **Store Owners**, while a **System Administrator** manages and monitors the platform.
Users can submit ratings for stores, and store owners can view ratings for their stores. Administrators can view system analytics and manage all entities.

---

## 👥 User Roles & Functionalities

### 🛠 System Administrator

* Add new **stores**, **normal users**, and **admin users**.
* Access dashboard displaying:

  * Total number of users
  * Total number of stores
  * Total number of submitted ratings
* Add new users with:

  * Name
  * Email
  * Password
  * Address
* View a list of all stores including:

  * Name, Email, Address, Rating
* View list of all users:

  * Name, Email, Address, Role
* Apply filters on all listings by **Name**, **Email**, **Address**, or **Role**.
* View details of all users (if the user is a Store Owner, their Rating is displayed).
* Log out from the system.

---

### 👤 Normal User

* Can sign up and log in to the platform.
* **Signup Form Fields:**

  * Name
  * Email
  * Address
  * Password
* Update their password after login.
* View a list of all registered stores.
* Search for stores by **Name** and **Address**.
* Store listings display:

  * Store Name
  * Address
  * Overall Rating
  * User’s Submitted Rating
  * Option to **submit** or **update** rating
* Submit ratings between **1 to 5** for individual stores.
* Log out from the system.

---

### 🏪 Store Owner

* Can log in to the platform.
* Can update their password after login.
* Dashboard functionalities:

  * View list of users who have rated their store.
  * View average rating of their store.
* Can log out from the system.

---

## ✅ Form Validations

| Field        | Rules                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------- |
| **Name**     | Minimum **3 characters**, Maximum **60 characters**                                           |
| **Address**  | Maximum **400 characters**                                                                    |
| **Password** | 8–16 characters, must contain **at least one uppercase letter** and **one special character** |
| **Email**    | Must follow standard email format validation                                                  |

---

## 💻 Tech Stack

### Frontend

* ReactJS (with TailwindCSS)
* React Router DOM
* Axios
* React Hot Toast
* LocalStorage for persistence

### Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Bcrypt.js for password hashing
* dotenv for environment management

---

## ⚙️ Project Setup

### 🔹 Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file:

   ```env
   DATABASE_URL=postgresql://storeratedb_user:YOUR_PASSWORD@dpg-d3mhe2ogjchc73d5atjg-a.oregon-postgres.render.com/storeratedb
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```
4. Run Prisma migrations:

   ```bash
   npx prisma migrate deploy
   ```
5. Seed the database with default users (System Admin, Store Owner, Normal User):

   ```bash
   npx ts-node prisma/seed.ts
   ```
6. Start the backend server:

   ```bash
   npm start
   ```

   The backend will run at **[https://store-rating-app-3-1umv.onrender.com](https://store-rating-app-3-1umv.onrender.com)**

---

### 🔹 Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file:

   ```env
   REACT_APP_API_URL=https://store-rating-app-3-1umv.onrender.com/api
   ```
4. Start the frontend server:

   ```bash
   npm start
   ```

   The frontend will run at **[https://store-rating-app-green.vercel.app](https://store-rating-app-green.vercel.app)**

---

## 🌍 Environment Variables

| Variable            | Description                           |
| ------------------- | ------------------------------------- |
| `DATABASE_URL`      | Database connection string for Prisma |
| `JWT_SECRET`        | Secret key for JWT token signing      |
| `PORT`              | Backend server port                   |
| `REACT_APP_API_URL` | Base URL for backend API              |

---

## 📁 Folder Structure

```
project-root/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── prisma/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── App.css
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🧾 Scripts

### Backend

| Command                      | Description                      |
| ---------------------------- | -------------------------------- |
| `npm start`                  | Start the backend server         |
| `npx prisma migrate dev`     | Run Prisma migrations            |
| `npx prisma migrate deploy`  | Apply migrations to live DB      |
| `npx ts-node prisma/seed.ts` | Seed database with default users |
| `npx prisma studio`          | Open Prisma GUI                  |

### Frontend

| Command         | Description               |
| --------------- | ------------------------- |
| `npm start`     | Start the frontend (CRA)  |
| `npm run dev`   | Start the frontend (Vite) |
| `npm run build` | Build for production      |

---

## 🚀 Deployment

* **Frontend**: [https://store-rating-app-green.vercel.app](https://store-rating-app-green.vercel.app)
* **Backend**: [https://store-rating-app-3-1umv.onrender.com](https://store-rating-app-3-1umv.onrender.com)
* **GitHub Repository**: [https://github.com/Saichandanyadav/store-rating-app](https://github.com/Saichandanyadav/store-rating-app)

---

## 👨‍💻 Author

**Sai Chandan Yadav**
Full Stack Developer | Coder
🔗 [LinkedIn](https://www.linkedin.com/in/saichandanyadav/)
