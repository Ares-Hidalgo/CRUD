'use client'

import { useState, useEffect } from 'react';

export default function Sales({ onBackToMenu }) {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/sales');
                if (!response.ok) {
                    throw new Error('Error al cargar las ventas');
                }
                const data = await response.json();
                setSales(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchSales();
    }, []);

    return (
        <div className="flex flex-col w-full p-8 bg-[#2C2F33] rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-[#ffffff] mb-4">Gestión de Ventas</h2>
            <p className="text-sm font-light text-[#6B7280] mb-4">Aquí puedes gestionar las ventas del restaurante.</p>

            <table className="w-full text-left text-[#E5E7EB]">
                <thead>
                    <tr>
                        <th className="border-b border-[#4F46E5] p-2">Cliente</th>
                        <th className="border-b border-[#4F46E5] p-2">Total</th>
                        <th className="border-b border-[#4F46E5] p-2">Método de Pago</th>
                        <th className="border-b border-[#4F46E5] p-2">Fecha de Venta</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map(sale => (
                        <tr key={sale.id}>
                            <td className="border-b border-[#4F46E5] p-2">{sale.customerName}</td>
                            <td className="border-b border-[#4F46E5] p-2">{sale.total.toFixed(2)}</td>
                            <td className="border-b border-[#4F46E5] p-2">{sale.paymentMethod}</td>
                            <td className="border-b border-[#4F46E5] p-2">{new Date(sale.saleDate).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                onClick={onBackToMenu}
                className="mt-4 px-4 py-2 bg-[#4F46E5] text-[#ffffff] rounded-lg hover:bg-[#3B3F45]"
            >
                Volver al Menú
            </button>
        </div>
    );
} 