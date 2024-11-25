import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

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

    const formatoMoneda = (valor) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
        }).format(valor);
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                    <FaArrowLeft className="me-2" /> Volver al Dashboard
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/productos/create')}>
                    <FaPlus className="me-2" /> Agregar Producto
                </button>
            </div>
            <h2 className="text-center mb-4">Lista de Productos</h2>
            <table className="table table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Vr Unitario</th>
                        <th>Vr Total</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.codigo}>
                            <td>{producto.codigo}</td>
                            <td>{producto.descripcion}</td>
                            <td>{producto.cantidad}</td>
                            <td>{formatoMoneda(producto.vr_unitario)}</td>
                            <td>{formatoMoneda(producto.vr_total)}</td>
                            <td className="text-center">
                                <button
                                    className="btn btn-warning me-2"
                                    onClick={() => handleEdit(producto.codigo)}
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(producto.codigo)}
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))} 
                </tbody>
            </table>
        </div>
    );
}

export default ProductosList;
