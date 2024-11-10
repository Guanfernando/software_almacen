// src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Dashboard</h2>
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div
                        className="card text-center"
                        onClick={() => handleNavigation('/clientes')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body">
                            <i className="bi bi-people" style={{ fontSize: '3rem' }}></i>
                            <h5 className="card-title mt-3">Clientes</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div
                        className="card text-center"
                        onClick={() => handleNavigation('/productos')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body">
                            <i className="bi bi-box-seam" style={{ fontSize: '3rem' }}></i>
                            <h5 className="card-title mt-3">Productos</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div
                        className="card text-center"
                        onClick={() => handleNavigation('/ordenes')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body">
                            <i className="bi bi-receipt" style={{ fontSize: '3rem' }}></i>
                            <h5 className="card-title mt-3">Órdenes de Compra</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
