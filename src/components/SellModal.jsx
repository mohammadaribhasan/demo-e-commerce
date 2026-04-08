import React, { useState } from 'react';

export const SellModal = ({ product, onClose, onSubmit }) => {
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!quantity || quantity < 1) {
            setError('Quantity must be at least 1');
            return;
        }

        if (quantity > product.stock) {
            setError(`Available stock: ${product.stock}`);
            return;
        }

        onSubmit({
            productId: product.id,
            productName: product.name,
            quantity: parseInt(quantity),
            price: product.price,
        });

        setQuantity(1);
        onClose();
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        setQuantity(value);
    };

    const totalPrice = (quantity * product.price).toFixed(2);

    return (
        <>
            {/* Modal backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-base-200 rounded-lg shadow-xl max-w-md w-full">
                    <div className="p-6">
                        {/* Modal Header */}
                        <h2 className="text-2xl font-bold text-primary mb-2">Sell Product</h2>
                        <p className="text-base-content mb-6">{product.name}</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Product Info */}
                            <div className="grid grid-cols-2 gap-4 bg-base-100 p-4 rounded">
                                <div>
                                    <p className="text-sm text-base-content">Price per Unit</p>
                                    <p className="text-xl font-bold text-primary">${product.price}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-base-content">Available Stock</p>
                                    <p className="text-xl font-bold text-secondary">{product.stock}</p>
                                </div>
                            </div>

                            {/* Quantity Input */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base-content">Quantity to Sell</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.stock}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="input input-bordered input-primary w-full"
                                    placeholder="Enter quantity"
                                />
                            </div>

                            {/* Total Price */}
                            <div className="bg-primary bg-opacity-10 p-4 rounded">
                                <div className="flex justify-between items-center">
                                    <span className="text-base-content font-semibold">Total Amount:</span>
                                    <span className="text-2xl font-bold text-primary">${totalPrice}</span>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="alert alert-error">
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

                            {/* Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn btn-outline btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary flex-1 text-white"
                                >
                                    Submit Sell Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};
