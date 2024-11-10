// src/components/Clientes/ClientesList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
            <div className="row">
                {clientesFiltrados.map((cliente) => (
                    <div key={cliente.numero_documento} className="col-12 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-8">
                                        <h5 className="card-title">{cliente.nombres} {cliente.apellidos}</h5>
                                        <p className="card-text"><strong>Tipo Documento:</strong> {cliente.tipo_documento}</p>
                                        <p className="card-text"><strong>Número Documento:</strong> {cliente.numero_documento}</p>
                                        <p className="card-text"><strong>Fecha de Nacimiento:</strong> {new Date(cliente.fecha_nacimiento).toLocaleDateString()}</p>
                                        <p className="card-text"><strong>Teléfono:</strong> {cliente.telefono}</p>
                                        <p className="card-text"><strong>Email:</strong> {cliente.email}</p>
                                        <p className="card-text"><strong>Departamento:</strong> {cliente.departamento}</p>
                                        <p className="card-text"><strong>Municipio:</strong> {cliente.municipio}</p>
                                        <p className="card-text"><strong>Dirección:</strong> {cliente.direccion}</p>
                                    </div>
                                    <div className="col-md-4 d-flex align-items-center justify-content-end">
                                        <button
                                            className="btn btn-warning me-2"
                                            onClick={() => handleEdit(cliente.numero_documento)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(cliente.numero_documento)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center">
                <button className="btn btn-primary mt-3" onClick={() => navigate('/clientes/create')}>Agregar Cliente</button>
            </div>
        </div>
    );
}

export default ClientesList;
