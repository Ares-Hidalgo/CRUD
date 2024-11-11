'use client'

import { useState, useEffect } from 'react';

export default function Inventory({ onBackToMenu }) {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', quantity: 0, unit: '', alertLevel: 0 });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/products');
                if (!response.ok) {
                    throw new Error('Error al cargar los productos');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        fetchProducts();
    }, []);

    const addProduct = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });
    
            if (!response.ok) {
                throw new Error('Error al agregar el producto');
            }
    
            const data = await response.json();
            setProducts([...products, data]);
            setNewProduct({ name: '', quantity: 0, unit: '', alertLevel: 0 });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const deleteProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/products/${id}`, {
                method: 'DELETE'
            });
    
            if (!response.ok) {
                throw new Error('Error al eliminar el producto');
            }
    
            setProducts(products.filter(product => product.id !== id));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex flex-col w-full p-8 bg-[#2C2F33] rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-[#ffffff] mb-4">Gestión de Inventario</h2>
            <p className="text-sm font-light text-[#6B7280] mb-4">Aquí puedes gestionar los productos en inventario.</p>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <label className="text-[#E5E7EB]">Nombre del producto</label>
                <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Nombre del producto"
                    className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                />
                <label className="text-[#E5E7EB]">Cantidad</label>
                <input
                    type="number"
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    placeholder="Cantidad"
                    className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                />
                <label className="text-[#E5E7EB]">Unidad (ej. kg, litros)</label>
                <input
                    type="text"
                    name="unit"
                    value={newProduct.unit}
                    onChange={handleInputChange}
                    placeholder="Unidad (ej. kg, litros)"
                    className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                />
                <label className="text-[#E5E7EB]">Nivel de alerta</label>
                <input
                    type="number"
                    name="alertLevel"
                    value={newProduct.alertLevel}
                    onChange={handleInputChange}
                    placeholder="Nivel de alerta"
                    className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                />
                <button onClick={addProduct} className="col-span-1 md:col-span-4 px-4 py-2 bg-[#4F46E5] text-[#ffffff] rounded-lg hover:bg-[#3B3F45]">
                    Agregar Producto
                </button>
            </div>

            <table className="w-full text-left text-[#E5E7EB]">
                <thead>
                    <tr>
                        <th className="border-b border-[#4F46E5] p-2">Nombre</th>
                        <th className="border-b border-[#4F46E5] p-2">Cantidad</th>
                        <th className="border-b border-[#4F46E5] p-2">Unidad</th>
                        <th className="border-b border-[#4F46E5] p-2">Nivel de Alerta</th>
                        <th className="border-b border-[#4F46E5] p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td className="border-b border-[#4F46E5] p-2">{product.name}</td>
                            <td className="border-b border-[#4F46E5] p-2">{product.quantity}</td>
                            <td className="border-b border-[#4F46E5] p-2">{product.unit}</td>
                            <td className="border-b border-[#4F46E5] p-2">{product.alertLevel}</td>
                            <td className="border-b border-[#4F46E5] p-2">
                                <button onClick={() => deleteProduct(product.id)} className="text-red-500">Eliminar</button>
                            </td>
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