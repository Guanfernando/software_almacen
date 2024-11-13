// src/components/OrdenesCompra/OrdenesCompraList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OrdenesCompraList() {
    const [ordenes, setOrdenes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrdenes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/ordenes');
                setOrdenes(response.data);
            } catch (error) {
                console.error('Error al obtener las órdenes de compra:', error);
            }
        };
        fetchOrdenes();
    }, []);

    const handleEdit = (id) => {
        navigate(`/ordenes/edit/${id}`);
    }; 

    const handleCreate = () => {
        navigate('/ordenes/create');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Órdenes de Compra</h2>
            <button onClick={handleCreate} className="btn btn-primary mb-3">Nueva Orden de Compra</button>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Número de Orden</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ordenes.map((orden) => (
                        <tr key={orden.id}>
                            <td>{orden.id}</td>
                            <td>{orden.numero_orden}</td>
                            <td>{orden.fecha}</td>
                            <td>{orden.cliente}</td>
                            <td>
                                <button onClick={() => handleEdit(orden.id)} className="btn btn-secondary btn-sm">Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrdenesCompraList;
