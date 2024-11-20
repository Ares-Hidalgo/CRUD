-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS gestioninventario;

-- Usar la base de datos
USE gestioninventario;

-- Crear la tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    precio DECIMAL(10, 2),
    cantidad INT
);

INSERT INTO productos (nombre, descripcion, precio, cantidad) VALUES
('Producto A', 'Descripción del producto A', 19.99, 10),
('Producto B', 'Descripción del producto B', 29.99, 5),
('Producto C', 'Descripción del producto C', 9.99, 20),
('Producto D', 'Descripción del producto D', 49.99, 15),
('Producto E', 'Descripción del producto E', 39.99, 8),
('Producto F', 'Descripción del producto F', 24.99, 12),
('Producto G', 'Descripción del producto G', 14.99, 25),
('Producto H', 'Descripción del producto H', 59.99, 7),
('Producto I', 'Descripción del producto I', 34.99, 18),
('Producto J', 'Descripción del producto J', 44.99, 9),
('Producto K', 'Descripción del producto K', 54.99, 11),
('Producto L', 'Descripción del producto L', 64.99, 6),
('Producto M', 'Descripción del producto M', 74.99, 14),
('Producto N', 'Descripción del producto N', 84.99, 3),
('Producto O', 'Descripción del producto O', 94.99, 13),
('Producto P', 'Descripción del producto P', 104.99, 4),
('Producto Q', 'Descripción del producto Q', 114.99, 2),
('Producto R', 'Descripción del producto R', 124.99, 16),
('Producto S', 'Descripción del producto S', 134.99, 1),
('Producto T', 'Descripción del producto T', 144.99, 19),
('Producto U', 'Descripción del producto U', 154.99, 17),
('Producto V', 'Descripción del producto V', 164.99, 22),
('Producto W', 'Descripción del producto W', 174.99, 21),
('Producto X', 'Descripción del producto X', 184.99, 23),
('Producto Y', 'Descripción del producto Y', 194.99, 24);