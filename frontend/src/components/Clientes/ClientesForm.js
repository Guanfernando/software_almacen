// src/components/Clientes/ClientesForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ClientesForm() {
    const [cliente, setCliente] = useState({
        tipo_documento: '',
        numero_documento: '',
        nombres: '',
        apellidos: '',
        fecha_nacimiento: '',
        telefono: '',
        email: '',
        departamento: '',
        municipio: '',
        direccion: ''
    });
    const navigate = useNavigate();
    const { numero_documento } = useParams();
    const isEdit = !!numero_documento;

    useEffect(() => {
        if (isEdit) {
            obtenerCliente();
        }
    }, [isEdit]);

    const obtenerCliente = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/clientes/${numero_documento}`);
            setCliente(response.data);
        } catch (error) {
            console.error('Error al obtener el cliente:', error);
        }
    };

    const handleChange = (e) => {
        setCliente({ ...cliente, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`http://localhost:5000/api/clientes/${numero_documento}`, cliente);
                alert('Cliente actualizado con éxito');
            } else {
                await axios.post('http://localhost:5000/api/clientes', cliente);
                alert('Cliente creado con éxito');
            }
            navigate('/clientes');
        } catch (error) {
            console.error('Error al guardar el cliente:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">{isEdit ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="tipo_documento" className="form-label">Tipo Documento</label>
                        <input
                            type="text"
                            name="tipo_documento"
                            id="tipo_documento"
                            className="form-control"
                            value={cliente.tipo_documento}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="numero_documento" className="form-label">Número Documento</label>
                        <input
                            type="number"
                            name="numero_documento"
                            id="numero_documento"
                            className="form-control"
                            value={cliente.numero_documento}
                            onChange={handleChange}
                            disabled={isEdit}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="nombres" className="form-label">Nombres</label>
                        <input
                            type="text"
                            name="nombres"
                            id="nombres"
                            className="form-control"
                            value={cliente.nombres}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="apellidos" className="form-label">Apellidos</label>
                        <input
                            type="text"
                            name="apellidos"
                            id="apellidos"
                            className="form-control"
                            value={cliente.apellidos}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="fecha_nacimiento" className="form-label">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            name="fecha_nacimiento"
                            id="fecha_nacimiento"
                            className="form-control"
                            value={cliente.fecha_nacimiento}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="telefono" className="form-label">Teléfono</label>
                        <input
                            type="text"
                            name="telefono"
                            id="telefono"
                            className="form-control"
                            value={cliente.telefono}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="form-control"
                            value={cliente.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="departamento" className="form-label">Departamento</label>
                        <input
                            type="text"
                            name="departamento"
                            id="departamento"
                            className="form-control"
                            value={cliente.departamento}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="municipio" className="form-label">Municipio</label>
                        <input
                            type="text"
                            name="municipio"
                            id="municipio"
                            className="form-control"
                            value={cliente.municipio}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="direccion" className="form-label">Dirección</label>
                        <input
                            type="text"
                            name="direccion"
                            id="direccion"
                            className="form-control"
                            value={cliente.direccion}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    {isEdit ? 'Actualizar Cliente' : 'Agregar Cliente'}
                </button>
            </form>
        </div>
    );
}

export default ClientesForm;
