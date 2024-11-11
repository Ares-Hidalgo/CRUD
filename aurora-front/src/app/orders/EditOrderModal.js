'use client'

import { useState, useEffect } from 'react';

export default function EditOrderModal({ order, onClose, onSave }) {
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(order.items || []);
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

    const handleSave = () => {
        onSave(selectedItems);
        onClose();
    };

    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#2C2F33] p-8 rounded-lg shadow-lg w-full max-w-2xl h-3/4 overflow-y-auto">
                <h3 className="text-xl font-bold text-[#ffffff] mb-4">Editar Pedido</h3>
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
                    <label className="text-[#E5E7EB]">Buscar Producto:</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 mt-2 mb-4 bg-[#3B3F45] text-[#ffffff] rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <h4 className="text-lg font-bold text-[#ffffff]">Agregar Productos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paginatedItems.map(item => (
                            <div key={item.id} className="bg-[#3B3F45] p-4 rounded-lg shadow-md">
                                <h5 className="text-md font-bold text-[#ffffff]">{item.name}</h5>
                                <button
                                    onClick={() => handleAddItem(item)}
                                    className="mt-2 px-4 py-2 bg-[#4F46E5] text-[#ffffff] rounded-lg hover:bg-[#3B3F45]"
                                >
                                    Agregar
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
                <button
                    onClick={handleSave}
                    className="mt-4 px-4 py-2 bg-[#4F46E5] text-[#ffffff] rounded-lg hover:bg-[#3B3F45]"
                >
                    Guardar Cambios
                </button>
                <button
                    onClick={onClose}
                    className="ml-2 px-4 py-2 bg-gray-500 text-[#ffffff] rounded-lg hover:bg-gray-700"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
} 