// src/components/Clientes/ClientesList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';

function ClientesList() {
    const [clientes, setClientes] = useState([]);
    const [filtro, setFiltro] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        obtenerClientes();
    }, []);

    const obtenerClientes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/clientes');
            setClientes(response.data);
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
    };

    const handleEdit = (numero_documento) => {
        navigate(`/clientes/edit/${numero_documento}`);
    };

    const handleDelete = async (numero_documento) => {
        try {
            await axios.delete(`http://localhost:5000/api/clientes/${numero_documento}`);
            obtenerClientes(); // Refrescar la lista de clientes
        } catch (error) {
            console.error('Error al eliminar el cliente:', error);
        }
    };

    // Filtrar los clientes en función del texto de búsqueda
    const clientesFiltrados = clientes.filter((cliente) =>
        cliente.nombres.toLowerCase().includes(filtro.toLowerCase()) ||
        cliente.apellidos.toLowerCase().includes(filtro.toLowerCase()) ||
        cliente.numero_documento.toString().includes(filtro)
    );

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                    <FaArrowLeft className="me-2" /> Volver al Dashboard
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/clientes/create')}>
                    <FaPlus className="me-2" /> Agregar Cliente
                </button>
            </div>
            <h2 className="text-center mb-4">Lista de Clientes</h2>
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre, apellido o número de documento"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />
            </div>
            <table className="table table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>Información Personal</th>
                        <th>Contacto</th>
                        <th>Ubicación</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientesFiltrados.map((cliente) => (
                        <React.Fragment key={cliente.numero_documento}>
                            <tr>
                                <td>
                                    <strong>Nombre:</strong> {cliente.nombres} {cliente.apellidos}<br />
                                    <strong>Tipo Documento:</strong> {cliente.tipo_documento}<br />
                                    <strong>Número Documento:</strong> {cliente.numero_documento}
                                </td>
                                <td>
                                    <strong>Teléfono:</strong> {cliente.telefono}<br />
                                    <strong>Email:</strong> {cliente.email}
                                </td>
                                <td>
                                    <strong>Departamento:</strong> {cliente.departamento}<br />
                                    <strong>Municipio:</strong> {cliente.municipio}<br />
                                    <strong>Dirección:</strong> {cliente.direccion}
                                </td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-warning me-2"
                                        onClick={() => handleEdit(cliente.numero_documento)}
                                    >
                                        <FaEdit className="fs-5" />
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(cliente.numero_documento)}
                                    >
                                        <FaTrash className="fs-5" />
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="4" className="bg-light">
                                    <strong>Fecha de Nacimiento:</strong> {new Date(cliente.fecha_nacimiento).toLocaleDateString()}
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClientesList;
