import React from 'react';

function ProductTable({ products, deleteProduct, setEditingProduct }) {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2">Nombre</th>
          <th className="py-2">Descripción</th>
          <th className="py-2">Precio</th>
          <th className="py-2">Cantidad</th>
          <th className="py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id} className="text-center">
            <td className="border px-4 py-2">{product.nombre}</td>
            <td className="border px-4 py-2">{product.descripcion}</td>
            <td className="border px-4 py-2">{product.precio}</td>
            <td className="border px-4 py-2">{product.cantidad}</td>
            <td className="border px-4 py-2">
              <button
                onClick={() => setEditingProduct(product)}
                className="bg-yellow-500 text-white px-2 py-1 mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => deleteProduct(product.id)}
                className="bg-red-500 text-white px-2 py-1"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductTable; 