# 🌾 NammaKisan – Farm-to-Consumer Platform  

![Banner](/assets/banner.png)

---

## 📖 Overview  

**NammaKisan** is a full-stack **Farm-to-Consumer web application** that connects **farmers directly with customers** — eliminating middlemen and ensuring fair prices.  
Built with **React, Node.js, Express, and MongoDB**, it enables farmers to **list their products**, and customers to **browse, order, and track deliveries** seamlessly.  

🔗 **Live Demo (Frontend)**: [NammaKisan on Render](https://your-frontend.onrender.com)  
🔗 **Live Demo (Backend API)**: [API Endpoint](https://your-backend.onrender.com/api)  

---

## 🚀 Features  

### 👨‍🌾 Farmer Module  
- Farmer **sign up / log in** securely  
- Add new **farm produce** with:
  - Product name  
  - Image (Cloudinary upload)  
  - Price, category, description  
- View, edit, or delete listed products  
- Track **orders received** from customers  

---

### 🛒 Customer Module  
- Customer **sign up / log in**  
- Browse all available products  
- Filter by category (**Fruits, Vegetables, Others**)  
- Add items to cart and place orders  
- View **order history** and status  

---

### 🧑‍💼 Admin Module  
- View all registered **farmers** and **customers**  
- Manage **products** and **orders**  
- Track total delivered orders, customers, and farmers  

---

### ⚙️ Other Features  
- JWT-based authentication for all users  
- Secure REST API routes  
- Image uploads via **Cloudinary** + **Multer**  
- Realtime dashboard for admin insights  
- Deployed seamlessly on **Render**  

---

## 🖼️ Screenshots  

### 🌱 Farmer Dashboard  
![Farmer Dashboard](/assets/farmer-dashboard.png)

### 🛒 Customer Dashboard  
![Customer Dashboard](/assets/customer-dashboard.png)

### 🧑‍💼 Admin Panel  
![Admin Panel](/assets/admin-panel.png)

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
⚡ Deployment
Deployed using Render 🚀

Frontend: React app hosted as a static site

Backend: Node.js Express API connected to MongoDB Atlas

Auto Deploys from GitHub can be enabled or disabled anytime in Render settings

🧠 Environment Variables
Create a .env file inside backend/:

env
Copy code
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
📦 How to Run Locally
bash
Copy code
# Clone repo
git clone https://github.com/yourusername/namma-kisan.git

# Go to backend
cd backend
npm install

# Start backend server
npm run dev
# Server will run on http://localhost:5000

# In another terminal, go to frontend
cd ../frontend
npm install

# Start frontend
npm start
# App will run on http://localhost:3000
👨‍💻 Author
Ronik Bajakke
💼 Aspiring MERN Stack Developer
🌐 Passionate about building meaningful, farmer-centric web solutions