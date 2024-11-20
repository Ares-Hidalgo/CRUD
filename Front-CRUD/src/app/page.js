'use client'

import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import Modal from 'react-modal';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    Modal.setAppElement(document.body);

    fetch('http://localhost:3001/api/productos')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page on new search
  }, [searchTerm, products]);

  const addProduct = (product) => {
    fetch('http://localhost:3001/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => { throw new Error(error.error); });
        }
        return response.json();
      })
      .then(newProduct => {
        setProducts([...products, newProduct]);
        setFilteredProducts([...filteredProducts, newProduct]);
        setIsAddModalOpen(false);
        setErrorMessage('');
      })
      .catch(error => {
        console.error('Error adding product:', error);
        setErrorMessage(error.message);
      });
  };

  const updateProduct = (id, updatedProduct) => {
    fetch(`http://localhost:3001/api/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    })
      .then(() => {
        const updatedProducts = products.map(product =>
          product.id === id ? updatedProduct : product
        );
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        setEditingProduct(null);
        setIsEditModalOpen(false);
      })
      .catch(error => console.error('Error updating product:', error));
  };

  const deleteProduct = (id) => {
    fetch(`http://localhost:3001/api/productos/${id}`, { method: 'DELETE' })
      .then(() => {
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        setIsDeleteModalOpen(false);
      })
      .catch(error => console.error('Error deleting product:', error));
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRUD de Productos</h1>
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="bg-green-500 text-white p-2 rounded-full mb-4"
      >
        <FaPlus />
      </button>
      <h2 className="text-lg font-bold mb-2">Buscar por nombre</h2>
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border"
      />
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">ID</th>
            <th className="py-2">Nombre</th>
            <th className="py-2">Descripción</th>
            <th className="py-2">Precio</th>
            <th className="py-2">Cantidad</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(product => (
            <tr key={product.id} className="text-center">
              <td className="border px-4 py-2">{product.id}</td>
              <td className="border px-4 py-2">{product.nombre}</td>
              <td className="border px-4 py-2">{product.descripcion}</td>
              <td className="border px-4 py-2">{product.precio}</td>
              <td className="border px-4 py-2">{product.cantidad}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => openEditModal(product)}
                  className="text-yellow-500 px-2 py-1 mr-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => openDeleteModal(product)}
                  className="text-red-500 px-2 py-1"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-3 py-1 mx-1 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal de Agregar Producto */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        contentLabel="Agregar Producto"
        className="bg-white p-4 rounded shadow-lg max-w-md mx-auto mt-20"
      >
        <h2 className="text-xl font-bold mb-4">Agregar Producto</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <ProductForm
          addProduct={addProduct}
          updateProduct={updateProduct}
          editingProduct={null}
          setEditingProduct={setEditingProduct}
        />
        <button onClick={() => setIsAddModalOpen(false)} className="mt-4 bg-gray-500 text-white px-4 py-2">
          Cerrar
        </button>
      </Modal>

      {/* Modal de Edición */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Producto"
        className="bg-white p-4 rounded shadow-lg max-w-md mx-auto mt-20"
      >
        <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
        <ProductForm
          addProduct={addProduct}
          updateProduct={updateProduct}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
        />
        <button onClick={() => setIsEditModalOpen(false)} className="mt-4 bg-gray-500 text-white px-4 py-2">
          Cerrar
        </button>
      </Modal>

      {/* Modal de Eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Eliminar Producto"
        className="bg-white p-4 rounded shadow-lg max-w-md mx-auto mt-20"
      >
        <h2 className="text-xl font-bold mb-4">¿Estás seguro de que deseas eliminar este producto?</h2>
        <p>{productToDelete?.nombre}</p>
        <div className="flex justify-end mt-4">
          <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 mr-2">
            Cancelar
          </button>
          <button onClick={() => deleteProduct(productToDelete.id)} className="bg-red-500 text-white px-4 py-2">
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default App; 