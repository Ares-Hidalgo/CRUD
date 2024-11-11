'use client'

import { useState, useEffect } from 'react';

export default function Menu({ onBackToMenu }) {
    const [menuItems, setMenuItems] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: '', available: true });
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [alertModal, setAlertModal] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/menu');
                if (!response.ok) {
                    throw new Error('Error al cargar el menú');
                }
                const data = await response.json();
                const formattedData = data.map(item => ({
                    ...item,
                    price: parseFloat(item.price)
                }));
                setMenuItems(formattedData);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchMenuItems();
    }, []);

    const addMenuItem = async () => {
        if (!newMenuItem.name || !newMenuItem.description || !newMenuItem.price) {
            setAlertModal(true);
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMenuItem)
            });

            if (!response.ok) {
                throw new Error('Error al agregar el producto al menú');
            }

            const data = await response.json();
            setMenuItems([...menuItems, { ...data, price: parseFloat(data.price) }]);
            setNewMenuItem({ name: '', description: '', price: '', available: true });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setConfirmDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/menu/${itemToDelete.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el producto del menú');
            }

            setMenuItems(menuItems.filter(item => item.id !== itemToDelete.id));
            setConfirmDeleteModal(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex flex-col w-full p-8 bg-[#2C2F33] rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-[#ffffff] mb-4">Gestión del Menú</h2>
            <p className="text-sm font-light text-[#6B7280] mb-4">Aquí puedes gestionar los productos del menú del restaurante.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                    type="text"
                    name="name"
                    value={newMenuItem.name}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                    placeholder="Nombre del Producto"
                    title="Ingrese el nombre del producto"
                    className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                />
                <input
                    type="text"
                    name="description"
                    value={newMenuItem.description}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                    placeholder="Descripción"
                    title="Ingrese una descripción del producto"
                    className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                />
                <input
                    type="number"
                    name="price"
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, price: parseFloat(e.target.value) || '' })}
                    placeholder="Precio"
                    title="Ingrese el precio del producto"
                    className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                />
                <button onClick={addMenuItem} className="col-span-1 md:col-span-2 px-4 py-2 bg-[#4F46E5] text-[#ffffff] rounded-lg hover:bg-[#3B3F45]">
                    Agregar Producto
                </button>
            </div>

            <table className="w-full text-left text-[#E5E7EB]">
                <thead>
                    <tr>
                        <th className="border-b border-[#4F46E5] p-2">Nombre</th>
                        <th className="border-b border-[#4F46E5] p-2">Precio</th>
                        <th className="border-b border-[#4F46E5] p-2">Disponible</th>
                        <th className="border-b border-[#4F46E5] p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {menuItems.map(item => (
                        <tr key={item.id}>
                            <td className="border-b border-[#4F46E5] p-2">{item.name}</td>
                            <td className="border-b border-[#4F46E5] p-2">
                                ${item.price.toFixed(2)}
                            </td>
                            <td className="border-b border-[#4F46E5] p-2">{item.available ? 'Sí' : 'No'}</td>
                            <td className="border-b border-[#4F46E5] p-2">
                                <button onClick={() => handleEditClick(item)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2">Editar</button>
                                <button onClick={() => handleDeleteClick(item)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-[#2C2F33] p-8 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-[#ffffff] mb-4">Editar Producto</h3>
                        <input
                            type="text"
                            name="name"
                            value={selectedItem.name}
                            onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                            placeholder="Nombre del Producto"
                            className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB] mb-2"
                        />
                        <input
                            type="text"
                            name="description"
                            value={selectedItem.description}
                            onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                            placeholder="Descripción"
                            className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB] mb-2"
                        />
                        <input
                            type="number"
                            name="price"
                            value={selectedItem.price}
                            onChange={(e) => setSelectedItem({ ...selectedItem, price: parseFloat(e.target.value) || '' })}
                            placeholder="Precio"
                            className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB] mb-2"
                        />
                        <button onClick={() => updateMenuItem(selectedItem)} className="px-4 py-2 bg-[#4F46E5] text-[#ffffff] rounded-lg hover:bg-[#3B3F45]">
                            Guardar Cambios
                        </button>
                        <button onClick={() => setShowModal(false)} className="ml-2 px-4 py-2 bg-red-500 text-[#ffffff] rounded-lg hover:bg-red-700">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {confirmDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-[#2C2F33] p-8 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-[#ffffff] mb-4">Confirmar Eliminación</h3>
                        <p className="text-[#E5E7EB] mb-4">¿Estás seguro de que deseas eliminar este producto?</p>
                        <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-[#ffffff] rounded-lg hover:bg-red-700">
                            Confirmar
                        </button>
                        <button onClick={() => setConfirmDeleteModal(false)} className="ml-2 px-4 py-2 bg-gray-500 text-[#ffffff] rounded-lg hover:bg-gray-700">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {alertModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-[#2C2F33] p-8 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-[#ffffff] mb-4">Error</h3>
                        <p className="text-[#E5E7EB] mb-4">Por favor, complete todos los campos antes de agregar un producto.</p>
                        <button onClick={() => setAlertModal(false)} className="px-4 py-2 bg-red-500 text-[#ffffff] rounded-lg hover:bg-red-700">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={onBackToMenu}
                className="mt-4 px-4 py-2 bg-[#4F46E5] text-[#ffffff] rounded-lg hover:bg-[#3B3F45]"
            >
                Volver al Menú
            </button>
        </div>
    );
} 