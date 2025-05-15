# Product Review & Rating Platform

This is a full-stack web application built for the **CS472 Final Project - May 2025**. It allows users to browse products, post reviews, and rate products. The platform is built with **Vite + React + TypeScript** on the client side and **Node.js + Express + MySQL** on the server side.

---

## 📂 Project Structure

```
project-root/
├── client/       # Frontend (Vite + React + TypeScript + Tailwind CSS)
└── server/       # Backend (Node.js + Express + MySQL)
```

---

## 🚀 How to Run the Project

### 1. Setup MySQL Database

- Create a database named `product_review`.
- Run the SQL script below to create the required tables and insert sample data.

### 2. Start the Server

```bash
cd server
npm install
npm start
```

> The server will run on [http://localhost:3001](http://localhost:3001)

### 3. Start the Client

```bash
cd client
npm install
npm run dev
```

> The client will run on [http://localhost:5173](http://localhost:5173)

---

## 🛠 SQL Initialization Scripts

### 📌 Create Tables

```sql
CREATE DATABASE IF NOT EXISTS product_review;
USE product_review;

-- Products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  price DECIMAL(12,2),
  image VARCHAR(255),
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  averageRating DECIMAL(3,2) DEFAULT 0.0
);

-- Reviews table
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productId INT NOT NULL,
  author VARCHAR(100),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES products(id)
);
```

---

### 📌 Sample Data

```sql
-- Products
INSERT INTO products (name, description, category, price, image)
VALUES
('iPhone 15 Pro', 'Apple flagship phone', 'Phone', 999.00, '/images/iphone15.jpg'),
('MacBook Air M3', 'Lightweight powerful laptop', 'Laptop', 1299.00, '/images/macbookm3.jpg'),
('AirPods Pro', 'Noise-cancelling earbuds', 'Audio', 249.00, '/images/airpodspro.jpg');

-- Reviews
INSERT INTO reviews (productId, author, rating, comment)
VALUES
(1, 'Dylan', 5, 'Gooooood!!!!'),
(2, 'David', 4, 'Great machine, but I miss more ports.'),
(2, 'Charlie', 5, 'Super lightweight and fast.'),
(3, 'Eve', 5, 'Fantastic noise cancellation!'),
(3, 'Frank', 4, 'Comfortable and great sound quality.');
```

---

## Features

- Browse product list with image, price, and average rating
- Search by name and filter by category
- View product detail with full reviews
- Add, update, and delete reviews
- Dynamic star rating display
- Auto updates average product rating after review changes
- Fully responsive and modern UI

---

## 👨‍💼 Author

Haining Song — CS472 Spring 2025 @ MIU
Email: [dylan.song0811@gmail.com](mailto:dylan.song0811@gmail.com)
