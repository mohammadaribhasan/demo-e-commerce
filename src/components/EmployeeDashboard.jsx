import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { useNavigate } from 'react-router-dom';
import { SellModal } from './SellModal';
import { mockProducts } from '../data/mockProducts';

export const EmployeeDashboard = () => {
    const { user, logout } = useAuth();
    const { inventory, createSellRequest, pendingRequests } = useInventory();
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSellClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleSellSubmit = (sellData) => {
        const request = createSellRequest(
            sellData.productId,
            sellData.productName,
            sellData.quantity,
            sellData.price,
            user?.id,
            user?.email
        );
        setSuccessMessage(`Sell request created for ${sellData.quantity}x ${sellData.productName}`);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const pendingSellCount = pendingRequests.filter(r => r.status === 'pending').length;

    return (
        <div className="min-h-screen bg-base-100" data-theme="customTheme">
            {/* Navbar */}
            <div className="navbar bg-base-200 shadow-lg sticky top-0 z-10">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-primary">Employee Dashboard</h1>
                </div>
                <div className="flex-none gap-4">
                    <div className="badge badge-lg badge-secondary">
                        {pendingSellCount} Pending Requests
                    </div>
                    <div className="form-control">
                        <span className="text-sm text-base-content">
                            Logged in as: <span className="font-semibold text-primary">{user?.email}</span>
                        </span>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline btn-secondary">
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
                {/* Success Message */}
                {successMessage && (
                    <div className="alert alert-success mb-6 shadow-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="card bg-base-200 shadow-md">
                        <div className="card-body">
                            <h2 className="card-title text-primary text-sm">Total Products</h2>
                            <p className="text-3xl font-bold text-accent">{mockProducts.length}</p>
                        </div>
                    </div>
                    <div className="card bg-base-200 shadow-md">
                        <div className="card-body">
                            <h2 className="card-title text-secondary text-sm">Pending Requests</h2>
                            <p className="text-3xl font-bold text-primary">{pendingSellCount}</p>
                        </div>
                    </div>
                    <div className="card bg-base-200 shadow-md">
                        <div className="card-body">
                            <h2 className="card-title text-accent text-sm">Total Inventory Value</h2>
                            <p className="text-3xl font-bold text-secondary">
                                ${(mockProducts.reduce((sum, p) => sum + (p.price * p.stock), 0)).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-primary mb-4">Product Inventory</h2>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr className="text-primary bg-base-300">
                                        <th>Product ID</th>
                                        <th>Product Name</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Total Value</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockProducts.map((product) => (
                                        <tr key={product.id} className="hover">
                                            <td>
                                                <span className="badge badge-primary">#{product.id}</span>
                                            </td>
                                            <td className="font-semibold text-base-content">{product.name}</td>
                                            <td className="text-secondary font-bold">${product.price}</td>
                                            <td>
                                                <span className={`badge ${product.stock > 50 ? 'badge-success' : product.stock > 20 ? 'badge-warning' : 'badge-error'}`}>
                                                    {product.stock} units
                                                </span>
                                            </td>
                                            <td className="text-accent font-semibold">
                                                ${(product.price * product.stock).toFixed(2)}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleSellClick(product)}
                                                    className="btn btn-sm btn-primary text-white"
                                                >
                                                    Sell
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pending Requests Section */}
                {pendingRequests.length > 0 && (
                    <div className="card bg-base-200 shadow-xl mt-8">
                        <div className="card-body">
                            <h2 className="card-title text-primary mb-4">Recent Sell Requests</h2>
                            <div className="overflow-x-auto">
                                <table className="table table-sm table-zebra">
                                    <thead>
                                        <tr className="text-primary bg-base-300">
                                            <th>Request ID</th>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Total Amount</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingRequests.slice().reverse().map((request) => (
                                            <tr key={request.id}>
                                                <td>
                                                    <span className="badge badge-accent text-xs">{request.id}</span>
                                                </td>
                                                <td>{request.productName}</td>
                                                <td className="text-secondary font-bold">{request.quantity}</td>
                                                <td className="text-primary font-bold">${request.totalAmount.toFixed(2)}</td>
                                                <td>
                                                    <span className={`badge ${request.status === 'pending' ? 'badge-warning' :
                                                        request.status === 'approved' ? 'badge-success' :
                                                            'badge-error'
                                                        }`}>
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td className="text-xs text-base-content">
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sell Modal */}
            {showModal && selectedProduct && (
                <SellModal
                    product={selectedProduct}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedProduct(null);
                    }}
                    onSubmit={handleSellSubmit}
                />
            )}
        </div>
    );
};
