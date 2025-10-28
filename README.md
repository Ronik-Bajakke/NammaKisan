# 🌾 NammaKisan – Farm-to-Consumer Platform  

![Banner](/assets/banner.png)

---

## 📖 Overview  

**NammaKisan** is a full-stack **Farm-to-Consumer web application** that connects **farmers directly with customers** — eliminating middlemen and ensuring fair prices.  
Built with **React, Node.js, Express, and MongoDB**, it enables farmers to **list their products**, and customers to **browse, order, and track deliveries** seamlessly.  

🔗 **Live Demo (Frontend)**: [NammaKisan on Render](https://nammakisan-frontend1.onrender.com)  
🔗 **Live Demo (Backend API)**: [API Endpoint](https://nammakisan-backend.onrender.com)  

---

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

```bash
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
---
## ⚡ Deployment  

Deployed using **Render** 🚀  

- **Frontend:** React app hosted as a static site  
- **Backend:** Node.js + Express API connected to MongoDB Atlas  

---

## 🧠 Environment Variables  

Create a `.env` file inside the **backend/** folder and add the following:  

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Clone repo
git clone https://github.com/yourusername/namma-kisan.git

# Go to backend
cd backend
npm install

# Start backend server
npm run dev
# Server will run on http://localhost:5000

👨‍💻 Author

Ronik Bajakke
💼 Aspiring MERN Stack Developer
🌐 Passionate about building meaningful, farmer-centric web solutions