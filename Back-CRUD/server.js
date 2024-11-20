const express = require('express');
const cors = require('cors');
const db = require('./controller/db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
    const query = 'SELECT * FROM productos';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Crear un nuevo producto
app.post('/api/productos', (req, res) => {
    const { nombre, descripcion, precio, cantidad } = req.body;
    
    // Verificar si el nombre del producto ya existe
    const checkQuery = 'SELECT * FROM productos WHERE nombre = ?';
    db.query(checkQuery, [nombre], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'El nombre del producto ya existe' });
        }

        // Insertar el nuevo producto si el nombre no existe
        const insertQuery = 'INSERT INTO productos (nombre, descripcion, precio, cantidad) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [nombre, descripcion, precio, cantidad], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: result.insertId, nombre, descripcion, precio, cantidad });
        });
    });
});

// Actualizar un producto
app.put('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, cantidad } = req.body;
    const query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, cantidad = ? WHERE id = ?';
    db.query(query, [nombre, descripcion, precio, cantidad, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Producto actualizado' });
    });
});

// Eliminar un producto
app.delete('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Producto eliminado' });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});