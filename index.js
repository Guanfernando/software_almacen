const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Inicia el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Ruta para registrar un nuevo usuario
app.post('/api/register', async (req, res) => {
    const { documento, correo, password } = req.body;
    if (!documento || !correo || !password) {
        return res.status(400).json({ message: 'Por favor, complete todos los campos' });
    }

    try {
        // Encripta la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Inserta el nuevo usuario en la base de datos
        db.query('INSERT INTO usuarios (documento, correo, password) VALUES (?, ?, ?)', 
                [documento, correo, hashedPassword], 
                (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'El usuario ya existe' });
                }
                return res.status(500).json({ message: 'Error al registrar el usuario' });
            }
            res.status(201).json({ message: 'Usuario registrado con éxito' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Ruta para iniciar sesión
app.post('/api/login', (req, res) => {
    const { documento, password } = req.body;
    if (!documento || !password) {
        return res.status(400).json({ message: 'Por favor, complete todos los campos' });
    }

    // Verifica si el usuario existe
    db.query('SELECT * FROM usuarios WHERE documento = ?', [documento], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Verifica la contraseña
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Genera un token JWT
        const token = jwt.sign({ documento: user.documento }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Inicio de sesión exitoso', token });
    });
});

// Ruta para obtener todos los clientes
app.get('/api/clientes', (req, res) => {
    db.query('SELECT * FROM clientes', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener los clientes' });
        }
        res.json(results);
    });
});

// Ruta para obtener un cliente por número de documento
app.get('/api/clientes/:numero_documento', (req, res) => {
    const { numero_documento } = req.params;
    db.query('SELECT * FROM clientes WHERE numero_documento = ?', [numero_documento], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener el cliente' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(results[0]);
    });
});

// Ruta para crear un nuevo cliente
app.post('/api/clientes', (req, res) => {
    const { tipo_documento, numero_documento, nombres, apellidos, fecha_nacimiento, telefono, email, departamento, municipio, direccion } = req.body;
    const sql = 'INSERT INTO clientes (tipo_documento, numero_documento, nombres, apellidos, fecha_nacimiento, telefono, email, departamento, municipio, direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [tipo_documento, numero_documento, nombres, apellidos, fecha_nacimiento, telefono, email, departamento, municipio, direccion], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error al crear el cliente' });
        }
        res.status(201).json({ message: 'Cliente creado exitosamente' });
    });
});

// Ruta para actualizar un cliente existente
app.put('/api/clientes/:numero_documento', (req, res) => {
    const { numero_documento } = req.params;
    const { tipo_documento, nombres, apellidos, fecha_nacimiento, telefono, email, departamento, municipio, direccion } = req.body;
    const sql = 'UPDATE clientes SET tipo_documento = ?, nombres = ?, apellidos = ?, fecha_nacimiento = ?, telefono = ?, email = ?, departamento = ?, municipio = ?, direccion = ? WHERE numero_documento = ?';
    db.query(sql, [tipo_documento, nombres, apellidos, fecha_nacimiento, telefono, email, departamento, municipio, direccion, numero_documento], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error al actualizar el cliente', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente actualizado exitosamente' });
    });
});


// Ruta para eliminar un cliente
app.delete('/api/clientes/:numero_documento', (req, res) => {
    const { numero_documento } = req.params;
    db.query('DELETE FROM clientes WHERE numero_documento = ?', [numero_documento], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar el cliente' });
        }
        res.json({ message: 'Cliente eliminado exitosamente' });
    });
});


// Ruta para obtener todos los productos
app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener los productos' });
        }
        res.json(results);
    });
});

// Ruta para obtener un producto por su código
app.get('/api/productos/:codigo', (req, res) => {
    const { codigo } = req.params;
    db.query('SELECT * FROM productos WHERE codigo = ?', [codigo], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener el producto' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(results[0]);
    });
});

// Ruta para crear un nuevo producto
app.post('/api/productos', (req, res) => {
    const { descripcion, cantidad, vr_unitario } = req.body;
    const vr_total = cantidad * vr_unitario;
    const sql = 'INSERT INTO productos (descripcion, cantidad, vr_unitario, vr_total) VALUES (?, ?, ?, ?)';
    db.query(sql, [descripcion, cantidad, vr_unitario, vr_total], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error al crear el producto' });
        }
        res.status(201).json({ message: 'Producto creado exitosamente' });
    });
});

