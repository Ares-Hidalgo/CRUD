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

// Rutas de pedidos
app.get('/api/orders', (req, res) => {
    db.query('SELECT * FROM Orders', (err, results) => {
        if (err) {
            return res.status(500).send('Error en la consulta a la base de datos');
        }
        res.json(results);
    });
});

app.post('/api/orders', (req, res) => {
    const {
        customerName, contact, deliveryAddress, tableNumber, orderMode, subtotal, tip, taxes, discount, total, paymentMethod, paymentStatus
    } = req.body;
    const query = `
        INSERT INTO Orders (customerName, contact, deliveryAddress, tableNumber, orderMode, subtotal, tip, taxes, discount, total, paymentMethod, paymentStatus)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [customerName, contact, deliveryAddress, tableNumber, orderMode, subtotal, tip, taxes, discount, total, paymentMethod, paymentStatus], (err, result) => {
        if (err) {
            console.error('Error al agregar el pedido:', err);
            return res.status(500).json({ error: 'Error al agregar el pedido' });
        }
        res.status(201).json({ id: result.insertId, customerName, total, status: 'pending' });
    });
});

app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    const query = `
        UPDATE Orders SET status = ?, paymentStatus = ?
        WHERE id = ?
    `;
    db.query(query, [status, paymentStatus, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el pedido:', err);
            return res.status(500).json({ error: 'Error al actualizar el pedido' });
        }

        // Si el pedido se marca como pagado, registrar la venta
        if (paymentStatus === 'paid') {
            const saleQuery = `
                INSERT INTO Sales (orderId, customerName, total, paymentMethod)
                SELECT id, customerName, total, paymentMethod FROM Orders WHERE id = ?
            `;
            db.query(saleQuery, [id], (err, saleResult) => {
                if (err) {
                    console.error('Error al registrar la venta:', err);
                    return res.status(500).json({ error: 'Error al registrar la venta' });
                }
                res.json({ message: 'Pedido actualizado y venta registrada' });
            });
        } else {
            res.json({ message: 'Pedido actualizado' });
        }
    });
});

app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Orders WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el pedido:', err);
            return res.status(500).json({ error: 'Error al eliminar el pedido' });
        }
        res.json({ message: 'Pedido eliminado' });
    });
});

// Rutas de usuarios
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).send('Error en la consulta a la base de datos');
        }
        res.json(results);
    });
});

app.post('/register', (req, res) => {
    const { username, email, document, password } = req.body;
    const rol = 'client';
    const query = 'INSERT INTO users (name, email, document, rol, pass) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [username, email, document, rol, password], (err, result) => {
        if (err) {
            console.error('Error al registrar el usuario:', err);
            return res.status(500).json({ error: 'Error al registrar el usuario' });
        }
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND pass = ?';
    
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error al iniciar sesión:', err);
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
        
        if (results.length > 0) {
            const user = results[0];
            res.status(200).json({ message: 'Inicio de sesión exitoso', username: user.name });
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    });
});

// Rutas de productos
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM Inventory', (err, results) => {
        if (err) {
            return res.status(500).send('Error en la consulta a la base de datos');
        }
        res.json(results);
    });
});

app.post('/api/products', (req, res) => {
    const { name, quantity, unit, alertLevel } = req.body;
    const query = 'INSERT INTO Inventory (name, quantity, unit, alertLevel) VALUES (?, ?, ?, ?)';
    db.query(query, [name, quantity, unit, alertLevel], (err, result) => {
        if (err) {
            console.error('Error al agregar el producto:', err);
            return res.status(500).json({ error: 'Error al agregar el producto' });
        }
        res.status(201).json({ id: result.insertId, name, quantity, unit, alertLevel });
    });
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Inventory WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el producto:', err);
            return res.status(500).json({ error: 'Error al eliminar el producto' });
        }
        res.json({ message: 'Producto eliminado' });
    });
});

// Ruta para obtener las ventas
app.get('/api/sales', (req, res) => {
    const query = 'SELECT * FROM Sales';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener las ventas:', err);
            return res.status(500).json({ error: 'Error al obtener las ventas' });
        }
        res.json(results);
    });
});

// Rutas de menú
app.get('/api/menu', (req, res) => {
    db.query('SELECT * FROM Menu WHERE available = TRUE', (err, results) => {
        if (err) {
            console.error('Error al obtener el menú:', err);
            return res.status(500).json({ error: 'Error al obtener el menú' });
        }
        res.json(results);
    });
});

app.post('/api/menu', (req, res) => {
    const { name, description, price, available } = req.body;
    const query = 'INSERT INTO Menu (name, description, price, available) VALUES (?, ?, ?, ?)';
    db.query(query, [name, description, price, available], (err, result) => {
        if (err) {
            console.error('Error al agregar el producto al menú:', err);
            return res.status(500).json({ error: 'Error al agregar el producto al menú' });
        }
        res.status(201).json({ id: result.insertId, name, description, price, available });
    });
});

app.put('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, available } = req.body;
    const query = 'UPDATE Menu SET name = ?, description = ?, price = ?, available = ? WHERE id = ?';
    db.query(query, [name, description, price, available, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el producto del menú:', err);
            return res.status(500).json({ error: 'Error al actualizar el producto del menú' });
        }
        res.json({ message: 'Producto del menú actualizado' });
    });
});

app.delete('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Menu WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el producto del menú:', err);
            return res.status(500).json({ error: 'Error al eliminar el producto del menú' });
        }
        res.json({ message: 'Producto del menú eliminado' });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});