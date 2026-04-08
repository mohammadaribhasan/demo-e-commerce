import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockProducts } from '../data/mockProducts';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    const [inventory, setInventory] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initialize inventory and requests from localStorage or defaults
    useEffect(() => {
        const storedRequests = localStorage.getItem('pendingRequests');
        const storedInventory = localStorage.getItem('inventory');

        // Load pending requests
        if (storedRequests) {
            try {
                setPendingRequests(JSON.parse(storedRequests));
            } catch (error) {
                console.error('Failed to parse pending requests:', error);
                localStorage.removeItem('pendingRequests');
            }
        }

        // Load inventory or use defaults
        if (storedInventory) {
            try {
                setInventory(JSON.parse(storedInventory));
            } catch (error) {
                console.error('Failed to parse inventory:', error);
                setInventory(mockProducts);
            }
        } else {
            setInventory(mockProducts);
        }

        setLoading(false);
    }, []);

    // Create a new sell request
    const createSellRequest = (productId, productName, quantity, price, employeeId, employeeEmail) => {
        const newRequest = {
            id: Math.random().toString(36).substr(2, 9),
            productId,
            productName,
            quantity,
            price,
            totalAmount: quantity * price,
            employeeId,
            employeeEmail,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        const updatedRequests = [...pendingRequests, newRequest];
        setPendingRequests(updatedRequests);
        localStorage.setItem('pendingRequests', JSON.stringify(updatedRequests));

        return newRequest;
    };

    // Approve a sell request - updates inventory and request status
    const approveSellRequest = (requestId) => {
        // Find the request to approve
        const requestToApprove = pendingRequests.find(req => req.id === requestId);

        if (requestToApprove) {
            // Update inventory - decrement stock for the specific product
            const updatedInventory = inventory.map(product => {
                if (product.id === requestToApprove.productId) {
                    const newStock = Math.max(0, product.stock - requestToApprove.quantity);
                    return { ...product, stock: newStock };
                }
                return product;
            });

            setInventory(updatedInventory);
            localStorage.setItem('inventory', JSON.stringify(updatedInventory));

            // Update request status to approved
            const updatedRequests = pendingRequests.map(req =>
                req.id === requestId ? { ...req, status: 'approved' } : req
            );

            setPendingRequests(updatedRequests);
            localStorage.setItem('pendingRequests', JSON.stringify(updatedRequests));

            return true; // Success
        }

        return false; // Request not found
    };

    // Reject a sell request - only updates status, no inventory change
    const rejectSellRequest = (requestId) => {
        const updatedRequests = pendingRequests.map(req =>
            req.id === requestId ? { ...req, status: 'rejected' } : req
        );

        setPendingRequests(updatedRequests);
        localStorage.setItem('pendingRequests', JSON.stringify(updatedRequests));

        return true;
    };

    // Get product by ID
    const getProductById = (productId) => {
        return inventory.find(product => product.id === productId);
    };

    // Get all pending requests
    const getPendingRequests = () => {
        return pendingRequests.filter(req => req.status === 'pending');
    };

    // Get all approved requests
    const getApprovedRequests = () => {
        return pendingRequests.filter(req => req.status === 'approved');
    };

    // Get all rejected requests
    const getRejectedRequests = () => {
        return pendingRequests.filter(req => req.status === 'rejected');
    };

    // Get total inventory value
    const getTotalInventoryValue = () => {
        return inventory.reduce((total, product) => total + (product.price * product.stock), 0);
    };

    // Get low stock products (less than 10 units)
    const getLowStockProducts = () => {
        return inventory.filter(product => product.stock < 10);
    };

    const value = {
        inventory,
        pendingRequests,
        loading,
        createSellRequest,
        approveSellRequest,
        rejectSellRequest,
        getProductById,
        getPendingRequests,
        getApprovedRequests,
        getRejectedRequests,
        getTotalInventoryValue,
        getLowStockProducts,
    };

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};
