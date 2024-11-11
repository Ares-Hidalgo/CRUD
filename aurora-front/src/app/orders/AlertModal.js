'use client'

export default function AlertModal({ message, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#2C2F33] p-8 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl font-bold text-[#ffffff] mb-4">Notificación</h3>
                <p className="text-[#E5E7EB] mb-4">{message}</p>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-500 text-[#ffffff] rounded-lg hover:bg-blue-700"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
} 