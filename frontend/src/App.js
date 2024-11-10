import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ClientesList from './components/Clientes/ClientesList';
import ClientesForm from './components/Clientes/ClientesForm';
import ProductosList from './components/Productos/ProductosList';
import ProductosForm from './components/Productos/ProductosForm';
import OrdenesCompraList from './components/OrdenesCompra/OrdenesCompraList';  // Importa el nuevo componente
import OrdenesCompraForm from './components/OrdenesCompra/OrdenesCompraForm';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/clientes" element={<ClientesList />} />
                    <Route path="/clientes/create" element={<ClientesForm />} />
                    <Route path="/clientes/edit/:numero_documento" element={<ClientesForm />} />
                    <Route path="/productos" element={<ProductosList />} />
                    <Route path="/productos/create" element={<ProductosForm />} />
                    <Route path="/productos/edit/:codigo" element={<ProductosForm />} />
                    <Route path="/ordenes" element={<OrdenesCompraList />} /> {/* Ruta para la lista de órdenes */}
                    <Route path="/ordenes/create" element={<OrdenesCompraForm />} />
                    <Route path="/ordenes/edit/:id" element={<OrdenesCompraForm />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
