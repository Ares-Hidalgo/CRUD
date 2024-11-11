'use client'

export default function Employees({ onBackToMenu }) {
    return (
        <div className="flex flex-col w-full p-8 bg-[#2C2F33] rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-[#ffffff] mb-4">Gestión de Empleados</h2>
            <p className="text-sm font-light text-[#6B7280] mb-4">Aquí puedes gestionar la información de los empleados.</p>
            {/* Aquí puedes agregar más funcionalidades relacionadas con los empleados */}
            <button
                onClick={onBackToMenu}
                className="mt-4 px-4 py-2 bg-[#4F46E5] text-[#ffffff] rounded-lg hover:bg-[#3B3F45]"
            >
                Volver al Menú
            </button>
        </div>
    );
} 