import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { pendingRequests, approveSellRequest, rejectSellRequest } = useInventory();
    const navigate = useNavigate();
    const [actionMessage, setActionMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleApprove = (requestId, productName, quantity) => {
        approveSellRequest(requestId);
        setMessageType('success');
        setActionMessage(`✓ Approved: ${quantity}x ${productName} - Inventory updated`);
        setTimeout(() => setActionMessage(''), 3000);
    };

    const handleReject = (requestId, productName) => {
        rejectSellRequest(requestId);
        setMessageType('error');
        setActionMessage(`✗ Rejected: ${productName} - No inventory change`);
        setTimeout(() => setActionMessage(''), 3000);
    };

    const pendingCount = pendingRequests.filter(r => r.status === 'pending').length;
    const approvedCount = pendingRequests.filter(r => r.status === 'approved').length;
    const rejectedCount = pendingRequests.filter(r => r.status === 'rejected').length;

    return (
        <div className="min-h-screen bg-base-100" data-theme="customTheme">
            {/* Navbar */}
            <div className="navbar bg-base-200 shadow-lg sticky top-0 z-10">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
                </div>
                <div className="flex-none gap-4">
                    <div className="badge badge-lg badge-warning">
                        {pendingCount} Pending Approvals
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
                {/* Action Message */}
                {actionMessage && (
                    <div className={`alert alert-${messageType} mb-6 shadow-lg`}>
                        <span>{actionMessage}</span>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="card bg-base-200 shadow-md">
                        <div className="card-body">
                            <h2 className="card-title text-primary text-sm">Pending Requests</h2>
                            <p className="text-3xl font-bold text-warning">{pendingCount}</p>
                        </div>
                    </div>
                    <div className="card bg-base-200 shadow-md">
                        <div className="card-body">
                            <h2 className="card-title text-secondary text-sm">Approved</h2>
                            <p className="text-3xl font-bold text-success">{approvedCount}</p>
                        </div>
                    </div>
                    <div className="card bg-base-200 shadow-md">
                        <div className="card-body">
                            <h2 className="card-title text-accent text-sm">Rejected</h2>
                            <p className="text-3xl font-bold text-error">{rejectedCount}</p>
                        </div>
                    </div>
                    <div className="card bg-base-200 shadow-md">
                        <div className="card-body">
                            <h2 className="card-title text-primary text-sm">Total Requests</h2>
                            <p className="text-3xl font-bold text-primary">{pendingRequests.length}</p>
                        </div>
                    </div>
                </div>

                {/* Pending Sell Requests - Approval Section */}
                <div className="card bg-base-200 shadow-xl mb-8">
                    <div className="card-body">
                        <h2 className="card-title text-primary mb-4 text-lg">Pending Sell Requests (Approval)</h2>

                        {pendingRequests.length === 0 ? (
                            <div className="alert alert-info">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="stroke-current shrink-0 w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                                <span>No requests at this time</span>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr className="text-primary bg-base-300">
                                            <th>Request ID</th>
                                            <th>Employee</th>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Unit Price</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingRequests.map((request) => (
                                            <tr key={request.id} className={`hover ${request.status !== 'pending' ? 'opacity-75' : ''}`}>
                                                <td>
                                                    <span className="badge badge-accent text-xs">{request.id.slice(0, 6)}</span>
                                                </td>
                                                <td>
                                                    <div className="font-semibold text-base-content">
                                                        {request.employeeEmail.split('@')[0]}
                                                    </div>
                                                    <div className="text-xs text-base-content opacity-50">
                                                        {request.employeeEmail}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="font-semibold text-secondary">{request.productName}</span>
                                                </td>
                                                <td>
                                                    <span className="badge badge-lg badge-primary">{request.quantity}</span>
                                                </td>
                                                <td className="text-primary font-bold">
                                                    ${request.price.toFixed(2)}
                                                </td>
                                                <td className="text-accent font-bold">
                                                    ${request.totalAmount.toFixed(2)}
                                                </td>
                                                <td>
                                                    <span className={`badge ${request.status === 'pending' ? 'badge-warning' :
                                                        request.status === 'approved' ? 'badge-success' :
                                                            'badge-error'
                                                        }`}>
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td className="text-xs text-base-content">
                                                    {new Date(request.createdAt).toLocaleString()}
                                                </td>
                                                <td>
                                                    {request.status === 'pending' ? (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleApprove(request.id, request.productName, request.quantity)}
                                                                className="btn btn-sm btn-success text-white"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(request.id, request.productName)}
                                                                className="btn btn-sm btn-error text-white"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-base-content">
                                                            {request.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Revenue */}
                    <div className="card bg-base-200 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-primary">Total Revenue</h2>
                            <p className="text-4xl font-bold text-accent">$125,430</p>
                            <p className="text-sm text-base-content">+12% from last month</p>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="card bg-base-200 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-secondary">Total Orders</h2>
                            <p className="text-4xl font-bold text-primary">1,234</p>
                            <p className="text-sm text-base-content">All time</p>
                        </div>
                    </div>

                    {/* Active Employees */}
                    <div className="card bg-base-200 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-accent">Active Employees</h2>
                            <p className="text-4xl font-bold text-secondary">42</p>
                            <p className="text-sm text-base-content">Currently online</p>
                        </div>
                    </div>

                    {/* System Health */}
                    <div className="card bg-base-200 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-primary">System Health</h2>
                            <p className="text-4xl font-bold text-accent">99.8%</p>
                            <p className="text-sm text-base-content">Uptime</p>
                        </div>
                    </div>

                    {/* Admin Profile */}
                    <div className="card bg-base-200 shadow-xl md:col-span-2 lg:col-span-2">
                        <div className="card-body">
                            <h2 className="card-title text-secondary mb-4">Admin Profile</h2>
                            <div className="space-y-3 text-sm">
                                <p><span className="font-semibold text-primary">Email:</span> {user?.email}</p>
                                <p><span className="font-semibold text-primary">User ID:</span> {user?.id}</p>
                                <p><span className="font-semibold text-primary">Role:</span> <span className="text-accent uppercase font-bold">{user?.role}</span></p>
                                <p><span className="font-semibold text-primary">Permissions:</span> Full Access</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="card bg-base-200 shadow-xl md:col-span-2 lg:col-span-2">
                        <div className="card-body">
                            <h2 className="card-title text-secondary mb-4">Quick Stats</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span>Processed Today</span>
                                    <span className="badge badge-primary">12</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Pending Approval</span>
                                    <span className="badge badge-warning">{pendingCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Success Rate</span>
                                    <span className="badge badge-success">94%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
