import React, { useState, useEffect } from 'react';

function ProductForm({ addProduct, updateProduct, editingProduct, setEditingProduct }) {
  const [product, setProduct] = useState({ nombre: '', descripcion: '', precio: '', cantidad: '' });

  useEffect(() => {
    if (editingProduct) {
      setProduct(editingProduct);
    } else {
      setProduct({ nombre: '', descripcion: '', precio: '', cantidad: '' });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, product);
    } else {
      addProduct(product);
    }
    setProduct({ nombre: '', descripcion: '', precio: '', cantidad: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="nombre"
          value={product.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="border p-2"
          required
        />
        <input
          type="text"
          name="descripcion"
          value={product.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="border p-2"
        />
        <input
          type="number"
          name="precio"
          value={product.precio}
          onChange={handleChange}
          placeholder="Precio"
          className="border p-2"
          required
        />
        <input
          type="number"
          name="cantidad"
          value={product.cantidad}
          onChange={handleChange}
          placeholder="Cantidad"
          className="border p-2"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
        {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
      </button>
    </form>
  );
}

export default ProductForm; 