'use client'

import { useState, useEffect } from 'react';

export default function Inventory({ onBackToMenu }) {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', quantity: 0, unit: '', alertLevel: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="flex flex-col w-full p-8 bg-[#2C2F33] rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-[#ffffff] mb-4">Gestión de Inventario</h2>
            <p className="text-sm font-light text-[#6B7280] mb-4">Aquí puedes gestionar los productos en inventario.</p>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Nombre del producto"
                    className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                />
                <input
                    type="number"
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    placeholder="Cantidad"
                    className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                />
                <input
                    type="text"
                    name="unit"
                    value={newProduct.unit}
                    onChange={handleInputChange}
                    placeholder="Unidad (ej. kg, litros)"
                    className="p-2 rounded bg-[#3B3F45] text-[#E5E7EB]"
                />
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

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar producto..."
                className="mb-4 p-2 rounded bg-[#3B3F45] text-[#E5E7EB] w-full"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedProducts.map(product => (
                    <div key={product.id} className="bg-[#3B3F45] p-4 rounded-lg shadow-md">
                        <h4 className="text-lg font-bold text-[#ffffff]">{product.name}</h4>
                        <p className="text-[#E5E7EB]">Cantidad: {product.quantity} {product.unit}</p>
                        <p className="text-[#E5E7EB]">Nivel de Alerta: {product.alertLevel}</p>
                        <div className="flex justify-end mt-2">
                            <button onClick={() => deleteProduct(product.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 mx-1 rounded ${currentPage === i + 1 ? 'bg-[#4F46E5] text-white' : 'bg-[#3B3F45] text-[#E5E7EB]'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <button
                onClick={onBackToMenu}
                className="mt-4 px-4 py-2 bg-[#4F46E5] text-[#ffffff] rounded-lg hover:bg-[#3B3F45]"
            >
                Volver al Menú
            </button>
        </div>
    );
} 