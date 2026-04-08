import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (role) => {
        setError('');
        setLoading(true);

        try {
            // Predefined credentials based on role
            const credentials = {
                employee: { email: 'employee@test.com', password: 'password' },
                admin: { email: 'admin@test.com', password: 'password' }
            };

            const { email, password } = credentials[role];

            // Attempt login
            const success = login(email, password, role);

            if (success) {
                // Redirect based on role
                const redirectPath = role === 'admin' ? '/admin-dashboard' : '/employee-dashboard';
                navigate(redirectPath);
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4" data-theme="customTheme">
            <div className="w-full max-w-md">
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h1 className="card-title text-3xl font-bold text-primary mb-6 text-center">
                            E-Commerce Demo
                        </h1>

                        <p className="text-center text-base-content mb-6">
                            Choose your role to access the dashboard
                        </p>

                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-error mb-4">
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
                                        d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2m-2-2l2-2"
                                    />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Login Buttons */}
                        <div className="space-y-4">
                            <button
                                onClick={() => handleLogin('employee')}
                                className={`btn btn-primary w-full text-white font-bold ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login as Employee'}
                            </button>

                            <button
                                onClick={() => handleLogin('admin')}
                                className={`btn btn-secondary w-full text-white font-bold ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login as Admin'}
                            </button>
                        </div>

                        {/* Demo Info */}
                        <div className="alert alert-info mt-6">
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
                            <div>
                                <p className="text-sm font-semibold">Demo Credentials:</p>
                                <p className="text-xs mt-1">Employee: employee@test.com</p>
                                <p className="text-xs">Admin: admin@test.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};