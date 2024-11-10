import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ProductosForm() {
    const [productos, setProductos] = useState([{
        descripcion: '',
        cantidad: '',
        vr_unitario: ''
    }]);
    const navigate = useNavigate();
    const { codigo } = useParams();
    const isEdit = !!codigo;

    useEffect(() => {
        if (isEdit) {
            obtenerProducto();
        }
    }, [isEdit]);

    const obtenerProducto = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/productos/${codigo}`);
            setProductos([response.data]);
        } catch (error) {
            console.error('Error al obtener el producto:', error);
        }
    };

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const newProductos = [...productos];
        newProductos[index] = {
            ...newProductos[index],
            [name]: value
        };
        setProductos(newProductos);
    };

    const handleAddRow = () => {
        setProductos([...productos, {
            descripcion: '',
            cantidad: '',
            vr_unitario: ''
        }]);
    };

    const handleRemoveRow = (index) => {
        if (productos.length > 1) {
            const newProductos = productos.filter((_, i) => i !== index);
            setProductos(newProductos);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`http://localhost:5000/api/productos/${codigo}`, productos[0]);
                alert('Producto actualizado con éxito');
            } else {
                // Enviar múltiples productos
                await Promise.all(
                    productos.map(producto => 
                        axios.post('http://localhost:5000/api/productos', producto)
                    )
                );
                alert('Productos guardados con éxito');
            }
            navigate('/productos');
        } catch (error) {
            console.error('Error al guardar los productos:', error);
            alert('Error al guardar los productos. Por favor, intente nuevamente.');
        }
    };

    const calculateTotal = () => {
        return productos.reduce((total, producto) => {
            const subtotal = producto.cantidad * producto.vr_unitario;
            return total + (isNaN(subtotal) ? 0 : subtotal);
        }, 0);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">{isEdit ? 'Editar Producto' : 'Agregar Productos'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th>Descripción</th>
                                <th>Cantidad</th>
                                <th>Valor Unitario</th>
                                <th>Subtotal</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            name="descripcion"
                                            className="form-control"
                                            value={producto.descripcion}
                                            onChange={(e) => handleChange(index, e)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="cantidad"
                                            className="form-control"
                                            value={producto.cantidad}
                                            onChange={(e) => handleChange(index, e)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="vr_unitario"
                                            className="form-control"
                                            value={producto.vr_unitario}
                                            onChange={(e) => handleChange(index, e)}
                                            required
                                        />
                                    </td>
                                    <td className="text-end">
                                        {(producto.cantidad * producto.vr_unitario).toLocaleString('es-CO', {
                                            style: 'currency',
                                            currency: 'COP'
                                        })}
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleRemoveRow(index)}
                                            disabled={isEdit || productos.length === 1}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className="text-end fw-bold">Total:</td>
                                <td className="text-end fw-bold">
                                    {calculateTotal().toLocaleString('es-CO', {
                                        style: 'currency',
                                        currency: 'COP'
                                    })}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="row mt-3">
                    <div className="col">
                        {!isEdit && (
                            <button
                                type="button"
                                className="btn btn-secondary w-100 mb-3"
                                onClick={handleAddRow}
                            >
                                Agregar Fila
                            </button>
                        )}
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    {isEdit ? 'Actualizar Producto' : 'Guardar Productos'}
                </button>
            </form>
        </div>
    );
}

export default ProductosForm;