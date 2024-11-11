'use client'

export default function WarningModal({ onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#2C2F33] p-8 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl font-bold text-[#ffffff] mb-4">Confirmar Eliminación</h3>
                <p className="text-[#E5E7EB] mb-4">¿Estás seguro de que deseas eliminar este pedido?</p>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-red-500 text-[#ffffff] rounded-lg hover:bg-red-700"
                >
                    Confirmar
                </button>
                <button
                    onClick={onCancel}
                    className="ml-2 px-4 py-2 bg-gray-500 text-[#ffffff] rounded-lg hover:bg-gray-700"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
} 