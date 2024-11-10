// src/components/Productos/ProductosList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProductosList() {
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        obtenerProductos();
    }, []);

    const obtenerProductos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };

    const handleEdit = (codigo) => {
        navigate(`/productos/edit/${codigo}`);
    };

    const handleDelete = async (codigo) => {
        try {
            await axios.delete(`http://localhost:5000/api/productos/${codigo}`);
            obtenerProductos(); // Refrescar la lista de productos
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Lista de Productos</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Vr Unitario</th>
                        <th>Vr Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.codigo}>
                            <td>{producto.codigo}</td>
                            <td>{producto.descripcion}</td>
                            <td>{producto.cantidad}</td>
                            <td>{Number(producto.vr_unitario).toFixed(2)}</td>
                            <td>{Number(producto.vr_total).toFixed(2)}</td>
                            <td>
                                <button
                                    className="btn btn-warning me-2"
                                    onClick={() => handleEdit(producto.codigo)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(producto.codigo)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/productos/create')}>Agregar Producto</button>
        </div>
    );
}

export default ProductosList;
