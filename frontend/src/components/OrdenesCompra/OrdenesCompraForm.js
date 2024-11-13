import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function OrdenCompraForm() {
    const [orden, setOrden] = useState({
        numero_orden: '',
        fecha: new Date().toISOString().split('T')[0],
        cliente: null,
        productos: [{
            codigo: '',
            descripcion: '',
            cantidad: 1,
            vr_unitario: 0,
            subtotal: 0
        }]
    });

    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [numeroDocumento, setNumeroDocumento] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    // Cargar productos disponibles y, si es edición, obtener datos de la orden
    useEffect(() => {
        let isMounted = true;

        const cargarProductos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/productos');
                if (isMounted) setProductosDisponibles(response.data);
            } catch (error) {
                console.error('Error al cargar productos:', error);
            }
        };

        const obtenerOrden = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/ordenes/${id}`);
                setOrden(response.data);
                setNumeroDocumento(response.data.cliente.numero_documento);
            } catch (error) {
                console.error('Error al obtener la orden:', error);
            }
        };

        cargarProductos();
        if (isEdit) obtenerOrden();

        return () => { isMounted = false; };
    }, [id, isEdit]);

    // Buscar cliente por documento
    const buscarCliente = async () => {
        if (!numeroDocumento) return;
        try {
            const response = await axios.get(`http://localhost:5000/api/clientes/${numeroDocumento}`);
            setOrden({ ...orden, cliente: response.data });
        } catch (error) {
            console.error('Error al buscar cliente:', error);
            alert('Cliente no encontrado');
        }
    };

    // Manejo de productos en la orden
    const handleProductoChange = (index, field, value) => {
        const nuevosProductos = [...orden.productos];
        const producto = nuevosProductos[index];

        if (field === 'codigo') {
            const productoSeleccionado = productosDisponibles.find(p => p.codigo === value);
            if (productoSeleccionado) {
                nuevosProductos[index] = {
                    ...producto,
                    codigo: productoSeleccionado.codigo,
                    descripcion: productoSeleccionado.descripcion,
                    vr_unitario: productoSeleccionado.vr_unitario,
                    cantidad: producto.cantidad || 1,
                    subtotal: (producto.cantidad || 1) * productoSeleccionado.vr_unitario
                };
            }
        } else if (field === 'cantidad') {
            const cantidad = parseInt(value, 10) || 1;
            nuevosProductos[index] = {
                ...producto,
                cantidad,
                subtotal: cantidad * producto.vr_unitario
            };
        }

        setOrden({ ...orden, productos: nuevosProductos });
    };

    const agregarProducto = () => {
        setOrden({
            ...orden,
            productos: [...orden.productos, {
                codigo: '',
                descripcion: '',
                cantidad: 1,
                vr_unitario: 0,
                subtotal: 0
            }]
        });
    };

    const eliminarProducto = (index) => {
        if (orden.productos.length > 1) {
            setOrden({
                ...orden,
                productos: orden.productos.filter((_, i) => i !== index)
            });
        }
    };

    // Calcular el total de la orden
    const calcularTotal = () => {
        return orden.productos.reduce((total, producto) => total + (producto.subtotal || 0), 0);
    };

    // Manejar el envío del formulario (crear o actualizar orden)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!orden.cliente) {
            alert('Por favor seleccione un cliente');
            return;
        }

        if (orden.productos.some(p => !p.codigo || !p.cantidad)) {
            alert('Por favor complete todos los campos de productos');
            return;
        }

        try {
            if (isEdit) {
                await axios.put(`http://localhost:5000/api/ordenes/${id}`, orden);
                alert('Orden actualizada con éxito');
            } else {
                await axios.post('http://localhost:5000/api/ordenes', orden);
                alert('Orden creada con éxito');
            }
            navigate('/ordenes');
        } catch (error) {
            console.error('Error al guardar la orden:', error);
            alert('Error al guardar la orden');
        }
    };

    // Renderizado del formulario
    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">{isEdit ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}</h2>
            <form onSubmit={handleSubmit}>
                {/* Información del Cliente */}
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Información del Cliente</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Número de Documento"
                                        value={numeroDocumento}
                                        onChange={(e) => setNumeroDocumento(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={buscarCliente}
                                    >
                                        Buscar Cliente
                                    </button>
                                </div>
                            </div>
                        </div>
                        {orden.cliente && (
                            <div className="row">
                                <div className="col-md-6">
                                    <p><strong>Nombre:</strong> {orden.cliente.nombres} {orden.cliente.apellidos}</p>
                                    <p><strong>Email:</strong> {orden.cliente.email}</p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Teléfono:</strong> {orden.cliente.telefono}</p>
                                    <p><strong>Dirección:</strong> {orden.cliente.direccion}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Productos */}
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Productos</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Descripción</th>
                                        <th>Cantidad</th>
                                        <th>Valor Unitario</th>
                                        <th>Subtotal</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productosDisponibles.length > 0 && orden.productos.map((producto, index) => (
                                        <tr key={index}>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={producto.codigo}
                                                    onChange={(e) => handleProductoChange(index, 'codigo', e.target.value)}
                                                >
                                                    <option value="">Seleccione...</option>
                                                    {productosDisponibles.map((p) => (
                                                        <option key={p.codigo} value={p.codigo}>
                                                            {p.codigo} - {p.descripcion}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>{producto.descripcion}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={producto.cantidad}
                                                    onChange={(e) => handleProductoChange(index, 'cantidad', e.target.value)}
                                                    min="1"
                                                />
                                            </td>
                                            <td className="text-end">
                                                {Number(producto.vr_unitario).toLocaleString('es-CO', {
                                                    style: 'currency',
                                                    currency: 'COP'
                                                })}
                                            </td>
                                            <td className="text-end">
                                                {Number(producto.subtotal).toLocaleString('es-CO', {
                                                    style: 'currency',
                                                    currency: 'COP'
                                                })}
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => eliminarProducto(index)}
                                                    disabled={orden.productos.length === 1}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="4" className="text-end fw-bold">Total:</td>
                                        <td className="text-end fw-bold">
                                            {calcularTotal().toLocaleString('es-CO', {
                                                style: 'currency',
                                                currency: 'COP'
                                            })}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary mt-3"
                            onClick={agregarProducto}
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            Agregar Producto
                        </button>
                    </div>
                </div>

                {/* Botón de Envío */}
                <button type="submit" className="btn btn-primary w-100">
                    {isEdit ? 'Actualizar Orden' : 'Crear Orden'}
                </button>
            </form>
        </div>
    );
}

export default OrdenCompraForm;