// Ruta para actualizar un producto existente
app.put('/api/productos/:codigo', (req, res) => {
    const { codigo } = req.params;
    const { descripcion, cantidad, vr_unitario } = req.body;
    const vr_total = cantidad * vr_unitario;
    const sql = 'UPDATE productos SET descripcion = ?, cantidad = ?, vr_unitario = ?, vr_total = ? WHERE codigo = ?';
    db.query(sql, [descripcion, cantidad, vr_unitario, vr_total, codigo], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error al actualizar el producto' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado exitosamente' });
    });
});

// Ruta para eliminar un producto
app.delete('/api/productos/:codigo', (req, res) => {
    const { codigo } = req.params;
    db.query('DELETE FROM productos WHERE codigo = ?', [codigo], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar el producto' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado exitosamente' });
    });
});

// Rutas CRUD para Órdenes de Compra
// Ruta para obtener todas las órdenes de compra
app.get('/api/ordenes', (req, res) => {
    db.query('SELECT * FROM ordenes_compra', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener las órdenes de compra' });
        }
        res.json(results);
    });
});

// Ruta para obtener una orden de compra por su ID
app.get('/api/ordenes/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM ordenes_compra WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener la orden de compra' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Orden de compra no encontrada' });
        }
        res.json(results[0]);
    });
});

// Ruta para crear una nueva orden de compra
app.post('/api/ordenes', (req, res) => {
    const { numero_orden, fecha, cliente, productos } = req.body;

    // Inserta la orden principal en la tabla `ordenes_compra`
    const sqlOrden = 'INSERT INTO ordenes_compra (numero_orden, fecha, cliente_id) VALUES (?, ?, ?)';
    db.query(sqlOrden, [numero_orden, fecha, cliente.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error al crear la orden de compra' });
        }
        const ordenId = result.insertId;

        // Inserta cada producto de la orden en la tabla `ordenes_productos`
        const sqlProducto = 'INSERT INTO ordenes_productos (orden_, producto_id, cantidad, vr_unitario, subtotal) VALUES ?,?,?,?,?';
        const valoresProductos = productos.map(producto => [
            ordenId,
            producto.codigo,id
            producto.cantidad,
            producto.vr_unitario,
            producto.subtotal
        ]);

        db.query(sqlProducto, [valoresProductos], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al agregar los productos a la orden de compra' });
            }
            res.status(201).json({ message: 'Orden de compra creada exitosamente' });
        });
    });
});

// Ruta para actualizar una orden de compra existente
app.put('/api/ordenes/:id', (req, res) => {
    const { id } = req.params;
    const { numero_orden, fecha, cliente, productos } = req.body;

    // Actualiza la orden principal
    const sqlOrden = 'UPDATE ordenes_compra SET numero_orden = ?, fecha = ?, cliente_id = ? WHERE id = ?';
    db.query(sqlOrden, [numero_orden, fecha, cliente.id, id], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al actualizar la orden de compra' });
        }

        // Borra los productos actuales de la orden
        const sqlDeleteProductos = 'DELETE FROM ordenes_productos WHERE orden_id = ?';
        db.query(sqlDeleteProductos, [id], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al eliminar productos de la orden de compra' });
            }

            // Inserta los productos actualizados de la orden
            const sqlInsertProductos = 'INSERT INTO ordenes_productos (orden_id, producto_id, cantidad, vr_unitario, subtotal) VALUES ?,?,?,?,?';
            const valoresProductos = productos.map(producto => [
                id,
                producto.codigo,
                producto.cantidad,
                producto.vr_unitario,
                producto.subtotal
            ]);

            db.query(sqlInsertProductos, [valoresProductos], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error al agregar los productos a la orden de compra' });
                }
                res.json({ message: 'Orden de compra actualizada exitosamente' });
            });
        });
    });
});

// Ruta para eliminar una orden de compra
app.delete('/api/ordenes/:id', (req, res) => {
    const { id } = req.params;

    // Borra los productos asociados a la orden primero
    const sqlDeleteProductos = 'DELETE FROM ordenes_productos WHERE orden_id = ?';
    db.query(sqlDeleteProductos, [id], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar los productos de la orden de compra' });
        }

        // Luego, borra la orden de compra
        const sqlDeleteOrden = 'DELETE FROM ordenes_compra WHERE id = ?';
        db.query(sqlDeleteOrden, [id], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al eliminar la orden de compra' });
            }
            res.json({ message: 'Orden de compra eliminada exitosamente' });
        });
    });
});