'use client'

import { useState } from 'react';

export default function OrderModal({ order, onClose }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleInvoice = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${order.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentStatus: 'paid', status: 'completed' })
            });
            if (!response.ok) {
                throw new Error('Error al facturar el pedido');
            }
            alert('Pedido facturado exitosamente');
            onClose();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al facturar el pedido');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#2C2F33] p-8 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl font-bold text-[#ffffff] mb-4">Detalles del Pedido</h3>
                <ul className="text-[#E5E7EB] mb-4">
                    {Array.isArray(order.items) ? (
                        order.items.map((item, index) => (
                            <li key={index}>
                                {item.name} - Cantidad: {item.quantity}
                            </li>
                        ))
                    ) : (
                        <li>No hay productos en este pedido.</li>
                    )}
                </ul>
                <button
                    onClick={handleInvoice}
                    className="px-4 py-2 bg-green-500 text-[#ffffff] rounded-lg hover:bg-green-700"
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Procesando...' : 'Facturar'}
                </button>
                <button
                    onClick={onClose}
                    className="ml-2 px-4 py-2 bg-red-500 text-[#ffffff] rounded-lg hover:bg-red-700"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
} 