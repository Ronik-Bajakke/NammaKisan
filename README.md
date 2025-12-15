# 🌾 NammaKisan – Farm-to-Consumer Platform  

![Banner](/assets/banner.png)

---

## ⚠️ Important Note

This repository serves as a **public showcase** of my startup project **NammaKisan**.  
The full project source code is **private** to protect intellectual property and prevent misuse.  

Recruiters and collaborators can:
- 🌐 **Visit the live deployed version** (Frontend)  
- 🎥 **Watch the demo videos below** for complete functionality  
- 📧 **Email me** at **ronikbajakke172913@gmail.com** if you’d like to view the code privately for evaluation purposes.  

🧑‍💼 **Demo Admin Login Credentials (for live site)**  
- **Email:** `ronikbajakke@gmail.com`  
- **Password:** `SadalgaNammakisan@591239`  


## 📖 Overview  

**NammaKisan** is a full-stack **Farm-to-Consumer web application** that connects **farmers directly with customers** — eliminating middlemen and ensuring fair prices.  
Built with **React, Node.js, Express, and MongoDB**, it enables farmers to **list their products**, and customers to **browse, order, and track deliveries** seamlessly.  

🔗 **Live Demo (Frontend)**: [NammaKisan on Render](https://nammakisan-frontend1.onrender.com)   

---
## ▶️ Project Demo Video

## Part1
https://github.com/user-attachments/assets/2f3c979f-0a68-4976-bd5f-8c99e78878fc



## Part2
https://github.com/user-attachments/assets/95eb8a23-c9bd-4346-aeed-0c974e265436



## Part3
https://github.com/user-attachments/assets/772ae6cf-5f52-45d4-a76d-f4fe2483c201






## 🚀 Features  

### 🧑‍💼 Admin  
- Login only with credentials set in backend.  
- Add products with farmer name, mobile number, address, price/kg, minimum quantity, and image.  
- Manage all orders — accept or cancel with reason.  
- View all customers and their order history.  
- View all farmers, their listings (active/sold out), and total products.  
- Track sales (Today, Monthly, Yearly, All-time).  

---

### 👨‍🌾 Farmer  
- Login using admin-provided password and registered mobile number.  
- Add, edit, or remove farm produce with images and details.  
- View own listings and order requests.  
- Check product status (listed or sold out).  

---

### 🛒 Customer  
- Sign up or log in to browse available farm products.  
- Filter by category (Fruits, Vegetables, Others).  
- Add to cart, update items, or remove from cart.  
- Place orders with delivery address.  
- Track order status (Pending, Accepted, Rejected, Delivered).  

---

### 🔐 General  
- Secure JWT-based authentication for all user roles.  
- Cloudinary integration for image uploads.  
- Responsive dashboards for Admin, Farmer, and Customer.  
- Full deployment on Render (frontend + backend).  

---

## 🖼️ Screenshots  

### 🧑‍💼 Admin  
- **Dashboard Overview**  
  ![Admin Dashboard](/assets/admindashboard.png)  
- **Add Product Page**  
  ![Add Product](/assets/adminaddproduct.png)  
- **Orders Management**  
  ![Admin Orders](/assets/adminorders.png)  

---

### 👨‍🌾 Farmer  
- **Farmer Dashboard**  
  ![Farmer Dashboard](/assets/farmerdashboard.png)  

---

### 🛒 Customer  
- **Customer Dashboard**  
  ![Customer Dashboard](/assets/customerdashboard.png)  
- **Cart Page**  
  ![Customer Cart](/assets/customercart.png)  

---

## 🛠️ Tech Stack  

| Layer | Technologies Used |
|--------|--------------------|
| **Frontend** | React.js, Axios, React Router, CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT (JSON Web Token) |
| **Image Uploads** | Cloudinary + Multer |
| **Deployment** | Render (Frontend + Backend) |

---

## 🧩 Project Structure  

```
NammaKisan/
├── backend/
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routes (Farmer, Customer, Admin)
│   ├── middleware/       # Auth middleware
│   ├── config/           # Cloudinary & MongoDB configs
│   ├── server.js         # Entry point
│   └── .env              # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/        # React pages (Dashboard, Login, Signup, etc.)
│   │   ├── components/   # Reusable UI components
│   │   ├── assets/       # Images, CSS, etc.
│   │   └── api.js        # API base config
│   ├── package.json
│   └── README.md
│
└── README.md             # This file
```

---

## ⚡ Deployment
- Deployed using Render 🚀
- Frontend: React app hosted as a static site
- Backend: Node.js + Express API connected to MongoDB Atlas


## 💻 How to Run Locally
1. Clone repo
```bash
git clone https://github.com/Ronik-Bajakke/NammaKisan.git
```
2. Go to backend
```bash
cd backend
npm install
```
3. Start backend server
```bash
npm run dev
```
4. Server will run on http://localhost:5000
```bash
Open a new terminal and run the frontend:
```
5. Go to frontend
```bash
cd ../frontend
npm install
```
6. Start frontend
```bash
npm start
App will run on http://localhost:3000
```

## 👨‍💻 Author  

**Ronik Bajakke**  
💼 Aspiring MERN Stack Developer  
🌐 Passionate about building meaningful, farmer-centric web solutions 
📧 Email: ronikbajakke172913@gmail.com
🌐 Portfolio: https://portfolio-nine-lyart-56.vercel.app/
