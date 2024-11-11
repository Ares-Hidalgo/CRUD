CREATE DATABASE Aurora;

USE Aurora;

-- Tabla de Inventario
CREATE TABLE Inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit VARCHAR(50),
    alertLevel INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Orders
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerName VARCHAR(255) NOT NULL,
    contact VARCHAR(255),
    deliveryAddress VARCHAR(255),
    tableNumber INT,
    orderMode ENUM('dine-in', 'delivery') NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tip DECIMAL(10, 2),
    taxes DECIMAL(10, 2),
    discount DECIMAL(10, 2),
    total DECIMAL(10, 2) NOT NULL,
    paymentMethod ENUM('cash', 'card') NOT NULL,
    paymentStatus ENUM('pending', 'paid') NOT NULL,
    status ENUM('pending', 'completed') DEFAULT 'pending'
);

-- Tabla Sales
CREATE TABLE Sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT,
    customerName VARCHAR(255) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    paymentMethod ENUM('cash', 'card') NOT NULL,
    saleDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES Orders(id)
);

-- Tabla Users
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    document VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    rol ENUM('client', 'admin') DEFAULT 'client'
);

-- Tabla Inventory
CREATE TABLE Inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit VARCHAR(50),
    alertLevel INT
);

-- Tabla Menu
CREATE TABLE Menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    available BOOLEAN DEFAULT TRUE
);