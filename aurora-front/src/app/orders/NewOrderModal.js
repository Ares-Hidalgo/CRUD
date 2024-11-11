'use client'

import { useState, useEffect } from 'react';

export default function NewOrderModal({ onClose, onSave }) {
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [tableNumber, setTableNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [orderMode, setOrderMode] = useState('dine-in');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [discount, setDiscount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/menu');
                if (!response.ok) {
                    throw new Error('Error al cargar el menú');
                }
                const data = await response.json();
                setMenuItems(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchMenuItems();
    }, []);

    const handleAddItem = (item) => {
        setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    };

    const handleRemoveItem = (itemId) => {
        setSelectedItems(selectedItems.filter(item => item.id !== itemId));
    };

    const calculateSubtotal = () => {
        return selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const total = subtotal - discount;
        return total > 0 ? total : 0;
    };

    const handleSave = () => {
        if (!tableNumber || !customerName) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        const subtotal = calculateSubtotal();
        const total = calculateTotal();
        onSave({ tableNumber, customerName, orderMode, items: selectedItems, subtotal, discount, total, paymentMethod });
        onClose();
    };

    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#2C2F33] p-8 rounded-lg shadow-lg w-full max-w-2xl h-3/4 overflow-y-auto">
                <h3 className="text-xl font-bold text-[#ffffff] mb-4">Nuevo Pedido</h3>
                <div className="mb-4">
                    <label className="text-[#E5E7EB]">Número de Mesa:</label>
                    <input
                        type="text"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full p-2 mt-2 mb-4 bg-[#3B3F45] text-[#ffffff] rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="text-[#E5E7EB]">Nombre del Cliente:</label>
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full p-2 mt-2 mb-4 bg-[#3B3F45] text-[#ffffff] rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="text-[#E5E7EB]">Tipo de Pedido:</label>
                    <select
                        value={orderMode}
                        onChange={(e) => setOrderMode(e.target.value)}
                        className="w-full p-2 mt-2 mb-4 bg-[#3B3F45] text-[#ffffff] rounded-lg"
                    >
                        <option value="dine-in">Mesa</option>
                        <option value="takeaway">Para Llevar</option>
                        <option value="delivery">Domicilio</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="text-[#E5E7EB]">Medio de Pago:</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full p-2 mt-2 mb-4 bg-[#3B3F45] text-[#ffffff] rounded-lg"
                    >
                        <option value="cash">Efectivo</option>
                        <option value="card">Tarjeta</option>
                        <option value="online">Online</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="text-[#E5E7EB]">Descuento:</label>
                    <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="w-full p-2 mt-2 mb-4 bg-[#3B3F45] text-[#ffffff] rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="text-[#E5E7EB]">Buscar Producto:</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 mt-2 mb-4 bg-[#3B3F45] text-[#ffffff] rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <h4 className="text-lg font-bold text-[#ffffff]">Productos Seleccionados</h4>
                    <ul className="text-[#E5E7EB] mb-4">
                        {selectedItems.map((item, index) => (
                            <li key={index}>
                                {item.name} - Cantidad: {item.quantity}
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="ml-2 px-2 py-1 bg-red-500 text-[#ffffff] rounded-lg hover:bg-red-700"
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mb-4">
                    <h4 className="text-lg font-bold text-[#ffffff]">Agregar Productos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paginatedItems.map(item => (
                            <div key={item.id} className="bg-[#3B3F45] p-4 rounded-lg shadow-md">
                                <h5 className="text-md font-bold text-[#ffffff]">{item.name}</h5>
                                <button
                                    onClick={() => handleAddItem(item)}
                                    className="mt-2 px-4 py-2 bg-green-500 text-[#ffffff] rounded-lg hover:bg-green-700"
                                >
                                    Añadir
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 mx-1 rounded ${currentPage === i + 1 ? 'bg-[#4F46E5] text-white' : 'bg-[#3B3F45] text-[#E5E7EB]'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <h4 className="text-lg font-bold text-[#ffffff]">Total: ${calculateTotal().toFixed(2)}</h4>
                </div>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-[#ffffff] rounded-lg hover:bg-blue-700"
                >
                    Guardar Pedido
                </button>
                <button
                    onClick={onClose}
                    className="ml-2 px-4 py-2 bg-red-500 text-[#ffffff] rounded-lg hover:bg-red-700"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
} 