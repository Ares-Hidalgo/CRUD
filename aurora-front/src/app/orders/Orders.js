'use client'

import { useState, useEffect } from 'react';

export default function Orders({ onBackToMenu }) {
    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({
        customerName: '', contact: '', deliveryAddress: '', tableNumber: '', orderMode: 'dine-in', subtotal: '', tip: '', taxes: '', discount: '', total: '', paymentMethod: 'cash', paymentStatus: 'pending', items: []
    });
    const [menuItems, setMenuItems] = useState([]);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [alertModal, setAlertModal] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/orders');
                if (!response.ok) {
                    throw new Error('Error al cargar los pedidos');
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

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

        fetchOrders();
        fetchMenuItems();
    }, []);

    useEffect(() => {
        const calculateTotals = () => {
            const subtotal = newOrder.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            const discount = newOrder.discount || 0;
            const taxes = subtotal * 0.1; // Suponiendo un 10% de impuestos
            const total = subtotal - discount + taxes;

            setNewOrder(prevOrder => ({
                ...prevOrder,
                subtotal,
                taxes: isNaN(taxes) ? 0 : taxes,
                total: isNaN(total) ? 0 : total
            }));
        };

        calculateTotals();
    }, [newOrder.items, newOrder.discount]);

    const addOrder = async () => {
        if (!newOrder.customerName || (newOrder.orderMode === 'dine-in' && !newOrder.tableNumber) || (newOrder.orderMode === 'delivery' && (!newOrder.deliveryAddress || !newOrder.contact))) {
            setAlertModal(true);
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            });

            if (!response.ok) {
                throw new Error('Error al agregar el pedido');
            }

            const data = await response.json();
            setOrders([...orders, data]);
            setNewOrder({
                customerName: '', contact: '', deliveryAddress: '', tableNumber: '', orderMode: 'dine-in', subtotal: '', tip: '', taxes: '', discount: '', total: '', paymentMethod: 'cash', paymentStatus: 'pending', items: []
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleMenuItemSelect = (item) => {
        setNewOrder(prevOrder => ({
            ...prevOrder,
            items: [...prevOrder.items, { ...item, quantity: 1 }]
        }));
        setShowMenuModal(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#ffffff] mb-4">Nuevo Pedido</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-[#E5E7EB]">Nombre del Cliente</label>
                <input
                    type="text"
                    name="customerName"
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                    placeholder="Nombre del Cliente"
                    title="Ingrese el nombre del cliente"
                    className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                />
                <label className="text-[#E5E7EB]">Modo de Pedido</label>
                <select
                    name="orderMode"
                    value={newOrder.orderMode}
                    onChange={(e) => setNewOrder({ ...newOrder, orderMode: e.target.value })}
                    title="Seleccione el modo de pedido"
                    className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                >
                    <option value="dine-in">Mesa</option>
                    <option value="delivery">Domicilio</option>
                    <option value="other">Otro</option>
                </select>

                {newOrder.orderMode === 'dine-in' && (
                    <>
                        <label className="text-[#E5E7EB]">Número de Mesa</label>
                        <input
                            type="number"
                            name="tableNumber"
                            value={newOrder.tableNumber}
                            onChange={(e) => setNewOrder({ ...newOrder, tableNumber: e.target.value })}
                            placeholder="Número de Mesa"
                            title="Ingrese el número de mesa"
                            className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                        />
                    </>
                )}

                {newOrder.orderMode === 'delivery' && (
                    <>
                        <label className="text-[#E5E7EB]">Dirección de Entrega</label>
                        <input
                            type="text"
                            name="deliveryAddress"
                            value={newOrder.deliveryAddress}
                            onChange={(e) => setNewOrder({ ...newOrder, deliveryAddress: e.target.value })}
                            placeholder="Dirección de Entrega"
                            title="Ingrese la dirección de entrega"
                            className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                        />
                        <label className="text-[#E5E7EB]">Contacto</label>
                        <input
                            type="text"
                            name="contact"
                            value={newOrder.contact}
                            onChange={(e) => setNewOrder({ ...newOrder, contact: e.target.value })}
                            placeholder="Contacto"
                            title="Ingrese el contacto del cliente"
                            className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                        />
                    </>
                )}

                <label className="text-[#E5E7EB]">Descuento</label>
                <input
                    type="number"
                    name="discount"
                    value={newOrder.discount}
                    onChange={(e) => setNewOrder({ ...newOrder, discount: parseFloat(e.target.value) || 0 })}
                    placeholder="Descuento"
                    title="Ingrese el descuento aplicado"
                    className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                />

                <button
                    onClick={() => setShowMenuModal(true)}
                    className="col-span-1 md:col-span-2 px-4 py-2 bg-[#4F46E5] text-[#ffffff] rounded-lg hover:bg-[#3B3F45]"
                >
                    Seleccionar Productos
                </button>

                <input
                    type="number"
                    name="total"
                    value={newOrder.total}
                    readOnly
                    className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                />

                <button onClick={addOrder} className="col-span-1 md:col-span-2 px-4 py-2 bg-[#4F46E5] text-[#ffffff] rounded-lg hover:bg-[#3B3F45]">
                    Agregar Pedido
                </button>
            </div>

            {showMenuModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-[#2C2F33] p-8 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-[#ffffff] mb-4">Seleccionar Productos</h3>
                        <ul>
                            {menuItems.map(item => (
                                <li key={item.id} className="mb-2">
                                    <button
                                        onClick={() => handleMenuItemSelect(item)}
                                        className="text-[#4F46E5] hover:underline"
                                    >
                                        {item.name} - ${item.price.toFixed(2)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setShowMenuModal(false)}
                            className="mt-4 px-4 py-2 bg-[#4F46E5] text-[#ffffff] rounded-lg hover:bg-[#3B3F45]"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {alertModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-[#2C2F33] p-8 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-[#ffffff] mb-4">Error</h3>
                        <p className="text-[#E5E7EB] mb-4">Por favor, complete todos los campos requeridos antes de agregar un pedido.</p>
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